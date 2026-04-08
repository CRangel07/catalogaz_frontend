import type { RouteRecordRaw } from 'vue-router';

import { adminChildren } from './admin.routes';
import { authRoutes } from './auth.routes';

import AdminLayout from '@/layouts/AdminLayout.vue';
import CatalogLayout from '@/layouts/CatalogLayout.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import { customerRoutes } from './customer.routes';
import ProductCatalog from '@/components/products/ProductCatalog.vue';

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: { name: 'catalogaz_catalog_list' } },
  {
    path: '/catalog',
    component: CatalogLayout,
    children: [
      { path: '/products', name: 'catalogaz_catalog_list', component: ProductCatalog },
      ...customerRoutes,
    ],
  },
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
