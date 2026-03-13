<template>
  <span
    class="inline-flex items-center justify-center rounded-full font-bold capitalize"
    :class="{
      // Size
      'px-2.5 py-1 text-[10px]': !size || size === 'sm',
      'px-3 py-1.5 text-xs': size === 'md',
      // Variants
      'bg-blue-100 text-blue-700': !variant || variant === 'blue',
      'bg-orange-100 text-orange-600': variant === 'orange',
      'bg-green-100 text-green-700': variant === 'green',
      'bg-red-100 text-red-600': variant === 'red',
      'bg-slate-100 text-slate-600': variant === 'slate',
    }">
    <slot />
  </span>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'blue' | 'orange' | 'green' | 'red' | 'slate';
  size?: 'sm' | 'md';
}>();
</script>
