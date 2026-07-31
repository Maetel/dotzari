<script lang="ts">
  import type { CanvasNodeModel } from '@dotzari/design-system';
  let { node, parent, onclose, onfocusnode }: { node: CanvasNodeModel; parent?: CanvasNodeModel; onclose?: () => void; onfocusnode?: () => void } = $props();
</script>

<aside class="dz-detail-panel" aria-label={`${node.title} 상세 정보`} data-canvas-no-drag>
  <div class="dz-detail-panel__head">
    <div>
      {#if parent}<p>{parent.title} <span aria-hidden="true">›</span> 하위 개념</p>{/if}
      <h2>{node.title}</h2>
    </div>
    <button type="button" aria-label="상세 정보 닫기" onclick={onclose}>×</button>
  </div>
  <p class="dz-detail-panel__description">{node.description ?? '아직 설명이 없습니다.'}</p>
  {#if node.examples?.length}
    <section>
      <h3>예시</h3>
      <ul>{#each node.examples as example}<li>{example}</li>{/each}</ul>
    </section>
  {/if}
  <button class="dz-detail-panel__focus" type="button" onclick={onfocusnode}>이 개념을 중심으로 보기</button>
</aside>

<style>
  .dz-detail-panel { position: absolute; top: var(--dz-space-4); right: var(--dz-space-4); z-index: var(--dz-layer-popover); width: min(330px, calc(100% - 2rem)); padding: var(--dz-space-5); border: 1px solid var(--dz-border-subtle); border-radius: var(--dz-radius-xl); background: var(--dz-surface-panel); box-shadow: var(--dz-shadow-panel); }
  .dz-detail-panel__head { display: flex; align-items: start; justify-content: space-between; gap: var(--dz-space-3); }
  h2, h3, p { margin: 0; }
  .dz-detail-panel__head p { margin-bottom: var(--dz-space-1); color: var(--dz-text-tertiary); font-size: var(--dz-font-size-1); }
  h2 { font-size: var(--dz-font-size-5); }
  h3 { font-size: var(--dz-font-size-2); }
  .dz-detail-panel__head button { width: 2rem; height: 2rem; border-radius: var(--dz-radius-pill); background: var(--dz-surface-subtle); color: var(--dz-text-secondary); cursor: pointer; font-size: 1.3rem; }
  .dz-detail-panel__description { margin-top: var(--dz-space-4); color: var(--dz-text-secondary); }
  section { margin-top: var(--dz-space-5); padding-top: var(--dz-space-4); border-top: 1px solid var(--dz-border-subtle); }
  ul { margin: var(--dz-space-2) 0 0; padding-left: var(--dz-space-5); color: var(--dz-text-secondary); }
  .dz-detail-panel__focus { width: 100%; margin-top: var(--dz-space-5); padding: .7rem; border-radius: var(--dz-radius-sm); background: var(--dz-accent); color: var(--dz-text-inverse); cursor: pointer; font-weight: var(--dz-weight-semibold); }
</style>
