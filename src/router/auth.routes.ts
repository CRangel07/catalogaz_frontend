import type { RouteRecordRaw } from 'vue-router';

import { RouteNames } from './route.names';

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    children: [
      {
        path: 'admin',
        name: RouteNames.Auth.ADMIN_LOGIN,
        component: () => import('@/views/auth/AdminLoginView.vue'),
        meta: { requiresGuest: true },
      },
      {
        path: 'cliente',
        name: RouteNames.Auth.CUSTOMER_LOGIN,
        component: () => import('@/views/auth/CustomerLoginView.vue'),
        meta: { requiresGuest: true },
      },
      {
        path: '',
        redirect: { name: RouteNames.Auth.CUSTOMER_LOGIN },
      },
    ],
  },
];
