import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { TextSection } from "@kala/schema";
import type { Kala } from "@/lib/graph/kala";
import { hrefFor } from "@/lib/graph/kala";
import { enumLabel } from "@/lib/i18n-helpers";
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
  const t = useTranslations("dynasty");
  const te = useTranslations("enums");
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
          {d.kind === "legendary" ? t("legendary") : t("historical")}
        </Badge>
        <Badge>{enumLabel(te, "lineage", d.lineage_type)}</Badge>
        {d.variant && <VariantTag kala={kala} variant={d.variant} />}
      </div>
      <Summaries beginner={d.summary_beginner} scholar={d.summary_scholar} />
      <p className="mt-2">
        <Cite refs={d.references} kala={kala} />
      </p>
      {d.founders.length > 0 && (
        <Section title={t("founders")}>
          <LinkList kala={kala} type="entities" slugs={d.founders} />
        </Section>
      )}
      {members.length > 0 && (
        <Section title={t("members")}>
          <LinkList kala={kala} type="entities" slugs={members} />
        </Section>
      )}
      {kingdoms.length > 0 && (
        <Section title={t("kingdoms")}>
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
  const tx = useTranslations("text");
  const te = useTranslations("enums");
  const t = kala.get("texts", slug)!;
  const editions = kala.dataset.sources.filter((s) => s.text === slug);
  const variants = kala.dataset.variants.filter((v) => v.text === slug);
  return (
    <article>
      <NameBlock names={t.names} />
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge>{enumLabel(te, "genre", t.genre)}</Badge>
        {t.traditions.map((tr) => (
          <Link key={tr} href={`/tradition/${tr}`}>
            <Badge tone="celestial">{kala.nameOf("traditions", tr)}</Badge>
          </Link>
        ))}
      </div>
      <Summaries beginner={t.summary_beginner} scholar={t.summary_scholar} />
      {editions.length > 0 && (
        <Section title={tx("editions")}>
          <LinkList kala={kala} type="sources" slugs={editions.map((e) => e.slug)} />
        </Section>
      )}
      {variants.length > 0 && (
        <Section title={tx("accounts")}>
          <LinkList kala={kala} type="variants" slugs={variants.map((v) => v.slug)} />
        </Section>
      )}
      {t.sections.length > 0 && (
        <Section title={tx("structure")}>
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

const LICENCE_TONE: Record<string, "gold" | "copper"> = {
  public_domain: "gold",
  open_licence: "gold",
  cited_only: "copper",
};

export function SourceCard({ kala, slug }: { kala: Kala; slug: string }) {
  const t = useTranslations("source");
  const tl = useTranslations("licence");
  const te = useTranslations("enums");
  const s = kala.get("sources", slug)!;
  const licLabel = tl(`${s.licence}.label`);
  const licExplain = tl(`${s.licence}.explain`);
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
        <Badge tone={LICENCE_TONE[s.licence] ?? "copper"} title={licExplain}>
          {licLabel}
        </Badge>
        <Badge>{enumLabel(te, "sourceKind", s.kind)}</Badge>
      </div>
      <p className="mt-3 max-w-3xl text-sm text-muted">{licExplain}</p>
      <Section title={t("licenceCheck")}>
        <p className="max-w-3xl text-sm">{s.licence_note}</p>
      </Section>
      {s.text && (
        <Section title={t("editionOf")}>
          <RecordLink href={hrefFor("texts", s.text)}>{kala.nameOf("texts", s.text)}</RecordLink>
        </Section>
      )}
      {s.url && (
        <Section title={t("readOnline")}>
          <a
            href={s.url}
            className="text-celestial underline decoration-celestial/40 underline-offset-2 hover:decoration-celestial"
            rel="noopener noreferrer"
          >
            {s.url}
          </a>
        </Section>
      )}
    </article>
  );
}

export function VariantCard({ kala, slug }: { kala: Kala; slug: string }) {
  const t = useTranslations("variant");
  const tv = useTranslations("verbs");
  const te = useTranslations("enums");
  const v = kala.get("variants", slug)!;
  const claims = kala.dataset.relationships.filter((r) => r.variant === slug);
  return (
    <article>
      <NameBlock names={v.names} />
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge tone="celestial">{enumLabel(te, "variantKind", v.kind)}</Badge>
        <Link href={`/tradition/${v.tradition}`}>
          <Badge>{kala.nameOf("traditions", v.tradition)}</Badge>
        </Link>
      </div>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed">{v.description}</p>
      <p className="mt-2">
        <Cite refs={v.references} kala={kala} />
      </p>
      {v.text && (
        <Section title={t("text")}>
          <RecordLink href={hrefFor("texts", v.text)}>{kala.nameOf("texts", v.text)}</RecordLink>
        </Section>
      )}
      {v.kind === "creation_pathway" && (
        <aside className="mt-6 rounded-lg border border-gold/30 bg-gold/5 p-4 text-sm">
          <h2 className="text-gold">{t("oneAccountHeading")}</h2>
          <p className="mt-1 text-muted">{t("oneAccountBody")}</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            <Link
              href="/"
              className="text-celestial underline decoration-celestial/40 underline-offset-2 hover:decoration-celestial"
            >
              {t("backToAccounts")}
            </Link>
            <Link
              href="/cosmic"
              className="text-celestial underline decoration-celestial/40 underline-offset-2 hover:decoration-celestial"
            >
              {t("continueCosmic")}
            </Link>
            <Link
              href="/genealogy"
              className="text-celestial underline decoration-celestial/40 underline-offset-2 hover:decoration-celestial"
            >
              {t("continueGenealogy")}
            </Link>
          </div>
        </aside>
      )}
      {claims.length > 0 && (
        <Section title={t("connections")}>
          <ul className="space-y-3">
            {claims.map((r) => (
              <li key={r.id} className="rounded-lg border border-white/10 p-3 text-sm">
                {tv.rich(r.type, {
                  from: () => (
                    <RecordLink href={hrefFor("entities", r.from)}>
                      {kala.nameOf("entities", r.from)}
                    </RecordLink>
                  ),
                  to: () => (
                    <RecordLink href={hrefFor("entities", r.to)}>
                      {kala.nameOf("entities", r.to)}
                    </RecordLink>
                  ),
                  m: (chunks) => <span className="text-muted">{chunks}</span>,
                })}
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
  const tt = useTranslations("tradition");
  const te = useTranslations("enums");
  const t = kala.get("traditions", slug)!;
  const children = kala.dataset.traditions.filter((x) => x.parent === slug);
  const texts = kala.dataset.texts.filter((x) => x.traditions.includes(slug));
  const entities = kala.dataset.entities.filter((x) => x.traditions.includes(slug));
  return (
    <article>
      <NameBlock names={t.names} />
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge tone="celestial">{enumLabel(te, "family", t.family)}</Badge>
        {t.parent && (
          <Link href={`/tradition/${t.parent}`}>
            <Badge>{tt("within", { name: kala.nameOf("traditions", t.parent) })}</Badge>
          </Link>
        )}
      </div>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed">{t.summary_beginner}</p>
      {t.sourcing_note && <p className="mt-2 text-sm text-muted">{t.sourcing_note}</p>}
      {children.length > 0 && (
        <Section title={tt("traditionsWithin")}>
          <LinkList kala={kala} type="traditions" slugs={children.map((c) => c.slug)} />
        </Section>
      )}
      {texts.length > 0 && (
        <Section title={tt("texts")}>
          <LinkList kala={kala} type="texts" slugs={texts.map((c) => c.slug)} />
        </Section>
      )}
      {entities.length > 0 && (
        <Section title={tt("figures")}>
          <LinkList kala={kala} type="entities" slugs={entities.map((c) => c.slug)} />
        </Section>
      )}
    </article>
  );
}
