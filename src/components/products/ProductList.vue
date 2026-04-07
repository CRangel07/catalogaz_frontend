<template>
  <div>
    <ButtonUI
      size="sm"
      theme="primary"
      :icon="Plus"
      class="ms-auto mb-5"
      @click="handleModalProduct()">
      Nuevo Producto
    </ButtonUI>
    <AppTable :columns="columns" :rows="products" has-actions>
      <template #cell-imageThumbnailUrl="{ value }">
        <div class="max-w-37.5">
          <img :src="`${BASE}${value}`" alt="miniatura" class="w-full object-cover block" />
        </div>
      </template>
      <template #cell-isActive="{ value }">
        <span>{{ !!value ? 'Activo' : 'Inactivo' }}</span>
      </template>
      <template #actions="{ row }">
        <ActionsTools @edit="handleModalProduct(row)" />
      </template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
import ButtonUI from '../ui/atoms/ButtonUI.vue';
import ProductForm from '../forms/ProductForm.vue';
import ActionsTools from '../ui/molecules/ActionsTools.vue';

import type { Product } from '@/types/db';
import AppTable, { type TableColumn } from '../ui/AppTable.vue';

import { Plus } from 'lucide-vue-next';
import { useModal } from '@/composables/useModal';
import { formatMXN } from '@/helpers/currencyMxn';
import { useProducts } from '@/composables/useProducts';
import { onBeforeMount } from 'vue';

const { openModal } = useModal();

const BASE = import.meta.env.VITE_ASSETS_URL;

const handleModalProduct = (product?: Product) => {
  openModal(ProductForm, { product, onUpdate: () => fetchProducts() });
};

const { products, fetchProducts } = useProducts();

const columns: TableColumn<Product>[] = [
  { key: 'imageThumbnailUrl', label: 'Imagen', align: 'center' },
  { key: 'code', label: 'Código' },
  { key: 'name', label: 'Nombre' },
  {
    key: 'price',
    label: 'Precio',
    format(value) {
      return formatMXN(Number(value));
    },
  },
  { key: 'isActive', label: 'Estatus' },
  { key: 'description', label: 'Descripción' },
];

onBeforeMount(() => fetchProducts());
</script>
