<template>
  <div>
    <ButtonUI size="sm" theme="primary" :icon="Plus" class="ms-auto mb-5" @click="handleNewProduct">
      Nuevo Producto
    </ButtonUI>
    <AppTable :columns="columns" :rows="[]" />
  </div>
</template>

<script setup lang="ts">
import ButtonUI from '../ui/atoms/ButtonUI.vue';
import ProductForm from '../forms/ProductForm.vue';

import type { NumericBoolean } from '@/types/db';
import AppTable, { type TableColumn } from '../ui/AppTable.vue';

import { Plus } from 'lucide-vue-next';
import { useModal } from '@/composables/useModal';

type Product = {
  id: string;
  description: string;
  status: NumericBoolean;
};

const { openModal } = useModal();

const handleNewProduct = () => {
  openModal(ProductForm);
};
const columns: TableColumn<Product>[] = [{ key: 'description', label: 'Descripción' }];
</script>

<style scoped></style>
