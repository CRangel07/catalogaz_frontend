import type { RouteRecordRaw } from 'vue-router';

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    children: [
      {
        path: 'admin',
        name: 'catalogAz_admin-login',
        component: () => import('@/views/auth/AdminLoginView.vue'),
        meta: { requiresGuest: true },
      },
      {
        path: 'cliente',
        name: 'catalogAz_customer-login',
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
