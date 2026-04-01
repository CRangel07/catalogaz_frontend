<template>
  <div class="flex flex-col gap-0.5 w-full">
    <label class="text-azul/80 text-sm font-medium">{{ props.label }}</label>

    <div
      class="relative border-2 border-dashed rounded-lg border-slate-300 w-full transition-colors"
      :class="isDragging ? 'border-azul bg-azul/5' : 'hover:border-slate-400'">
      <!-- Zona de drop / click -->
      <label
        :for="props.id"
        class="flex flex-col items-center justify-center gap-2 py-6 px-4 cursor-pointer">
        <!-- Preview de imagen -->
        <div v-if="previewUrl" class="relative">
          <img
            :src="previewUrl"
            :alt="props.id"
            class="h-60 w-60 object-cover rounded-lg shadow-sm" />
          <button
            type="button"
            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
            @click.prevent="clearFile">
            <X :size="18" />
          </button>
        </div>

        <!-- Placeholder sin imagen -->
        <template v-else>
          <ImageUp class="text-slate-400" :size="32" />
          <div class="text-center">
            <p class="text-sm text-slate-600">
              Arrastra una imagen o
              <span class="text-azul font-medium">haz clic para seleccionar</span>
            </p>
            <p class="text-xs text-slate-400 mt-0.5">PNG, JPG, WEBP — máx. 5 MB</p>
          </div>
        </template>
      </label>

      <!-- Input oculto -->
      <input
        :id="props.id"
        type="file"
        accept="image/png, image/jpeg, image/webp"
        class="sr-only"
        v-bind="{ ...props.attrsVee, ...props.attrs }"
        @change="onFileChange"
        @dragenter="isDragging = true"
        @dragleave="isDragging = false"
        @drop="isDragging = false" />
    </div>

    <span v-if="props.errors" class="text-[14px] font-light text-red-400 tracking-wider">
      {{ props.errors }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ImageUp, X } from 'lucide-vue-next';
import type { FileInputProps } from './types';

const BASE = import.meta.env.VITE_ASSETS_URL;

const props = defineProps<FileInputProps>();
const model = defineModel<File | null>();

const previewUrl = ref<string | null>(props.preview ? `${BASE}${props.preview}` : null);
const isDragging = ref(false);

// Si viene una URL externa (modo edición), mostrarla como preview inicial
watch(
  () => props.preview,
  (val) => {
    if (val && !model.value) previewUrl.value = val;
  }
);

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] ?? null;

  if (!file) return;

  model.value = file;
  previewUrl.value = URL.createObjectURL(file);
}

function clearFile() {
  model.value = null;
  previewUrl.value = props.preview ?? null;
}
</script>
