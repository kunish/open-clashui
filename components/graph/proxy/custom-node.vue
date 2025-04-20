<script setup lang="ts">
import type { NodeProps } from "@vue-flow/core";
import { useVueFlow } from "@vue-flow/core";
import { NodeToolbar } from "@vue-flow/node-toolbar";
import type { NodeData } from "./types";

defineProps<NodeProps<NodeData>>();

const { updateNodeData } = useVueFlow();

const actions = ["👎", "✋", "👍"];
</script>

<template>
  <div class="size-full">
    <NodeToolbar>
      <div class="flex items-center gap-2">
        <UButton
          v-for="action of actions"
          :key="action"
          @click="updateNodeData(id, { action })"
        >
          {{ action }}
        </UButton>
      </div>
    </NodeToolbar>

    <UCard class="h-full" variant="subtle">
      <template #header>{{ data.label }}</template>
    </UCard>
  </div>
</template>
