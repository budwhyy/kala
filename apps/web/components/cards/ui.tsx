// Small presentational building blocks shared by every card. No content data lives here:
// everything rendered is passed in from the data layer.
import type { CosmicTime, HistoricalTime, Name, PlaceConfidence, Reference } from "@kala/schema";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Kala } from "@/lib/graph/kala";

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

/** English display name, then Sanskrit in Devanagari with IAST, then any other names. */
export function NameBlock({ names, level = 1 }: { names: Name[]; level?: 1 | 2 }) {
  const en = names.find((n) => n.lang === "en");
  const others = names.filter((n) => n !== en);
  const Heading = level === 1 ? "h1" : "h2";
  return (
    <div>
      <Heading className={level === 1 ? "text-4xl text-gold" : "text-2xl text-gold"}>
        {en?.text ?? names[0]?.text}
      </Heading>
      {others.length > 0 && (
        <p className="mt-1 text-lg text-ink/80">
          {others.map((n, i) => (
            <span key={i} lang={n.lang} className="mr-3">
              {n.text}
              {n.iast && n.iast !== n.text && (
                <span className="ml-1.5 italic text-muted">{n.iast}</span>
              )}
              {n.meaning && <span className="ml-1.5 text-sm text-muted">“{n.meaning}”</span>}
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

function shortSource(kala: Kala, slug: string): string {
  const s = kala.get("sources", slug);
  if (!s) return slug;
  const text = s.text ? kala.nameOf("texts", s.text) : s.title;
  const who = s.creators[0]?.split(" ").at(-1) ?? "";
  return `${text} (${who} ${s.published.year})`;
}

export function RecordLink({ href, children }: { href: string | null; children: ReactNode }) {
  if (!href) return <span>{children}</span>;
  return (
    <Link href={href} className="text-celestial hover:underline">
      {children}
    </Link>
  );
}

// ---------------------------------------------------------------- Confidence

export const CONFIDENCE: Record<PlaceConfidence, { label: string; tone: Tone; explain: string }> = {
  verified: {
    label: "Historically verified",
    tone: "gold",
    explain:
      "Supported by archaeological or historical evidence. This does not verify the stories set here.",
  },
  traditional: {
    label: "Traditionally identified",
    tone: "copper",
    explain: "Located here by living tradition; not independently verified.",
  },
  debated: {
    label: "Debated",
    tone: "red",
    explain: "Scholars and traditions propose different locations.",
  },
  mythical: {
    label: "Cosmological",
    tone: "indigo",
    explain: "A realm of the cosmos, not a place on Earth. It has no map position.",
  },
};

export function ConfidenceBadge({ confidence }: { confidence: PlaceConfidence }) {
  const c = CONFIDENCE[confidence];
  return (
    <Badge tone={c.tone} title={c.explain}>
      {c.label}
    </Badge>
  );
}

export function VariantTag({ kala, variant }: { kala: Kala; variant?: string | undefined }) {
  if (!variant) return null;
  return (
    <Link
      href={`/variant/${variant}`}
      className="ml-2 inline-block rounded border border-celestial/40 px-1.5 text-[11px] text-celestial hover:bg-celestial/10"
      title="This claim belongs to one account; other accounts may differ."
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
  if (cosmic.length === 0 && historical.length === 0) return null;
  return (
    <Section title="Time">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-indigo/60 bg-indigo/15 p-4">
          <h3 className="text-sm text-celestial">Traditional (cosmic) chronology</h3>
          <p className="mb-2 text-xs text-muted">
            Positions inside a tradition’s cycle of ages. Not years.
          </p>
          {cosmic.length === 0 ? (
            <p className="text-sm text-muted">None recorded.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {cosmic.map((t, i) => (
                <li key={i}>
                  {describeCosmic(t)}
                  <VariantTag kala={kala} variant={t.variant} />
                  <div>
                    <Cite refs={t.references} kala={kala} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-lg border border-copper/40 bg-copper/5 p-4">
          <h3 className="text-sm text-copper">Historical dating</h3>
          <p className="mb-2 text-xs text-muted">
            Academic dates from evidence. A different system: not comparable.
          </p>
          {historical.length === 0 ? (
            <p className="text-sm text-muted">None recorded.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {historical.map((t, i) => (
                <li key={i}>
                  {formatYear(t.start)} – {formatYear(t.end)}{" "}
                  <span className="text-muted">
                    ({t.precision}, {t.confidence} confidence)
                  </span>
                  {t.note && <p className="text-xs text-muted">{t.note}</p>}
                  <div>
                    <Cite refs={t.references} kala={kala} />
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

export function formatYear(y: number): string {
  return y < 0 ? `${-y} BCE` : `${y} CE`;
}

function describeCosmic(t: CosmicTime): string {
  const parts: string[] = [];
  if (t.phase !== "within_cycle") parts.push(t.phase.replace(/_/g, " "));
  if (t.kalpa) parts.push(`kalpa: ${t.kalpa.replace(/-/g, " ")}`);
  if (t.manvantara) parts.push(`manvantara ${t.manvantara}`);
  if (t.mahayuga) parts.push(`mahayuga ${t.mahayuga}`);
  if (t.yuga) parts.push(`${t.yuga[0]!.toUpperCase()}${t.yuga.slice(1)} Yuga`);
  return parts.join(" · ");
}

export function Summaries({
  beginner,
  scholar,
}: {
  beginner: string;
  scholar?: string | undefined;
}) {
  return (
    <div className="mt-5 max-w-3xl">
      <p className="text-lg leading-relaxed">{beginner}</p>
      {scholar && (
        <details className="mt-3 rounded border border-white/10 p-3">
          <summary className="cursor-pointer text-sm text-muted">Scholarly detail</summary>
          <p className="mt-2 leading-relaxed text-ink/90">{scholar}</p>
        </details>
      )}
    </div>
  );
}
