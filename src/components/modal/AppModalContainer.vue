<template>
  <!-- Teleport al body para evitar problemas de z-index/stacking context -->
  <Teleport to="body">
    <AppModal
      v-for="(modal, index) in modalStore.activeModals"
      :key="modal.id"
      :id="modal.id"
      :options="modal.options"
      :stack-index="index"
      @close="modalStore.closeLast">
      <!-- Renderiza dinámicamente el componente del modal con sus props -->
      <component :is="modal.component" v-bind="modal.props" @close="modalStore.closeLast" />
    </AppModal>
  </Teleport>
</template>

<script setup lang="ts">
import { useModalStore } from '@/stores/modal';
import AppModal from './AppModal.vue';

const modalStore = useModalStore();
</script>
