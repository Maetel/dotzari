import { nodeCenter } from './geometry.js';
import type {
  CanvasEdgeModel,
  CanvasNodeModel,
  ClusterOverride,
  ClusterSuggestion,
} from './types.js';

function pairCost(a: CanvasNodeModel, b: CanvasNodeModel, edges: CanvasEdgeModel[]): number {
  const ac = nodeCenter(a);
  const bc = nodeCenter(b);
  const distance = Math.hypot(ac.x - bc.x, ac.y - bc.y);
  const connected = edges.some((edge) =>
    (edge.sourceId === a.id && edge.targetId === b.id)
    || (edge.sourceId === b.id && edge.targetId === a.id));
  return distance - (connected ? 120 : 0) - (a.kind === b.kind ? 50 : 0);
}

function groupTopLevelNodes(nodes: CanvasNodeModel[], edges: CanvasEdgeModel[]): string[][] {
  if (nodes.length <= 2) return [nodes.map((node) => node.id)];

  if (nodes.length === 3) {
    const pairs = [[0, 1], [0, 2], [1, 2]]
      .sort((left, right) => pairCost(nodes[left[0]], nodes[left[1]], edges) - pairCost(nodes[right[0]], nodes[right[1]], edges));
    const selected = pairs[0];
    const rest = [0, 1, 2].find((index) => !selected.includes(index));
    return [[nodes[selected[0]].id, nodes[selected[1]].id], [nodes[rest ?? 0].id]];
  }

  if (nodes.length === 4) {
    const pairings = [
      [[0, 1], [2, 3]],
      [[0, 2], [1, 3]],
      [[0, 3], [1, 2]],
    ];
    const selected = pairings.sort((left, right) =>
      left.reduce((sum, pair) => sum + pairCost(nodes[pair[0]], nodes[pair[1]], edges), 0)
      - right.reduce((sum, pair) => sum + pairCost(nodes[pair[0]], nodes[pair[1]], edges), 0))[0];
    return selected.map((pair) => pair.map((index) => nodes[index].id));
  }

  const sorted = [...nodes].sort((a, b) => a.x - b.x || a.y - b.y || a.id.localeCompare(b.id));
  const count = Math.max(2, Math.ceil(sorted.length / 3));
  const seeds = Array.from({ length: count }, (_, groupIndex) =>
    sorted[Math.round(groupIndex * (sorted.length - 1) / (count - 1))]);
  const groups = seeds.map((seed) => [seed.id]);
  const seedIds = new Set(seeds.map((seed) => seed.id));

  for (const node of sorted.filter((candidate) => !seedIds.has(candidate.id))) {
    const closestSeed = seeds
      .map((seed, index) => ({ index, cost: pairCost(node, seed, edges) }))
      .sort((left, right) => left.cost - right.cost || left.index - right.index)[0];
    groups[closestSeed.index].push(node.id);
  }

  return groups;
}

function inferName(nodes: CanvasNodeModel[]): string {
  const titles = nodes.map((node) => node.title);
  const joined = titles.join(' ');
  if (/V8/.test(joined) && /Event Loop/.test(joined)) return 'JavaScript 실행 기반';
  if (/Node\.js/.test(joined) && /Runtime/.test(joined)) return 'Node.js 실행 환경';
  if (nodes.every((node) => node.kind === 'media')) return '보충 미디어';
  if (nodes.some((node) => node.kind === 'question')) return '이해 확인';
  return titles.slice(0, 2).join(' · ');
}

function stableClusterId(memberIds: string[]): string {
  return `cluster:${[...memberIds].sort().join('|')}`;
}

export function deriveClusterSuggestions(
  nodes: CanvasNodeModel[],
  edges: CanvasEdgeModel[],
  overrides: Record<string, ClusterOverride> = {},
): ClusterSuggestion[] {
  const topLevel = nodes.filter((node) => !node.parentId);
  const groups = groupTopLevelNodes(topLevel, edges);

  for (const child of nodes.filter((node) => node.parentId)) {
    const parentGroup = groups.find((group) => group.includes(child.parentId ?? ''));
    parentGroup?.push(child.id);
  }

  return groups.map((initialMemberIds, index) => {
    const id = stableClusterId(initialMemberIds);
    const memberIds = overrides[id]?.memberIds ?? initialMemberIds;
    const members = memberIds
      .map((memberId) => nodes.find((node) => node.id === memberId))
      .filter((node): node is CanvasNodeModel => Boolean(node));
    const topMembers = members.filter((node) => !node.parentId);
    const center = topMembers.length
      ? topMembers.reduce((sum, node) => {
          const center = nodeCenter(node);
          return { x: sum.x + center.x / topMembers.length, y: sum.y + center.y / topMembers.length };
        }, { x: 0, y: 0 })
      : { x: 0, y: 0 };

    return {
      id,
      name: overrides[id]?.name ?? inferName(members),
      memberIds,
      center,
      reason: index % 2 === 0 ? '위치와 역할이 가까워요' : '연결 관계와 내용이 가까워요',
    };
  });
}
