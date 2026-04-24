<template>
  <div>
    <PageTitle title="Clientes" :icon="BookUser" class="mb-8">
      <template #actions>
        <ButtonUI :icon="Plus" @click="handleModal()" class="ms-auto md:mb-5 mb-3">
          Nuevo Cliente
        </ButtonUI>
      </template>
    </PageTitle>
    <PaginatedTable :response="customers">
      <template #table>
        <AppTable :columns="columns" :rows="customers.data" :skeleton-rows="10" has-actions>
          <template #cell-isActive="{ value }">
            <span
              :class="{
                'text-green-600': !!value == true,
                'text-red-600': !!value == false,
              }">
              {{ !!value ? 'Activo' : 'Inactivo' }}
            </span>
          </template>
          <template #actions="{ row }">
            <ActionsTools @edit="handleModal(row)" />
          </template>
        </AppTable>
      </template>
    </PaginatedTable>
  </div>
</template>

<script setup lang="ts">
import type { Customer } from '@/types/db';
import type { TableColumn } from '@/components/ui/molecules/AppTable.vue';

import AppTable from '@/components/ui/molecules/AppTable.vue';
import ButtonUI from '../ui/atoms/ButtonUI.vue';
import ClientForm from '../forms/ClientForm.vue';
import ActionsTools from '../ui/molecules/ActionsTools.vue';
import PaginatedTable from '../ui/molecules/PaginatedTable.vue';

import { BookUser, Plus } from 'lucide-vue-next';
import { useModal } from '@/composables/useModal';
import { useCustomers } from '@/composables/useCustomers';
import { onBeforeMount } from 'vue';
import PageTitle from '../ui/molecules/PageTitle.vue';

const { openModal } = useModal();

const { fetchCustomers, customers } = useCustomers();

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

const handleModal = (customer?: Customer) => {
  openModal(ClientForm, {
    customer: customer,
    onSave: () => {
      fetchCustomers();
    },
  });
};

onBeforeMount(() => fetchCustomers());
</script>
