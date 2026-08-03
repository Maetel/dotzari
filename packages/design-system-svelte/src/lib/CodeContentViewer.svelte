<script lang="ts">
  import type { LessonNode } from '@dotzari/design-system';

  type CodeNode = LessonNode & { content: Extract<LessonNode['content'], { type: 'code' }> };
  type ViewerMode = 'full' | 'guide' | 'map';

  let {
    node,
    mode = $bindable('full'),
    onclose,
  }: {
    node: CodeNode;
    mode?: ViewerMode;
    onclose?: () => void;
  } = $props();

  let lineScroller: HTMLDivElement;
  let lines = $derived(node.content.code.split('\n'));
  let fallbackSections = $derived([
    { id: 'start', title: '준비와 설정', startLine: 1, endLine: Math.min(28, lines.length), description: '의존성과 실행 환경을 준비합니다.' },
    { id: 'middle', title: '입력 처리', startLine: Math.min(29, lines.length), endLine: Math.min(72, lines.length), description: '입력을 읽고 검사합니다.' },
    { id: 'result', title: '결과 만들기', startLine: Math.min(73, lines.length), endLine: lines.length, description: '결과를 저장하고 응답합니다.' },
  ]);
  let sections = $derived(node.content.sections?.length ? node.content.sections : fallbackSections);
  let activeSectionId = $state('');
  let activeSection = $derived(sections.find((section) => section.id === activeSectionId) ?? sections[0]);

  function goToSection(sectionId: string) {
    activeSectionId = sectionId;
    const section = sections.find((item) => item.id === sectionId);
    if (lineScroller && section) lineScroller.scrollTop = Math.max(0, (section.startLine - 1) * 22);
  }

  function isHighlighted(lineNumber: number) {
    return mode === 'guide' && lineNumber >= activeSection.startLine && lineNumber <= activeSection.endLine;
  }
</script>

