declare module "d3-force-3d" {
  // Minimal typing for the parts KĀLA uses.
  export type SimNode = { id: string; x?: number; y?: number; z?: number };
  export type SimLink = { source: string | SimNode; target: string | SimNode };
  type Force = { [key: string]: (...args: never[]) => unknown };
  export function forceSimulation(
    nodes: SimNode[],
    dims?: number,
  ): {
    force(name: string, f: unknown): ReturnType<typeof forceSimulation>;
    stop(): ReturnType<typeof forceSimulation>;
    tick(n?: number): ReturnType<typeof forceSimulation>;
  };
  export function forceLink(links: SimLink[]): {
    id(fn: (n: SimNode) => string): ReturnType<typeof forceLink>;
    distance(d: number): ReturnType<typeof forceLink>;
    strength(s: number): ReturnType<typeof forceLink>;
  } & Force;
  export function forceManyBody(): {
    strength(s: number): ReturnType<typeof forceManyBody>;
  } & Force;
  export function forceCenter(x?: number, y?: number, z?: number): Force;
}
