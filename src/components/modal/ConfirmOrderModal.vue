<template>
  <div>
    <p class="text-2xl text-center text-azul font-extrabold">
      ¿Estás segur@ de confirmar este pedido?, se te notificará cuando se encuentre listo
    </p>
    <p class="text-xs text-center font-mono text-naranja my-3">
      La tienda se reserva el derecho de modificar las cantidades de productos en caso de no contar
      con existencia suficiente en inventario, así como de realizar ajustes de precio cuando las
      circunstancias lo requieran. Al hacer clic en “Sí, lo quiero”, usted acepta los términos
      anteriormente mencionados.
    </p>
    <div class="flex justify-between mt-6">
      <button class="bg-slate-200 border-slate-300" :class="baseBtnClass" @click="emit('cancel')">
        No, no estoy seguro
      </button>
      <button
        class="bg-naranja border-orange-300 text-white"
        :class="baseBtnClass"
        @click="emit('confirm')">
        Sí, lo quiero
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const baseBtnClass =
  'border outline-none lg:text-lg font-semibold px-2 lg:px-4 lg:py-2 py-1 rounded-xl active:scale-95 cursor-pointer';

const emit = defineEmits(['cancel', 'confirm']);
</script>

<style scoped></style>
