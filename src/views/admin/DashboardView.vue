<template>
  <!-- Page header -->
  <template v-if="dataDashboard">
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
</template>

<script setup lang="ts">
import DashboardMetrics from '@/components/dashboard/DashboardMetrics.vue';

import DashboardRecentOrders, {
  type Order,
} from '@/components/dashboard/DashboardRecentOrders.vue';
import DashboardTopProducts, {
  type ProductMetric,
} from '@/components/dashboard/DashboardTopProducts.vue';
import type { Metric } from '@/types/components';
import type { DashboardSummary, OrderStatus } from '@/types/db';

import { http } from '@/services/http';
import { computed, onBeforeMount, ref } from 'vue';
import { Grape, Percent, ShoppingBag, SquareUser } from 'lucide-vue-next';

const dataDashboard = ref<DashboardSummary | null>(null);

const fetchDashboard = async () => {
  try {
    const response = await http.get<DashboardSummary>('/dashboard');
    dataDashboard.value = response;
  } catch (error) {
    alert(error);
  }
};

const metrics = computed<Metric[]>(() => {
  return [
    {
      color: 'blue',
      label: 'Ventas de Hoy',
      value: String(dataDashboard.value?.sales.today),
      icon: Percent,
      sub: String(dataDashboard.value?.sales.changePercent),
      up: false,
    },
    {
      color: 'orange',
      label: 'Productos',
      value: String(dataDashboard.value?.products.activeCount),
      icon: Grape,
      sub: 'Productos Activos',
      up: true,
    },
    {
      color: 'blue',
      label: 'Pedidos',
      value: String(dataDashboard.value?.orders.today),
      icon: ShoppingBag,
      sub: 'Pedidos pendientes ' + dataDashboard.value?.orders.pending,
      up: true,
    },
    {
      color: 'orange',
      label: 'Clientes Activos',
      value: String(dataDashboard.value?.customers.activeCount),
      icon: SquareUser,
      sub: 'Esta Semana ' + dataDashboard.value?.customers.newThisWeek,
      up: true,
    },
  ];
});

const topProducts = computed<ProductMetric[]>(() => {
  if (!dataDashboard.value) return [];
  return dataDashboard.value.topProducts.map<ProductMetric>((p) => ({
    name: p.name,
    code: p.code,
    id: p.productId,
    revenue: p.revenue,
    sold: p.soldQty,
  }));
});

const recentOrders = computed<Order[]>(() => {
  if (!dataDashboard.value) return [];

  return dataDashboard.value.recentOrders.map<Order>((o) => ({
    client: o.customer.name,
    id: o.id,
    status: o.status as OrderStatus,
    time: o.createdAt,
    total: o.total,
  }));
});

onBeforeMount(() => fetchDashboard());
</script>
