import { useTranslations } from "next-intl";
import type { Kala } from "@/lib/graph/kala";
import { LinkList } from "./EntityCard";
import { RecordLink, Section, VariantTag } from "./ui";

/** Journeys (epic routes) a figure travels or a place lies on. */
export function JourneysSection({ kala, slugs }: { kala: Kala; slugs: string[] }) {
  const t = useTranslations("sections3");
  if (slugs.length === 0) return null;
  return (
    <Section title={t("journeysTitle")}>
      <ul className="space-y-1">
        {slugs.map((s) => (
          <li key={s}>
            <RecordLink href={`/route/${s}`}>{kala.nameOf("routes", s)}</RecordLink>
            <VariantTag kala={kala} variant={kala.get("routes", s)?.variant} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** A figure's part in a battlefield: days commanded, the day they fell, or that they took part. */
export function BattleRoleSection({ kala, slug }: { kala: Kala; slug: string }) {
  const t = useTranslations("sections3");
  const roles = kala.dataset.battlefields.flatMap((b) => {
    const commanded = b.days
      .filter((d) => d.commanders.some((c) => c.entity === slug))
      .map((d) => d.day);
    const fell = b.days.find((d) => d.fallen.some((f) => f.entity === slug))?.day;
    const present =
      commanded.length > 0 ||
      fell !== undefined ||
      b.sides.some((s) => s.leaders.includes(slug)) ||
      b.days.some((d) => d.encounters.some((e) => e.participants.includes(slug)));
    return present ? [{ b, commanded, fell }] : [];
  });
  if (roles.length === 0) return null;
  return (
    <Section title={t("battleTitle")}>
      <ul className="space-y-1">
        {roles.map(({ b, commanded, fell }) => (
          <li key={b.slug}>
            <RecordLink href={`/battlefield/${b.slug}`}>
              {kala.nameOf("battlefields", b.slug)}
            </RecordLink>
            <span className="ml-2 text-sm text-ink/80">
              {[
                commanded.length > 0 ? t("commanded", { days: commanded.join(", ") }) : null,
                fell !== undefined ? t("fellOn", { day: fell }) : null,
              ]
                .filter(Boolean)
                .join(" · ") || t("tookPart")}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** Philosophical concepts an event sets out (e.g. the Bhagavad Gita). */
export function ConceptsSection({ kala, slugs }: { kala: Kala; slugs: string[] }) {
  const t = useTranslations("sections3");
  if (slugs.length === 0) return null;
  return (
    <Section title={t("conceptsTitle")}>
      <LinkList kala={kala} type="concepts" slugs={slugs} />
    </Section>
  );
}
