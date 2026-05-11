<template>
  <form
    @submit.prevent="applyFilter"
    class="grid grid-cols-12 items-end bg-white p-4 rounded-xl gap-5">
    <AppInput
      id="cat-prod-busqueda"
      label="Busca por código o por nombre"
      type="text"
      v-model.trim="filter.search"
      class="grow! col-span-full lg:col-span-5" />

    <div class="w-[10%] self-center m-auto col-span-2 lg:col-span-1">
      <label class="flex select-none cursor-pointer flex-col-reverse items-center gap-2">
        <input
          type="checkbox"
          class="h-5 w-5 form-checkbox rounded border-gray-300 text-naranja focus:ring-2 focus:ring-naranja peer"
          :value="true"
          v-model="filter.isOffer" />
        <span class="text-center text-xs text-slate-600 peer-checked:text-naranja">
          Solo Ofertas
        </span>
      </label>
    </div>

    <div class="flex w-full flex-col gap-0.5 col-span-6 lg:col-span-4">
      <label class="text-xs font-medium text-azul/80" for="cat-prod-linea">Categoria</label>
      <div class="relative">
        <Tags
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          :size="16" />
        <select
          id="cat-prod-linea"
          :disabled="loading"
          v-model="filter.lineId"
          class="block h-9 w-full appearance-none rounded-lg border-2 border-slate-200 bg-white py-1 pl-9 pr-9 text-sm font-semibold text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-cyan-400 disabled:cursor-wait disabled:bg-slate-50 disabled:text-slate-400">
          <option :value="undefined">
            {{ loading ? 'Cargando categorias...' : 'Todas las categorias' }}
          </option>
          <option v-for="line in lines" :key="line.id" :value="line.id">
            {{ line.name }}
          </option>
        </select>
        <ChevronDown
          class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          :size="16" />
      </div>
      <span v-if="error" class="text-xs font-medium text-red-400">{{ error }}</span>
    </div>

    <ButtonUI
      size="sm"
      theme="warning"
      type="submit"
      class="col-span-3 lg:col-span-2"
      :icon="Search"
      icon-position="right">
      Buscar
    </ButtonUI>
  </form>
</template>

<script setup lang="ts">
import type { ProductLine } from '@/types/db';
import type { ProductFilterPayload } from './types';

import ButtonUI from '../ui/atoms/ButtonUI.vue';
import AppInput from '../ui/forms/AppInput.vue';

import { useProducts } from '@/composables/useProducts';
import { onBeforeMount, ref } from 'vue';
import { ChevronDown, Search, Tags } from 'lucide-vue-next';

const emit = defineEmits<{ (e: 'filter', filter: ProductFilterPayload): void }>();

const { loading, fetchLines, error } = useProducts();

const lines = ref<ProductLine[]>([]);

const filter = ref<ProductFilterPayload>({
  search: '',
  isOffer: false,
  lineId: undefined,
});

const getLines = async () => {
  const linesResponse = await fetchLines();
  lines.value = linesResponse ?? [];
};

const applyFilter = () => {
  emit('filter', filter.value);
};

onBeforeMount(() => {
  getLines();
});
</script>
