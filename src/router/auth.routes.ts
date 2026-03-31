import type { RouteRecordRaw } from 'vue-router';

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    children: [
      {
        path: 'admin',
        name: 'admin-login',
        component: () => import('@/views/auth/AdminLoginView.vue'),
        meta: { requiresGuest: true },
      },
      {
        path: 'cliente',
        name: 'customer-login',
        component: () => import('@/views/auth/CustomerLoginView.vue'),
        meta: { requiresGuest: true },
      },
      {
        // Redirección de /auth → /auth/cliente por defecto
        path: '',
        redirect: { name: 'customer-login' },
      },
    ],
  },
];
