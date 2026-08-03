import type { Size } from './types.js';

export type LessonNodeKind =
  | 'summary'
  | 'metric'
  | 'accordion'
  | 'visual'
  | 'routes'
  | 'checklist'
  | 'table'
  | 'quote'
  | 'code';

export type LessonNodeContent =
  | { type: 'summary'; body: string }
  | { type: 'metric'; value: string; label: string; body?: string }
  | { type: 'accordion'; summary: string; body: string; detail?: string }
  | { type: 'visual'; label: string; description?: string }
  | { type: 'routes'; items: Array<{ label: string; value: string }> }
  | { type: 'checklist'; items: string[] }
  | { type: 'table'; columns: [string, string]; rows: Array<[string, string]> }
  | { type: 'quote'; quote: string; attribution?: string }
  | {
      type: 'code';
      language: string;
      filename: string;
      code: string;
      sections?: Array<{ id: string; title: string; startLine: number; endLine: number; description?: string }>;
    };

export interface LessonNode {
  id: string;
  title: string;
  stepId: string;
  order: number;
  content: LessonNodeContent;
  eyebrow?: string;
  description?: string;
  width?: number;
  offsetX?: number;
  accent?: string;
  metadata?: Record<string, unknown>;
}

export interface LessonEdge {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
  stepId?: string;
}

export interface LessonStep {
  id: string;
  chapterId: string;
  title: string;
  description: string;
  eyebrow?: string;
  metadata?: Record<string, unknown>;
}

export interface LessonChapter {
  id: string;
  title: string;
  stepIds: string[];
  summary?: string;
  accent?: string;
}

