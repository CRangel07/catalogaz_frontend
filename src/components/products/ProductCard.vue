<template>
  <div class="group relative w-64 h-full cursor-pointer select-none">
    <!-- Badge OFERTA pill flotante centrado arriba -->
    <div
      v-if="product.isOffer"
      class="absolute top-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
      <span
        class="flex items-center gap-1 bg-linear-to-r from-orange-500 to-red-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_4px_12px_rgba(239,68,68,0.4)]">
        🔥 OFERTA
      </span>
    </div>

    <!-- Overlay no disponible -->
    <div
      v-if="!product.isActive"
      class="h-full w-full bg-slate-800/70 absolute z-30 cursor-not-allowed rounded-2xl flex items-center justify-center backdrop-blur-[1px]">
      <span class="text-xl italic font-semibold text-slate-300 tracking-wide">No disponible</span>
    </div>

    <div
      class="relative overflow-hidden rounded-2xl bg-white border shadow-[0_4px_24px_rgba(30,64,175,0.10)] transition-all duration-500 group-hover:shadow-[0_16px_40px_rgba(30,64,175,0.18)] flex flex-col h-full"
      :class="product.isOffer ? 'border-orange-200' : 'border-blue-100'">
      <!-- Top accent bar -->
      <div
        class="h-2.5 w-full shrink-0"
        :class="
          product.isOffer
            ? 'bg-linear-to-r from-orange-500 via-red-400 to-orange-500'
            : 'bg-linear-to-r from-azul to-naranja'
        " />

      <!-- Image area -->
      <div
        class="relative flex items-end justify-center bg-linear-to-b from-blue-50 to-white px-6 pb-2 pt-8 transition-transform duration-500"
        :class="{ 'group-hover:scale-105': product.isActive }"
        @click.stop="handleClick">
        <div
          class="absolute bottom-0 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full blur-2xl transition-all duration-500"
          :class="
            product.isOffer
              ? 'bg-orange-200/40 group-hover:bg-orange-300/50'
              : 'bg-orange-300/20 group-hover:bg-naranja/30'
          " />
        <Image
          :url="product.imageThumbnailUrl"
          :alt="product.name + ' imagen'"
          :updated-at="product.updatedAt" />
      </div>

      <!-- Content -->
      <div class="px-4 pb-4 pt-3 flex flex-col flex-1">
        <div class="flex-1">
          <div class="flex items-center justify-between mb-0.5">
            <h4 class="text-xs font-mono text-slate-400">#{{ product.code }}</h4>
            <span class="flex items-center gap-1 text-xs text-slate-400">
              <span
                class="inline-block h-1.5 w-1.5 rounded-full"
                :class="product.isActive ? 'bg-green-500' : 'bg-red-400'" />
              {{ product.isActive ? 'Disponible' : 'Agotado' }}
            </span>
          </div>

          <h3
            class="font-bold text-sm leading-tight"
            :class="product.isOffer ? 'text-orange-900' : 'text-azul'">
            {{ product.name }}
          </h3>

          <div class="my-2 h-px bg-linear-to-r from-naranja/60 via-naranja/30 to-transparent" />

          <p
            v-if="product.description"
            class="text-slate-500 text-xs line-clamp-2 min-h-8 leading-relaxed">
            {{ product.description }}
          </p>
        </div>

        <!-- ── PRECIOS ──────────────────────────────────────────────── -->
        <div class="mt-2">
          <!-- OFERTA -->
          <template v-if="product.isOffer && product.salePrice">
            <div class="flex items-start justify-between gap-2 mb-1">
              <div>
                <span
                  class="text-[9px] font-black uppercase tracking-widest text-orange-500 block mb-0.5">
                  Precio especial
                </span>
                <p class="text-2xl font-black text-orange-600 leading-none tabular-nums">
                  {{ formatMXNNoCents(priceInt)
                  }}<span class="text-sm font-bold">.{{ priceCents }}</span>
                </p>
                <p class="text-xs text-slate-400 line-through mt-0.5">
                  ${{ Number(product.price1).toFixed(2) }}
                </p>
              </div>
              <div
                v-if="Number(savings) > 0"
                class="flex flex-col items-center bg-orange-50 border border-orange-200 rounded-xl px-2 py-1.5 shrink-0">
                <span
                  class="text-[8px] font-black uppercase tracking-widest text-orange-400 leading-none"
                  >ahorras</span
                >
                <span class="text-sm font-black text-orange-600 tabular-nums mt-0.5 leading-none">
                  ${{ savings }}
                </span>
              </div>
            </div>
          </template>

          <!-- PRECIO ESCALONADO -->
          <template v-else>
            <div class="flex items-end justify-between gap-1.5 mb-1">
              <div class="flex-1">
                <span
                  class="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-0.5">
                  {{ qty >= 4 ? '✓ Precio mayoreo' : 'Precio unitario' }}
                </span>
                <p
                  class="text-2xl font-black leading-none tabular-nums"
                  :class="qty >= 4 ? 'text-emerald-600' : 'text-azul'">
                  {{ formatMXNNoCents(priceInt)
                  }}<span class="text-sm font-bold text-naranja">.{{ priceCents }}</span>
                </p>
              </div>

              <!-- Bloque precio mayoreo — solo si price4 < price1 -->
              <div
                v-if="hasTieredPricing"
                class="flex flex-col items-center rounded-xl border px-2 py-1.5 transition-all duration-300 shrink-0"
                :class="
                  qty >= 4
                    ? 'bg-emerald-50 border-emerald-300 shadow-sm'
                    : 'bg-slate-50 border-slate-200'
                ">
                <span
                  class="text-[8px] font-black uppercase tracking-widest leading-none"
                  :class="qty >= 4 ? 'text-emerald-600' : 'text-slate-400'">
                  4+ uds
                </span>
                <span
                  class="text-sm font-black tabular-nums leading-tight mt-0.5"
                  :class="qty >= 4 ? 'text-emerald-600' : 'text-slate-500'">
                  ${{ Number(product.price4).toFixed(2) }}
                </span>
                <span
                  class="text-[8px] leading-none mt-0.5 font-bold"
                  :class="qty >= 4 ? 'text-emerald-500' : 'text-slate-400'">
                  {{ qty >= 4 ? '✓ activo' : 'c/u' }}
                </span>
              </div>
            </div>

            <!-- Hint incentivo mayoreo -->
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 -translate-y-1 max-h-0"
              enter-to-class="opacity-100 translate-y-0 max-h-12"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0 max-h-12"
              leave-to-class="opacity-0 -translate-y-1 max-h-0">
              <p
                v-if="hasTieredPricing && qty < 4"
                class="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 border border-emerald-100 rounded-lg px-2 py-1 mb-1">
                💡 Lleva {{ 4 - qty }} más → ${{ Number(product.price4).toFixed(2) }} c/u
              </p>
            </Transition>
          </template>

          <!-- Subtotal -->
          <p
            class="text-xs font-semibold mt-1 h-4"
            :class="qty >= 4 && !product.isOffer ? 'text-emerald-600' : 'text-blue-500'">
            <span v-if="qty > 1">{{ qty }} uds: ${{ (unitPrice * qty).toFixed(2) }}</span>
          </p>

          <!-- Hint máx cantidad -->
          <p
            v-if="product.maxQuantity"
            class="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <span class="w-1 h-1 rounded-full bg-naranja/60 inline-block" />
            Máx. {{ product.maxQuantity }} por pedido
          </p>

          <!-- Selector + CTA -->
          <div class="flex items-center justify-between gap-2 mt-2">
            <div
              class="flex items-center rounded-xl border-2 overflow-hidden transition-colors duration-300"
              :class="qty >= 4 && !product.isOffer ? 'border-emerald-200' : 'border-blue-100'">
              <button
                @click="decrement"
                class="w-8 h-9 flex items-center justify-center font-bold text-lg hover:bg-blue-50 transition-colors active:scale-90 disabled:opacity-30 cursor-pointer text-blue-700"
                :disabled="qty <= cartStore.MIN_QTY">
                −
              </button>
              <input
                type="number"
                step="1"
                :min="1"
                :max="effectiveMax"
                v-model="qty"
                :class="{
                  'pl-5 w-13': qty < 10,
                  'pl-4 w-13': qty >= 10 && qty < 100,
                  'pl-3 w-14': qty >= 100,
                }"
                class="h-9 flex outline-none items-center justify-center text-sm font-extrabold text-blue-900 border-x-2 border-blue-100 tabular-nums" />
              <button
                @click="increment"
                class="w-8 h-9 flex items-center justify-center font-bold text-lg hover:bg-orange-50 transition-colors active:scale-90 disabled:opacity-30 cursor-pointer text-orange-500"
                :disabled="qty >= effectiveMax">
                +
              </button>
            </div>

            <button
              v-if="!inCart"
              @click="addToCart"
              :disabled="!product.isActive"
              class="flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold text-white transition-all duration-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              :class="
                product.isOffer
                  ? 'bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-[0_4px_14px_rgba(239,68,68,0.3)]'
                  : 'bg-naranja hover:bg-orange-600 shadow-[0_4px_14px_rgba(249,115,22,0.35)]'
              ">
              <ShoppingCart :size="14" />
              Agregar
            </button>

            <button
              v-else
              @click="removeFromCart"
              class="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-100 px-3 py-2.5 text-xs font-bold text-blue-700 transition-all hover:bg-red-50 hover:text-red-500 active:scale-95">
              <ShoppingCart :size="14" />
              Quitar
            </button>
          </div>

          <!-- Feedback -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1">
            <p
              v-if="added"
              class="mt-1.5 text-center text-xs font-semibold text-green-600 flex items-center justify-center gap-1">
              <svg
                class="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              {{ lastAdded }} unidad{{ lastAdded !== 1 ? 'es' : '' }} al carrito
            </p>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Image from '../ui/molecules/ImageNotFound.vue';
