<template>
  <div class="w-full max-w-sm mx-auto">
    <!-- ── Cabecera del producto ──────────────────────────────────── -->
    <div class="flex items-center gap-3 mb-5 p-3 rounded-xl bg-slate-50 border border-slate-100">
      <ImageNotFound
        :url="item.product.imageThumbnailUrl"
        :alt="item.product.name"
        class="w-12! h-12! rounded-lg object-cover shrink-0 border border-white shadow-sm" />
      <div class="flex-1 min-w-0">
        <p class="font-bold text-sm text-slate-800 leading-tight truncate">
          {{ item.product.name }}
        </p>
        <p class="font-mono text-xs text-slate-400 mt-0.5">#{{ item.product.code }}</p>
      </div>
      <!-- Qty pedida -->
      <div
        class="flex flex-col items-center px-3 py-1.5 rounded-xl bg-naranja/8 border border-naranja/15">
        <span class="text-xl font-black text-naranja leading-none tabular-nums">{{
          item.quantity
        }}</span>
        <span class="text-[8px] font-black uppercase tracking-widest text-naranja/60 mt-0.5"
          >pedidas</span
        >
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════ -->
    <!-- PASO 1 — Verificar código                                     -->
    <!-- ══════════════════════════════════════════════════════════════ -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 translate-x-4"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 -translate-x-4"
      mode="out-in">
      <div v-if="step === 'scan'" key="scan">
        <!-- Instrucción -->
        <div class="flex items-start gap-2 mb-4 p-3 rounded-xl bg-blue-50 border border-blue-100">
          <ScanBarcode :size="16" class="text-blue-500 shrink-0 mt-0.5" :stroke-width="2" />
          <p class="text-xs text-blue-700 font-medium leading-relaxed">
            Escanea el código de barras del producto para confirmar que es el correcto antes de
            marcarlo como listo.
          </p>
        </div>

        <!-- Input de scanner -->
        <form @submit.prevent="handleVerify">
          <AppInput
            ref="inputRef"
            id="confirm-product-code"
            v-model="scannedCode"
            label="Código de barras"
            type="text"
            :attrs="{ placeholder: 'Escanea o escribe el código...', autocomplete: 'off' }" />

          <!-- Feedback de error -->
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0">
            <div v-if="scanError" class="flex items-center gap-1.5 mt-2 text-red-600">
              <AlertCircle :size="13" :stroke-width="2.5" />
              <span class="text-xs font-semibold">{{ scanError }}</span>
            </div>
          </Transition>

          <div class="flex items-center gap-2 mt-4">
            <!-- Sin código (frutas, verduras, granel) -->
            <button
              type="button"
              class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 text-xs font-semibold hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50 transition-all duration-150"
              @click="handleNoCode">
              <Ban :size="13" :stroke-width="2.5" />
              Sin código
            </button>

            <ButtonUI theme="success" type="submit" class="flex-1" :icon="ScanBarcode">
              Verificar
            </ButtonUI>
          </div>
        </form>
      </div>

      <!-- ══════════════════════════════════════════════════════════════ -->
      <!-- PASO 2 — Confirmar cantidad                                   -->
      <!-- ══════════════════════════════════════════════════════════════ -->
      <div v-else-if="step === 'qty'" key="qty">
        <!-- Verificación ok -->
        <div
          class="flex items-center gap-2 mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
          <div
            class="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
            <Check :size="13" class="text-white" :stroke-width="3" />
          </div>
          <p class="text-xs text-emerald-700 font-semibold">
            {{
              noCodeConfirmed
                ? 'Producto sin código confirmado.'
                : 'Código verificado correctamente.'
            }}
          </p>
        </div>

        <!-- Comparador qty -->
        <div class="flex items-center gap-3 mb-4">
          <!-- Qty pedida (solo lectura) -->
          <div
            class="flex-1 flex flex-col items-center gap-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span class="text-[9px] font-black uppercase tracking-widest text-slate-400"
              >Pedidas</span
            >
            <span class="text-3xl font-black text-slate-400 tabular-nums leading-none">
              {{ item.quantity }}
            </span>
          </div>

          <!-- Separador -->
          <div class="flex flex-col items-center gap-0.5">
            <div class="w-px h-4 bg-slate-200" />
            <ArrowRight :size="14" class="text-slate-300" />
            <div class="w-px h-4 bg-slate-200" />
          </div>

          <!-- Qty real (editable) -->
          <div
            class="flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-colors duration-200"
            :class="qtyDiffClass">
            <span
              class="text-[9px] font-black uppercase tracking-widest"
              :class="qtyDiffLabelClass">
              Reales
            </span>
            <input
              ref="qtyInputRef"
              v-model.number="actualQty"
              type="number"
              min="1"
              :max="item.quantity"
              class="w-full text-center text-3xl font-black tabular-nums leading-none bg-transparent outline-none"
              :class="qtyDiffValueClass" />
          </div>
        </div>

        <!-- Advertencia si qty real < pedida -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0">
          <div
            v-if="actualQty < item.quantity && actualQty > 0"
            class="flex items-start gap-2 mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200">
            <AlertTriangle :size="14" class="text-amber-500 shrink-0 mt-0.5" :stroke-width="2.5" />
            <p class="text-xs text-amber-700 font-medium leading-relaxed">
              Solo hay <strong>{{ actualQty }}</strong> de
              <strong>{{ item.quantity }}</strong> pedidas. Se marcará como listo con la cantidad
              real.
            </p>
          </div>
        </Transition>

        <div class="flex gap-2">
          <button
            type="button"
            class="px-3 py-2 rounded-xl border border-slate-200 text-slate-500 text-xs font-semibold hover:bg-slate-50 transition-colors"
            @click="step = 'scan'">
            ← Atrás
          </button>
          <ButtonUI
            theme="success"
            class="flex-1"
            :icon="PackageCheck"
            :disabled="!actualQty || actualQty <= 0"
            @click="handleConfirm">
            Confirmar {{ actualQty }} {{ actualQty !== item.quantity ? `de ${item.quantity}` : '' }}
          </ButtonUI>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import AppInput from '../ui/forms/AppInput.vue';
