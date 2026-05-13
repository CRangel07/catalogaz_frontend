<template>
  <div class="flex flex-col gap-4 w-full">
    <!-- Info del producto -->
    <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
      <ImageNotFound
        :url="item.product.imageThumbnailUrl"
        :alt="item.product.name"
        class="w-11! h-11! rounded-lg object-cover shrink-0 border border-white shadow-sm" />
      <div class="flex-1 min-w-0">
        <p class="font-bold text-sm text-slate-800 truncate leading-tight">
          {{ item.product.name }}
        </p>
        <p class="font-mono text-xs text-slate-400 mt-0.5">#{{ item.product.code }}</p>
      </div>
      <!-- Precio actual -->
      <div class="flex flex-col items-end shrink-0">
        <span class="text-[9px] font-black uppercase tracking-widest text-slate-400"
          >Precio actual</span
        >
        <span class="text-sm font-black text-azul">{{ formatMXN(item.unitPrice) }}</span>
        <span v-if="item.overridePrice" class="text-[10px] text-amber-600 font-semibold">
          Especial: {{ formatMXN(item.overridePrice) }}
        </span>
      </div>
    </div>

    <!-- Advertencia si ya tiene override -->
    <div
      v-if="item.overridePrice"
      class="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
      <AlertTriangle :size="14" class="text-amber-500 shrink-0 mt-0.5" :stroke-width="2.5" />
      <p class="text-xs text-amber-700 font-medium leading-relaxed">
        Este item ya tiene un precio especial aplicado. Al guardar lo reemplazarás.
      </p>
    </div>

    <!-- Formulario -->
    <form class="flex flex-col gap-3" @submit.prevent="handleSubmit">
      <!-- Precio especial -->
      <div class="flex flex-col gap-1">
        <label class="text-xs font-bold text-slate-600 uppercase tracking-wide">
          Precio especial
        </label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400"
            >$</span
          >
          <input
            ref="priceInputRef"
            v-model="form.overridePrice"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            class="w-full rounded-xl border-2 border-slate-200 pl-7 pr-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-azul/50 transition-colors tabular-nums"
            :class="{ 'border-red-300 bg-red-50': errors.overridePrice }" />
        </div>
        <p v-if="errors.overridePrice" class="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle :size="11" :stroke-width="2.5" />
          {{ errors.overridePrice }}
        </p>
        <!-- Comparativa visual -->
        <div
          v-if="parsedPrice && parsedPrice !== Number(item.unitPrice)"
          class="flex items-center gap-2 text-xs font-semibold mt-0.5"
          :class="parsedPrice < Number(item.unitPrice) ? 'text-emerald-600' : 'text-red-500'">
          <component
            :is="parsedPrice < Number(item.unitPrice) ? TrendingDown : TrendingUp"
            :size="13" />
          <span v-if="parsedPrice < Number(item.unitPrice)">
            Descuento de ${{ (Number(item.unitPrice) - parsedPrice).toFixed(2) }} ({{
              discountPct
            }}% menos)
          </span>
          <span v-else>
            Aumento de ${{ (parsedPrice - Number(item.unitPrice)).toFixed(2) }} ({{ discountPct }}%
            más)
          </span>
        </div>
      </div>

      <!-- Motivo -->
      <div class="flex flex-col gap-1">
        <label class="text-xs font-bold text-slate-600 uppercase tracking-wide">
          Motivo <span class="text-red-400">*</span>
        </label>
        <input
          v-model="form.overrideReason"
          type="text"
          maxlength="100"
          placeholder="Ej: Precio especial acordado con el cliente"
          class="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-azul/50 transition-colors"
          :class="{ 'border-red-300 bg-red-50': errors.overrideReason }" />
        <div class="flex items-center justify-between">
          <p v-if="errors.overrideReason" class="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle :size="11" :stroke-width="2.5" />
            {{ errors.overrideReason }}
          </p>
          <span class="text-[10px] text-slate-400 ml-auto">
            {{ form.overrideReason.length }}/100
          </span>
        </div>
      </div>

      <!-- Acciones -->
      <div class="flex gap-2 mt-1">
        <!-- Quitar precio especial (solo si ya tiene uno) -->
        <ButtonUI
          v-if="item.overridePrice"
          theme="danger"
          size="sm"
          type="button"
          :icon="Trash2"
          :loading="loadingClear"
          @click="handleClear">
          Quitar
        </ButtonUI>

        <ButtonUI
          theme="success"
          class="flex-1"
          type="submit"
          :icon="BadgeDollarSign"
          :loading="loadingSubmit"
          :disabled="!form.overridePrice || !form.overrideReason.trim()">
          Aplicar precio especial
        </ButtonUI>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import ImageNotFound from '../ui/molecules/ImageNotFound.vue';
