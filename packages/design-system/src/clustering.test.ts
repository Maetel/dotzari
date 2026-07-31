import { describe, expect, it } from 'vitest';
import { deriveClusterSuggestions } from './clustering.js';
import type { CanvasEdgeModel, CanvasNodeModel } from './types.js';

const nodes: CanvasNodeModel[] = [
  { id: 'node', title: 'Node.js', kind: 'concept', x: 320, y: 170, width: 180, height: 150 },
  { id: 'runtime', title: 'Runtime', kind: 'data', x: 340, y: 410, width: 150, height: 100 },
  { id: 'v8', title: 'V8', kind: 'concept', x: 70, y: 90, width: 130, height: 100 },
  { id: 'loop', title: 'Event Loop', kind: 'concept', x: 650, y: 90, width: 150, height: 100 },
  { id: 'npm', parentId: 'node', title: 'npm', kind: 'concept', x: 0, y: 0, width: 80, height: 48 },
  { id: 'npx', parentId: 'node', title: 'npx', kind: 'concept', x: 0, y: 0, width: 80, height: 48 },
];

const edges: CanvasEdgeModel[] = [
  { id: 'v8-node', sourceId: 'v8', targetId: 'node' },
  { id: 'node-loop', sourceId: 'node', targetId: 'loop' },
  { id: 'node-runtime', sourceId: 'node', targetId: 'runtime' },
];

describe('automatic cluster suggestions', () => {
  it('is stable for the same input and keeps children with the parent', () => {
    const first = deriveClusterSuggestions(nodes, edges);
    const second = deriveClusterSuggestions(nodes, edges);
    expect(first.map((cluster) => cluster.id)).toEqual(second.map((cluster) => cluster.id));

    const parentCluster = first.find((cluster) => cluster.memberIds.includes('node'));
    expect(parentCluster?.memberIds).toEqual(expect.arrayContaining(['npm', 'npx']));
  });

  it('applies producer name and membership overrides without changing the suggestion id', () => {
    const initial = deriveClusterSuggestions(nodes, edges);
    const target = initial[0];
    const overridden = deriveClusterSuggestions(nodes, edges, {
      [target.id]: { name: '실행 도구', memberIds: ['node', 'npm', 'npx'] },
    });
    const result = overridden.find((cluster) => cluster.id === target.id);
    expect(result?.name).toBe('실행 도구');
    expect(result?.memberIds).toEqual(['node', 'npm', 'npx']);
  });

  it('places larger sets around spatially separated seeds instead of interleaving neighbors', () => {
    const expandedNodes = [
      ...nodes,
      { id: 'media', title: '보충 영상', kind: 'media' as const, x: 760, y: 320, width: 160, height: 100 },
    ];
    const suggestions = deriveClusterSuggestions(expandedNodes, edges);
    const centers = suggestions.map((cluster) => cluster.center.x).sort((a, b) => a - b);

    expect(suggestions).toHaveLength(2);
    expect(centers[1] - centers[0]).toBeGreaterThan(240);
  });
});
