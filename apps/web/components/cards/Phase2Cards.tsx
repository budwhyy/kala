import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { Kala } from "@/lib/graph/kala";
import { hrefFor } from "@/lib/graph/kala";
import { enumLabel } from "@/lib/i18n-helpers";
import { LinkList } from "./EntityCard";
import { RetellingsSection } from "./Phase2Sections";
import {
  Badge,
  Cite,
  ConfidenceBadge,
  NameBlock,
  RecordLink,
  Section,
  Summaries,
  TimeRails,
  VariantTag,
} from "./ui";

export function EventCard({ kala, slug }: { kala: Kala; slug: string }) {
  const t = useTranslations("event");
  const e = kala.get("events", slug)!;
  const text = e.narrative_order?.text;
  return (
    <article>
      <NameBlock names={e.names} />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge tone="celestial">{t("badge")}</Badge>
        <VariantTag kala={kala} variant={e.variant} />
        {e.traditions.map((t) => (
          <Link key={t} href={`/tradition/${t}`}>
            <Badge>{kala.nameOf("traditions", t)}</Badge>
          </Link>
        ))}
      </div>
      <Summaries beginner={e.summary_beginner} scholar={e.summary_scholar} />
      <p className="mt-2">
        <Cite refs={e.references} kala={kala} />
      </p>

      <Section title={t("participants")}>
        <ul className="space-y-1">
          {e.participants.map((p) => (
            <li key={p.entity}>
              <RecordLink href={hrefFor("entities", p.entity)}>
                {kala.nameOf("entities", p.entity)}
              </RecordLink>
              {p.role && <span className="ml-2 text-sm text-muted">{p.role}</span>}
            </li>
          ))}
        </ul>
      </Section>

      {e.places.length > 0 && (
        <Section title={t("where")}>
          <LinkList kala={kala} type="places" slugs={e.places} />
          <p className="mt-1 text-xs text-muted">{t("whereNote")}</p>
        </Section>
      )}

      {text && (
        <Section title={t("toldIn")}>
          <RecordLink href={hrefFor("texts", text)}>{kala.nameOf("texts", text)}</RecordLink>
          {e.narrative_order?.position !== undefined && (
            <span className="ml-2 text-sm text-muted">
              {t("position", { n: e.narrative_order.position })}
            </span>
          )}
        </Section>
      )}
      <RetellingsSection kala={kala} slugs={e.same_story_as} />
      <TimeRails kala={kala} cosmic={e.cosmic_time ? [e.cosmic_time] : []} historical={[]} />
    </article>
  );
}

export function ConceptCard({ kala, slug }: { kala: Kala; slug: string }) {
  const t = useTranslations("concept");
  const tc = useTranslations("common");
  const c = kala.get("concepts", slug)!;
  return (
    <article>
      <NameBlock names={c.names} />
      <div className="mt-3">
        <Badge tone="celestial">{t("badge")}</Badge>
      </div>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed">{c.summary_beginner}</p>
      {c.summary_scholar && (
        <details className="mt-3 max-w-3xl rounded border border-white/10 p-3">
          <summary className="cursor-pointer text-sm text-muted">{tc("scholarly")}</summary>
          <p className="mt-2 leading-relaxed text-ink/90">{c.summary_scholar}</p>
        </details>
      )}

      <Section title={t("schools")}>
        <p className="mb-3 max-w-3xl text-sm text-muted">{t("schoolsNote")}</p>
        <ul className="grid gap-3 md:grid-cols-2">
          {c.interpretations.map((i) => (
            <li key={i.tradition} className="rounded-lg border border-white/10 p-4">
              <h3 className="text-lg text-gold">
                <RecordLink href={hrefFor("traditions", i.tradition)}>
                  {kala.nameOf("traditions", i.tradition)}
                </RecordLink>
              </h3>
              <p className="mt-1 text-sm text-ink/90">{i.explanation}</p>
              <p className="mt-2">
                <Cite refs={i.references} kala={kala} />
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {c.related.length > 0 && (
        <Section title={t("related")}>
          <LinkList kala={kala} type="concepts" slugs={c.related} />
        </Section>
      )}
    </article>
  );
}

export function networkMembers(kala: Kala, slug: string) {
  return kala.dataset.places
    .map((p) => ({
      place: p,
      memberships: p.pilgrimage_networks.filter((n) => n.network === slug),
    }))
    .filter((m) => m.memberships.length > 0);
}

export function NetworkCard({ kala, slug }: { kala: Kala; slug: string }) {
  const t = useTranslations("network");
  const te = useTranslations("enums");
  const n = kala.get("networks", slug)!;
  const members = networkMembers(kala, slug);
  const lists = n.variants.length > 0 ? n.variants : [undefined];

  return (
    <article>
      <NameBlock names={n.names} />
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge tone="copper">{enumLabel(te, "networkKind", n.kind)}</Badge>
        {n.traditions.map((t) => (
          <Link key={t} href={`/tradition/${t}`}>
            <Badge tone="celestial">{kala.nameOf("traditions", t)}</Badge>
          </Link>
        ))}
      </div>
      <Summaries beginner={n.summary_beginner} scholar={n.summary_scholar} />
      <p className="mt-2">
        <Cite refs={n.references} kala={kala} />
      </p>
      <p className="mt-4">
        <Link
          href={`/geography?network=${slug}`}
          className="text-celestial underline decoration-celestial/40 underline-offset-2 hover:decoration-celestial"
        >
          {t("seeOnMap")}
        </Link>
      </p>

      {n.variants.length > 1 && (
        <aside className="mt-6 rounded-lg border border-celestial/30 bg-celestial/5 p-4 text-sm">
          <h2 className="text-celestial">{t("moreThanOne")}</h2>
          <p className="mt-1 text-muted">{t("moreBody")}</p>
        </aside>
      )}

      {lists.map((v) => {
        const inList = members
          .filter((m) => m.memberships.some((x) => x.variant === v))
          .sort((a, b) => a.place.slug.localeCompare(b.place.slug));
        if (inList.length === 0) return null;
        return (
          <Section
            key={v ?? "all"}
            title={
              v
                ? t("variantList", { name: kala.nameOf("variants", v), count: inList.length })
                : t("places", { count: inList.length })
            }
          >
            <ul className="grid gap-3 md:grid-cols-2">
              {inList.map(({ place, memberships }) => (
                <li key={place.slug} className="rounded-lg border border-white/10 p-3">
                  <RecordLink href={hrefFor("places", place.slug)}>
                    {kala.nameOf("places", place.slug)}
                  </RecordLink>{" "}
                  <ConfidenceBadge confidence={place.confidence} />
                  {place.modern_admin && (
                    <p className="text-sm text-muted">
                      {[place.modern_admin.region, place.modern_admin.country]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                  <Cite
                    refs={memberships.filter((m) => m.variant === v).flatMap((m) => m.references)}
                    kala={kala}
                  />
                </li>
              ))}
            </ul>
          </Section>
        );
      })}
    </article>
  );
}
