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

const links: NavLink[] = [
  { label: 'Catalogo', to: 'catalogaz_catalog_list' },
  { label: 'Mis Ordenes', to: 'catalogAz_my_orders' },
  { label: 'Dashboard', to: 'catalogAz_adm_home', needsAdmin: true },
];
// import FooterComponent from '@/components/general/FooterComponent.vue';
</script>
