<template>
  <!-- Mobile overlay -->
  <Transition name="fade">
    <div
      v-if="mobileOpen"
      @click="emit('update:mobileOpen', false)"
      class="fixed inset-0 z-30 bg-blue-950/50 backdrop-blur-sm lg:hidden" />
  </Transition>

  <aside
    class="fixed lg:relative z-40 flex h-full flex-col bg-azul transition-all duration-300 shadow-[4px_0_24px_rgba(30,58,138,0.25)]"
    :class="[
      open ? 'w-60' : 'w-17',
      mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]">
    <!-- Top accent -->
    <div class="h-1 w-full shrink-0 bg-linear-to-r from-orange-400 via-orange-300 to-blue-400" />

    <!-- Logo -->
    <div class="flex h-16 shrink-0 items-center gap-3 px-4 border-b border-white/10">
      <div
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 shadow-[0_2px_12px_rgba(249,115,22,0.5)]">
        <img :src="Logo" alt="logo" />
      </div>
      <Transition name="label">
        <div v-if="open" class="overflow-hidden">
          <p class="text-sm font-semibold tracking-tight text-white leading-none">Mi Pedido</p>
          <p class="text-[10px] font-medium text-blue-300 tracking-widest uppercase">
            Azteca Abarrotes
          </p>
        </div>
      </Transition>
    </div>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-5">
      <div v-for="(items, section) in navSections" :key="section">
        <Transition v-if="open" name="label">
          <p
            v-if="open"
            class="mb-1.5 px-2 text-[10px] font-medium uppercase tracking-[0.2em] text-blue-300">
            {{ section }}
          </p>
        </Transition>
        <div v-else class="mb-1.5 h-px bg-white/10 mx-2" />

        <ul class="space-y-0.5 list-none m-0 p-0">
          <li v-for="item in items" :key="item.id">
            <RouterLink
              :to="{ name: item.routeName }"
              @click="emit('update:activeNav', item.id)"
              class="group relative cursor-pointer w-full flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-xs font-semibold transition-all duration-150 text-left"
              :class="
                activeNav === item.id
                  ? 'bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                  : 'text-blue-200 hover:bg-white/8 hover:text-white'
              "
              :title="!open ? item.label : ''">
              <span
                v-if="activeNav === item.id"
                class="absolute left-0 h-6 w-1 rounded-r-full bg-orange-400" />
              <component :is="item.icon" />
              <Transition name="label">
                <span v-if="open" class="flex-1 truncate">{{ item.label }}</span>
              </Transition>
            </RouterLink>
          </li>
        </ul>
      </div>
    </nav>

    <!-- User footer -->
    <div class="shrink-0 border-t border-white/10 p-3">
      <div
        class="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-white/10 transition-colors cursor-pointer">
        <div
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-orange-400 to-blue-500 text-xs font-black text-white shadow">
          AD
        </div>
        <Transition name="label">
          <div v-if="open" class="min-w-0">
            <p class="truncate text-xs font-bold text-white leading-none">Admin</p>
            <p class="truncate text-[10px] text-blue-300">admin@azteca.com</p>
          </div>
        </Transition>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { NavItem } from '@/types/components';

import Logo from '@/assets/logo.png';

const props = defineProps<{
  open: boolean;
  mobileOpen: boolean;
  activeNav: string;
  navItems: NavItem[];
}>();

const emit = defineEmits<{
  'update:activeNav': [id: string];
  'update:mobileOpen': [val: boolean];
}>();

const navSections = computed(() => {
  const sections: Record<string, NavItem[]> = {};
  props.navItems.forEach((item) => {
    const s = item.section || 'General';
    if (!sections[s]) sections[s] = [];
    sections[s].push(item);
  });
  return sections;
});
</script>
