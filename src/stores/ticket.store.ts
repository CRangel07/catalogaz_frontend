import { ref } from 'vue';
import { http } from '@/services/http';
import { defineStore } from 'pinia';

import type { Ticket } from '@/types/ticket.types';

export type TicketItem = {
  cantVenta: number;
  codigoMercancia: string;
  descripcion: string;
};

export type TicketResponse = {
  total: number;
  instruction: string;
  items: TicketItem[];
};

export const useTicketStore = defineStore('catalog_ticket_store', () => {
  const currentStep = ref<number>(1);
  const isImporting = ref(false);

  const reset = (): Ticket => ({
    file: null,
    mov: 'salidaInventario',
    products: [],
    instruction: '',
  });

  const ticketData = ref<Ticket>(reset());

  async function importExcel(): Promise<void> {
    if (!ticketData.value.file) return;

    isImporting.value = true;

    try {
      const formData = new FormData();
      formData.append('type', ticketData.value.mov);
      formData.append('file', ticketData.value.file);
      const response = await http.post<TicketResponse>('/tickets/upload', formData);
      ticketData.value.products = response?.items;
      ticketData.value.instruction = response?.instruction;
      currentStep.value = 2;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error al importar el archivo';
      console.error(message);
    } finally {
      isImporting.value = false;
    }
  }

  const resetState = () => {
    ticketData.value = reset();
    currentStep.value = 1;
  };

  return { currentStep, ticketData, isImporting, importExcel, resetState };
});
