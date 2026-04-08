const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const getToken = (): string | null => {
  // return localStorage.getItem('token');
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjYsInJvbGUiOiJjdXN0b21lciIsInBob25lIjoiNDQzMjQyMDAwMyIsImlhdCI6MTc3NTY4MjAxMCwiZXhwIjoxNzc1NzY4NDEwfQ.4LW0RctRk7rD9-y7UtFMqkPELpWjdc_eawP6pDrTXUg';
};

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown | FormData;
  auth?: boolean;
}

export const http = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { method = 'GET', body, auth = true } = options;

  const headers: Record<string, string> = {};

  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  // Si el body es FormData NO ponemos Content-Type,
  // el browser lo pone automáticamente con el boundary correcto
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message ?? `HTTP ${response.status}`);
  }

  // 204 No Content no tiene body
  if (response.status === 204) return undefined as T;

  return response.json();
};
