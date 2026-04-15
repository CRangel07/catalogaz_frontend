<template>
  <!-- Backdrop -->
  <Transition name="modal-backdrop">
    <div
      v-if="true"
      class="fixed inset-0 flex items-center justify-center p-4"
      :style="{
        zIndex: 1000 + stackIndex * 10,
        backgroundColor: `rgba(0, 0, 0, ${0.4 + stackIndex * 0.1})`,
      }"
      @click.self="onBackdropClick">
      <!-- Panel del modal -->
      <Transition name="modal-panel">
        <div
          v-if="true"
          :class="[
            'relative w-full rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 max-h-[85dvh] overflow-auto',
            sizeClass,
          ]"
          role="dialog"
          aria-modal="true"
          @click.stop>
          <!-- Header: título (opcional) + botón cerrar -->
          <div class="flex items-center justify-between px-6 pt-5 pb-0">
            <div v-if="options?.title" class="flex items-center justify-between px-6 pt-5 pb-0">
              <span class="text-base font-semibold text-zinc-800 dark:text-zinc-100">
                {{ options?.title }}
              </span>
            </div>
            <!-- Botón X siempre visible -->
            <button
              type="button"
              class="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              aria-label="Cerrar modal"
              @click="emit('close')">
              <!-- X dibujada con SVG inline para no depender del import de Lucide aquí -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Contenido del modal con padding consistente -->
          <div class="px-6 py-5">
            <slot />
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import type { ModalOptions } from '@/stores/modal';

const props = withDefaults(
  defineProps<{
    id: string;
    options?: ModalOptions;
    /** Índice en el stack (para z-index y opacidad del backdrop) */
    stackIndex?: number;
  }>(),
  {
    stackIndex: 0,
  }
);

const emit = defineEmits<{
  close: [];
}>();

// ─── Tamaños disponibles ────────────────────────────────────────────────────
const sizeClasses: Record<NonNullable<ModalOptions['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
};

const sizeClass = sizeClasses[props.options?.size ?? 'md'];

// ─── Cerrar con Escape ──────────────────────────────────────────────────────
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.options?.closeOnEsc !== false) {
    emit('close');
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown));
onUnmounted(() => window.removeEventListener('keydown', onKeydown));

// ─── Cerrar al click en backdrop ────────────────────────────────────────────
function onBackdropClick() {
  if (props.options?.closeOnBackdrop !== false) {
    emit('close');
  }
}
</script>

<style scoped>
/* ── Backdrop ── */
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.25s ease;
}
.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

/* ── Panel ── */
.modal-panel-enter-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-panel-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.modal-panel-enter-from,
.modal-panel-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}
</style>
