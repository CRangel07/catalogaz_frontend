import type { Role } from './types';
import type { NavigationGuard } from 'vue-router';

import { RouteNames } from './route.names';
import { useAuthStore } from '@/stores/auth.store';

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

    if (!requiresAuth) return true;

    if (!auth.isAuthenticated) {
      if (to.name === RouteNames.Auth.CUSTOMER_LOGIN) return true;

      return {
        name: RouteNames.Auth.CUSTOMER_LOGIN,
        query: { redirect: to.fullPath },
      };
    }

    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = auth.user?.role;

      if (!allowedRoles.includes(userRole!)) {
        if (to.name === RouteNames.UNAUTHORIZED) return true;

        return { name: RouteNames.UNAUTHORIZED };
      }
    }

    return true;
  } catch (error) {
    console.error('Auth Guard Error:', error);

    if (to.name === RouteNames.Auth.CUSTOMER_LOGIN) return true;

    return {
      name: RouteNames.Auth.CUSTOMER_LOGIN,
      query: { redirect: to.fullPath },
    };
  }
};
