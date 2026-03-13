<template>
  <div>
    <form @submit="onSubmit" class="w-full">
      <div class="flex flex-col">
        <label for="name">Nombre</label>
        <input id="name" type="text" v-model="name" v-bind="nameAttrs" class="border" />
        <span v-if="errors.name" class="text-xs text-red-400">{{ errors.name }}</span>
      </div>

      <div class="flex flex-col">
        <label for="phone">Teléfono</label>
        <input id="phone" type="tel" v-model="phone" v-bind="phoneAttrs" class="border" />
        <span v-if="errors.phone" class="text-xs text-red-400">{{ errors.phone }}</span>
      </div>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Guardando...' : 'Enviar' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

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
