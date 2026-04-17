import type { NavigationGuard } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import type { Role } from './types';

let isCheckingSession = false;

export const authGuard: NavigationGuard = async (to) => {
  const auth = useAuthStore();

  const requiresAuth = Boolean(to.meta.requiresAuth);
  const allowedRoles = to.meta.roles as Role[] | undefined;

  try {
    if (!auth.user && !isCheckingSession) {
      isCheckingSession = true;
      await auth.checkSession();
      isCheckingSession = false;
    }

    if (!requiresAuth) {
      return true;
    }

    if (!auth.isAuthenticated) {
      if (to.name === 'catalogAz_customer-login') return true;

      return {
        name: 'catalogAz_customer-login',
        query: { redirect: to.fullPath },
      };
    }

    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = auth.user?.role;

      if (!allowedRoles.includes(userRole!)) {
        if (to.name === 'catalogaz_unauthorized') return true;

        return { name: 'catalogaz_unauthorized' };
      }
    }

    return true;
  } catch (error) {
    console.error('Auth Guard Error:', error);

    if (to.name === 'catalogAz_customer-login') return true;

    return {
      name: 'catalogAz_customer-login',
      query: { redirect: to.fullPath },
    };
  }
};
