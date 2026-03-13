<template>
  <!-- Botón flotante del carrito -->
  <button
    @click="open = true"
    class="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-2xl bg-blue-700 px-5 py-3.5 text-white shadow-[0_8px_30px_rgba(30,64,175,0.45)] transition-all duration-300 hover:bg-blue-800 hover:shadow-[0_12px_36px_rgba(30,64,175,0.55)] hover:-translate-y-1 active:scale-95">
    <!-- Icono carrito -->
    <div class="relative">
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>
      <!-- Badge cantidad total -->
      <transition name="pop">
        <span
          v-if="totalItems > 0"
          class="absolute -top-2.5 -right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-black text-white shadow">
          {{ totalItems > 99 ? '99+' : totalItems }}
        </span>
      </transition>
    </div>
    <span class="text-sm font-bold tracking-wide">Mi Pedido</span>
    <span v-if="totalItems > 0" class="text-sm font-extrabold text-orange-300"
      >${{ totalPrice }}</span
    >
  </button>

  <!-- Overlay -->
  <transition name="fade">
    <div
      v-if="open"
      @click="open = false"
      class="fixed inset-0 z-40 bg-blue-950/60 backdrop-blur-sm" />
  </transition>

  <!-- Drawer lateral -->
  <transition name="slide">
    <div
      v-if="open"
      class="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-[-8px_0_48px_rgba(30,64,175,0.18)]">
      <!-- Header del drawer -->
      <div class="relative overflow-hidden bg-blue-700 px-6 py-5">
        <!-- Círculos decorativos -->
        <div class="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-600/50" />
        <div class="absolute -right-2 top-8 h-12 w-12 rounded-full bg-orange-400/30" />

        <div class="relative flex items-center justify-between">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">Tu pedido</p>
            <h2 class="text-xl font-black text-white">Carrito de compras</h2>
          </div>
          <button
            @click="open = false"
            class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/50 text-white transition hover:bg-blue-500 active:scale-90">
            <svg
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Barra de acento -->
        <div
          class="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-orange-400 via-orange-300 to-blue-400" />
      </div>

      <!-- Lista de productos -->
      <div class="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <!-- Estado vacío -->
        <transition name="fade">
          <div
            v-if="items.length === 0"
            class="flex flex-col items-center justify-center h-full gap-4 py-16 text-center">
            <div class="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50">
              <svg
                class="h-10 w-10 text-blue-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            </div>
            <p class="font-bold text-blue-900 text-base">Tu carrito está vacío</p>
            <p class="text-sm text-slate-400 max-w-[180px]">
              Agrega productos desde el catálogo para comenzar tu pedido
            </p>
            <button
              @click="open = false"
              class="mt-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-orange-600 active:scale-95 transition-all">
              Ver catálogo
            </button>
          </div>
        </transition>

        <!-- Items del carrito -->
        <transition-group name="list" tag="div" class="space-y-3">
          <div
            v-for="item in items"
            :key="item.id"
            class="group/item flex items-center gap-3 rounded-2xl border border-blue-50 bg-white p-3 shadow-[0_2px_12px_rgba(30,64,175,0.07)] transition-all duration-300 hover:border-orange-100 hover:shadow-[0_4px_16px_rgba(249,115,22,0.1)]">
            <!-- Imagen -->
            <div
              class="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
              <img
                :src="item.image"
                :alt="item.name"
                class="h-14 w-auto object-contain drop-shadow-sm" />
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                {{ item.brand }}
              </p>
              <p class="truncate text-sm font-bold text-blue-900">{{ item.name }}</p>
              <p class="text-sm font-extrabold text-orange-500">
                ${{ (item.price * item.qty).toFixed(2) }}
              </p>
            </div>

            <!-- Contador compacto -->
            <div class="flex flex-col items-center gap-1">
              <button
                @click="changeQty(item.id, 1)"
                class="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-500 font-bold text-base hover:bg-orange-100 active:scale-90 transition-all">
                +
              </button>
              <span class="text-sm font-black text-blue-900 tabular-nums w-5 text-center">{{
                item.qty
              }}</span>
              <button
                @click="changeQty(item.id, -1)"
                class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold text-base hover:bg-blue-100 active:scale-90 transition-all">
                −
              </button>
            </div>

            <!-- Eliminar -->
            <button
              @click="removeItem(item.id)"
              class="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-300 transition hover:bg-red-50 hover:text-red-400 active:scale-90">
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
        </transition-group>
      </div>

      <!-- Footer con resumen y CTA -->
      <div v-if="items.length > 0" class="border-t border-blue-50 bg-white px-5 py-5 space-y-4">
        <!-- Desglose -->
        <div class="space-y-1.5 text-sm">
          <div class="flex justify-between text-slate-400">
            <span>Subtotal ({{ totalItems }} productos)</span>
            <span>${{ totalPrice }}</span>
          </div>
          <div class="flex justify-between text-slate-400">
            <span>Envío estimado</span>
            <span class="text-green-500 font-semibold">Gratis</span>
          </div>
          <div class="mt-2 flex justify-between border-t border-dashed border-blue-100 pt-2">
            <span class="font-black text-blue-900 text-base">Total</span>
            <span class="font-black text-blue-900 text-base">${{ totalPrice }}</span>
          </div>
        </div>

        <!-- Botón confirmar pedido -->
        <button
          @click="confirmOrder"
          class="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 py-4 text-base font-black text-white shadow-[0_6px_20px_rgba(249,115,22,0.4)] transition-all duration-300 hover:from-orange-600 hover:to-orange-700 hover:shadow-[0_8px_28px_rgba(249,115,22,0.5)] active:scale-95">
          <svg
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          Confirmar Pedido
        </button>

        <!-- Vaciar carrito -->
        <button
          @click="clearCart"
          class="w-full text-center text-xs text-slate-400 hover:text-red-400 transition-colors font-medium">
          Vaciar carrito
        </button>
      </div>

      <!-- Confirmación de pedido -->
      <transition name="fade">
        <div
          v-if="confirmed"
          class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white gap-5 px-8 text-center">
          <div
            class="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 shadow-lg">
            <svg
              class="h-10 w-10 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <div>
            <h3 class="text-2xl font-black text-blue-900">¡Pedido enviado!</h3>
            <p class="mt-1 text-sm text-slate-400">
              Tu pedido fue registrado con éxito. Pronto recibirás confirmación.
            </p>
          </div>
          <button
            @click="
              confirmed = false;
              open = false;
            "
            class="rounded-2xl bg-blue-700 px-8 py-3 font-bold text-white shadow hover:bg-blue-800 active:scale-95 transition-all">
            Cerrar
          </button>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface CartItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  qty: number;
  image: string;
}

