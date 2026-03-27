<template>
  <div>
    <form @submit="onSubmit" class="w-full flex flex-col gap-3">
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

      <ButtonUI theme="outline" class="ms-auto">Guardar</ButtonUI>
    </form>
  </div>
</template>

<script setup lang="ts">
import AppInput from '../ui/forms/AppInput.vue';
import ButtonUI from '../ui/atoms/ButtonUI.vue';

import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

const schema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'El nombre es obligatorio').max(30, 'Máximo 30 caracteres'),
    phone: z
      .string()
      .min(1, 'El teléfono es obligatorio')
      .max(10, 'Máximo diez digitos')
      .regex(/^\d+$/, 'Solo se permiten números'),
  })
);

const { handleSubmit, defineField, errors, isSubmitting } = useForm({
  validationSchema: schema,
  initialValues: { name: '', phone: '' },
});

const [name, nameAttrs] = defineField('name');
const [phone, phoneAttrs] = defineField('phone');

const onSubmit = handleSubmit(async (values) => {
  console.table(values);
});
</script>
