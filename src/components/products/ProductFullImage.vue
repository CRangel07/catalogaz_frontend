<template>
  <div>
    <p class="uppercase text-center text-xl font-semibold text-azul mb-5">{{ props.name }}</p>
    <div class="w-full">
      <img
        class="w-full block"
        :src="`${BASE_ASSETS}${props.imageFullUrl}`"
        :alt="'imagen' + props.name"
        @error="handleImageError" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/types/db';
import ImageNotFound from '@/assets/noImage400x400.svg';

type Props = Pick<Product, 'name' | 'imageFullUrl'>;

const BASE_ASSETS = import.meta.env.VITE_ASSETS_URL;

const handleImageError = (e: Event) => {
  if (!e.target) return null;
  const img = e.target as HTMLImageElement;
  img.onerror = null;
  img.src = ImageNotFound;
};

const props = defineProps<Props>();
</script>
