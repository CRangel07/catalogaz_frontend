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
    <AppTable :columns="columns" :rows="mockedProducts" has-actions>
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

const { openModal } = useModal();

const handleModalProduct = (product?: Product) => {
  openModal(ProductForm, { product });
};

const columns: TableColumn<Product>[] = [
  { key: 'code', label: 'Código' },
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

const mockedProducts: Product[] = [
  {
    id: 1,
    name: 'Laptop Pro 14',
    code: 'LP-14-001',
    description: 'Laptop profesional 14 pulgadas 16GB RAM',
    price: 24999.99,
    stock: 15,
    imageName: 'laptop-pro-14.jpg',
    imageThumbnailUrl: 'https://m.media-amazon.com/images/I/61LdecwlWYL._AC_UF894,1000_QL80_.jpg',
    imageFullUrl: 'https://m.media-amazon.com/images/I/61LdecwlWYL._AC_UF894,1000_QL80_.jpg',
    isActive: 1,
    createdAt: '2026-01-10T10:15:00.000Z',
    updatedAt: '2026-03-01T08:20:00.000Z',
  },
  {
    id: 2,
    name: 'Mouse Inalámbrico MX',
    code: 'MS-MX-002',
    description: 'Mouse ergonómico inalámbrico',
    price: 799.5,
    stock: 120,
    imageName: 'mouse-mx.jpg',
    imageThumbnailUrl: 'https://cdn.example.com/products/thumb/mouse-mx.jpg',
    imageFullUrl: 'https://cdn.example.com/products/full/mouse-mx.jpg',
    isActive: 1,
    createdAt: '2026-01-12T09:00:00.000Z',
    updatedAt: '2026-02-28T12:30:00.000Z',
  },
  {
    id: 3,
    name: 'Teclado Mecánico RGB',
    code: 'KB-RGB-003',
    description: 'Teclado mecánico switches red',
    price: 1599.99,
    stock: 60,
    imageName: 'keyboard-rgb.jpg',
    imageThumbnailUrl: 'https://cdn.example.com/products/thumb/keyboard-rgb.jpg',
    imageFullUrl: 'https://cdn.example.com/products/full/keyboard-rgb.jpg',
    isActive: 1,
    createdAt: '2026-01-15T14:25:00.000Z',
    updatedAt: '2026-02-20T11:10:00.000Z',
  },
  {
    id: 4,
    name: "Monitor 27'' 4K",
    code: 'MN-4K-004',
    description: 'Monitor UHD 27 pulgadas IPS',
    price: 8999,
    stock: 22,
    imageName: 'monitor-27-4k.jpg',
    imageThumbnailUrl: 'https://cdn.example.com/products/thumb/monitor-27-4k.jpg',
    imageFullUrl: 'https://cdn.example.com/products/full/monitor-27-4k.jpg',
    isActive: 1,
    createdAt: '2026-01-18T16:00:00.000Z',
    updatedAt: '2026-03-05T09:45:00.000Z',
  },
  {
    id: 5,
    name: 'SSD NVMe 1TB',
    code: 'SSD-1TB-005',
    description: 'Disco sólido NVMe Gen4',
    price: 1899.9,
    stock: 75,
    imageName: 'ssd-1tb.jpg',
    imageThumbnailUrl: 'https://cdn.example.com/products/thumb/ssd-1tb.jpg',
    imageFullUrl: 'https://cdn.example.com/products/full/ssd-1tb.jpg',
    isActive: 1,
    createdAt: '2026-01-20T08:10:00.000Z',
    updatedAt: '2026-02-25T13:55:00.000Z',
  },
  {
    id: 6,
    name: 'Webcam HD 1080p',
    code: 'WC-HD-006',
    description: null,
    price: 599,
    stock: 200,
    imageName: null,
    imageThumbnailUrl: null,
    imageFullUrl: null,
    isActive: 1,
    createdAt: '2026-01-22T12:00:00.000Z',
    updatedAt: '2026-03-02T10:10:00.000Z',
  },
  {
    id: 7,
    name: 'Audífonos Bluetooth',
    code: 'HP-BT-007',
    description: 'Audífonos inalámbricos cancelación de ruido',
    price: 1299.99,
    stock: 48,
    imageName: 'headphones-bt.jpg',
    imageThumbnailUrl: 'https://cdn.example.com/products/thumb/headphones-bt.jpg',
    imageFullUrl: 'https://cdn.example.com/products/full/headphones-bt.jpg',
    isActive: 1,
    createdAt: '2026-01-25T18:30:00.000Z',
    updatedAt: '2026-03-03T07:25:00.000Z',
  },
  {
    id: 8,
    name: 'Dock USB-C',
    code: 'DK-USBC-008',
    description: 'Docking station USB-C multipuerto',
    price: 999,
    stock: 33,
    imageName: 'dock-usbc.jpg',
    imageThumbnailUrl: 'https://cdn.example.com/products/thumb/dock-usbc.jpg',
    imageFullUrl: 'https://cdn.example.com/products/full/dock-usbc.jpg',
    isActive: 0,
    createdAt: '2026-01-27T09:40:00.000Z',
    updatedAt: '2026-02-15T15:15:00.000Z',
  },
  {
    id: 9,
    name: 'Silla Gamer Pro',
    code: 'CH-GMR-009',
    description: 'Silla ergonómica reclinable',
    price: 4599,
    stock: 12,
    imageName: 'chair-gamer.jpg',
    imageThumbnailUrl: 'https://cdn.example.com/products/thumb/chair-gamer.jpg',
    imageFullUrl: 'https://cdn.example.com/products/full/chair-gamer.jpg',
    isActive: 1,
    createdAt: '2026-02-01T11:11:00.000Z',
    updatedAt: '2026-03-10T14:05:00.000Z',
  },
  {
    id: 10,
    name: 'Tablet 10" Android',
    code: 'TB-AND-010',
    description: 'Tablet 10 pulgadas 128GB',
    price: 3299.99,
    stock: 27,
    imageName: 'tablet-10.jpg',
    imageThumbnailUrl: 'https://cdn.example.com/products/thumb/tablet-10.jpg',
    imageFullUrl: 'https://cdn.example.com/products/full/tablet-10.jpg',
    isActive: 1,
    createdAt: '2026-02-05T13:50:00.000Z',
    updatedAt: '2026-03-12T16:40:00.000Z',
  },
];
</script>
