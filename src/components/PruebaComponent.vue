<template>
  <div>
    <ClientForm />
  </div>
</template>

<script setup lang="ts">
import ClientForm from './forms/ClientForm.vue';

defineProps<{ title: string }>();
</script>

<style scoped></style>
