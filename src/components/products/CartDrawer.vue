<template>
  <!-- Botón flotante -->
  <button
    @click="cart.isOpen = true"
    class="fixed bottom-6 right-6 z-100 flex items-center gap-3 rounded-2xl bg-azul px-5 py-3.5 text-white shadow-[0_8px_30px_rgba(30,64,175,0.45)] transition-all duration-300 hover:bg-sky-700 cursor-pointer hover:shadow-[0_12px_36px_rgba(30,64,175,0.55)] hover:-translate-y-1 active:scale-95">
    <div class="relative">
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>
      <Transition name="pop">
        <span
          v-if="cart.totalItems > 0"
          class="absolute -top-2.5 -right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-black text-white shadow">
          {{ cart.totalItems > 99 ? '99+' : cart.totalItems }}
        </span>
      </Transition>
    </div>
    <span class="text-sm font-bold tracking-wide">Mi Pedido</span>
    <span v-if="cart.totalItems > 0" class="text-sm font-extrabold text-orange-300">
      ${{ cart.totalPrice }}
    </span>
  </button>

  <!-- Overlay -->
  <Transition name="fade">
    <div
      v-if="cart.isOpen"
      @click="cart.isOpen = false"
      class="fixed inset-0 z-200 bg-blue-950/60 backdrop-blur-sm" />
  </Transition>

  <!-- Drawer -->
  <Transition name="slide">
    <div
      v-if="cart.isOpen"
      class="fixed right-0 top-0 z-1000 flex h-full w-full max-w-sm flex-col bg-white shadow-[-8px_0_48px_rgba(30,64,175,0.18)]">
      <!-- Header -->
      <div class="relative overflow-hidden bg-azul px-6 py-5 shrink-0">
        <div class="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-sky-700/70" />
        <div class="absolute -right-2 top-8 h-12 w-12 rounded-full bg-orange-100/30" />
        <div class="relative flex items-center justify-between">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">Tu pedido</p>
            <h2 class="text-xl font-black text-white">Carrito</h2>
          </div>
          <button
            @click="cart.isOpen = false"
            class="flex h-9 w-9 items-center justify-center cursor-pointer rounded-xl text-white transition hover:bg-cyan-700 active:scale-90">
            <X />
          </button>
        </div>
        <div
          class="absolute bottom-0 left-0 h-1 w-full bg-linear-to-r from-naranja via-orange-300 to-azul" />
      </div>

      <!-- Lista de productos -->
      <div class="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
        <!-- Vacío -->
        <Transition name="fade">
          <div
            v-if="cart.isEmpty"
            class="flex flex-col items-center justify-center h-full gap-4 py-16 text-center">
            <div class="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50">
              <ShoppingCart class="text-indigo-300" />
            </div>
            <p class="font-bold text-azul text-base">Tu carrito está vacío</p>
            <p class="text-sm text-slate-400 max-w-45">
              Agrega productos desde el catálogo para comenzar tu pedido
            </p>
            <button
              @click="handleShowCatalog"
              class="mt-2 rounded-xl cursor-pointer bg-naranja px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-orange-600 active:scale-95 transition-all">
              Ver catálogo
            </button>
          </div>
        </Transition>

        <!-- Items -->
        <TransitionGroup name="list" tag="div" class="space-y-3">
          <div
            v-for="item in cart.items"
            :key="item.id"
            class="group/item flex items-center gap-3 rounded-2xl border border-blue-50 bg-white p-3 shadow-[0_2px_12px_rgba(30,64,175,0.07)] transition-all duration-300 hover:border-orange-100 hover:shadow-[0_4px_16px_rgba(249,115,22,0.1)]">
            <div
              class="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-linear-to-b from-blue-50 to-white flex items-center justify-center">
              <ImageNotFound :url="item.imageThumbnailUrl" :alt="item.name + ' imagen'" />
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="text-[12px] font-mono font-semibold uppercase tracking-wider text-slate-500">
                {{ item.code }}
              </p>
              <p class="truncate text-sm font-bold text-blue-900">{{ item.name }}</p>
              <p class="text-xs font-medium text-orange-500">
                {{ formatMXN(resolveUnitPrice(item)) }} c/u
              </p>
              <p class="font-bold text-azul text-sm">
                {{ formatMXN(resolveUnitPrice(item) * item.qty) }}
              </p>
            </div>
            <!-- Contador -->
            <div class="flex flex-col items-center gap-1">
              <button
                @click="cart.changeQty(item.id, 1)"
                class="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-500 font-bold text-base hover:bg-orange-100 active:scale-90 cursor-pointer transition-all disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
                :disabled="item.qty === item.maxQuantity">
                +
              </button>
              <span class="text-sm font-black text-blue-900 tabular-nums w-5 text-center">{{
                item.qty
              }}</span>
              <button
                @click="cart.changeQty(item.id, -1)"
                class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold text-base hover:bg-blue-100 active:scale-90 transition-all">
                −
              </button>
            </div>
            <!-- Eliminar -->
            <button
              @click="cart.removeItem(item.id)"
              class="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-300 transition hover:bg-red-50 hover:text-red-400 active:scale-90">
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </TransitionGroup>
      </div>

      <!-- Footer -->
      <div
        v-if="!cart.isEmpty"
        class="border-t border-blue-50 bg-white px-5 py-5 space-y-4 shrink-0">
        <textarea
          rows="2"
          id="order-notes"
          name="order-notes"
          class="border max-h-24 min-h-8 w-full rounded-xl border-slate-200 py-2 px-4 text-sm outline-none text-slate-700 resize-none focus:border-azul/40 transition-colors placeholder:text-slate-400"
          placeholder="Nota para el pedido (opcional)"
          v-model.trim="notes" />
        <div class="space-y-1.5 text-sm">
          <div class="flex justify-between text-slate-400">
            <span>{{ cart.totalItems }} producto{{ cart.totalItems !== 1 ? 's' : '' }}</span>
            <span>${{ cart.totalPrice }}</span>
          </div>
          <div class="flex justify-between border-t border-dashed border-blue-100 pt-2">
            <span class="font-black text-blue-900 text-base">Total</span>
            <span class="font-black text-blue-900 text-base">${{ cart.totalPrice }}</span>
          </div>
        </div>
        <button
          @click="handleConfirmButton"
          :disabled="loading"
          class="w-full flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 py-4 text-base font-black text-white shadow-[0_6px_20px_rgba(249,115,22,0.4)] transition-all duration-300 hover:from-orange-600 hover:to-orange-700 hover:shadow-[0_8px_28px_rgba(249,115,22,0.5)] active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-none">
          <CheckCircle class="h-5 w-5" />
          {{ loading ? 'Guardando…' : 'Confirmar Pedido' }}
        </button>
        <button
          @click="handleCleanCart"
          class="w-full text-center text-xs text-slate-400 hover:text-red-400 transition-colors font-medium">
          Vaciar carrito
        </button>
      </div>

      <!-- ── Pantalla de confirmación ──────────────────────────────── -->
      <!-- Se cierra automáticamente a los 3s o al presionar el botón  -->
      <Transition name="confirm-slide">
        <div
          v-if="cart.isConfirmed"
          class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white gap-5 px-8 text-center">
          <!-- Ícono animado -->
          <div class="relative flex h-24 w-24 items-center justify-center">
            <div class="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-30" />
            <div
              class="relative flex h-20 w-20 items-center justify-center rounded-full bg-green-100 shadow-lg">
              <CheckCircle class="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div>
            <h3 class="text-2xl font-black text-blue-900">¡Pedido enviado!</h3>
            <p class="mt-1 text-sm text-slate-400">Tu pedido fue registrado con éxito.</p>
          </div>

          <!-- Barra de progreso del auto-cierre -->
          <div class="w-full max-w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-green-400 rounded-full transition-all ease-linear"
              :style="{ width: `${autoCloseProgress}%`, transitionDuration: '100ms' }" />
          </div>
          <p class="text-xs text-slate-400 -mt-3">Se cerrará en {{ autoCloseCountdown }}s</p>

          <button
            @click="handleCloseConfirmation"
            class="rounded-2xl bg-blue-700 px-8 py-3 font-bold text-white shadow hover:bg-blue-800 active:scale-95 transition-all">
            Cerrar
          </button>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import ImageNotFound from '../ui/molecules/ImageNotFound.vue';
