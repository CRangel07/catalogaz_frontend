<template>
  <div class="flex h-screen w-screen overflow-hidden bg-slate-50 font-poppins">
    <AppSidebar
      :open="sidebarOpen"
      :mobile-open="mobileSidebarOpen"
      :active-nav="activeNav"
      :nav-items="navItems"
      @update:active-nav="activeNav = $event"
      @update:mobile-open="mobileSidebarOpen = $event" />

    <div class="flex flex-1 flex-col min-w-0 overflow-hidden">
      <AppTopbar
        :active-nav="activeNav"
        :notifications="notifications"
        @toggle-sidebar="toggleSidebar" />

      <main class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 font-poppins">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, ref } from 'vue';

import AppTopbar from '@/components/AppTopbar.vue';
import AppSidebar from '@/components/AppSidebar.vue';

import type { NavItem } from '@/types/components';
import { Contact, Home, NotebookPen, Package2, Settings } from 'lucide-vue-next';

// ── State ──────────────────────────────────────────────────────────────
const sidebarOpen = ref(true);
const mobileSidebarOpen = ref(false);
const activeNav = ref('dashboard');

// ── Data ──────────────────────────────────────────────────────────────
const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: h(Home, { size: 18 }),
    routeName: 'catalogAz_adm_home',
    section: 'Principal',
  },
  {
    id: 'productos',
    label: 'Productos',
    icon: h(Package2, { size: 18 }),
    routeName: 'catalogAz_adm_products',
    section: 'Principal',
  },
  {
    id: 'pedidos',
    label: 'Pedidos',
    icon: h(NotebookPen, { size: 18 }),
    routeName: 'catalogAz_adm_orders',
    section: 'Principal',
  },
  {
    id: 'clientes',
    label: 'Clientes',
    icon: h(Contact, { size: 18 }),
    routeName: 'catalogAz_adm_clients',
    section: 'Ventas',
  },
  {
    id: 'catalogo-cliente',
    label: 'Ir al Catalogo',
    icon: h(Contact, { size: 18 }),
    routeName: 'catalogAz_catalog',
    section: 'Ventas',
  },
  {
    id: 'config',
    label: 'Configuración',
    icon: h(Settings, { size: 18 }),
    routeName: 'catalogAz_adm_settings',
    section: 'Sistema',
  },
];

const notifications = [
  { text: '12 pedidos pendientes de atender', time: 'ahora', dot: 'orange' as const },
  { text: 'Aguacate con stock crítico (3 u.)', time: '5 min', dot: 'red' as const },
  { text: 'Juan Pérez realizó un nuevo pedido', time: '28 min', dot: 'blue' as const },
];

// ── Handlers ──────────────────────────────────────────────────────────
function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
  mobileSidebarOpen.value = !mobileSidebarOpen.value;
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.label-enter-active {
  transition: all 0.2s ease;
}
.label-leave-active {
  transition: all 0.15s ease;
}
.label-enter-from,
.label-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}
</style>
