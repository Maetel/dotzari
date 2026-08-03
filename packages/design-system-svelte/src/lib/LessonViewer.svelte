<script lang="ts">
  import { deriveLessonSnapshot, lessonStepOrder, type Lesson, type LessonNode } from '@dotzari/design-system';
  import CodeContentViewer from './CodeContentViewer.svelte';
  import LessonCanvas from './LessonCanvas.svelte';
  import LessonProgress from './LessonProgress.svelte';

  let {
    lesson,
    stepId = $bindable(),
    openContentNodeId = $bindable(null),
    showHeader = true,
    showNavigation = true,
    initialCanvasScale = 1,
    onstepchange,
    onopencontent,
  }: {
    lesson: Lesson;
    stepId?: string;
    openContentNodeId?: string | null;
    showHeader?: boolean;
    showNavigation?: boolean;
    initialCanvasScale?: number;
    onstepchange?: (stepId: string) => void;
    onopencontent?: (nodeId: string) => void;
  } = $props();

  let selectedNodeId = $state<string | null>(null);
  let resolvedStepId = $derived(stepId ?? lessonStepOrder(lesson)[0]?.id);
  let snapshot = $derived(deriveLessonSnapshot(lesson, resolvedStepId));
  let selectedNode = $derived(snapshot.visibleNodes.find((node) => node.id === selectedNodeId));
  type CodeNode = LessonNode & { content: Extract<LessonNode['content'], { type: 'code' }> };
  let openCodeNode = $derived.by(() => {
    const found = lesson.nodes.find((node) => node.id === openContentNodeId);
    return found?.content.type === 'code' ? found as CodeNode : undefined;
  });

  function setStep(nextStepId: string) {
    stepId = nextStepId;
    selectedNodeId = null;
    onstepchange?.(nextStepId);
  }

  function openContent(nodeId: string) {
    const node = lesson.nodes.find((item) => item.id === nodeId);
    if (node?.content.type === 'code') openContentNodeId = nodeId;
    onopencontent?.(nodeId);
  }
</script>

