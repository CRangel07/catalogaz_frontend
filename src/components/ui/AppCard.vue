|
<template>
  <div
    class="rounded-2xl bg-white border border-slate-100 shadow-[0_2px_12px_rgba(30,58,138,0.06)] overflow-hidden"
    :class="
      hover &&
      'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(30,58,138,0.12)]'
    ">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  hover?: boolean;
}>();
</script>
