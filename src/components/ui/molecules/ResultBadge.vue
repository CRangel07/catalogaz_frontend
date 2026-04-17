<template>
  <div class="flex flex-col items-center px-3 py-1.5 rounded-lg" :class="bgClass">
    <span class="text-lg font-bold leading-tight" :class="valueClass">{{ value }}</span>
    <span class="text-[11px] font-medium leading-tight" :class="labelClass">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type BadgeColor = 'slate' | 'emerald' | 'indigo' | 'amber';

// ─── Props ────────────────────────────────────────────────────────────────────

const props = defineProps<{
  label: string;
  value: number;
  color: BadgeColor;
}>();

// ─── Clases por color ─────────────────────────────────────────────────────────

const bgClass = computed(() => {
  const map: Record<BadgeColor, string> = {
    slate: 'bg-slate-100',
    emerald: 'bg-emerald-100',
    indigo: 'bg-indigo-100',
    amber: 'bg-amber-100',
  };
  return map[props.color];
});

const valueClass = computed(() => {
  const map: Record<BadgeColor, string> = {
    slate: 'text-slate-700',
    emerald: 'text-emerald-700',
    indigo: 'text-indigo-700',
    amber: 'text-amber-700',
  };
  return map[props.color];
});

const labelClass = computed(() => {
  const map: Record<BadgeColor, string> = {
    slate: 'text-slate-500',
    emerald: 'text-emerald-600',
    indigo: 'text-indigo-600',
    amber: 'text-amber-600',
  };
  return map[props.color];
});
</script>
