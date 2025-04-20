<script setup lang="ts">
defineProps<{
  onClick?: () => Promise<void> | void;
}>();
</script>

<template>
  <UButton icon="lucide:test-tube" size="xs" loading-auto @click.stop="onClick">
    <slot />
  </UButton>
</template>
