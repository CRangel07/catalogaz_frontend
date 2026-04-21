<template>
  <div class="min-h-dvh bg-slate-100">
    <div class="pt-35">
      <NavComponent :links="links" />
      <RouterView />
      <CartDrawer />
      <!-- <FooterComponent /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import CartDrawer from '@/components/products/CartDrawer.vue';
import NavComponent, { type NavLink } from '@/components/general/NavComponent.vue';
import { RouteNames } from '@/router/route.names';

const links: NavLink[] = [
  { label: 'Catalogo', to: RouteNames.Catalog.PRODUCTS },
  { label: 'Mis Ordenes', to: RouteNames.Catalog.MY_ORDERS },
  { label: 'Dashboard', to: RouteNames.Admin.HOME, needsAdmin: true },
];
// import FooterComponent from '@/components/general/FooterComponent.vue';
</script>
