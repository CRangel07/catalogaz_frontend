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

const metrics = [
  {
    label: 'Ventas Hoy',
    value: '$4,280',
    sub: '+12% vs ayer',
    up: true,
    color: 'blue' as const,
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 8v1m0-9a9 9 0 110 18A9 9 0 0112 3z',
  },
  {
    label: 'Pedidos',
    value: '38',
    sub: '12 pendientes',
    up: true,
    color: 'orange' as const,
    icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
  },
  {
    label: 'Productos',
    value: '214',
    sub: '5 bajo stock',
    up: false,
    color: 'blue' as const,
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  },
  {
    label: 'Clientes Activos',
    value: '92',
    sub: '+5 esta semana',
    up: true,
    color: 'orange' as const,
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
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
