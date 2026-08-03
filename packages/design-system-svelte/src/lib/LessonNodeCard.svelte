<script lang="ts">
  import type { LessonNode } from '@dotzari/design-system';

  let {
    node,
    active = false,
    selected = false,
    onselect,
    onopencontent,
  }: {
    node: LessonNode;
    active?: boolean;
    selected?: boolean;
    onselect?: (nodeId: string) => void;
    onopencontent?: (nodeId: string) => void;
  } = $props();
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<article
  class="dz-lesson-node"
  class:active
  class:selected
  style={`--lesson-node-accent:${node.accent ?? 'var(--dz-accent)'}`}
  data-lesson-interactive
  tabindex="0"
  role="button"
  aria-label={`${node.title} 노드`}
  onclick={() => onselect?.(node.id)}
  onkeydown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onselect?.(node.id); } }}
>
  <header>
    <span aria-hidden="true"></span>
    <div>{#if node.eyebrow}<small>{node.eyebrow}</small>{/if}<strong>{node.title}</strong></div>
  </header>

  {#if node.description}<p class="dz-lesson-node__description">{node.description}</p>{/if}

  {#if node.content.type === 'summary'}
    <p class="dz-lesson-node__body">{node.content.body}</p>
  {:else if node.content.type === 'metric'}
    <div class="dz-lesson-node__metric"><b>{node.content.value}</b><span>{node.content.label}</span></div>
    {#if node.content.body}<p class="dz-lesson-node__body">{node.content.body}</p>{/if}
  {:else if node.content.type === 'accordion'}
    <details data-lesson-interactive>
      <summary>{node.content.summary}</summary>
      <p>{node.content.body}</p>
      {#if node.content.detail}<small>{node.content.detail}</small>{/if}
    </details>
  {:else if node.content.type === 'visual'}
    <div class="dz-lesson-node__visual"><span>{node.content.label}</span></div>
    {#if node.content.description}<p class="dz-lesson-node__body">{node.content.description}</p>{/if}
  {:else if node.content.type === 'routes'}
    <dl class="dz-lesson-node__routes">{#each node.content.items as item}<div><dt>{item.label}</dt><dd>{item.value}</dd></div>{/each}</dl>
  {:else if node.content.type === 'checklist'}
    <ul class="dz-lesson-node__checklist">{#each node.content.items as item}<li>{item}</li>{/each}</ul>
  {:else if node.content.type === 'table'}
    <table><thead><tr><th>{node.content.columns[0]}</th><th>{node.content.columns[1]}</th></tr></thead><tbody>{#each node.content.rows as row}<tr><td>{row[0]}</td><td>{row[1]}</td></tr>{/each}</tbody></table>
  {:else if node.content.type === 'quote'}
    <blockquote>“{node.content.quote}”{#if node.content.attribution}<cite>{node.content.attribution}</cite>{/if}</blockquote>
  {:else if node.content.type === 'code'}
    <div class="dz-lesson-node__code" data-lesson-interactive>
      <header><strong>{node.content.filename}</strong><small>{node.content.code.split('\n').length}줄</small></header>
      <pre><code>{node.content.code}</code></pre>
      <footer><span>{node.content.language}</span>{#if onopencontent}<button type="button" onclick={() => onopencontent?.(node.id)}>크게 보기</button>{/if}</footer>
    </div>
  {/if}
</article>

<style>
  .dz-lesson-node { position: relative; width: 100%; padding: var(--dz-space-4); border: 1px solid color-mix(in srgb, var(--lesson-node-accent) 55%, var(--dz-border-subtle)); border-radius: var(--dz-radius-lg); background: var(--dz-surface-raised); box-shadow: var(--dz-shadow-node); color: var(--dz-text-primary); cursor: pointer; overflow-wrap: anywhere; }
  .dz-lesson-node::before { content: ''; position: absolute; top: var(--dz-space-3); left: var(--dz-space-2); width: 5px; height: 5px; border-radius: 50%; background: var(--lesson-node-accent); }
  .dz-lesson-node.active { background: color-mix(in srgb, var(--lesson-node-accent) 10%, var(--dz-surface-raised)); box-shadow: 0 0 0 2px color-mix(in srgb, var(--lesson-node-accent) 20%, transparent), var(--dz-shadow-node); }
  .dz-lesson-node.selected { outline: 2px solid var(--lesson-node-accent); outline-offset: 2px; }
  .dz-lesson-node > header { display: grid; grid-template-columns: 5px minmax(0,1fr); gap: var(--dz-space-2); }
  .dz-lesson-node > header small, .dz-lesson-node > header strong { display: block; }
  .dz-lesson-node > header small { margin-bottom: 2px; color: var(--dz-text-tertiary); font-size: var(--dz-font-size-1); font-weight: var(--dz-weight-semibold); }
  .dz-lesson-node > header strong { font-size: var(--dz-font-size-4); line-height: var(--dz-line-tight); }
  .dz-lesson-node__description, .dz-lesson-node__body { margin: var(--dz-space-3) 0 0; color: var(--dz-text-secondary); font-size: var(--dz-font-size-2); line-height: var(--dz-line-normal); }
  .dz-lesson-node__metric { display: flex; align-items: baseline; gap: var(--dz-space-2); margin-top: var(--dz-space-3); padding-top: var(--dz-space-2); border-top: 1px solid var(--dz-border-subtle); }
  .dz-lesson-node__metric b { color: var(--lesson-node-accent); font-size: var(--dz-font-size-6); line-height: 1; }.dz-lesson-node__metric span { color: var(--dz-text-secondary); font-size: var(--dz-font-size-1); }
  details { margin-top: var(--dz-space-3); border-top: 1px solid var(--dz-border-subtle); }
  summary { padding-top: var(--dz-space-3); color: var(--lesson-node-accent); cursor: pointer; font-size: var(--dz-font-size-2); font-weight: var(--dz-weight-semibold); }
  details p, details small { display: block; margin: var(--dz-space-2) 0 0; color: var(--dz-text-secondary); font-size: var(--dz-font-size-2); line-height: var(--dz-line-normal); }
  .dz-lesson-node__visual { position: relative; height: 76px; margin-top: var(--dz-space-3); overflow: hidden; border-radius: var(--dz-radius-md); background: linear-gradient(135deg, color-mix(in srgb, var(--lesson-node-accent) 22%, var(--dz-surface-subtle)), var(--dz-surface-subtle)); }
  .dz-lesson-node__visual::before, .dz-lesson-node__visual::after { content: ''; position: absolute; border-radius: 50%; background: color-mix(in srgb, var(--lesson-node-accent) 38%, transparent); }.dz-lesson-node__visual::before { width: 74px; height: 74px; top: 20px; left: 24px; }.dz-lesson-node__visual::after { width: 100px; height: 100px; top: -58px; right: -10px; }
  .dz-lesson-node__visual span { position: absolute; bottom: var(--dz-space-2); left: var(--dz-space-3); z-index: 1; font-size: var(--dz-font-size-1); font-weight: var(--dz-weight-semibold); }
  .dz-lesson-node__routes { display: grid; gap: var(--dz-space-1); margin: var(--dz-space-3) 0 0; }.dz-lesson-node__routes div { display: flex; justify-content: space-between; gap: var(--dz-space-2); }.dz-lesson-node__routes dt, .dz-lesson-node__routes dd { margin: 0; font-size: var(--dz-font-size-1); }.dz-lesson-node__routes dt { color: var(--dz-text-secondary); }.dz-lesson-node__routes dd { color: var(--lesson-node-accent); font-weight: var(--dz-weight-semibold); }
  .dz-lesson-node__checklist { display: grid; gap: var(--dz-space-2); margin: var(--dz-space-3) 0 0; padding: 0; list-style: none; }.dz-lesson-node__checklist li { position: relative; padding-left: 1.2rem; color: var(--dz-text-secondary); font-size: var(--dz-font-size-2); }.dz-lesson-node__checklist li::before { content: '✓'; position: absolute; left: 0; color: var(--lesson-node-accent); font-weight: var(--dz-weight-bold); }
  table { width: 100%; margin-top: var(--dz-space-3); overflow: hidden; border: 1px solid var(--dz-border-subtle); border-collapse: separate; border-spacing: 0; border-radius: var(--dz-radius-sm); font-size: var(--dz-font-size-1); } th, td { padding: var(--dz-space-2); border-bottom: 1px solid var(--dz-border-subtle); text-align: left; } th { color: var(--dz-text-tertiary); } th:last-child, td:last-child { text-align: right; } tr:last-child td { border-bottom: 0; }
  blockquote { margin: var(--dz-space-3) 0 0; padding: var(--dz-space-3); border-left: 3px solid var(--lesson-node-accent); background: var(--dz-surface-subtle); font-size: var(--dz-font-size-2); font-weight: var(--dz-weight-semibold); } cite { display: block; margin-top: var(--dz-space-2); color: var(--dz-text-tertiary); font-size: var(--dz-font-size-1); font-style: normal; font-weight: var(--dz-weight-medium); }
  .dz-lesson-node__code { margin-top: var(--dz-space-3); overflow: hidden; border: 1px solid var(--dz-border-subtle); border-radius: var(--dz-radius-md); background: var(--dz-surface-code); color: var(--dz-text-code); }
  .dz-lesson-node__code header, .dz-lesson-node__code footer { display: flex; align-items: center; justify-content: space-between; gap: var(--dz-space-2); padding: var(--dz-space-2) var(--dz-space-3); background: var(--dz-surface-code-bar); font: var(--dz-font-size-1)/1.2 var(--dz-font-mono); }.dz-lesson-node__code header small, .dz-lesson-node__code footer { color: var(--dz-text-code-muted); }
  pre { max-height: 180px; margin: 0; padding: var(--dz-space-3); overflow: auto; font: var(--dz-font-size-1)/1.55 var(--dz-font-mono); white-space: pre; }
  .dz-lesson-node__code footer button { padding: 5px 7px; border-radius: var(--dz-radius-xs); background: var(--dz-accent); color: var(--dz-text-inverse); cursor: pointer; font-family: var(--dz-font-sans); font-weight: var(--dz-weight-semibold); touch-action: manipulation; }
</style>
