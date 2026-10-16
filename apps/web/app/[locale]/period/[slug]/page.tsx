import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  Badge,
  Cite,
  NameBlock,
  RecordLink,
  Section,
  Summaries,
  TimeRails,
} from "@/components/cards/ui";
import { Page } from "@/components/shell/Header";
import { getKala } from "@/lib/content";
import { activeIn, atlasData } from "@/lib/phase4/atlas";

type Props = { params: Promise<{ slug: string; locale: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const kala = await getKala();
  return kala.dataset.periods.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const kala = await getKala();
  return { title: `${kala.nameOf("periods", slug)} · KĀLA` };
}

export default async function PeriodPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "history" });
  const kala = await getKala();
  const p = kala.get("periods", slug);
  if (!p) notFound();
  const { polities, sites } = atlasData(kala);
  const range = { start: p.historical_time.start, end: p.historical_time.end };
  const children = kala.dataset.periods.filter((c) => c.parent === slug);
  const list = (items: { slug: string; label: string; href: string }[]) => (
    <ul className="flex flex-wrap gap-x-4 gap-y-1">
      {items.map((x) => (
        <li key={x.slug}>
          <RecordLink href={x.href}>{x.label}</RecordLink>
        </li>
      ))}
    </ul>
  );

  return (
    <Page>
      <NameBlock names={p.names} />
      <p className="mt-2 text-sm">
        <Badge>{t(p.kind)}</Badge>
        {p.parent && (
          <>
            {" "}
            <span className="text-muted">{t("parent")}: </span>
            <RecordLink href={`/period/${p.parent}`}>{kala.nameOf("periods", p.parent)}</RecordLink>
          </>
        )}
      </p>
      <Summaries beginner={p.summary_beginner} scholar={p.summary_scholar} />
      <p className="mt-2">
        <Cite refs={p.references} kala={kala} />
      </p>
      <p className="mt-3">
        <RecordLink href={`/atlas?period=${slug}`}>{t("openAtlas")}</RecordLink>
      </p>
      {children.length > 0 && (
        <Section title={t("children")}>
          {list(
            children.map((c) => ({
              slug: c.slug,
              label: kala.nameOf("periods", c.slug),
              href: `/period/${c.slug}`,
            })),
          )}
        </Section>
      )}
      {activeIn(polities, range).length > 0 && (
        <Section title={t("polities")}>{list(activeIn(polities, range))}</Section>
      )}
      {activeIn(sites, range).length > 0 && (
        <Section title={t("sites")}>{list(activeIn(sites, range))}</Section>
      )}
      <TimeRails kala={kala} cosmic={[]} historical={[p.historical_time]} />
    </Page>
  );
}
