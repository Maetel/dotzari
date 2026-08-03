<script lang="ts">
  import { lessonStepOrder, type Lesson, type LessonSnapshot } from '@dotzari/design-system';

  let {
    lesson,
    snapshot,
    onstepchange,
  }: {
    lesson: Lesson;
    snapshot: LessonSnapshot;
    onstepchange?: (stepId: string) => void;
  } = $props();

  let chapterListOpen = $state(false);
  let orderedSteps = $derived(lessonStepOrder(lesson));
  let stepIndexById = $derived(new Map(orderedSteps.map((step, index) => [step.id, index])));

  function goToChapter(chapterId: string) {
    const chapter = lesson.chapters.find((item) => item.id === chapterId);
    const firstStepId = chapter?.stepIds[0];
    if (firstStepId) onstepchange?.(firstStepId);
    chapterListOpen = false;
  }
</script>

<div class="dz-lesson-progress">
  <button class="dz-lesson-progress__current" type="button" onclick={() => chapterListOpen = true}>
    <span><small>현재 챕터</small><strong>{snapshot.chapterIndex + 1}장 · {snapshot.chapter.title}</strong></span>
    <b>스텝 {snapshot.chapterStepIndex + 1}/{snapshot.chapter.stepIds.length} · 전체 보기 ›</b>
  </button>

  <div class="dz-lesson-progress__track" aria-label="챕터와 스텝 이동">
    {#each lesson.chapters as chapter, chapterIndex (chapter.id)}
      <section
        class:active={chapter.id === snapshot.chapter.id}
        class:done={chapterIndex < snapshot.chapterIndex}
        style={`--chapter-span:${chapter.stepIds.length}`}
      >
        <button type="button" class="dz-lesson-progress__chapter" onclick={() => goToChapter(chapter.id)}>
          {chapterIndex + 1}장
        </button>
        <div class="dz-lesson-progress__steps" style={`grid-template-columns:repeat(${chapter.stepIds.length},minmax(0,1fr))`}>
          {#each chapter.stepIds as stepId, chapterStepIndex (stepId)}
            {@const step = lesson.steps.find((item) => item.id === stepId)}
            {@const stepIndex = stepIndexById.get(stepId) ?? 0}
            <button
              type="button"
              class="dz-lesson-progress__step"
              class:done={stepIndex < snapshot.stepIndex}
              class:active={stepId === snapshot.step.id}
              aria-label={`${chapterIndex + 1}장 ${chapterStepIndex + 1}단계, ${step?.title ?? stepId}`}
              aria-current={stepId === snapshot.step.id ? 'step' : undefined}
              onclick={() => onstepchange?.(stepId)}
            ></button>
          {/each}
        </div>
      </section>
    {/each}
  </div>
</div>

{#if chapterListOpen}
  <div class="dz-lesson-progress__backdrop" role="presentation" onclick={() => chapterListOpen = false}></div>
  <dialog open class="dz-lesson-progress__sheet" aria-modal="true" aria-label="전체 챕터">
    <header>
      <span><small>{lesson.chapters.length}개 챕터 · {orderedSteps.length}개 스텝</small><strong>{lesson.title}</strong></span>
      <button type="button" aria-label="챕터 목록 닫기" onclick={() => chapterListOpen = false}>×</button>
    </header>
    <div>
      {#each lesson.chapters as chapter, index (chapter.id)}
        {@const completed = chapter.stepIds.filter((stepId) => (stepIndexById.get(stepId) ?? 0) < snapshot.stepIndex).length}
        <button
          type="button"
          class="dz-lesson-progress__chapter-card"
          class:active={chapter.id === snapshot.chapter.id}
          onclick={() => goToChapter(chapter.id)}
        >
          <b>{index + 1}장</b>
          <span><strong>{chapter.title}</strong>{#if chapter.summary}<small>{chapter.summary}</small>{/if}</span>
          <small>{completed}/{chapter.stepIds.length}</small>
        </button>
      {/each}
    </div>
  </dialog>
{/if}

<style>
  .dz-lesson-progress { padding: var(--dz-space-2) var(--dz-space-3); border: 1px solid var(--dz-border-subtle); border-radius: var(--dz-radius-md); background: var(--dz-surface-subtle); }
  .dz-lesson-progress__current { display: flex; width: 100%; align-items: center; justify-content: space-between; gap: var(--dz-space-3); padding: 0 2px var(--dz-space-2); background: transparent; cursor: pointer; text-align: left; touch-action: manipulation; }
  .dz-lesson-progress__current span { min-width: 0; }
  .dz-lesson-progress__current small, .dz-lesson-progress__current strong { display: block; }
  .dz-lesson-progress__current small { color: var(--dz-text-tertiary); font-size: var(--dz-font-size-1); font-weight: var(--dz-weight-semibold); }
  .dz-lesson-progress__current strong { margin-top: 2px; overflow: hidden; font-size: var(--dz-font-size-2); text-overflow: ellipsis; white-space: nowrap; }
  .dz-lesson-progress__current b { flex: 0 0 auto; color: var(--dz-accent); font-size: var(--dz-font-size-1); }
  .dz-lesson-progress__track { display: flex; gap: var(--dz-space-1); }
  .dz-lesson-progress__track > section { display: grid; flex: var(--chapter-span, 1); grid-template-rows: auto 4px; gap: 3px; min-width: 0; }
  .dz-lesson-progress__chapter { min-width: 0; padding: 0 1px; overflow: hidden; background: transparent; color: var(--dz-text-tertiary); cursor: pointer; font-size: var(--dz-font-size-1); font-weight: var(--dz-weight-semibold); text-align: left; text-overflow: ellipsis; white-space: nowrap; touch-action: manipulation; }
  section.done .dz-lesson-progress__chapter { color: var(--dz-text-primary); }
  section.active .dz-lesson-progress__chapter { color: var(--dz-accent); }
  .dz-lesson-progress__steps { display: grid; gap: 2px; }
  .dz-lesson-progress__step { min-width: 0; height: 4px; padding: 0; border-radius: var(--dz-radius-pill); background: var(--dz-border-subtle); cursor: pointer; touch-action: manipulation; }
  .dz-lesson-progress__step.done { background: color-mix(in srgb, var(--dz-accent) 55%, var(--dz-border-subtle)); }
  .dz-lesson-progress__step.active { background: var(--dz-accent); box-shadow: 0 0 0 1px var(--dz-selection-ring); }
  .dz-lesson-progress__backdrop { position: fixed; inset: 0; z-index: calc(var(--dz-layer-modal) - 1); background: rgb(0 0 0 / 22%); }
  .dz-lesson-progress__sheet { position: fixed; top: 50%; left: 50%; z-index: var(--dz-layer-modal); width: min(420px, calc(100vw - 28px)); max-height: min(620px, calc(100dvh - 28px)); padding: var(--dz-space-4); overflow-y: auto; border: 1px solid var(--dz-border-subtle); border-radius: var(--dz-radius-xl); background: var(--dz-surface-panel); box-shadow: var(--dz-shadow-panel); transform: translate(-50%, -50%); }
  .dz-lesson-progress__sheet header { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--dz-space-3); }
  .dz-lesson-progress__sheet header small, .dz-lesson-progress__sheet header strong { display: block; }
  .dz-lesson-progress__sheet header small { color: var(--dz-accent); font-size: var(--dz-font-size-1); font-weight: var(--dz-weight-semibold); }
  .dz-lesson-progress__sheet header strong { margin-top: 2px; font-size: var(--dz-font-size-5); }
  .dz-lesson-progress__sheet header button { width: 2rem; height: 2rem; border-radius: var(--dz-radius-sm); background: var(--dz-surface-subtle); color: var(--dz-text-secondary); cursor: pointer; }
  .dz-lesson-progress__sheet > div { display: grid; gap: var(--dz-space-2); margin-top: var(--dz-space-4); }
  .dz-lesson-progress__chapter-card { display: grid; grid-template-columns: 2.5rem minmax(0,1fr) auto; align-items: center; gap: var(--dz-space-3); padding: var(--dz-space-3); border: 1px solid var(--dz-border-subtle); border-radius: var(--dz-radius-md); background: var(--dz-surface-subtle); cursor: pointer; text-align: left; }
  .dz-lesson-progress__chapter-card.active { border-color: var(--dz-accent); background: var(--dz-accent-soft); }
  .dz-lesson-progress__chapter-card > b { display: grid; height: 2.5rem; place-items: center; border-radius: var(--dz-radius-sm); background: var(--dz-surface-panel); color: var(--dz-accent); font-size: var(--dz-font-size-2); }
  .dz-lesson-progress__chapter-card span strong, .dz-lesson-progress__chapter-card span small { display: block; }
  .dz-lesson-progress__chapter-card span strong { font-size: var(--dz-font-size-3); }
  .dz-lesson-progress__chapter-card span small { margin-top: 3px; color: var(--dz-text-secondary); font-size: var(--dz-font-size-1); line-height: 1.4; }
  .dz-lesson-progress__chapter-card > small { color: var(--dz-text-tertiary); font-size: var(--dz-font-size-1); }
</style>
