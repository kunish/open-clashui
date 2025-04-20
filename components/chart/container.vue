<script setup lang="ts">
defineProps<{
  name: string;
  loading?: boolean;
  option: ECOption;
}>();

const parent = useTemplateRef("parent");
const chart = useTemplateRef("chart");
const colorMode = useColorMode();

useResizeObserver(parent, () => chart.value?.resize());
</script>

<template>
  <div ref="parent" class="flex flex-col gap-2">
    <div class="text-sm font-semibold">
      {{ name }}
    </div>

    <div class="h-full overflow-hidden rounded-md">
      <VChart
        ref="chart"
        :theme="colorMode.value === 'dark' ? 'dark' : ''"
        :loading="loading"
        :option
      />
    </div>
  </div>
</template>
