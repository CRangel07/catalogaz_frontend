<template>
  <div class="max-w-350 w-full flex flex-col items-center m-auto px-5 pb-20">
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

    <PaginatedTable
      :response="productsData"
      @change="
        ({ limit, page }) => {
          update({ page, limit });
          fetchProductsWithQuery();
        }
      ">
      <template #header>
        <ProductFilter
          @filter="
            (q) => {
              update({ search: q, page: 1 });
              fetchProductsWithQuery();
            }
          "
          class="sticky top-17 z-20 bg-slate-100" />
      </template>
      <template #table>
        <div class="grid grid-cols-12 gap-x-2 gap-y-5 md:w-full items-stretch">
          <ProductCard
            class="col-span-full sm:col-span-4 lg:col-span-3"
            v-for="p in productsData.data"
            :key="p.id"
            :product="p" />
        </div>
      </template>
    </PaginatedTable>
  </div>
</template>

<script setup lang="ts">
import ProductCard from './ProductCard.vue';
import ProductFilter from '../filters/ProductFilter.vue';
import PaginatedTable from '../ui/molecules/PaginatedTable.vue';

import type { PaginatedSearch } from '../filters/types';

import { onBeforeMount } from 'vue';
import { useProducts } from '@/composables/useProducts';
import { useQueryState } from '@/composables/useQueryState';

const { query, update } = useQueryState<PaginatedSearch>({
  search: '',
  page: 1,
  limit: 10,
});

async function fetchProductsWithQuery() {
  await fetchProducts(query.value);
}

const { fetchProducts, productsData } = useProducts();

onBeforeMount(() => fetchProductsWithQuery());
</script>
