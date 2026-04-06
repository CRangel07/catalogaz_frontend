import type { RouteRecordRaw } from 'vue-router';

import { adminChildren } from './admin.routes';
import { authRoutes } from './auth.routes';

import AdminLayout from '@/layouts/AdminLayout.vue';
import CatalogLayout from '@/layouts/CatalogLayout.vue';
import NotFoundView from '@/views/NotFoundView.vue';

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: { name: 'catalogAz_catalog' } },
  { path: '/catalog', name: 'catalogAz_catalog', component: CatalogLayout },
  {
    path: '/dashboard',
    component: AdminLayout,
    children: [...adminChildren],
  },
  ...authRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'catalogAz_not_found',
    component: () => import('@/views/NotFoundView.vue'),
  },
];
