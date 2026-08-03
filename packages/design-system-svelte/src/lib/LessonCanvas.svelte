<script lang="ts">
  import { tick, untrack } from 'svelte';
  import {
    bezierEdgeGeometry,
    clamp,
    deriveLessonSnapshot,
    layoutLessonFlow,
    lessonNodeWidth,
    shouldAutoFocusCanvas,
    worldBoundsToScrollOffset,
    type CanvasNodeModel,
    type Lesson,
    type Size,
  } from '@dotzari/design-system';
  import LessonNodeCard from './LessonNodeCard.svelte';

  let {
    lesson,
    stepId,
    selectedNodeId,
    initialScale = 1,
    onselectnode,
    onopencontent,
  }: {
    lesson: Lesson;
    stepId: string;
    selectedNodeId?: string | null;
    initialScale?: number;
    onselectnode?: (nodeId: string) => void;
    onopencontent?: (nodeId: string) => void;
  } = $props();

  let viewport: HTMLDivElement | undefined;
  let viewportSize = $state<Size>({ width: 0, height: 0 });
  let scale = $state(untrack(() => initialScale));
  let dragging = $state(false);
  let measuredSizes = $state<ReadonlyMap<string, Size>>(new Map());
  let drag: { pointerId: number; x: number; y: number; left: number; top: number; moved: boolean } | null = null;
  let activePointers = new Set<number>();
  let lastAutoFocus = $state<{ stepId: string; viewportWidth: number } | null>(null);
  let userControlsCamera = $state(false);
  let cameraStepId = '';

  let snapshot = $derived(deriveLessonSnapshot(lesson, stepId));
  let layout = $derived(layoutLessonFlow(snapshot, measuredSizes));
  let cameraWorldWidth = $derived(layout.width + (viewportSize.width > 0 ? viewportSize.width / scale / 2 : 0));
  let placementById = $derived(new Map(layout.nodes.map((node) => [node.id, node])));
  let chapterById = $derived(new Map(lesson.chapters.map((chapter) => [chapter.id, chapter])));
  let edgeItems = $derived.by(() => snapshot.visibleEdges.flatMap((edge) => {
    const source = placementById.get(edge.sourceId);
    const target = placementById.get(edge.targetId);
    const sourceModel = snapshot.visibleNodes.find((node) => node.id === edge.sourceId);
    const targetModel = snapshot.visibleNodes.find((node) => node.id === edge.targetId);
    if (!source || !target || !sourceModel || !targetModel || !source.height || !target.height) return [];
    const sourceNode: CanvasNodeModel = { id: source.id, title: sourceModel.title, x: source.x, y: source.y, width: source.width, height: source.height };
    const targetNode: CanvasNodeModel = { id: target.id, title: targetModel.title, x: target.x, y: target.y, width: target.width, height: target.height };
    return [{ edge, geometry: bezierEdgeGeometry(sourceNode, targetNode) }];
  }));

  function measureNode(element: HTMLElement, nodeId: string) {
    let id = nodeId;
    const update = () => {
      const size = { width: element.offsetWidth, height: element.offsetHeight };
      const previous = measuredSizes.get(id);
      if (previous?.width === size.width && previous.height === size.height) return;
      const next = new Map(measuredSizes);
      next.set(id, size);
      measuredSizes = next;
    };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    update();
    void tick().then(update);
    return {
      update(nextId: string) {
        id = nextId;
        update();
        void tick().then(update);
      },
      destroy() { observer.disconnect(); },
    };
  }

  function observeViewport(element: HTMLDivElement) {
    viewport = element;
    const ownerWindow = element.ownerDocument.defaultView;
    const update = () => {
      const next = { width: element.clientWidth, height: element.clientHeight };
      if (next.width !== viewportSize.width || next.height !== viewportSize.height) viewportSize = next;
    };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    ownerWindow?.addEventListener('resize', update, { passive: true });
    ownerWindow?.visualViewport?.addEventListener('resize', update, { passive: true });
    update();
    return {
      destroy() {
        observer.disconnect();
        ownerWindow?.removeEventListener('resize', update);
        ownerWindow?.visualViewport?.removeEventListener('resize', update);
        if (viewport === element) viewport = undefined;
      },
    };
  }

  function setScale(nextScale: number) {
    const element = viewport;
    if (!element) return;
    const previous = scale;
    const centerX = (element.scrollLeft + element.clientWidth / 2) / previous;
    const centerY = (element.scrollTop + element.clientHeight / 2) / previous;
    userControlsCamera = true;
    scale = clamp(nextScale, .65, 1.6);
    void tick().then(() => {
      if (!element.isConnected) return;
      element.scrollLeft = centerX * scale - element.clientWidth / 2;
      element.scrollTop = centerY * scale - element.clientHeight / 2;
    });
  }

  function pointerDown(event: PointerEvent) {
    const element = viewport;
    activePointers.add(event.pointerId);
    if (!element || activePointers.size > 1 || event.button !== 0 || (event.target as Element).closest('[data-lesson-interactive], [data-lesson-controls]')) return;
    drag = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, left: element.scrollLeft, top: element.scrollTop, moved: false };
    element.setPointerCapture(event.pointerId);
  }

  function pointerMove(event: PointerEvent) {
    const element = viewport;
    if (!element || !drag || drag.pointerId !== event.pointerId || activePointers.size !== 1) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.hypot(dx, dy) > 3) drag.moved = true;
    if (!drag.moved) return;
    event.preventDefault();
    dragging = true;
    userControlsCamera = true;
    element.scrollLeft = drag.left - dx;
    element.scrollTop = drag.top - dy;
  }

  function pointerEnd(event: PointerEvent) {
    const element = viewport;
    activePointers.delete(event.pointerId);
    if (drag?.pointerId === event.pointerId) {
      if (element?.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
      drag = null;
      dragging = false;
    }
  }

  $effect(() => {
    const currentStepId = snapshot.step.id;
    const width = viewportSize.width;
    const height = viewportSize.height;
    const focusSnapshot = { stepId: currentStepId, viewportWidth: width };
    if (cameraStepId !== currentStepId) {
      cameraStepId = currentStepId;
      userControlsCamera = false;
    }
    const element = viewport;
    if (!element || !layout.ready || width <= 0 || height <= 0) return;
    if (!shouldAutoFocusCanvas(lastAutoFocus, focusSnapshot, userControlsCamera)) return;

    let targets = snapshot.activeNodeIds.flatMap((nodeId) => {
      const placement = placementById.get(nodeId);
      return placement ? [placement] : [];
    });
    if (!targets.length && layout.nodes.length) {
      const lastStage = Math.max(...layout.nodes.map((node) => node.stageIndex));
      targets = layout.nodes.filter((node) => node.stageIndex === lastStage);
    }
    if (!targets.length) return;

    const left = Math.min(...targets.map((node) => node.x));
    const right = Math.max(...targets.map((node) => node.x + node.width));
    const offset = worldBoundsToScrollOffset(
      { x: left, y: 0, width: right - left, height: 0 },
      scale,
      { width, height },
      { width: cameraWorldWidth, height: layout.height },
      { padding: 16, alignX: 'center', alignY: 'start' },
    );
    let attempts = 0;
    const applyFocus = () => {
      if (!element.isConnected || snapshot.step.id !== currentStepId || userControlsCamera) return;
      if (Math.abs(element.clientWidth - width) >= 1 || Math.abs(element.clientHeight - height) >= 1) {
        viewportSize = { width: element.clientWidth, height: element.clientHeight };
        return;
      }
      element.scrollLeft = offset.x;
      element.scrollTop = 0;
      if (Math.abs(element.scrollLeft - offset.x) < 1 || attempts >= 2) {
        lastAutoFocus = focusSnapshot;
        return;
      }
      attempts += 1;
      setTimeout(applyFocus, 0);
    };
    void tick().then(applyFocus);
  });
</script>

<div class="dz-lesson-canvas">
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <div
    use:observeViewport
    class="dz-lesson-canvas__viewport"
    class:dragging
    aria-label="학습 노드 캔버스"
    role="application"
    tabindex="0"
    onpointerdown={pointerDown}
    onpointermove={pointerMove}
    onpointerup={pointerEnd}
    onpointercancel={pointerEnd}
    onwheel={(event) => { if (event.ctrlKey || event.metaKey) { event.preventDefault(); setScale(scale * Math.exp(-event.deltaY * .002)); } }}
  >
    <div class="dz-lesson-canvas__shell" style={`width:${cameraWorldWidth * scale}px;height:${layout.height * scale}px`}>
      <div
        class="dz-lesson-canvas__world"
        class:ready={layout.ready}
        style={`width:${cameraWorldWidth}px;height:${layout.height}px;transform:scale(${scale})`}
      >
        {#each layout.chapters as bounds (bounds.chapterId)}
          {@const chapter = chapterById.get(bounds.chapterId)}
          <section
            class="dz-lesson-canvas__chapter"
            class:active={bounds.chapterId === snapshot.chapter.id}
            style={`left:${bounds.x}px;top:${bounds.y}px;width:${bounds.width}px;height:${bounds.height}px;--chapter-accent:${chapter?.accent ?? 'var(--dz-accent)'}`}
            aria-label={chapter?.title}
          >
            <span><small>{lesson.chapters.findIndex((item) => item.id === bounds.chapterId) + 1}장</small><strong>{chapter?.title}</strong></span>
          </section>
        {/each}

        <svg class="dz-lesson-canvas__edges" width={layout.width} height={layout.height} viewBox={`0 0 ${layout.width} ${layout.height}`} aria-hidden="true">
          <defs><marker id="dz-lesson-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker></defs>
          {#each edgeItems as item (item.edge.id)}
            <path class:active={snapshot.activeEdgeIds.includes(item.edge.id)} d={item.geometry.path} marker-end="url(#dz-lesson-arrow)"></path>
            {#if item.edge.label}<text x={item.geometry.label.x} y={item.geometry.label.y - 8}>{item.edge.label}</text>{/if}
          {/each}
        </svg>

        {#each snapshot.visibleNodes as node (node.id)}
          {@const placement = placementById.get(node.id)}
          <div
            class="dz-lesson-canvas__node"
            use:measureNode={node.id}
            style={`left:${placement?.x ?? 0}px;top:${placement?.y ?? 0}px;width:${lessonNodeWidth(node)}px`}
          >
            <LessonNodeCard
              {node}
              active={snapshot.activeNodeIds.includes(node.id)}
              selected={selectedNodeId === node.id}
              onselect={onselectnode}
              {onopencontent}
            />
          </div>
        {/each}
      </div>
    </div>
  </div>

  <div class="dz-lesson-canvas__controls" data-lesson-controls>
    <button type="button" aria-label="축소" onclick={() => setScale(scale - .15)}>−</button>
    <output aria-label="현재 확대 비율">{Math.round(scale * 100)}%</output>
    <button type="button" aria-label="확대" onclick={() => setScale(scale + .15)}>＋</button>
    <button type="button" aria-label="100%로 보기" onclick={() => setScale(1)}>↺</button>
  </div>
</div>

<style>
  .dz-lesson-canvas { position: relative; min-width: 0; height: 100%; min-height: 420px; }
  .dz-lesson-canvas__viewport { width: 100%; height: 100%; min-height: 420px; overflow: hidden; border: 1px solid var(--dz-border-subtle); border-radius: var(--dz-radius-lg); outline: none; overscroll-behavior: none; touch-action: pinch-zoom; cursor: grab; }
  .dz-lesson-canvas__viewport::-webkit-scrollbar { display: none; }.dz-lesson-canvas__viewport.dragging { cursor: grabbing; user-select: none; }
  .dz-lesson-canvas__viewport:focus-visible { box-shadow: inset var(--dz-focus-ring); }
  .dz-lesson-canvas__shell { position: relative; min-width: 100%; min-height: 100%; }
  .dz-lesson-canvas__world { position: absolute; top: 0; left: 0; overflow: hidden; background-color: var(--dz-surface-canvas); background-image: radial-gradient(circle, var(--dz-grid-dot) 1.1px, transparent 1.1px); background-size: 22px 22px; transform-origin: 0 0; }
  .dz-lesson-canvas__chapter { position: absolute; z-index: 0; border: 1px dashed color-mix(in srgb, var(--chapter-accent) 45%, var(--dz-border-subtle)); border-radius: var(--dz-radius-xl); background: color-mix(in srgb, var(--chapter-accent) 5%, transparent); pointer-events: none; }
  .dz-lesson-canvas__chapter.active { border-style: solid; background: color-mix(in srgb, var(--chapter-accent) 9%, transparent); }
  .dz-lesson-canvas__chapter > span { position: absolute; top: var(--dz-space-3); left: var(--dz-space-3); display: grid; gap: 1px; padding: var(--dz-space-2) var(--dz-space-3); border-radius: var(--dz-radius-sm); background: color-mix(in srgb, var(--dz-surface-panel) 92%, transparent); box-shadow: var(--dz-shadow-node); }
  .dz-lesson-canvas__chapter small { color: var(--chapter-accent); font-size: var(--dz-font-size-1); font-weight: var(--dz-weight-semibold); }.dz-lesson-canvas__chapter strong { font-size: var(--dz-font-size-2); }
  .dz-lesson-canvas__edges { position: absolute; inset: 0; z-index: var(--dz-layer-edge); overflow: visible; pointer-events: none; opacity: 0; transition: opacity var(--dz-duration-fast); }.ready .dz-lesson-canvas__edges { opacity: 1; }
  .dz-lesson-canvas__edges path { fill: none; stroke: var(--dz-edge); stroke-width: 2; vector-effect: non-scaling-stroke; }.dz-lesson-canvas__edges path.active { stroke: var(--dz-edge-active); stroke-width: 3; }.dz-lesson-canvas__edges marker path { fill: var(--dz-edge); stroke: none; }.dz-lesson-canvas__edges text { fill: var(--dz-text-tertiary); font: var(--dz-font-size-1) var(--dz-font-sans); text-anchor: middle; paint-order: stroke; stroke: var(--dz-surface-canvas); stroke-width: 5px; }
  .dz-lesson-canvas__node { position: absolute; z-index: var(--dz-layer-node); opacity: 0; transition: top var(--dz-duration-normal) var(--dz-ease-standard), left var(--dz-duration-normal) var(--dz-ease-standard), opacity var(--dz-duration-fast); }.ready .dz-lesson-canvas__node { opacity: 1; }
  .dz-lesson-canvas__controls { position: absolute; top: var(--dz-space-3); right: var(--dz-space-3); z-index: var(--dz-layer-overlay); display: flex; align-items: center; gap: 2px; padding: 3px; border: 1px solid var(--dz-border-subtle); border-radius: var(--dz-radius-md); background: color-mix(in srgb, var(--dz-surface-panel) 92%, transparent); box-shadow: var(--dz-shadow-node); backdrop-filter: blur(8px); }
  .dz-lesson-canvas__controls button { display: grid; min-width: 2rem; height: 2rem; place-items: center; padding: 0 var(--dz-space-2); border-radius: calc(var(--dz-radius-md) - 3px); background: var(--dz-surface-subtle); cursor: pointer; touch-action: manipulation; }.dz-lesson-canvas__controls output { min-width: 3.25rem; color: var(--dz-text-secondary); font-size: var(--dz-font-size-1); font-weight: var(--dz-weight-semibold); text-align: center; }
</style>
