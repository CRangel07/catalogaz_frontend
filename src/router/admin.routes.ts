import ProductList from '@/components/products/ProductList.vue';

import type { RouteRecordRaw } from 'vue-router';
import SettingsApp from '@/components/SettingsApp.vue';
import ClientView from '@/views/admin/ClientView.vue';
import DashboardView from '@/views/admin/DashboardView.vue';
import OrdersAdminView from '@/views/orders/OrdersAdminView.vue';

export const adminChildren: RouteRecordRaw[] = [
  { component: DashboardView, path: '', name: 'catalogAz_adm_home' },
  { name: 'catalogAz_adm_products', component: ProductList, path: '/admin/products' },
  { name: 'catalogAz_adm_orders', component: OrdersAdminView, path: '/admin/orders' },
  { name: 'catalogAz_adm_clients', component: ClientView, path: '/admin/clients' },
  { name: 'catalogAz_adm_settings', component: SettingsApp, path: '/admin/settings' },
];
