<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();
const { asyncState: proxy } = useProxy();
const { asyncState: rule } = useRule();
const { connections } = useConnection();
const { logs } = useLog();

const open = ref(false);
const items = computed<NavigationMenuItem[]>(() => [
  {
    label: t("stats"),
    icon: "lucide:flame",
    to: localePath("/stats"),
    active: route.path.startsWith(localePath("/stats")),
    children: [
      {
        label: t("overview"),
        icon: "lucide:chart-area",
        to: localePath("/stats"),
      },
      {
        label: `${t("connection")} (${formatNumber(connections.value.length)})`,
        icon: "lucide:server",
        to: localePath("/stats/connection"),
      },
      {
        label: `${t("log")} (${formatNumber(logs.value.length)})`,
        icon: "lucide:file-text",
        to: localePath("/stats/log"),
      },
    ],
  },
  {
    label: t("proxy"),
    icon: "lucide:package",
    to: localePath("/proxy"),
    badge: proxy.state.value.proxies.length,
  },
  {
    label: t("rule"),
    icon: "lucide:ruler",
    to: localePath("/rule"),
    badge: rule.state.value.rules.length,
  },
  {
    label: t("config"),
    icon: "lucide:settings-2",
    to: localePath("/config"),
  },
  {
    label: "GitHub",
    icon: "lucide:github",
    to: "https://github.com/metacubex/OpenClashUI",
    target: "_blank",
  },
]);
</script>

<template>
  <TheHeader>
    <template #leading>
      <TextLogo />
    </template>

    <UNavigationMenu
      class="hidden w-full justify-center md:flex"
      arrow
      content-orientation="vertical"
      :unmount-on-hide="false"
      :items
      :ui="{
        childList: 'w-64',
      }"
    />

    <template #trailing>
      <ThemePicker />

      <UModal
        v-model:open="open"
        :transition="false"
        :overlay="false"
        fullscreen
        :ui="{
          content: 'flex md:hidden',
        }"
      >
        <UButton class="flex md:hidden" icon="lucide:menu" />

        <template #body>
          <UNavigationMenu
            variant="pill"
            :unmount-on-hide="false"
            orientation="vertical"
            :items
          />
        </template>
      </UModal>
    </template>
  </TheHeader>
</template>
