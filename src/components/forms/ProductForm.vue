<template>
  <form @submit="onSubmit" class="w-full flex flex-col gap-3">
    <p class="text-sm text-slate-500 tracking-wide">
      {{ isEditing ? 'Edita los datos del producto' : 'Completa los datos del nuevo producto' }}
    </p>

    <AppInput
      label="Código"
      type="text"
      id="producto-código"
      :attrs-vee="codeAttrs"
      :errors="errors.code"
      v-model="code" />

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
      v-model="description"
      optional />

    <AppInput
      label="Precio #1"
      type="number"
      id="producto-precio-uno"
      :attrs="{ min: 0.01, step: 0.01 }"
      :attrs-vee="priceOneAttrs"
      :errors="errors.priceOne"
      v-model="priceOne" />

    <AppInput
      label="Precio #4"
      type="number"
      id="producto-precio-cuatro"
      :attrs="{ min: 0.01, step: 0.01 }"
      :attrs-vee="priceFourAttrs"
      :errors="errors.priceFour"
      v-model="priceFour" />

    <AppSelect
      v-if="isEditing"
      label="Estatus"
      id="producto-estatus"
      :attrs-vee="isActiveAttrs"
      :errors="errors.isActive"
      placeholder="Selecciona un estatus"
      :options="[
        { label: 'Activo', value: true },
        { label: 'Inactivo', value: false },
      ]"
      v-model="isActive" />

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
import { useProducts } from '@/composables/useProducts';
import { ProductSchema } from '@/types/validation';
import { computed, ref } from 'vue';
import { toTypedSchema } from '@vee-validate/zod';

import AppInput from '../ui/forms/AppInput.vue';
import ButtonUI from '../ui/atoms/ButtonUI.vue';
import AppSelect from '../ui/forms/AppSelect.vue';
import AppFileInput from '../ui/forms/AppFileInput.vue';

import type { CreateProductDto, Product } from '@/types/db';

const props = defineProps<{
  product?: Product;
  onUpdated?: () => void;
  onSaved?: () => void;
}>();

const emit = defineEmits<{
  close: [];
  save: [];
}>();

const { createProduct, updateProduct } = useProducts();

const isEditing = computed(() => !!props.product);

const imageFile = ref<File | null>(null);

const schema = toTypedSchema(
  ProductSchema.extend({
    image: isEditing.value
      ? z.instanceof(File).optional()
      : z.instanceof(File, { message: 'La imagen es obligatoria' }),
  })
);

// ── Formulario ────────────────────────────────────────────────────────────────
const { handleSubmit, defineField, errors, isSubmitting, setFieldValue } = useForm({
  validationSchema: schema,
  initialValues: {
    name: props.product?.name ?? '',
    description: props.product?.description ?? '',
    priceOne: props.product?.price1 ?? undefined,
    priceFour: props.product?.price4,
    isActive: props.product?.isActive ?? undefined,
    code: props.product?.code,
  },
});

const [code, codeAttrs] = defineField('code');
const [name, nameAttrs] = defineField('name');
const [isActive, isActiveAttrs] = defineField('isActive');
const [priceOne, priceOneAttrs] = defineField('priceOne');
const [priceFour, priceFourAttrs] = defineField('priceFour');
const [description, descriptionAttrs] = defineField('description');

// ── Submit ────────────────────────────────────────────────────────────────────
const onSubmit = handleSubmit(async () => {
  const payload: NonNullable<CreateProductDto> = {
    name: name.value,
    code: code.value,
    description: description.value,
    isActive: Boolean(!!isActive.value) ?? false,
    price1: priceOne.value,
    price4: priceFour.value,
  } as NonNullable<CreateProductDto>;

  const ok = await (isEditing.value && props.product
    ? updateProduct(props.product.id, {
        ...payload,
        image: imageFile.value,
      })
    : createProduct({
        ...(payload as NonNullable<CreateProductDto>),
        image: imageFile.value,
      }));

  if (ok) {
    emit('save');
    emit('close');
  }
});
</script>
