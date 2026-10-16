import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { Kala } from "@/lib/graph/kala";
import { hrefFor } from "@/lib/graph/kala";
import { enumLabel } from "@/lib/i18n-helpers";
import { LinkList } from "./EntityCard";
import { EventsSection, NetworksSection } from "./Phase2Sections";
import { JourneysSection } from "./Phase3Sections";
import {
  Badge,
  Cite,
  ConfidenceBadge,
  NameBlock,
  RecordLink,
  Section,
  Summaries,
  TimeRails,
} from "./ui";

export function PlaceCard({ kala, slug }: { kala: Kala; slug: string }) {
  const t = useTranslations("place");
  const tc = useTranslations("confidence");
  const te = useTranslations("enums");
  const p = kala.get("places", slug)!;
  const kingdoms = kala.neighbours("places", slug, "kingdoms");
  const entities = kala.neighbours("places", slug, "entities");
  const related = kala.neighbours("places", slug, "places");

  return (
    <article>
      <NameBlock names={p.names} />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ConfidenceBadge confidence={p.confidence} />
        <Badge>{enumLabel(te, "placeKind", p.kind)}</Badge>
        {p.traditions.map((t) => (
          <Link key={t} href={`/tradition/${t}`}>
            <Badge tone="celestial">{kala.nameOf("traditions", t)}</Badge>
          </Link>
        ))}
      </div>
      <p className="mt-2 text-sm text-muted">{tc(`${p.confidence}.explain`)}</p>

      <Summaries beginner={p.summary_beginner} scholar={p.summary_scholar} />
      <p className="mt-2">
        <Cite refs={p.references} kala={kala} />
      </p>

      {p.realm === "terrestrial" && p.modern_admin && (
        <Section title={t("modernLocation")}>
          <p>
            {[
              p.modern_admin.nearest_city,
              p.modern_admin.district,
              p.modern_admin.region,
              p.modern_admin.country,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>
          {p.geometry?.type === "Point" && (
            <p className="mt-1 text-sm text-muted">
              {t("coordinates", {
                lat: p.geometry.coordinates[1].toFixed(2),
                lon: p.geometry.coordinates[0].toFixed(2),
              })}
            </p>
          )}
          <p className="mt-1 text-xs text-muted">{t("modernBorders")}</p>
        </Section>
      )}

      {p.evidence.length > 0 && (
        <Section title={t("evidence")}>
          <ul className="space-y-3">
            {p.evidence.map((ev, i) => (
              <li key={i} className="rounded-lg border border-white/10 p-3">
                <Badge>{enumLabel(te, "evidence", ev.type)}</Badge>
                <p className="mt-1 text-sm">{ev.summary}</p>
                <Cite refs={ev.references} kala={kala} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {p.alternative_identifications.length > 0 && (
        <Section title={t("proposed")}>
          <ul className="space-y-3">
            {p.alternative_identifications.map((a, i) => (
              <li key={i} className="rounded-lg border border-white/10 p-3">
                <span className="text-ink">{a.label}</span>{" "}
                <ConfidenceBadge confidence={a.confidence} />
                <p className="mt-1 text-sm">{a.argument}</p>
                <Cite refs={a.references} kala={kala} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {kingdoms.length > 0 && (
        <Section title={t("kingdoms")}>
          <ul className="space-y-2">
            {kingdoms.map((k) => (
              <li key={k}>
                <RecordLink href={hrefFor("kingdoms", k)}>{kala.nameOf("kingdoms", k)}</RecordLink>
                <KingdomKind kala={kala} slug={k} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {p.related_places.length > 0 && (
        <Section title={t("related")}>
          <ul className="space-y-2">
            {p.related_places.map((r) => (
              <li key={r.to}>
                <RecordLink href={hrefFor("places", r.to)}>
                  {kala.nameOf("places", r.to)}
                </RecordLink>
                <span className="ml-2 text-xs text-muted">
                  {enumLabel(te, "placeRelation", r.relation)}
                </span>
                <p className="text-sm text-ink/85">{r.note}</p>
                <Cite refs={r.references} kala={kala} />
              </li>
            ))}
          </ul>
        </Section>
      )}
      {related.length > p.related_places.length && (
        <Section title={t("linkedFrom")}>
          <LinkList
            kala={kala}
            type="places"
            slugs={related.filter((r) => !p.related_places.some((x) => x.to === r))}
          />
        </Section>
      )}

      {entities.length > 0 && (
        <Section title={t("figures")}>
          <LinkList kala={kala} type="entities" slugs={entities} />
        </Section>
      )}

      <NetworksSection kala={kala} memberships={p.pilgrimage_networks} />
      <EventsSection kala={kala} slugs={kala.neighbours("places", slug, "events")} />
      <JourneysSection kala={kala} slugs={kala.neighbours("places", slug, "routes")} />
      <TimeRails kala={kala} cosmic={p.cosmic_time} historical={p.historical_time} />
    </article>
  );
}

export function KingdomKind({ kala, slug }: { kala: Kala; slug: string }) {
  const te = useTranslations("enums.kingdomKindShort");
  const k = kala.get("kingdoms", slug);
  if (!k) return null;
  return (
    <span className="ml-2">
      {k.kind === "epic_legendary" ? (
        <Badge tone="celestial">{te("epic_legendary")}</Badge>
      ) : (
        <Badge tone="copper">{te("historical")}</Badge>
      )}
    </span>
  );
}
