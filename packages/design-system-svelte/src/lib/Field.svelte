<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  type Props = HTMLInputAttributes & {
    label: string;
    hint?: string;
    error?: string;
  };

  let {
    label,
    hint,
    error,
    id = `dz-field-${Math.random().toString(36).slice(2)}`,
    class: className = '',
    ...rest
  }: Props = $props();
</script>

<label class={`dz-field ${className}`} for={id} data-error={Boolean(error)}>
  <span>{label}</span>
  <input {id} aria-describedby={hint || error ? `${id}-message` : undefined} aria-invalid={Boolean(error)} {...rest} />
  {#if error || hint}
    <small id={`${id}-message`}>{error ?? hint}</small>
  {/if}
</label>

<style>
  .dz-field { display: grid; gap: var(--dz-space-1); color: var(--dz-text-primary); }
  .dz-field > span { font-size: var(--dz-font-size-1); font-weight: var(--dz-weight-semibold); }
  input {
    width: 100%;
    height: var(--dz-control-height-md);
    padding: 0 var(--dz-space-3);
    border: 1px solid var(--dz-border-subtle);
    border-radius: var(--dz-radius-sm);
    outline: none;
    background: var(--dz-surface-raised);
    color: var(--dz-text-primary);
    font-size: var(--dz-font-size-2);
  }
  input:hover { border-color: var(--dz-border-strong); }
  input:focus { border-color: var(--dz-border-interactive); box-shadow: var(--dz-focus-ring); }
  small { color: var(--dz-text-secondary); font-size: var(--dz-font-size-1); }
  .dz-field[data-error='true'] input { border-color: var(--dz-danger); }
  .dz-field[data-error='true'] small { color: var(--dz-danger); }
</style>
