<template>
  <Teleport to="body">
    <div class="fixed bottom-5 right-5 z-2000 flex flex-col gap-2">
      <AppToast v-for="toast in toastStore.toasts" :key="toast.id" :toast="toast" />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import AppToast from './AppToast.vue';

import { useToastStore } from '@/stores/toast.store';

const toastStore = useToastStore();
</script>
