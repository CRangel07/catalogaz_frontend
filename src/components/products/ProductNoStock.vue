<template>
  <div>
    <PageTitle
      title="Productos Negados"
      description="Gestiona los productos que se han marcado que no cuentan con existencia de hace 15 días">
    </PageTitle>

    <PaginatedTable
      :response="productsData"
      @change="
        ({ page, limit }) => {
          update({ page, limit });
          fetchProductsWithQuery();
        }
      ">
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
import PageTitle from '../ui/molecules/PageTitle.vue';
import ProductForm from '../forms/ProductForm.vue';
import ActionsTools from '../ui/molecules/ActionsTools.vue';
import ImageNotFound from '../ui/molecules/ImageNotFound.vue';
import PaginatedTable from '../ui/molecules/PaginatedTable.vue';

import type { Product } from '@/types/db';
import AppTable, { type TableColumn } from '../ui/molecules/AppTable.vue';

import { useModal } from '@/composables/useModal';
import { formatMXN } from '@/helpers/currencyMxn';
import { useProducts } from '@/composables/useProducts';
import { onBeforeMount } from 'vue';
import { useQueryState } from '@/composables/useQueryState';
import type { PaginatedSearch } from '../filters/types';

const { openModal } = useModal();

const { query, update } = useQueryState<PaginatedSearch>({
  search: '',
  page: 1,
  limit: 10,
});

const handleModalProduct = (product?: Product) => {
  openModal(ProductForm, { product, onSave: () => fetchProducts() });
};

async function fetchProductsWithQuery() {
  await fetchProducts(query.value);
}

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

onBeforeMount(() => fetchProductsWithQuery());
</script>
