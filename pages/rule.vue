<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import dayjs from "dayjs";
import type { PageTabsItem } from "~/components/page-tabs.vue";
import type { Rule, RuleProvider } from "~/typings";

const { t } = useI18n();

useHead({
  title: formatPageTitle(t("rule")),
});

const { asyncState, updateAllRuleProvider } = useRule();

const selectedTab = ref("rule");

const tabItems = computed(
  () =>
    [
      {
        label: `${t("rule")} (${formatNumber(asyncState.state.value.rules.length)})`,
        icon: "lucide:box",
        value: "rule" as const,
      },
      {
        label: `${t("ruleProviders")} (${formatNumber(asyncState.state.value.ruleProviders.length)})`,
        icon: "lucide:boxes",
        value: "ruleProvider" as const,
      },
    ] satisfies PageTabsItem[],
);

const ruleColumns = computed<TableColumn<Rule>[]>(() => [
  {
    header: () => t("type"),
    accessorKey: "type",
    accessorFn: (original) => original.type,
  },
  {
    header: () => t("rule"),
    accessorKey: "payload",
    accessorFn: (original) => original.payload,
  },
  {
    header: () => t("proxy"),
    accessorKey: "proxy",
    accessorFn: (original) => original.proxy,
  },
]);

const ruleProviderColumns = computed<TableColumn<RuleProvider>[]>(() => [
  {
    header: () => t("name"),
    accessorKey: "name",
    accessorFn: (original) => original.name,
  },
  {
    header: () => t("ruleCount"),
    accessorKey: "ruleCount",
    accessorFn: (original) => original.ruleCount,
  },
  {
    header: () => t("updated"),
    accessorKey: "updatedAt",
    accessorFn: (original) => dayjs(original.updatedAt).fromNow(),
  },
]);
</script>

<template>
  <PageTabs v-model="selectedTab" :items="tabItems">
    <template #rule>
      <DataTable :columns="ruleColumns" :data="asyncState.state.value.rules" />
    </template>

    <template #ruleProvider>
      <DataTable
        :columns="ruleProviderColumns"
        :data="asyncState.state.value.ruleProviders"
      >
        <template #search-trailing>
          <UButton
            icon="lucide:rotate-cw"
            loading-auto
            @click="updateAllRuleProvider"
          />
        </template>
      </DataTable>
    </template>
  </PageTabs>
</template>
