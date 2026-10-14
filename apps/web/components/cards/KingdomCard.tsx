import { useTranslations } from "next-intl";
import type { Kala } from "@/lib/graph/kala";
import { hrefFor } from "@/lib/graph/kala";
import { enumLabel } from "@/lib/i18n-helpers";
import { KingdomKind } from "./PlaceCard";
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

export function KingdomCard({ kala, slug }: { kala: Kala; slug: string }) {
  const t = useTranslations("kingdom");
  const te = useTranslations("enums");
  const k = kala.get("kingdoms", slug)!;
  const legendary = k.kind === "epic_legendary";
  const dynasties = kala.neighbours("kingdoms", slug, "dynasties");
  const places = kala.neighbours("kingdoms", slug, "places");

  return (
    <article>
      <NameBlock names={k.names} />
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge tone={legendary ? "celestial" : "copper"}>
          {enumLabel(te, "kingdomKind", k.kind)}
        </Badge>
      </div>
      <Summaries beginner={k.summary_beginner} scholar={k.summary_scholar} />
      <p className="mt-2">
        <Cite refs={k.references} kala={kala} />
      </p>

      {k.same_name_as.length > 0 && (
        <aside className="mt-6 rounded-lg border border-gold/30 bg-gold/5 p-4 text-sm">
          <h2 className="text-gold">{t("sameNameHeading")}</h2>
          <p className="mt-1 text-muted">
            {legendary ? t("sameNameLegendary") : t("sameNameHistorical")}
          </p>
          <ul className="mt-2">
            {k.same_name_as.map((s) => (
              <li key={s}>
                <RecordLink href={hrefFor("kingdoms", s)}>{kala.nameOf("kingdoms", s)}</RecordLink>
                <KingdomKind kala={kala} slug={s} />
              </li>
            ))}
          </ul>
        </aside>
      )}

      {k.capitals.length > 0 && (
        <Section title={t("capitals")}>
          <ul className="space-y-2">
            {k.capitals.map((c) => (
              <li key={c.to}>
                <RecordLink href={hrefFor("places", c.to)}>
                  {kala.nameOf("places", c.to)}
                </RecordLink>
                <p className="text-sm text-ink/85">{c.note}</p>
                <Cite refs={c.references} kala={kala} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {places.length > k.capitals.length && (
        <Section title={t("placesIn")}>
          <ul className="flex flex-wrap gap-x-4">
            {places
              .filter((p) => !k.capitals.some((c) => c.to === p))
              .map((p) => (
                <li key={p}>
                  <RecordLink href={hrefFor("places", p)}>{kala.nameOf("places", p)}</RecordLink>
                </li>
              ))}
          </ul>
        </Section>
      )}

      {dynasties.length > 0 && (
        <Section title={t("dynasties")}>
          <ul className="flex flex-wrap gap-x-4">
            {dynasties.map((d) => (
              <li key={d}>
                <RecordLink href={hrefFor("dynasties", d)}>
                  {kala.nameOf("dynasties", d)}
                </RecordLink>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {k.rulers.length > 0 && (
        <Section title={t("rulers")}>
          <ul className="space-y-2">
            {k.rulers.map((r, i) => (
              <li key={i}>
                {r.entity ? (
                  <RecordLink href={hrefFor("entities", r.entity)}>
                    {kala.nameOf("entities", r.entity)}
                  </RecordLink>
                ) : (
                  r.name?.text
                )}{" "}
                <Badge tone={r.attested ? "gold" : "plain"}>
                  {r.attested ? t("attested") : t("legendary")}
                </Badge>
                {r.note && <p className="text-sm text-ink/85">{r.note}</p>}
                <Cite refs={r.references} kala={kala} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {k.relations.length > 0 && (
        <Section title={t("relations")}>
          <ul className="space-y-2">
            {k.relations.map((r, i) => (
              <li key={i}>
                <Badge>{enumLabel(te, "kingdomRelation", r.type)}</Badge>{" "}
                <RecordLink href={hrefFor("kingdoms", r.kingdom)}>
                  {kala.nameOf("kingdoms", r.kingdom)}
                </RecordLink>
                <VariantTag kala={kala} variant={r.variant} />
                <p className="text-sm text-ink/85">{r.note}</p>
                <Cite refs={r.references} kala={kala} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <TimeRails
        kala={kala}
        cosmic={k.cosmic_time}
        historical={k.historical_time ? [k.historical_time] : []}
      />
    </article>
  );
}
