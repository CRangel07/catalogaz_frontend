<template>
  <div class="max-w-350 m-auto">
    <PageTitle :icon="ShoppingCart" :icon-variant="'teal'" class="mb-5" title="Pedidos" />

    <AppTable :columns="columns" :rows="orders" :has-actions="authStore.isAdmin">
      <template #cell-id="{ row }">
        <p class="text-xs text-slate-400">
          Id Pedido:
          <span class="text-sm block text-teal-600"> # {{ row.id }} </span>
        </p>

        <p v-if="row.notes" class="text-xs text-slate-400 mt-2">
          Notas Pedido:
          <span class="text-sm italic block text-slate-500"> {{ row.notes }} </span>
        </p>
      </template>

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
        <div class="relative">
          <span class="text-teal-600">Total: {{ formatMXN(row.total) }}</span>
          <div v-if="Array.isArray(value)" class="space-y-2 overflow-y-auto max-h-30">
            <div
              v-for="item in value"
              :key="item.id"
              class="flex items-center gap-3 p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition">
              <img
                :src="`${BASE}${item.product.imageThumbnailUrl}` || ''"
                :alt="item.product.name"
                class="w-10 h-10 rounded-md object-cover border border-slate-200"
                loading="lazy" />

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
        </div>
      </template>

      <template #actions="{ row }">
        <ActionsTools @edit="handleEditOrder(row)" />
      </template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
import PageTitle from '../ui/molecules/PageTitle.vue';
import OrderForm from '../forms/OrderForm.vue';
import ActionsTools from '../ui/molecules/ActionsTools.vue';

import type { OrderFull, OrderStatus } from '@/types/db';
import AppTable, { type TableColumn } from '../ui/molecules/AppTable.vue';

import { useModal } from '@/composables/useModal';
import { formatMXN } from '@/helpers/currencyMxn';
import { useOrders } from '@/composables/useOrders';
import { formatDate } from '@/helpers/dates';
import { ShoppingCart } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth.store';
import { onBeforeMount } from 'vue';
import { getOrderStatusLabel } from '@/types/components';
import { useRoute } from 'vue-router';

const BASE = import.meta.env.VITE_ASSETS_URL;
const authStore = useAuthStore();
const { openModal } = useModal();
const { fetchOrdersAdm, fetchOrdersCustomer, orders } = useOrders();

const handleEditOrder = (order: OrderFull) => {
  openModal(
    OrderForm,
    {
      order,
      onSavew: async () => {
        await makeFetch();
      },
    },
    { size: 'sm' }
  );
};

const route = useRoute();

const columns: TableColumn<OrderFull>[] = [
  { key: 'id', label: 'ID Orden' },
  { key: 'createdAt', label: 'Fecha' },
  { key: 'status', label: 'Estatus Pedido' },
  { key: 'items', label: 'Articulos' },
];

const makeFetch = async () => {
  authStore.isAdmin && route.name !== 'catalogAz_my_orders'
    ? await fetchOrdersAdm()
    : await fetchOrdersCustomer();
};

onBeforeMount(() => {
  makeFetch();
});
</script>
