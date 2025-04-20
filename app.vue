<script setup lang="ts">
import * as uiLocales from "@nuxt/ui/locale";
import "@valibot/i18n/zh-CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import relativeTime from "dayjs/plugin/relativeTime";
import * as v from "valibot";

dayjs.extend(relativeTime);

const { locale } = useI18n();
const uiLocale = computed(
  () =>
    Object.values(uiLocales).find((l) => l.code === locale.value) ||
    uiLocales.en,
);
const lang = computed(() => uiLocale.value.code);
const dir = computed(() => uiLocale.value.dir);

useHead({
  htmlAttrs: {
    lang,
    dir,
  },
});

watchImmediate(locale, (locale) => {
  v.setGlobalConfig({
    lang: locale,
  });
  dayjs.locale(
    {
      en: "en",
      "zh-CN": "zh-cn",
    }[locale],
  );
});
</script>

<template>
  <ClientOnly>
    <UApp :locale="uiLocale">
      <NuxtLoadingIndicator />

      <NuxtRouteAnnouncer />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </ClientOnly>
</template>
