<template>
  <img
    :src="`${BASE_ASSETS}${url}`"
    :alt="alt"
    class="relative z-10 h-52 w-auto object-contain drop-shadow-[0_8px_16px_rgba(30,64,175,0.2)]"
    @error="handleImageError" />
</template>

<script setup lang="ts">
import ImageNotFound from '@/assets/noImage400x400.svg';

defineProps<{ url: string | null; alt: string }>();

const handleImageError = (e: Event) => {
  if (!e.target) return null;
  const img = e.target as HTMLImageElement;
  img.onerror = null;
  img.src = ImageNotFound;
};

const BASE_ASSETS = import.meta.env.VITE_ASSETS_URL;
</script>
