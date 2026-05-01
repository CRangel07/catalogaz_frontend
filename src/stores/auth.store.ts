// stores/auth.store.ts

import { authService } from '@/services/auth.service';
import type { User } from '@/types/auth.types';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// ─── Tipos de autenticación ────────────────────────────────────────────────

type AuthType = 'otp' | 'admin' | null;

type PayloadAdmin = { type: 'admin'; username: string; password: string };
type PayloadCustomer = { type: 'otp'; phone: string; code: string };

type LoginPayload = PayloadAdmin | PayloadCustomer;

// ─── Store ─────────────────────────────────────────────────────────────────

export const useAuthStore = defineStore('catalog_auth_store', () => {
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const authType = ref<AuthType>(null);

  // ─── Getters ─────────────────────────────────────────────────────────────

  const isAuthenticated = computed(() => user.value !== null);

  const isAdmin = computed(() => user.value?.role === 'admin');
  const isCajero = computed(() => user.value?.role === 'caja');
  const isPedidos = computed(() => user.value?.role === 'pedidos');

  const userInitials = computed(() => {
    if (user.value?.role == 'admin' && !user.value.username) return '';
    if (user.value?.role == 'customer' && !user.value.name) return '';

    const name =
      user.value?.role != 'customer' ? (user.value?.username ?? '') : (user.value?.name ?? '');

    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  });

  // ─── Actions ─────────────────────────────────────────────────────────────

  /**
   * LOGIN UNIFICADO (ESCALABLE)
   */
  async function login(payload: LoginPayload): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      if (payload.type === 'admin') {
        await authService.loginAdmin({
          username: payload.username,
          password: payload.password,
        });

        authType.value = 'admin';
      }

      if (payload.type === 'otp') {
        await authService.verifyOtp(payload.phone, payload.code);
        authType.value = 'otp';
      }

      const currentUser = await authService.getMe();
      user.value = currentUser;
    } catch (err) {
      error.value = getErrorMessage(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Solicitar OTP (flujo cliente)
   */
  async function requestOtp(phone: string): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      await authService.requestOtp(phone);
    } catch (err) {
      error.value = getErrorMessage(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Verificar sesión (persistencia con cookies)
   */
  async function checkSession(): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      const currentUser = await authService.getMe();
      user.value = currentUser;

      // Opcional: inferir tipo si backend no lo manda
      authType.value = currentUser.role === 'admin' ? 'admin' : 'otp';
    } catch {
      user.value = null;
      authType.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Logout
   */
  async function logout(): Promise<void> {
    isLoading.value = true;

    try {
      await authService.logout();
    } finally {
      user.value = null;
      authType.value = null;
      isLoading.value = false;
    }
  }

  /**
   * Reset error
   */
  function clearError(): void {
    error.value = null;
  }

  // ─── Helper privado ──────────────────────────────────────────────────────

  function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (typeof err === 'string') return err;
    return 'Ocurrió un error inesperado';
  }

  // ─── Exposición ──────────────────────────────────────────────────────────

  return {
    // State
    user: computed(() => user.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    authType: computed(() => authType.value),

    // Getters
    isAdmin,
    isCajero,
    isPedidos,
    userInitials,
    isAuthenticated,

    // Actions
    login,
    requestOtp,
    checkSession,
    logout,
    clearError,
  };
});
