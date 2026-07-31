<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    title,
    description,
    count,
    raised = false,
    actions,
    children,
  }: {
    title: string;
    description?: string;
    count?: string;
    raised?: boolean;
    actions?: Snippet;
    children: Snippet;
  } = $props();
</script>

<section class="dz-panel" data-raised={raised}>
  <header>
    <div>
      <h2>{title}</h2>
      {#if description}<p>{description}</p>{/if}
    </div>
    {#if count}<span>{count}</span>{/if}
    {#if actions}<div class="actions">{@render actions()}</div>{/if}
  </header>
  <div class="body">{@render children()}</div>
</section>

<style>
  .dz-panel {
    min-width: 0;
    overflow: hidden;
    border: 1px solid var(--dz-border-subtle);
    border-radius: var(--dz-radius-lg);
    background: var(--dz-surface-panel);
  }
  .dz-panel[data-raised='true'] { box-shadow: var(--dz-shadow-panel); }
  header { display: flex; align-items: flex-start; gap: var(--dz-space-3); padding: var(--dz-space-4); border-bottom: 1px solid var(--dz-border-subtle); }
  header > div:first-child { min-width: 0; flex: 1; }
  h2 { margin: 0; font-size: var(--dz-font-size-3); line-height: var(--dz-line-tight); }
  p { margin: var(--dz-space-1) 0 0; color: var(--dz-text-secondary); font-size: var(--dz-font-size-1); }
  header > span { padding: 3px 7px; border-radius: var(--dz-radius-pill); background: var(--dz-surface-subtle); color: var(--dz-text-secondary); font-size: var(--dz-font-size-1); font-weight: var(--dz-weight-semibold); }
  .actions { display: flex; gap: var(--dz-space-1); }
  .body { padding: var(--dz-space-4); }
</style>
