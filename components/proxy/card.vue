<script setup lang="ts">
const { name } = defineProps<{
  name: string;
  groupName: string;
  selected?: boolean;
}>();

const { asyncState, selectProxyInGroup, proxyLatencyTest } = useProxy();

const proxy = computed(() =>
  asyncState.state.value.proxies.find((group) => group.name === name),
);

const latency = computed(() => proxy.value?.history.at(-1)?.delay);
</script>

<template>
  <UTooltip arrow :text="name" :content="{ sideOffset: 4 }">
    <div
      :class="[
        'ring-default flex cursor-pointer flex-col gap-2 rounded-lg p-2 ring',
        selected ? 'bg-elevated' : 'bg-default',
      ]"
      @click="
        () => {
          if (selected) return;

          selectProxyInGroup({
            proxyName: name,
            groupName,
          });
        }
      "
    >
      <div class="line-clamp-1 text-xs">
        {{ name }}
      </div>

      <div class="flex justify-end">
        <LatencyTest @click="proxyLatencyTest({ proxyName: name })">
          {{ latency }}
        </LatencyTest>
      </div>
    </div>
  </UTooltip>
</template>
