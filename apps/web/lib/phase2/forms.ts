// Derives the Avatars-and-manifestations view from relationships (brief §6.6). Pure functions over
// the dataset: nothing about which avatar is first or which texts disagree is written here.
import type { Relationship } from "@kala/schema";

/** The four ways one being can be another's form. They mean different things and are never merged. */
export const FORM_TYPES = [
  "avatar_of",
  "manifestation_of",
  "aspect_of",
  "identified_with",
] as const;
export type FormType = (typeof FORM_TYPES)[number];
const isForm = (t: string): t is FormType => (FORM_TYPES as readonly string[]).includes(t);

export type ListEntry = { slug: string; position: number; relationship: Relationship };
export type OrderedList = {
  variant: string;
  principal: string;
  type: FormType;
  entries: ListEntry[];
};

/** Ordered lists: every `avatar_of`/`manifestation_of`/`aspect_of` with a variant and position. */
export function orderedLists(relationships: readonly Relationship[]): OrderedList[] {
  const groups = new Map<string, OrderedList>();
  for (const r of relationships) {
    if (!isForm(r.type) || r.type === "identified_with" || !r.variant || r.position === undefined)
      continue;
    const key = `${r.variant}|${r.to}|${r.type}`;
    const g = groups.get(key) ?? { variant: r.variant, principal: r.to, type: r.type, entries: [] };
    g.entries.push({ slug: r.from, position: r.position, relationship: r });
    groups.set(key, g);
  }
  return [...groups.values()]
    .map((g) => ({ ...g, entries: g.entries.sort((a, b) => a.position - b.position) }))
    .sort((a, b) => b.entries.length - a.entries.length || a.variant.localeCompare(b.variant));
}

export type ComparisonRow = {
  slug: string;
  /** Position in each list (by variant), or undefined when the list does not include the figure. */
  positions: Record<string, number | undefined>;
  /** In every one of the lists compared. */
  inAll: boolean;
};

/** Which figures each list names, and where — to show where accounts differ (e.g. Buddha / Balarama). */
export function compareLists(lists: readonly OrderedList[]): ComparisonRow[] {
  const rows = new Map<string, ComparisonRow>();
  for (const l of lists)
    for (const e of l.entries) {
      const row = rows.get(e.slug) ?? { slug: e.slug, positions: {}, inAll: false };
      row.positions[l.variant] = e.position;
      rows.set(e.slug, row);
    }
  return [...rows.values()]
    .map((r) => ({ ...r, inAll: lists.every((l) => r.positions[l.variant] !== undefined) }))
    .sort((a, b) => {
      const pa = Math.min(
        ...Object.values(a.positions).filter((n): n is number => n !== undefined),
      );
      const pb = Math.min(
        ...Object.values(b.positions).filter((n): n is number => n !== undefined),
      );
      return pa - pb || a.slug.localeCompare(b.slug);
    });
}

export type FormGroup = {
  principal: string;
  /** Relationships of each kind pointing at the principal, not part of an ordered list. */
  forms: Relationship[];
};

/**
 * Beings presented as forms of another (avatar, manifestation, aspect, identification) that are not
 * entries of an ordered list, grouped by the being they are a form of. Symmetric
 * `identified_with` is shown from both ends (so the group principal is whichever side is named).
 */
export function formGroups(relationships: readonly Relationship[]): FormGroup[] {
  const loose = relationships.filter(
    (r) => isForm(r.type) && !(r.position !== undefined && r.variant),
  );
  const groups = new Map<string, Relationship[]>();
  for (const r of loose) groups.set(r.to, [...(groups.get(r.to) ?? []), r]);
  return [...groups.entries()]
    .map(([principal, forms]) => ({ principal, forms }))
    .sort((a, b) => b.forms.length - a.forms.length || a.principal.localeCompare(b.principal));
}
