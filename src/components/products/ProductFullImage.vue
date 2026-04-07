<template>
  <div>
    <p class="uppercase text-center text-xl font-semibold text-azul mb-5">{{ props.name }}</p>
    <div class="w-full">
      <img
        class="w-full block"
        :src="`${BASE_ASSETS}${props.imageFullUrl}`"
        :alt="'imagen' + props.name" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/types/db';

type Props = Pick<Product, 'name' | 'imageFullUrl'>;

const BASE_ASSETS = import.meta.env.VITE_ASSETS_URL;

const props = defineProps<Props>();
</script>
