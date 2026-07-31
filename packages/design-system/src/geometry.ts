import type { CanvasNodeModel, Point, Viewport } from './types.js';

export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 1.6;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function screenToCanvas(point: Point, viewport: Viewport): Point {
  return {
    x: (point.x - viewport.x) / viewport.zoom,
    y: (point.y - viewport.y) / viewport.zoom,
  };
}

export function canvasToScreen(point: Point, viewport: Viewport): Point {
  return {
    x: point.x * viewport.zoom + viewport.x,
    y: point.y * viewport.zoom + viewport.y,
  };
}

export function zoomViewportAt(
  viewport: Viewport,
  screenPoint: Point,
  requestedZoom: number,
  limits: { min?: number; max?: number } = {},
): Viewport {
  const zoom = clamp(requestedZoom, limits.min ?? MIN_ZOOM, limits.max ?? MAX_ZOOM);
  const canvasPoint = screenToCanvas(screenPoint, viewport);
  return {
    zoom,
    x: screenPoint.x - canvasPoint.x * zoom,
    y: screenPoint.y - canvasPoint.y * zoom,
  };
}

export function nodeCenter(node: CanvasNodeModel): Point {
  return {
    x: node.x + node.width / 2,
    y: node.y + node.height / 2,
  };
}

export function nodeBoundaryAnchor(node: CanvasNodeModel, toward: Point): Point {
  const center = nodeCenter(node);
  const dx = toward.x - center.x;
  const dy = toward.y - center.y;

  if (dx === 0 && dy === 0) return center;

  const scale = 1 / Math.max(
    Math.abs(dx) / (node.width / 2),
    Math.abs(dy) / (node.height / 2),
  );

  return {
    x: center.x + dx * scale,
    y: center.y + dy * scale,
  };
}

export interface EdgeGeometry {
  path: string;
  label: Point;
  source: Point;
  target: Point;
}

export function bezierEdgeGeometry(sourceNode: CanvasNodeModel, targetNode: CanvasNodeModel): EdgeGeometry {
  const sourceCenter = nodeCenter(sourceNode);
  const targetCenter = nodeCenter(targetNode);
  const source = nodeBoundaryAnchor(sourceNode, targetCenter);
  const target = nodeBoundaryAnchor(targetNode, sourceCenter);
  const horizontal = Math.abs(target.x - source.x) >= Math.abs(target.y - source.y);
  const bend = Math.max(28, (horizontal ? Math.abs(target.x - source.x) : Math.abs(target.y - source.y)) * 0.42);

  const controls = horizontal
    ? [source.x + Math.sign(target.x - source.x) * bend, source.y, target.x - Math.sign(target.x - source.x) * bend, target.y]
    : [source.x, source.y + Math.sign(target.y - source.y) * bend, target.x, target.y - Math.sign(target.y - source.y) * bend];

  return {
    path: `M ${source.x} ${source.y} C ${controls[0]} ${controls[1]}, ${controls[2]} ${controls[3]}, ${target.x} ${target.y}`,
    label: { x: (source.x + target.x) / 2, y: (source.y + target.y) / 2 },
    source,
    target,
  };
}

export function keyboardNudge(key: string, shiftKey: boolean, grid = 8): Point | null {
  const distance = grid * (shiftKey ? 10 : 1);
  if (key === 'ArrowLeft') return { x: -distance, y: 0 };
  if (key === 'ArrowRight') return { x: distance, y: 0 };
  if (key === 'ArrowUp') return { x: 0, y: -distance };
  if (key === 'ArrowDown') return { x: 0, y: distance };
  return null;
}
