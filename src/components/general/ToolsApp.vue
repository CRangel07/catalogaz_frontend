<template>
  <div>
    <p class="text-center font-bungee text-naranja my-5">
      Código QR para obtener La lista de precios Matricial en Compucaja
    </p>

    <div class="max-w-xs m-auto">
      <ImageNotFound :url="Matricial" alt="qr-lista-precios" :is-asset="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Matricial from '@/assets/matricial.jpeg';
import ImageNotFound from '../ui/molecules/ImageNotFound.vue';
</script>
