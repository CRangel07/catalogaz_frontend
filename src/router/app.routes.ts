import type { RouteRecordRaw } from 'vue-router';

import { RouteNames } from './route.names';
import { authRoutes } from './auth.routes';
import { adminChildren } from './admin.routes';
import { customerRoutes } from './customer.routes';
import { AdminCustomerPermission } from './types';

import AdminLayout from '@/layouts/AdminLayout.vue';
import CatalogLayout from '@/layouts/CatalogLayout.vue';
import ProductCatalog from '@/components/products/ProductCatalog.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: CatalogLayout,
    children: [
      {
        path: 'products',
        name: RouteNames.Catalog.PRODUCTS,
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
    name: RouteNames.UNAUTHORIZED,
    component: () => import('@/views/NotAuthorized.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: RouteNames.NOT_FOUND,
    component: () => import('@/views/NotFoundView.vue'),
  },
];
