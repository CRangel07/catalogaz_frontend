<template>
  <div class="flex items-center gap-1.5">
    <ButtonUI size="xs" theme="warning" :icon="Pen" @click="emit('edit')"> Editar </ButtonUI>
    <ButtonUI v-if="enableDelete" size="sm" theme="danger" :icon="Trash2" @click="confirmDelete">
      Eliminar
    </ButtonUI>
  </div>
</template>

<script setup lang="ts">
import ButtonUI from '../atoms/ButtonUI.vue';

import { Pen, Trash2 } from 'lucide-vue-next';

defineProps<{
  enableDelete?: boolean;
}>();

const emit = defineEmits<{
  edit: [];
  delete: [];
}>();

const confirmDelete = () => {
  const confirmed = confirm('Confirma la eliminación del elemento');
  if (confirmed) emit('delete');
};
</script>
