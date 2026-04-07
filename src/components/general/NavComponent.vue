<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300"
    :class="
      scrolled ? 'bg-azul/95 backdrop-blur-md shadow-[0_4px_24px_rgba(30,58,138,0.35)]' : 'bg-azul'
    ">
    <!-- Accent line top -->
    <div class="h-1 w-full bg-linear-to-r from-naranja via-orange-300 to-azul" />

    <nav
      class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <!-- ── Logo ── -->
      <a href="#" @click="closeMenu" class="group flex items-center gap-2.5 shrink-0 no-underline">
        <!-- Icono naranja -->
        <span
          class="flex h-9 w-9 items-center justify-center rounded-xl bg-naranja shadow-[0_2px_12px_rgba(249,115,22,0.5)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_4px_18px_rgba(249,115,22,0.65)]">
          <img :src="Logo" alt="Logo" />
        </span>
        <div class="flex flex-col leading-none">
          <span
            class="text-base font-semibold tracking-tight text-white transition-colors duration-200 group-hover:text-naranja">
            {{ logo.text }}
          </span>
          <span class="text-[10px] font-medium tracking-widest text-blue-300 uppercase">
            Cuidando tu economía
          </span>
        </div>
      </a>

      <!-- ── Desktop links ── -->
      <ul class="hidden md:flex items-center gap-1 list-none m-0 p-0">
        <li
          v-for="(link, i) in links"
          :key="i"
          @mouseenter="hoveredIdx = i"
          @mouseleave="hoveredIdx = null"
          @click="setActive(i)">
          <!-- CTA -->
          <a
            v-if="link.cta"
            :href="link.to"
            class="ml-2 flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-[0.8rem] font-bold tracking-wide text-white no-underline shadow-[0_2px_12px_rgba(249,115,22,0.4)] transition-all duration-200 hover:bg-orange-400 hover:shadow-[0_4px_18px_rgba(249,115,22,0.55)] active:scale-95">
            {{ link.label }}
            <CircleArrowRight class="text-orange-50" :stroke-width="2.5" :size="18" />
          </a>

          <!-- Regular -->
          <RouterLink
            v-else
            :to="{ name: link.to }"
            class="relative flex items-center px-3.5 py-2 rounded-xl text-[0.82rem] font-semibold no-underline transition-all duration-200"
            :class="[
              activeIdx === i ? 'text-orange-200' : 'text-blue-100',
              hoveredIdx === i ? 'bg-white/10 text-white' : '',
            ]">
            {{ link.label }}
            <!-- underline activo -->
            <span
              v-if="activeIdx === i"
              class="absolute bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-naranja" />
          </RouterLink>
        </li>
      </ul>

      <!-- ── Right side ── -->
      <div class="flex items-center gap-3 shrink-0">
        <!-- Cart icon (desktop) -->
        <button
          class="hidden md:flex relative items-center justify-center h-8 w-8 rounded-xl text-blue-200 transition-all duration-150 hover:bg-white/10 hover:text-white active:scale-90 cursor-pointer">
          <ShoppingCart />
          <span
            class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[11px] text-white">
            9
          </span>
        </button>

        <!-- Hamburger (mobile) -->
        <button
          class="flex md:hidden flex-col justify-center items-center gap-1.25 w-9 h-9 rounded-xl bg-white/10 transition-all duration-200 hover:bg-white/20 active:scale-90 cursor-pointer"
          :aria-label="menuOpen ? 'Cerrar menú' : 'Abrir menú'"
          @click="toggleMenu">
          <Menu v-if="!menuOpen" class="text-white" />
          <X v-else class="text-white" />
        </button>
      </div>
    </nav>

    <!-- ── Mobile menu ── -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="max-h-0 opacity-0"
      enter-to-class="max-h-[500px] opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="max-h-[500px] opacity-100"
      leave-to-class="max-h-0 opacity-0">
      <div
        v-if="menuOpen"
        class="overflow-hidden md:hidden border-t border-white/10 bg-blue-800/98 backdrop-blur-md">
        <ul class="list-none m-0 px-4 py-3 flex flex-col gap-1">
          <li
            v-for="(link, i) in links"
            :key="i"
            class="animate-[fadeUp_0.25s_both_ease-out]"
            :style="{ animationDelay: `${i * 40}ms` }">
            <RouterLink
              :to="{ name: link.to }"
              class="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold no-underline transition-all duration-150"
              :class="
                link.cta
                  ? 'bg-orange-500 text-white justify-center shadow-[0_2px_12px_rgba(249,115,22,0.4)] hover:bg-orange-400'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              "
              @click="setActive(i)">
              {{ link.label }}
              <svg v-if="!link.cta" class="h-4 w-4 text-blue-400" viewBox="0 0 14 14" fill="none">
                <path
                  d="M5 10.5l4-3.5-4-3.5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </RouterLink>
          </li>
        </ul>

        <!-- Bottom mobile row -->
        <div class="flex items-center justify-between px-6 py-3 border-t border-white/10">
          <span class="text-xs text-blue-300">Realiza tu pedido</span>
          <div class="flex items-center gap-3">
            <button
              class="relative text-blue-300 cursor-pointer hover:text-white transition-colors">
              <ShoppingCart class="text-blue-100" />
              <span
                class="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-medium text-white">
                3
              </span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </header>

  <!-- Spacer para que el contenido no quede bajo el nav -->
  <div class="h-16.25" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { CircleArrowRight, Menu, ShoppingCart, X } from 'lucide-vue-next';

import Logo from '@/assets/logo.png';

export interface NavLink {
  label: string;
  to: string;
  cta?: boolean;
}

interface NavLogo {
  text: string;
  icon?: string | null;
}

withDefaults(
  defineProps<{
    logo?: NavLogo;
    links?: NavLink[];
  }>(),
  {
    logo: () => ({ text: 'Azteca Abarrotes', icon: null }),
    links: () => [],
  }
);

const menuOpen = ref<boolean>(false);
const scrolled = ref<boolean>(false);
const hoveredIdx = ref<number | null>(null);
const activeIdx = ref<number | null>(null);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
const closeMenu = () => {
  menuOpen.value = false;
};
const setActive = (i: number) => {
  activeIdx.value = i;
  closeMenu();
};

const handleScroll = () => {
  scrolled.value = window.scrollY > 8;
};
onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<style>
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
