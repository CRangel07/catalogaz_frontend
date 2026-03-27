<template>
  <div>
    <form @submit="onSubmit" class="w-full flex flex-col gap-3">
      <legend class="text-sm text-slate-500 tracking-wide">Formulario de producto</legend>
      <AppInput
        label="Marca"
        type="text"
        id="producto-nombre"
        :attrs-vee="nameAttrs"
        :errors="errors.name"
        v-model="name"
        required />

      <AppInput
        label="Descripción"
        type="text"
        id="producto-descripcion"
        :attrs-vee="descriptionAttrs"
        :errors="errors.description"
        v-model="description"
        required />

      <AppInput
        label="Precio"
        type="number"
        id="producto-precio"
        :attrs="{ min: 1, step: 0.01 }"
        :attrs-vee="priceAttrs"
        :errors="errors.price"
        v-model="price"
        required />

      <AppSelect
        label="Estatus"
        id="producto-estatus"
        :attrs-vee="statusAttrs"
        :errors="errors.status"
        placeholder="Selecciona Estatus"
        :options="[
          { label: 'Activo', value: 1 },
          { label: 'Inactivo', value: 0 },
        ]"
        v-model="status" />

      <AppFileInput label="Imagen" id="producto-imagen" v-model="file" />

      <ButtonUI theme="outline" class="ms-auto">Guardar</ButtonUI>
    </form>
  </div>
</template>

<script setup lang="ts">
import AppInput from '../ui/forms/AppInput.vue';
import ButtonUI from '../ui/atoms/ButtonUI.vue';
import AppSelect from '../ui/forms/AppSelect.vue';

import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { ref } from 'vue';
import AppFileInput from '../ui/forms/AppFileInput.vue';

const file = ref<File | null>(null);

const schema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 30 caracteres'),
    description: z
      .string()
      .max(60, 'La descripción no debe tener mas de 60 caracteres')
      .nullable()
      .optional(),
    price: z.number().min(1).nonnegative(),
    status: z.number().min(0).max(1),
  })
);

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: schema,
  initialValues: { name: '', description: '', price: 0 },
});

const [name, nameAttrs] = defineField('name');
const [description, descriptionAttrs] = defineField('description');
const [price, priceAttrs] = defineField('price');
const [status, statusAttrs] = defineField('status');

const onSubmit = handleSubmit(async (values) => {
  console.table(values);
});
</script>
