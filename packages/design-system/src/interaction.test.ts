import { describe, expect, it } from 'vitest';
import {
  createCanvasInteraction,
  createInitialInteractionState,
  nodeInteractionState,
  pointerDelta,
  reduceCanvasInteraction,
} from './interaction.js';

describe('canvas interaction state', () => {
  it('moves through select, drag and commit-ready states', () => {
    const store = createCanvasInteraction();
    store.dispatch({ type: 'node.select', nodeId: 'node' });
    store.dispatch({ type: 'node.drag.start', nodeId: 'node', pointerId: 4, point: { x: 100, y: 80 } });
    store.dispatch({ type: 'pointer.move', pointerId: 4, point: { x: 132, y: 96 } });

    expect(store.getState().mode).toBe('dragging-node');
    expect(pointerDelta(store.getState())).toEqual({ x: 32, y: 16 });
    expect(nodeInteractionState(store.getState(), 'node')).toBe('dragging');

    store.dispatch({ type: 'pointer.end', pointerId: 4 });
    expect(store.getState().mode).toBe('idle');
    expect(store.getState().selectedNodeIds).toEqual(['node']);
  });

  it('pans from the session start viewport and cancels safely', () => {
    let state = createInitialInteractionState({ x: 10, y: 20, zoom: 1 });
    state = reduceCanvasInteraction(state, { type: 'canvas.pan.start', pointerId: 2, point: { x: 40, y: 30 } });
    state = reduceCanvasInteraction(state, { type: 'pointer.move', pointerId: 2, point: { x: 70, y: 90 } });
    expect(state.viewport).toEqual({ x: 40, y: 80, zoom: 1 });
    state = reduceCanvasInteraction(state, { type: 'pointer.cancel', pointerId: 2 });
    expect(state.pointerSession).toBeNull();
    expect(state.mode).toBe('idle');
  });

  it('keeps detail and cluster review as explicit interaction state', () => {
    const store = createCanvasInteraction();
    store.dispatch({ type: 'detail.open', nodeId: 'npm' });
    expect(store.getState().detailNodeId).toBe('npm');
    store.dispatch({ type: 'cluster.review', clusterId: 'cluster:a|b' });
    expect(store.getState().mode).toBe('reviewing-cluster');
    store.dispatch({ type: 'escape' });
    expect(store.getState().detailNodeId).toBeNull();
    expect(store.getState().reviewedClusterId).toBeNull();
  });
});
