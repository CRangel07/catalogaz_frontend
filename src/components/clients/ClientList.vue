<template>
  <div>
    <ButtonUI :icon="Plus" @click="handleModal()">Nuevo Cliente</ButtonUI>
    <AppTable :columns="columns" :rows="rows" :skeleton-rows="10" has-actions>
      <template #actions="{ row }">
        <ActionsTools @edit="handleModal(row)" />
      </template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
import type { Customer } from '@/types/db';
import type { TableColumn } from '@/components/ui/AppTable.vue';

import AppTable from '@/components/ui/AppTable.vue';
import ButtonUI from '../ui/atoms/ButtonUI.vue';
import ClientForm from '../forms/ClientForm.vue';
import ActionsTools from '../ui/molecules/ActionsTools.vue';

import { Plus } from 'lucide-vue-next';
import { useModal } from '@/composables/useModal';

const { openModal } = useModal();

const columns: TableColumn<Customer>[] = [
  {
    key: 'name',
    label: 'Nombre',
  },
  {
    key: 'phone',
    label: 'Telefono',
  },
  {
    key: 'isActive',
    label: 'Estatus',
  },
];

const rows: Customer[] = [
  {
    id: 23,
    name: 'Carlos Rangel',
    phone: '43322424',
    isActive: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 43,
    name: 'Luisa Ferrer',
    phone: '43322424212',
    isActive: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 12,
    name: 'Erika Taboada',
    phone: '43322424',
    isActive: false,
    createdAt: '',
    updatedAt: '',
  },
];

const handleModal = (customer?: Customer) => {
  openModal(ClientForm, { customer: customer });
};
</script>

<style scoped></style>