import ProductFullImage from './ProductFullImage.vue';

import type { Product } from '@/types/db';

import { storeToRefs } from 'pinia';
import { ShoppingCart } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';

import { useModal } from '@/composables/useModal';
import { formatMXNNoCents } from '@/helpers/currencyMxn';
import { useCartStore, type CartItem } from '@/stores/cart.store';

const cartStore = useCartStore();
const { items } = storeToRefs(cartStore);

const props = defineProps<{ product: Product }>();
const { openModal } = useModal();

const localQty = ref(1);
const added = ref(false);
const lastAdded = ref(1);
let feedbackTimer: ReturnType<typeof setTimeout> | null = null;

const effectiveMax = computed(() => {
  if (props.product.maxQuantity) return Math.min(cartStore.MAX_QTY, props.product.maxQuantity);
  return cartStore.MAX_QTY;
});

const cartItem = computed(() => items.value.find((i) => i.id === props.product.id));
const inCart = computed(() => !!cartItem.value);

const qty = computed({
  get() {
    return cartItem.value?.qty ?? localQty.value;
  },
  set(value: number) {
    const clamped = Math.max(cartStore.MIN_QTY, Math.min(effectiveMax.value, value));
    if (!cartItem.value) {
      localQty.value = clamped;
      return;
    }
    cartStore.changeQty(cartItem.value.id, clamped - cartItem.value.qty);
  },
});

