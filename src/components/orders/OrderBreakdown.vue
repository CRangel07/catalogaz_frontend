<template>
  <div class="relative">
    <div v-if="Array.isArray(items)" class="flex flex-col gap-2">
      <!-- Acción -->
      <div class="flex justify-end">
        <ButtonUI theme="success" size="sm" :icon="QrCode" @click="handleQR()">Generar QR</ButtonUI>
      </div>

      <!-- Items -->
      <div
        v-for="item in items"
        :key="item.id"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200">
        <!-- Imagen -->
        <img
          :src="`${BASE}${item.product.imageThumbnailUrl}`"
          :alt="item.product.name"
          class="w-11 h-11 rounded-lg object-cover border border-slate-100 shrink-0"
          loading="lazy" />

        <!-- Info producto -->
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-slate-700 truncate leading-tight">
            {{ item.product.name }}
          </p>
          <div class="flex items-center gap-1.5 mt-1">
            <span class="text-sm font-bold text-azul">{{ formatMXN(item.unitPrice) }}</span>
            <span class="text-slate-300 text-xs">c/u</span>
          </div>
        </div>

        <!-- Cantidad prominente -->
        <div
          class="shrink-0 flex flex-col items-center justify-center bg-azul/5 border border-azul/15 rounded-xl px-3 py-1.5 min-w-14">
          <span class="text-2xl font-black text-azul leading-none tabular-nums">
            {{ item.quantity }}
          </span>
          <span class="text-[9px] font-semibold text-azul/80 uppercase tracking-wider mt-0.5">
            piezas
          </span>
        </div>

        <!-- Checkboxes -->
        <div class="flex items-center gap-3 shrink-0 select-none">
          <!-- No hay -->
          <label class="flex flex-col items-center gap-1 cursor-pointer group">
            <span
              class="text-[10px] font-semibold text-slate-400 group-hover:text-red-400 transition-colors uppercase tracking-wide">
              No hay
            </span>
            <button
              type="button"
              role="checkbox"
              :aria-checked="noHayChecked[item.id]"
              @click="noHayChecked[item.id] = !noHayChecked[item.id]"
              class="w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-150"
              :class="
                noHayChecked[item.id]
                  ? 'bg-red-500 border-red-500'
                  : 'bg-white border-slate-200 group-hover:border-red-300'
              ">
              <X v-if="noHayChecked[item.id]" :size="14" class="text-white" :stroke-width="3" />
            </button>
          </label>

          <!-- Listo -->
          <label class="flex flex-col items-center gap-1 cursor-pointer group">
            <span
              class="text-[10px] font-semibold text-slate-400 group-hover:text-emerald-500 transition-colors uppercase tracking-wide">
              Listo
            </span>
            <button
              type="button"
              role="checkbox"
              :aria-checked="listoChecked[item.id]"
              @click="listoChecked[item.id] = !listoChecked[item.id]"
              class="w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-150"
              :class="
                listoChecked[item.id]
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'bg-white border-slate-200 group-hover:border-emerald-300'
              ">
              <Check v-if="listoChecked[item.id]" :size="14" class="text-white" :stroke-width="3" />
            </button>
          </label>
        </div>

        <!-- Subtotal -->
        <div class="shrink-0 text-right">
          <p class="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Subtotal</p>
          <p class="text-sm font-extrabold text-azul">
            {{ formatMXN(item.quantity * item.unitPrice) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import QRCode from '../general/QRCode.vue';
import ButtonUI from '../ui/atoms/ButtonUI.vue';

import type { OrderItemWithProduct } from '@/types/db';

import { useModal } from '@/composables/useModal';
import { reactive } from 'vue';
import { formatMXN } from '@/helpers/currencyMxn';
import { QrCode, Check, X } from 'lucide-vue-next';

import Logo from '@/assets/logo.png';
const BASE = import.meta.env.VITE_ASSETS_URL;

const { openModal } = useModal();

defineProps<{ items: OrderItemWithProduct[] }>();

const handleQR = () => {
  //TODO Terminar QR dinamico
  openModal(QRCode, {
    value: `2*7640\r`,
    size: 300,
    logoUrl: Logo,
    downloadName: 'myqrcito',
  });
};

// Estado local de checkboxes indexado por item.id
const noHayChecked = reactive<Record<number, boolean>>({});
const listoChecked = reactive<Record<number, boolean>>({});
</script>
