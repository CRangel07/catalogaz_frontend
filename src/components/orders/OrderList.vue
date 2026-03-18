<template>
  <div>
    <AppTable :columns="columns" :rows="[]" />
  </div>
</template>

<script setup lang="ts">
import type { NumericBoolean } from '@/types/db';
import AppTable, { type TableColumn } from '../ui/AppTable.vue';

type Order = {
  id: string;
  clientName: string;
  items: string;
  status: NumericBoolean;
  date: string;
};

const columns: TableColumn<Order>[] = [
  { key: 'status', label: 'Estatus Pedido' },
  { key: 'clientName', label: 'Cliente' },
  { key: 'items', label: 'Productos' },
  { key: 'date', label: 'Hora' },
];
</script>

<style scoped></style>
