<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import ky from "ky";
import * as v from "valibot";

definePageMeta({
  layout: false,
});

const localePath = useLocalePath();
const toast = useToast();
const endpointUrlCookie = useCookie("open-clashui:endpointUrl");
const secretCookie = useCookie("open-clashui:secret");

enum Protocol {
  HTTP = "http",
  HTTPS = "https",
}

const schema = v.object({
  protocol: v.enum(Protocol),
  endpointAddress: v.string(),
  portNumber: v.optional(
    v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(65535)),
  ),
  secret: v.optional(v.pipe(v.string())),
});

type Schema = v.InferOutput<typeof schema>;

const state = reactive<Partial<Schema>>({
  endpointAddress: "",
  secret: "",
  protocol: Protocol.HTTPS,
});

const showSecret = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { protocol, endpointAddress, portNumber, secret } = event.data;

  const endpointUrl = `${protocol}://${endpointAddress}${
    portNumber ? `:${portNumber}` : ""
  }`;

  try {
    const { ok } = await ky.get(endpointUrl, {
      headers: {
        Authorization: `Bearer ${secret}`,
      },
    });

    if (!ok) {
      return;
    }
  } catch {
    toast.add({
      title: "Error",
      description:
        "Failed to connect to the server. Please check your settings.",
    });
  }

  endpointUrlCookie.value = endpointUrl;
  secretCookie.value = secret;

  navigateTo(localePath("/"), { replace: true });
}
</script>

<template>
  <UContainer class="flex h-dvh items-center justify-center">
    <UForm :schema :state class="max-w-md space-y-4" @submit="onSubmit">
      <fieldset class="text-sm">
        <legend
          class="text-default after:text-error block font-medium after:ms-0.5 after:content-['*']"
        >
          {{ $t("endpointUrl") }}
        </legend>

        <UButtonGroup class="mt-1 flex w-full">
          <USelect
            v-model="state.protocol"
            class="w-28"
            icon="lucide:shield"
            :items="[
              {
                label: 'https',
                icon: 'lucide:lock',
                value: Protocol.HTTPS,
              },
              {
                label: 'http',
                icon: 'lucide:lock-open',
                value: Protocol.HTTP,
              },
            ]"
          />

          <UInput v-model="state.endpointAddress" class="flex-1" />

          <UInput
            v-model="state.portNumber"
            class="w-24"
            type="number"
            :placeholder="$t('port')"
          />
        </UButtonGroup>

        <p class="text-muted mt-2">
          {{ $t("endpointUrlHint") }}
        </p>
      </fieldset>

      <UFormField :label="$t('secret')" name="secret">
        <UInput
          v-model="state.secret"
          class="w-full"
          :type="showSecret ? 'text' : 'password'"
          icon="lucide:key"
          :ui="{ trailing: 'pe-1' }"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="showSecret ? 'lucide:eye-off' : 'lucide:eye'"
              @click="showSecret = !showSecret"
            />
          </template>
        </UInput>
      </UFormField>

      <UButton type="submit" loading-auto>{{ $t("save") }}</UButton>
    </UForm>
  </UContainer>
</template>