// Estado del drawer
const open = ref(false);
const confirmed = ref(false);

// Productos de ejemplo — en producción esto vendría de un store (Pinia/Vuex)
const items = ref<CartItem[]>([
  {
    id: 1,
    name: 'Mega Botella 1.2L',
    brand: 'Corona Extra',
    price: 49.99,
    qty: 2,
    image:
      'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-1_large.png',
  },
  {
    id: 2,
    name: 'Refresco 600ml',
    brand: 'Coca-Cola',
    price: 18.5,
    qty: 3,
    image:
      'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-2_large.png',
  },
]);

const totalItems = computed(() => items.value.reduce((s, i) => s + i.qty, 0));
const totalPrice = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2));

const changeQty = (id: number, delta: number) => {
  const item = items.value.find((i) => i.id === id);
  if (!item) return;
  const next = item.qty + delta;
  if (next <= 0) removeItem(id);
  else if (next <= 99) item.qty = next;
};

const removeItem = (id: number) => {
  items.value = items.value.filter((i) => i.id !== id);
};

const clearCart = () => {
  items.value = [];
};

const confirmOrder = () => {
  confirmed.value = true;
  items.value = [];
};

// Exponer método para que ProductCard agregue items
const addItem = (item: Omit<CartItem, 'qty'> & { qty?: number }) => {
  const existing = items.value.find((i) => i.id === item.id);
  if (existing) {
    existing.qty = Math.min(99, existing.qty + (item.qty ?? 1));
  } else {
    items.value.push({ ...item, qty: item.qty ?? 1 });
  }
  open.value = true;
};

defineExpose({ addItem, open });
</script>

<style scoped>
/* Slide desde la derecha */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Fade overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Lista de items */
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

/* Badge pop */
.pop-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pop-enter-from {
  transform: scale(0);
  opacity: 0;
}
</style>
