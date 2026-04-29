<template>
  <div>
    <PageTitle
      title="Gestión de usuarios"
      :description="'Cambia roles, gestiona contraseñas, agrega algun usuario'"
      :icon="UserStar">
      <template #actions>
        <ButtonUI :icon="Plus" :icon-position="'right'">Agregar Usuario</ButtonUI>
      </template>
    </PageTitle>

    <div class="h-10"></div>

    <AppTable
      :columns="columns"
      :rows="[
        {
          id: 1,
          createdAt: new Date(),
          name: 'carlangas',
          password: 'dsadas',
          role: 'admin',
          updatedAt: new Date(),
          username: 'saddasd',
        },
      ]"></AppTable>
  </div>
</template>

<script setup lang="ts">
import type { Admin } from '@/types/db';
import AppTable, { type TableColumn } from '@/components/ui/molecules/AppTable.vue';

import ButtonUI from '@/components/ui/atoms/ButtonUI.vue';
import PageTitle from '@/components/ui/molecules/PageTitle.vue';

import { Plus, UserStar } from 'lucide-vue-next';

const columns: TableColumn<Admin>[] = [
  { key: 'id', label: 'ID', cellClass: 'bg-azul text-white', headerClass: 'bg-naranja text-white' },
  { key: 'name', label: 'Nombre' },
  { key: 'username', label: 'Usuario' },
  { key: 'createdAt', label: 'Detalles' },
];
</script>
