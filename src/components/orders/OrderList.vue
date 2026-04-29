<template>
  <div class="max-w-350 m-auto">
    <PageTitle :icon="ShoppingCart" icon-variant="orange" class="mb-5" title="Pedidos">
      <template #actions>
        <ButtonUI :icon="RefreshCcw" :disabled="loading" @click="handleUpdate">
          {{ loading ? 'Actualizando' : 'Actualizar' }}
        </ButtonUI>
      </template>
    </PageTitle>

    <AppTable
      :columns="columns"
      :rows="orders"
      :has-actions="authStore.isAdmin"
      :actions-header-class="'bg-azul text-white'"
      striped>
      <!-- ── ID / Cliente / Notas ───────────────────────────────────── -->
      <template #cell-id="{ row }">
        <div class="flex flex-col gap-2 py-0.5">
          <!-- Badge de ID estilo código de sistema -->
          <div
            class="inline-flex items-center gap-1 w-fit bg-azul/6 border border-azul/12 rounded-lg px-2 py-1">
            <Hash :size="10" class="text-azul/40" :stroke-width="2.5" />
            <span class="font-black text-azul text-sm tabular-nums tracking-tight">
              {{ String(row.id).padStart(4, '0') }}
            </span>
          </div>

          <div v-if="authStore.isAdmin" class="flex flex-col gap-0.5">
            <div class="flex items-center gap-1.5">
              <div
                class="w-7 h-7 rounded-full bg-linear-to-br from-teal-400 to-teal-600 flex items-center justify-center shrink-0 shadow-sm">
                <span class="text-[16px] font-black text-white uppercase leading-none">
                  {{ row.customer.name.charAt(0) }}
                </span>
              </div>
              <span class="text-xs uppercase font-bold text-slate-600 truncate max-w-28">
                {{ row.customer.name }}
              </span>
            </div>
            <span class="text-[11px] font-mono text-slate-700 pl-6 tracking-wide">
              {{ row.customer.phone }}
            </span>
          </div>

          <!-- Notas con ícono sticky -->
          <div v-if="row.notes" class="flex items-start gap-1.5 max-w-40">
            <div
              class="w-4 h-4 rounded bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
              <StickyNote :size="9" class="text-amber-500" :stroke-width="2.5" />
            </div>
            <span class="text-[10px] text-slate-400 italic leading-relaxed line-clamp-2">
              {{ row.notes }}
            </span>
          </div>
        </div>
      </template>

      <!-- ── Fecha ──────────────────────────────────────────────────── -->
      <template #cell-createdAt="{ row }">
        <div class="flex flex-col gap-2.5">
          <div class="flex flex-col gap-0.5">
            <span class="text-[8px] font-black uppercase tracking-[0.22em] text-slate-600">
              Creado
            </span>
            <div class="flex items-center gap-1.5">
              <CalendarDays :size="11" class="text-slate-400 shrink-0" />
              <span class="text-[11px] font-bold text-slate-500 capitalize font-mono">
                {{ formatDate(row.createdAt) }}
              </span>
            </div>
          </div>
          <div class="flex flex-col gap-0.5">
            <span class="text-[8px] font-black uppercase tracking-[0.22em] text-slate-600">
              Actualizado
            </span>
            <div class="flex items-center gap-1.5">
              <RefreshCw :size="10" class="text-slate-400 shrink-0" />
              <span class="text-[11px] font-mono text-slate-500 capitalize">
                {{ formatDate(row.updatedAt) }}
              </span>
            </div>
          </div>
        </div>
      </template>

      <!-- ── Status ─────────────────────────────────────────────────── -->
      <template #cell-status="{ value }">
        <div class="flex items-center justify-center">
          <div
            class="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-black text-[11px] uppercase tracking-widest whitespace-nowrap overflow-hidden border"
            :class="STATUS_META[value as OrderStatus].pill">
            <!-- Glow orb detrás del ícono -->
            <div
              class="absolute -left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full blur-xl opacity-60"
              :class="STATUS_META[value as OrderStatus].orb" />

            <component
              :is="STATUS_META[value as OrderStatus].icon"
              :size="13"
              class="relative z-10 shrink-0"
              :stroke-width="2.5" />
            <span class="relative z-10">
              {{ STATUS_META[value as OrderStatus].label }}
            </span>
          </div>
        </div>
      </template>

      <!-- ── Items / Total ───────────────────────────────────────────── -->
      <template #cell-items="{ row }">
        <div class="flex flex-col gap-2 items-center">
          <!-- Bloque de métricas -->
          <div
            class="flex items-center gap-0 rounded-xl border border-slate-300 overflow-hidden bg-white">
            <!-- Cantidad -->
            <div
              class="flex flex-col items-center justify-center px-3 py-2 bg-linear-to-b from-slate-50 to-white border-r border-slate-300 min-w-14">
              <span class="text-2xl font-black text-slate-700 leading-none tabular-nums">
                {{ row.items?.length ?? 0 }}
              </span>
              <span class="text-[8px] font-black uppercase tracking-[0.18em] text-slate-600 mt-0.5">
                articulos
              </span>
            </div>

            <!-- Total -->
            <div class="flex flex-col justify-center px-3 py-2 flex-1">
              <span class="text-[8px] font-black uppercase tracking-[0.18em] text-slate-500 mb-0.5">
                Total
              </span>
              <span class="text-sm font-black text-azul leading-none">
                {{ formatMXN(row.total) }}
              </span>
            </div>
          </div>

          <!-- Botón desglose con ícono de scanner -->
          <ButtonUI theme="cyan" size="xs" :icon="ScanLine" @click="handleOrderBreakdown(row)">
            Ver desglose
          </ButtonUI>
        </div>
      </template>

      <!-- ── Acciones ───────────────────────────────────────────────── -->
      <template #actions="{ row }">
        <ActionsTools @edit="handleEditOrder(row)" />
      </template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
