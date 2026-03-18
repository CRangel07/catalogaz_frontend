<template>
  <div class="flex flex-col gap-0.5 w-full">
    <label class="text-blue-800" :for="props.id">{{ props.label }}</label>
    <input
      class="border rounded border-slate-400 block w-full outline-none py-0.5 px-3 text-slate-700"
      :type="props.type"
      v-model="model"
      v-bind="props.attrs" />
    <span v-if="props.errors" class="text-sm text-red-400 tracking-wider">{{ props.errors }}</span>
  </div>
</template>

<script setup lang="ts">
import type { InputProps } from './types';

const props = defineProps<InputProps>();

const model = defineModel<string | number | null>();
</script>
