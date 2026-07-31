<script lang="ts">
  import type { CanvasNodeModel, NodeInteractionState } from '@dotzari/design-system';
  import ChildNodeTrigger from './ChildNodeTrigger.svelte';

  let {
    node,
    children = [],
    interactionState = 'idle',
    onpointerstart,
    onfocusnode,
    onhovernode,
    onopenchild,
  }: {
    node: CanvasNodeModel;
    children?: CanvasNodeModel[];
    interactionState?: NodeInteractionState;
    onpointerstart?: (event: PointerEvent, node: CanvasNodeModel) => void;
    onfocusnode?: (nodeId: string | null) => void;
    onhovernode?: (nodeId: string | null) => void;
    onopenchild?: (nodeId: string) => void;
  } = $props();
</script>

<div
  class="dz-canvas-node"
  data-node-id={node.id}
  data-kind={node.kind ?? 'concept'}
  data-state={interactionState}
  aria-label={`${node.title} 노드`}
  aria-selected={interactionState === 'selected' || interactionState === 'dragging'}
  role="option"
  tabindex={node.disabled ? -1 : 0}
  style={`--node-x:${node.x}px;--node-y:${node.y}px;--node-width:${node.width}px;--node-height:${node.height}px`}
  onpointerdown={(event) => onpointerstart?.(event, node)}
  onpointerenter={() => onhovernode?.(node.id)}
  onpointerleave={() => onhovernode?.(null)}
  onfocus={() => onfocusnode?.(node.id)}
  onblur={() => onfocusnode?.(null)}
>
  <header>
    <span class="dz-canvas-node__kind" aria-hidden="true">
      {node.kind === 'code' ? '</>' : node.kind === 'media' ? '▶' : node.kind === 'data' ? '▦' : '◇'}
    </span>
    <div>
      {#if node.eyebrow}<p class="dz-canvas-node__eyebrow">{node.eyebrow}</p>{/if}
      <h3>{node.title}</h3>
    </div>
    <span class="dz-canvas-node__handle" aria-label="드래그해서 이동">⠿</span>
  </header>

  {#if node.description}<p class="dz-canvas-node__description">{node.description}</p>{/if}

  {#if node.kind === 'code'}
    <pre><code>{String(node.metadata?.code ?? 'const app = createServer();')}</code></pre>
  {/if}

  {#if children.length}
    <div class="dz-canvas-node__children" aria-label="하위 개념">
      <p>{children.length}개의 하위 개념</p>
      {#each children as child (child.id)}
        <ChildNodeTrigger label={child.title} description={child.description} onopen={() => onopenchild?.(child.id)} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .dz-canvas-node {
    position: absolute;
    z-index: var(--dz-layer-node);
    width: var(--node-width);
    height: var(--node-height);
    padding: var(--dz-space-4);
    border: 1px solid var(--dz-border-subtle);
    border-radius: var(--dz-radius-lg);
    background: var(--dz-surface-raised);
    box-shadow: var(--dz-shadow-node);
    transform: translate3d(var(--node-x), var(--node-y), 0);
    transform-origin: 0 0;
    cursor: grab;
    user-select: none;
    transition: border-color var(--dz-duration-fast), box-shadow var(--dz-duration-fast), opacity var(--dz-duration-fast);
  }

  .dz-canvas-node[data-state='hovered'],
  .dz-canvas-node[data-state='focused'] { border-color: var(--dz-border-interactive); }
  .dz-canvas-node[data-state='selected'] { border-color: var(--dz-accent); box-shadow: var(--dz-focus-ring), var(--dz-shadow-node); }
  .dz-canvas-node[data-state='dragging'] { z-index: var(--dz-layer-selection); border-color: var(--dz-accent); box-shadow: var(--dz-shadow-dragging); cursor: grabbing; }
  .dz-canvas-node[data-state='disabled'] { opacity: .46; cursor: not-allowed; }

  header { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: start; gap: var(--dz-space-2); }
  h3, p { margin: 0; }
  h3 { font-size: var(--dz-font-size-4); line-height: var(--dz-line-tight); }
  .dz-canvas-node__kind { display: grid; width: 1.75rem; height: 1.75rem; place-items: center; border-radius: var(--dz-radius-sm); background: var(--dz-accent-soft); color: var(--dz-accent); font-weight: var(--dz-weight-bold); }
  .dz-canvas-node__eyebrow { margin-bottom: 3px; color: var(--dz-text-tertiary); font-size: var(--dz-font-size-1); font-weight: var(--dz-weight-semibold); letter-spacing: .06em; text-transform: uppercase; }
  .dz-canvas-node__handle { color: var(--dz-text-tertiary); font-size: 1.1rem; line-height: 1; }
  .dz-canvas-node__description { margin-top: var(--dz-space-3); color: var(--dz-text-secondary); font-size: var(--dz-font-size-2); }
  pre { margin: var(--dz-space-3) 0 0; padding: var(--dz-space-3); overflow: hidden; border-radius: var(--dz-radius-sm); background: var(--dz-surface-code); color: #dce9f8; font: var(--dz-font-size-1)/1.55 var(--dz-font-mono); }
  .dz-canvas-node__children { display: grid; gap: var(--dz-space-2); margin-top: var(--dz-space-4); }
  .dz-canvas-node__children > p { color: var(--dz-text-tertiary); font-size: var(--dz-font-size-1); font-weight: var(--dz-weight-semibold); }
</style>
