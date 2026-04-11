<template>
  <div class="max-w-350 w-full flex flex-col items-center m-auto px-5">
    <div class="mb-8 md:self-start">
      <p class="text-xs font-bold uppercase tracking-[0.2em] text-naranja mb-1">
        Nuestros productos
      </p>
      <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-azul leading-tight">
        Catálogo de <span class="text-sky-600">Productos</span>
      </h2>
      <div class="mt-3 flex items-center gap-2">
        <div class="h-1 w-10 rounded-full bg-naranja" />
        <div class="h-1 w-4 rounded-full bg-blue-300" />
        <div class="h-1 w-2 rounded-full bg-blue-200" />
      </div>
    </div>

    <div class="grid grid-cols-12 gap-x-2 gap-y-5 md:w-full">
      <ProductCard
        class="col-span-full sm:col-span-4 lg:col-span-3"
        v-for="p in products"
        :key="p.id"
        :product="p" />
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
