<script lang="ts">
  let {
    label,
    description,
    onopen,
  }: {
    label: string;
    description?: string;
    onopen?: () => void;
  } = $props();
</script>

<button
  class="dz-child-trigger"
  type="button"
  data-canvas-no-drag
  aria-label={`${label} 상세 보기`}
  onclick={(event) => { event.stopPropagation(); onopen?.(); }}
  onpointerdown={(event) => event.stopPropagation()}
>
  <span class="dz-child-trigger__mark" aria-hidden="true">↳</span>
  <span class="dz-child-trigger__copy">
    <strong>{label}</strong>
    {#if description}<small>{description}</small>{/if}
  </span>
  <span class="dz-child-trigger__action">상세 보기 <span aria-hidden="true">→</span></span>
</button>

<style>
  .dz-child-trigger {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--dz-space-2);
    width: 100%;
    min-height: 2.75rem;
    padding: var(--dz-space-2);
    border: 1px solid var(--dz-border-subtle);
    border-radius: var(--dz-radius-sm);
    background: var(--dz-surface-subtle);
    color: var(--dz-text-primary);
    text-align: left;
    cursor: pointer;
  }

  .dz-child-trigger:hover {
    border-color: var(--dz-border-interactive);
    background: var(--dz-accent-soft);
  }

  .dz-child-trigger__mark {
    display: grid;
    width: 1.5rem;
    height: 1.5rem;
    place-items: center;
    border-radius: var(--dz-radius-xs);
    background: var(--dz-surface-raised);
    color: var(--dz-accent);
  }

  .dz-child-trigger__copy { min-width: 0; }
  .dz-child-trigger__copy strong,
  .dz-child-trigger__copy small { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .dz-child-trigger__copy strong { font-size: var(--dz-font-size-2); }
  .dz-child-trigger__copy small { margin-top: 2px; color: var(--dz-text-secondary); font-size: var(--dz-font-size-1); }
  .dz-child-trigger__action { color: var(--dz-accent); font-size: var(--dz-font-size-1); font-weight: var(--dz-weight-semibold); white-space: nowrap; }
</style>
