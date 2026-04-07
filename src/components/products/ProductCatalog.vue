<template>
  <div class="max-w-295 w-full m-auto">
    <div class="mb-8">
      <p class="text-xs font-bold uppercase tracking-[0.2em] text-orange-500 mb-1">
        Nuestros productos
      </p>
      <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-blue-900 leading-tight">
        Catálogo de <span class="text-blue-700">Productos</span>
      </h2>
      <div class="mt-3 flex items-center gap-2">
        <div class="h-1 w-10 rounded-full bg-orange-500" />
        <div class="h-1 w-4 rounded-full bg-blue-200" />
        <div class="h-1 w-2 rounded-full bg-blue-100" />
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-5">
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductCard from './ProductCard.vue';

import { useProducts } from '@/composables/useProducts';
import { onBeforeMount } from 'vue';

const { fetchProducts, products } = useProducts();

onBeforeMount(() => fetchProducts());
</script>
