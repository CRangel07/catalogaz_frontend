<template>
  <div class="max-w-350 m-auto">
    <PageTitle :icon="ShoppingCart" :icon-variant="'teal'" class="mb-5" title="Pedidos">
      <template #actions>
        <ButtonUI :icon="RefreshCcw" :disabled="loading" @click="handleUpdate">
          {{ loading ? 'Actualizando' : 'Actualizar' }}
        </ButtonUI>
      </template>
    </PageTitle>

    <AppTable :columns="columns" :rows="orders" :has-actions="authStore.isAdmin">
      <template #cell-id="{ row }">
        <p class="text-slate-400">
          Id Pedido:
          <span class="text-teal-600"> # {{ row.id }} </span>
        </p>

        <p v-if="row.notes" class="text-slate-400 mt-2">
          Notas Pedido:
          <span class="italic text-slate-500"> {{ row.notes }} </span>
        </p>

        <p v-if="authStore.isAdmin" class="text-slate-400 mt-2">
          Pedido de:
          <span class="italic text-slate-500">
            {{ row.customer.name }} {{ row.customer.phone }}
          </span>
        </p>
      </template>

      <template #cell-createdAt="{ row }">
        <p class="text-xs text-slate-400">
          Creado:
          <span class="text-sm block text-slate-500">
            {{ formatDate(row.createdAt) }}
          </span>
        </p>
        <p class="mt-2 text-slate-400 text-xs">
          Actualizado:
          <span class="block text-sm text-slate-500">
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

      <template #cell-items="{ row }">
        <div>
          <p class="text-xs text-slate-400">
            Número de articulos:
            <span v-if="row.items" class="text-sm text-teal-600">
              {{ row.items.length }}
            </span>
          </p>
          <p class="text-xs text-slate-400">
            Total:
            <span v-if="row.items" class="text-sm text-teal-600">
              {{ formatMXN(row.total) }}
            </span>
          </p>
          <div class="mt-2">
            <ButtonUI theme="cyan" size="xs" :icon="Eye" @click="handleOrderBreakdown(row)">
              Ver desglose
            </ButtonUI>
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
import ButtonUI from '../ui/atoms/ButtonUI.vue';
import PageTitle from '../ui/molecules/PageTitle.vue';
import OrderForm from '../forms/OrderForm.vue';
import ActionsTools from '../ui/molecules/ActionsTools.vue';
import OrderBreakdown from './OrderBreakdown.vue';

import type { OrderFull, OrderStatus } from '@/types/db';
import AppTable, { type TableColumn } from '../ui/molecules/AppTable.vue';

import { useRoute } from 'vue-router';
import { useModal } from '@/composables/useModal';
import { useOrders } from '@/composables/useOrders';
import { formatMXN } from '@/helpers/currencyMxn';
import { formatDate } from '@/helpers/dates';
import { useAuthStore } from '@/stores/auth.store';
import { onBeforeMount } from 'vue';
import { useToastStore } from '@/stores/toast.store';
import { getOrderStatusLabel } from '@/types/components';
import { Eye, RefreshCcw, ShoppingCart } from 'lucide-vue-next';
import { RouteNames } from '@/router/route.names';

const authStore = useAuthStore();
const toast = useToastStore();
const { openModal } = useModal();
const { fetchOrdersAdm, fetchOrdersCustomer, orders, loading } = useOrders();

const handleEditOrder = (order: OrderFull) => {
  openModal(
    OrderForm,
    {
      order,
      onSave: async () => {
        await makeFetch();
      },
    },
    { size: 'sm' }
  );
};

const handleOrderBreakdown = (order: OrderFull) => {
  openModal(
    OrderBreakdown,
    {
      order,
    },
    { size: 'lg' }
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
  authStore.isAdmin && route.name !== RouteNames.Catalog.MY_ORDERS
    ? await fetchOrdersAdm()
    : await fetchOrdersCustomer();
};

const handleUpdate = async () => {
  await makeFetch();
  toast.info('Actualizado correctamente');
};

onBeforeMount(() => {
  makeFetch();
});
</script>
