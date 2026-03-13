<template>
  <header
    class="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 shadow-[0_1px_8px_rgba(30,58,138,0.07)]">
    <!-- Toggle sidebar -->
    <button
      @click="emit('toggle-sidebar')"
      class="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-blue-700 active:scale-90">
      <AppIcon path="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" :stroke-width="2" />
    </button>

    <!-- Breadcrumb -->
    <div class="hidden sm:flex items-center gap-1.5 text-sm">
      <span class="text-slate-400">Admin</span>
      <ChevronRight class="text-slate-500" :size="19" />
      <span class="font-semibold text-blue-800 capitalize">{{ activeNav }}</span>
    </div>

    <div class="flex-1" />

    <!-- Notifications -->
    <div class="relative">
      <button
        @click="notifOpen = !notifOpen"
        class="relative flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-blue-700 active:scale-90">
        <Bell />
        <span
          class="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-black text-white">
          {{ notifications.length }}
        </span>
      </button>

      <!-- Dropdown -->
      <Transition name="fade">
        <div
          v-if="notifOpen"
          class="absolute right-0 top-10 z-50 w-72 rounded-2xl border border-slate-100 bg-white shadow-[0_8px_32px_rgba(30,58,138,0.15)] overflow-hidden">
          <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <p class="text-xs font-black text-blue-900 uppercase tracking-wide">Notificaciones</p>
            <button @click="notifOpen = false" class="text-slate-300 hover:text-slate-500">
              <X />
            </button>
          </div>
          <ul class="divide-y divide-slate-50">
            <li
              v-for="(n, i) in notifications"
              :key="i"
              class="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
              <span
                class="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                :class="{
                  'bg-orange-500': n.dot === 'orange',
                  'bg-red-500': n.dot === 'red',
                  'bg-blue-500': n.dot === 'blue',
                }" />
              <div>
                <p class="text-xs text-slate-700 font-medium leading-snug">{{ n.text }}</p>
                <p class="text-[10px] text-slate-400 mt-0.5">{{ n.time }}</p>
              </div>
            </li>
          </ul>
          <div class="px-4 py-2.5 border-t border-slate-100">
            <button
              class="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
              Ver todas →
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Bell, ChevronRight, X } from 'lucide-vue-next';
import { ref } from 'vue';

interface Notification {
  text: string;
  time: string;
  dot: 'orange' | 'red' | 'blue';
}

defineProps<{
  activeNav: string;
  notifications: Notification[];
}>();

const emit = defineEmits<{
  'toggle-sidebar': [];
}>();

const notifOpen = ref(false);
</script>
