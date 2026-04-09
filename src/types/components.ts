import type { Component } from 'vue';
import type { OrderStatus } from './db';

export type Metric = {
  label: string;
  value: string;
  sub: string;
  up: boolean;
  color: 'blue' | 'orange';
  icon: Component;
};

export type NavItem = {
  id: string;
  label: string;
  icon: Component;
  routeName: string;
  section?: string;
};

export const ORDER_STATUS_META: Record<
  OrderStatus,
  {
    label: string;
    class: string;
    dot: string;
  }
> = {
  pending: {
    label: 'Pendiente',
    class: 'bg-gray-50 text-gray-700',
    dot: 'bg-gray-400',
  },
  confirmed: {
    label: 'Confirmado',
    class: 'bg-blue-50 text-blue-700',
    dot: 'bg-blue-400',
  },
  preparing: {
    label: 'Preparando',
    class: 'bg-amber-50 text-amber-700',
    dot: 'bg-amber-400',
  },
  ready: {
    label: 'Listo',
    class: 'bg-green-50 text-green-700',
    dot: 'bg-green-400',
  },
  cancelled: {
    label: 'Cancelado',
    class: 'bg-red-50 text-red-700',
    dot: 'bg-red-400',
  },
};

export const getOrderStatusLabel = (status: OrderStatus) => ORDER_STATUS_META[status];