<section class="dz-lesson-viewer" aria-label={lesson.title}>
  {#if showHeader}
    <header class="dz-lesson-viewer__header">
      <div><small>{lesson.subject ?? '학습 콘텐츠'} · {lesson.nodes.length}개 노드</small><strong>{lesson.title}</strong></div>
    </header>
  {/if}

  <LessonProgress {lesson} {snapshot} onstepchange={setStep} />

  <div class="dz-lesson-viewer__copy">
    {#if snapshot.step.eyebrow}<span>{snapshot.step.eyebrow}</span>{/if}
    <h2>{snapshot.step.title}</h2>
    <p>{snapshot.step.description}</p>
    <div><small><b>{snapshot.visibleNodes.length}</b> / {lesson.nodes.length}개 노드</small><small>{snapshot.activeNodeIds.length}개 생성</small><small>{snapshot.activeEdgeIds.length}개 새 연결</small></div>
  </div>

  <div class="dz-lesson-viewer__canvas">
    <LessonCanvas
      {lesson}
      stepId={snapshot.step.id}
      initialScale={initialCanvasScale}
      {selectedNodeId}
      onselectnode={(nodeId) => selectedNodeId = nodeId}
      onopencontent={openContent}
    />
  </div>

  {#if selectedNode}
    <div class="dz-lesson-viewer__explanation" aria-live="polite">
      <strong>{selectedNode.title}</strong>
      <p>{selectedNode.description}</p>
    </div>
  {/if}

  {#if showNavigation}
    <footer class="dz-lesson-viewer__footer">
      <button type="button" aria-label="이전 스텝" disabled={!snapshot.previousStepId} onclick={() => snapshot.previousStepId && setStep(snapshot.previousStepId)}>←</button>
      <div><strong>{snapshot.step.title}</strong><span>{snapshot.stepIndex + 1} / {lessonStepOrder(lesson).length} 스텝</span></div>
      <button class="next" type="button" aria-label="다음 스텝" disabled={!snapshot.nextStepId} onclick={() => snapshot.nextStepId && setStep(snapshot.nextStepId)}>→</button>
    </footer>
  {/if}

  {#if openCodeNode}
    <CodeContentViewer node={openCodeNode} onclose={() => openContentNodeId = null} />
  {/if}
</section>

<style>
  .dz-lesson-viewer { display: grid; grid-template-columns: minmax(0, 1fr); grid-template-rows: auto auto auto minmax(420px, 1fr) auto auto; gap: var(--dz-space-3); width: 100%; min-height: 760px; padding: var(--dz-space-4); overflow: hidden; border: 1px solid var(--dz-border-strong); border-radius: var(--dz-radius-xl); background: var(--dz-surface-panel); color: var(--dz-text-primary); box-shadow: var(--dz-shadow-panel); }
  .dz-lesson-viewer__header { display: flex; align-items: center; min-width: 0; min-height: 2.75rem; border-bottom: 1px solid var(--dz-border-subtle); }
  .dz-lesson-viewer__header small, .dz-lesson-viewer__header strong { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }.dz-lesson-viewer__header small { color: var(--dz-text-secondary); font-size: var(--dz-font-size-1); }.dz-lesson-viewer__header strong { margin-top: 2px; font-size: var(--dz-font-size-4); }
  .dz-lesson-viewer__copy > span { color: var(--dz-accent); font-size: var(--dz-font-size-1); font-weight: var(--dz-weight-semibold); letter-spacing: .08em; }.dz-lesson-viewer__copy h2 { margin: var(--dz-space-2) 0; font-size: clamp(1.65rem, 4vw, 2.5rem); line-height: 1.08; letter-spacing: -.04em; }.dz-lesson-viewer__copy > p { max-width: 72ch; margin: 0; color: var(--dz-text-secondary); font-size: var(--dz-font-size-3); line-height: 1.55; }.dz-lesson-viewer__copy > div { display: flex; flex-wrap: wrap; gap: var(--dz-space-2); margin-top: var(--dz-space-3); }.dz-lesson-viewer__copy > div small { padding: 5px 7px; border-radius: var(--dz-radius-sm); background: var(--dz-surface-subtle); color: var(--dz-text-tertiary); font-size: var(--dz-font-size-1); }.dz-lesson-viewer__copy > div b { color: var(--dz-accent); }
  .dz-lesson-viewer__canvas { min-height: 420px; }
  .dz-lesson-viewer__explanation { padding: var(--dz-space-3) var(--dz-space-4); border: 1px solid var(--dz-border-subtle); border-radius: var(--dz-radius-md); background: var(--dz-surface-subtle); }.dz-lesson-viewer__explanation strong { font-size: var(--dz-font-size-3); }.dz-lesson-viewer__explanation p { margin: 4px 0 0; color: var(--dz-text-secondary); font-size: var(--dz-font-size-2); }
  .dz-lesson-viewer__footer { display: grid; grid-template-columns: 3rem minmax(0,1fr) 3rem; align-items: center; gap: var(--dz-space-2); padding-top: var(--dz-space-3); border-top: 1px solid var(--dz-border-subtle); }.dz-lesson-viewer__footer button { height: 2.75rem; border-radius: var(--dz-radius-md); background: var(--dz-surface-subtle); color: var(--dz-text-secondary); cursor: pointer; font-weight: var(--dz-weight-bold); touch-action: manipulation; }.dz-lesson-viewer__footer button.next { background: var(--dz-accent); color: var(--dz-text-inverse); }.dz-lesson-viewer__footer button:disabled { opacity: .4; cursor: not-allowed; }.dz-lesson-viewer__footer div { text-align: center; }.dz-lesson-viewer__footer strong, .dz-lesson-viewer__footer span { display: block; }.dz-lesson-viewer__footer strong { overflow: hidden; font-size: var(--dz-font-size-2); text-overflow: ellipsis; white-space: nowrap; }.dz-lesson-viewer__footer span { margin-top: 3px; color: var(--dz-text-tertiary); font-size: var(--dz-font-size-1); }
  @media (max-width: 620px) { .dz-lesson-viewer { min-height: 720px; gap: var(--dz-space-2); padding: var(--dz-space-3); border-radius: var(--dz-radius-lg); }.dz-lesson-viewer__copy h2 { margin-block: var(--dz-space-1); font-size: 1.65rem; }.dz-lesson-viewer__copy > p { font-size: var(--dz-font-size-2); }.dz-lesson-viewer__copy > div { margin-top: var(--dz-space-2); }.dz-lesson-viewer__canvas { min-height: 440px; } }
</style>
