<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    tone = 'neutral',
    children,
  }: {
    tone?: 'neutral' | 'accent' | 'success' | 'warning';
    children: Snippet;
  } = $props();
</script>

<span class="dz-badge" data-tone={tone}>{@render children()}</span>

<style>
  .dz-badge {
    display: inline-flex;
    align-items: center;
    width: max-content;
    min-height: 1.25rem;
    padding: 0 var(--dz-space-2);
    border-radius: var(--dz-radius-pill);
    background: var(--dz-surface-subtle);
    color: var(--dz-text-secondary);
    font-size: var(--dz-font-size-1);
    font-weight: var(--dz-weight-semibold);
    line-height: 1;
    white-space: nowrap;
  }

  .dz-badge[data-tone='accent'] { background: var(--dz-accent-soft); color: var(--dz-accent); }
  .dz-badge[data-tone='success'] { background: var(--dz-success-soft); color: var(--dz-success); }
  .dz-badge[data-tone='warning'] { background: var(--dz-warning-soft); color: var(--dz-warning); }
</style>
