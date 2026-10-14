import type { PilgrimageNetwork, Tradition } from "@kala/schema";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge, RecordLink, Section } from "@/components/cards/ui";
import { ModePage } from "@/components/shell/ModePage";
import { getKala } from "@/lib/content";
import { hrefFor } from "@/lib/graph/kala";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pilgrimage" });
  return { title: `${t("title")} · KĀLA` };
}

/** Networks are grouped by the family of their tradition, so traditions are never mixed (principle 11). */
type TraditionFamily = Tradition["family"];
const FAMILIES: TraditionFamily[] = [
  "hindu",
  "vedic",
  "buddhist",
  "jain",
  "indigenous",
  "cross_cultural",
];

export default async function PilgrimagePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pilgrimage" });
  const kala = await getKala();
  const networks = kala.dataset.networks;

  const familyOf = (n: PilgrimageNetwork): TraditionFamily =>
    kala.get("traditions", n.traditions[0]!)?.family ?? "hindu";
  const memberCount = (slug: string) =>
    kala.dataset.places.filter((p) => p.pilgrimage_networks.some((m) => m.network === slug)).length;

  return (
    <ModePage
      title={t("title")}
      intro={
        <>
          <p>{t("intro")}</p>
          <p className="mt-2 rounded border border-celestial/40 bg-celestial/5 p-2 text-sm text-celestial">
            {t("respectNote")}
          </p>
        </>
      }
    >
      {networks.length === 0 && <p className="mt-6 text-muted">{t("empty")}</p>}
      {FAMILIES.map((family) => {
        const inFamily = networks
          .filter((n) => familyOf(n) === family)
          .sort((a, b) => memberCount(b.slug) - memberCount(a.slug));
        if (inFamily.length === 0) return null;
        return (
          <Section key={family} title={t(`families.${family}`)}>
            <ul className="grid gap-3 md:grid-cols-2">
              {inFamily.map((n) => (
                <li key={n.slug} className="rounded-lg border border-white/10 p-4">
                  <h3 className="text-xl text-gold">
                    <RecordLink href={hrefFor("networks", n.slug)}>
                      {kala.nameOf("networks", n.slug)}
                    </RecordLink>
                  </h3>
                  <p className="mt-1 flex flex-wrap gap-1.5">
                    <Badge tone="copper">{t("places", { count: memberCount(n.slug) })}</Badge>
                    {n.variants.length > 1 && (
                      <Badge tone="celestial">{t("lists", { count: n.variants.length })}</Badge>
                    )}
                  </p>
                  <p className="mt-2 line-clamp-3 text-sm text-ink/85">{n.summary_beginner}</p>
                  <p className="mt-2 text-sm">
                    <Link
                      prefetch={false}
                      href={`/geography?network=${n.slug}`}
                      className="text-celestial underline decoration-celestial/40 underline-offset-2 hover:decoration-celestial"
                    >
                      {t("viewMap")}
                    </Link>
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        );
      })}
    </ModePage>
  );
}
