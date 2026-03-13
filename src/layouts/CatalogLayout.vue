<template>
  <div class="min-h-dvh bg-slate-100 grid items-center">
    <div class="pt-35">
      <NavComponent />
      <ProductCatalog />
      <CartDrawer />
      <!-- <FooterComponent /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import NavComponent from '@/components/general/NavComponent.vue';
import CartDrawer from '@/components/products/CartDrawer.vue';
import ProductCatalog from '@/components/products/ProductCatalog.vue';
// import FooterComponent from '@/components/general/FooterComponent.vue';
</script>

<style scoped></style>
