<template>
  <div class="min-h-screen bg-slate-50 flex">
    <div
      class="hidden lg:flex lg:w-1/2 bg-azul flex-col justify-between p-12 relative overflow-hidden">
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

      <div class="relative z-10 flex items-center gap-3">
        <div class="w-10 h-10 bg-transparent rounded-lg flex items-center justify-center">
          <img :src="Logo" alt="logoazteca" />
        </div>
        <span class="text-white font-semibold text-lg tracking-tight">Abarrotes Azteca</span>
      </div>

      <div class="relative z-10">
        <h1 class="text-white text-4xl font-bold leading-tight tracking-tight mb-4">
          Nuestro Catálogo<br />
          <span class="text-slate-400">Cuidando tu economía</span>
        </h1>
        <p class="text-slate-400 text-base leading-relaxed max-w-sm">
          Surte tu pedido con nosotros!
        </p>
      </div>

      <div class="relative z-10">
        <p class="text-slate-400 text-sm">© {{ currentYear }} Abarrotes Azteca</p>
      </div>
    </div>

    <div class="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12">
      <div class="flex lg:hidden items-center gap-2 mb-10">
        <div class="w-14 h-14 bg-transparent rounded-lg flex items-center justify-center">
          <img :src="Logo" alt="logoazteca" />
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

import Logo from '@/assets/logo.png';

const currentYear = computed(() => new Date().getFullYear());
</script>
