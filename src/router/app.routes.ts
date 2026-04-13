import type { RouteRecordRaw } from 'vue-router';

import { adminChildren } from './admin.routes';
import { authRoutes } from './auth.routes';

import AdminLayout from '@/layouts/AdminLayout.vue';
import CatalogLayout from '@/layouts/CatalogLayout.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import { customerRoutes } from './customer.routes';
import ProductCatalog from '@/components/products/ProductCatalog.vue';
import { AdminCustomerPermission } from './types';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: 'catalogaz_catalog_list' },
    meta: {
      requiresAuth: true,
      roles: AdminCustomerPermission,
    },
  },
  {
    path: '/catalog',
    component: CatalogLayout,
    children: [
      {
        path: '/products',
        name: 'catalogaz_catalog_list',
        component: ProductCatalog,
        meta: {
          requiresAuth: true,
          roles: AdminCustomerPermission,
        },
      },
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
    path: '/not-allowed',
    name: 'catalogaz_unauthorized',
    component: () => import('@/views/NotAuthorized.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'catalogAz_not_found',
    component: () => import('@/views/NotFoundView.vue'),
  },
];
