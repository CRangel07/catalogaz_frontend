<template>
  <div class="min-h-screen bg-slate-50 flex">
    <!-- Panel izquierdo: branding -->
    <div
      class="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12 relative overflow-hidden">
      <!-- Patrón de fondo sutil -->
      <div class="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <!-- Logo / Marca -->
      <div class="relative z-10 flex items-center gap-3">
        <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
          <ShoppingBasket class="w-5 h-5 text-slate-900" />
        </div>
        <span class="text-white font-semibold text-lg tracking-tight">Abarrotes Azteca</span>
      </div>

      <!-- Mensaje central -->
      <div class="relative z-10">
        <h1 class="text-white text-4xl font-bold leading-tight tracking-tight mb-4">
          Tu catálogo,<br />
          <span class="text-slate-400">donde quiera.</span>
        </h1>
        <p class="text-slate-500 text-base leading-relaxed max-w-sm">
          Gestiona productos, clientes y pedidos desde un solo lugar. Rápido, seguro y siempre
          disponible.
        </p>
      </div>

      <!-- Footer branding -->
      <div class="relative z-10">
        <p class="text-slate-600 text-sm">© {{ currentYear }} Abarrotes Azteca</p>
      </div>
    </div>

    <!-- Panel derecho: slot del formulario -->
    <div class="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12">
      <!-- Logo visible solo en mobile -->
      <div class="flex lg:hidden items-center gap-2 mb-10">
        <div class="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
          <ShoppingBasket class="w-4 h-4 text-white" />
        </div>
        <span class="text-slate-900 font-semibold text-base tracking-tight">Abarrotes Azteca</span>
      </div>

      <div class="w-full max-w-sm">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ShoppingBasket } from 'lucide-vue-next';

const currentYear = computed(() => new Date().getFullYear());
</script>
