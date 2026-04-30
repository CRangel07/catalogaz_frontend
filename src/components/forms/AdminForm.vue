<template>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
    <p class="text-naranja text-lg font-bungee">
      {{ props.admin ? 'Editando usuario' : 'Crear un usuario' }}
    </p>

    <AppInput
      id="admin-name"
      label="Nombre Administrador"
      v-model="name"
      :type="'text'"
      :attrs-vee="nameAttrs"
      :errors="errors.name" />

    <AppInput
      id="admin-username"
      label="Nombre de Usuario"
      v-model="username"
      :type="'text'"
      :attrs-vee="usernameAttrs"
      :errors="errors.username" />

    <AppInput
      id="admin-password"
      label="Contraseña Administrador"
      v-model="password"
      :type="'text'"
      :attrs-vee="passwordAttrs"
      :errors="errors.password" />

    <AppSelect
      v-model="role"
      :attrs-vee="roleAttrs"
      id="admin-role"
      label="Rol de Administrador"
      :options="[
        { label: 'Administrador Total', value: 'admin' },
        { label: 'Surtidor Pedidos', value: 'pedidos' },
        { label: 'Cajas', value: 'caja' },
      ]" />

    <ButtonUI :disabled="loading" :icon="Save" theme="info" class="ms-auto" type="submit">
      Guardar
    </ButtonUI>
  </form>
</template>

<script setup lang="ts">
import ButtonUI from '../ui/atoms/ButtonUI.vue';
import AppInput from '../ui/forms/AppInput.vue';
import AppSelect from '../ui/forms/AppSelect.vue';

import type { Admin } from '@/types/db';

import { Save } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import { useAdmins } from '@/composables/useAdmins';
import { toTypedSchema } from '@vee-validate/zod';
import { CreateAdminDto, UpdateAdminDto, type CreateAdmin } from '@/types/validation';

const props = defineProps<{
  admin?: Admin;
}>();

const emit = defineEmits<{ (e: 'close'): void; (e: 'save'): void }>();

const { createAdmin, updateAdmin, loading } = useAdmins();

const usedSchema = props.admin ? UpdateAdminDto : CreateAdminDto;

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: toTypedSchema(usedSchema),
  initialValues: {
    role: props.admin?.role ?? 'pedidos',
    name: props.admin?.name,
    username: props.admin?.username,
  },
});

const onSubmit = handleSubmit(async (values) => {
  const ok = props.admin
    ? await updateAdmin(props.admin.id, { ...values })
    : await createAdmin({ ...(values as NonNullable<CreateAdmin>) });
  if (ok) {
    emit('close');
    emit('save');
  }
});

const [role, roleAttrs] = defineField('role');
const [name, nameAttrs] = defineField('name');
const [username, usernameAttrs] = defineField('username');
const [password, passwordAttrs] = defineField('password');
</script>
