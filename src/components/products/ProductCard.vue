<template>
  <div class="group relative w-64 cursor-pointer select-none">
    <div
      class="relative overflow-hidden rounded-2xl bg-white border border-blue-100 shadow-[0_4px_24px_rgba(30,64,175,0.10)] transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_16px_40px_rgba(30,64,175,0.18)]">
      <!-- Top accent bar -->
      <div class="h-1.5 w-full bg-linear-to-r from-azul via-azul/90 to-naranja" />

      <div class="bg-azul px-4 py-2 flex items-center justify-between"></div>

      <!-- Image area -->
      <div
        class="relative flex items-end justify-center bg-linear-to-b from-blue-50 to-white px-6 pb-2 pt-8 transition-transform duration-500 group-hover:scale-105"
        @click.stop="handleClick">
        <div
          class="absolute bottom-0 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-orange-300/20 blur-2xl transition-all duration-500 group-hover:bg-naranja/30" />
        <Image :url="product.imageThumbnailUrl" :alt="product.name + 'imagen'" />
      </div>

      <!-- Content -->
      <div class="px-5 pb-5 pt-3">
        <h3 class="font-bold text-lg leading-tight text-azul">{{ product.name }}</h3>

        <!-- Divider -->
        <div class="my-3 h-px bg-linear-to-r from-naranja/60 via-naranja-300/40 to-transparent" />

        <!-- Details row -->
        <div class="flex items-center justify-between text-xs text-slate-400">
          <span class="flex items-center gap-1">
            <span
              class="inline-block h-1.5 w-1.5 rounded-full"
              :class="product.isActive ? 'bg-green-500' : 'bg-red-400'" />
            {{ product.isActive ? 'Disponible' : 'Agotado' }}
          </span>
        </div>

        <span class="text-slate-500 text-sm" v-if="product.description">
          {{ product.description }}
        </span>

        <!-- Price -->
        <div class="mt-3">
          <p class="text-2xl font-extrabold tracking-tight text-azul">
            {{ product.price.toFixed(2).split('.')[0] }}
            <span class="text-base font-semibold text-naranja">
              .{{ String(product.price.toFixed(2)).split('.')[1] }}
            </span>
          </p>
          <!-- Subtotal dinámico basado en la cantidad LOCAL (antes de agregar) -->
          <p v-if="qty > 1" class="text-xs text-blue-500 font-medium mt-0.5">
            Subtotal: ${{ (product.price * qty).toFixed(2) }}
          </p>
        </div>

        <!-- Quantity selector + CTA -->
        <div class="mt-4 flex items-center justify-between gap-2">
          <!--
            El contador controla localQty (cuánto quieres agregar).
            NO toca el store hasta que presiones "Agregar".
          -->
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
              :max="999"
              :min="1"
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
              :disabled="qty >= cartStore.MAX_QTY">
              +
            </button>
          </div>

          <!-- Botón agregar -->
          <button
            v-if="!inCart"
            @click="addToCart"
            :disabled="!product.isActive"
            class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-naranja px-3 py-2.5 text-xs font-bold text-orange-50 shadow-[0_4px_14px_rgba(249,115,22,0.35)] transition-all duration-300 hover:bg-orange-600 hover:shadow-[0_6px_20px_rgba(249,115,22,0.45)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
            <ShoppingCart :size="16" />
            Agregar
          </button>

          <!-- Botón quitar -->
          <button
            v-else
            @click="removeFromCart"
            class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-100 px-3 py-2.5 text-xs font-bold text-blue-700 transition-all duration-300 hover:bg-red-50 hover:text-red-500 active:scale-95">
            <ShoppingCart :size="16" />
            Quitar
          </button>
        </div>

        <!-- Feedback al agregar -->
        <transition
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
        </transition>
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

// item del carrito si existe
const cartItem = computed(() => items.value.find((i) => i.id === props.product.id));

// está en carrito
const inCart = computed(() => !!cartItem.value);

// cantidad SIEMPRE sincronizada
const qty = computed({
  get() {
    return cartItem.value?.qty ?? localQty.value;
  },
  set(value: number) {
    if (!cartItem.value) {
      localQty.value = value;
      return;
    }

    const delta = value - cartItem.value.qty;
    cartStore.changeQty(cartItem.value.id, delta);
  },
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function increment() {
  if (qty.value < cartStore.MAX_QTY) {
    qty.value = qty.value + 1;
  }
}

function decrement() {
  if (qty.value > cartStore.MIN_QTY) {
    qty.value = qty.value - 1;
  }
}

// ── Actions ───────────────────────────────────────────────────────────────────

function addToCart() {
  if (!props.product.isActive) return;

  const productCard: ProductCard = {
    id: props.product.id,
    name: props.product.name,
    code: props.product.code,
    price: props.product.price,
    stock: props.product.stock,
    imageThumbnailUrl: props.product.imageThumbnailUrl,
    isActive: props.product.isActive,
  };

  lastAdded.value = localQty.value;
  cartStore.addItem(productCard, localQty.value);

  added.value = true;
  if (feedbackTimer) clearTimeout(feedbackTimer);
  feedbackTimer = setTimeout(() => (added.value = false), 2500);
}

function removeFromCart() {
  cartStore.removeItem(props.product.id);
  localQty.value = 1;
}

function handleClick() {
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
  if (!item) {
    localQty.value = 1;
  }
});
</script>
