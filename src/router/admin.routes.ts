import ClientView from '@/views/admin/ClientView.vue';
import ProductList from '@/components/products/ProductList.vue';
import SettingsApp from '@/components/SettingsApp.vue';
import DashboardView from '@/views/admin/DashboardView.vue';
import OrdersAdminView from '@/views/orders/OrdersAdminView.vue';

import { AdminPermission } from './types';
import type { RouteRecordRaw } from 'vue-router';

export const adminChildren: RouteRecordRaw[] = [
  {
    component: DashboardView,
    path: '',
    name: 'catalogAz_adm_home',
    meta: {
      requiresAuth: true,
      roles: AdminPermission,
    },
  },
  {
    name: 'catalogAz_adm_products',
    component: ProductList,
    path: '/admin/products',
    meta: {
      requiresAuth: true,
      roles: AdminPermission,
    },
  },
  {
    name: 'catalogAz_adm_orders',
    component: OrdersAdminView,
    path: '/admin/orders',
    meta: {
      requiresAuth: AdminPermission,
      roles: ['admin'],
    },
  },
  {
    name: 'catalogAz_adm_clients',
    component: ClientView,
    path: '/admin/clients',
    meta: {
      requiresAuth: true,
      roles: AdminPermission,
    },
  },
  {
    name: 'catalogAz_adm_settings',
    component: SettingsApp,
    path: '/admin/settings',
    meta: {
      requiresAuth: true,
      roles: AdminPermission,
    },
  },
];
