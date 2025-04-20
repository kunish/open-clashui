<script setup lang="ts" generic="TData extends RowData">
import type { Column, RowData } from "@tanstack/table-core";

const { column } = defineProps<{
  column: Column<TData>;
}>();

const isSorted = computed(() => column.getIsSorted());
</script>

<template>
  <UButton
    class="-mx-2.5"
    variant="ghost"
    color="neutral"
    :icon="
      isSorted
        ? isSorted === 'asc'
          ? 'lucide:arrow-up-narrow-wide'
          : 'lucide:arrow-down-wide-narrow'
        : undefined
    "
    :disabled="!column.getCanSort()"
    @click="column.getToggleSortingHandler()?.($event)"
  >
    <slot />
  </UButton>
</template>
