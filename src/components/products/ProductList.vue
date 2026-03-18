<template>
  <div>
    <AppTable :columns="columns" :rows="[]" />
  </div>
</template>

<script setup lang="ts">
import type { NumericBoolean } from '@/types/db';
import AppTable, { type TableColumn } from '../ui/AppTable.vue';

type Product = {
  id: string;
  description: string;
  status: NumericBoolean;
};

const columns: TableColumn<Product>[] = [{ key: 'description', label: 'Descripción' }];
</script>

<style scoped></style>
