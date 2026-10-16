// Multilingual name search (English, Hindi/Devanagari, IAST) over a compact index built at
// build time. Diacritics are folded so "kasyapa" finds "Kaśyapa".
import type { CollectionName, Name } from "@kala/schema";
import { displayName, hrefFor, type Kala } from "../graph/kala";

export type SearchItem = {
  type: CollectionName;
  slug: string;
  href: string;
  label: string;
  /** Devanagari or IAST form shown under the label. */
  sub?: string;
  /** Folded search keys (all names, epithets, IAST). */
  keys: string[];
};

/** Lowercase, strip diacritics, and simplify common IAST spellings (ś/ṣ → s, ṛ → r…). */
export function fold(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/sh/g, "s")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const SEARCHABLE: CollectionName[] = [
  "entities",
  "places",
  "kingdoms",
  "dynasties",
  "texts",
  "traditions",
  "variants",
  "events",
  "concepts",
  "networks",
  "journeys",
  "routes",
  "battlefields",
];

export function buildSearchIndex(kala: Kala): SearchItem[] {
  const items: SearchItem[] = [];
  for (const type of SEARCHABLE) {
    for (const record of kala.dataset[type] as {
      slug: string;
      names: Name[];
      epithets?: Name[];
    }[]) {
      const href = hrefFor(type, record.slug);
      if (!href) continue;
      const all = [...record.names, ...(record.epithets ?? [])];
      const deva = record.names.find((n) => n.script === "Deva");
      const keys = new Set<string>([fold(record.slug.replace(/-/g, " "))]);
      for (const n of all) {
        keys.add(fold(n.text));
        if (n.iast) keys.add(fold(n.iast));
        if (n.script === "Deva") keys.add(n.text);
      }
      items.push({
        type,
        slug: record.slug,
        href,
        label: kala.nameOf(type, record.slug),
        ...(kala.locale === "hi"
          ? { sub: displayName(record.names, "en") }
          : deva
            ? { sub: deva.iast ? `${deva.text} · ${deva.iast}` : deva.text }
            : {}),
        keys: [...keys],
      });
    }
  }
  return items;
}

/** Rank: exact > prefix > word prefix > substring. Returns at most `limit` items. */
export function search(items: SearchItem[], query: string, limit = 20): SearchItem[] {
  const q = /[ऀ-ॿ]/.test(query) ? query.trim() : fold(query);
  if (!q) return [];
  const scored: { item: SearchItem; score: number }[] = [];
  for (const item of items) {
    let best = 0;
    for (const k of item.keys) {
      if (k === q) best = Math.max(best, 4);
      else if (k.startsWith(q)) best = Math.max(best, 3);
      else if (k.split(" ").some((w) => w.startsWith(q))) best = Math.max(best, 2);
      else if (k.includes(q)) best = Math.max(best, 1);
    }
    if (best > 0) scored.push({ item, score: best });
  }
  return scored
    .sort((a, b) => b.score - a.score || a.item.label.localeCompare(b.item.label))
    .slice(0, limit)
    .map((s) => s.item);
}
