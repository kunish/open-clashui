<script setup lang="ts">
import byteSize from "byte-size";

const { t } = useI18n();
const { webSocket, traffics } = useTraffic();

const option = computed<ECOption>(() => {
  return {
    grid: {
      left: 60,
      right: 20,
      top: 20,
      bottom: 40,
    },
    xAxis: {
      type: "time",
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      splitLine: {
        show: false,
      },
      axisLine: {
        show: true,
      },
      axisLabel: {
        formatter: (value: number) => byteSize(value).toString(),
      },
    },
    series: [
      {
        name: t("download"),
        type: "line",
        smooth: true,
        showSymbol: false,
        areaStyle: {},
        data: traffics.value.map(({ time, download }) => ({
          name: time.toString(),
          value: [time, download],
        })),
      },
      {
        name: t("upload"),
        type: "line",
        smooth: true,
        showSymbol: false,
        areaStyle: {},
        data: traffics.value.map(({ time, upload }) => ({
          name: time.toString(),
          value: [time, upload],
        })),
      },
    ],
  };
});
</script>

<template>
  <ChartContainer
    :name="$t('speedStats')"
    :loading="webSocket.status.value === 'CONNECTING'"
    :option
  />
</template>
