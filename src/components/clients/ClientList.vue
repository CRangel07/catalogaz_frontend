<template>
  <div>
    <AppTable :columns="columns" :rows="rows" :skeleton-rows="10" has-actions>
      <template #actions> <ActionsTools @edit="handleModal" /> </template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
import AppTable from '@/components/ui/AppTable.vue';
import ClientForm from '../forms/ClientForm.vue';
import ActionsTools from '../ui/molecules/ActionsTools.vue';

import { useModal } from '@/composables/useModal';

import type { TableColumn } from '@/components/ui/AppTable.vue';
import type { NumericBoolean } from '@/types/db';

const { openModal } = useModal();

type Client = {
  id: string;
  name: string;
  phone: string;
  status: NumericBoolean;
};

const columns: TableColumn<Client>[] = [
  {
    key: 'name',
    label: 'Nombre',
  },
  {
    key: 'phone',
    label: 'Telefono',
  },
  {
    key: 'status',
    label: 'Estatus',
  },
];

const rows: Client[] = [
  {
    id: 'dkjsakdas',
    name: 'Carlos Rangel',
    phone: '43322424',
    status: 1,
  },
  {
    id: 'dkjsdasakdas',
    name: 'Luisa Ferrer',
    phone: '43322424212',
    status: 1,
  },
  {
    id: 'dkjhgfdhsakdas',
    name: 'Erika Taboada',
    phone: '43322424',
    status: 0,
  },
];

const handleModal = () => {
  openModal(ClientForm);
};
</script>

<style scoped></style>
