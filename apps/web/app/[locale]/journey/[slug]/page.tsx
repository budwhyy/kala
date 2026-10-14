import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { shortSource } from "@/components/cards/ui";
import { JourneyPlayer, type JourneyStepView } from "@/components/explore/JourneyPlayer";
import { Page } from "@/components/shell/Header";
import { getKala } from "@/lib/content";
import { hrefFor } from "@/lib/graph/kala";
import { summarizeCycle } from "@/lib/time/cycle";

type Props = { params: Promise<{ slug: string; locale: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const kala = await getKala();
  return kala.dataset.journeys.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const kala = await getKala();
  return { title: `${kala.nameOf("journeys", slug)} · KĀLA` };
}

export default async function JourneyPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "journey" });
  const kala = await getKala();
  const journey = kala.get("journeys", slug);
  if (!journey) notFound();

  const linkHref = (collection: string, s: string) =>
    collection === "cosmic" ? "/cosmic" : hrefFor(collection as never, s);
  const linkLabel = (collection: string, s: string) =>
    collection === "cosmic"
      ? kala.nameOf("variants", kala.get("cosmic", s)?.variant ?? s)
      : kala.nameOf(collection as never, s);

  const steps: JourneyStepView[] = journey.steps.map((s) => ({
    id: s.id,
    title: s.title,
    body: s.body,
    detail: s.detail,
    cites: s.references.map((r) => ({
      text: `${shortSource(kala, r.source)} ${r.locator}`,
      href: `/source/${r.source}`,
    })),
    links: s.links.flatMap((l) => {
      const href = linkHref(l.collection, l.slug);
      return href
        ? [{ label: linkLabel(l.collection, l.slug), href, kind: l.collection, note: l.note }]
        : [];
    }),
    cosmicModel: s.cosmic_model,
    focusYuga: s.focus_yuga,
  }));

  const models = [
    ...new Set(journey.steps.flatMap((s) => (s.cosmic_model ? [s.cosmic_model] : []))),
  ];
  const cycles = Object.fromEntries(models.map((m) => [m, summarizeCycle(kala.get("cosmic", m)!)]));
  const modelNames = Object.fromEntries(
    models.map((m) => [m, kala.nameOf("variants", kala.get("cosmic", m)!.variant)]),
  );

  return (
    <Page>
      <p className="text-xs tracking-[0.2em] text-muted uppercase">{t("label")}</p>
      <h1 className="text-4xl text-gold">{kala.nameOf("journeys", slug)}</h1>
      <p className="mt-2 max-w-3xl text-ink/85">{journey.summary_beginner}</p>
      <p className="mt-3 max-w-3xl rounded border border-celestial/40 bg-celestial/5 p-2 text-sm text-celestial">
        {t("notHistorical")}
      </p>
      <Suspense fallback={null}>
        <JourneyPlayer steps={steps} cycles={cycles} modelNames={modelNames} />
      </Suspense>
    </Page>
  );
}
