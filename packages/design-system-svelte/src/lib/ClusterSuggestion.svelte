<script lang="ts">
  import type { ClusterSuggestion } from '@dotzari/design-system';
  let { cluster, onreview, onopen }: { cluster: ClusterSuggestion; onreview?: () => void; onopen?: () => void } = $props();
</script>

<article class="dz-cluster" data-canvas-no-drag style={`--cluster-x:${cluster.center.x - 105}px;--cluster-y:${cluster.center.y - 66}px`} data-cluster-id={cluster.id}>
  <span class="dz-cluster__eyebrow">자동으로 묶었어요</span>
  <h3>{cluster.name}</h3>
  <p>{cluster.memberIds.length}개 항목 · {cluster.reason}</p>
  <div>
    <button type="button" onclick={onopen}>펼쳐 보기</button>
    <button type="button" class="quiet" onclick={onreview}>이름·구성 검토</button>
  </div>
</article>

<style>
  .dz-cluster { position: absolute; z-index: var(--dz-layer-node); width: 210px; min-height: 132px; padding: var(--dz-space-4); border: 1px solid var(--dz-border-interactive); border-radius: var(--dz-radius-xl); background: color-mix(in srgb, var(--dz-surface-raised) 92%, var(--dz-accent-soft)); box-shadow: var(--dz-shadow-node); transform: translate3d(var(--cluster-x), var(--cluster-y), 0); }
  .dz-cluster__eyebrow { display: block; color: var(--dz-accent); font-size: var(--dz-font-size-1); font-weight: var(--dz-weight-semibold); }
  h3 { margin: var(--dz-space-2) 0 0; font-size: var(--dz-font-size-4); }
  p { margin: var(--dz-space-1) 0 var(--dz-space-3); color: var(--dz-text-secondary); font-size: var(--dz-font-size-1); }
  div { display: flex; flex-wrap: wrap; gap: var(--dz-space-2); }
  button { padding: .42rem .55rem; border-radius: var(--dz-radius-sm); background: var(--dz-accent); color: var(--dz-text-inverse); cursor: pointer; font-size: var(--dz-font-size-1); font-weight: var(--dz-weight-semibold); }
  button.quiet { background: var(--dz-surface-subtle); color: var(--dz-text-secondary); }
</style>
