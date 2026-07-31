import { zoomViewportAt } from './geometry.js';
import type {
  CanvasInteractionState,
  CanvasMode,
  CanvasTool,
  Point,
  Viewport,
} from './types.js';

export const CANVAS_NO_DRAG_ATTRIBUTE = 'data-canvas-no-drag';

export type CanvasInteractionEvent =
  | { type: 'tool.set'; tool: CanvasTool }
  | { type: 'node.hover'; nodeId: string | null }
  | { type: 'node.focus'; nodeId: string | null }
  | { type: 'node.select'; nodeId: string; additive?: boolean }
  | { type: 'selection.clear' }
  | { type: 'node.drag.start'; nodeId: string; pointerId: number; point: Point; additive?: boolean }
  | { type: 'canvas.pan.start'; pointerId: number; point: Point }
  | { type: 'pointer.move'; pointerId: number; point: Point }
  | { type: 'pointer.end'; pointerId: number }
  | { type: 'pointer.cancel'; pointerId: number }
  | { type: 'viewport.set'; viewport: Viewport }
  | { type: 'viewport.zoom'; point: Point; zoom: number }
  | { type: 'detail.open'; nodeId: string }
  | { type: 'detail.close' }
  | { type: 'cluster.review'; clusterId: string | null }
  | { type: 'escape' };

export function createInitialInteractionState(viewport: Viewport = { x: 0, y: 0, zoom: 1 }): CanvasInteractionState {
  return {
    tool: 'select',
    mode: 'idle',
    viewport,
    selectedNodeIds: [],
    hoveredNodeId: null,
    focusedNodeId: null,
    detailNodeId: null,
    reviewedClusterId: null,
    pointerSession: null,
  };
}

function passiveMode(state: CanvasInteractionState): CanvasMode {
  if (state.reviewedClusterId) return 'reviewing-cluster';
  if (state.hoveredNodeId) return 'hovering-node';
  return 'idle';
}

export function reduceCanvasInteraction(
  state: CanvasInteractionState,
  event: CanvasInteractionEvent,
): CanvasInteractionState {
  switch (event.type) {
    case 'tool.set':
      return { ...state, tool: event.tool, mode: event.tool === 'connect' ? 'connecting' : passiveMode(state), pointerSession: null };
    case 'node.hover':
      return { ...state, hoveredNodeId: event.nodeId, mode: state.pointerSession ? state.mode : event.nodeId ? 'hovering-node' : passiveMode({ ...state, hoveredNodeId: null }) };
    case 'node.focus':
      return { ...state, focusedNodeId: event.nodeId };
    case 'node.select': {
      const selected = event.additive
        ? state.selectedNodeIds.includes(event.nodeId)
          ? state.selectedNodeIds.filter((id) => id !== event.nodeId)
          : [...state.selectedNodeIds, event.nodeId]
        : [event.nodeId];
      return { ...state, selectedNodeIds: selected, focusedNodeId: event.nodeId };
    }
    case 'selection.clear':
      return { ...state, selectedNodeIds: [], focusedNodeId: null };
    case 'node.drag.start': {
      const selected = event.additive && state.selectedNodeIds.includes(event.nodeId)
        ? state.selectedNodeIds
        : [event.nodeId];
      return {
        ...state,
        mode: 'dragging-node',
        selectedNodeIds: selected,
        focusedNodeId: event.nodeId,
        pointerSession: {
          kind: 'node',
          pointerId: event.pointerId,
          nodeId: event.nodeId,
          origin: event.point,
          current: event.point,
          startViewport: state.viewport,
        },
      };
    }
    case 'canvas.pan.start':
      return {
        ...state,
        mode: 'panning-canvas',
        pointerSession: {
          kind: 'canvas',
          pointerId: event.pointerId,
          origin: event.point,
          current: event.point,
          startViewport: state.viewport,
        },
      };
    case 'pointer.move': {
      if (!state.pointerSession || state.pointerSession.pointerId !== event.pointerId) return state;
      const pointerSession = { ...state.pointerSession, current: event.point };
      const viewport = pointerSession.kind === 'canvas'
        ? {
            ...state.viewport,
            x: pointerSession.startViewport.x + event.point.x - pointerSession.origin.x,
            y: pointerSession.startViewport.y + event.point.y - pointerSession.origin.y,
          }
        : state.viewport;
      return { ...state, pointerSession, viewport };
    }
    case 'pointer.end':
    case 'pointer.cancel':
      if (!state.pointerSession || state.pointerSession.pointerId !== event.pointerId) return state;
      return { ...state, pointerSession: null, mode: passiveMode(state) };
    case 'viewport.set':
      return { ...state, viewport: event.viewport };
    case 'viewport.zoom':
      return { ...state, viewport: zoomViewportAt(state.viewport, event.point, event.zoom) };
    case 'detail.open':
      return { ...state, detailNodeId: event.nodeId };
    case 'detail.close':
      return { ...state, detailNodeId: null };
    case 'cluster.review':
      return { ...state, reviewedClusterId: event.clusterId, mode: event.clusterId ? 'reviewing-cluster' : passiveMode({ ...state, reviewedClusterId: null }) };
    case 'escape':
      return { ...state, mode: 'idle', pointerSession: null, selectedNodeIds: [], detailNodeId: null, reviewedClusterId: null };
  }
}

export interface CanvasInteractionStore {
  getState(): CanvasInteractionState;
  dispatch(event: CanvasInteractionEvent): CanvasInteractionState;
  subscribe(listener: (state: CanvasInteractionState) => void): () => void;
}

export function createCanvasInteraction(initial?: Partial<CanvasInteractionState>): CanvasInteractionStore {
  let state = { ...createInitialInteractionState(), ...initial };
  const listeners = new Set<(state: CanvasInteractionState) => void>();

  return {
    getState: () => state,
    dispatch(event) {
      const next = reduceCanvasInteraction(state, event);
      if (next !== state) {
        state = next;
        listeners.forEach((listener) => listener(state));
      }
      return state;
    },
    subscribe(listener) {
      listeners.add(listener);
      listener(state);
      return () => listeners.delete(listener);
    },
  };
}

export function pointerDelta(state: CanvasInteractionState): Point {
  const session = state.pointerSession;
  if (!session) return { x: 0, y: 0 };
  return {
    x: (session.current.x - session.origin.x) / session.startViewport.zoom,
    y: (session.current.y - session.origin.y) / session.startViewport.zoom,
  };
}

export type NodeInteractionState = 'idle' | 'hovered' | 'focused' | 'selected' | 'dragging' | 'disabled';

export function nodeInteractionState(
  state: CanvasInteractionState,
  nodeId: string,
  disabled = false,
): NodeInteractionState {
  if (disabled) return 'disabled';
  if (state.mode === 'dragging-node' && state.pointerSession?.nodeId === nodeId) return 'dragging';
  if (state.selectedNodeIds.includes(nodeId)) return 'selected';
  if (state.focusedNodeId === nodeId) return 'focused';
  if (state.hoveredNodeId === nodeId) return 'hovered';
  return 'idle';
}
