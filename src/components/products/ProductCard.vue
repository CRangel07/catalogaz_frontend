<template>
  <div class="group relative w-64 cursor-pointer select-none">
    <div
      class="relative overflow-hidden rounded-2xl bg-white border border-blue-100 shadow-[0_4px_24px_rgba(30,64,175,0.10)] transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_16px_40px_rgba(30,64,175,0.18)]">
      <!-- Top accent bar -->
      <div class="h-1.5 w-full bg-linear-to-r from-azul via-azul/90 to-naranja" />

      <!-- Header azul -->
      <div class="bg-azul px-4 py-2 flex items-center justify-between">
        <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
          {{ product.brand }}
        </p>
      </div>

      <!-- Image area -->
      <div
        class="relative flex items-end justify-center bg-linear-to-b from-blue-50 to-white px-6 pb-2 pt-8 transition-transform duration-500 group-hover:scale-105">
        <div
          class="absolute bottom-0 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-orange-300/20 blur-2xl transition-all duration-500 group-hover:bg-naranja/30" />
        <img
          :src="product.imageUrl"
          :alt="product.name"
          class="relative z-10 h-52 w-auto object-contain drop-shadow-[0_8px_16px_rgba(30,64,175,0.2)]" />
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
              :class="product.available ? 'bg-green-500' : 'bg-red-400'" />
            {{ product.available ? 'Disponible' : 'Agotado' }}
          </span>
          <span v-if="product.detail">{{ product.detail }}</span>
        </div>

        <!-- Price -->
        <div class="mt-3">
          <span v-if="product.originalPrice" class="text-xs text-slate-400 line-through">
            ${{ product.originalPrice.toFixed(2) }}
          </span>
          <p class="text-2xl font-extrabold tracking-tight text-azul">
            ${{ Math.floor(product.price)
            }}<span class="text-base font-semibold text-naranja">
              .{{ String(product.price.toFixed(2)).split('.')[1] }}
            </span>
          </p>
          <!-- Subtotal dinámico -->
          <p v-if="quantity > 1" class="text-xs text-blue-500 font-medium mt-0.5">
            Subtotal: ${{ (product.price * quantity).toFixed(2) }}
          </p>
        </div>

        <!-- Quantity selector + CTA -->
        <div class="mt-4 flex items-center justify-between gap-2">
          <!-- Contador numérico -->
          <div class="flex items-center rounded-xl border-2 border-blue-100 overflow-hidden">
            <button
              @click="decrement"
              class="w-8 h-9 flex items-center justify-center text-blue-700 font-bold text-lg hover:bg-blue-50 transition-colors duration-150 active:scale-90 disabled:opacity-30"
              :disabled="quantity <= 1">
              −
            </button>
            <span
              class="w-9 h-9 flex items-center justify-center text-sm font-extrabold text-blue-900 border-x-2 border-blue-100 tabular-nums">
              {{ quantity }}
            </span>
            <button
              @click="increment"
              class="w-8 h-9 flex items-center justify-center text-orange-500 font-bold text-lg hover:bg-orange-50 transition-colors duration-150 active:scale-90 disabled:opacity-30"
              :disabled="quantity >= 99">
              +
            </button>
          </div>

          <!-- Botón agregar -->
          <button
            @click="addToCart"
            :disabled="!product.available"
            class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-naranja px-3 py-2.5 text-xs font-bold text-orange-50 shadow-[0_4px_14px_rgba(249,115,22,0.35)] transition-all duration-300 hover:bg-orange-600 hover:shadow-[0_6px_20px_rgba(249,115,22,0.45)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
            <ShoppingCart :size="16" />
            Agregar
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
import { ref } from 'vue';
import { ShoppingCart } from 'lucide-vue-next';

// ── Tipos ─────────────────────────────────────────────────────────────────────
export interface ProductCardData {
  id: string;
  brand: string;
  name: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  available: boolean;
  /** Texto libre para info extra (ej: "1,200 ml", "4.5% Alc.") */
  detail?: string;
}

// ── Props ─────────────────────────────────────────────────────────────────────
const props = defineProps<{
  product: ProductCardData;
}>();

// ── Emits ─────────────────────────────────────────────────────────────────────
const emit = defineEmits<{
  // Emite el id del producto y la cantidad al agregar al carrito
  'add-to-cart': [productId: string, quantity: number];
}>();

// ── State ─────────────────────────────────────────────────────────────────────

// Inicia en 1 — si iniciara en 0, "Agregar" enviaría 0 unidades
const quantity = ref(1);
const added = ref(false);
const lastAdded = ref(1);
let timer: ReturnType<typeof setTimeout> | null = null;

// ── Handlers ──────────────────────────────────────────────────────────────────
function increment() {
  if (quantity.value < 99) quantity.value++;
}

function decrement() {
  // El botón ya está disabled cuando quantity <= 1, pero esta guardia
  // previene llamadas programáticas accidentales
  if (quantity.value > 1) quantity.value--;
}

function addToCart() {
  if (!props.product.available) return;

  lastAdded.value = quantity.value;
  emit('add-to-cart', props.product.id, quantity.value);

  added.value = true;
  quantity.value = 1;

  if (timer) clearTimeout(timer);
  timer = setTimeout(() => (added.value = false), 2500);
}
</script>
