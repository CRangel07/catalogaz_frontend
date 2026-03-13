<template>
  <AppCard>
    <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
      <div class="flex items-center gap-2">
        <span class="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-100">
          <AppIcon
            class="text-orange-600"
            path="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            size="sm"
            :stroke-width="2.5" />
        </span>
        <p class="text-sm font-black text-blue-900">Alertas de Stock</p>
      </div>
      <span class="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-black text-orange-600">
        {{ alerts.length }}
      </span>
    </div>

    <ul class="divide-y divide-slate-50">
      <li
        v-for="(a, i) in alerts"
        :key="i"
        class="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
        <span
          class="h-2 w-2 shrink-0 rounded-full"
          :class="a.severity === 'high' ? 'bg-red-500' : 'bg-orange-400'" />
        <p class="text-xs text-slate-600 font-medium">{{ a.text }}</p>
      </li>
    </ul>

    <div class="px-5 py-3 border-t border-slate-100">
      <button class="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
        Ver inventario completo →
      </button>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import AppCard from '@/components/ui/AppCard.vue';

interface Alert {
  text: string;
  severity: 'high' | 'med';
}

defineProps<{
  alerts: Alert[];
}>();
</script>
