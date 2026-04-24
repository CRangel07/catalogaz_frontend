<template>
  <div class="relative px-6 py-5 overflow-hidden">
    <!-- Línea accent inferior con gradiente -->
    <div
      class="absolute bottom-0 left-0 right-0 h-1 rounded-full bg-linear-to-r from-azul via-sky-500 to-naranja" />

    <!-- Glow decorativo detrás del ícono -->
    <div
      v-if="icon"
      class="absolute -left-4 top-1/2 -translate-y-1/2 w-28 h-28 rounded-full pointer-events-none" />

    <div class="relative flex flex-wrap items-center justify-between gap-4">
      <!-- ── Lado izquierdo ─────────────────────────────────────────── -->
      <div class="flex items-center gap-4">
        <!-- Botón regreso -->
        <button
          v-if="showBack"
          @click="emit('back')"
          aria-label="Regresar"
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition-all duration-150 hover:border-slate-300 hover:text-slate-600 hover:shadow active:scale-95">
          <ChevronLeft :size="15" :stroke-width="2.5" />
        </button>

        <!-- Ícono + texto -->
        <div class="flex items-center gap-3.5">
          <!-- Ícono con gradiente y sombra de color -->
          <div
            v-if="icon"
            class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-md"
            :class="iconBgClass">
            <component
              :is="icon"
              :size="24"
              class="relative z-10"
              :class="iconColorClass"
              :stroke-width="2.3" />
          </div>

          <!-- Textos -->
          <div class="flex flex-col gap-0.5">
            <!-- Breadcrumb -->
            <nav v-if="breadcrumbs?.length" class="flex items-center gap-1">
              <template v-for="(crumb, i) in breadcrumbs" :key="i">
                <span
                  class="text-[11px] font-semibold uppercase tracking-widest transition-colors"
                  :class="
                    i === breadcrumbs.length - 1
                      ? 'text-slate-400'
                      : 'text-slate-300 hover:text-slate-400 cursor-pointer'
                  ">
                  {{ crumb }}
                </span>
                <ChevronRight v-if="i < breadcrumbs.length - 1" :size="9" class="text-slate-300" />
              </template>
            </nav>

            <!-- Título + badge -->
            <div class="flex items-center gap-2.5">
              <h1
                class="xl:text-3xl lg:text-2xl text-xl font-black tracking-wide leading-none font-bungee text-naranja">
                {{ title }}
              </h1>
              <span
                v-if="badge"
                class="inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border"
                :class="badgeClass">
                {{ badge }}
              </span>
            </div>

            <!-- Descripción -->
            <p v-if="description" class="text-xs text-slate-400 leading-relaxed mt-0.5">
              {{ description }}
            </p>
          </div>
        </div>
      </div>

      <!-- ── Slot acciones ──────────────────────────────────────────── -->
      <div v-if="$slots.actions" class="flex shrink-0 items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import type { Component } from 'vue';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
type IconVariant = 'purple' | 'teal' | 'blue' | 'amber' | 'red' | 'orange';

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
  iconVariant: 'amber',
  showBack: false,
});

const emit = defineEmits<{ back: [] }>();

// ─── Badge ────────────────────────────────────────────────────────────────────

const badgeClass = computed(() => {
  const map: Record<BadgeVariant, string> = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-600 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-slate-100 text-slate-500 border-slate-200',
  };
  return map[props.badgeVariant];
});

// ─── Ícono ────────────────────────────────────────────────────────────────────

const iconBgClass = computed(() => {
  const map: Record<IconVariant, string> = {
    purple: 'bg-gradient-to-br from-purple-400 to-purple-600 shadow-purple-200',
    teal: 'bg-gradient-to-br from-teal-400 to-teal-600 shadow-teal-200',
    blue: 'bg-gradient-to-br from-blue-400 to-blue-700 shadow-blue-200',
    amber: 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-200',
    red: 'bg-gradient-to-br from-red-400 to-red-600 shadow-red-200',
    orange: 'bg-gradient-to-br from-orange-400 to-naranja shadow-orange-200',
  };
  return map[props.iconVariant];
});

const iconColorClass = computed(() => 'text-white');
</script>
