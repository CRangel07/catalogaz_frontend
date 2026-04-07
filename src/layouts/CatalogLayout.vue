<template>
  <div class="min-h-dvh bg-slate-100">
    <div class="pt-35">
      <NavComponent :links="links" />
      <ProductCatalog />
      <CartDrawer />
      <!-- <FooterComponent /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import CartDrawer from '@/components/products/CartDrawer.vue';
import NavComponent, { type NavLink } from '@/components/general/NavComponent.vue';
import ProductCatalog from '@/components/products/ProductCatalog.vue';

const links: NavLink[] = [
  { label: 'Catalogo', to: 'catalogAz_catalog' },
  { label: 'Dashboard', to: 'catalogAz_adm_home' },
];
// import FooterComponent from '@/components/general/FooterComponent.vue';
</script>
