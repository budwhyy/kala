// UI headings for relationship types, seen from the entity being viewed. These are interface
// strings, not mythological data: what each relationship *is* comes from content/.
import type { RelationshipType } from "@kala/schema";

type Heading = { out: string; in: string };

export const RELATION_HEADINGS: Record<RelationshipType, Heading> = {
  parent: { out: "Children", in: "Parents" },
  partner: { out: "Partners", in: "Partners" },
  sibling: { out: "Siblings", in: "Siblings" },
  teacher: { out: "Students", in: "Teachers" },
  ally: { out: "Allies", in: "Allies" },
  enemy: { out: "Enemies", in: "Enemies" },
  curse: { out: "Cursed", in: "Cursed by" },
  blessing: { out: "Blessed", in: "Blessed by" },
  avatar_of: { out: "Avatar of", in: "Avatars" },
  manifestation_of: { out: "Manifestation of", in: "Manifestations" },
  aspect_of: { out: "Aspect of", in: "Aspects" },
  identified_with: { out: "Identified with", in: "Identified with" },
  vahana_of: { out: "Mount (vahana) of", in: "Mount (vahana)" },
  descendant_of: { out: "Descends from", in: "Descendants" },
  member_of: { out: "Member of", in: "Members" },
};

/** Order in which relationship groups appear on a card: family first, then narrative, then spiritual. */
export const RELATION_ORDER: string[] = [
  "parent:in",
  "partner:out",
  "sibling:out",
  "parent:out",
  "descendant_of:out",
  "descendant_of:in",
  "member_of:out",
  "member_of:in",
  "teacher:in",
  "teacher:out",
  "ally:out",
  "enemy:out",
  "curse:out",
  "curse:in",
  "blessing:out",
  "blessing:in",
  "vahana_of:out",
  "vahana_of:in",
  "avatar_of:out",
  "avatar_of:in",
  "manifestation_of:out",
  "manifestation_of:in",
  "aspect_of:out",
  "aspect_of:in",
  "identified_with:out",
];
