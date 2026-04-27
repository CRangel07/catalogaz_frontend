<template>
  <div>
    <PageTitle
      :icon="ArchiveX"
      title="Productos Negados"
      description="Gestiona los productos que se han marcado que no cuentan con existencia de hace 15 días"
      class="mb-10">
    </PageTitle>

    <PaginatedTable :response="data">
      <template #table>
        <AppTable :columns="columns" :rows="data.data">
          <template #cell-product="{ row }">
            <div class="flex items-center justify-between">
              <div>
                <span class="block font-mono text-slate-500 font-medium">
                  {{ row.product.code }}
                </span>
                <span class="block text-azul text-[15px] font-semibold">
                  {{ row.product.name }}
                </span>
              </div>
              <div class="max-w-20">
                <ImageNotFound :url="String(row.product.imageThumbnailUrl)" alt="producto-imagen" />
              </div>
            </div>
          </template>
          <template #cell-order="{ row }">
            <div>
              <span class="block font-mono text-slate-500 font-medium">
                {{ formatDate(row.order.createdAt) }}
              </span>
              <span class="block text-slate-500 font-mono text-[15px] font-semibold">
                Id de Orden: {{ row.order.id }}
              </span>
            </div>
          </template>
        </AppTable>
      </template>
    </PaginatedTable>
  </div>
</template>

<script setup lang="ts">
import PageTitle from '../ui/molecules/PageTitle.vue';
import ImageNotFound from '../ui/molecules/ImageNotFound.vue';
import PaginatedTable from '../ui/molecules/PaginatedTable.vue';

import type { PaginatedResponse, ProductUnavailable } from '@/types/db';
import AppTable, { type TableColumn } from '../ui/molecules/AppTable.vue';

import { ArchiveX } from 'lucide-vue-next';
import { useToastStore } from '@/stores/toast.store';
import { ProductService } from '@/services/product.service';
import { onBeforeMount, ref } from 'vue';
import { formatDate } from '@/helpers/dates';

const toast = useToastStore();

const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const data = ref<PaginatedResponse<ProductUnavailable>>({
  data: [],
  limit: 40,
  page: 1,
  total: 0,
  totalPages: 0,
});

async function fetchProductsUnavailable() {
  loading.value = true;
  error.value = null;
  try {
    data.value = await ProductService.getUnavailable();
  } catch (e) {
    error.value = (e as Error).message;
    toast.error(error.value, 6000);
  } finally {
    loading.value = false;
  }
}

const columns: TableColumn<ProductUnavailable>[] = [
  { key: 'product', label: 'Producto' },
  { key: 'order', label: 'Orden' },
  {
    key: 'quantity',
    label: 'Cantidad pedida',
    cellClass: 'text-azul! text-[17px]!',
    format(value) {
      return value + ' Unidades';
    },
  },
];

onBeforeMount(() => fetchProductsUnavailable());
</script>
