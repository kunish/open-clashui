<script setup lang="ts">
const { t } = useI18n();
const { downloadTotal, uploadTotal } = useConnection();

const option = computed<ECOption>(() => ({
  series: [
    {
      type: "pie",
      radius: "60%",
      data: [
        { value: downloadTotal.value || 0, name: t("downloadTotal") },
        { value: uploadTotal.value || 0, name: t("uploadTotal") },
      ],
    },
  ],
}));
</script>

<template>
  <ChartContainer :name="$t('flowStats')" :option />
</template>
