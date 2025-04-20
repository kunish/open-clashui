<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core";
import type { PageTabsItem } from "~/components/page-tabs.vue";
import type { ProxyGroup, ProxyProvider } from "~/typings";

const { t } = useI18n();

useHead({
  title: formatPageTitle(t("proxy")),
});

const { asyncState } = useProxy();
const breakpoints = useBreakpoints(breakpointsTailwind);
const largerThanSm = breakpoints.greater("sm");

const proxyGroupColumns = computed(() =>
  !largerThanSm.value
    ? [asyncState.state.value.proxyGroups]
    : asyncState.state.value.proxyGroups.reduce(
        (acc, group, index) => {
          if (index % 2 === 0) {
            acc[0].push(group);
          } else {
            acc[1].push(group);
          }

          return acc;
        },
        [[] as ProxyGroup[], [] as ProxyGroup[]],
      ),
);

const proxyProviderColumns = computed(() =>
  !largerThanSm.value
    ? [asyncState.state.value.proxyProviders]
    : asyncState.state.value.proxyProviders.reduce(
        (acc, group, index) => {
          if (index % 2 === 0) {
            acc[0].push(group);
          } else {
            acc[1].push(group);
          }

          return acc;
        },
        [[] as ProxyProvider[], [] as ProxyProvider[]],
      ),
);

const selectedTab = ref("proxy");

const tabItems = computed(
  () =>
    [
      {
        label: `${t("proxy")} (${formatNumber(asyncState.state.value.proxyGroups.length)})`,
        icon: "lucide:box",
        value: "proxy" as const,
      },
      {
        label: `${t("proxyProviders")} (${formatNumber(asyncState.state.value.proxyProviders.length)})`,
        icon: "lucide:boxes",
        value: "proxyProvider" as const,
      },
    ] satisfies PageTabsItem[],
);
</script>

<template>
  <div>
    <PageTabs v-model="selectedTab" :items="tabItems">
      <template #tabs>
        <UModal :title="$t('graph')" fullscreen>
          <UButton icon="lucide:workflow" />

          <template #body>
            <GraphProxy />
          </template>
        </UModal>

        <ProxySettingsModal>
          <UButton icon="lucide:settings" />
        </ProxySettingsModal>
      </template>

      <template #proxy>
        <div class="flex gap-2">
          <div
            v-for="(group, idx) in proxyGroupColumns"
            :key="idx"
            class="flex flex-1 flex-col gap-2"
          >
            <ProxyGroupColumn
              v-for="proxyGroup in group"
              :key="proxyGroup.name"
              :group="{
                name: proxyGroup.name,
                selected: proxyGroup.now,
                children: proxyGroup.all || [],
              }"
            />
          </div>
        </div>
      </template>

      <template #proxyProvider>
        <div class="flex gap-2">
          <div
            v-for="(group, idx) in proxyProviderColumns"
            :key="idx"
            class="flex flex-1 flex-col gap-2"
          >
            <ProxyGroupColumn
              v-for="proxyGroup in group"
              :key="proxyGroup.name"
              :group="{
                name: proxyGroup.name,
                children: proxyGroup.proxies.map(({ name }) => name) || [],
              }"
            />
          </div>
        </div>
      </template>
    </PageTabs>
  </div>
</template>
