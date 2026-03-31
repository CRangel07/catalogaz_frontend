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

import { z } from 'zod';
import { useForm } from 'vee-validate';
import { computed } from 'vue';
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

const props = defineProps<{
  customer?: Customer;
}>();

const emit = defineEmits<{
  close: [];
}>();

const isEditing = computed(() => !!props.customer);

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
