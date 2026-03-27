<template>
  <!-- Page header -->
  <div class="flex items-center justify-between">
    <div>
      <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500">
        Panel de control
      </p>
      <h1 class="text-2xl font-black tracking-tight text-blue-900">Dashboard</h1>
    </div>
  </div>

  <DashboardMetrics :metrics="metrics" />

  <DashboardRecentOrders :orders="recentOrders" />

  <DashboardTopProducts :products="topProducts" :max-sold="210" />
</template>

<script setup lang="ts">
import DashboardMetrics from '@/components/dashboard/DashboardMetrics.vue';
import DashboardTopProducts from '@/components/dashboard/DashboardTopProducts.vue';
import DashboardRecentOrders from '@/components/dashboard/DashboardRecentOrders.vue';
import type { Metric } from '@/types/components';
import { Grape, Percent, ShoppingBag, SquareUser } from 'lucide-vue-next';

const metrics: Metric[] = [
  {
    label: 'Ventas Hoy',
    value: '$4,280',
    sub: '+12% vs ayer',
    up: true,
    color: 'blue' as const,
    icon: Percent,
  },
  {
    label: 'Pedidos',
    value: '38',
    sub: '12 pendientes',
    up: true,
    color: 'orange' as const,
    icon: ShoppingBag,
  },
  {
    label: 'Productos',
    value: '214',
    sub: '5 bajo stock',
    up: false,
    color: 'blue' as const,
    icon: Grape,
  },
  {
    label: 'Clientes Activos',
    value: '92',
    sub: '+5 esta semana',
    up: true,
    color: 'orange' as const,
    icon: SquareUser,
  },
];

const topProducts = [
  { name: 'Corona Extra 1.2L', category: 'Bebidas', sold: 84, stock: 32, revenue: '$4,199' },
  { name: 'Jitomate kg', category: 'Verduras', sold: 210, stock: 8, revenue: '$1,050' },
  { name: 'Leche Lala 1L', category: 'Lácteos', sold: 156, stock: 44, revenue: '$2,184' },
  { name: 'Aguacate pieza', category: 'Verduras', sold: 130, stock: 3, revenue: '$1,950' },
  { name: 'Coca-Cola 600ml', category: 'Bebidas', sold: 98, stock: 60, revenue: '$1,813' },
];

const recentOrders = [
  {
    id: '#1042',
    client: 'María López',
    total: '$320.50',
    status: 'entregado' as const,
    time: 'hace 10 min',
  },
  {
    id: '#1041',
    client: 'Juan Pérez',
    total: '$89.00',
    status: 'pendiente' as const,
    time: 'hace 28 min',
  },
  {
    id: '#1040',
    client: 'Ana Torres',
    total: '$540.00',
    status: 'proceso' as const,
    time: 'hace 1 h',
  },
  {
    id: '#1039',
    client: 'Luis Ramírez',
    total: '$145.80',
    status: 'entregado' as const,
    time: 'hace 2 h',
  },
];
</script>

<style scoped></style>
