<script setup lang="ts">
import { omit } from "lodash-es";
import colors from "tailwindcss/colors";

const appConfig = useAppConfig();
const appConfigStorage = useLocalStorage("open-clashui:appConfig", appConfig);
const colorMode = useColorMode();

const neutralColors = ["slate", "gray", "zinc", "stone"];
const neutral = computed({
  get() {
    return appConfig.ui.colors.neutral;
  },
  set(option) {
    appConfig.ui.colors.neutral = option;
  },
});

const colorsToOmit = [
  "inherit",
  "current",
  "transparent",
  "black",
  "white",
  "neutral",
  ...neutralColors,
];
const primaryColors = Object.keys(omit(colors, colorsToOmit));
const primary = computed({
  get() {
    return appConfig.ui.colors.primary;
  },
  set(option) {
    appConfig.ui.colors.primary = option;

    appConfigStorage.value = appConfig;
  },
});

watch([primary, neutral], () => {
  appConfigStorage.value = appConfig;
});

const modes = [
  { label: "light", icon: "lucide:sun" },
  { label: "dark", icon: "lucide:moon" },
  { label: "system", icon: "lucide:monitor" },
];

const mode = computed({
  get() {
    return colorMode.value;
  },
  set(option) {
    colorMode.preference = option;
  },
});

const { locale, setLocale, locales } = useI18n();

const [DefineLegend, Legend] = createReusableTemplate<{ name: string }>();
</script>

<template>
  <UPopover :ui="{ content: 'flex flex-col gap-4 p-4' }">
    <template #default="{ open }">
      <UButton
        icon="lucide:swatch-book"
        color="neutral"
        :variant="open ? 'soft' : 'ghost'"
        square
        aria-label="Color picker"
        :ui="{ leadingIcon: 'text-primary' }"
      />
    </template>

    <template #content>
      <DefineLegend #="{ name }">
        <legend class="mb-2 text-[11px] leading-none font-semibold">
          {{ name }}
        </legend>
      </DefineLegend>

      <fieldset>
        <Legend :name="$t('languages')" />

        <div class="grid grid-cols-3 gap-1">
          <ThemePickerButton
            v-for="l in locales"
            :key="l.code"
            :selected="locale === l.code"
            :label="l.name!"
            @click="setLocale(l.code)"
          />
        </div>
      </fieldset>

      <fieldset>
        <Legend name="Primary" />

        <div class="grid grid-cols-3 gap-1">
          <ThemePickerButton
            v-for="color in primaryColors"
            :key="color"
            :label="color"
            :chip="color"
            :selected="primary === color"
            @click="primary = color"
          />
        </div>
      </fieldset>

      <fieldset>
        <Legend name="Neutral" />

        <div class="grid grid-cols-3 gap-1">
          <ThemePickerButton
            v-for="color in neutralColors"
            :key="color"
            :label="color"
            :chip="color"
            :selected="neutral === color"
            @click="neutral = color"
          />
        </div>
      </fieldset>

      <fieldset>
        <Legend :name="$t('colorMode')" />

        <div class="grid grid-cols-3 gap-1">
          <ThemePickerButton
            v-for="m in modes"
            :key="m.label"
            v-bind="m"
            :selected="colorMode.preference === m.label"
            @click="mode = m.label"
          />
        </div>
      </fieldset>
    </template>
  </UPopover>
</template>
