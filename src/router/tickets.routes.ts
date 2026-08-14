import type { RouteRecordRaw } from 'vue-router';

import { RouteNames } from './route.names';
import TicketsNovaLayout from '@/layouts/TicketsNovaLayout.vue';

export const ticketsRoutes: RouteRecordRaw[] = [
  {
    path: '/tickets',
    component: TicketsNovaLayout,
    children: [
      {
        path: '',
        name: RouteNames.TICKET.HOME,
        component: () => import('@/views/tickets/HomeTickets.vue'),

        meta: {
          requiresAuth: true,
          roles: ['tickets'],
        },
      },
    ],
  },
];
