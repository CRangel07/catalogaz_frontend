<template>
  <header
    class="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 shadow-[0_1px_8px_rgba(30,58,138,0.07)]">
    <!-- Toggle sidebar -->
    <button
      @click="emit('toggle-sidebar')"
      class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-blue-700 active:scale-90">
      <Menu />
    </button>

    <!-- Breadcrumb -->
    <div class="hidden sm:flex items-center gap-1.5 text-sm">
      <template v-for="(r, idx) in breadcrumbs" :key="r.name">
        <RouterLink
          :to="{ name: r.name }"
          class="text-sm font-medium transition-colors"
          :class="
            idx === breadcrumbs.length - 1
              ? 'text-blue-700 font-semibold'
              : 'text-slate-500 hover:text-blue-600'
          ">
          {{ r.label }}
        </RouterLink>

        <ChevronRight v-if="idx < breadcrumbs.length - 1" class="text-slate-400" :size="16" />
      </template>
    </div>

    <div class="flex-1" />
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { ChevronRight, Menu } from 'lucide-vue-next';

import type { RouteName } from '@/router/route.names';

defineProps<{
  activeNav: string;
}>();

const emit = defineEmits<{
  'toggle-sidebar': [];
}>();

const route = useRoute();

type Breadcrumb = {
  name: RouteName;
  label: string;
};

const breadcrumbs = computed<Breadcrumb[]>(() => {
  return route.matched
    .filter((r) => r.name) // eliminar rutas sin name
    .map((r) => {
      const name = r.name as RouteName;

      return {
        name,
        label: (r.meta?.label as string) || formatFallbackLabel(name),
      };
    });
});

function formatFallbackLabel(name: string): string {
  // "catalogaz_admin_products" → "Products"
  const parts = name.split('_');
  const last = parts[parts.length - 1] || name;

  return last.charAt(0).toUpperCase() + last.slice(1);
}
</script>
