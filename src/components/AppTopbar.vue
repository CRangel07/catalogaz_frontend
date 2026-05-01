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
              ? 'text-azul font-semibold'
              : 'text-slate-500 hover:text-blue-600'
          ">
          {{ r.label }}
        </RouterLink>

        <ChevronRight v-if="idx < breadcrumbs.length - 1" class="text-slate-400" :size="16" />
      </template>
    </div>

    <div class="flex-1" />

    <div class="flex gap-4 items-center">
      <div class="flex items-center">
        <div class="h-8 w-8 mr-2 bg-azul grid place-items-center rounded-full text-white font-bold">
          {{ authStore.userInitials }}
        </div>
        <div class="flex flex-col uppercase">
          <span class="text-[11px] text-slate-400 font-semibold">
            Nombre: {{ (authStore.user as UserAdmin)?.username }}
          </span>
          <span class="text-[11px] text-slate-400 font-semibold">
            Rol: {{ (authStore.user as UserAdmin)?.role }}
          </span>
        </div>
      </div>

      <ButtonUI type="button" size="xs" :icon="LogOut" theme="cyan" @click="authStore.logout()">
        Cerrar Sesión
      </ButtonUI>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { ChevronRight, LogOut, Menu } from 'lucide-vue-next';

import type { RouteName } from '@/router/route.names';

import ButtonUI from './ui/atoms/ButtonUI.vue';
import type { UserAdmin } from '@/types/auth.types';

defineProps<{
  activeNav: string;
}>();

const emit = defineEmits<{
  'toggle-sidebar': [];
}>();

const authStore = useAuthStore();
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
