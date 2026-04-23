import type { Component } from 'vue';
import type { OrderStatus } from './db';
import type { RouteName } from '@/router/route.names';

export type Metric = {
  label: string;
  value: string;
  sub: string;
  up?: boolean;
  color: 'blue' | 'orange';
  icon: Component;
};

export type NavItem = {
  id: string;
  label: string;
  icon: Component;
  routeName: RouteName;
  section?: string;
};

export const ORDER_STATUS_META: Record<OrderStatus, { label: string; class: string; dot: string }> =
  {
    pending: {
      label: 'Pendiente',
      class: 'bg-slate-100 text-slate-600',
      dot: 'bg-slate-400',
    },
    preparing: {
      label: 'Surtiendo',
      class: 'bg-amber-50 text-amber-700',
      dot: 'bg-amber-400',
    },
    ready: {
      label: 'Listo',
      class: 'bg-emerald-100 text-emerald-700',
      dot: 'bg-emerald-500',
    },
    cancelled: {
      label: 'Cancelado',
      class: 'bg-red-50 text-red-600',
      dot: 'bg-red-400',
    },
  };

export const getOrderStatusLabel = (status: OrderStatus) => ORDER_STATUS_META[status];
