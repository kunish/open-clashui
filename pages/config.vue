<script setup lang="ts">
import type { ButtonProps, FormSubmitEvent } from "@nuxt/ui";
import { cloneDeep, isEqual } from "lodash-es";
import * as v from "valibot";

const { t } = useI18n();
const { request } = useRequest();
const { asyncState } = useConfig();

enum Mode {
  Direct = "direct",
  Rule = "rule",
  Global = "global",
}

enum TunStack {
  Mixed = "Mixed",
  gVisor = "gVisor",
  System = "System",
  LWIP = "LWIP",
}

const schema = v.object({
  mode: v.enum(Mode),
  "allow-lan": v.boolean(),
  "interface-name": v.string(),
  "mixed-port": v.pipe(v.number(), v.minValue(0), v.maxValue(65535)),
  port: v.number(),
  "socks-port": v.number(),
  "redir-port": v.number(),
  "tproxy-port": v.number(),
  tun: v.object({
    enable: v.boolean(),
    stack: v.enum(TunStack),
    device: v.string(),
  }),
});

type Schema = v.InferOutput<typeof schema>;

const state = reactive<Schema>({
  mode: Mode.Rule,
  "allow-lan": false,
  "mixed-port": 0,
  port: 0,
  "socks-port": 0,
  "redir-port": 0,
  "tproxy-port": 0,
  "interface-name": "",
  tun: {
    enable: false,
    stack: TunStack.Mixed,
    device: "",
  },
});

const resetForm = () => Object.assign(state, cloneDeep(asyncState.state.value));

const isClean = computed(
  () => asyncState.isReady.value && isEqual(state, asyncState.state.value),
);

watch(asyncState.isReady, async (ready) => {
  if (!ready) return;

  resetForm();
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  console.log(event.data);
};

const buttons = ref<ButtonProps[]>([
  {
    label: t("flushFakeIP"),
    onClick: async () => {
      await request.value.post("cache/fakeip/flush");
    },
  },
  {
    label: t("updateGEODatabases"),
    onClick: async () => {
      await request.value.post("configs/geo");
    },
  },
  {
    label: t("reloadConfig"),
    onClick: async () => {
      await request.value.put("configs", {
        searchParams: { force: true },
        json: { path: "", payload: "" },
      });
    },
  },
  {
    label: t("restartCore"),
    onClick: async () => {
      await request.value.post("restart");
    },
  },
]);
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <UButton
        v-for="button in buttons"
        :key="button.label"
        size="lg"
        loading-auto
        v-bind="button"
      />
    </div>

    <UForm class="space-y-4" :schema :state @submit="onSubmit">
      <div class="grid grid-cols-3 gap-2">
        <UFormField :label="$t('allowLan')" name="allow-lan">
          <USwitch v-model="state['allow-lan']" />
        </UFormField>

        <UFormField :label="$t('runningMode')" name="mode">
          <USelect v-model="state.mode" :items="Object.values(Mode)" />
        </UFormField>

        <UFormField :label="$t('outboundInterfaceName')" name="interface-name">
          <UInput v-model="state['interface-name']" />
        </UFormField>
      </div>

      <div class="grid grid-cols-3 gap-2">
        <UFormField :label="$t('enableTunDevice')" name="tun.enable">
          <USwitch v-model="state.tun.enable" />
        </UFormField>

        <UFormField :label="$t('tunModeStack')" name="tun.stack">
          <USelect v-model="state.tun.stack" :items="Object.values(TunStack)" />
        </UFormField>

        <UFormField :label="$t('tunDeviceName')" name="tun.device">
          <UInput v-model="state.tun.device" />
        </UFormField>
      </div>

      <div class="grid grid-cols-3 gap-2">
        <UFormField
          :label="$t('portType', { name: 'Mixed' })"
          name="mixed-port"
        >
          <UInputNumber v-model="state['mixed-port']" />
        </UFormField>

        <UFormField :label="$t('portType', { name: 'HTTP' })" name="port">
          <UInputNumber v-model="state.port" />
        </UFormField>

        <UFormField
          :label="$t('portType', { name: 'Socks' })"
          name="socks-port"
        >
          <UInputNumber v-model="state['socks-port']" />
        </UFormField>

        <UFormField
          :label="$t('portType', { name: 'Redir' })"
          name="redir-port"
        >
          <UInputNumber v-model="state['redir-port']" />
        </UFormField>

        <UFormField
          :label="$t('portType', { name: 'TProxy' })"
          name="tproxy-port"
        >
          <UInputNumber v-model="state['tproxy-port']" />
        </UFormField>
      </div>

      <div class="flex justify-end gap-2">
        <UButton
          variant="outline"
          :disabled="isClean"
          @click="() => resetForm()"
        >
          {{ $t("reset") }}
        </UButton>

        <UButton type="submit" :disabled="isClean">
          {{ $t("confirm") }}
        </UButton>
      </div>
    </UForm>
  </div>
</template>
