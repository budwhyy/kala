// Family forest for an epic (brief §6.5 "full family trees"): every person the epic's events involve,
// plus their ancestors and partners, arranged under one displayed parent each. Other parents (divine,
// legal, foster, or a rival account's father) are kept as annotations, never dropped. Pure.
import type { Relationship } from "@kala/schema";

export type OtherParent = {
  slug: string;
  role: string;
  mode: string;
  variant?: string | undefined;
};

export type FamilyNode = {
  slug: string;
  children: FamilyNode[];
  partners: string[];
  /** Parents other than the one this node is shown under. */
  otherParents: OtherParent[];
  /** Account of the parent link this node hangs from, if disputed. */
  variant?: string | undefined;
  /** True when this person or someone below them is one of the seeds (people in the story). */
  inStory: boolean;
};

/** Which parent link a child is drawn under: father before mother; legal/biological before others. */
const MODE_RANK: Record<string, number> = {
  legal: 0,
  biological: 1,
  adoptive: 2,
  foster: 3,
  mind_born: 4,
  other: 5,
  divine: 6,
};
const rank = (r: Relationship) =>
  (r.role === "father" ? 0 : 10) + (MODE_RANK[r.mode ?? "other"] ?? 5) + (r.variant ? 0.5 : 0);

export function familyForest(
  relationships: readonly Relationship[],
  seeds: Iterable<string>,
  { maxAncestors = 60 }: { maxAncestors?: number } = {},
): FamilyNode[] {
  const parentsOf = new Map<string, Relationship[]>();
  const partnersOf = new Map<string, Set<string>>();
  for (const r of relationships) {
    if (r.type === "parent") parentsOf.set(r.to, [...(parentsOf.get(r.to) ?? []), r]);
    if (r.type === "partner") {
      partnersOf.set(r.from, (partnersOf.get(r.from) ?? new Set()).add(r.to));
      partnersOf.set(r.to, (partnersOf.get(r.to) ?? new Set()).add(r.from));
    }
  }

  // People: seeds and all their ancestors (bounded, cycle-safe).
  const seedSet = new Set<string>(seeds);
  const people = new Set<string>(seedSet);
  const queue = [...people];
  let added = 0;
  while (queue.length > 0 && added < maxAncestors * 50) {
    const p = queue.shift()!;
    for (const r of parentsOf.get(p) ?? []) {
      if (!people.has(r.from)) {
        people.add(r.from);
        queue.push(r.from);
        added++;
      }
    }
  }

  // One displayed parent per person.
  const shownUnder = new Map<string, Relationship>();
  for (const child of people) {
    const candidates = (parentsOf.get(child) ?? [])
      .filter((r) => people.has(r.from))
      .sort((a, b) => rank(a) - rank(b));
    if (candidates[0]) shownUnder.set(child, candidates[0]);
  }
  const childrenOf = new Map<string, string[]>();
  for (const [child, r] of shownUnder)
    childrenOf.set(r.from, [...(childrenOf.get(r.from) ?? []), child]);

  const build = (slug: string, seen: Set<string>): FamilyNode => {
    seen.add(slug);
    const via = shownUnder.get(slug);
    const others = (parentsOf.get(slug) ?? [])
      .filter((r) => r !== via && people.has(r.from))
      .map((r) => ({ slug: r.from, role: r.role ?? "", mode: r.mode ?? "", variant: r.variant }));
    const kids = (childrenOf.get(slug) ?? []).filter((c) => !seen.has(c));
    // Partners: declared partners in the family, plus the other parents of this person's children.
    const partners = new Set<string>(
      [...(partnersOf.get(slug) ?? [])].filter((p) => people.has(p)),
    );
    for (const c of childrenOf.get(slug) ?? [])
      for (const r of parentsOf.get(c) ?? [])
        if (r.from !== slug && people.has(r.from) && r.mode !== "divine") partners.add(r.from);
    const children = kids.map((c) => build(c, seen));
    return {
      slug,
      variant: via?.variant,
      otherParents: others,
      partners: [...partners],
      children,
      inStory: seedSet.has(slug) || children.some((c) => c.inStory),
    };
  };

  const seen = new Set<string>();
  const roots = [...people].filter((p) => !shownUnder.has(p));
  const size = (n: FamilyNode): number => 1 + n.children.reduce((s, c) => s + size(c), 0);
  return roots
    .map((r) => build(r, seen))
    .filter((n) => n.children.length > 0)
    .sort((a, b) => size(b) - size(a) || a.slug.localeCompare(b.slug));
}

export function countNodes(nodes: readonly FamilyNode[]): number {
  return nodes.reduce((s, n) => s + 1 + countNodes(n.children), 0);
}
