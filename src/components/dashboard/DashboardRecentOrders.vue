<template>
  <AppCard class="lg:col-span-2">
    <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
      <p class="text-sm font-black text-blue-900">Pedidos Recientes</p>
      <button class="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
        Ver todos →
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-xs">
        <thead>
          <tr class="border-b border-slate-100 bg-slate-50/70">
            <th
              v-for="col in ['ID', 'Cliente', 'Total', 'Estado', 'Hora']"
              :key="col"
              class="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 first:px-5">
              {{ col }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="(o, i) in orders" :key="i" class="hover:bg-blue-50/40 transition-colors">
            <td class="px-5 py-3 font-black text-blue-700">{{ o.id }}</td>
            <td class="px-4 py-3 font-semibold text-slate-700">{{ o.client }}</td>
            <td class="px-4 py-3 font-black text-slate-800">{{ o.total }}</td>
            <td class="px-4 py-3">
              <AppBadge :variant="statusVariant[o.status]">{{ o.status }}</AppBadge>
            </td>
            <td class="px-4 py-3 text-slate-400">{{ o.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import AppCard from '@/components/ui/molecules/AppCard.vue';
import AppBadge from '../ui/molecules/AppBadge.vue';

interface Order {
  id: string;
  client: string;
  total: string;
  status: 'entregado' | 'pendiente' | 'proceso';
  time: string;
}

defineProps<{
  orders: Order[];
}>();

const statusVariant: Record<string, 'green' | 'orange' | 'blue'> = {
  entregado: 'green',
  pendiente: 'orange',
  proceso: 'blue',
};
</script>
