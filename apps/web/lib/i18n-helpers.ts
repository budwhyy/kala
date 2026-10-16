// Small helpers shared by server and client components for localised labels.
import type { Name } from "@kala/schema";

/** The subset of next-intl's translator that enum lookups need. */
export type Translator = { (key: string): string; has: (key: string) => boolean };

/**
 * Label for an enum-like value that comes from content/ (entity kind, genre, licence…).
 * `t` is `useTranslations("enums")` (or any namespace); falls back to the raw value with
 * underscores replaced, so a value without a message still renders something sensible.
 */
export function enumLabel(t: Translator, group: string, value: string): string {
  const key = `${group}.${value}`;
  return t.has(key) ? t(key) : value.replace(/_/g, " ");
}

/** The name object used as a heading: Hindi shows Devanagari first, every other locale English. */
export function headingName(names: Name[], locale: string): Name {
  if (locale === "hi") {
    const hi = names.find((n) => n.lang === "hi") ?? names.find((n) => n.script === "Deva");
    if (hi) return hi;
  }
  if (locale === "ta") {
    const ta = names.find((n) => n.lang === "ta") ?? names.find((n) => n.script === "Taml");
    if (ta) return ta;
  }
  return names.find((n) => n.lang === "en") ?? names[0]!;
}

/** Secondary line under a place/figure label: Devanagari + IAST in English, English + IAST in Hindi. */
export function subName(names: Name[], locale: string): string | undefined {
  const deva = names.find((n) => n.script === "Deva");
  if (locale === "hi") {
    const en = names.find((n) => n.lang === "en")?.text;
    const iast = deva?.iast;
    const parts = [en, iast && iast !== en ? iast : undefined].filter(Boolean);
    return parts.length > 0 ? parts.join(" · ") : undefined;
  }
  return deva ? `${deva.text}${deva.iast ? ` · ${deva.iast}` : ""}` : undefined;
}

/** Language of the text returned by `subName`. */
export const subLang = (locale: string) => (locale === "hi" ? "en" : "sa");
