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
import { enumLabel } from "@/lib/i18n-helpers";

type Props = { params: Promise<{ slug: string; locale: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const kala = await getKala();
  return kala.dataset.transmissions.map((x) => ({ slug: x.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const kala = await getKala();
  return { title: `${kala.nameOf("transmissions", slug)} · KĀLA` };
}

export default async function TransmissionPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "history" });
  const tc = await getTranslations({ locale, namespace: "civ" });
  const te = await getTranslations({ locale, namespace: "enums" });
  const kala = await getKala();
  const x = kala.get("transmissions", slug);
  if (!x) notFound();

  const end = (text?: string, tradition?: string, place?: string) => (
    <>
      {text && <RecordLink href={`/text/${text}`}>{kala.nameOf("texts", text)}</RecordLink>}
      {tradition && (
        <>
          {text && " · "}
          <RecordLink href={`/tradition/${tradition}`}>
            {kala.nameOf("traditions", tradition)}
          </RecordLink>
        </>
      )}
      {place && (
        <>
          {" · "}
          <RecordLink href={`/place/${place}`}>{kala.nameOf("places", place)}</RecordLink>
        </>
      )}
    </>
  );

  return (
    <Page>
      <NameBlock names={x.names} />
      <p className="mt-2 text-sm">
        <span className="text-muted">{t("type")}: </span>
        <Badge>{tc(x.type)}</Badge> <span className="text-muted">{tc(`${x.type}Explain`)}</span>
      </p>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted">{t("from")}</dt>
          <dd>{end(x.from_text, x.from_tradition, x.from_place)}</dd>
        </div>
        <div>
          <dt className="text-muted">{t("to")}</dt>
          <dd>{end(x.to_text, x.to_tradition, x.to_place)}</dd>
        </div>
      </dl>
      <Summaries beginner={x.summary_beginner} scholar={x.summary_scholar} />
      <p className="mt-2">
        <Cite refs={x.references} kala={kala} />
      </p>
      {x.note && (
        <Section title={t("note")}>
          <p className="text-sm text-ink/85">{x.note}</p>
        </Section>
      )}
      {x.evidence.length > 0 && (
        <Section title={t("evidence")}>
          <ul className="space-y-2">
            {x.evidence.map((e, i) => (
              <li key={i}>
                <Badge>{enumLabel(te, "evidence", e.type)}</Badge>{" "}
                <span className="text-sm text-ink/85">{e.summary}</span>{" "}
                <Cite refs={e.references} kala={kala} />
              </li>
            ))}
          </ul>
        </Section>
      )}
      <p className="mt-4">
        <RecordLink href="/civilization">{t("openCiv")}</RecordLink>
      </p>
      {x.historical_time && <TimeRails kala={kala} cosmic={[]} historical={[x.historical_time]} />}
    </Page>
  );
}
