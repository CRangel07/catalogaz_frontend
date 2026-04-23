import ClientView from '@/views/admin/ClientView.vue';
import ProductList from '@/components/products/ProductList.vue';
import SettingsApp from '@/components/SettingsApp.vue';
import DashboardView from '@/views/admin/DashboardView.vue';
import OrdersAdminView from '@/views/orders/OrdersAdminView.vue';

import type { RouteRecordRaw } from 'vue-router';

import { RouteNames } from './route.names';
import { AdminPermission } from './types';
import ProductNoStock from '@/components/products/ProductNoStock.vue';

export const adminChildren: RouteRecordRaw[] = [
  {
    path: '',
    name: RouteNames.Admin.HOME,
    component: DashboardView,
    meta: {
      requiresAuth: true,
      roles: AdminPermission,
    },
  },
  {
    path: 'products',
    name: RouteNames.Admin.PRODUCTS,
    component: ProductList,
    meta: {
      requiresAuth: true,
      roles: AdminPermission,
    },
  },
  {
    path: 'products/no-stock',
    name: RouteNames.Admin.PRODUCTS_NOSTOCK,
    component: ProductNoStock,
    meta: {
      requiresAuth: true,
      roles: AdminPermission,
    },
  },
  {
    path: 'orders',
    name: RouteNames.Admin.ORDERS,
    component: OrdersAdminView,
    meta: {
      requiresAuth: true,
      roles: AdminPermission,
    },
  },
  {
    path: 'clients',
    name: RouteNames.Admin.CLIENTS,
    component: ClientView,
    meta: {
      requiresAuth: true,
      roles: AdminPermission,
    },
  },
  {
    path: 'settings',
    name: RouteNames.Admin.SETTINGS,
    component: SettingsApp,
    meta: {
      requiresAuth: true,
      roles: AdminPermission,
    },
  },
];
