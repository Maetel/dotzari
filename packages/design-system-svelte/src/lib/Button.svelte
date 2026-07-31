<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  type Props = HTMLButtonAttributes & {
    variant?: 'primary' | 'secondary' | 'quiet' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: Snippet;
  };

  let {
    variant = 'secondary',
    size = 'md',
    children,
    class: className = '',
    ...rest
  }: Props = $props();
</script>

<button class={`dz-button ${className}`} data-variant={variant} data-size={size} {...rest}>
  {@render children()}
</button>

<style>
  .dz-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--dz-space-2);
    min-width: 0;
    border: 1px solid transparent;
    border-radius: var(--dz-radius-sm);
    font-weight: var(--dz-weight-semibold);
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    transition: background var(--dz-duration-fast) var(--dz-ease-standard), border-color var(--dz-duration-fast) var(--dz-ease-standard), color var(--dz-duration-fast) var(--dz-ease-standard), transform var(--dz-duration-fast) var(--dz-ease-standard);
  }

  .dz-button[data-size='sm'] { height: var(--dz-control-height-sm); padding: 0 var(--dz-space-2); font-size: var(--dz-font-size-1); }
  .dz-button[data-size='md'] { height: var(--dz-control-height-md); padding: 0 var(--dz-space-3); font-size: var(--dz-font-size-2); }
  .dz-button[data-size='lg'] { height: var(--dz-control-height-lg); padding: 0 var(--dz-space-4); font-size: var(--dz-font-size-3); }

  .dz-button[data-variant='primary'] { background: var(--dz-accent); color: var(--dz-text-inverse); }
  .dz-button[data-variant='primary']:hover:not(:disabled) { background: var(--dz-accent-hover); }
  .dz-button[data-variant='secondary'] { border-color: var(--dz-border-subtle); background: var(--dz-surface-raised); color: var(--dz-text-primary); }
  .dz-button[data-variant='secondary']:hover:not(:disabled) { border-color: var(--dz-border-interactive); background: var(--dz-accent-soft); }
  .dz-button[data-variant='quiet'] { background: transparent; color: var(--dz-text-secondary); }
  .dz-button[data-variant='quiet']:hover:not(:disabled) { background: var(--dz-surface-subtle); color: var(--dz-text-primary); }
  .dz-button[data-variant='danger'] { background: var(--dz-danger); color: var(--dz-text-inverse); }

  .dz-button:active:not(:disabled) { transform: translateY(1px); }
  .dz-button:focus-visible { outline: none; box-shadow: var(--dz-focus-ring); }
  .dz-button:disabled { opacity: 0.45; cursor: not-allowed; }
</style>
