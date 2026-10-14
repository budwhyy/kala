// Small presentational building blocks shared by every card. No content data lives here:
// everything rendered is passed in from the data layer.
import type { CosmicTime, HistoricalTime, Name, PlaceConfidence, Reference } from "@kala/schema";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import type { Kala } from "@/lib/graph/kala";
import { enumLabel, headingName } from "@/lib/i18n-helpers";

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-xs font-semibold tracking-[0.2em] text-muted uppercase">{title}</h2>
      {children}
    </section>
  );
}

export function Badge({
  children,
  tone = "plain",
  title,
}: {
  children: ReactNode;
  tone?: Tone;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

type Tone = "plain" | "gold" | "copper" | "celestial" | "red" | "indigo";
const TONES: Record<Tone, string> = {
  plain: "border-white/15 text-ink/80",
  gold: "border-gold/50 text-gold",
  copper: "border-copper/60 text-copper",
  celestial: "border-celestial/50 text-celestial",
  red: "border-deep-red text-[#e07a7f]",
  indigo: "border-indigo bg-indigo/40 text-ink",
};

/**
 * Heading name for the locale (English in English; Devanagari first in Hindi), then the other
 * names: Sanskrit in Devanagari with IAST, English, epithets. Fragments carry their own `lang`.
 */
export function NameBlock({ names, level = 1 }: { names: Name[]; level?: 1 | 2 }) {
  const locale = useLocale();
  const main = headingName(names, locale);
  const others = names.filter((n) => n !== main);
  const Heading = level === 1 ? "h1" : "h2";
  const mainIast = main.iast && main.iast !== main.text ? main.iast : undefined;
  return (
    <div>
      <Heading className={level === 1 ? "text-4xl text-gold" : "text-2xl text-gold"}>
        <span lang={main.lang}>{main.text}</span>
      </Heading>
      {(others.length > 0 || mainIast) && (
        <p className="mt-1 text-lg text-ink/80">
          {mainIast && (
            <span lang={`${main.lang}-Latn`} className="mr-3 italic text-muted">
              {mainIast}
            </span>
          )}
          {others.map((n, i) => (
            <span key={i} lang={n.lang} className="mr-3">
              {n.text}
              {n.iast && n.iast !== n.text && (
                <span lang={`${n.lang}-Latn`} className="ml-1.5 italic text-muted">
                  {n.iast}
                </span>
              )}
              {n.meaning && (
                <span lang="en" className="ml-1.5 text-sm text-muted">
                  “{n.meaning}”
                </span>
              )}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

/** Inline citation list. Each reference links to its source edition. */
export function Cite({ refs, kala }: { refs: Reference[]; kala: Kala }) {
  return (
    <span className="text-xs text-muted">
      {refs.map((r, i) => (
        <span key={i}>
          {i > 0 && "; "}
          <Link href={`/source/${r.source}`} className="underline decoration-dotted hover:text-ink">
            {shortSource(kala, r.source)}
          </Link>{" "}
          {r.locator}
          {r.note && <span className="italic"> ({r.note})</span>}
        </span>
      ))}
    </span>
  );
}

export function shortSource(kala: Kala, slug: string): string {
  const s = kala.get("sources", slug);
  if (!s) return slug;
  const text = s.text ? kala.nameOf("texts", s.text) : s.title;
  const who = s.creators[0]?.split(" ").at(-1) ?? "";
  return `${text} (${who} ${s.published.year})`;
}

export function RecordLink({ href, children }: { href: string | null; children: ReactNode }) {
  if (!href) return <span>{children}</span>;
  return (
    <Link
      href={href}
      className="text-celestial underline decoration-celestial/40 underline-offset-2 hover:decoration-celestial"
    >
      {children}
    </Link>
  );
}

// ---------------------------------------------------------------- Confidence

/** Badge tone per place-confidence class. Labels and explanations live in messages (`confidence.*`). */
export const CONFIDENCE_TONE: Record<PlaceConfidence, Tone> = {
  verified: "gold",
  traditional: "copper",
  debated: "red",
  mythical: "indigo",
};

export function ConfidenceBadge({ confidence }: { confidence: PlaceConfidence }) {
  const t = useTranslations("confidence");
  return (
    <Badge tone={CONFIDENCE_TONE[confidence]} title={t(`${confidence}.explain`)}>
      {t(`${confidence}.label`)}
    </Badge>
  );
}

export function VariantTag({ kala, variant }: { kala: Kala; variant?: string | undefined }) {
  const t = useTranslations("variantTag");
  if (!variant) return null;
  return (
    <Link
      href={`/variant/${variant}`}
      className="ml-2 inline-block rounded border border-celestial/40 px-1.5 text-[11px] text-celestial hover:bg-celestial/10"
      title={t("title")}
    >
      {kala.nameOf("variants", variant)}
    </Link>
  );
}

// ---------------------------------------------------------------- Time rails

/** Cosmic and historical time are shown in separate rails, never on one axis (principle 4). */
export function TimeRails({
  kala,
  cosmic,
  historical,
}: {
  kala: Kala;
  cosmic: CosmicTime[];
  historical: HistoricalTime[];
}) {
  const t = useTranslations("time");
  const te = useTranslations("enums");
  const tc = useTranslations("common");
  if (cosmic.length === 0 && historical.length === 0) return null;
  const year = (y: number) => (y < 0 ? t("bce", { year: -y }) : t("ce", { year: y }));
  const describeCosmic = (c: CosmicTime): string => {
    const parts: string[] = [];
    if (c.phase !== "within_cycle") parts.push(enumLabel(te, "phase", c.phase));
    if (c.kalpa) parts.push(t("kalpa", { name: c.kalpa.replace(/-/g, " ") }));
    if (c.manvantara) parts.push(t("manvantara", { n: c.manvantara }));
    if (c.mahayuga) parts.push(t("mahayuga", { n: c.mahayuga }));
    if (c.yuga) parts.push(enumLabel(te, "yuga", c.yuga));
    return parts.join(" · ");
  };
  return (
    <Section title={t("title")}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-indigo/60 bg-indigo/15 p-4">
          <h3 className="text-sm text-celestial">{t("cosmicHeading")}</h3>
          <p className="mb-2 text-xs text-muted">{t("cosmicNote")}</p>
          {cosmic.length === 0 ? (
            <p className="text-sm text-muted">{tc("noneRecorded")}</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {cosmic.map((c, i) => (
                <li key={i}>
                  {describeCosmic(c)}
                  <VariantTag kala={kala} variant={c.variant} />
                  <div>
                    <Cite refs={c.references} kala={kala} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-lg border border-copper/40 bg-copper/5 p-4">
          <h3 className="text-sm text-copper">{t("historicalHeading")}</h3>
          <p className="mb-2 text-xs text-muted">{t("historicalNote")}</p>
          {historical.length === 0 ? (
            <p className="text-sm text-muted">{tc("noneRecorded")}</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {historical.map((h, i) => (
                <li key={i}>
                  {year(h.start)} – {year(h.end)}{" "}
                  <span className="text-muted">
                    {t("historicalDetail", {
                      precision: enumLabel(te, "precision", h.precision),
                      confidence: enumLabel(te, "timeConfidence", h.confidence),
                    })}
                  </span>
                  {h.note && <p className="text-xs text-muted">{h.note}</p>}
                  <div>
                    <Cite refs={h.references} kala={kala} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Section>
  );
}

export function Summaries({
  beginner,
  scholar,
}: {
  beginner: string;
  scholar?: string | undefined;
}) {
  const t = useTranslations("common");
  return (
    <div className="mt-5 max-w-3xl">
      <p className="text-lg leading-relaxed">{beginner}</p>
      {scholar && (
        <details className="mt-3 rounded border border-white/10 p-3">
          <summary className="cursor-pointer text-sm text-muted">{t("scholarly")}</summary>
          <p className="mt-2 leading-relaxed text-ink/90">{scholar}</p>
        </details>
      )}
    </div>
  );
}
