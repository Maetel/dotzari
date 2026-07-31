<script lang="ts">
  import type { CanvasEdgeModel, CanvasInteractionState, CanvasNodeModel, Viewport } from '@dotzari/design-system';
  import { Badge, Button, CanvasSurface, Field, IconButton, Panel, SegmentedControl } from '@dotzari/design-system-svelte';

  let theme = $state<'paper' | 'midnight'>('paper');
  let canvasState: CanvasInteractionState | undefined = $state();
  let viewport = $state<Viewport>({ x: 40, y: 40, zoom: 1 });
  let clusterMessage = $state('줌아웃하면 앱이 관계와 거리를 바탕으로 묶음을 제안합니다.');

  const nodes: CanvasNodeModel[] = [
    {
      id: 'node', title: 'Node.js', eyebrow: 'Runtime', kind: 'concept', x: 55, y: 95, width: 260, height: 270,
      description: '브라우저 밖에서 JavaScript를 실행하는 환경입니다.',
    },
    {
      id: 'npm', parentId: 'node', title: 'npm', kind: 'data', x: 0, y: 0, width: 0, height: 0,
      description: 'Node.js 패키지를 찾고 설치하고 배포하는 도구입니다.',
      examples: ['npm install svelte', 'package.json 의존성 관리', 'npmjs.com에 패키지 배포'],
    },
    {
      id: 'npx', parentId: 'node', title: 'npx', kind: 'code', x: 0, y: 0, width: 0, height: 0,
      description: '패키지 명령을 설치 과정 없이 바로 실행할 수 있습니다.',
      examples: ['npx vite', 'npx degit template project'],
    },
    {
      id: 'runtime', title: 'Runtime', eyebrow: 'Core concept', kind: 'concept', x: 355, y: 82, width: 230, height: 146,
      description: '프로그램이 실제로 동작하는 실행 기반입니다.',
    },
    {
      id: 'v8', title: 'V8 Engine', eyebrow: 'Execution', kind: 'code', x: 335, y: 335, width: 250, height: 178,
      description: 'JavaScript 코드를 기계가 실행할 수 있게 처리합니다.', metadata: { code: 'const result = compile(source);' },
    },
    {
      id: 'loop', title: 'Event Loop', eyebrow: 'Concurrency', kind: 'concept', x: 630, y: 325, width: 225, height: 150,
      description: '비동기 작업의 완료 순서를 조율합니다.',
    },
    {
      id: 'media', title: '실행 흐름 영상', eyebrow: 'Media', kind: 'media', x: 625, y: 72, width: 230, height: 145,
      description: '호출 스택과 이벤트 큐의 흐름을 45초 영상으로 봅니다.',
    },
  ];

  const edges: CanvasEdgeModel[] = [
    { id: 'e1', sourceId: 'node', targetId: 'runtime', label: '실행 환경' },
    { id: 'e2', sourceId: 'runtime', targetId: 'v8', label: '코드 실행' },
    { id: 'e3', sourceId: 'v8', targetId: 'loop', label: '작업 전달', active: true },
    { id: 'e4', sourceId: 'runtime', targetId: 'media', label: '보충 설명' },
  ];
</script>

<svelte:head><meta name="theme-color" content={theme === 'paper' ? '#f2f0ea' : '#080c12'} /></svelte:head>

