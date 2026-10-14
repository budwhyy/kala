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

export const GROUP_STYLE: Record<NodeGroup, { label: string; token: string }> = {
  deity: { label: "Deities and devas", token: "--kala-gold" },
  asura: { label: "Asuras", token: "--kala-deep-red" },
  creature: { label: "Serpents, birds and other beings", token: "--kala-celestial" },
  sage: { label: "Sages and progenitors", token: "--kala-copper" },
  human: { label: "Manus and kings", token: "--kala-ink" },
  principle: { label: "Cosmic principles", token: "--kala-muted" },
};
