// lib/http.ts

import router from '@/router';
import { useAuthStore } from '@/stores/auth.store';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown | FormData;
}

// ─── Tipos de error ───────────────────────────────────────────────────────
//
// Tip: Crear una clase de error custom te permite hacer `instanceof HttpError`
// en los componentes para distinguir errores de red de errores de negocio.
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'HttpError';
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }
}

// ─── Flag para evitar múltiples redirecciones al login ────────────────────
let isRedirectingToLogin = false;

export const http = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { method = 'GET', body } = options;

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

  // ─── Manejo de sesión expirada ─────────────────────────────────────────
  //
  // Cuando el servidor responde 401, la sesión expiró o la cookie es inválida.
  // Limpiamos el store y redirigimos al login automáticamente.
  if (response.status === 401 && !isRedirectingToLogin) {
    isRedirectingToLogin = true;

    const authStore = useAuthStore();
    authStore.$patch({ user: null });

    if (router.currentRoute.value.name !== 'login') {
      await router.push({ name: 'login' });
    }

    // Reseteamos el flag después de la navegación
    setTimeout(() => {
      isRedirectingToLogin = false;
    }, 1000);
  }

  // ─── Manejo de errores HTTP ────────────────────────────────────────────
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);

    const message =
      errorBody?.message ?? errorBody?.error ?? `Error ${response.status}: ${response.statusText}`;

    throw new HttpError(response.status, message);
  }

  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
};

// wrappers del http principal.

http.get = <T>(path: string): Promise<T> => http<T>(path, { method: 'GET' });

http.post = <T>(path: string, body?: unknown): Promise<T> =>
  http<T>(path, { method: 'POST', body });

http.put = <T>(path: string, body?: unknown): Promise<T> => http<T>(path, { method: 'PUT', body });

http.patch = <T>(path: string, body?: unknown): Promise<T> =>
  http<T>(path, { method: 'PATCH', body });

http.delete = <T>(path: string): Promise<T> => http<T>(path, { method: 'DELETE' });

// Upload es un caso especial porque usa FormData
http.upload = <T>(
  path: string,
  formData: FormData,
  method: 'POST' | 'PUT' | 'PATCH' = 'POST'
): Promise<T> => http<T>(path, { method, body: formData });
