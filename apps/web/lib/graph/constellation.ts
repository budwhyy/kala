// Serializable graph handed from the server page to the client constellation.
import type { EntityKind, RelationshipType } from "@kala/schema";

export type NodeGroup = "deity" | "asura" | "creature" | "sage" | "human" | "principle";

export type CNode = {
  slug: string;
  label: string;
  sub?: string | undefined;
  group: NodeGroup;
  degree: number;
  summary: string;
};

export type Cite = { text: string; href: string };

export type CEdge = {
  id: string;
  from: string;
  to: string;
  type: RelationshipType;
  variant?: string | undefined;
  explanation: string;
  cites: Cite[];
};

const GROUP_OF: Partial<Record<EntityKind, NodeGroup>> = {
  principle: "principle",
  asura: "asura",
  daitya: "asura",
  danava: "asura",
  rakshasa: "asura",
  naga: "creature",
  suparna: "creature",
  vanara: "creature",
  rishi: "sage",
  prajapati: "sage",
  human: "human",
  king: "human",
  manu: "human",
};

export function groupOf(kinds: EntityKind[]): NodeGroup {
  for (const k of kinds) {
    const g = GROUP_OF[k];
    if (g) return g;
  }
  return "deity";
}

/** Palette token per node group. Legend labels are in messages under `enums.group.<group>`. */
export const GROUP_STYLE: Record<NodeGroup, { token: string }> = {
  deity: { token: "--kala-gold" },
  asura: { token: "--kala-deep-red" },
  creature: { token: "--kala-celestial" },
  sage: { token: "--kala-copper" },
  human: { token: "--kala-ink" },
  principle: { token: "--kala-muted" },
};