<div class="dz-code-viewer__backdrop" role="presentation" onclick={onclose}></div>
<dialog open class="dz-code-viewer" class:guide={mode === 'guide'} aria-label={`${node.content.filename} 크게 보기`} onkeydown={(event) => { if (event.key === 'Escape') onclose?.(); }}>
  <header class="dz-code-viewer__header">
    <span><small>{lines.length}줄 · {node.content.language}</small><strong>{node.content.filename}</strong></span>
    <button type="button" aria-label="코드 보기 닫기" onclick={onclose}>×</button>
  </header>
  <nav class="dz-code-viewer__tabs" aria-label="코드 보기 방식">
    <button type="button" class:active={mode === 'full'} aria-pressed={mode === 'full'} onclick={() => mode = 'full'}>전체 파일</button>
    <button type="button" class:active={mode === 'guide'} aria-pressed={mode === 'guide'} onclick={() => mode = 'guide'}>설명과 코드</button>
    <button type="button" class:active={mode === 'map'} aria-pressed={mode === 'map'} onclick={() => mode = 'map'}>구조 지도</button>
  </nav>

  {#if mode === 'guide'}
    <div class="dz-code-viewer__guide">
      {#each sections as section (section.id)}
        <button type="button" class:active={section.id === activeSection.id} onclick={() => goToSection(section.id)}>
          <strong>{section.title}</strong><small>{section.startLine}–{section.endLine}줄</small>
        </button>
      {/each}
    </div>
  {/if}

  <div class="dz-code-viewer__workspace" class:map={mode === 'map'}>
    {#if mode === 'map'}
      <div class="dz-code-viewer__symbols" aria-label="코드 구조">
        {#each sections as section (section.id)}<button type="button" onclick={() => goToSection(section.id)}>{section.title}</button>{/each}
      </div>
    {/if}
    <div class="dz-code-viewer__filebar"><span>{node.content.filename}</span><span>{mode === 'map' ? '현재 범위와 전체 위치' : mode === 'guide' ? activeSection.description : '줄 번호로 위치 확인'}</span></div>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div bind:this={lineScroller} class="dz-code-viewer__lines" role="region" aria-label="코드 내용" tabindex="0">
      <code>{#each lines as line, index}<span class:highlight={isHighlighted(index + 1)} data-line={index + 1}>{line || ' '}</span>{/each}</code>
    </div>
    {#if mode === 'map'}
      <aside class="dz-code-viewer__minimap" aria-label="파일 전체 위치">
        {#each lines as line, index}{#if index % 2 === 0}<i style={`width:${Math.max(12, Math.min(70, line.length * .8))}%`}></i>{/if}{/each}
        <b></b>
      </aside>
    {/if}
  </div>
</dialog>

<style>
  .dz-code-viewer__backdrop { position: fixed; inset: 0; z-index: calc(var(--dz-layer-modal) - 1); background: rgb(0 0 0 / 32%); }
  .dz-code-viewer { position: fixed; inset: max(14px, env(safe-area-inset-top)) 14px max(14px, env(safe-area-inset-bottom)); z-index: var(--dz-layer-modal); display: grid; grid-template-rows: auto auto minmax(0,1fr); width: min(980px, calc(100vw - 28px)); height: auto; max-height: none; margin: auto; padding: 0; overflow: hidden; border: 1px solid var(--dz-border-subtle); border-radius: var(--dz-radius-xl); background: var(--dz-surface-panel); color: var(--dz-text-primary); box-shadow: var(--dz-shadow-panel); }.dz-code-viewer.guide { grid-template-rows: auto auto auto minmax(0,1fr); }
  .dz-code-viewer__header { display: flex; align-items: center; justify-content: space-between; gap: var(--dz-space-3); padding: var(--dz-space-4); border-bottom: 1px solid var(--dz-border-subtle); }.dz-code-viewer__header small, .dz-code-viewer__header strong { display: block; }.dz-code-viewer__header small { color: var(--dz-text-tertiary); font-size: var(--dz-font-size-1); }.dz-code-viewer__header strong { margin-top: 2px; font-size: var(--dz-font-size-4); }.dz-code-viewer__header button { width: 2.25rem; height: 2.25rem; border-radius: var(--dz-radius-sm); background: var(--dz-surface-subtle); color: var(--dz-text-secondary); cursor: pointer; touch-action: manipulation; }
  .dz-code-viewer__tabs { display: grid; grid-template-columns: repeat(3,1fr); gap: var(--dz-space-1); padding: var(--dz-space-2); background: var(--dz-surface-subtle); }.dz-code-viewer__tabs button { min-width: 0; padding: var(--dz-space-2); border-radius: var(--dz-radius-sm); background: transparent; color: var(--dz-text-secondary); cursor: pointer; font-size: var(--dz-font-size-2); font-weight: var(--dz-weight-semibold); touch-action: manipulation; }.dz-code-viewer__tabs button.active { background: var(--dz-surface-panel); color: var(--dz-accent); box-shadow: inset 0 0 0 1px var(--dz-border-subtle); }
  .dz-code-viewer__guide { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: var(--dz-space-2); padding: var(--dz-space-2); border-bottom: 1px solid var(--dz-border-subtle); background: var(--dz-surface-subtle); }.dz-code-viewer__guide button { min-width: 0; padding: var(--dz-space-2) var(--dz-space-3); border: 1px solid var(--dz-border-subtle); border-radius: var(--dz-radius-sm); background: var(--dz-surface-panel); color: var(--dz-text-secondary); cursor: pointer; text-align: left; }.dz-code-viewer__guide button.active { border-color: var(--dz-accent); color: var(--dz-accent); }.dz-code-viewer__guide strong, .dz-code-viewer__guide small { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }.dz-code-viewer__guide strong { font-size: var(--dz-font-size-2); }.dz-code-viewer__guide small { margin-top: 2px; color: var(--dz-text-tertiary); font-size: var(--dz-font-size-1); }
  .dz-code-viewer__workspace { position: relative; display: grid; grid-template-rows: auto minmax(0,1fr); min-height: 0; overflow: hidden; background: var(--dz-surface-code); color: var(--dz-text-code); }.dz-code-viewer__workspace.map { padding-right: 92px; }
  .dz-code-viewer__filebar { display: flex; justify-content: space-between; gap: var(--dz-space-3); padding: var(--dz-space-2) var(--dz-space-4); border-bottom: 1px solid var(--dz-border-subtle); background: var(--dz-surface-code-bar); color: var(--dz-text-code-muted); font: var(--dz-font-size-1)/1.3 var(--dz-font-mono); }
  .dz-code-viewer__lines { min-height: 0; overflow: auto; outline: none; }.dz-code-viewer__lines:focus-visible { box-shadow: inset var(--dz-focus-ring); }.dz-code-viewer__lines code { display: block; min-width: max-content; padding: var(--dz-space-3) 0; counter-reset: line; font: .75rem/1.55 var(--dz-font-mono); white-space: pre; }.dz-code-viewer__lines code > span { position: relative; display: block; min-height: 1.55em; padding: 0 1rem 0 4.2rem; counter-increment: line; }.dz-code-viewer__lines code > span::before { content: counter(line); position: absolute; left: .5rem; width: 2.8rem; color: var(--dz-text-code-muted); text-align: right; }.dz-code-viewer__lines code > span.highlight { background: color-mix(in srgb, var(--dz-accent) 14%, transparent); box-shadow: inset 3px 0 var(--dz-accent); }
  .dz-code-viewer__symbols { position: absolute; top: 3rem; left: var(--dz-space-3); z-index: 2; display: flex; gap: var(--dz-space-1); max-width: calc(100% - 120px); overflow-x: auto; }.dz-code-viewer__symbols button { flex: 0 0 auto; padding: 5px 7px; border: 1px solid var(--dz-border-subtle); border-radius: var(--dz-radius-xs); background: color-mix(in srgb, var(--dz-surface-code-bar) 94%, transparent); color: var(--dz-text-code-muted); cursor: pointer; font: var(--dz-font-size-1)/1 var(--dz-font-mono); }
  .dz-code-viewer__minimap { position: absolute; top: 0; right: 0; bottom: 0; width: 92px; overflow: hidden; border-left: 1px solid var(--dz-border-subtle); background: var(--dz-surface-code-bar); }.dz-code-viewer__minimap i { display: block; height: 1px; margin: 2px 8px; background: var(--dz-text-code-muted); opacity: .62; }.dz-code-viewer__minimap b { position: absolute; top: 16%; right: 4px; left: 4px; height: 82px; border: 1px solid var(--dz-accent); background: color-mix(in srgb, var(--dz-accent) 12%, transparent); }
  @media (max-width: 620px) { .dz-code-viewer { inset-inline: 7px; width: calc(100vw - 14px); border-radius: var(--dz-radius-lg); }.dz-code-viewer__guide { gap: 3px; }.dz-code-viewer__guide button { padding: var(--dz-space-2); }.dz-code-viewer__workspace.map { padding-right: 54px; }.dz-code-viewer__minimap { width: 54px; }.dz-code-viewer__symbols { max-width: calc(100% - 70px); }.dz-code-viewer__filebar span:last-child { display: none; } }
</style>
