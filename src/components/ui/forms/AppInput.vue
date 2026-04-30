<template>
  <div class="flex flex-col gap-0.5 w-full group">
    <label class="text-azul/80 text-sm font-medium" :for="props.id">
      {{ props.label }}
      <span v-if="props.optional" class="text-xs align-baseline text-slate-400">(Opcional)</span>
    </label>
    <input
      ref="inputRef"
      class="border-2 rounded-lg border-slate-300 block w-full outline-none py-1 px-3 text-slate-700 group-focus-within:border-cyan-400"
      :type="props.type"
      v-model="model"
      v-bind="{ ...props.attrsVee, ...props.attrs }" />
    <span v-if="props.errors" class="text-[14px] font-light text-red-400 tracking-wider">
      {{ props.errors }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { InputProps } from './types';

const props = defineProps<InputProps>();

const model = defineModel<string | number | null>();

const inputRef = ref<HTMLInputElement | null>(null);

const focus = () => inputRef.value?.focus();

defineExpose({ focus });
</script>
