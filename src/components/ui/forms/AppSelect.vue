<template>
  <div class="flex flex-col gap-0.5 w-full">
    <label class="text-azul/80 text-sm font-medium" :for="props.id">{{ props.label }}</label>
    <div class="relative w-full">
      <select
        :id="props.id"
        class="border rounded-lg border-slate-300 block w-full outline-none py-1 px-3 text-slate-700 appearance-none bg-white pr-8"
        v-model="model"
        v-bind="{ ...props.attrsVee, ...props.attrs }">
        <option v-if="props.placeholder" value="" disabled>{{ props.placeholder }}</option>
        <option v-for="option in props.options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <ChevronDown
        class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
        :size="16" />
    </div>
    <span v-if="props.errors" class="text-[14px] font-light text-red-400 tracking-wider">
      {{ props.errors }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import type { SelectProps } from './types';

const props = defineProps<SelectProps>();
const model = defineModel<string | number | null>();
</script>
