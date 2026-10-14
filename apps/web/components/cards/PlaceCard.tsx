import type { Kala } from "@/lib/graph/kala";
import { hrefFor } from "@/lib/graph/kala";
import { LinkList } from "./EntityCard";
import {
  Badge,
  CONFIDENCE,
  Cite,
  ConfidenceBadge,
  NameBlock,
  RecordLink,
  Section,
  Summaries,
  TimeRails,
} from "./ui";

export function PlaceCard({ kala, slug }: { kala: Kala; slug: string }) {
  const p = kala.get("places", slug)!;
  const kingdoms = kala.neighbours("places", slug, "kingdoms");
  const entities = kala.neighbours("places", slug, "entities");
  const related = kala.neighbours("places", slug, "places");

  return (
    <article>
      <NameBlock names={p.names} />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ConfidenceBadge confidence={p.confidence} />
        <Badge>{p.kind}</Badge>
        {p.traditions.map((t) => (
          <a key={t} href={`/tradition/${t}`}>
            <Badge tone="celestial">{kala.nameOf("traditions", t)}</Badge>
          </a>
        ))}
      </div>
      <p className="mt-2 text-sm text-muted">{CONFIDENCE[p.confidence].explain}</p>

      <Summaries beginner={p.summary_beginner} scholar={p.summary_scholar} />
      <p className="mt-2">
        <Cite refs={p.references} kala={kala} />
      </p>

      {p.realm === "terrestrial" && p.modern_admin && (
        <Section title="Modern location (for orientation only)">
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
              {p.geometry.coordinates[1].toFixed(2)}° N, {p.geometry.coordinates[0].toFixed(2)}° E
            </p>
          )}
          <p className="mt-1 text-xs text-muted">
            Modern borders are shown for orientation. They do not mean the ancient place belonged to
            a modern country.
          </p>
        </Section>
      )}

      {p.evidence.length > 0 && (
        <Section title="Evidence">
          <ul className="space-y-3">
            {p.evidence.map((ev, i) => (
              <li key={i} className="rounded-lg border border-white/10 p-3">
                <Badge>{ev.type}</Badge>
                <p className="mt-1 text-sm">{ev.summary}</p>
                <Cite refs={ev.references} kala={kala} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {p.alternative_identifications.length > 0 && (
        <Section title="Proposed identifications">
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
        <Section title="Kingdoms">
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
        <Section title="Related places">
          <ul className="space-y-2">
            {p.related_places.map((r) => (
              <li key={r.to}>
                <RecordLink href={hrefFor("places", r.to)}>
                  {kala.nameOf("places", r.to)}
                </RecordLink>
                <span className="ml-2 text-xs text-muted">{r.relation.replace(/_/g, " ")}</span>
                <p className="text-sm text-ink/85">{r.note}</p>
                <Cite refs={r.references} kala={kala} />
              </li>
            ))}
          </ul>
        </Section>
      )}
      {related.length > p.related_places.length && (
        <Section title="Linked from">
          <LinkList
            kala={kala}
            type="places"
            slugs={related.filter((r) => !p.related_places.some((x) => x.to === r))}
          />
        </Section>
      )}

      {entities.length > 0 && (
        <Section title="Figures associated with this place">
          <LinkList kala={kala} type="entities" slugs={entities} />
        </Section>
      )}

      <TimeRails kala={kala} cosmic={p.cosmic_time} historical={p.historical_time} />
    </article>
  );
}

export function KingdomKind({ kala, slug }: { kala: Kala; slug: string }) {
  const k = kala.get("kingdoms", slug);
  if (!k) return null;
  return (
    <span className="ml-2">
      {k.kind === "epic_legendary" ? (
        <Badge tone="celestial">Epic / legendary</Badge>
      ) : (
        <Badge tone="copper">Historical</Badge>
      )}
    </span>
  );
}
