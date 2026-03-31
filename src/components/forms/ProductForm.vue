<template>
  <form @submit="onSubmit" class="w-full flex flex-col gap-3">
    <p class="text-sm text-slate-500 tracking-wide">
      {{ isEditing ? 'Edita los datos del producto' : 'Completa los datos del nuevo producto' }}
    </p>

    <AppInput
      label="Marca"
      type="text"
      id="producto-marca"
      :attrs-vee="brandAttrs"
      :errors="errors.brand"
      v-model="brand" />

    <AppInput
      label="Nombre"
      type="text"
      id="producto-nombre"
      :attrs-vee="nameAttrs"
      :errors="errors.name"
      v-model="name" />

    <AppInput
      label="Descripción"
      type="text"
      id="producto-descripcion"
      :attrs-vee="descriptionAttrs"
      :errors="errors.description"
      v-model="description" />

    <AppInput
      label="Precio"
      type="number"
      id="producto-precio"
      :attrs="{ min: 0.01, step: 0.01 }"
      :attrs-vee="priceAttrs"
      :errors="errors.price"
      v-model="price" />

    <AppSelect
      label="Estatus"
      id="producto-estatus"
      :attrs-vee="availableAttrs"
      :errors="errors.available"
      placeholder="Selecciona un estatus"
      :options="[
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 },
      ]"
      v-model="available" />

    <!--
      AppFileInput usa defineModel internamente.
      Cuando el usuario selecciona un archivo, llamamos setFieldValue
      para que vee-validate lo registre y pueda validarlo con Zod.
      En modo edición pasamos imageUrl como preview para mostrar
      la imagen actual mientras no se suba una nueva.
    -->
    <AppFileInput
      label="Imagen"
      id="producto-imagen"
      :preview="props.product?.imageThumbnailUrl ?? null"
      :errors="errors.image"
      v-model="imageFile"
      @update:model-value="setFieldValue('image', $event ?? undefined)" />

    <div class="flex justify-end gap-2 pt-1">
      <ButtonUI type="button" theme="ghost" @click="emit('close')">Cancelar</ButtonUI>
      <ButtonUI type="submit" theme="primary" :loading="isSubmitting">
        {{ isEditing ? 'Actualizar' : 'Guardar' }}
      </ButtonUI>
    </div>
  </form>
</template>

<script setup lang="ts">
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { computed, ref } from 'vue';
import { toTypedSchema } from '@vee-validate/zod';

import AppInput from '../ui/forms/AppInput.vue';
import AppSelect from '../ui/forms/AppSelect.vue';
import AppFileInput from '../ui/forms/AppFileInput.vue';
import ButtonUI from '../ui/atoms/ButtonUI.vue';

import type { Product } from '@/types/db';

// ── Props ─────────────────────────────────────────────────────────────────────
// product es opcional: si llega estamos en modo edición, si no en modo creación
const props = defineProps<{
  product?: Product;
}>();

const emit = defineEmits<{
  close: [];
}>();

const isEditing = computed(() => !!props.product);

const imageFile = ref<File | null>(null);

// ── Schema ────────────────────────────────────────────────────────────────────
const schema = toTypedSchema(
  z.object({
    brand: z.string().min(1, 'La marca es obligatoria').max(50, 'Máximo 50 caracteres'),

    name: z.string().min(1, 'El nombre es obligatorio').max(60, 'Máximo 60 caracteres'),

    description: z.string().max(120, 'Máximo 120 caracteres').nullable().optional(),

    price: z.number().min(0.01, 'El precio debe ser mayor a 0'),

    available: z.number().min(0).max(1),

    image: isEditing.value
      ? z.instanceof(File).optional()
      : z.instanceof(File, { message: 'La imagen es obligatoria' }),
  })
);

// ── Formulario ────────────────────────────────────────────────────────────────
const { handleSubmit, defineField, errors, isSubmitting, setFieldValue } = useForm({
  validationSchema: schema,
  // Si hay producto (edición), prellenamos los campos con sus valores actuales
  initialValues: {
    name: props.product?.name ?? '',
    description: props.product?.description ?? '',
    price: props.product?.price ?? undefined,
  },
});

const [brand, brandAttrs] = defineField('brand');
const [name, nameAttrs] = defineField('name');
const [description, descriptionAttrs] = defineField('description');
const [price, priceAttrs] = defineField('price');
const [available, availableAttrs] = defineField('available');

// ── Submit ────────────────────────────────────────────────────────────────────
const onSubmit = handleSubmit(async (values) => {
  // Aquí armarás el FormData para enviar al backend con la imagen
  const formData = new FormData();
  formData.append('brand', values.brand);
  formData.append('name', values.name);
  if (values.description) formData.append('description', values.description);
  formData.append('price', String(values.price));
  formData.append('available', String(values.available));
  if (values.image) formData.append('image', values.image);

  // TODO: llamar al servicio de API
  // await productService.create(formData)   — modo creación
  // await productService.update(props.product!.id, formData) — modo edición
  console.table(Object.fromEntries(formData));
});
</script>
