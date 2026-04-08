<template>
  <div>
    <p class="text-2xl text-center text-azul font-extrabold">
      ¿Estás seguro de ordenar este pedido?, se te notificará cuando se encuentre listo
    </p>
    <div class="flex justify-between mt-6">
      <button class="bg-slate-200 border-slate-300" :class="baseBtnClass" @click="emit('cancel')">
        No, no estoy seguro
      </button>
      <button class="bg-naranja border-orange-300 text-white" :class="baseBtnClass">
        Sí, lo quiero
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const baseBtnClass =
  'border outline-none text-lg font-semibold px-4 py-2 rounded-xl active:scale-95 cursor-pointer';

const emit = defineEmits(['cancel']);
</script>

<style scoped></style>
