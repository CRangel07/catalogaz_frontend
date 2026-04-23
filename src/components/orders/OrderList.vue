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
      <!-- ── Columna ID / cliente / notas ─────────────────────────────── -->
      <template #cell-id="{ row }">
        <div class="flex flex-col gap-1.5">
          <!-- ID del pedido -->
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-300">
              Pedido
            </span>
            <span class="font-black text-teal-600 text-sm tabular-nums">#{{ row.id }}</span>
          </div>

          <!-- Cliente (solo admin) -->
          <div v-if="authStore.isAdmin" class="flex items-center gap-1.5">
            <User :size="11" class="text-slate-300 shrink-0" />
            <span class="text-xs font-semibold text-slate-600 truncate max-w-32">
              {{ row.customer.name }}
            </span>
            <span class="text-[10px] font-mono text-slate-400">{{ row.customer.phone }}</span>
          </div>

          <!-- Notas -->
          <div v-if="row.notes" class="flex items-start gap-1.5 mt-0.5">
            <MessageSquare :size="11" class="text-slate-300 shrink-0 mt-0.5" />
            <span class="text-[11px] italic text-slate-400 leading-snug line-clamp-2">
              {{ row.notes }}
            </span>
          </div>
        </div>
      </template>

      <!-- ── Columna Fecha ──────────────────────────────────────────────── -->
      <template #cell-createdAt="{ row }">
        <div class="flex flex-col gap-2">
          <!-- Creado -->
          <div class="flex flex-col gap-0.5">
            <span class="text-[9px] font-black uppercase tracking-widest text-slate-300">
              Creado
            </span>
            <div class="flex items-center gap-1">
              <CalendarDays :size="11" class="text-slate-300 shrink-0" />
              <span class="text-[11px] font-semibold text-slate-500 capitalize">
                {{ formatDate(row.createdAt) }}
              </span>
            </div>
          </div>

          <!-- Actualizado -->
          <div class="flex flex-col gap-0.5">
            <span class="text-[9px] font-black uppercase tracking-widest text-slate-300">
              Actualizado
            </span>
            <div class="flex items-center gap-1">
              <RefreshCw :size="11" class="text-slate-300 shrink-0" />
              <span class="text-[11px] font-semibold text-slate-400 capitalize">
                {{ formatDate(row.updatedAt) }}
              </span>
            </div>
          </div>
        </div>
      </template>

      <!-- ── Columna Status ─────────────────────────────────────────────── -->
      <template #cell-status="{ value }">
        <div class="flex items-center justify-center">
          <div
            class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wide whitespace-nowrap"
            :class="getOrderStatusLabel(value as OrderStatus).class">
            <!-- Punto de color -->
            <span
              class="w-1.5 h-1.5 rounded-full shrink-0"
              :class="getOrderStatusLabel(value as OrderStatus).dot" />
            {{ getOrderStatusLabel(value as OrderStatus).label }}
          </div>
        </div>
      </template>

      <!-- ── Columna Items / Total ──────────────────────────────────────── -->
      <template #cell-items="{ row }">
        <div class="flex flex-col gap-2">
          <!-- Artículos y total -->
          <div class="flex items-center gap-3">
            <div
              class="flex flex-col items-center px-2 py-1 rounded-lg bg-slate-50 border border-slate-100">
              <span class="text-lg font-black text-teal-600 leading-none tabular-nums">
                {{ row.items?.length ?? 0 }}
              </span>
              <span class="text-[8px] font-bold uppercase tracking-wider text-slate-300 mt-0.5">
                arts.
              </span>
            </div>
            <div class="flex flex-col">
              <span class="text-[10px] font-semibold uppercase tracking-wide text-slate-300">
                Total
              </span>
              <span class="text-sm font-extrabold text-azul">
                {{ formatMXN(row.total) }}
              </span>
            </div>
          </div>

          <!-- Botón desglose -->
          <ButtonUI theme="cyan" size="xs" :icon="Eye" @click="handleOrderBreakdown(row)">
            Ver desglose
          </ButtonUI>
        </div>
      </template>

      <!-- ── Acciones ───────────────────────────────────────────────────── -->
      <template #actions="{ row }">
        <ActionsTools @edit="handleEditOrder(row)" />
      </template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
import {
  Eye,
  User,
  RefreshCw,
  RefreshCcw,
  CalendarDays,
  ShoppingCart,
  MessageSquare,
} from 'lucide-vue-next';

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
import { RouteNames } from '@/router/route.names';
import { useAuthStore } from '@/stores/auth.store';
import { onBeforeMount } from 'vue';
import { useToastStore } from '@/stores/toast.store';
import { getOrderStatusLabel } from '@/types/components';

const toast = useToastStore();
const authStore = useAuthStore();
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
      'onUpdate:order': () => makeFetch(),
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
