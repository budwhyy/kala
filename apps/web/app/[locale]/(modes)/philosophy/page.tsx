import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge, RecordLink, Section } from "@/components/cards/ui";
import { ModePage } from "@/components/shell/ModePage";
import { getKala } from "@/lib/content";
import { hrefFor } from "@/lib/graph/kala";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "philosophy" });
  return { title: `${t("title")} · KĀLA` };
}

export default async function PhilosophyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "philosophy" });
  const kala = await getKala();
  const concepts = [...kala.dataset.concepts].sort((a, b) =>
    kala.nameOf("concepts", a.slug).localeCompare(kala.nameOf("concepts", b.slug)),
  );

  // Schools that have at least one interpretation, with the concepts they speak to.
  const schools = new Map<string, string[]>();
  for (const c of concepts)
    for (const i of c.interpretations)
      schools.set(i.tradition, [...(schools.get(i.tradition) ?? []), c.slug]);
  const schoolList = [...schools.entries()].sort((a, b) => b[1].length - a[1].length);

  return (
    <ModePage
      title={t("title")}
      intro={
        <>
          <p>{t("intro")}</p>
          <p className="mt-2 rounded border border-celestial/40 bg-celestial/5 p-2 text-sm text-celestial">
            {t("differNote")}
          </p>
        </>
      }
    >
      <Section title={t("conceptsTitle", { count: concepts.length })}>
        {concepts.length === 0 && <p className="text-muted">{t("empty")}</p>}
        <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {concepts.map((c) => (
            <li key={c.slug} className="rounded-lg border border-white/10 p-4">
              <h3 className="text-xl text-gold">
                <RecordLink href={hrefFor("concepts", c.slug)}>
                  {kala.nameOf("concepts", c.slug)}
                </RecordLink>
              </h3>
              <p className="mt-1 line-clamp-3 text-sm text-ink/85">{c.summary_beginner}</p>
              <p className="mt-2 flex flex-wrap gap-1.5">
                {c.interpretations.map((i) => (
                  <Badge key={i.tradition} tone="celestial">
                    {kala.nameOf("traditions", i.tradition)}
                  </Badge>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {schoolList.length > 0 && (
        <Section title={t("schoolsTitle")}>
          <p className="mb-3 max-w-3xl text-sm text-muted">{t("schoolsIntro")}</p>
          <ul className="grid gap-3 md:grid-cols-2">
            {schoolList.map(([school, slugs]) => (
              <li key={school} className="rounded-lg border border-white/10 p-3">
                <RecordLink href={hrefFor("traditions", school)}>
                  {kala.nameOf("traditions", school)}
                </RecordLink>
                <span className="ml-2 text-sm text-muted">
                  {t("schoolConcepts", { count: slugs.length })}
                </span>
                <p className="mt-1 text-sm">
                  {slugs.map((s, i) => (
                    <span key={s}>
                      {i > 0 && ", "}
                      <Link
                        href={`/concept/${s}`}
                        className="text-celestial underline decoration-celestial/40 underline-offset-2 hover:decoration-celestial"
                      >
                        {kala.nameOf("concepts", s)}
                      </Link>
                    </span>
                  ))}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </ModePage>
  );
}