export interface Lesson {
  id: string;
  title: string;
  chapters: LessonChapter[];
  steps: LessonStep[];
  nodes: LessonNode[];
  edges: LessonEdge[];
  subject?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface LessonSnapshot {
  lesson: Lesson;
  step: LessonStep;
  stepIndex: number;
  chapter: LessonChapter;
  chapterIndex: number;
  chapterStepIndex: number;
  visibleNodes: LessonNode[];
  visibleEdges: LessonEdge[];
  activeNodeIds: string[];
  activeEdgeIds: string[];
  previousStepId: string | null;
  nextStepId: string | null;
}

export type LessonValidationCode =
  | 'duplicate-id'
  | 'missing-reference'
  | 'chapter-mismatch'
  | 'unassigned-step';

export interface LessonValidationIssue {
  code: LessonValidationCode;
  path: string;
  message: string;
}

function duplicateIds(items: Array<{ id: string }>, path: string): LessonValidationIssue[] {
  const seen = new Set<string>();
  const issues: LessonValidationIssue[] = [];
  items.forEach((item, index) => {
    if (seen.has(item.id)) {
      issues.push({ code: 'duplicate-id', path: `${path}[${index}].id`, message: `중복된 ID입니다: ${item.id}` });
    }
    seen.add(item.id);
  });
  return issues;
}

export function validateLesson(lesson: Lesson): LessonValidationIssue[] {
  const issues = [
    ...duplicateIds(lesson.chapters, 'chapters'),
    ...duplicateIds(lesson.steps, 'steps'),
    ...duplicateIds(lesson.nodes, 'nodes'),
    ...duplicateIds(lesson.edges, 'edges'),
  ];
  const chapterIds = new Set(lesson.chapters.map((chapter) => chapter.id));
  const stepById = new Map(lesson.steps.map((step) => [step.id, step]));
  const nodeIds = new Set(lesson.nodes.map((node) => node.id));
  const assignedSteps = new Map<string, string>();

  lesson.steps.forEach((step, index) => {
    if (!chapterIds.has(step.chapterId)) {
      issues.push({ code: 'missing-reference', path: `steps[${index}].chapterId`, message: `존재하지 않는 챕터입니다: ${step.chapterId}` });
    }
  });

  lesson.chapters.forEach((chapter, chapterIndex) => {
    chapter.stepIds.forEach((stepId, stepIndex) => {
      const step = stepById.get(stepId);
      if (!step) {
        issues.push({ code: 'missing-reference', path: `chapters[${chapterIndex}].stepIds[${stepIndex}]`, message: `존재하지 않는 스텝입니다: ${stepId}` });
        return;
      }
      if (step.chapterId !== chapter.id) {
        issues.push({ code: 'chapter-mismatch', path: `chapters[${chapterIndex}].stepIds[${stepIndex}]`, message: `${stepId}의 chapterId와 챕터 소속이 다릅니다.` });
      }
      const previous = assignedSteps.get(stepId);
      if (previous) {
        issues.push({ code: 'chapter-mismatch', path: `chapters[${chapterIndex}].stepIds[${stepIndex}]`, message: `${stepId}가 ${previous}와 ${chapter.id}에 중복으로 속해 있습니다.` });
      }
      assignedSteps.set(stepId, chapter.id);
    });
  });

  lesson.steps.forEach((step, index) => {
    if (!assignedSteps.has(step.id)) {
      issues.push({ code: 'unassigned-step', path: `steps[${index}]`, message: `챕터에 속하지 않은 스텝입니다: ${step.id}` });
    }
  });

  lesson.nodes.forEach((node, index) => {
    if (!stepById.has(node.stepId)) {
      issues.push({ code: 'missing-reference', path: `nodes[${index}].stepId`, message: `존재하지 않는 스텝입니다: ${node.stepId}` });
    }
  });

  lesson.edges.forEach((edge, index) => {
    if (!nodeIds.has(edge.sourceId)) {
      issues.push({ code: 'missing-reference', path: `edges[${index}].sourceId`, message: `존재하지 않는 시작 노드입니다: ${edge.sourceId}` });
    }
    if (!nodeIds.has(edge.targetId)) {
      issues.push({ code: 'missing-reference', path: `edges[${index}].targetId`, message: `존재하지 않는 도착 노드입니다: ${edge.targetId}` });
    }
    if (edge.stepId && !stepById.has(edge.stepId)) {
      issues.push({ code: 'missing-reference', path: `edges[${index}].stepId`, message: `존재하지 않는 스텝입니다: ${edge.stepId}` });
    }
  });

  return issues;
}

export function lessonStepOrder(lesson: Lesson): LessonStep[] {
  const stepById = new Map(lesson.steps.map((step) => [step.id, step]));
  return lesson.chapters.flatMap((chapter) => chapter.stepIds.flatMap((id) => {
    const step = stepById.get(id);
    return step ? [step] : [];
  }));
}

export function deriveLessonSnapshot(lesson: Lesson, requestedStepId?: string): LessonSnapshot {
  const steps = lessonStepOrder(lesson);
  if (!steps.length) throw new Error('강의에 스텝이 없습니다.');
  const stepIndex = requestedStepId ? steps.findIndex((step) => step.id === requestedStepId) : 0;
  if (stepIndex < 0) throw new Error(`강의에서 스텝을 찾을 수 없습니다: ${requestedStepId}`);
  const step = steps[stepIndex];
  const chapterIndex = lesson.chapters.findIndex((chapter) => chapter.id === step.chapterId);
  const chapter = lesson.chapters[chapterIndex];
  if (!chapter) throw new Error(`스텝의 챕터를 찾을 수 없습니다: ${step.chapterId}`);
  const orderByStepId = new Map(steps.map((item, index) => [item.id, index]));
  const visibleNodes = lesson.nodes.filter((node) => (orderByStepId.get(node.stepId) ?? Number.POSITIVE_INFINITY) <= stepIndex);
  const visibleNodeIds = new Set(visibleNodes.map((node) => node.id));
  const edgeStepIndex = (edge: LessonEdge) => edge.stepId
    ? orderByStepId.get(edge.stepId) ?? Number.POSITIVE_INFINITY
    : Math.max(
        orderByStepId.get(lesson.nodes.find((node) => node.id === edge.sourceId)?.stepId ?? '') ?? 0,
        orderByStepId.get(lesson.nodes.find((node) => node.id === edge.targetId)?.stepId ?? '') ?? 0,
      );
  const visibleEdges = lesson.edges.filter((edge) => visibleNodeIds.has(edge.sourceId) && visibleNodeIds.has(edge.targetId) && edgeStepIndex(edge) <= stepIndex);

  return {
    lesson,
    step,
    stepIndex,
    chapter,
    chapterIndex,
    chapterStepIndex: chapter.stepIds.indexOf(step.id),
    visibleNodes,
    visibleEdges,
    activeNodeIds: visibleNodes.filter((node) => node.stepId === step.id).map((node) => node.id),
    activeEdgeIds: visibleEdges.filter((edge) => edgeStepIndex(edge) === stepIndex).map((edge) => edge.id),
    previousStepId: steps[stepIndex - 1]?.id ?? null,
    nextStepId: steps[stepIndex + 1]?.id ?? null,
  };
}

const defaultNodeWidths: Record<LessonNodeKind, number> = {
  summary: 220,
  metric: 210,
  accordion: 250,
  visual: 240,
  routes: 260,
  checklist: 250,
  table: 250,
  quote: 260,
  code: 420,
};

export function lessonNodeWidth(node: LessonNode): number {
  return node.width ?? defaultNodeWidths[node.content.type];
}

export interface LessonFlowLayoutOptions {
  columnWidth?: number;
  rowGap?: number;
  paddingX?: number;
  paddingTop?: number;
  paddingBottom?: number;
  minWidth?: number;
  minHeight?: number;
}

export interface LessonNodePlacement extends Size {
  id: string;
  x: number;
  y: number;
  stageIndex: number;
}

export interface LessonChapterBounds {
  chapterId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LessonFlowLayout {
  ready: boolean;
  width: number;
  height: number;
  nodes: LessonNodePlacement[];
  chapters: LessonChapterBounds[];
}

export function layoutLessonFlow(
  snapshot: LessonSnapshot,
  measuredSizes: ReadonlyMap<string, Size>,
  options: LessonFlowLayoutOptions = {},
): LessonFlowLayout {
  const columnWidth = options.columnWidth ?? 340;
  const rowGap = options.rowGap ?? 18;
  const paddingX = options.paddingX ?? 32;
  const paddingTop = options.paddingTop ?? 92;
  const paddingBottom = options.paddingBottom ?? 48;
  const stepOrder = lessonStepOrder(snapshot.lesson);
  const stageByStepId = new Map(stepOrder.map((step, index) => [step.id, index]));
  const nodes: LessonNodePlacement[] = [];
  let maxRight = 0;
  let maxBottom = 0;

  const stages = [...new Set(snapshot.visibleNodes.map((node) => stageByStepId.get(node.stepId) ?? 0))].sort((a, b) => a - b);
  stages.forEach((stageIndex) => {
    let y = paddingTop;
    snapshot.visibleNodes
      .filter((node) => (stageByStepId.get(node.stepId) ?? 0) === stageIndex)
      .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
      .forEach((node) => {
        const measured = measuredSizes.get(node.id);
        const width = measured?.width || lessonNodeWidth(node);
        const height = measured?.height || 0;
        const x = paddingX + stageIndex * columnWidth + (node.offsetX ?? 0);
        nodes.push({ id: node.id, x, y, width, height, stageIndex });
        y += height + rowGap;
        maxRight = Math.max(maxRight, x + width);
        maxBottom = Math.max(maxBottom, y - rowGap);
      });
  });

  const height = Math.max(options.minHeight ?? 520, maxBottom + paddingBottom);
  const width = Math.max(options.minWidth ?? 720, maxRight + paddingX);
  const placementById = new Map(nodes.map((node) => [node.id, node]));
  const chapters = snapshot.lesson.chapters.flatMap((chapter) => {
    const members = snapshot.visibleNodes
      .filter((node) => chapter.stepIds.includes(node.stepId))
      .flatMap((node) => {
        const placement = placementById.get(node.id);
        return placement ? [placement] : [];
      });
    if (!members.length) return [];
    const left = Math.min(...members.map((node) => node.x)) - 16;
    const right = Math.max(...members.map((node) => node.x + node.width)) + 16;
    return [{ chapterId: chapter.id, x: left, y: 12, width: right - left, height: height - 24 }];
  });

  return {
    ready: snapshot.visibleNodes.every((node) => measuredSizes.has(node.id)),
    width,
    height,
    nodes,
    chapters,
  };
}
