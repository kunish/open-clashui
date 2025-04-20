<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { cloneDeep, isEqual } from "lodash-es";
import { PROXIES_ORDERING_TYPE } from "~/constants";

const form = useTemplateRef("form");
const open = ref(false);

const { proxySettingsStorage } = useProxy();

const state = reactive<ProxySettingsSchema>(
  cloneDeep(proxySettingsInitialState),
);

const isClean = computed(() => isEqual(state, proxySettingsStorage.value));

const resetForm = () =>
  Object.assign(state, cloneDeep(proxySettingsInitialState));

const onSubmit = (event: FormSubmitEvent<ProxySettingsSchema>) => {
  proxySettingsStorage.value = event.data;
};
</script>

<template>
  <UModal
    v-model:open="open"
    :title="$t('proxySettings')"
    :ui="{
      footer: 'justify-end',
    }"
  >
    <slot />

    <template #body>
      <UForm
        ref="form"
        class="space-y-4"
        :state
        :schema="proxySettingsSchema"
        @submit="onSubmit"
      >
        <UFormField :label="$t('autoCloseConns')" name="autoCloseConns">
          <USwitch v-model="state.autoCloseConns" />
        </UFormField>

        <UFormField
          :label="$t('hideUnavailableProxy')"
          name="hideUnAvailableProxies"
        >
          <USwitch v-model="state.hideUnAvailableProxies" />
        </UFormField>

        <UFormField :label="$t('urlForLatencyTest')" name="urlForLatencyTest">
          <UInput v-model="state.urlForLatencyTest" />
        </UFormField>

        <UFormField
          :label="`${$t('latencyTestTimeoutDuration')} (ms)`"
          name="latencyTestTimeoutDuration"
        >
          <UInputNumber
            v-model="state.latencyTestTimeoutDuration"
            :step="500"
            :min="0"
          />
        </UFormField>

        <UFormField :label="$t('proxySorting')" name="proxySorting">
          <USelect
            v-model="state.proxySorting"
            :items="
              Object.values(PROXIES_ORDERING_TYPE).map((type) => ({
                label: $t(type),
                value: type,
              }))
            "
          />
        </UFormField>

        <UFormField :label="$t('renderInTwoColumns')" name="renderInTwoColumns">
          <USwitch v-model="state.renderInTwoColumns" />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <div>
        <UButton
          color="neutral"
          :disabled="isClean"
          @click="
            () => {
              resetForm();
            }
          "
        >
          {{ $t("reset") }}
        </UButton>

        <UButton
          type="submit"
          :disabled="isClean"
          loading-auto
          @click="
            async () => {
              try {
                await form?.validate();
              } catch {
                return;
              }

              await form?.submit();
              open = false;
            }
          "
        >
          {{ $t("save") }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
