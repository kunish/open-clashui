<script setup lang="ts">
const endpointUrlCookie = useCookie("open-clashui:endpointUrl");
const secretCookie = useCookie("open-clashui:secret");
const { setup } = useRequest();

if (!endpointUrlCookie.value) {
  navigateTo("/setup", { replace: true });
} else {
  setup({
    prefixUrl: endpointUrlCookie.value,
    headers: {
      Authorization: `Bearer ${secretCookie.value}`,
    },
  });
}

useConfig();
useTraffic();
useMemoryUsage();
useConnection();
useLog();
</script>

<template>
  <main class="flex h-dvh flex-col gap-2">
    <NavBar />

    <UContainer class="h-full flex-1 overflow-auto p-2">
      <slot />
    </UContainer>
  </main>
</template>
