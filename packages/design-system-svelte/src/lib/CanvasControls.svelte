<script lang="ts">
  import type { CanvasTool } from '@dotzari/design-system';
  let { tool, zoom, ontoolchange, onzoomchange, onreset }: { tool: CanvasTool; zoom: number; ontoolchange?: (tool: CanvasTool) => void; onzoomchange?: (zoom: number) => void; onreset?: () => void } = $props();
</script>

<div class="dz-canvas-controls" data-canvas-no-drag>
  <div class="dz-canvas-controls__tools" role="group" aria-label="캔버스 도구">
    <button type="button" aria-pressed={tool === 'select'} data-active={tool === 'select'} onclick={() => ontoolchange?.('select')}>↖ <span>선택</span></button>
    <button type="button" aria-pressed={tool === 'pan'} data-active={tool === 'pan'} onclick={() => ontoolchange?.('pan')}>✋ <span>이동</span></button>
  </div>
  <div class="dz-canvas-controls__zoom" role="group" aria-label="확대와 축소">
    <button type="button" aria-label="축소" onclick={() => onzoomchange?.(zoom - .1)}>−</button>
    <button type="button" class="value" aria-label="배율 초기화" onclick={onreset}>{Math.round(zoom * 100)}%</button>
    <button type="button" aria-label="확대" onclick={() => onzoomchange?.(zoom + .1)}>＋</button>
  </div>
</div>

<style>
  .dz-canvas-controls { position: absolute; left: var(--dz-space-4); bottom: var(--dz-space-4); z-index: var(--dz-layer-overlay); display: flex; gap: var(--dz-space-2); }
  .dz-canvas-controls > div { display: flex; gap: 2px; padding: 3px; border: 1px solid var(--dz-border-subtle); border-radius: var(--dz-radius-md); background: var(--dz-surface-panel); box-shadow: var(--dz-shadow-node); }
  button { height: 2rem; min-width: 2rem; padding: 0 var(--dz-space-2); border-radius: calc(var(--dz-radius-md) - 3px); background: transparent; color: var(--dz-text-secondary); cursor: pointer; font-size: var(--dz-font-size-2); font-weight: var(--dz-weight-semibold); }
  button:hover, button[data-active='true'] { background: var(--dz-accent-soft); color: var(--dz-accent); }
  button.value { min-width: 3.5rem; color: var(--dz-text-primary); }
  @media (max-width: 620px) { .dz-canvas-controls { right: var(--dz-space-3); bottom: var(--dz-space-3); left: var(--dz-space-3); justify-content: space-between; } .dz-canvas-controls span { display: none; } }
</style>
