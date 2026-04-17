<template>
  <div class="space-y-3 w-full">
    <!-- Tabla -->
    <slot name="header"></slot>
    <!-- Tabla -->
    <slot name="table"></slot>

    <!-- Paginación -->
    <div
      class="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <!-- Info -->
      <div class="flex items-center gap-4 text-sm text-slate-600">
        <div class="flex flex-col leading-tight">
          <span class="font-semibold text-slate-800"> Página {{ response.page }} </span>
          <span class="text-xs text-slate-400"> de {{ response.totalPages }} </span>
        </div>

        <div class="h-6 w-px bg-slate-200"></div>

        <div class="flex flex-col leading-tight">
          <span class="font-semibold text-slate-800">
            {{ response.total }}
          </span>
          <span class="text-xs text-slate-400"> elementos </span>
        </div>

        <div class="h-6 w-px bg-slate-200"></div>

        <div class="flex flex-col leading-tight">
          <span class="font-semibold text-slate-800">
            {{ response.limit }}
          </span>
          <span class="text-xs text-slate-400"> por página </span>
        </div>
      </div>

      <!-- Acciones -->
      <div class="flex items-center gap-2">
        <ButtonUI
          size="xs"
          theme="cyan"
          :disabled="response.page === 1"
          :icon="ArrowLeft"
          icon-position="right"
          @click="changePage(response.page - 1)">
          Anterior
        </ButtonUI>

        <!-- Página actual -->
        <div class="px-3 py-1.5 rounded-lg bg-cyan-50 text-cyan-700 text-xs font-semibold">
          {{ response.page }}
        </div>

        <ButtonUI
          size="xs"
          theme="cyan"
          :disabled="isLastPage"
          :icon="ArrowRight"
          icon-position="right"
          @click="changePage(response.page + 1)">
          Siguiente
        </ButtonUI>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Object">
import ButtonUI from '../atoms/ButtonUI.vue';

import type { PaginatedResponse } from '@/types/db';

import { computed } from 'vue';
import { ArrowLeft, ArrowRight } from 'lucide-vue-next';

type Props = {
  response: PaginatedResponse<T>;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  change: [{ page: number; limit: number }];
}>();

const isLastPage = computed(() => {
  return props.response.page >= props.response.totalPages;
});

function changePage(page: number) {
  if (page < 1 || page > props.response.totalPages) return;

  emit('change', {
    page,
    limit: props.response.limit,
  });
}
</script>
