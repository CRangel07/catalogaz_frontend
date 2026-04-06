<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'flex flex-row-reverse cursor-pointer items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
      sizeClasses,
      themeClasses,
    ]"
    @click="handleClick">
    <component v-if="loading" :is="Loader2" :size="iconSize" class="animate-spin" />
    <component v-else-if="icon && iconPosition === 'left'" :is="icon" :size="iconSize" />

    <slot />

    <component v-if="!loading && icon && iconPosition === 'right'" :is="icon" :size="iconSize" />
  </button>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue';
import { Loader2 } from 'lucide-vue-next';

// ─── Tipos ───────────────────────────────────────────────────────────────────

type ButtonType = 'button' | 'submit' | 'reset';
type ButtonTheme =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'ghost'
  | 'outline'
  | 'success'
  | 'cyan'
  | 'info'
  | 'warning'
  | 'neutral';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type IconPosition = 'left' | 'right';

// ─── Props ───────────────────────────────────────────────────────────────────

const props = withDefaults(
  defineProps<{
    type?: ButtonType;
    theme?: ButtonTheme;
    size?: ButtonSize;
    icon?: Component | null;
    iconPosition?: IconPosition;
    disabled?: boolean;
    loading?: boolean;
    block?: boolean;
  }>(),
  {
    type: 'button',
    theme: 'primary',
    size: 'md',
    icon: null,
    iconPosition: 'left',
    disabled: false,
    loading: false,
    block: false,
  }
);

// ─── Emits ───────────────────────────────────────────────────────────────────

// defineEmits declara los eventos que este componente puede emitir hacia el padre.
// Usamos la sintaxis de objeto para tipar el payload de cada evento.
const emit = defineEmits<{
  // El evento 'click' recibe el MouseEvent nativo del navegador
  (e: 'click', event: MouseEvent): void;
}>();

// ─── Handlers ────────────────────────────────────────────────────────────────

function handleClick(event: MouseEvent): void {
  // Si el botón está deshabilitado o cargando, cortamos aquí.
  // Aunque el atributo :disabled ya bloquea el click en el DOM,
  // esta guardia es una segunda línea de defensa por si se llama
  // el método programáticamente.
  if (props.disabled || props.loading) return;

  emit('click', event);
}

// ─── Clases de tamaño ────────────────────────────────────────────────────────

const sizeClasses = computed(() => {
  const map: Record<ButtonSize, string> = {
    xs: 'px-2.5 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
    xl: 'px-6 py-3 text-lg',
  };
  return [map[props.size], props.block ? 'w-full' : ''];
});

const iconSize = computed<number>(() => {
  const map: Record<ButtonSize, number> = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  };
  return map[props.size];
});

// ─── Clases de tema ──────────────────────────────────────────────────────────

const themeClasses = computed(() => {
  const map: Record<ButtonTheme, string> = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus:ring-indigo-500',

    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 focus:ring-gray-400',

    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500',

    success:
      'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 focus:ring-emerald-500',

    cyan: 'bg-cyan-600 text-white hover:bg-cyan-700 active:bg-cyan-800 focus:ring-cyan-500',

    info: 'bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800 focus:ring-sky-500',

    warning: 'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 focus:ring-amber-400',

    neutral: 'bg-gray-800 text-white hover:bg-gray-900 active:bg-black focus:ring-gray-700',

    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-400',

    outline:
      'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-400',
  };

  return map[props.theme];
});
</script>