import ConfirmOrderModal from '../modal/ConfirmOrderModal.vue';

import type { CreateOrderItemDto } from '@/types/db';

import { useModal } from '@/composables/useModal';
import { useRouter } from 'vue-router';
import { useOrders } from '@/composables/useOrders';
import { RouteNames } from '@/router/route.names';
import { ref, watch } from 'vue';
import { useCartStore } from '@/stores/cart.store';
import { ShoppingCart, X, Trash2, CheckCircle } from 'lucide-vue-next';
import { formatMXN } from '@/helpers/currencyMxn';
import { resolveUnitPrice } from '@/helpers/resolve-unit-price';

const { openModal, closeModal } = useModal();
const { createOrder, loading } = useOrders();

const cart = useCartStore();
const notes = ref<string>('');
const router = useRouter();

const AUTO_CLOSE_DURATION = 3000;
const autoCloseProgress = ref(100);
const autoCloseCountdown = ref(3);

let autoCloseTimer: ReturnType<typeof setTimeout> | null = null;
let progressInterval: ReturnType<typeof setInterval> | null = null;

function startAutoClose(): void {
  autoCloseProgress.value = 100;
  autoCloseCountdown.value = 3;

  const startTime = Date.now();

  progressInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, AUTO_CLOSE_DURATION - elapsed);
    autoCloseProgress.value = (remaining / AUTO_CLOSE_DURATION) * 100;
    autoCloseCountdown.value = Math.ceil(remaining / 1000);
  }, 100);

  autoCloseTimer = setTimeout(() => {
    handleCloseConfirmation();
  }, AUTO_CLOSE_DURATION);
}

