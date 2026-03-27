import AdminLayout from '@/layouts/AdminLayout.vue';
import CatalogLayout from '@/layouts/CatalogLayout.vue';
import ProductCatalogView from '@/views/ProductCatalogView.vue';
import type { RouteRecordRaw } from 'vue-router';
import { adminChildren } from './admin.routes';

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: { name: 'catalogAz_catalog' } },
  { path: '/catalog', name: 'catalogAz_catalog', component: CatalogLayout },
  {
    path: '/dashboard',
    component: AdminLayout,
    children: [...adminChildren],
  },
];
