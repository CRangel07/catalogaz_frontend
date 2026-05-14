<template>
  <img
    :alt="alt"
    :src="buildUrl"
    class="relative z-10 h-full w-full object-contain drop-shadow-[0_8px_16px_rgba(30,64,175,0.2)]"
    @error="handleImageError" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ImageNotFound from '@/assets/noImage400x400.svg';

const props = defineProps<{
  url: string | null;
  alt: string;
  isAsset?: boolean;
  updatedAt?: string | Date | null; // ← pasar el updatedAt del producto
}>();

const handleImageError = (e: Event) => {
  if (!e.target) return null;
  const img = e.target as HTMLImageElement;
  img.onerror = null;
  img.src = ImageNotFound;
};

const BASE_ASSETS = import.meta.env.VITE_ASSETS_URL;

const buildUrl = computed(() => {
  if (!props.url) return ImageNotFound;

  const base = `${!props.isAsset ? BASE_ASSETS : ''}${props.url}`;

  // Si hay updatedAt, usarlo como cache buster
  if (props.updatedAt) {
    const ts = new Date(props.updatedAt).getTime();
    return `${base}?v=${ts}`;
  }

  return base;
});
</script>
