<template>
  <div>
    <p class="text-sm text-slate-600 mb-3">
      Selecciona el tipo de Movimiento a Generar en Compucaja
    </p>
    <div class="flex gap-5 flex-wrap justify-center">
      <button
        type="button"
        class="border outline-none py-2 px-3 cursor-pointer rounded-xl border-naranja focus:ring-2 focus:ring-azul ring-offset-2"
        :class="{
          'bg-naranja text-white scale-110': model == 'salidaInventario',
          'bg-naranja/2 text-slate-700': model != 'salidaInventario',
        }"
        title="Generar una salida de Inventario"
        @click="setValue('salidaInventario')">
        Salida Inventario
      </button>
      <button
        type="button"
        class="border outline-none py-2 px-3 cursor-pointer rounded-xl border-naranja focus:ring-2 focus:ring-azul ring-offset-2"
        :class="{
          'bg-naranja text-white scale-110': model == 'ticketCobro',
          'bg-naranja/2 text-slate-700': model != 'ticketCobro',
        }"
        title="Generar ticket"
        @click="setValue('ticketCobro')">
        Ticket
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CompucajaMovement } from '@/types/ticket.types';

const model = defineModel<CompucajaMovement>('movement', { required: true });

const setValue = (mov: CompucajaMovement) => {
  model.value = mov;
};
</script>
