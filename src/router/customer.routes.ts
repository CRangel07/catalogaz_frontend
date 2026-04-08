import OrdersCustomerView from '@/views/orders/OrdersCustomerView.vue';

import type { RouteRecordRaw } from 'vue-router';

export const customerRoutes: RouteRecordRaw[] = [
  { name: 'catalogAz_my_orders', component: OrdersCustomerView, path: '/my-orders' },
];
