<template>
  <div>
    <form @submit="onSubmit" class="w-full flex flex-col gap-3">
      <p class="text-sm text-slate-500 tracking-wide">
        {{ isEditing ? 'Edita los datos del cliente' : 'Completa los datos del nuevo cliente' }}
      </p>

      <AppInput
        label="Nombre"
        type="text"
        id="cliente-nombre"
        :attrs-vee="nameAttrs"
        :errors="errors.name"
        v-model="name"
        required />

      <AppInput
        label="Telefono (Ej: 4431861218)"
        type="tel"
        id="cliente-telefono"
        :attrs-vee="phoneAttrs"
        :errors="errors.phone"
        v-model="phone"
        required />

      <AppSelect
        v-if="isEditing"
        :id="'cliente-estatus'"
        label="Estatus del cliente"
        :attrs-vee="activeAttrs"
        :errors="errors.isActive"
        :options="[
          { label: 'Activo', value: true },
          { label: 'Inactivo', value: false },
        ]"
        v-model="active" />

      <div class="flex justify-end gap-2 pt-1">
        <ButtonUI type="button" theme="ghost" @click="emit('close')">Cancelar</ButtonUI>
        <ButtonUI type="submit" theme="primary" :loading="isSubmitting">
          {{ isEditing ? 'Actualizar' : 'Guardar' }}
        </ButtonUI>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import AppInput from '../ui/forms/AppInput.vue';
import ButtonUI from '../ui/atoms/ButtonUI.vue';

import type { Customer } from '@/types/db';
import type { CreateCustomerDto } from '@/services/client.service';

import { useForm } from 'vee-validate';
import { computed } from 'vue';
import { useCustomers } from '@/composables/useCustomers';
import { toTypedSchema } from '@vee-validate/zod';
import { CreateClientSchema, UpdateClientSchema } from '@/types/validation';
import AppSelect from '../ui/forms/AppSelect.vue';

const { createCustomer, updateCustomer } = useCustomers();

const props = defineProps<{
  customer?: Customer;
  onSave?: () => void;
}>();

const isEditing = computed(() => !!props.customer);

const schema = toTypedSchema(isEditing.value ? UpdateClientSchema : CreateClientSchema);

const emit = defineEmits<{
  close: [];
}>();

const { handleSubmit, defineField, errors, isSubmitting } = useForm({
  validationSchema: schema,
  initialValues: {
    name: props.customer?.name,
    phone: props.customer?.phone,
    isActive: props.customer?.isActive,
  },
});

const [name, nameAttrs] = defineField('name');
const [phone, phoneAttrs] = defineField('phone');
const [active, activeAttrs] = defineField('isActive');

const onSubmit = handleSubmit(async () => {
  const payload = {
    name: name.value,
    phone: phone.value,
    isActive: active.value,
  };

  const ok = await (isEditing.value && props.customer
    ? updateCustomer(props.customer.id, payload)
    : createCustomer(payload as NonNullable<CreateCustomerDto>));

  if (ok) {
    props.onSave?.();
    emit('close');
  }
});
</script>
