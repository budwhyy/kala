import type { Kala, RelationView } from "@/lib/graph/kala";
import { hrefFor } from "@/lib/graph/kala";
import { RELATION_HEADINGS, RELATION_ORDER } from "@/lib/graph/labels";
import { Badge, Cite, NameBlock, RecordLink, Section, Summaries, TimeRails } from "./ui";
import { VariantPanel } from "./VariantPanel";
import { VariantTag } from "./ui";

export function EntityCard({ kala, slug }: { kala: Kala; slug: string }) {
  const e = kala.get("entities", slug)!;
  const relations = kala.relationsOf(slug);

  const groups = new Map<string, RelationView[]>();
  for (const v of relations) {
    const key = `${v.relationship.type}:${v.direction}`;
    groups.set(key, [...(groups.get(key) ?? []), v]);
  }
  const ordered = [...groups.entries()].sort(([a], [b]) => rank(a) - rank(b));

  const places = kala.neighbours("entities", slug, "places");
  const dynasties = kala.neighbours("entities", slug, "dynasties");

  return (
    <article>
      <NameBlock names={e.names} />
      <div className="mt-3 flex flex-wrap gap-2">
        {e.kinds.map((k) => (
          <Badge key={k}>{k.replace(/_/g, " ")}</Badge>
        ))}
        {e.traditions.map((t) => (
          <a key={t} href={`/tradition/${t}`}>
            <Badge tone="celestial">{kala.nameOf("traditions", t)}</Badge>
          </a>
        ))}
      </div>
      {e.epithets.length > 0 && (
        <p className="mt-2 text-sm text-muted">
          Also called:{" "}
          {e.epithets.map((n) => n.text + (n.meaning ? ` (“${n.meaning}”)` : "")).join(", ")}
        </p>
      )}
      <Summaries beginner={e.summary_beginner} scholar={e.summary_scholar} />
      <p className="mt-2">
        <Cite refs={e.references} kala={kala} />
      </p>

      <VariantPanel kala={kala} relations={relations} />

      {ordered.map(([key, views]) => {
        const [type, dir] = key.split(":") as [keyof typeof RELATION_HEADINGS, "out" | "in"];
        return (
          <Section key={key} title={RELATION_HEADINGS[type][dir]}>
            <ul className="space-y-3">
              {views.map((v) => (
                <li key={v.relationship.id} className="rounded-lg border border-white/10 p-3">
                  <RecordLink href={hrefFor("entities", v.other)}>
                    {kala.nameOf("entities", v.other)}
                  </RecordLink>
                  {v.relationship.mode && v.relationship.mode !== "biological" && (
                    <span className="ml-2 text-xs text-muted">
                      ({v.relationship.mode.replace(/_/g, " ")})
                    </span>
                  )}
                  <VariantTag kala={kala} variant={v.relationship.variant} />
                  <p className="mt-1 text-sm text-ink/85">{v.relationship.explanation}</p>
                  <Cite refs={v.relationship.references} kala={kala} />
                </li>
              ))}
            </ul>
          </Section>
        );
      })}

      {dynasties.length > 0 && (
        <Section title="Dynasties">
          <LinkList kala={kala} type="dynasties" slugs={dynasties} />
        </Section>
      )}
      {places.length > 0 && (
        <Section title="Places">
          <LinkList kala={kala} type="places" slugs={places} />
        </Section>
      )}
      <TimeRails kala={kala} cosmic={e.cosmic_time} historical={e.historical_time} />
    </article>
  );
}

function rank(key: string): number {
  const i = RELATION_ORDER.indexOf(key);
  return i === -1 ? RELATION_ORDER.length : i;
}

export function LinkList({
  kala,
  type,
  slugs,
}: {
  kala: Kala;
  type: Parameters<Kala["nameOf"]>[0];
  slugs: string[];
}) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1">
      {slugs.map((s) => (
        <li key={s}>
          <RecordLink href={hrefFor(type, s)}>{kala.nameOf(type, s)}</RecordLink>
        </li>
      ))}
    </ul>
  );
}
