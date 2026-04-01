import type { RouteRecordRaw } from 'vue-router';

import { adminChildren } from './admin.routes';
import { authRoutes } from './auth.routes';

import AdminLayout from '@/layouts/AdminLayout.vue';
import CatalogLayout from '@/layouts/CatalogLayout.vue';

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: { name: 'catalogAz_catalog' } },
  { path: '/catalog', name: 'catalogAz_catalog', component: CatalogLayout },
  {
    path: '/dashboard',
    component: AdminLayout,
    children: [...adminChildren],
  },
  ...authRoutes,
];
