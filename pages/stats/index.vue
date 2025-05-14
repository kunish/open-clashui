<script setup lang="ts">
import byteSize from "byte-size";

const { t } = useI18n();

useHead({
  title: formatPageTitle(t("overview")),
});

const { traffics } = useTraffic();
const { connections, downloadTotal, uploadTotal } = useConnection();
const { memoryUsage } = useMemoryUsage();

const [DefineWidget, Widget] = createReusableTemplate<{
  name: string;
  value: string;
}>();
</script>

<template>
  <div class="flex h-full flex-col gap-2">
    <DefineWidget #="{ name, value }">
      <div class="flex flex-col items-center gap-2 p-2 sm:items-start">
        <div class="text-default text-sm font-light whitespace-nowrap">
          {{ name }}
        </div>

        <div class="text-lg font-semibold tracking-wide whitespace-nowrap">
          {{ value }}
        </div>
      </div>
    </DefineWidget>

    <div
      class="bg-primary/70 flex shrink-0 flex-wrap items-center justify-around overflow-x-auto rounded-md p-4 [&>*]:flex-1"
    >
      <Widget
        :name="$t('download')"
        :value="`${byteSize(traffics.at(-1)?.download || 0).toString()}/s`"
      />
      <Widget
        :name="$t('upload')"
        :value="`${byteSize(traffics.at(-1)?.upload || 0).toString()}/s`"
      />
      <Widget
        :name="$t('downloadTotal')"
        :value="byteSize(downloadTotal || 0).toString()"
      />
      <Widget
        :name="$t('uploadTotal')"
        :value="byteSize(uploadTotal || 0).toString()"
      />
      <Widget
        :name="$t('activeConnection')"
        :value="formatNumber(connections.length)"
      />
      <Widget
        :name="$t('memoryUsage')"
        :value="byteSize(memoryUsage.inuse).toString()"
      />
    </div>

    <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <ChartSpeed class="h-80 flex-1" />
      <ChartFlow class="h-80 flex-1" />
    </div>
  </div>
</template>