function clearAutoClose(): void {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer);
    autoCloseTimer = null;
  }
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
}

function handleCloseConfirmation(): void {
  clearAutoClose();
  cart.resetConfirmation();
}

// Arrancar el timer cuando isConfirmed se pone en true
watch(
  () => cart.isConfirmed,
  (confirmed) => {
    if (confirmed) {
      startAutoClose();
    } else {
      clearAutoClose();
    }
  }
);

// ── Confirmar pedido ──────────────────────────────────────────────────────────

const submitOrder = async (): Promise<void> => {
  closeModal();

  const createdOk = await createOrder({
    items: cart.items.map<CreateOrderItemDto>((i) => ({ productId: i.id, quantity: i.qty })),
    notes: notes.value || undefined,
  });

  if (createdOk) {
    notes.value = '';
    cart.isConfirmed = true;
    cart.clearCart();
  }
};

const handleConfirmButton = (): void => {
  openModal(
    ConfirmOrderModal,
    {
      onCancel: closeModal,
      onConfirm: submitOrder,
    },
    { size: 'lg' }
  );
};

const handleCleanCart = () => {
  const confirm = window.confirm('¿Estás segur@ de vaciar el carrito?');
  if (confirm) cart.clearCart();
};

const handleShowCatalog = (): void => {
  router.push({ name: RouteNames.Catalog.PRODUCTS });
  cart.isOpen = false;
};
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.confirm-slide-enter-active,
.confirm-slide-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.confirm-slide-enter-from,
.confirm-slide-leave-to {
  opacity: 0;
  transform: translateY(16px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.list-enter-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.list-leave-active {
  transition: all 0.25s ease-in;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(-16px) scale(0.95);
}

.pop-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pop-enter-from {
  transform: scale(0);
  opacity: 0;
}
</style>
