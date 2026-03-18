<template>
  <div>
    <ButtonUI @click="emit('edit')" size="sm" theme="outline" :icon="Pen">Editar</ButtonUI>
  </div>
</template>

<script setup lang="ts">
import { Pen } from 'lucide-vue-next';

import ButtonUI from '../atoms/ButtonUI.vue';

const emit = defineEmits<{ (e: 'edit'): void }>();
</script>

<style scoped></style>
