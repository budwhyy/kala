// Order of relationship groups on a card. The headings themselves ("Children", "Parents"…) are
// interface strings and live in messages/*/core.json under `relations.<type>.<out|in>`.

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
