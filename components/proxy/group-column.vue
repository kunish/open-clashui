<script setup lang="ts">
import { useAutoAnimate } from "@formkit/auto-animate/vue";

defineProps<{
  group: {
    name: string;
    selected?: string;
    children: string[];
  };
}>();

const [autoAnimateParent] = useAutoAnimate();
</script>

<template>
  <UCollapsible
    class="group flex flex-col transition-[gap] duration-500 data-[state=closed]:gap-0 data-[state=open]:gap-2"
    :unmount-on-hide="false"
  >
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div>{{ group.name }}</div>

          <div class="flex items-center gap-2">
            <LatencyTest @click="() => {}" />

            <UIcon
              class="transition-transform duration-200 group-data-[state=open]:rotate-180"
              name="lucide:chevron-down"
            />
          </div>
        </div>
      </template>
    </UCard>

    <template #content>
      <UCard
        class="m-[1px]"
        :ui="{
          body: 'p-2 sm:p-4',
        }"
      >
        <div ref="autoAnimateParent" class="grid grid-cols-4 gap-2">
          <ProxyCard
            v-for="proxy in group.children"
            :key="proxy"
            :name="proxy"
            :group-name="group.name"
            :selected="group.selected === proxy"
          />
        </div>
      </UCard>
    </template>
  </UCollapsible>
</template>
