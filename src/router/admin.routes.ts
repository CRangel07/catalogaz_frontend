import ClientView from '@/views/admin/ClientView.vue';
import ProductList from '@/components/products/ProductList.vue';
import SettingsApp from '@/components/SettingsApp.vue';
import DashboardView from '@/views/admin/DashboardView.vue';
import OrdersAdminView from '@/views/orders/OrdersAdminView.vue';

import type { RouteRecordRaw } from 'vue-router';

import { RouteNames } from './route.names';
import { AdminPermission } from './types';
import ProductNoStock from '@/components/products/ProductNoStock.vue';
import AdminListView from '@/views/admin/AdminListView.vue';

export const adminChildren: RouteRecordRaw[] = [
  {
    path: '',
    name: RouteNames.Admin.HOME,
    component: DashboardView,
    meta: {
      requiresAuth: true,
      roles: AdminPermission,
      label: 'Dashboard',
    },
  },
  {
    path: 'products',
    name: RouteNames.Admin.PRODUCTS,
    component: ProductList,
    meta: {
      requiresAuth: true,
      roles: AdminPermission,
      label: 'Mis productos',
    },
  },
  {
    path: 'products/no-stock',
    name: RouteNames.Admin.PRODUCTS_NOSTOCK,
    component: ProductNoStock,
    meta: {
      requiresAuth: true,
      roles: AdminPermission,
      label: 'Productos Negados',
    },
  },
  {
    path: 'orders',
    name: RouteNames.Admin.ORDERS,
    component: OrdersAdminView,
    meta: {
      requiresAuth: true,
      roles: [...AdminPermission, 'pedidos', 'caja'],
      label: 'Gestión de pedidos',
    },
  },
  {
    path: 'clients',
    name: RouteNames.Admin.CLIENTS,
    component: ClientView,
    meta: {
      label: 'Gestión de Clientes',
      requiresAuth: true,
      roles: AdminPermission,
    },
  },
  {
    path: 'admins',
    name: RouteNames.Admin.LIST_ADMINS,
    component: AdminListView,
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