import ButtonUI from '../ui/atoms/ButtonUI.vue';
import ImageNotFound from '../ui/molecules/ImageNotFound.vue';

import type { OrderItemFull } from '@/types/db';

import { computed, nextTick, ref } from 'vue';
import {
  Ban,
  Check,
  ScanBarcode,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  PackageCheck,
} from 'lucide-vue-next';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface ConfirmProductResult {
  confirmed: true;
  actualQty: number;
  noCode: boolean;
}

export interface ConfirmProductAbort {
  confirmed: false;
}

export type ConfirmProductOutcome = ConfirmProductResult | ConfirmProductAbort;

// ─── Props y emits ────────────────────────────────────────────────────────────

const props = defineProps<{
  item: OrderItemFull;
  // resolve es la función que cierra el modal y devuelve el resultado
  // OrderBreakdown la pasa al abrir el modal
  resolve: (result: ConfirmProductOutcome) => void;
}>();

// ─── Estado ───────────────────────────────────────────────────────────────────

type Step = 'scan' | 'qty';

const step = ref<Step>('scan');
const scannedCode = ref('');
const scanError = ref('');
const noCodeConfirmed = ref(false);
const actualQty = ref<number>(props.item.quantity); // por defecto la cantidad pedida

const inputRef = ref<InstanceType<typeof AppInput> | null>(null);
const qtyInputRef = ref<HTMLInputElement | null>(null);

// ─── Paso 1: Verificar código ─────────────────────────────────────────────────

function handleVerify(): void {
  scanError.value = '';
  const trimmed = scannedCode.value.trim();

  if (!trimmed) {
    scanError.value = 'Ingresa o escanea el código del producto.';
    return;
  }

  // Comparamos como string para manejar códigos con ceros iniciales
  if (trimmed !== String(props.item.product.code).trim()) {
    scanError.value = `Código incorrecto. Se esperaba: ${props.item.product.code}`;
    scannedCode.value = '';
    // Re-focus para que el scanner pueda intentar de nuevo
    nextTick(() => inputRef.value?.focus());
    return;
  }

  // Código correcto → paso 2
  noCodeConfirmed.value = false;
  goToQtyStep();
}

function handleNoCode(): void {
  // Para productos sin código (frutas, verduras, granel)
  // el usuario confirma explícitamente que no tiene código
  noCodeConfirmed.value = true;
  goToQtyStep();
}

function goToQtyStep(): void {
  step.value = 'qty';
  actualQty.value = props.item.quantity;
  nextTick(() => {
    qtyInputRef.value?.focus();
    qtyInputRef.value?.select();
  });
}

// ─── Paso 2: Confirmar cantidad ───────────────────────────────────────────────

function handleConfirm(): void {
  if (!actualQty.value || actualQty.value <= 0) return;

  props.resolve({
    confirmed: true,
    actualQty: actualQty.value,
    noCode: noCodeConfirmed.value,
  });
}

// ─── Clases dinámicas de cantidad ─────────────────────────────────────────────

const qtyDiffClass = computed(() => {
  if (!actualQty.value || actualQty.value <= 0) return 'border-slate-200 bg-slate-50';
  if (actualQty.value < props.item.quantity) return 'border-amber-300 bg-amber-50';
  return 'border-emerald-300 bg-emerald-50';
});

const qtyDiffLabelClass = computed(() => {
  if (!actualQty.value || actualQty.value <= 0) return 'text-slate-400';
  if (actualQty.value < props.item.quantity) return 'text-amber-600';
  return 'text-emerald-600';
});

const qtyDiffValueClass = computed(() => {
  if (!actualQty.value || actualQty.value <= 0) return 'text-slate-300';
  if (actualQty.value < props.item.quantity) return 'text-amber-600';
  return 'text-emerald-700';
});
</script>
