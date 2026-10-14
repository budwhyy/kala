import { useTranslations } from "next-intl";
import type { Kala } from "@/lib/graph/kala";
import { hrefFor } from "@/lib/graph/kala";
import { Cite, RecordLink, Section, VariantTag } from "./ui";

/** Events a figure or place takes part in, each tagged with the account that tells it. */
export function EventsSection({ kala, slugs }: { kala: Kala; slugs: string[] }) {
  const t = useTranslations("sections2");
  if (slugs.length === 0) return null;
  return (
    <Section title={t("eventsTitle")}>
      <ul className="space-y-1">
        {slugs.map((s) => (
          <li key={s}>
            <RecordLink href={hrefFor("events", s)}>{kala.nameOf("events", s)}</RecordLink>
            <VariantTag kala={kala} variant={kala.get("events", s)?.variant} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** Other tellings of the same story (the churning of the ocean in three texts, etc.). */
export function RetellingsSection({ kala, slugs }: { kala: Kala; slugs: string[] }) {
  const t = useTranslations("sections2");
  if (slugs.length === 0) return null;
  return (
    <aside className="mt-6 rounded-lg border border-celestial/30 bg-celestial/5 p-4 text-sm">
      <h2 className="text-celestial">{t("retellingsTitle")}</h2>
      <p className="mt-1 text-muted">{t("retellingsNote")}</p>
      <ul className="mt-2 space-y-1">
        {slugs.map((s) => (
          <li key={s}>
            <RecordLink href={hrefFor("events", s)}>{kala.nameOf("events", s)}</RecordLink>
            <VariantTag kala={kala} variant={kala.get("events", s)?.variant} />
          </li>
        ))}
      </ul>
    </aside>
  );
}

/** Pilgrimage networks a place belongs to, with the list each membership comes from. */
export function NetworksSection({
  kala,
  memberships,
}: {
  kala: Kala;
  memberships: {
    network: string;
    variant?: string | undefined;
    references: { source: string; locator: string; note?: string | undefined }[];
  }[];
}) {
  const t = useTranslations("sections2");
  if (memberships.length === 0) return null;
  return (
    <Section title={t("networksTitle")}>
      <ul className="space-y-2">
        {memberships.map((m) => (
          <li key={`${m.network}|${m.variant ?? ""}`}>
            <RecordLink href={hrefFor("networks", m.network)}>
              {kala.nameOf("networks", m.network)}
            </RecordLink>
            <VariantTag kala={kala} variant={m.variant} />
            <div>
              <Cite refs={m.references} kala={kala} />
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
