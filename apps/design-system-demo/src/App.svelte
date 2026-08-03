<script lang="ts">
  import { onMount } from 'svelte';
  import { lessonStepOrder } from '@dotzari/design-system';
  import { LessonViewer, SegmentedControl } from '@dotzari/design-system-svelte';
  import { demoLesson } from './demoLesson';

  let theme = $state<'paper' | 'midnight'>('paper');
  let lessonStepId = $state(demoLesson.steps[0].id);
  let openContentNodeId = $state<string | null>(null);
  let openSheet = $state<'menu' | 'exit' | null>(null);

  const orderedSteps = lessonStepOrder(demoLesson);
  let currentStepIndex = $derived(Math.max(0, orderedSteps.findIndex((step) => step.id === lessonStepId)));
  let currentStep = $derived(orderedSteps[currentStepIndex]);

  onMount(() => {
    const parameters = new URLSearchParams(location.search);
    openContentNodeId = parameters.get('code');
    const requestedStep = parameters.get('step');
    if (requestedStep && orderedSteps.some((step) => step.id === requestedStep)) lessonStepId = requestedStep;
  });

  function goToStep(index: number) {
    const next = orderedSteps[index];
    if (!next) return;
    lessonStepId = next.id;
    openSheet = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function restartLesson() {
    goToStep(0);
  }
</script>

<svelte:head>
  <title>{demoLesson.title} · Dotzari</title>
  <meta name="description" content="24개 노드로 Node.js 요청 흐름을 따라가는 Dotzari 워킹 데모" />
  <meta name="theme-color" content={theme === 'paper' ? '#f7f6f2' : '#080c12'} />
</svelte:head>

<div class="dz-root learning-app" data-dz-theme={theme}>
  <header class="course-bar">
    <button class="course-bar__icon" type="button" aria-label="강의 나가기" onclick={() => openSheet = 'exit'}>×</button>
    <div class="course-bar__title">
      <strong>{demoLesson.title}</strong>
      <span>{demoLesson.subject} · {currentStepIndex + 1}/{orderedSteps.length} 스텝</span>
    </div>
    <button class="course-bar__icon" type="button" aria-label="학습 메뉴 열기" onclick={() => openSheet = 'menu'}>☰</button>
  </header>

  <main class="course-main">
    <div class="viewer-frame">
      <LessonViewer
        lesson={demoLesson}
        bind:stepId={lessonStepId}
        bind:openContentNodeId
        showHeader={false}
        showNavigation={false}
        initialCanvasScale={0.8}
      />
    </div>
  </main>

  <nav class="course-navigation" aria-label="스텝 이동">
    <button type="button" aria-label="이전 스텝" disabled={currentStepIndex === 0} onclick={() => goToStep(currentStepIndex - 1)}>←</button>
    <button class="course-navigation__status" type="button" onclick={() => openSheet = 'menu'}>
      <strong>{currentStep.title}</strong>
      <span>{currentStepIndex + 1} / {orderedSteps.length} 스텝 · 전체 보기</span>
    </button>
    <button class="next" type="button" aria-label="다음 스텝" disabled={currentStepIndex === orderedSteps.length - 1} onclick={() => goToStep(currentStepIndex + 1)}>→</button>
  </nav>

  {#if openSheet}
    <div class="app-sheet-backdrop" role="presentation" onclick={() => openSheet = null}></div>
    <dialog open class="app-sheet" aria-modal="true" aria-label={openSheet === 'menu' ? '학습 메뉴' : '강의 나가기'}>
      <header>
        <div>
          <small>{openSheet === 'menu' ? '학습 메뉴' : '진행 상태가 저장되었습니다'}</small>
          <strong>{openSheet === 'menu' ? demoLesson.title : '학습을 마칠까요?'}</strong>
        </div>
        <button type="button" aria-label="닫기" onclick={() => openSheet = null}>×</button>
      </header>

      {#if openSheet === 'menu'}
        <div class="app-sheet__theme">
          <span>화면 테마</span>
          <SegmentedControl
            label="화면 테마"
            items={[{ value: 'paper', label: '밝게' }, { value: 'midnight', label: '어둡게' }]}
            value={theme}
            onchange={(value) => theme = value as 'paper' | 'midnight'}
          />
        </div>
        <div class="chapter-list">
          {#each demoLesson.chapters as chapter, chapterIndex (chapter.id)}
            {@const firstStepIndex = orderedSteps.findIndex((step) => step.id === chapter.stepIds[0])}
            {@const chapterActive = chapter.stepIds.includes(lessonStepId)}
            <button class:active={chapterActive} type="button" onclick={() => goToStep(firstStepIndex)}>
              <b>{chapterIndex + 1}장</b>
              <span><strong>{chapter.title}</strong><small>{chapter.summary}</small></span>
              <i aria-hidden="true">→</i>
            </button>
          {/each}
        </div>
        <button class="app-sheet__secondary" type="button" onclick={() => openContentNodeId = 'source'}>166줄 코드 예제 열기</button>
      {:else}
        <p class="app-sheet__message">현재 위치는 이 기기에 유지됩니다. 데모에서는 언제든 이어서 학습하거나 처음부터 다시 볼 수 있습니다.</p>
        <div class="app-sheet__actions">
          <button type="button" onclick={() => openSheet = null}>계속 학습하기</button>
          <button class="quiet" type="button" onclick={restartLesson}>처음부터 다시 보기</button>
        </div>
      {/if}
    </dialog>
  {/if}
</div>
