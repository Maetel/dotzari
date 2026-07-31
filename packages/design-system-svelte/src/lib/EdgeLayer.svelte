<script lang="ts">
  import { bezierEdgeGeometry } from '@dotzari/design-system';
  import type { CanvasEdgeModel, CanvasNodeModel } from '@dotzari/design-system';

  let { nodes, edges }: { nodes: CanvasNodeModel[]; edges: CanvasEdgeModel[] } = $props();
  let nodeMap = $derived(new Map(nodes.map((node) => [node.id, node])));
  let geometries = $derived(edges.flatMap((edge) => {
    const source = nodeMap.get(edge.sourceId);
    const target = nodeMap.get(edge.targetId);
    return source && target ? [{ edge, geometry: bezierEdgeGeometry(source, target) }] : [];
  }));
</script>

<svg class="dz-edge-layer" aria-hidden="true" width="1800" height="1100" viewBox="0 0 1800 1100">
  <defs>
    <marker id="dz-edge-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--dz-edge)" />
    </marker>
  </defs>
  {#each geometries as item (item.edge.id)}
    <path class:active={item.edge.active} d={item.geometry.path} marker-end="url(#dz-edge-arrow)" data-edge-id={item.edge.id} />
    {#if item.edge.label}
      <text x={item.geometry.label.x} y={item.geometry.label.y - 8}>{item.edge.label}</text>
    {/if}
  {/each}
</svg>

<style>
  .dz-edge-layer { position: absolute; inset: 0; z-index: var(--dz-layer-edge); overflow: visible; pointer-events: none; }
  path { fill: none; stroke: var(--dz-edge); stroke-width: 2; vector-effect: non-scaling-stroke; }
  path.active { stroke: var(--dz-edge-active); stroke-width: 3; }
  text { fill: var(--dz-text-tertiary); font: var(--dz-font-size-1) var(--dz-font-sans); text-anchor: middle; paint-order: stroke; stroke: var(--dz-surface-canvas); stroke-width: 5px; }
</style>
