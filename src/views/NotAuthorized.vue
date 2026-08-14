<template>
  <div class="main text-3xl min-h-screen grid items-center text-center">
    <div class="bg-white/20 px-4 m-auto rounded py-6">
      <p class="text-white font-medium">No tienes acceso a esta página de la plataforma</p>
      <button class="text-white border text-lg p-2 rounded my-4 cursor-pointer" @click="goBack">
        Volver
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.main {
  background-image: linear-gradient(
    to right top,
    #395c6b,
    #3d6b82,
    #44799b,
    #5087b4,
    #6194cd,
    #628dcb,
    #6486c8,
    #687ec5,
    #5662a7,
    #45488a,
    #342e6d,
    #231651
  );
}
</style>
