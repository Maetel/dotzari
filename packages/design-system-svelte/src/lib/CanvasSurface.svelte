<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import {
    clamp,
    createCanvasInteraction,
    deriveClusterSuggestions,
    keyboardNudge,
    nodeInteractionState,
    pointerDelta,
    type CanvasEdgeModel,
    type CanvasInteractionState,
    type CanvasNodeModel,
    type CanvasTool,
    type Viewport,
  } from '@dotzari/design-system';
  import CanvasControls from './CanvasControls.svelte';
  import CanvasNode from './CanvasNode.svelte';
  import ClusterSuggestion from './ClusterSuggestion.svelte';
  import EdgeLayer from './EdgeLayer.svelte';
  import InteractionStatus from './InteractionStatus.svelte';
  import NodeDetailPanel from './NodeDetailPanel.svelte';

  let {
    nodes,
    edges,
    viewport = { x: 40, y: 40, zoom: 1 },
    tool = 'select',
    clusterBreakpoint = .72,
    onnodeschange,
    onviewportchange,
    onstatechange,
    onclusterreview,
  }: {
    nodes: CanvasNodeModel[];
    edges: CanvasEdgeModel[];
    viewport?: Viewport;
    tool?: CanvasTool;
    clusterBreakpoint?: number;
    onnodeschange?: (nodes: CanvasNodeModel[]) => void;
    onviewportchange?: (viewport: Viewport) => void;
    onstatechange?: (state: CanvasInteractionState) => void;
    onclusterreview?: (clusterId: string) => void;
  } = $props();

  const interaction = createCanvasInteraction({
    viewport: untrack(() => ({ ...viewport })),
    tool: untrack(() => tool),
  });
  let canvasState: CanvasInteractionState = $state(interaction.getState());
  let localNodes = $state<CanvasNodeModel[]>(untrack(() => nodes.map((node) => ({ ...node }))));
  let surface: HTMLDivElement;

  let detailNode = $derived(localNodes.find((node) => node.id === canvasState.detailNodeId));
  let detailParent = $derived(detailNode?.parentId ? localNodes.find((node) => node.id === detailNode?.parentId) : undefined);
  let clusters = $derived(deriveClusterSuggestions(localNodes, edges));
  let showingClusters = $derived(canvasState.viewport.zoom <= clusterBreakpoint);
  let dragNodes = $derived(localNodes.map((node) => {
    if (canvasState.mode !== 'dragging-node' || !canvasState.selectedNodeIds.includes(node.id)) return node;
    const delta = pointerDelta(canvasState);
    return { ...node, x: node.x + delta.x, y: node.y + delta.y };
  }));

  onMount(() => interaction.subscribe((next) => {
    canvasState = next;
    onstatechange?.(next);
    onviewportchange?.(next.viewport);
  }));

  function point(event: PointerEvent | WheelEvent) {
    const bounds = surface.getBoundingClientRect();
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  }

  function dispatch(event: Parameters<typeof interaction.dispatch>[0]) {
    interaction.dispatch(event);
  }

  function pointerStart(event: PointerEvent, node: CanvasNodeModel) {
    if (node.disabled || (event.target as Element).closest('[data-canvas-no-drag]')) return;
    event.stopPropagation();
    surface.setPointerCapture(event.pointerId);
    if (canvasState.tool === 'pan') dispatch({ type: 'canvas.pan.start', pointerId: event.pointerId, point: point(event) });
    else dispatch({ type: 'node.drag.start', nodeId: node.id, pointerId: event.pointerId, point: point(event), additive: event.shiftKey });
  }

  function backgroundStart(event: PointerEvent) {
    if ((event.target as Element).closest('[data-canvas-no-drag]')) return;
    surface.focus();
    surface.setPointerCapture(event.pointerId);
    if (canvasState.tool === 'pan' || event.button === 1) dispatch({ type: 'canvas.pan.start', pointerId: event.pointerId, point: point(event) });
    else dispatch({ type: 'selection.clear' });
  }

  function pointerEnd(event: PointerEvent) {
    if (canvasState.pointerSession?.kind === 'node') {
      const delta = pointerDelta(canvasState);
      const selected = new Set(canvasState.selectedNodeIds);
      if (delta.x || delta.y) {
        localNodes = localNodes.map((node) => selected.has(node.id) ? { ...node, x: node.x + delta.x, y: node.y + delta.y } : node);
        onnodeschange?.(localNodes);
      }
    }
    dispatch({ type: 'pointer.end', pointerId: event.pointerId });
    if (surface.hasPointerCapture(event.pointerId)) surface.releasePointerCapture(event.pointerId);
  }

  function zoomTo(next: number, at = { x: surface.clientWidth / 2, y: surface.clientHeight / 2 }) {
    dispatch({ type: 'viewport.zoom', point: at, zoom: clamp(next, .5, 1.6) });
  }

  function focusNode(node: CanvasNodeModel) {
    const zoom = 1.1;
    dispatch({
      type: 'viewport.set',
      viewport: {
        x: surface.clientWidth / 2 - (node.x + node.width / 2) * zoom,
        y: surface.clientHeight / 2 - (node.y + node.height / 2) * zoom,
        zoom,
      },
    });
    dispatch({ type: 'node.select', nodeId: node.id });
    dispatch({ type: 'detail.close' });
  }

  function keydown(event: KeyboardEvent) {
    if (event.key === 'Escape') { dispatch({ type: 'escape' }); return; }
    if (event.key === '+' || event.key === '=') { event.preventDefault(); zoomTo(canvasState.viewport.zoom + .1); return; }
    if (event.key === '-') { event.preventDefault(); zoomTo(canvasState.viewport.zoom - .1); return; }
    const delta = keyboardNudge(event.key, event.shiftKey);
    if (!delta || !canvasState.selectedNodeIds.length) return;
    event.preventDefault();
    const selected = new Set(canvasState.selectedNodeIds);
    localNodes = localNodes.map((node) => selected.has(node.id) ? { ...node, x: node.x + delta.x, y: node.y + delta.y } : node);
    onnodeschange?.(localNodes);
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  bind:this={surface}
  class="dz-canvas-surface"
  class:panning={canvasState.mode === 'panning-canvas'}
  data-mode={canvasState.mode}
  data-tool={canvasState.tool}
  data-clustered={showingClusters}
  role="application"
  aria-label="개념 캔버스. 화살표 키로 선택한 노드를 옮기고, 더하기와 빼기 키로 확대하거나 축소할 수 있습니다."
  tabindex="0"
  onpointerdown={backgroundStart}
  onpointermove={(event) => dispatch({ type: 'pointer.move', pointerId: event.pointerId, point: point(event) })}
  onpointerup={pointerEnd}
  onpointercancel={(event) => dispatch({ type: 'pointer.cancel', pointerId: event.pointerId })}
  onwheel={(event) => { event.preventDefault(); zoomTo(canvasState.viewport.zoom * Math.exp(-event.deltaY * .001), point(event)); }}
  onkeydown={keydown}
>
  <div class="dz-canvas-surface__world" style={`transform:translate3d(${canvasState.viewport.x}px,${canvasState.viewport.y}px,0) scale(${canvasState.viewport.zoom})`}>
    {#if showingClusters}
      {#each clusters as cluster (cluster.id)}
        <ClusterSuggestion
          {cluster}
          onopen={() => { dispatch({ type: 'cluster.review', clusterId: null }); zoomTo(.92); }}
          onreview={() => { dispatch({ type: 'cluster.review', clusterId: cluster.id }); onclusterreview?.(cluster.id); }}
        />
      {/each}
    {:else}
      <EdgeLayer nodes={dragNodes} {edges} />
      <div role="listbox" aria-label="개념 노드">
        {#each dragNodes.filter((node) => !node.parentId) as node (node.id)}
          <CanvasNode
            {node}
            children={localNodes.filter((child) => child.parentId === node.id)}
            interactionState={nodeInteractionState(canvasState, node.id, node.disabled)}
            onpointerstart={pointerStart}
            onhovernode={(nodeId) => dispatch({ type: 'node.hover', nodeId })}
            onfocusnode={(nodeId) => dispatch({ type: 'node.focus', nodeId })}
            onopenchild={(nodeId) => dispatch({ type: 'detail.open', nodeId })}
          />
        {/each}
      </div>
    {/if}
  </div>

  <InteractionStatus state={canvasState} />
  <CanvasControls
    tool={canvasState.tool}
    zoom={canvasState.viewport.zoom}
    ontoolchange={(next) => dispatch({ type: 'tool.set', tool: next })}
    onzoomchange={(next) => zoomTo(next)}
    onreset={() => dispatch({ type: 'viewport.set', viewport: { x: 40, y: 40, zoom: 1 } })}
  />
  {#if detailNode}
    <NodeDetailPanel
      node={detailNode}
      parent={detailParent}
      onclose={() => dispatch({ type: 'detail.close' })}
      onfocusnode={() => focusNode(detailParent ?? detailNode)}
    />
  {/if}
</div>

<style>
  .dz-canvas-surface { position: relative; width: 100%; height: 100%; min-height: 420px; overflow: hidden; border: 1px solid var(--dz-border-subtle); border-radius: var(--dz-radius-xl); background-color: var(--dz-surface-canvas); background-image: radial-gradient(circle, var(--dz-grid-dot) 1.1px, transparent 1.1px); background-size: 22px 22px; outline: none; touch-action: none; cursor: default; }
  .dz-canvas-surface[data-tool='pan'] { cursor: grab; }
  .dz-canvas-surface.panning { cursor: grabbing; }
  .dz-canvas-surface:focus-visible { box-shadow: inset var(--dz-focus-ring); }
  .dz-canvas-surface__world { position: absolute; inset: 0; width: 1800px; height: 1100px; transform-origin: 0 0; will-change: transform; }
  @media (max-width: 620px) { .dz-canvas-surface { min-height: 560px; border-radius: var(--dz-radius-lg); } }
</style>
