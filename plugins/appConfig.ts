import type { AppConfig } from "nuxt/schema";

export default defineNuxtPlugin({
  enforce: "post",
  setup() {
    const appConfig = useAppConfig();

    if (import.meta.client) {
      const appConfigStorage = useLocalStorage<AppConfig>(
        "open-clashui:appConfig",
        appConfig,
      );

      updateAppConfig(appConfigStorage.value);
    }
  },
});
