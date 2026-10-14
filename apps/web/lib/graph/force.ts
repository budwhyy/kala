// 3D force-directed layout for the genealogy constellation. Runs in a Web Worker
// (workers/layout.worker.ts) so large graphs never block the page; this module is shared.
import { forceCenter, forceLink, forceManyBody, forceSimulation, type SimNode } from "d3-force-3d";

export type LayoutInput = { nodes: string[]; links: [string, string][] };
export type Positions = Record<string, [number, number, number]>;

/** Radius the finished layout is scaled to, so the camera always frames the whole graph. */
export const LAYOUT_RADIUS = 10;

export function runLayout({ nodes, links }: LayoutInput, ticks = 300): Positions {
  const simNodes: SimNode[] = nodes.map((id) => ({ id }));
  const simLinks = links.map(([source, target]) => ({ source, target }));
  forceSimulation(simNodes, 3)
    .force(
      "link",
      forceLink(simLinks)
        .id((n) => n.id)
        .distance(3)
        .strength(0.5),
    )
    .force("charge", forceManyBody().strength(-40))
    .force("center", forceCenter(0, 0, 0))
    .stop()
    .tick(ticks);
  return fit(Object.fromEntries(simNodes.map((n) => [n.id, [n.x ?? 0, n.y ?? 0, n.z ?? 0]])));
}

/**
 * Centre on the origin and scale so 85% of nodes sit within LAYOUT_RADIUS. Using a percentile
 * rather than the farthest node keeps long chains (royal lines) from squashing the dense core.
 */
function fit(pos: Positions): Positions {
  const pts = Object.values(pos);
  if (pts.length === 0) return pos;
  const c = [0, 1, 2].map((i) => pts.reduce((s, p) => s + p[i]!, 0) / pts.length);
  const radii = pts
    .map((p) => Math.hypot(p[0] - c[0]!, p[1] - c[1]!, p[2] - c[2]!))
    .sort((a, b) => a - b);
  const typical = Math.max(1e-6, radii[Math.floor((radii.length - 1) * 0.85)]!);
  const k = LAYOUT_RADIUS / typical;
  return Object.fromEntries(
    Object.entries(pos).map(([id, p]) => [
      id,
      [(p[0] - c[0]!) * k, (p[1] - c[1]!) * k, (p[2] - c[2]!) * k] as [number, number, number],
    ]),
  );
}

/** Lay out in a worker when available; fall back to the main thread. */
export function layoutInWorker(input: LayoutInput): Promise<Positions> {
  if (typeof Worker === "undefined") return Promise.resolve(runLayout(input));
  return new Promise((resolve) => {
    try {
      const worker = new Worker(new URL("../../workers/layout.worker.ts", import.meta.url));
      worker.onmessage = (e: MessageEvent<Positions>) => {
        resolve(e.data);
        worker.terminate();
      };
      worker.onerror = () => {
        worker.terminate();
        resolve(runLayout(input));
      };
      worker.postMessage(input);
    } catch {
      resolve(runLayout(input));
    }
  });
}
