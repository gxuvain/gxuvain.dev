<script setup lang="ts">
defineProps<{
  icon: string;
  label: string;
}>();
</script>

<template>
  <span class="inline-flex items-center gap-1 whitespace-nowrap align-middle font-bold text-white">
    <Icon :name="icon" size="16" aria-hidden="true" />
    {{ label }}
  </span>
</template>
