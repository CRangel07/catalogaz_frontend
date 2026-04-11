<template>
  <div class="border-b border-b-slate-400 px-6 py-5">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <!-- Lado izquierdo -->
      <div class="flex items-start gap-3">
        <!-- Botón de regreso (opcional) -->
        <button
          v-if="showBack"
          @click="emit('back')"
          class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-transparent text-gray-500 transition hover:bg-gray-50"
          aria-label="Regresar">
          <ChevronLeft :size="16" />
        </button>

        <div class="flex flex-col gap-1.5">
          <!-- Ícono + título + badge -->
          <div class="flex flex-wrap items-center gap-3">
            <!-- Ícono decorativo (opcional) -->
            <div
              v-if="icon"
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              :class="iconBgClass">
              <component :is="icon" :size="18" :class="iconColorClass" />
            </div>

            <h1 class="text-[22px] font-medium leading-tight text-gray-900">
              {{ title }}
            </h1>

            <!-- Badge de estado (opcional) -->
            <span
              v-if="badge"
              class="rounded-full px-2.5 py-0.5 text-xs font-medium"
              :class="badgeClass">
              {{ badge }}
            </span>
          </div>

          <!-- Breadcrumb (opcional) -->
          <nav
            v-if="breadcrumbs && breadcrumbs.length"
            class="flex items-center gap-1.5 order-first">
            <template v-for="(crumb, index) in breadcrumbs" :key="index">
              <span
                class="text-[13px]"
                :class="index === breadcrumbs.length - 1 ? 'text-gray-500' : 'text-gray-400'">
                {{ crumb }}
              </span>
              <span v-if="index < breadcrumbs.length - 1" class="text-[13px] text-gray-300">/</span>
            </template>
          </nav>

          <!-- Descripción (opcional) -->
          <p v-if="description" class="text-sm leading-relaxed text-gray-500">
            {{ description }}
          </p>
        </div>
      </div>

      <!-- Lado derecho: slot para acciones -->
      <div v-if="$slots.actions" class="flex shrink-0 items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChevronLeft } from 'lucide-vue-next';
import type { Component } from 'vue';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
type IconVariant = 'purple' | 'teal' | 'blue' | 'amber' | 'red';

export interface TitleProps {
  title: string;
  description?: string;
  badge?: string;
  badgeVariant?: BadgeVariant;
  breadcrumbs?: string[];
  showBack?: boolean;
  icon?: Component;
  iconVariant?: IconVariant;
}

const props = withDefaults(defineProps<TitleProps>(), {
  badgeVariant: 'success',
  iconVariant: 'purple',
  showBack: false,
});

const emit = defineEmits<{
  back: [];
}>();

const badgeClass = computed(() => {
  const map: Record<BadgeVariant, string> = {
    success: 'bg-green-50 text-green-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-700',
    info: 'bg-blue-50 text-blue-700',
    neutral: 'bg-gray-100 text-gray-600',
  };
  return map[props.badgeVariant];
});

const iconBgClass = computed(() => {
  const map: Record<IconVariant, string> = {
    purple: 'bg-purple-100',
    teal: 'bg-teal-100',
    blue: 'bg-blue-100',
    amber: 'bg-amber-100',
    red: 'bg-red-100',
  };
  return map[props.iconVariant];
});

const iconColorClass = computed(() => {
  const map: Record<IconVariant, string> = {
    purple: 'text-purple-700',
    teal: 'text-teal-700',
    blue: 'text-blue-700',
    amber: 'text-amber-700',
    red: 'text-red-700',
  };
  return map[props.iconVariant];
});
</script>
