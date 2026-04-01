<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-x-4"
    enter-to-class="opacity-100 translate-x-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-x-0"
    leave-to-class="opacity-0 translate-x-4">
    <div
      v-if="visible"
      :class="[
        'flex items-start gap-3 w-80 rounded-lg px-4 py-3 shadow-lg border text-sm',
        styles[toast.type].container,
      ]">
      <component :is="icons[toast.type]" class="mt-0.5 shrink-0 size-4" />

      <p class="flex-1 leading-snug">{{ toast.message }}</p>

      <button
        @click="toastStore.remove(toast.id)"
        class="shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
        <X class="size-4" />
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-vue-next';
import { useToastStore, type Toast } from '@/stores/toast.store';

defineProps<{ toast: Toast }>();

const toastStore = useToastStore();
const visible = ref(false);

// Activamos visible en el siguiente tick para que Transition capture la animación
onMounted(() => {
  requestAnimationFrame(() => (visible.value = true));
});

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles = {
  success: { container: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  error: { container: 'bg-red-50 border-red-200 text-red-800' },
  info: { container: 'bg-blue-50 border-blue-200 text-blue-800' },
  warning: { container: 'bg-amber-50 border-amber-200 text-amber-800' },
};
</script>
