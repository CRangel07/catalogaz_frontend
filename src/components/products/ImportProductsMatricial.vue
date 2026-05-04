<template>
  <div class="flex flex-col gap-4">
    <div
      class="relative border-2 border-dashed rounded-xl transition-colors"
      :class="
        isDragging
          ? 'border-indigo-500 bg-indigo-50'
          : file
            ? 'border-emerald-400 bg-emerald-50'
            : 'border-slate-300 hover:border-slate-400'
      "
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop">
      <label
        :for="inputId"
        class="flex flex-col items-center justify-center gap-3 py-8 px-4 cursor-pointer">
        <!-- Ícono según estado -->
        <div
          class="flex items-center justify-center size-12 rounded-xl"
          :class="file ? 'bg-emerald-100' : isDragging ? 'bg-indigo-100' : 'bg-slate-100'">
          <CheckCircle v-if="file" class="text-emerald-600" :size="26" />
          <FileUp v-else-if="isDragging" class="text-indigo-500" :size="26" />
          <Sheet v-else class="text-slate-400" :size="26" />
        </div>

        <!-- Texto -->
        <div class="text-center">
          <template v-if="file">
            <p class="text-sm font-semibold text-emerald-700">{{ file.name }}</p>
            <p class="text-xs text-emerald-500 mt-0.5">{{ fileSizeLabel }} · listo para importar</p>
          </template>
          <template v-else>
            <p class="text-sm text-slate-600">
              Arrastra tu archivo de TXT matricial aquí o
              <span class="text-indigo-600 font-medium">haz clic para seleccionar</span>
            </p>
            <p class="text-xs text-slate-400 mt-0.5">Solo archivos .txt — máx. 10 MB</p>
          </template>
        </div>

        <!-- Botón limpiar cuando hay archivo -->
        <button
          v-if="file"
          type="button"
          class="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition-colors"
          @click.prevent="clearFile">
          <X :size="13" />
          Quitar archivo
        </button>
      </label>

      <input
        :id="inputId"
        type="file"
        accept=".txt,text/plain"
        class="sr-only"
        @change="onFileChange" />
    </div>

    <!-- Resultado de importación -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0">
      <div v-if="result" class="flex flex-col gap-3">
        <!-- Resumen -->
        <div class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p class="text-sm font-semibold text-emerald-800 mb-2">
            {{ result.message }}
          </p>
          <div class="flex justify-evenly flex-wrap gap-3">
            <ResultBadge
              v-if="result.data.summary.linesUpserted > 0"
              label="Lineas Guardadas"
              :value="result.data.summary.linesUpserted"
              color="indigo" />
            <ResultBadge
              v-if="result.data.summary.skippedOffers > 0"
              label="Ofertas Saltadas"
              :value="result.data.summary.skippedOffers"
              color="indigo" />
            <ResultBadge
              v-if="result.data.summary.totalLines > 0"
              label="Lineas Totales"
              :value="result.data.summary.totalLines"
              color="indigo" />
            <ResultBadge
              v-if="result.data.summary.totalParsed > 0"
              label="Total Elementos"
              :value="result.data.summary.totalParsed"
              color="indigo" />
            <ResultBadge
              v-if="result.data.summary.upserted > 0"
              label="Total Actualizados"
              :value="result.data.summary.upserted"
              color="indigo" />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Acciones -->
    <div class="flex items-center justify-end gap-3">
      <!-- Importar -->
      <ButtonUI
        theme="success"
        size="sm"
        :icon="FileUp"
        :loading="isImporting"
        :disabled="!file"
        @click="importMatricial">
        Importar productos
      </ButtonUI>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ImportingMatricialResult } from '@/types/db';

import { useProducts } from '@/composables/useProducts';
import { ref, computed } from 'vue';
import { useToastStore } from '@/stores/toast.store';
import { X, Sheet, FileUp, CheckCircle } from 'lucide-vue-next';

import ButtonUI from '../ui/atoms/ButtonUI.vue';
import ResultBadge from '../ui/molecules/ResultBadge.vue';

const toastStore = useToastStore();

const emit = defineEmits<{ (e: 'imported'): void }>();

const { uploadMatricial } = useProducts();

const inputId = 'txt-import-input';

const file = ref<File | null>(null);
const isDragging = ref(false);
const showErrors = ref(false);
const isImporting = ref(false);

const result = ref<ImportingMatricialResult | null>(null);

// ─── Computed ─────────────────────────────────────────────────────────────────

const fileSizeLabel = computed(() => {
  if (!file.value) return '';
  const kb = file.value.size / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
});

// ─── Handlers archivo ─────────────────────────────────────────────────────────

function onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  const selected = input.files?.[0] ?? null;
  setFile(selected);
}

function onDrop(event: DragEvent): void {
  isDragging.value = false;
  const dropped = event.dataTransfer?.files?.[0] ?? null;

  if (dropped && !dropped.name.endsWith('.txt')) {
    toastStore.warning('Solo se permiten archivos .txt');
    return;
  }

  setFile(dropped);
}

function setFile(selected: File | null): void {
  file.value = selected;
  result.value = null; // Limpiamos resultado anterior al cambiar archivo
  showErrors.value = false;
}

function clearFile(): void {
  file.value = null;
  result.value = null;
  showErrors.value = false;
}

// ─── Importar ─────────────────────────────────────────────────────────────────

async function importMatricial(): Promise<void> {
  if (!file.value) return;

  isImporting.value = true;
  result.value = null;

  try {
    const response = await uploadMatricial(file.value);
    result.value = response as ImportingMatricialResult;

    emit('imported');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al importar el archivo';
    console.error(message);
  } finally {
    isImporting.value = false;
  }
}
</script>
