<template>
  <div class="group relative w-64 cursor-pointer select-none">
    <div
      class="relative overflow-hidden rounded-2xl bg-white border border-blue-100 shadow-[0_4px_24px_rgba(30,64,175,0.10)] transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_16px_40px_rgba(30,64,175,0.18)]">
      <!-- Top accent bar -->
      <div class="h-1.5 w-full bg-gradient-to-r from-blue-700 via-blue-500 to-orange-400" />

      <!-- Header azul -->
      <div class="bg-blue-700 px-4 py-2 flex items-center justify-between">
        <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">Corona Extra</p>
        <span
          class="inline-flex items-center rounded-full bg-orange-400 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow">
          ★ Popular
        </span>
      </div>

      <!-- Image area -->
      <div
        class="relative flex items-end justify-center bg-gradient-to-b from-blue-50 to-white px-6 pb-2 pt-8 transition-transform duration-500 group-hover:scale-105">
        <div
          class="absolute bottom-0 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-orange-300/20 blur-2xl transition-all duration-500 group-hover:bg-orange-400/30" />
        <img
          :src="Cerveza"
          alt="Cerveza Corona Extra Mega 1.2L"
          class="relative z-10 h-52 w-auto object-contain drop-shadow-[0_8px_16px_rgba(30,64,175,0.2)]" />
      </div>

      <!-- Content -->
      <div class="px-5 pb-5 pt-3">
        <h3 class="font-bold text-lg leading-tight text-blue-900">Mega Botella 1.2L</h3>

        <!-- Divider -->
        <div
          class="my-3 h-px bg-gradient-to-r from-orange-400/60 via-orange-300/40 to-transparent" />

        <!-- Details row -->
        <div class="flex items-center justify-between text-xs text-slate-400">
          <span class="flex items-center gap-1">
            <span class="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
            Disponible
          </span>
          <span>4.5% Alc.</span>
          <span>1,200 ml</span>
        </div>

        <!-- Price -->
        <div class="mt-3">
          <span class="text-xs text-slate-400 line-through">$59.99</span>
          <p class="text-2xl font-extrabold tracking-tight text-blue-800">
            $49<span class="text-base font-semibold text-orange-500">.99</span>
          </p>
          <!-- Subtotal dinámico -->
          <p v-if="quantity > 1" class="text-xs text-blue-500 font-medium mt-0.5">
            Subtotal: ${{ (49.99 * quantity).toFixed(2) }}
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
            class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-3 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(249,115,22,0.35)] transition-all duration-300 hover:bg-orange-600 hover:shadow-[0_6px_20px_rgba(249,115,22,0.45)] active:scale-95">
            <svg
              class="h-4 w-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
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
import Cerveza from '@/assets/CERVEZA_CORONA_EXTRA_MEGA_BOTELLA_1.2L_220x.avif';

const quantity = ref(0);
const added = ref(false);
const lastAdded = ref(1);
let timer: ReturnType<typeof setTimeout> | null = null;

const increment = () => {
  if (quantity.value < 99) quantity.value++;
};

const decrement = () => {
  if (quantity.value > 0) quantity.value--;
};

const addToCart = () => {
  lastAdded.value = quantity.value;
  added.value = true;
  quantity.value = 1;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => (added.value = false), 2500);
};
</script>
