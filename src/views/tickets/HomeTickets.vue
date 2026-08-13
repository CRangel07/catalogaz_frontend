<template>
  <div>
    <template v-if="store.currentStep == 1">
      <h3 class="font-bungee text-azul mb-2">Sube el Excel de las Ventas de NovaCaja</h3>
      <form @submit.prevent="">
        <UploadExcelSales v-model:file="store.ticketData.file" />
        <MovementSelector v-model:movement="store.ticketData.mov" />
        <!-- Acciones -->
        <div class="flex items-center justify-end gap-3">
          <!-- Importar -->
          <ButtonUI
            theme="success"
            size="sm"
            :icon="FileUp"
            :loading="store.isImporting"
            :disabled="!store.ticketData.file || !store.ticketData.mov"
            @click="store.importExcel()">
            Generar QR Movimiento
          </ButtonUI>
        </div>
      </form>
    </template>
    <template v-else-if="store.currentStep == 2">
      <div>
        <ButtonUI
          theme="warning"
          size="sm"
          :icon="ArrowLeft"
          :icon-position="'right'"
          :loading="store.isImporting"
          :disabled="!store.ticketData.file || !store.ticketData.mov"
          @click="store.resetState">
          Volver a subir Excel
        </ButtonUI>

        <p class="my-5 font-bungee text-azul">Desglose de Excel y código QR</p>

        <div v-if="store.ticketData.products" class="flex gap-3 items-center font-bungee mb-6">
          <span class="text-sm">Total:</span>
          <div
            class="rounded-full bg-naranja w-12 h-12 grid items-center text-center text-2xl text-white">
            {{ store.ticketData.products.length }}
          </div>
        </div>

        <AppTable
          :columns="[
            {
              key: 'codigoMercancia',
              label: 'Código',
            },
            {
              key: 'descripcion',
              label: 'Descripción',
            },
            {
              key: 'cantVenta',
              label: 'Cantidad',
            },
          ]"
          :rows="store.ticketData.products" />

        <QRCode :value="store.ticketData.instruction" :logo-url="Apache" :size="500" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import QRCode from '@/components/common/QRCode.vue';
import Apache from '@/assets/apache.png';
import ButtonUI from '@/components/ui/atoms/ButtonUI.vue';
import AppTable from '@/components/ui/molecules/AppTable.vue';
import UploadExcelSales from '@/components/tickets/UploadExcelSales.vue';
import MovementSelector from '@/components/tickets/MovementSelector.vue';

import { useTicketStore } from '@/stores/ticket.store';
import { ArrowLeft, FileUp } from 'lucide-vue-next';

const store = useTicketStore();
</script>
