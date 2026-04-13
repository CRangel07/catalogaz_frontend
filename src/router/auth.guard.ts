// router/guards/auth.guard.ts

import type { RouteLocation, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import type { Role } from './types';

let isCheckingSession = false;

export async function authGuard(
  to: RouteLocationNormalized
): Promise<boolean | Partial<RouteLocation>> {
  const auth = useAuthStore();

  const requiresAuth = Boolean(to.meta.requiresAuth);
  const allowedRoles = to.meta.roles as Role[] | undefined;

  try {
    // 🔁 Check sesión solo una vez
    if (!auth.user && !isCheckingSession) {
      isCheckingSession = true;
      await auth.checkSession();
      isCheckingSession = false;
    }

    // ─── 1. Ruta pública ─────────────────────────
    if (!requiresAuth) {
      return true; // ✅ NO redirigir
    }

    // ─── 2. No autenticado ───────────────────────
    if (!auth.isAuthenticated) {
      // ⚠️ evitar loop si ya estás en login
      if (to.name === 'catalogAz_customer-login') return true;

      return {
        name: 'catalogAz_customer-login',
        query: { redirect: to.fullPath },
      };
    }

    // ─── 3. Validar roles ────────────────────────
    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = auth.user?.role;

      if (!allowedRoles.includes(userRole!)) {
        if (to.name === 'catalogaz_unauthorized') return true;

        return { name: 'catalogaz_unauthorized' };
      }
    }

    // ─── 4. Todo OK ──────────────────────────────
    return true;
  } catch (error) {
    console.error('Auth Guard Error:', error);

    if (to.name === 'catalogAz_customer-login') return true;

    return {
      name: 'catalogAz_customer-login',
      query: { redirect: to.fullPath },
    };
  }
}
