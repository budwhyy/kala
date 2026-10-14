// Relationship trace (brief §6.3): all shortest paths between two entities across familial,
// narrative and spiritual edges. Edges are traversed in either direction. Parallel edges (the same
// pair linked in two accounts) yield separate paths, so variant differences stay visible.
import type { Relationship } from "@kala/schema";

/** Anything with the shape of a relationship edge (full records on the server, slim ones in the browser). */
export type Edge = { from: string; to: string; variant?: string | undefined };
export type Step<R extends Edge = Relationship> = { relationship: R; from: string; to: string };
export type Path<R extends Edge = Relationship> = Step<R>[];

export type TraceOptions = {
  /** Variants whose claims are hidden. Variant-less (undisputed) claims are always used. */
  excludeVariants?: ReadonlySet<string>;
  maxPaths?: number;
  maxDepth?: number;
};

export function tracePaths<R extends Edge>(
  relationships: readonly R[],
  start: string,
  goal: string,
  { excludeVariants = new Set(), maxPaths = 6, maxDepth = 12 }: TraceOptions = {},
): Path<R>[] {
  if (start === goal) return [];
  const adjacency = new Map<string, Step<R>[]>();
  const add = (s: Step<R>) => adjacency.set(s.from, [...(adjacency.get(s.from) ?? []), s]);
  for (const r of relationships) {
    if (r.variant && excludeVariants.has(r.variant)) continue;
    add({ relationship: r, from: r.from, to: r.to });
    add({ relationship: r, from: r.to, to: r.from });
  }

  // Breadth-first search recording every predecessor step on a shortest route.
  const depth = new Map<string, number>([[start, 0]]);
  const preds = new Map<string, Step<R>[]>();
  let frontier = [start];
  while (frontier.length > 0 && !depth.has(goal)) {
    const next: string[] = [];
    for (const node of frontier) {
      const d = depth.get(node)!;
      if (d >= maxDepth) continue;
      for (const step of adjacency.get(node) ?? []) {
        const seen = depth.get(step.to);
        if (seen === undefined) {
          depth.set(step.to, d + 1);
          next.push(step.to);
        }
        if (seen === undefined || seen === d + 1) {
          preds.set(step.to, [...(preds.get(step.to) ?? []), step]);
        }
      }
    }
    frontier = next;
  }
  if (!depth.has(goal)) return [];

  // Walk predecessors back from the goal to enumerate the paths.
  const paths: Path<R>[] = [];
  const walk = (node: string, suffix: Step<R>[]) => {
    if (paths.length >= maxPaths) return;
    if (node === start) {
      paths.push(suffix);
      return;
    }
    for (const step of preds.get(node) ?? []) walk(step.from, [step, ...suffix]);
  };
  walk(goal, []);
  return paths;
}

/** Plain-English verb for a relationship, read from its `from` to its `to`. */
export const VERB: Record<Relationship["type"], string> = {
  parent: "parent of",
  partner: "partner of",
  sibling: "sibling of",
  teacher: "teacher of",
  ally: "ally of",
  enemy: "enemy of",
  curse: "cursed",
  blessing: "blessed",
  avatar_of: "avatar of",
  manifestation_of: "manifestation of",
  aspect_of: "aspect of",
  identified_with: "identified with",
  vahana_of: "mount of",
  descendant_of: "descendant of",
  member_of: "member of",
};

export type EdgeFamily = "family" | "narrative" | "spiritual";
export const EDGE_FAMILY: Record<Relationship["type"], EdgeFamily> = {
  parent: "family",
  partner: "family",
  sibling: "family",
  descendant_of: "family",
  teacher: "narrative",
  ally: "narrative",
  enemy: "narrative",
  curse: "narrative",
  blessing: "narrative",
  vahana_of: "narrative",
  avatar_of: "spiritual",
  manifestation_of: "spiritual",
  aspect_of: "spiritual",
  identified_with: "spiritual",
  member_of: "spiritual",
};
