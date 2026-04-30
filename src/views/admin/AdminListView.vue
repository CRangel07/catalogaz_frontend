<template>
  <div>
    <PageTitle
      title="Gestión de usuarios"
      :description="'Cambia roles, gestiona contraseñas, agrega algun usuario'"
      :icon="UserStar">
      <template #actions>
        <ButtonUI :icon="Plus" :icon-position="'right'" @click="openAdminForm()">
          Agregar Usuario
        </ButtonUI>
      </template>
    </PageTitle>

    <div class="h-10"></div>

    <AppTable :columns="columns" :rows="admins" :has-actions="true">
      <template #actions="{ row }">
        <ButtonUI
          type="button"
          size="xs"
          :icon="Edit"
          theme="warning"
          @click="openAdminForm(row)"
          :disabled="loading">
          Editar
        </ButtonUI>
      </template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
import type { Admin, AdminRole } from '@/types/db';
import AppTable, { type TableColumn } from '@/components/ui/molecules/AppTable.vue';

import ButtonUI from '@/components/ui/atoms/ButtonUI.vue';
import PageTitle from '@/components/ui/molecules/PageTitle.vue';
import AdminForm from '@/components/forms/AdminForm.vue';

import { useModal } from '@/composables/useModal';
import { useAdmins } from '@/composables/useAdmins';
import { onBeforeMount } from 'vue';
import { Edit, Plus, UserStar } from 'lucide-vue-next';

const { openModal } = useModal();
const { loading, admins, fetchAdmins } = useAdmins();

const columns: TableColumn<Admin>[] = [
  { key: 'id', label: 'ID', cellClass: 'bg-azul text-white', headerClass: 'bg-naranja text-white' },
  { key: 'name', label: 'Nombre' },
  { key: 'username', label: 'Usuario' },
  {
    key: 'role',
    label: 'Rol',
    format(value) {
      const val = value as AdminRole;
      if (val == 'admin') return 'Administrador';
      else if (val == 'caja') return 'Cobrar en Caja';
      else if (val == 'pedidos') return 'Surte Pedidos';
      else return 'Desconocido';
    },
  },
  { key: 'createdAt', label: 'Detalles' },
];

const openAdminForm = (row?: Admin) => {
  openModal(AdminForm, {
    admin: row,
    onSave: () => fetchAdmins(),
  });
};

onBeforeMount(() => fetchAdmins());
</script>
