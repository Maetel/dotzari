import { describe, expect, it } from 'vitest';
import { deriveLessonSnapshot, layoutLessonFlow, validateLesson, type Lesson } from './lesson.js';

const lesson: Lesson = {
  id: 'request-flow',
  title: '요청 흐름',
  chapters: [
    { id: 'input', title: '입력', stepIds: ['source', 'parse'] },
    { id: 'result', title: '결과', stepIds: ['respond'] },
  ],
  steps: [
    { id: 'source', chapterId: 'input', title: '소스', description: '입력을 모읍니다.' },
    { id: 'parse', chapterId: 'input', title: '해석', description: '입력을 해석합니다.' },
    { id: 'respond', chapterId: 'result', title: '응답', description: '결과를 보냅니다.' },
  ],
  nodes: [
    { id: 'code', title: '코드', stepId: 'source', order: 0, content: { type: 'summary', body: '시작점' } },
    { id: 'parser', title: '파서', stepId: 'parse', order: 0, content: { type: 'accordion', summary: '구문 분석', body: '토큰을 읽습니다.' } },
    { id: 'response', title: '응답', stepId: 'respond', order: 0, content: { type: 'metric', value: '200', label: '상태 코드' } },
  ],
  edges: [
    { id: 'code-parser', sourceId: 'code', targetId: 'parser' },
    { id: 'parser-response', sourceId: 'parser', targetId: 'response', stepId: 'respond' },
  ],
};

describe('lesson model', () => {
  it('validates chapter, step, node and edge references', () => {
    expect(validateLesson(lesson)).toEqual([]);
    expect(validateLesson({ ...lesson, nodes: [...lesson.nodes, { ...lesson.nodes[0], id: 'broken', stepId: 'missing' }] }))
      .toEqual(expect.arrayContaining([expect.objectContaining({ code: 'missing-reference', path: 'nodes[3].stepId' })]));
  });

  it('derives the visible graph and chapter-relative progress', () => {
    const snapshot = deriveLessonSnapshot(lesson, 'parse');
    expect(snapshot.chapter.id).toBe('input');
    expect(snapshot.chapterStepIndex).toBe(1);
    expect(snapshot.visibleNodes.map((node) => node.id)).toEqual(['code', 'parser']);
    expect(snapshot.visibleEdges.map((edge) => edge.id)).toEqual(['code-parser']);
    expect(snapshot.previousStepId).toBe('source');
    expect(snapshot.nextStepId).toBe('respond');
  });

  it('places measured nodes in rightward step columns and sizes chapter bounds from them', () => {
    const snapshot = deriveLessonSnapshot(lesson, 'respond');
    const sizes = new Map([
      ['code', { width: 200, height: 90 }],
      ['parser', { width: 240, height: 130 }],
      ['response', { width: 180, height: 100 }],
    ]);
    const layout = layoutLessonFlow(snapshot, sizes, { columnWidth: 300, paddingX: 20, paddingTop: 60 });
    expect(layout.ready).toBe(true);
    expect(layout.nodes.map((node) => node.x)).toEqual([20, 320, 620]);
    expect(layout.chapters).toHaveLength(2);
    expect(layout.chapters[0].width).toBeGreaterThan(500);
    expect(layout.height).toBeGreaterThanOrEqual(520);
  });
});
