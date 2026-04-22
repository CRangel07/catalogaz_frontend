<template>
  <div>
    <span class="block mb-3 text-slate-600"> Editando Pedido </span>
    <form @submit.prevent="onSubmit">
      <AppSelect
        :id="'order-status'"
        label="Modificar Estatus Pedido"
        :options="[
          { label: 'Pendiente', value: 'pending' },
          { label: 'Surtiendo', value: 'preparing' },
          { label: 'Cancelado', value: 'cancelled' },
          { label: 'Pedido Listo', value: 'ready' },
        ]"
        :attrs-vee="statusAttr"
        v-model="status" />

      <ButtonUI theme="warning" class="ms-auto mt-3" type="submit">Guardar</ButtonUI>
    </form>
  </div>
</template>

<script setup lang="ts">
import AppSelect from '../ui/forms/AppSelect.vue';
import ButtonUI from '../ui/atoms/ButtonUI.vue';

import type { OrderFull, OrderStatus } from '@/types/db';

import { useForm } from 'vee-validate';
import { useOrders } from '@/composables/useOrders';
import { toTypedSchema } from '@vee-validate/zod';
import { UpdateOrderSchema } from '@/types/validation';

const props = defineProps<{ order: OrderFull; onSave?: () => void }>();

const { updateOrder } = useOrders();

const { handleSubmit, defineField } = useForm({
  validationSchema: toTypedSchema(UpdateOrderSchema),
  initialValues: {
    status: props.order.status ?? undefined,
  },
});

const [status, statusAttr] = defineField('status');

const emit = defineEmits(['close']);

const onSubmit = handleSubmit(async () => {
  const ok = await updateOrder(props.order.id, { status: status.value as OrderStatus });
  if (ok) {
    props.onSave?.();
    emit('close');
  }
});
</script>
