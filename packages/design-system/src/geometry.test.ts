import { describe, expect, it } from 'vitest';
import {
  bezierEdgeGeometry,
  canvasToScreen,
  keyboardNudge,
  screenToCanvas,
  shouldAutoFocusCanvas,
  visibleViewportAxis,
  worldBoundsToScrollOffset,
  zoomViewportAt,
} from './geometry.js';
import type { CanvasNodeModel } from './types.js';

describe('canvas geometry', () => {
  it('round-trips between screen and canvas coordinates', () => {
    const viewport = { x: 24, y: -16, zoom: 1.25 };
    const canvas = { x: 80, y: 32 };
    expect(screenToCanvas(canvasToScreen(canvas, viewport), viewport)).toEqual(canvas);
  });

  it('keeps the canvas point under the cursor fixed while zooming', () => {
    const viewport = { x: 10, y: 20, zoom: 1 };
    const cursor = { x: 210, y: 120 };
    const before = screenToCanvas(cursor, viewport);
    const next = zoomViewportAt(viewport, cursor, 1.4);
    expect(screenToCanvas(cursor, next)).toEqual(before);
  });

  it('centers measured world bounds in a mobile viewport after scaling', () => {
    const bounds = { x: 372, y: 92, width: 260, height: 540 };
    const offset = worldBoundsToScrollOffset(
      bounds,
      0.72,
      { width: 390, height: 786 },
      { width: 1040, height: 920 },
    );

    const screenLeft = bounds.x * 0.72 - offset.x;
    expect(screenLeft).toBeCloseTo((390 - bounds.width * 0.72) / 2);
    expect(offset.x).toBeCloseTo(166.44);
  });

  it('centers bounds in the part of a canvas visible through browser zoom', () => {
    const bounds = { x: 372, y: 92, width: 260, height: 540 };
    const visible = visibleViewportAxis(1, 388, 0, 300);
    const offset = worldBoundsToScrollOffset(
      bounds,
      0.72,
      { width: visible.size, height: 786 },
      { width: 1101, height: 920 },
      {
        viewportOffset: { x: visible.offset, y: 0 },
        scrollViewportSize: { width: 388, height: 786 },
      },
    );

    const screenLeft = bounds.x * 0.72 - offset.x - visible.offset;
    expect(visible).toEqual({ offset: 0, size: 299 });
    expect(visibleViewportAxis(1, 388, 70, 300)).toEqual({ offset: 69, size: 300 });
    expect(screenLeft).toBeCloseTo((visible.size - bounds.width * 0.72) / 2);
    expect(offset.x).toBeCloseTo(211.94);
  });

  it('clamps first-column focus at the world origin instead of creating a mobile-only origin', () => {
    expect(worldBoundsToScrollOffset(
      { x: 32, y: 92, width: 390, height: 500 },
      0.72,
      { width: 390, height: 786 },
      { width: 1040, height: 920 },
    ).x).toBe(0);
  });

  it('refocuses while a mobile viewport settles but preserves a user-controlled camera', () => {
    const initial = { stepId: 'execute', viewportWidth: 590 };
    const settled = { stepId: 'execute', viewportWidth: 390 };
    expect(shouldAutoFocusCanvas(initial, settled, false)).toBe(true);
    expect(shouldAutoFocusCanvas(initial, settled, true)).toBe(false);
    expect(shouldAutoFocusCanvas(settled, { stepId: 'delegate', viewportWidth: 390 }, false)).toBe(true);
    expect(shouldAutoFocusCanvas(settled, { stepId: 'delegate', viewportWidth: 390 }, true)).toBe(false);
    expect(shouldAutoFocusCanvas(settled, { ...settled, viewportOffsetX: 40 }, false)).toBe(true);
  });

  it('attaches edge endpoints to node boundaries', () => {
    const source: CanvasNodeModel = { id: 'a', title: 'A', x: 0, y: 0, width: 100, height: 80 };
    const target: CanvasNodeModel = { id: 'b', title: 'B', x: 300, y: 20, width: 120, height: 90 };
    const edge = bezierEdgeGeometry(source, target);
    expect(edge.source.x).toBe(100);
    expect(edge.target.x).toBe(300);
    expect(edge.path.startsWith('M 100')).toBe(true);
  });

  it('uses grid and accelerated keyboard nudges', () => {
    expect(keyboardNudge('ArrowLeft', false, 8)).toEqual({ x: -8, y: 0 });
    expect(keyboardNudge('ArrowDown', true, 8)).toEqual({ x: 0, y: 80 });
    expect(keyboardNudge('Enter', false, 8)).toBeNull();
  });
});
