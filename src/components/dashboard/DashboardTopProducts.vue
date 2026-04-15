<template>
  <AppCard>
    <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-500">Esta semana</p>
        <p class="text-sm font-black text-blue-900">Productos Más Vendidos</p>
      </div>
      <button class="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
        Ver catálogo →
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-100 bg-slate-50/70">
            <th
              v-for="col in ['ID', 'Código', 'Producto', 'Cant. Vendida', 'Ingreso']"
              :key="col"
              class="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 first:px-5">
              {{ col }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr
            v-for="(p, i) in products"
            :key="i"
            class="group hover:bg-blue-50/40 transition-colors">
            <td class="px-5 py-3 font-black text-slate-300">
              {{ p.id }}
            </td>
            <td class="px-4 py-3 font-bold text-slate-800">
              <span class="font-mono text-sm text-slate-600">{{ p.code }}</span>
            </td>
            <td class="px-4 py-3 font-bold text-slate-800">{{ p.name }}</td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <div class="h-1.5 w-20 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    class="h-full rounded-full bg-linear-to-r from-blue-500 to-blue-400"
                    :style="`width:${Math.min(100, (p.sold / (maxSold ?? 210)) * 100)}%`" />
                </div>
                <span class="font-black text-blue-800">{{ p.sold }}</span>
              </div>
            </td>
            <td class="px-4 py-3 font-black text-slate-800">
              {{ formatMXN(p.revenue) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import AppCard from '@/components/ui/molecules/AppCard.vue';
import { formatMXN } from '@/helpers/currencyMxn';

export interface ProductMetric {
  id: number;
  code: string;
  name: string;
  sold: number;
  revenue: number;
}

defineProps<{
  products: ProductMetric[];
  maxSold?: number;
}>();
</script>
