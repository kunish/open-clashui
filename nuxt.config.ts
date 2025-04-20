// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  css: [
    "@vue-flow/core/dist/style.css",
    "@vue-flow/core/dist/theme-default.css",
    "@vue-flow/controls/dist/style.css",
    "@vue-flow/minimap/dist/style.css",

    "~/assets/css/main.css",
  ],
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "@nuxtjs/i18n",
    "nuxt-echarts",
  ],
  build: { transpile: ["echarts-liquidfill"] },
  vite: {
    resolve: {
      alias: { "echarts/lib/util/number": "echarts/lib/util/number.js" },
    },
  },
  app: {
    head: {
      meta: [
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover",
        },
      ],
    },
  },
  i18n: {
    defaultLocale: "en",
    bundle: { optimizeTranslationDirective: false },
    locales: [
      { name: "English", code: "en", file: "en.json" },
      { name: "简体中文", code: "zh-CN", file: "zh-CN.json" },
    ],
  },
  echarts: {
    renderer: ["canvas"],
    charts: ["BarChart", "LineChart", "PieChart"],
    components: ["DatasetComponent", "GridComponent", "TooltipComponent"],
  },
});
