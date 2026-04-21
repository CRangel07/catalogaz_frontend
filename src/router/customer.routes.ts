import type { RouteRecordRaw } from 'vue-router';

import OrdersCustomerView from '@/views/orders/OrdersCustomerView.vue';

import { RouteNames } from './route.names';

export const customerRoutes: RouteRecordRaw[] = [
  {
    path: 'my-orders',
    name: RouteNames.Catalog.MY_ORDERS,
    component: OrdersCustomerView,
    meta: {
      requiresAuth: true,
      roles: ['admin', 'customer'],
    },
  },
];
