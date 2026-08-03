<script lang="ts">
  import { onMount } from 'svelte';
  import { lessonStepOrder } from '@dotzari/design-system';
  import { LessonViewer, SegmentedControl } from '@dotzari/design-system-svelte';
  import { demoLesson } from './demoLesson';

  type Screen = 'catalog' | 'lesson';
  type DemoEntry = {
    id: string;
    eyebrow: string;
    title: string;
    description: string;
    stepId: string;
    codeNodeId?: string;
    tone: 'blue' | 'green' | 'orange' | 'purple';
    nodes: string[];
  };

  const basePath = '/design-system';
  const orderedSteps = lessonStepOrder(demoLesson);
  const firstStepId = orderedSteps[0].id;
  const demoEntries: DemoEntry[] = [
    {
      id: 'start', eyebrow: '전체 학습 · 7스텝', title: '처음부터 요청 흐름 따라가기',
      description: '소스 입력부터 응답이 돌아오기까지 24개 노드가 단계별로 나타납니다.',
      stepId: firstStepId, tone: 'blue', nodes: ['소스', 'V8', 'libuv', '응답'],
    },
    {
      id: 'event-loop', eyebrow: '핵심 구간 · 스텝 5', title: 'Event Loop 합류 지점 보기',
      description: '갈라졌던 비동기 경로가 callback으로 다시 실행 흐름에 들어오는 장면입니다.',
      stepId: 'reenter', tone: 'green', nodes: ['대기열', 'Event Loop', 'Callback'],
    },
    {
      id: 'code', eyebrow: '긴 콘텐츠 · 166줄', title: '실제 서버 코드 읽기',
      description: '전체 파일, 설명과 코드, 구조 지도의 세 가지 긴 코드 보기를 전환합니다.',
      stepId: firstStepId, codeNodeId: 'source', tone: 'orange', nodes: ['전체 파일', '설명', '지도'],
    },
    {
      id: 'overview', eyebrow: '전체 지도 · 24노드', title: '완성된 요청 지도 둘러보기',
      description: '모든 노드와 연결이 나타난 최종 상태를 확대·축소하고 드래그해서 살펴봅니다.',
      stepId: 'overview', tone: 'purple', nodes: ['입력', '실행', '위임', '결과'],
    },
  ];

  let screen = $state<Screen>('catalog');
  let theme = $state<'paper' | 'midnight'>('paper');
  let lessonStepId = $state(firstStepId);
  let savedStepId = $state(firstStepId);
  let openContentNodeId = $state<string | null>(null);
  let openSheet = $state<'menu' | 'exit' | null>(null);
  let canvasScale = $state(0.9);

  let currentStepIndex = $derived(Math.max(0, orderedSteps.findIndex((step) => step.id === lessonStepId)));
  let currentStep = $derived(orderedSteps[currentStepIndex]);

  function syncFromLocation() {
    const lessonRoute = location.pathname.replace(/\/+$/, '') === `${basePath}/lesson/node-request-flow`;
    screen = lessonRoute ? 'lesson' : 'catalog';
    if (!lessonRoute) {
      openContentNodeId = null;
      openSheet = null;
      return;
    }
    const parameters = new URLSearchParams(location.search);
    const requestedStep = parameters.get('step');
    lessonStepId = requestedStep && orderedSteps.some((step) => step.id === requestedStep) ? requestedStep : savedStepId;
    openContentNodeId = parameters.get('code');
  }

  onMount(() => {
    const stored = localStorage.getItem('dotzari-demo-step');
    if (stored && orderedSteps.some((step) => step.id === stored)) savedStepId = stored;
    canvasScale = matchMedia('(max-width: 620px)').matches ? 0.72 : 0.9;
    syncFromLocation();
    const handlePopState = () => syncFromLocation();
    addEventListener('popstate', handlePopState);
    return () => removeEventListener('popstate', handlePopState);
  });

  $effect(() => {
    if (screen !== 'lesson' || typeof localStorage === 'undefined') return;
    savedStepId = lessonStepId;
    localStorage.setItem('dotzari-demo-step', lessonStepId);
  });

  function openDemo(entry: DemoEntry, useSavedStep = false) {
    lessonStepId = useSavedStep ? savedStepId : entry.stepId;
    openContentNodeId = entry.codeNodeId ?? null;
    const parameters = new URLSearchParams();
    parameters.set('step', lessonStepId);
    if (openContentNodeId) parameters.set('code', openContentNodeId);
    history.pushState({}, '', `${basePath}/lesson/node-request-flow?${parameters}`);
    screen = 'lesson';
    openSheet = null;
  }

  function goHome() {
    history.pushState({}, '', `${basePath}/`);
    screen = 'catalog';
    openSheet = null;
    openContentNodeId = null;
  }

  function goToStep(index: number) {
    const next = orderedSteps[index];
    if (!next) return;
    lessonStepId = next.id;
    openSheet = null;
    history.replaceState({}, '', `${basePath}/lesson/node-request-flow?step=${next.id}`);
    document.querySelector('.course-main')?.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<svelte:head>
  <title>{screen === 'catalog' ? 'Dotzari 워킹 데모' : `${demoLesson.title} · Dotzari`}</title>
  <meta name="description" content="24개 노드로 Node.js 요청 흐름을 따라가는 Dotzari 워킹 데모" />
  <meta name="theme-color" content={theme === 'paper' ? '#f7f6f2' : '#080c12'} />
</svelte:head>

{#if screen === 'catalog'}
  <div class="dz-root demo-catalog" data-dz-theme={theme}>
    <header class="catalog-bar">
      <a class="catalog-brand" href={`${basePath}/`} onclick={(event) => event.preventDefault()}>
        <span aria-hidden="true">D</span>
        <div><strong>Dotzari</strong><small>작동하는 학습 화면</small></div>
      </a>
      <SegmentedControl
        label="화면 테마"
        items={[{ value: 'paper', label: '밝게' }, { value: 'midnight', label: '어둡게' }]}
        value={theme}
        onchange={(value) => theme = value as 'paper' | 'midnight'}
      />
    </header>

    <main class="catalog-main">
      <section class="catalog-intro">
        <span>WORKING DEMOS</span>
        <h1>어떤 화면부터<br />사용해 볼까요?</h1>
        <p>설명용 목업이 아닙니다. 항목을 누르면 실제 학습 화면이 열리고, 스텝 이동·캔버스 조작·긴 코드 보기를 직접 사용할 수 있습니다.</p>
      </section>

      {#if savedStepId !== firstStepId}
        <button class="resume-card" type="button" onclick={() => openDemo(demoEntries[0], true)}>
          <span><small>이어서 학습하기</small><strong>{orderedSteps.find((step) => step.id === savedStepId)?.title}</strong></span>
          <b>{orderedSteps.findIndex((step) => step.id === savedStepId) + 1}/{orderedSteps.length} →</b>
        </button>
      {/if}

      <section class="demo-grid" aria-label="체험할 화면 선택">
        {#each demoEntries as entry, index (entry.id)}
          <button class="demo-card" data-tone={entry.tone} type="button" onclick={() => openDemo(entry)}>
            <header><small>{entry.eyebrow}</small><b>{String(index + 1).padStart(2, '0')}</b></header>
            <h2>{entry.title}</h2>
            <p>{entry.description}</p>
            <div class="demo-card__flow" aria-hidden="true">
              {#each entry.nodes as node, nodeIndex}<span>{node}</span>{#if nodeIndex < entry.nodes.length - 1}<i>→</i>{/if}{/each}
            </div>
            <footer><span>열어서 사용하기</span><b>→</b></footer>
          </button>
        {/each}
      </section>
    </main>
  </div>
{:else}
  <div class="dz-root learning-app lesson-screen" data-dz-theme={theme}>
    <header class="course-bar">
      <button class="course-bar__icon" type="button" aria-label="데모 목록으로 돌아가기" onclick={goHome}>←</button>
      <div class="course-bar__title">
        <strong>{demoLesson.title}</strong>
        <span>{demoLesson.subject} · {currentStepIndex + 1}/{orderedSteps.length} 스텝</span>
      </div>
      <button class="course-bar__icon menu" type="button" aria-label="학습 메뉴 열기" onclick={() => openSheet = 'menu'}><i></i><i></i><i></i></button>
    </header>

    <main class="course-main">
      <div class="viewer-frame">
        <LessonViewer
          lesson={demoLesson}
          bind:stepId={lessonStepId}
          bind:openContentNodeId
          showHeader={false}
          showNavigation={false}
          initialCanvasScale={canvasScale}
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
      <dialog open class="app-sheet" aria-modal="true" aria-label={openSheet === 'menu' ? '학습 메뉴' : '학습 나가기'}>
        <header>
          <div><small>{openSheet === 'menu' ? '학습 메뉴' : '진행 상태 저장됨'}</small><strong>{openSheet === 'menu' ? demoLesson.title : '데모 목록으로 돌아갈까요?'}</strong></div>
          <button type="button" aria-label="닫기" onclick={() => openSheet = null}>×</button>
        </header>

        {#if openSheet === 'menu'}
          <div class="app-sheet__theme">
            <span>화면 테마</span>
            <SegmentedControl label="화면 테마" items={[{ value: 'paper', label: '밝게' }, { value: 'midnight', label: '어둡게' }]} value={theme} onchange={(value) => theme = value as 'paper' | 'midnight'} />
          </div>
          <div class="chapter-list">
            {#each demoLesson.chapters as chapter, chapterIndex (chapter.id)}
              {@const firstChapterStepIndex = orderedSteps.findIndex((step) => step.id === chapter.stepIds[0])}
              <button class:active={chapter.stepIds.includes(lessonStepId)} type="button" onclick={() => goToStep(firstChapterStepIndex)}>
                <b>{chapterIndex + 1}장</b><span><strong>{chapter.title}</strong><small>{chapter.summary}</small></span><i aria-hidden="true">→</i>
              </button>
            {/each}
          </div>
          <button class="app-sheet__secondary" type="button" onclick={() => { openContentNodeId = 'source'; openSheet = null; }}>166줄 코드 예제 열기</button>
          <button class="app-sheet__secondary quiet" type="button" onclick={() => openSheet = 'exit'}>데모 목록으로 돌아가기</button>
        {:else}
          <p class="app-sheet__message">현재 스텝은 이 기기에 저장되어 다음에 이어서 볼 수 있습니다.</p>
          <div class="app-sheet__actions"><button type="button" onclick={goHome}>목록으로 돌아가기</button><button class="quiet" type="button" onclick={() => openSheet = null}>계속 학습하기</button></div>
        {/if}
      </dialog>
    {/if}
  </div>
{/if}