<div class="dz-root app" data-dz-theme={theme}>
  <header class="topbar">
    <a class="brand" href="#top" aria-label="Dotzari 디자인 시스템 홈">
      <span aria-hidden="true">D</span>
      <div><strong>Dotzari</strong><small>Design system · v0.1 draft</small></div>
    </a>
    <nav aria-label="페이지 둘러보기"><a href="#canvas">Canvas lab</a><a href="#components">Components</a></nav>
    <SegmentedControl
      label="테마"
      items={[{ value: 'paper', label: 'Paper' }, { value: 'midnight', label: 'Midnight' }]}
      value={theme}
      onchange={(value) => theme = value as 'paper' | 'midnight'}
    />
  </header>

  <main id="top">
    <section class="hero">
      <div>
        <Badge tone="accent">Svelte-first</Badge>
        <h1>콘텐츠와 캔버스 조작을<br />하나의 언어로 만듭니다.</h1>
        <p>버튼의 모양뿐 아니라 선택, 드래그, 줌, 자동 묶음, 하위 개념 열기까지 같은 디자인 시스템에서 관리합니다.</p>
      </div>
      <div class="hero__facts" aria-label="디자인 시스템 구성">
        <article><strong>14</strong><span>Svelte components</span></article>
        <article><strong>2</strong><span>semantic themes</span></article>
        <article><strong>1</strong><span>interaction core</span></article>
      </div>
    </section>

    <section class="canvas-section" id="canvas">
      <div class="section-heading">
        <div><span>01 · INTERACTION SYSTEM</span><h2>Canvas lab</h2></div>
        <p>Node.js를 옮기거나, npm의 상세 보기를 열거나, 72% 아래로 축소해 자동 묶음을 확인해 보세요.</p>
      </div>

      <div class="workspace">
        <div class="canvas-frame">
          <div class="canvas-frame__bar">
            <div><i></i><i></i><i></i><span>node-runtime.lesson</span></div>
            <Badge tone={viewport.zoom <= .72 ? 'warning' : 'success'}>{viewport.zoom <= .72 ? '자동 묶음 보기' : '개별 노드 보기'}</Badge>
          </div>
          <div class="canvas-frame__body">
            <CanvasSurface
              {nodes}
              {edges}
              {viewport}
              onviewportchange={(next) => viewport = next}
              onstatechange={(next) => canvasState = next}
              onclusterreview={() => clusterMessage = '제작자가 이름과 구성을 확인할 차례입니다. 자동 제안은 그대로 확정되지 않습니다.'}
            />
          </div>
        </div>

        <aside class="inspector">
          <div class="inspector__title"><div><span>LIVE STATE</span><h3>Interaction inspector</h3></div><span class="pulse" aria-hidden="true"></span></div>
          <dl>
            <div><dt>Mode</dt><dd>{canvasState?.mode ?? 'idle'}</dd></div>
            <div><dt>Tool</dt><dd>{canvasState?.tool ?? 'select'}</dd></div>
            <div><dt>Selection</dt><dd>{canvasState?.selectedNodeIds.join(', ') || '—'}</dd></div>
            <div><dt>Viewport</dt><dd>{Math.round(viewport.zoom * 100)}% · {Math.round(viewport.x)}, {Math.round(viewport.y)}</dd></div>
          </dl>
          <div class="inspector__note"><strong>자동 묶음</strong><p>{clusterMessage}</p></div>
          <div class="inspector__keys"><span><kbd>←↑↓→</kbd> 노드 이동</span><span><kbd>Shift</kbd> 10칸 이동</span><span><kbd>+ −</kbd> 확대·축소</span><span><kbd>Esc</kbd> 닫기·해제</span></div>
        </aside>
      </div>
    </section>

    <section class="components-section" id="components">
      <div class="section-heading">
        <div><span>02 · FOUNDATIONS</span><h2>Component shelf</h2></div>
        <p>두 테마가 같은 의미 토큰을 공유하므로 화면의 역할과 상태가 바뀌지 않습니다.</p>
      </div>
      <div class="component-grid">
        <Panel title="Actions" description="강조 순서가 분명한 버튼" count="4 variants">
          <div class="row"><Button variant="primary">저장하기</Button><Button>미리 보기</Button><Button variant="quiet">취소</Button><IconButton label="더보기">•••</IconButton></div>
        </Panel>
        <Panel title="Status" description="색과 문구를 함께 사용" count="4 tones">
          <div class="row"><Badge>초안</Badge><Badge tone="accent">선택됨</Badge><Badge tone="success">저장됨</Badge><Badge tone="warning">검토 필요</Badge></div>
        </Panel>
        <Panel title="Fields" description="도움말과 오류를 같은 자리에 표시">
          <div class="fields"><Field label="묶음 이름" value="JavaScript 실행 기반" hint="학습자가 이해할 수 있는 이름을 사용하세요." /><Field label="공개 주소" value="" placeholder="example" error="사용할 주소를 입력해 주세요." /></div>
        </Panel>
        <Panel title="Interaction states" description="캔버스의 상태도 재사용 가능한 규칙" count="6 states">
          <div class="state-list"><span data-state="idle">Idle</span><span data-state="hover">Hover</span><span data-state="selected">Selected</span><span data-state="dragging">Dragging</span><span data-state="cluster">Cluster</span><span data-state="detail">Detail open</span></div>
        </Panel>
      </div>
    </section>
  </main>

  <footer><strong>Dotzari Design System</strong><span>제품 규칙과 구현이 함께 진화하는 작업 초안</span></footer>
</div>
