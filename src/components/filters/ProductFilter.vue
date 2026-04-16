<template>
  <form @submit.prevent="emit('filter', search)" class="flex items-end gap-5">
    <AppInput
      id="cat-prod-busqueda"
      label="Busca por código o por nombre"
      type="text"
      v-model.trim="search" />
    <ButtonUI size="sm" theme="warning">Buscar</ButtonUI>
  </form>
</template>

<script setup lang="ts">
import ButtonUI from '../ui/atoms/ButtonUI.vue';
import AppInput from '../ui/forms/AppInput.vue';

import { ref } from 'vue';

const emit = defineEmits<{
  filter: [search: string];
}>();

const search = ref<string>('');
</script>
