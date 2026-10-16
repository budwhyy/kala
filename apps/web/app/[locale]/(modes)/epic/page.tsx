import { getTranslations, setRequestLocale } from "next-intl/server";
import { Badge, RecordLink } from "@/components/cards/ui";
import { ModePage } from "@/components/shell/ModePage";
import { getKala } from "@/lib/content";
import { epicPeople } from "@/lib/phase3/epic";
import { enumLabel } from "@/lib/i18n-helpers";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "epic" });
  return { title: `${t("indexTitle")} · KĀLA` };
}

/** Texts told as story worlds: any text with narrative-ordered events in content. */
export default async function EpicIndex({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "epic" });
  const kala = await getKala();
  const texts = kala.dataset.texts
    .map((x) => ({
      text: x,
      events: kala.dataset.events.filter((e) => e.narrative_order?.text === x.slug).length,
      routes: kala.dataset.routes.filter((r) => r.text === x.slug).length,
      battles: kala.dataset.battlefields.filter((b) => b.text === x.slug).length,
    }))
    .filter((x) => x.events > 0)
    .sort((a, b) => b.events - a.events);
  // Traditions stay distinct: Hindu, Buddhist and Jain story worlds are listed separately.
  const te = await getTranslations({ locale, namespace: "enums" });
  const familyOf = (slug: string) => kala.get("traditions", slug)?.family ?? "hindu";
  const FAMILIES = ["vedic", "hindu", "buddhist", "jain", "indigenous", "cross_cultural"] as const;
  const groups = FAMILIES.map((f) => ({
    family: f,
    texts: texts.filter((x) => familyOf(x.text.traditions[0] ?? "") === f),
  })).filter((g) => g.texts.length > 0);

  return (
    <ModePage title={t("indexTitle")} intro={<p>{t("indexIntro")}</p>}>
      {texts.length === 0 && <p className="mt-6 text-muted">{t("empty")}</p>}
      {groups.map((g) => (
        <section key={g.family} className="mt-6">
          {groups.length > 1 && (
            <h2 className="font-serif text-xl text-ink">{enumLabel(te, "family", g.family)}</h2>
          )}
          <ul className="mt-3 grid gap-4 md:grid-cols-2">
            {g.texts.map(({ text, events, routes, battles }) => (
              <li key={text.slug} className="rounded-xl border border-white/10 p-5">
                <h3 className="text-2xl text-gold">
                  <RecordLink href={`/epic/${text.slug}`}>
                    {kala.nameOf("texts", text.slug)}
                  </RecordLink>
                </h3>
                <p className="mt-2 text-ink/85">{text.summary_beginner}</p>
                <p className="mt-3 flex flex-wrap gap-1.5">
                  <Badge tone="gold">{t("countEvents", { count: events })}</Badge>
                  <Badge tone="celestial">
                    {t("countPeople", { count: epicPeople(kala, text.slug).size })}
                  </Badge>
                  {routes > 0 && <Badge tone="copper">{t("countRoutes", { count: routes })}</Badge>}
                  {battles > 0 && <Badge tone="red">{t("countBattles", { count: battles })}</Badge>}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </ModePage>
  );
}
