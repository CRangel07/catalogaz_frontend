import OrderList from '@/components/orders/OrderList.vue';
import ClientList from '@/components/clients/ClientList.vue';
import ProductList from '@/components/products/ProductList.vue';
import DashboardHome from '@/components/dashboard/DashboardHome.vue';

import type { RouteRecordRaw } from 'vue-router';
import SettingsApp from '@/components/SettingsApp.vue';

export const adminChildren: RouteRecordRaw[] = [
  { component: DashboardHome, path: '', name: 'catalogAz_adm_home' },
  { name: 'catalogAz_adm_products', component: ProductList, path: '/adm/products' },
  { name: 'catalogAz_adm_orders', component: OrderList, path: '/adm/orders' },
  { name: 'catalogAz_adm_clients', component: ClientList, path: '/adm/clients' },
  { name: 'catalogAz_adm_settings', component: SettingsApp, path: '/adm/settings' },
];
