<template>
  <div class="min-h-dvh flex items-center justify-center">
    <div class="flex flex-col gap-3">
      <span> No se encontro esta pagina {{ route.fullPath }} </span>
      <button
        class="bg-slate-200 w-fit m-auto px-4 py-2 rounded cursor-pointer"
        @click="handleNavigate">
        Ir al inicio
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const handleNavigate = () => {
  router.replace({ name: 'catalogaz_catalog_list' });
};
</script>

<style scoped></style>
