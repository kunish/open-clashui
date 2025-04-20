import dagre from "@dagrejs/dagre";
import type { Edge, Node } from "@vue-flow/core";
import { Position, useVueFlow } from "@vue-flow/core";

export type GraphLayoutDirection = "TB" | "BT" | "LR" | "RL";

export const useGraphLayout = () => {
  const options = { compound: true };
  const { findNode } = useVueFlow();

  const previousDirection = ref<GraphLayoutDirection>("LR");

  const graph = ref(new dagre.graphlib.Graph(options));

  const layout = (
    nodes: Node[],
    edges: Edge[],
    direction: GraphLayoutDirection,
  ) => {
    // we create a new graph instance, in case some nodes/edges were removed, otherwise dagre would act as if they were still there
    const dagreGraph = new dagre.graphlib.Graph(options);

    graph.value = dagreGraph;

    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    previousDirection.value = direction;

    for (const edge of edges) {
      dagreGraph.setEdge(edge.source, edge.target);
    }

    for (const node of nodes) {
      const graphNode = findNode(node.id);
      const graphParentNode = findNode(node.parentNode);

      if (graphParentNode) {
        dagreGraph.setParent(node.id, graphParentNode.id);
      }

      dagreGraph.setNode(node.id, {
        width: graphNode?.dimensions.width || 150,
        height: graphNode?.dimensions.height || 150,
      });
    }

    dagre.layout(dagreGraph);

    return nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);

      return {
        ...node,
        targetPosition: isHorizontal ? Position.Left : Position.Top,
        sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
        position: {
          x: nodeWithPosition.x,
          y: nodeWithPosition.y,
        },
      };
    });
  };

  return { graph, layout, previousDirection };
};
