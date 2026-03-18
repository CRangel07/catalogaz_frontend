<template>
  <div>
    <form @submit="onSubmit" class="w-full">
      <AppInput
        label="Nombre"
        type="text"
        id="cliente-nombre"
        :attrs-vee="nameAttrs"
        :errors="errors.name"
        v-model="name" />

      <AppInput
        label="Telefono"
        type="tel"
        id="cliente-telefono"
        :attrs-vee="phoneAttrs"
        :errors="errors.phone"
        v-model="phone" />

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Guardando...' : 'Enviar' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import AppInput from '../ui/forms/AppInput.vue';

const schema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'El nombre es obligatorio').max(30, 'Máximo 30 caracteres'),
    phone: z
      .string()
      .min(1, 'El teléfono es obligatorio')
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
