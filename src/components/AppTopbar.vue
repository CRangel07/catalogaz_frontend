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
      <template v-for="(r, idx) in routes" :key="r.name">
        <RouterLink
          :to="{ name: r.name }"
          exact-active-class="text-azul!"
          class="text-sm font-medium text-slate-500">
          {{ RoutesNames[String(r.name)] ?? r.name }}
        </RouterLink>
        <ChevronRight class="text-naranja" v-if="idx < routes.length - 1" />
      </template>
    </div>

    <div class="flex-1" />
  </header>
</template>

<script setup lang="ts">
import { ChevronRight, Menu } from 'lucide-vue-next';
import { computed } from 'vue';
import { useRoute, type RouteLocationMatched } from 'vue-router';

interface Notification {
  text: string;
  time: string;
  dot: 'orange' | 'red' | 'blue';
}

enum RoutesNames {
  catalogAz_adm_orders = 'Ordenes',
  catalogAz_dashboard = 'Dashboard',
  catalogAz_adm_products = 'Productos',
  catalogAz_adm_home = 'Inicio',
  // catalogAz_adm_home = 'dsa',
  catalogAz_adm_clients = 'Clientes',
  catalogAz_adm_settings = 'Configuración',
}

const route = useRoute();

const routes = computed<RouteLocationMatched[]>(() => {
  return route.matched;
});

defineProps<{
  activeNav: string;
  notifications: Notification[];
}>();

const emit = defineEmits<{
  'toggle-sidebar': [];
}>();
</script>
