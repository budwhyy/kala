import Link from "next/link";
import type { TextSection } from "@kala/schema";
import type { Kala } from "@/lib/graph/kala";
import { hrefFor } from "@/lib/graph/kala";
import { LinkList } from "./EntityCard";
import {
  Badge,
  Cite,
  NameBlock,
  RecordLink,
  Section,
  Summaries,
  TimeRails,
  VariantTag,
} from "./ui";

export function DynastyCard({ kala, slug }: { kala: Kala; slug: string }) {
  const d = kala.get("dynasties", slug)!;
  const kingdoms = kala.neighbours("dynasties", slug, "kingdoms");
  const members = kala
    .neighbours("dynasties", slug, "entities")
    .filter((e) => !d.founders.includes(e));
  return (
    <article>
      <NameBlock names={d.names} />
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge tone={d.kind === "legendary" ? "celestial" : "copper"}>
          {d.kind === "legendary" ? "Legendary dynasty" : "Historical dynasty"}
        </Badge>
        <Badge>{d.lineage_type}</Badge>
        {d.variant && <VariantTag kala={kala} variant={d.variant} />}
      </div>
      <Summaries beginner={d.summary_beginner} scholar={d.summary_scholar} />
      <p className="mt-2">
        <Cite refs={d.references} kala={kala} />
      </p>
      {d.founders.length > 0 && (
        <Section title="Founders">
          <LinkList kala={kala} type="entities" slugs={d.founders} />
        </Section>
      )}
      {members.length > 0 && (
        <Section title="Members">
          <LinkList kala={kala} type="entities" slugs={members} />
        </Section>
      )}
      {kingdoms.length > 0 && (
        <Section title="Kingdoms">
          <LinkList kala={kala} type="kingdoms" slugs={kingdoms} />
        </Section>
      )}
      <TimeRails
        kala={kala}
        cosmic={[]}
        historical={d.historical_time ? [d.historical_time] : []}
      />
    </article>
  );
}

export function TextCard({ kala, slug }: { kala: Kala; slug: string }) {
  const t = kala.get("texts", slug)!;
  const editions = kala.dataset.sources.filter((s) => s.text === slug);
  const variants = kala.dataset.variants.filter((v) => v.text === slug);
  return (
    <article>
      <NameBlock names={t.names} />
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge>{t.genre.replace(/_/g, " ")}</Badge>
        {t.traditions.map((tr) => (
          <a key={tr} href={`/tradition/${tr}`}>
            <Badge tone="celestial">{kala.nameOf("traditions", tr)}</Badge>
          </a>
        ))}
      </div>
      <Summaries beginner={t.summary_beginner} scholar={t.summary_scholar} />
      {editions.length > 0 && (
        <Section title="Editions KĀLA cites">
          <LinkList kala={kala} type="sources" slugs={editions.map((e) => e.slug)} />
        </Section>
      )}
      {variants.length > 0 && (
        <Section title="Accounts drawn from this text">
          <LinkList kala={kala} type="variants" slugs={variants.map((v) => v.slug)} />
        </Section>
      )}
      {t.sections.length > 0 && (
        <Section title="Structure">
          <Sections sections={t.sections} />
        </Section>
      )}
      <TimeRails kala={kala} cosmic={[]} historical={t.composition ? [t.composition] : []} />
    </article>
  );
}

function Sections({ sections }: { sections: TextSection[] }) {
  return (
    <ol className="list-decimal space-y-1 pl-5">
      {sections.map((s) => (
        <li key={s.id}>
          {s.label}
          {s.sections && <Sections sections={s.sections} />}
        </li>
      ))}
    </ol>
  );
}

const LICENCE: Record<string, { label: string; tone: "gold" | "copper"; explain: string }> = {
  public_domain: {
    label: "Public domain",
    tone: "gold",
    explain: "May be quoted with a citation.",
  },
  open_licence: {
    label: "Open licence",
    tone: "gold",
    explain: "May be quoted under its licence.",
  },
  cited_only: {
    label: "Cited only",
    tone: "copper",
    explain: "Still in copyright somewhere. KĀLA cites it by page but never reproduces it.",
  },
};

