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
      <AppTopbar :active-nav="activeNav" @toggle-sidebar="toggleSidebar" />

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
import { Contact, Home, NotebookPen, Package2 } from 'lucide-vue-next';
import { RouteNames } from '@/router/route.names';

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
    routeName: RouteNames.Admin.HOME,
    section: 'Principal',
  },
  {
    id: 'productos',
    label: 'Productos',
    icon: h(Package2, { size: 18 }),
    routeName: RouteNames.Admin.PRODUCTS,
    section: 'Productos',
  },
  {
    id: 'productos_negados',
    label: 'Productos Negados',
    icon: h(Package2, { size: 18 }),
    routeName: RouteNames.Admin.PRODUCTS_NOSTOCK,
    section: 'Productos',
  },
  {
    id: 'pedidos',
    label: 'Pedidos',
    icon: h(NotebookPen, { size: 18 }),
    routeName: RouteNames.Admin.ORDERS,
    section: 'Ventas',
  },
  {
    id: 'clientes',
    label: 'Clientes',
    icon: h(Contact, { size: 18 }),
    routeName: RouteNames.Admin.CLIENTS,
    section: 'Ventas',
  },
  {
    id: 'catalogo-cliente',
    label: 'Ir al Catalogo',
    icon: h(Contact, { size: 18 }),
    routeName: RouteNames.Catalog.PRODUCTS,
    section: 'Ventas',
  },
];

// ── Handlers ──────────────────────────────────────────────────────────
function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
  mobileSidebarOpen.value = !mobileSidebarOpen.value;
}
</script>