import {
  Ban,
  Hash,
  Clock,
  Loader,
  ScanLine,
  RefreshCw,
  StickyNote,
  RefreshCcw,
  CalendarDays,
  ShoppingCart,
  PackageCheck,
} from 'lucide-vue-next';

import ButtonUI from '../ui/atoms/ButtonUI.vue';
import PageTitle from '../ui/molecules/PageTitle.vue';
import OrderForm from '../forms/OrderForm.vue';
import ActionsTools from '../ui/molecules/ActionsTools.vue';
import OrderBreakdown from './OrderBreakdown.vue';

import type { OrderFull, OrderStatus } from '@/types/db';
import AppTable, { type TableColumn } from '../ui/molecules/AppTable.vue';
import type { Component } from 'vue';

import { useRoute } from 'vue-router';
import { useModal } from '@/composables/useModal';
import { useOrders } from '@/composables/useOrders';
import { formatMXN } from '@/helpers/currencyMxn';
import { formatDate } from '@/helpers/dates';
import { RouteNames } from '@/router/route.names';
import { useAuthStore } from '@/stores/auth.store';
import { onBeforeMount } from 'vue';
import { useToastStore } from '@/stores/toast.store';

// ─── Stores ───────────────────────────────────────────────────────────────────

const toast = useToastStore();
const authStore = useAuthStore();
const { openModal } = useModal();
const { fetchOrdersAdm, fetchOrdersCustomer, orders, loading } = useOrders();

// ─── Status meta ──────────────────────────────────────────────────────────────
// Cada status tiene: pill (clases del contenedor), orb (glow detrás),
// icon (ícono Lucide), label (texto en español)

interface StatusMeta {
  label: string;
  pill: string;
  orb: string;
  icon: Component;
}

const STATUS_META: Record<OrderStatus, StatusMeta> = {
  pending: {
    label: 'Pendiente',
    pill: 'bg-slate-50 text-slate-500 border-slate-200',
    orb: 'bg-slate-300',
    icon: Clock,
  },
  preparing: {
    label: 'Surtiendo',
    pill: 'bg-amber-50 text-amber-700 border-amber-300',
    orb: 'bg-amber-400',
    icon: Loader,
  },
  ready: {
    label: 'Listo ✓',
    // Fondo sólido + sombra de glow verde — el más llamativo de todos
    pill: 'bg-emerald-500 text-white border-emerald-600 shadow-[0_0_16px_rgba(16,185,129,0.45)]',
    orb: 'bg-emerald-300',
    icon: PackageCheck,
  },
  cancelled: {
    label: 'Cancelado',
    pill: 'bg-red-50 text-red-500 border-red-200',
    orb: 'bg-red-300',
    icon: Ban,
  },
};

// ─── Columnas ─────────────────────────────────────────────────────────────────

const columns: TableColumn<OrderFull>[] = [
  { key: 'id', label: 'Pedido', headerClass: 'bg-azul text-white' },
  { key: 'createdAt', label: 'Fecha', headerClass: 'bg-azul text-white' },
  { key: 'status', label: 'Estatus', align: 'center', headerClass: 'bg-azul text-white' },
  { key: 'items', label: 'Resumen', headerClass: 'bg-azul text-white' },
];

// ─── Handlers ─────────────────────────────────────────────────────────────────

const handleEditOrder = (order: OrderFull) => {
  openModal(
    OrderForm,
    {
      order,
      onSave: async () => await makeFetch(),
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

// ─── Fetch ────────────────────────────────────────────────────────────────────

const route = useRoute();

const makeFetch = async () => {
  authStore.isAdmin && route.name !== RouteNames.Catalog.MY_ORDERS
    ? await fetchOrdersAdm()
    : await fetchOrdersCustomer();
};

const handleUpdate = async () => {
  await makeFetch();
  toast.info('Actualizado correctamente');
};

onBeforeMount(() => makeFetch());
</script>
