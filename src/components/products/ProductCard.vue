<template>
  <div class="group relative w-64 h-full cursor-pointer select-none">
    <!-- Overlay no disponible -->
    <div
      v-if="!product.isActive"
      class="h-full w-full bg-slate-800/70 absolute z-30 cursor-not-allowed rounded-2xl flex items-center justify-center backdrop-blur-[1px]">
      <span class="text-xl italic font-semibold text-slate-300 tracking-wide">No disponible</span>
    </div>

    <div
      class="relative overflow-hidden rounded-2xl bg-white border border-blue-100 shadow-[0_4px_24px_rgba(30,64,175,0.10)] transition-all duration-500 group-hover:shadow-[0_16px_40px_rgba(30,64,175,0.18)] flex flex-col h-full">
      <!-- Top accent bar -->
      <div class="h-2.5 w-full bg-linear-to-r from-azul to-naranja shrink-0" />

      <!-- Image area -->
      <div
        class="relative flex items-end justify-center bg-linear-to-b from-blue-50 to-white px-6 pb-2 pt-8 transition-transform duration-500"
        :class="{ 'group-hover:scale-105': product.isActive }"
        @click.stop="handleClick">
        <div
          class="absolute bottom-0 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-orange-300/20 blur-2xl transition-all duration-500 group-hover:bg-naranja/30" />
        <Image :url="product.imageThumbnailUrl" :alt="product.name + ' imagen'" />
      </div>

      <!-- Content -->
      <div class="px-5 pb-5 pt-3 flex flex-col flex-1">
        <div class="flex-1">
          <!-- Código + status -->
          <div class="flex items-center justify-between mb-0.5">
            <h4 class="text-xs font-mono text-slate-400">#{{ product.code }}</h4>
            <span class="flex items-center gap-1 text-xs text-slate-400">
              <span
                class="inline-block h-1.5 w-1.5 rounded-full"
                :class="product.isActive ? 'bg-green-500' : 'bg-red-400'" />
              {{ product.isActive ? 'Disponible' : 'Agotado' }}
            </span>
          </div>

          <!-- Nombre -->
          <h3 class="font-bold text-base leading-tight text-azul">{{ product.name }}</h3>

          <!-- Divider -->
          <div class="my-2.5 h-px bg-linear-to-r from-naranja/60 via-naranja/30 to-transparent" />

          <!-- Descripción -->
          <p
            v-if="product.description"
            class="text-slate-500 text-xs mt-1 line-clamp-3 min-h-10 leading-relaxed">
            {{ product.description }}
          </p>
        </div>

        <!-- ── FOOTER ── -->
        <div class="mt-3">
          <!-- Precios -->
          <div class="min-h-16">
            <!-- Con precio normal: mostrar oferta vs normal -->
            <template v-if="product.salePrice">
              <!-- Badge oferta -->
              <div class="flex items-center gap-2 mb-0.5">
                <span
                  class="bg-naranja/10 text-naranja text-[10px] font-bold px-1.5 py-0.5 rounded-md tracking-wide uppercase">
                  Oferta
                </span>
              </div>

              <!-- Precio oferta grande -->
              <div class="flex items-baseline gap-1">
                <p class="text-2xl font-extrabold tracking-tight text-azul leading-none">
                  {{ formatMXNNoCents(priceInt)
                  }}<span class="text-base font-semibold text-naranja">.{{ priceCents }}</span>
                </p>
              </div>

              <!-- Precio normal tachado -->
              <p class="text-xs text-slate-400 line-through mt-0.5">
                Normal: {{ formatMXNNoCents(normalPriceInt) }}.{{ normalPriceCents }}
              </p>
            </template>

            <!-- Sin precio normal: solo precio oferta -->
            <template v-else>
              <p class="text-2xl font-extrabold tracking-tight text-azul mt-1 leading-none">
                {{ formatMXNNoCents(priceInt)
                }}<span class="text-base font-semibold text-naranja">.{{ priceCents }}</span>
              </p>
            </template>

            <!-- Subtotal -->
            <p class="text-xs text-blue-500 font-medium mt-1 h-4">
              <span v-if="qty > 1">Subtotal: ${{ (product.price1 * qty).toFixed(2) }}</span>
            </p>
          </div>

          <!-- Cantidad máxima hint -->
          <p
            v-if="product.maxQuantity"
            class="text-[10px] text-slate-400 mb-2 flex items-center gap-1">
            <span class="inline-block w-1 h-1 rounded-full bg-naranja/60"></span>
            Máx. {{ product.maxQuantity }} unidades por pedido
          </p>

          <!-- Selector cantidad + CTA -->
          <div class="flex items-center justify-between gap-2 mt-2">
            <!-- Contador -->
            <div class="flex items-center rounded-xl border-2 border-blue-100 overflow-hidden">
              <button
                @click="decrement"
                class="w-8 h-9 flex items-center justify-center text-blue-700 font-bold text-lg hover:bg-blue-50 transition-colors duration-150 active:scale-90 disabled:opacity-30 cursor-pointer"
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
                class="w-8 h-9 flex items-center justify-center text-orange-500 font-bold text-lg hover:bg-orange-50 transition-colors duration-150 active:scale-90 disabled:opacity-30 cursor-pointer"
                :disabled="qty >= effectiveMax">
                +
              </button>
            </div>

            <!-- Botón agregar -->
            <button
              v-if="!inCart"
              @click="addToCart"
              :disabled="!product.isActive"
              class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-naranja px-3 py-2.5 text-xs font-bold text-orange-50 shadow-[0_4px_14px_rgba(249,115,22,0.35)] transition-all duration-300 hover:bg-orange-600 hover:shadow-[0_6px_20px_rgba(249,115,22,0.45)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
              <ShoppingCart :size="15" />
              Agregar
            </button>

            <!-- Botón quitar -->
            <button
              v-else
              @click="removeFromCart"
              class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-100 px-3 py-2.5 text-xs font-bold text-blue-700 transition-all duration-300 hover:bg-red-50 hover:text-red-500 active:scale-95">
              <ShoppingCart :size="15" />
              Quitar
            </button>
          </div>

          <!-- Feedback agregado -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1">
            <p
              v-if="added"
              class="mt-2 text-center text-xs font-semibold text-green-600 flex items-center justify-center gap-1">
              <svg
                class="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              {{ lastAdded }} unidad{{ lastAdded !== 1 ? 'es' : '' }} agregada{{
                lastAdded !== 1 ? 's' : ''
              }}
              al carrito
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

