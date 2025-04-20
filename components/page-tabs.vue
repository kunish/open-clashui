<script lang="ts">
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "reka-ui";

export interface PageTabsItem {
  /**
   * @IconifyIcon
   */
  icon?: string;
  label?: string;
  value: string;
  disabled?: boolean;
}
</script>

<script setup lang="ts" generic="T extends PageTabsItem">
defineProps<{
  items: PageTabsItem[];
}>();

const model = defineModel<string>();
</script>

<template>
  <TabsRoot
    v-model="model"
    class="flex h-full flex-col gap-2"
    :unmount-on-hide="false"
  >
    <TabsList>
      <UButtonGroup>
        <TabsTrigger
          v-for="(item, idx) in items"
          :key="item.value"
          :value="item.value || idx"
          as-child
        >
          <UButton
            size="sm"
            :color="model === item.value ? 'primary' : 'neutral'"
            :icon="item.icon"
            variant="subtle"
            :disabled="item.disabled"
          >
            {{ item.label }}
          </UButton>
        </TabsTrigger>

        <slot name="tabs" />
      </UButtonGroup>
    </TabsList>

    <TabsContent
      v-for="(item, idx) of items"
      :key="idx"
      class="flex-1"
      :value="item.value || idx"
    >
      <slot :name="item.value" :item />
    </TabsContent>
  </TabsRoot>
</template>
