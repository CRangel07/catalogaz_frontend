<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <AppCard v-for="(m, i) in metrics" :key="i" hover class="group relative overflow-hidden">
      <!-- Color accent top -->
      <div
        class="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        :class="
          m.color === 'orange'
            ? 'bg-linear-to-r from-orange-400 to-orange-200'
            : 'bg-linear-to-r from-blue-600 to-blue-200'
        " />

      <div class="p-4">
        <div class="flex items-start justify-between mt-1">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {{ m.label }}
            </p>
            <p
              class="mt-1 text-2xl font-black tracking-tight"
              :class="m.color === 'orange' ? 'text-orange-600' : 'text-blue-800'">
              {{ m.value }}
            </p>
            <p
              class="mt-1 flex items-center gap-1 text-[11px] font-semibold"
              :class="m.up ? 'text-green-600' : 'text-red-500'">
              <ArrowUp />
              {{ m.sub }}
            </p>
          </div>
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl"
            :class="m.color === 'orange' ? 'bg-orange-50' : 'bg-blue-50'">
            <component
              :is="m.icon"
              :class="m.color === 'orange' ? 'text-orange-500' : 'text-blue-600'"
              :stroke-width="1.8" />
          </div>
        </div>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import AppCard from '@/components/ui/AppCard.vue';

import { ArrowUp } from 'lucide-vue-next';
import { type Metric } from '@/types/components';

defineProps<{
  metrics: Metric[];
}>();
</script>
F