import type { Product, ProductCard } from '@/types/db';

import { computed, ref, watch } from 'vue';
import { ShoppingCart } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';

import { useModal } from '@/composables/useModal';
import { useCartStore } from '@/stores/cart.store';
import { formatMXNNoCents } from '@/helpers/currencyMxn';

// ── Store ─────────────────────────────────────────────────────────────────────

const cartStore = useCartStore();
const { items } = storeToRefs(cartStore);

// ── Props ─────────────────────────────────────────────────────────────────────

const props = defineProps<{
  product: Product;
}>();

// ── Modal ─────────────────────────────────────────────────────────────────────

const { openModal } = useModal();

// ── Estado local ──────────────────────────────────────────────────────────────

const localQty = ref(1);
const added = ref(false);
const lastAdded = ref(1);

let feedbackTimer: ReturnType<typeof setTimeout> | null = null;

// ── Computed ──────────────────────────────────────────────────────────────────

// Máximo efectivo: el menor entre MAX_QTY del store y maxQuantity del producto
const effectiveMax = computed(() => {
  if (props.product.maxQuantity) {
    return Math.min(cartStore.MAX_QTY, props.product.maxQuantity);
  }
  return cartStore.MAX_QTY;
});

const cartItem = computed(() => items.value.find((i) => i.id === props.product.id));
const inCart = computed(() => !!cartItem.value);

const qty = computed({
  get() {
    return cartItem.value?.qty ?? localQty.value;
  },
  set(value: number) {
    // Clampear entre min y max al escribir manualmente
    const clamped = Math.max(cartStore.MIN_QTY, Math.min(effectiveMax.value, value));

    if (!cartItem.value) {
      localQty.value = clamped;
      return;
    }

    const delta = clamped - cartItem.value.qty;
    cartStore.changeQty(cartItem.value.id, delta);
  },
});

// ── Precio oferta ─────────────────────────────────────────────────────────────

const priceFixed = computed(() => props.product.price1.toFixed(2));
const priceInt = computed(() => Number(priceFixed.value.split('.')[0]));
const priceCents = computed(() => priceFixed.value.split('.')[1]);

// ── Precio normal (tachado) ───────────────────────────────────────────────────

const normalPriceFixed = computed(() =>
  props.product.salePrice ? props.product.salePrice.toFixed(2) : null
);
const normalPriceInt = computed(() =>
  normalPriceFixed.value ? Number(normalPriceFixed.value.split('.')[0]) : 0
);
const normalPriceCents = computed(() =>
  normalPriceFixed.value ? normalPriceFixed.value.split('.')[1] : '00'
);

// ── Helpers ───────────────────────────────────────────────────────────────────

function increment(): void {
  if (qty.value < effectiveMax.value) qty.value = qty.value + 1;
}

function decrement(): void {
  if (qty.value > cartStore.MIN_QTY) qty.value = qty.value - 1;
}

// ── Actions ───────────────────────────────────────────────────────────────────

function addToCart(): void {
  if (!props.product.isActive) return;

  const productCard: ProductCard = {
    id: props.product.id,
    name: props.product.name,
    code: props.product.code,
    price: props.product.price1,
    imageThumbnailUrl: props.product.imageThumbnailUrl,
    maxQuantity: props.product.maxQuantity,
    isActive: props.product.isActive,
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
    {
      name: props.product.name,
      imageFullUrl: props.product.imageFullUrl,
    },
    { closeOnBackdrop: true, closeOnEsc: true, size: 'xl' }
  );
}

watch(cartItem, (item) => {
  if (!item) localQty.value = 1;
});
</script>
