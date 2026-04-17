<template>
  <div class="flex flex-col gap-4">
    <!-- Zona de drop / selección -->
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
              Arrastra tu Excel aquí o
              <span class="text-indigo-600 font-medium">haz clic para seleccionar</span>
            </p>
            <p class="text-xs text-slate-400 mt-0.5">Solo archivos .xlsx — máx. 10 MB</p>
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
        accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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
          <div class="flex flex-wrap gap-3">
            <ResultBadge label="Total" :value="result.summary.total" color="slate" />
            <ResultBadge label="Nuevos" :value="result.summary.imported" color="emerald" />
            <ResultBadge label="Actualizados" :value="result.summary.updated" color="indigo" />
            <ResultBadge
              v-if="result.summary.skipped > 0"
              label="Saltados"
              :value="result.summary.skipped"
              color="amber" />
          </div>
        </div>

        <!-- Errores de filas saltadas (si hay) -->
        <div
          v-if="result.errors && result.errors.length"
          class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <button
            type="button"
            class="flex items-center justify-between w-full text-left"
            @click="showErrors = !showErrors">
            <span class="text-sm font-semibold text-amber-800 flex items-center gap-2">
              <AlertTriangle :size="15" />
              {{ result.errors.length }} fila(s) con errores
            </span>
            <ChevronDown
              :size="16"
              class="text-amber-600 transition-transform duration-200"
              :class="showErrors ? 'rotate-180' : ''" />
          </button>

          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100">
            <ul v-if="showErrors" class="mt-2 flex flex-col gap-1">
              <li
                v-for="err in result.errors"
                :key="err.rowNumber"
                class="text-xs text-amber-700 flex items-start gap-1.5">
                <span class="font-medium shrink-0">Fila {{ err.rowNumber }}:</span>
                <span>{{ err.reason }}</span>
              </li>
            </ul>
          </Transition>
        </div>
      </div>
    </Transition>

    <!-- Acciones -->
    <div class="flex items-center justify-between gap-3">
      <!-- Descargar plantilla -->
      <ButtonUI
        theme="ghost"
        size="sm"
        :icon="Download"
        :loading="isDownloading"
        @click="downloadTemplate">
        Descargar plantilla
      </ButtonUI>

      <!-- Importar -->
      <ButtonUI
        theme="success"
        size="sm"
        :icon="FileUp"
        :loading="isImporting"
        :disabled="!file"
        @click="importExcel">
        Importar productos
      </ButtonUI>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  FileUp,
  Sheet,
  X,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  Download,
} from 'lucide-vue-next';
import { useToastStore } from '@/stores/toast.store';
// import {
//   importProductsExcel,
//   downloadProductsTemplate,
// } from '@/modules/products/services/products.service';
import ButtonUI from '../ui/atoms/ButtonUI.vue';
import ResultBadge from '../ui/molecules/ResultBadge.vue';
import { useProducts } from '@/composables/useProducts';

// ─── Stores ───────────────────────────────────────────────────────────────────

const toastStore = useToastStore();

const { uploadExcel } = useProducts();

// ─────────────────────────────────────────────────────────────────────────────
// Agrega estas dos funciones a tu archivo products.service.ts del frontend
// (donde ya tienes las demás llamadas a la API de productos)
// ─────────────────────────────────────────────────────────────────────────────

// ─── Estado ───────────────────────────────────────────────────────────────────

const inputId = 'excel-import-input';

const file = ref<File | null>(null);
const isDragging = ref(false);
const isImporting = ref(false);
const isDownloading = ref(false);
const showErrors = ref(false);

interface ImportResult {
  message: string;
  summary: {
    total: number;
    imported: number;
    updated: number;
    skipped: number;
  };
  errors?: { rowNumber: number; reason: string }[];
}

const result = ref<ImportResult | null>(null);

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

  if (dropped && !dropped.name.endsWith('.xlsx')) {
    toastStore.warning('Solo se permiten archivos .xlsx');
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

async function importExcel(): Promise<void> {
  if (!file.value) return;

  isImporting.value = true;
  result.value = null;

  try {
    await uploadExcel(file.value);
    // result.value = data;
    // toastStore.success(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al importar el archivo';
    toastStore.error(message);
  } finally {
    isImporting.value = false;
  }
}

// ─── Descargar plantilla ──────────────────────────────────────────────────────

async function downloadTemplate(): Promise<void> {
  isDownloading.value = true;

  //   try {
  //     // El servicio devuelve un Blob con el archivo Excel.
  //     // Creamos un enlace temporal en el DOM, lo "clickeamos" programáticamente
  //     // y lo destruimos. Es la forma estándar de descargar Blobs en el browser.
  //     const blob = await downloadProductsTemplate();
  //     const url = URL.createObjectURL(blob);
  //     const anchor = document.createElement('a');
  //     anchor.href = url;
  //     anchor.download = 'plantilla-productos.xlsx';
  //     anchor.click();
  //     URL.revokeObjectURL(url);
  //   } catch {
  //     toastStore.error('No se pudo descargar la plantilla');
  //   } finally {
  //     isDownloading.value = false;
  //   }
}
</script>
