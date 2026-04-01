<template>
  <RouterView class="font-poppins" />
  <AppModalContainer />
  <AppToastContainer />
</template>

<script setup lang="ts">
import AppModalContainer from './components/modal/AppModalContainer.vue';
import AppToastContainer from './components/ui/molecules/AppToastContainer.vue';
</script>
