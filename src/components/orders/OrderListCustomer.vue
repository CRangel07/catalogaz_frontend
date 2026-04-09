<template>
  <div class="max-w-350 m-auto">
    <AppTable :columns="columns" :rows="orders">
      <template #cell-createdAt="{ row }">
        <p class="text-xs text-slate-400">
          Creado:
          <span class="text-sm block text-slate-600">
            {{ formatDate(row.createdAt) }}
          </span>
        </p>
        <p class="mt-2 text-slate-400 text-xs">
          Actualizado:
          <span class="block text-sm text-slate-600">
            {{ formatDate(row.updatedAt) }}
          </span>
        </p>
      </template>

      <template #cell-status="{ value }">
        <span
          class="inline-flex items-center gap-2 px-2 py-1 text-xs font-medium rounded-md"
          :class="getOrderStatusLabel(value as OrderStatus).class">
          <span
            class="w-1.5 h-1.5 rounded-full"
            :class="getOrderStatusLabel(value as OrderStatus).dot" />
          {{ getOrderStatusLabel(value as OrderStatus).label }}
        </span>
      </template>

      <template #cell-items="{ value, row }">
        <div v-if="Array.isArray(value)" class="space-y-2">
          <span class="text-teal-600">Total: {{ formatMXN(row.total) }}</span>
          <div
            v-for="item in value"
            :key="item.id"
            class="flex items-center gap-3 p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition">
            <img
              :src="`${BASE}${item.product.imageThumbnailUrl}` || ''"
              :alt="item.product.name"
              class="w-10 h-10 rounded-md object-cover border border-slate-200" />

            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-700 truncate">
                {{ item.product.name }}
              </p>

              <div class="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                <span class="bg-slate-100 px-1.5 py-0.5 rounded"> x{{ item.quantity }} </span>

                <span> ${{ item.unitPrice.toFixed(2) }} </span>
              </div>
            </div>

            <div class="text-sm font-semibold text-slate-700">
              ${{ (item.quantity * item.unitPrice).toFixed(2) }}
            </div>
          </div>
        </div>
      </template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
import type { OrderFull, OrderStatus } from '@/types/db';
import AppTable, { type TableColumn } from '../ui/AppTable.vue';

import { useOrders } from '@/composables/useOrders';
import { formatDate } from '@/helpers/dates';
import { onBeforeMount } from 'vue';
import { getOrderStatusLabel } from '@/types/components';
import { formatMXN } from '@/helpers/currencyMxn';

const BASE = import.meta.env.VITE_ASSETS_URL;

const { fetchOrdersCustomer, orders } = useOrders();

const columns: TableColumn<OrderFull>[] = [
  { key: 'id', label: 'ID Orden' },
  { key: 'createdAt', label: 'Fecha' },
  { key: 'status', label: 'Estatus Pedido' },
  { key: 'items', label: 'Articulos' },
];

onBeforeMount(() => {
  fetchOrdersCustomer();
});
</script>
