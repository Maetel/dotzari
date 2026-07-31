<script lang="ts">
  export interface SegmentItem {
    value: string;
    label: string;
  }

  let {
    label,
    items,
    value,
    onchange,
  }: {
    label: string;
    items: SegmentItem[];
    value: string;
    onchange?: (value: string) => void;
  } = $props();
</script>

<div class="dz-segmented" role="group" aria-label={label}>
  {#each items as item (item.value)}
    <button
      type="button"
      data-selected={item.value === value}
      aria-pressed={item.value === value}
      onclick={() => onchange?.(item.value)}
    >
      {item.label}
    </button>
  {/each}
</div>

<style>
  .dz-segmented {
    display: inline-flex;
    gap: 2px;
    padding: 3px;
    border: 1px solid var(--dz-border-subtle);
    border-radius: var(--dz-radius-md);
    background: var(--dz-surface-subtle);
  }

  button {
    height: 1.75rem;
    padding: 0 var(--dz-space-3);
    border-radius: calc(var(--dz-radius-md) - 3px);
    background: transparent;
    color: var(--dz-text-secondary);
    cursor: pointer;
    font-size: var(--dz-font-size-1);
    font-weight: var(--dz-weight-semibold);
  }

  button:hover, button[data-selected='true'] {
    background: var(--dz-surface-raised);
    color: var(--dz-text-primary);
    box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
  }

  button:focus-visible { outline: none; box-shadow: var(--dz-focus-ring); }
</style>
