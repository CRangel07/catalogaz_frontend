// stores/auth.store.ts

import { authService } from '@/services/auth.service';
import type { User } from '@/types/auth.types';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // ─── Getters (computed) ───────────────────────────────────────────────────

  const isAuthenticated = computed(() => user.value !== null);

  const isAdmin = computed(() => user.value?.role === 'ADMIN');

  const userInitials = computed(() => {
    if (!user.value?.name) return '';
    return user.value.name
      .split(' ')
      .map((n: unknown) => String(n)[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  });

  // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * Solicita el envío de un OTP vía WhatsApp.
   * El backend genera el código, lo guarda en BD con expiración y lo envía.
   */
  async function requestOtp(phone: string): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      await authService.requestOtp(phone);
    } catch (err) {
      error.value = getErrorMessage(err);
      throw err; // Re-lanzamos para que el componente pueda manejarlo también
    } finally {
      // `finally` garantiza que isLoading se resetea siempre,
      // incluso si hay error. Patrón importante en async/await.
      isLoading.value = false;
    }
  }

  /**
   * Verifica el OTP. Si es válido, el backend responde con Set-Cookie
   * que el navegador guarda automáticamente (HttpOnly, no accesible desde JS).
   *
   * Luego llamamos /auth/me para obtener los datos del usuario y poblar el store.
   */
  async function verifyOtp(phone: string, code: string): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      // El backend setea la cookie aquí. Nosotros solo recibimos los datos del usuario.
      const loggedUser = await authService.verifyOtp(phone, code);
      user.value = loggedUser;
    } catch (err) {
      error.value = getErrorMessage(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Verifica si hay una sesión activa al cargar la app.
   *
   * ¿Por qué necesitamos esto?
   * Porque el token está en una cookie que JS no puede leer. Al refrescar la
   * página perdemos el estado del store (la memoria de JS se limpia), pero la
   * cookie sigue ahí. Este endpoint le dice al servidor "¿esta cookie sigue
   * siendo válida?" y nos devuelve los datos del usuario si lo es.
   *
   * Llama a esto en el App.vue o en el router (navigation guard).
   */
  async function checkSession(): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      const currentUser = await authService.getMe();
      user.value = currentUser;
    } catch {
      // Si falla (401 Unauthorized), simplemente no hay sesión activa.
      // No es un error que mostrar al usuario.
      user.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Cierra sesión. El backend invalida la cookie (la borra o la marca como
   * expirada). El store se limpia en el frontend.
   */
  async function logout(): Promise<void> {
    isLoading.value = true;

    try {
      await authService.logout();
    } finally {
      // Limpiamos el store aunque falle la petición al servidor
      user.value = null;
      isLoading.value = false;
    }
  }

  /**
   * Limpia errores manualmente (útil para resetear el estado de un formulario).
   */
  function clearError(): void {
    error.value = null;
  }

  // ─── Helper privado ───────────────────────────────────────────────────────
  //
  // Tip: TypeScript no sabe el tipo de `err` en un catch por defecto.
  // Esta función extrae el mensaje de forma segura.
  function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (typeof err === 'string') return err;
    return 'Ocurrió un error inesperado';
  }

  return {
    user: computed(() => user.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),

    // Getters
    isAuthenticated,
    isAdmin,
    userInitials,

    // Actions
    requestOtp,
    verifyOtp,
    checkSession,
    logout,
    clearError,
  };
});