// ── Lógica de precio — espeja resolveUnitPrice() del backend ──────────────────
const unitPrice = computed<number>(() => {
  if (props.product.isOffer && props.product.salePrice) {
    return Number(props.product.salePrice);
  }
  return qty.value >= 4 ? Number(props.product.price4) : Number(props.product.price1);
});

// price4 < price1 → el precio baja con más volumen → mostramos incentivo
const hasTieredPricing = computed(
  () => !props.product.isOffer && Number(props.product.price4) < Number(props.product.price1)
);

const savings = computed(() => {
  if (!props.product.salePrice) return '0.00';
  return (Number(props.product.price1) - Number(props.product.salePrice)).toFixed(2);
});

const priceFixed = computed(() => unitPrice.value.toFixed(2));
const priceInt = computed(() => Number(priceFixed.value.split('.')[0]));
const priceCents = computed(() => priceFixed.value.split('.')[1]);

function increment(): void {
  if (qty.value < effectiveMax.value) qty.value = qty.value + 1;
}
function decrement(): void {
  if (qty.value > cartStore.MIN_QTY) qty.value = qty.value - 1;
}

function addToCart(): void {
  if (!props.product.isActive) return;
  const productCard: CartItem = {
    id: props.product.id,
    name: props.product.name,
    code: props.product.code,

    // precio actual (opcional)
    price: unitPrice.value,

    // precios reales
    price1: Number(props.product.price1),
    price4: Number(props.product.price4),
    salePrice: props.product.salePrice ? Number(props.product.salePrice) : null,

    isOffer: props.product.isOffer,

    imageThumbnailUrl: props.product.imageThumbnailUrl,
    maxQuantity: props.product.maxQuantity,
    isActive: props.product.isActive,

    qty: 1,
  };
  lastAdded.value = localQty.value;
  cartStore.addItem(productCard, localQty.value);
  added.value = true;
  if (feedbackTimer) clearTimeout(feedbackTimer);
  feedbackTimer = setTimeout(() => (added.value = false), 2500);
}

function removeFromCart(): void {
  cartStore.removeItem(props.product.id);
  localQty.value = 1;
}

function handleClick(): void {
  openModal(
    ProductFullImage,
    { name: props.product.name, imageFullUrl: props.product.imageFullUrl },
    { closeOnBackdrop: true, closeOnEsc: true, size: 'xl' }
  );
}

watch(cartItem, (item) => {
  if (!item) localQty.value = 1;
});
</script>