import ButtonUI from '../ui/atoms/ButtonUI.vue';

import {
  Trash2,
  TrendingUp,
  AlertCircle,
  TrendingDown,
  AlertTriangle,
  BadgeDollarSign,
} from 'lucide-vue-next';

import type { OrderItemFull } from '@/types/db';

import { formatMXN } from '@/helpers/currencyMxn';
import { OrderService } from '@/services/order.service';
import { useToastStore } from '@/stores/toast.store';
import { computed, nextTick, reactive, ref } from 'vue';

// ─── Props ────────────────────────────────────────────────────────────────────

const props = defineProps<{
  item: OrderItemFull;
  orderId: number;
  onSuccess: () => void; // callback al padre
}>();

// ─── Estado ───────────────────────────────────────────────────────────────────

const toast = useToastStore();
const priceInputRef = ref<HTMLInputElement | null>(null);
const loadingSubmit = ref(false);
const loadingClear = ref(false);

const form = reactive({
  overridePrice: props.item.overridePrice ? String(Number(props.item.overridePrice)) : '',
  overrideReason: '',
});

const errors = reactive({
  overridePrice: '',
  overrideReason: '',
});

// ─── Computed ─────────────────────────────────────────────────────────────────

const parsedPrice = computed(() => {
  const n = parseFloat(form.overridePrice);
  return isNaN(n) ? null : n;
});

const discountPct = computed(() => {
  if (!parsedPrice.value) return '0';
  const original = Number(props.item.unitPrice);
  const diff = Math.abs(parsedPrice.value - original);
  return ((diff / original) * 100).toFixed(1);
});

// ─── Validación ───────────────────────────────────────────────────────────────

function validate(): boolean {
  errors.overridePrice = '';
  errors.overrideReason = '';

  if (!form.overridePrice || parseFloat(form.overridePrice) <= 0) {
    errors.overridePrice = 'Ingresa un precio mayor a cero';
  }

  if (!form.overrideReason.trim()) {
    errors.overrideReason = 'El motivo es obligatorio para auditoría';
  }

  return !errors.overridePrice && !errors.overrideReason;
}

// ─── Aplicar precio especial ──────────────────────────────────────────────────

async function handleSubmit(): Promise<void> {
  if (!validate()) return;

  loadingSubmit.value = true;

  try {
    await OrderService.overrideItemPrice(props.orderId, props.item.id, {
      overridePrice: parseFloat(form.overridePrice),
      overrideReason: form.overrideReason.trim(),
    });

    toast.success('Precio especial aplicado correctamente');
    props.onSuccess();
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Error al aplicar el precio especial');
  } finally {
    loadingSubmit.value = false;
  }
}

// ─── Quitar precio especial ───────────────────────────────────────────────────

async function handleClear(): Promise<void> {
  loadingClear.value = true;

  try {
    await OrderService.clearItemPriceOverride(props.orderId, props.item.id);
    toast.success('Precio especial eliminado');
    props.onSuccess();
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Error al eliminar el precio especial');
  } finally {
    loadingClear.value = false;
  }
}

// Autofocus al montar
nextTick(() => priceInputRef.value?.focus());
</script>