export function SourceCard({ kala, slug }: { kala: Kala; slug: string }) {
  const s = kala.get("sources", slug)!;
  const lic = LICENCE[s.licence]!;
  return (
    <article>
      <h1 className="text-3xl text-gold">{s.title}</h1>
      <p className="mt-2 text-lg">{s.creators.join(", ")}</p>
      <p className="text-muted">
        {[s.published.publisher, s.published.place].filter(Boolean).join(", ")}
        {s.published.publisher || s.published.place ? ", " : ""}
        {s.published.year}
        {s.published.end_year ? `–${s.published.end_year}` : ""}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge tone={lic.tone} title={lic.explain}>
          {lic.label}
        </Badge>
        <Badge>{s.kind.replace(/_/g, " ")}</Badge>
      </div>
      <p className="mt-3 max-w-3xl text-sm text-muted">{lic.explain}</p>
      <Section title="Licence check">
        <p className="max-w-3xl text-sm">{s.licence_note}</p>
      </Section>
      {s.text && (
        <Section title="Edition of">
          <RecordLink href={hrefFor("texts", s.text)}>{kala.nameOf("texts", s.text)}</RecordLink>
        </Section>
      )}
      {s.url && (
        <Section title="Read online">
          <a href={s.url} className="text-celestial hover:underline" rel="noopener noreferrer">
            {s.url}
          </a>
        </Section>
      )}
    </article>
  );
}

export function VariantCard({ kala, slug }: { kala: Kala; slug: string }) {
  const v = kala.get("variants", slug)!;
  const claims = kala.dataset.relationships.filter((r) => r.variant === slug);
  return (
    <article>
      <NameBlock names={v.names} />
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge tone="celestial">{v.kind.replace(/_/g, " ")}</Badge>
        <a href={`/tradition/${v.tradition}`}>
          <Badge>{kala.nameOf("traditions", v.tradition)}</Badge>
        </a>
      </div>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed">{v.description}</p>
      <p className="mt-2">
        <Cite refs={v.references} kala={kala} />
      </p>
      {v.text && (
        <Section title="Text">
          <RecordLink href={hrefFor("texts", v.text)}>{kala.nameOf("texts", v.text)}</RecordLink>
        </Section>
      )}
      {v.kind === "creation_pathway" && (
        <aside className="mt-6 rounded-lg border border-gold/30 bg-gold/5 p-4 text-sm">
          <h2 className="text-gold">One account among several</h2>
          <p className="mt-1 text-muted">
            This is how one text or tradition describes the beginning. Others describe it
            differently; none is presented here as the single true account.
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/" className="text-celestial hover:underline">
              ← Other accounts of the beginning
            </Link>
            <Link href="/cosmic" className="text-celestial hover:underline">
              Continue: the cycles of time →
            </Link>
            <Link href="/genealogy" className="text-celestial hover:underline">
              Continue: the families of gods and sages →
            </Link>
          </div>
        </aside>
      )}
      {claims.length > 0 && (
        <Section title="Connections in this account">
          <ul className="space-y-3">
            {claims.map((r) => (
              <li key={r.id} className="rounded-lg border border-white/10 p-3 text-sm">
                <RecordLink href={hrefFor("entities", r.from)}>
                  {kala.nameOf("entities", r.from)}
                </RecordLink>{" "}
                <span className="text-muted">{r.type.replace(/_/g, " ")}</span>{" "}
                <RecordLink href={hrefFor("entities", r.to)}>
                  {kala.nameOf("entities", r.to)}
                </RecordLink>
                <p className="mt-1">{r.explanation}</p>
                <Cite refs={r.references} kala={kala} />
              </li>
            ))}
          </ul>
        </Section>
      )}
    </article>
  );
}

export function TraditionCard({ kala, slug }: { kala: Kala; slug: string }) {
  const t = kala.get("traditions", slug)!;
  const children = kala.dataset.traditions.filter((x) => x.parent === slug);
  const texts = kala.dataset.texts.filter((x) => x.traditions.includes(slug));
  const entities = kala.dataset.entities.filter((x) => x.traditions.includes(slug));
  return (
    <article>
      <NameBlock names={t.names} />
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge tone="celestial">{t.family.replace(/_/g, " ")}</Badge>
        {t.parent && (
          <a href={`/tradition/${t.parent}`}>
            <Badge>within {kala.nameOf("traditions", t.parent)}</Badge>
          </a>
        )}
      </div>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed">{t.summary_beginner}</p>
      {t.sourcing_note && <p className="mt-2 text-sm text-muted">{t.sourcing_note}</p>}
      {children.length > 0 && (
        <Section title="Traditions within">
          <LinkList kala={kala} type="traditions" slugs={children.map((c) => c.slug)} />
        </Section>
      )}
      {texts.length > 0 && (
        <Section title="Texts">
          <LinkList kala={kala} type="texts" slugs={texts.map((c) => c.slug)} />
        </Section>
      )}
      {entities.length > 0 && (
        <Section title="Figures">
          <LinkList kala={kala} type="entities" slugs={entities.map((c) => c.slug)} />
        </Section>
      )}
    </article>
  );
}
