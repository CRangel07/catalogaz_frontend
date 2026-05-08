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
          :icon="Sheet"
          class="ms-auto mb-5"
          :disabled="loading"
          @click="handleModalExcelProduct()">
          Subir Desde Excel
        </ButtonUI>
        <ButtonUI
          size="sm"
          theme="success"
          :icon="ReceiptText"
          class="ms-auto mb-5"
          :disabled="loading"
          @click="handleModalMatricialProduct()">
          Subir Matricial
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
          update({ ...q, page: 1 });
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

          <template #cell-name="{ row }">
            {{ row.name }}
            <p v-if="row.line" class="text-xs text-slate-500">
              {{ row.line?.code }} |
              {{ row.line?.name }}
            </p>
          </template>

          <template #cell-isActive="{ value }">
            <span
              class="px-3 py-1 rounded-full border"
              :class="{
                'bg-lime-100 text-lime-800 border-lime-400': value == true,
                'bg-yellow-100 text-yellow-800 border-yellow-400 ': value == false,
              }">
              {{ !!value ? 'Activo' : 'Inactivo' }}
            </span>
          </template>

          <template #cell-price1="{ row }">
            <div class="bg-gray-50 rounded-lg p-3 min-w-max shadow-sm border border-gray-100">
              <div class="flex flex-col gap-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">Precio 1</span>
                  <span class="font-bold text-green-600">
                    {{ formatMXN(row.price1) }}
                  </span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-500">Precio 4</span>
                  <span class="font-bold text-blue-600">
                    {{ formatMXN(row.price4) }}
                  </span>
                </div>
              </div>
            </div>
          </template>

          <template #cell-isOffer="{ row }">
            <div
              class="rounded-lg p-3 border text-sm transition"
              :class="row.isOffer ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'">
              <div class="flex justify-between items-center mb-1">
                <span class="text-gray-500">Oferta</span>
                <span
                  class="text-xs font-semibold px-2 py-0.5 rounded-full"
                  :class="
                    row.isOffer ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                  ">
                  {{ row.isOffer ? 'Activa' : 'Inactiva' }}
                </span>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-gray-500 text-xs">Precio</span>
                <span class="font-bold" :class="row.isOffer ? 'text-green-600' : 'text-gray-400'">
                  {{ row.isOffer ? formatMXN(row.salePrice!) : '—' }}
                </span>
              </div>
            </div>
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
import ImportProductsMatricial from './ImportProductsMatricial.vue';

import type { Product } from '@/types/db';
import type { PaginatedSearch } from '../filters/types';
import AppTable, { type TableColumn } from '../ui/molecules/AppTable.vue';

import { Cuboid, Plus, ReceiptText, RefreshCcw, Sheet } from 'lucide-vue-next';
import { useModal } from '@/composables/useModal';
import { formatMXN } from '@/helpers/currencyMxn';
import { useProducts } from '@/composables/useProducts';
import { onBeforeMount } from 'vue';
import { useQueryState } from '@/composables/useQueryState';

const { openModal } = useModal();

const { query, update } = useQueryState<PaginatedSearch>({
  search: '',
  page: 1,
  limit: 10,
});

const handleModalProduct = (product?: Product) => {
  openModal(ProductForm, { product, onSave: () => fetchProductsWithQuery() });
};

const handleModalExcelProduct = () => {
  openModal(ImportProductsExcel, { onImported: () => fetchProductsWithQuery() });
};

const handleModalMatricialProduct = () => {
  openModal(ImportProductsMatricial, { onImported: () => fetchProductsWithQuery() });
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
    label: 'Precios',
    headerClass: 'bg-naranja text-white',
  },
  {
    key: 'isOffer',
    label: 'Oferta',
    headerClass: 'bg-naranja text-white',
  },
  { key: 'isActive', label: 'Estatus', headerClass: 'bg-naranja text-white' },
  { key: 'description', label: 'Descripción', headerClass: 'bg-naranja text-white' },
];

onBeforeMount(() => fetchProductsWithQuery());
</script>
