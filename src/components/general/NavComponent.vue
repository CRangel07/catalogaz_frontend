<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface NavLink {
  label: string;
  href: string;
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
    logo: () => ({ text: 'MiTienda', icon: null }),
    links: () => [
      { label: 'Inicio', href: '#' },
      { label: 'Catálogo', href: '#' },
      { label: 'Ofertas', href: '#' },
      { label: 'Nosotros', href: '#' },
      { label: 'Hacer Pedido', href: '#', cta: true },
    ],
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

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300"
    :class="
      scrolled
        ? 'bg-blue-800/95 backdrop-blur-md shadow-[0_4px_24px_rgba(30,58,138,0.35)]'
        : 'bg-blue-700'
    ">
    <!-- Accent line top -->
    <div class="h-1 w-full bg-gradient-to-r from-orange-400 via-orange-300 to-blue-400" />

    <nav
      class="mx-auto flex h-16 max-w-screen-xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <!-- ── Logo ── -->
      <a href="#" @click="closeMenu" class="group flex items-center gap-2.5 shrink-0 no-underline">
        <!-- Icono naranja -->
        <span
          class="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 shadow-[0_2px_12px_rgba(249,115,22,0.5)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_4px_18px_rgba(249,115,22,0.65)]">
          <svg
            class="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.2">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016 2.993 2.993 0 0 0 2.25-1.016 3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
          </svg>
        </span>
        <div class="flex flex-col leading-none">
          <span
            class="text-base font-black tracking-tight text-white transition-colors duration-200 group-hover:text-orange-300">
            {{ logo.text }}
          </span>
          <span class="text-[10px] font-medium tracking-widest text-blue-300 uppercase"
            >Abarrotes & Verduras</span
          >
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
            :href="link.href"
            class="ml-2 flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-[0.8rem] font-bold tracking-wide text-white no-underline shadow-[0_2px_12px_rgba(249,115,22,0.4)] transition-all duration-200 hover:bg-orange-400 hover:shadow-[0_4px_18px_rgba(249,115,22,0.55)] active:scale-95">
            {{ link.label }}
            <svg class="h-3.5 w-3.5" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6h8M6.5 2.5L10 6l-3.5 3.5"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </a>

          <!-- Regular -->
          <a
            v-else
            :href="link.href"
            class="relative flex items-center px-3.5 py-2 rounded-xl text-[0.82rem] font-semibold no-underline transition-all duration-200"
            :class="[
              activeIdx === i ? 'text-orange-300' : 'text-blue-100',
              hoveredIdx === i ? 'bg-white/10 text-white' : '',
            ]">
            {{ link.label }}
            <!-- underline activo -->
            <span
              v-if="activeIdx === i"
              class="absolute bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-orange-400" />
          </a>
        </li>
      </ul>

      <!-- ── Right side ── -->
      <div class="flex items-center gap-3 shrink-0">
        <!-- Search (desktop) -->
        <button
          class="hidden md:flex items-center justify-center h-8 w-8 rounded-xl text-blue-200 transition-all duration-150 hover:bg-white/10 hover:text-white active:scale-90">
          <svg
            class="h-4.5 w-4.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.2">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </button>

        <!-- Cart icon (desktop) -->
        <button
          class="hidden md:flex relative items-center justify-center h-8 w-8 rounded-xl text-blue-200 transition-all duration-150 hover:bg-white/10 hover:text-white active:scale-90">
          <svg
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.2">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          <span
            class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-black text-white"
            >3</span
          >
        </button>

        <!-- Hamburger (mobile) -->
        <button
          class="flex md:hidden flex-col justify-center items-center gap-[5px] w-9 h-9 rounded-xl bg-white/10 transition-all duration-200 hover:bg-white/20 active:scale-90"
          :aria-label="menuOpen ? 'Cerrar menú' : 'Abrir menú'"
          @click="toggleMenu">
          <span
            class="block w-4 h-[2px] bg-white rounded-full transition-all duration-300 origin-center"
            :class="menuOpen ? 'translate-y-[7px] rotate-45' : ''" />
          <span
            class="block h-[2px] bg-white rounded-full transition-all duration-300"
            :class="menuOpen ? 'w-0 opacity-0' : 'w-4 opacity-100'" />
          <span
            class="block w-4 h-[2px] bg-white rounded-full transition-all duration-300 origin-center"
            :class="menuOpen ? '-translate-y-[7px] -rotate-45' : ''" />
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
            <a
              :href="link.href"
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
            </a>
          </li>
        </ul>

        <!-- Bottom mobile row -->
        <div class="flex items-center justify-between px-6 py-3 border-t border-white/10">
          <span class="text-xs text-blue-300">Abarrotes & Verduras</span>
          <div class="flex items-center gap-3">
            <button class="text-blue-300 hover:text-white transition-colors">
              <svg
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
            <button class="relative text-blue-300 hover:text-white transition-colors">
              <svg
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              <span
                class="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-orange-500 text-[8px] font-black text-white"
                >3</span
              >
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </header>

  <!-- Spacer para que el contenido no quede bajo el nav -->
  <div class="h-[65px]" />
</template>

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
