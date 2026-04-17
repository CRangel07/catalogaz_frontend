<template>
  <div>
    <PageTitle
      title="Catalogo de productos"
      description="Gestiona los productos que se muestran en el catalogo">
      <template #actions>
        <ButtonUI
          size="sm"
          theme="primary"
          :icon="Plus"
          class="ms-auto mb-5"
          @click="handleModalProduct()">
          Nuevo Producto
        </ButtonUI>
      </template>
    </PageTitle>

    <ProductFilter class="my-10" @filter="(q) => fetchProducts({ search: q })" />

    <PaginatedTable :response="productsData">
      <template #table>
        <AppTable :columns="columns" :rows="productsData.data" has-actions>
          <template #cell-imageThumbnailUrl="{ value }">
            <div class="max-w-20">
              <ImageNotFound :url="String(value)" alt="producto-imagen" />
            </div>
          </template>
          <template #cell-isActive="{ value }">
            <span>{{ !!value ? 'Activo' : 'Inactivo' }}</span>
          </template>
          <template #actions="{ row }">
            <ActionsTools @edit="handleModalProduct(row)" />
          </template>
        </AppTable>
      </template>
    </PaginatedTable>
  </div>
</template>

<script setup lang="ts">
import ButtonUI from '../ui/atoms/ButtonUI.vue';
import PageTitle from '../ui/molecules/PageTitle.vue';
import ProductForm from '../forms/ProductForm.vue';
import ActionsTools from '../ui/molecules/ActionsTools.vue';
import ImageNotFound from '../ui/molecules/ImageNotFound.vue';
import ProductFilter from '../filters/ProductFilter.vue';
import PaginatedTable from '../ui/molecules/PaginatedTable.vue';

import type { Product } from '@/types/db';
import AppTable, { type TableColumn } from '../ui/molecules/AppTable.vue';

import { Plus } from 'lucide-vue-next';
import { useModal } from '@/composables/useModal';
import { formatMXN } from '@/helpers/currencyMxn';
import { useProducts } from '@/composables/useProducts';
import { onBeforeMount } from 'vue';

const { openModal } = useModal();

const handleModalProduct = (product?: Product) => {
  openModal(ProductForm, { product, onSave: () => fetchProducts() });
};

const { productsData, fetchProducts } = useProducts();

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
