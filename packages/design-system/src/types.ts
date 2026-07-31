export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Viewport extends Point {
  zoom: number;
}

export type CanvasNodeKind = 'concept' | 'data' | 'media' | 'code' | 'question' | 'cluster';

export interface CanvasNodeModel extends Point, Size {
  id: string;
  title: string;
  eyebrow?: string;
  description?: string;
  kind?: CanvasNodeKind;
  parentId?: string;
  examples?: string[];
  locked?: boolean;
  disabled?: boolean;
  metadata?: Record<string, unknown>;
}

export interface CanvasEdgeModel {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
  active?: boolean;
}

export interface ClusterOverride {
  name?: string;
  memberIds?: string[];
}

export interface ClusterSuggestion {
  id: string;
  name: string;
  memberIds: string[];
  center: Point;
  reason: string;
}

export type CanvasTool = 'select' | 'pan' | 'connect';

export type CanvasMode =
  | 'idle'
  | 'hovering-node'
  | 'dragging-node'
  | 'panning-canvas'
  | 'connecting'
  | 'reviewing-cluster';

export interface PointerSession {
  kind: 'node' | 'canvas';
  pointerId: number;
  nodeId?: string;
  origin: Point;
  current: Point;
  startViewport: Viewport;
}

export interface CanvasInteractionState {
  tool: CanvasTool;
  mode: CanvasMode;
  viewport: Viewport;
  selectedNodeIds: string[];
  hoveredNodeId: string | null;
  focusedNodeId: string | null;
  detailNodeId: string | null;
  reviewedClusterId: string | null;
  pointerSession: PointerSession | null;
}
