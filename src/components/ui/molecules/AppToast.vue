<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-2 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-2 scale-95">
    <div
      v-if="visible"
      :class="[
        'relative flex items-start gap-3 w-88 rounded-xl px-4 py-3 shadow-2xl border backdrop-blur-sm',
        styles[toast.type].container,
      ]">
      <!-- Barra lateral -->
      <div
        class="absolute left-0 top-0 h-full w-1.5 rounded-l-xl"
        :class="styles[toast.type].accent" />

      <!-- Icono -->
      <div
        class="flex items-center justify-center size-8 rounded-full shrink-0"
        :class="styles[toast.type].iconBg">
        <component :is="icons[toast.type]" class="size-5" :class="styles[toast.type].icon" />
      </div>

      <!-- Texto -->
      <div class="flex-1">
        <p class="text-sm font-semibold leading-snug">
          {{ toast.message }}
        </p>
      </div>

      <!-- Close -->
      <button
        @click="toastStore.remove(toast.id)"
        class="shrink-0 opacity-60 hover:opacity-100 transition-all duration-200 hover:scale-110 cursor-pointer">
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
  success: {
    container: 'bg-emerald-500/10 border-emerald-400/30 text-emerald-900',
    accent: 'bg-emerald-500',
    iconBg: 'bg-emerald-500/20',
    icon: 'text-emerald-600',
  },
  error: {
    container: 'bg-red-500/50 border-red-400/30 text-red-100',
    accent: 'bg-red-500',
    iconBg: 'bg-red-500/20',
    icon: 'text-red-600',
  },
  info: {
    container: 'bg-blue-500/10 border-blue-400/30 text-blue-900',
    accent: 'bg-blue-500',
    iconBg: 'bg-blue-500/20',
    icon: 'text-blue-600',
  },
  warning: {
    container: 'bg-amber-500/10 border-amber-400/30 text-amber-900',
    accent: 'bg-amber-500',
    iconBg: 'bg-amber-500/20',
    icon: 'text-amber-600',
  },
};
</script>
