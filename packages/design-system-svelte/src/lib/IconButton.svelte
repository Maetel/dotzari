<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  type Props = Omit<HTMLButtonAttributes, 'aria-label'> & {
    label: string;
    pressed?: boolean;
    size?: 'sm' | 'md' | 'lg';
    children: Snippet;
  };

  let {
    label,
    pressed = false,
    size = 'md',
    children,
    class: className = '',
    ...rest
  }: Props = $props();
</script>

<button
  class={`dz-icon-button ${className}`}
  data-size={size}
  data-pressed={pressed}
  aria-label={label}
  aria-pressed={pressed}
  title={label}
  {...rest}
>
  {@render children()}
</button>

<style>
  .dz-icon-button {
    display: inline-grid;
    place-items: center;
    flex: 0 0 auto;
    border: 1px solid var(--dz-border-subtle);
    border-radius: var(--dz-radius-sm);
    background: var(--dz-surface-raised);
    color: var(--dz-text-secondary);
    cursor: pointer;
    transition: background var(--dz-duration-fast) var(--dz-ease-standard), color var(--dz-duration-fast) var(--dz-ease-standard), border-color var(--dz-duration-fast) var(--dz-ease-standard);
  }

  .dz-icon-button[data-size='sm'] { width: var(--dz-control-height-sm); height: var(--dz-control-height-sm); font-size: var(--dz-font-size-1); }
  .dz-icon-button[data-size='md'] { width: var(--dz-control-height-md); height: var(--dz-control-height-md); font-size: var(--dz-font-size-2); }
  .dz-icon-button[data-size='lg'] { width: var(--dz-control-height-lg); height: var(--dz-control-height-lg); font-size: var(--dz-font-size-3); }
  .dz-icon-button:hover:not(:disabled), .dz-icon-button[data-pressed='true'] { border-color: var(--dz-border-interactive); background: var(--dz-accent-soft); color: var(--dz-accent); }
  .dz-icon-button:focus-visible { outline: none; box-shadow: var(--dz-focus-ring); }
  .dz-icon-button:disabled { opacity: 0.45; cursor: not-allowed; }
</style>
