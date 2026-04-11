<template>
  <OrderList
    :orders="orders"
    :title-props="{
      title: 'Listando todos los pedidos',
      description: 'Consulta los pedidos que han realizado tus clientes',
    }" />
</template>

<script setup lang="ts">
import OrderList from '@/components/orders/OrderList.vue';

import { useOrders } from '@/composables/useOrders';
import { onBeforeMount } from 'vue';

const { fetchOrdersAdm, orders } = useOrders();

onBeforeMount(() => {
  fetchOrdersAdm();
});
</script>
