<script lang="ts">
  import type { CanvasInteractionState } from '@dotzari/design-system';
  let { state }: { state: CanvasInteractionState } = $props();
  const labels = { idle: '준비됨', 'hovering-node': '노드 살펴보는 중', 'dragging-node': '노드 이동 중', 'panning-canvas': '캔버스 이동 중', connecting: '연결 중', 'reviewing-cluster': '묶음 검토 중' } as const;
</script>

<output class="dz-interaction-status" aria-live="polite" data-mode={state.mode}>
  <span aria-hidden="true"></span>{labels[state.mode]}
  {#if state.selectedNodeIds.length} · {state.selectedNodeIds.length}개 선택{/if}
</output>

<style>
  .dz-interaction-status { position: absolute; top: var(--dz-space-4); left: var(--dz-space-4); z-index: var(--dz-layer-overlay); display: inline-flex; align-items: center; gap: var(--dz-space-2); padding: .4rem .62rem; border: 1px solid var(--dz-border-subtle); border-radius: var(--dz-radius-pill); background: color-mix(in srgb, var(--dz-surface-panel) 88%, transparent); color: var(--dz-text-secondary); font-size: var(--dz-font-size-1); backdrop-filter: blur(10px); }
  .dz-interaction-status span { width: .45rem; height: .45rem; border-radius: 50%; background: var(--dz-success); }
  .dz-interaction-status[data-mode='dragging-node'] span, .dz-interaction-status[data-mode='panning-canvas'] span { background: var(--dz-warning); }
</style>
