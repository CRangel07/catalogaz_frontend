<template>
  <div>
    <PageTitle
      :icon="Cuboid"
      title="Catalogo de productos"
      description="Gestiona los productos que se muestran en el catalogo">
      <template #actions>
        <ButtonUI
          size="sm"
          theme="primary"
          :icon="Plus"
          class="ms-auto mb-5"
          :disabled="loading"
          @click="handleModalProduct()">
          Nuevo Producto
        </ButtonUI>
        <ButtonUI
          size="sm"
          theme="success"
          :icon="Plus"
          class="ms-auto mb-5"
          :disabled="loading"
          @click="handleModalExcelProduct()">
          Subir Desde Excel
        </ButtonUI>
        <ButtonUI
          size="sm"
          theme="cyan"
          :icon="RefreshCcw"
          class="ms-auto mb-5"
          :disabled="loading"
          @click="fetchProductsWithQuery()">
          Actualizar
        </ButtonUI>
      </template>
    </PageTitle>

    <ProductFilter
      @filter="
        (q) => {
          update({ search: q, page: 1 });
          fetchProductsWithQuery();
        }
      "
      class="my-5" />

    <PaginatedTable
      :response="productsData"
      @change="
        ({ page, limit }) => {
          update({ page, limit });
          fetchProductsWithQuery();
        }
      ">
      <template #table>
        <AppTable
          :columns="columns"
          :rows="productsData.data"
          has-actions
          :actions-header-class="'bg-naranja text-white'">
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
import ImportProductsExcel from './ImportProductsExcel.vue';

import type { Product } from '@/types/db';
import AppTable, { type TableColumn } from '../ui/molecules/AppTable.vue';

import { Cuboid, Plus, RefreshCcw } from 'lucide-vue-next';
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

const handleModalExcelProduct = () => {
  openModal(ImportProductsExcel, { onImported: () => fetchProducts() });
};

async function fetchProductsWithQuery() {
  await fetchProducts(query.value);
}

const { productsData, fetchProducts, loading } = useProducts();

const columns: TableColumn<Product>[] = [
  {
    key: 'imageThumbnailUrl',
    label: 'Imagen',
    align: 'center',
    headerClass: 'bg-naranja text-white',
  },
  { key: 'code', label: 'Código', headerClass: 'bg-naranja text-white' },
  { key: 'name', label: 'Nombre', headerClass: 'bg-naranja text-white' },
  {
    key: 'price1',
    label: 'Precio',
    format(value) {
      return formatMXN(Number(value));
    },
    headerClass: 'bg-naranja text-white',
  },
  { key: 'isActive', label: 'Estatus', headerClass: 'bg-naranja text-white' },
  { key: 'description', label: 'Descripción', headerClass: 'bg-naranja text-white' },
];

onBeforeMount(() => fetchProductsWithQuery());
</script>
