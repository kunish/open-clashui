<script setup lang="ts">
import { Background } from "@vue-flow/background";
import { Controls } from "@vue-flow/controls";
import type { Edge, Node } from "@vue-flow/core";
import { useVueFlow, VueFlow } from "@vue-flow/core";
import { MiniMap } from "@vue-flow/minimap";
import type { NodeData } from "./types";

const parent = useTemplateRef("parent");

const { fitView } = useVueFlow();
const { asyncState } = useProxy();

const nodes = ref<Node<NodeData>[]>([]);
const edges = ref<Edge<NodeData>[]>([]);

const { layout, previousDirection } = useGraphLayout();

const layoutGraph = (direction: GraphLayoutDirection) => {
  nodes.value = layout(nodes.value, edges.value, direction);
  nextTick(fitView);
};

watchImmediate(asyncState.state, (state) => {
  const { proxyProviders } = state;

  const proxyProviderNodes = proxyProviders.map((proxyProvider) => ({
    id: `proxyProvider:${proxyProvider.name}`,
    type: "custom",
    position: { x: 0, y: 0 },
    data: {
      label: proxyProvider.name,
      proxyProvider,
    },
  }));

  const proxyNodes = proxyProviders
    .map((proxyProvider) =>
      proxyProvider.proxies.map((proxyNode) => ({
        id: `proxyProvider:${proxyProvider.name}/proxy:${proxyNode.name}`,
        type: "custom",
        position: { x: 0, y: 0 },
        data: {
          label: proxyNode.name,
          proxyNode,
          proxyProvider,
        },
      })),
    )
    .flat();

  nodes.value = [...proxyProviderNodes, ...proxyNodes];
  layoutGraph(previousDirection.value);
});

watch(nodes, (nodes) => {
  if (!nodes.length) return;

  edges.value = nodes
    .filter((node) => !!node.data?.proxyNode)
    .map((node) => {
      const source = `proxyProvider:${node.data?.proxyProvider!.name}`;
      const target = `proxyProvider:${node.data!.proxyProvider!.name}/proxy:${node.data?.proxyNode!.name}`;

      return {
        id: `e:${source}->${target}`,
        source,
        target,
      };
    });
});

useResizeObserver(parent, () => layoutGraph(previousDirection.value));
</script>

<template>
  <div ref="parent" class="size-full">
    <VueFlow
      :nodes
      :edges
      :nodes-draggable="false"
      snap-to-grid
      elevate-edges-on-select
      fit-view-on-init
      @nodes-initialized="layoutGraph('TB')"
    >
      <MiniMap pannable zoomable />
      <Controls position="top-right" />
      <Background />

      <template #node-custom="props">
        <GraphProxyCustomNode v-bind="props" />
      </template>
    </VueFlow>
  </div>
</template>
