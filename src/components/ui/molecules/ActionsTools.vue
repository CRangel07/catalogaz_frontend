<template>
  <div class="flex items-center gap-1.5">
    <ButtonUI size="sm" theme="outline" :icon="Pen" @click="emit('edit')"> Editar </ButtonUI>
    <ButtonUI size="sm" theme="danger" :icon="Trash2" @click="emit('delete')"> Eliminar </ButtonUI>
  </div>
</template>

<script setup lang="ts">
import { Pen, Trash2 } from 'lucide-vue-next';
import ButtonUI from '../atoms/ButtonUI.vue';

const emit = defineEmits<{
  edit: [];
  delete: [];
}>();
</script>
