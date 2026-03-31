import type { RouteRecordRaw } from 'vue-router';

import { adminChildren } from './admin.routes';

import AdminLayout from '@/layouts/AdminLayout.vue';
import CatalogLayout from '@/layouts/CatalogLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { authRoutes } from './auth.routes';

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: { name: 'catalogAz_catalog' } },
  { path: '/login', name: 'catalogAz_login', component: AuthLayout },
  { path: '/catalog', name: 'catalogAz_catalog', component: CatalogLayout },
  {
    path: '/dashboard',
    component: AdminLayout,
    children: [...adminChildren],
  },
  ...authRoutes,
];
