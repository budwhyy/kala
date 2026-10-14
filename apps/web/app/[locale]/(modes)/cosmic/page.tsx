import type { CosmicTime, YugaName } from "@kala/schema";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { Cite, Section } from "@/components/cards/ui";
import {
  CosmicExplorer,
  type CosmicModelView,
  type Placement,
} from "@/components/explore/CosmicExplorer";
import { ModePage } from "@/components/shell/ModePage";
import { getKala } from "@/lib/content";
import { displayName, hrefFor } from "@/lib/graph/kala";
import { summarizeCycle } from "@/lib/time/cycle";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.title" });
  return { title: t("cosmic") };
}

export default async function CosmicPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cosmic");
  const tt = await getTranslations("types");
  const ts = await getTranslations("sources");
  const tn = await getTranslations("nav");
  const tj = await getTranslations("journey");
  const kala = await getKala();
  const ds = kala.dataset;

  const models: CosmicModelView[] = ds.cosmic.map((m) => ({
    slug: m.slug,
    name: kala.nameOf("cosmic", m.slug),
    variantName: kala.nameOf("variants", m.variant),
    summary: m.summary_beginner,
    cycle: summarizeCycle(m),
    sandhiNote: m.sandhi_note,
    manvantaras: m.manvantaras.map((x) => ({
      ordinal: x.ordinal,
      name: displayName(x.names, kala.locale),
      manuHref: x.manu ? (hrefFor("entities", x.manu) ?? undefined) : undefined,
    })),
    pralaya: m.pralaya.map((p) => ({
      name: displayName(p.names, kala.locale),
      explanation: p.explanation,
    })),
  }));

  // Everything the content places in a yuga, with the account that places it there.
  const placements: Record<YugaName, Placement[]> = { satya: [], treta: [], dvapara: [], kali: [] };
  const place = (times: CosmicTime[], href: string | null, label: string, kind: string) => {
    for (const t of times) {
      if (t.yuga && href) {
        placements[t.yuga].push({
          href,
          label,
          kind,
          variantName: kala.nameOf("variants", t.variant),
        });
      }
    }
  };
  for (const e of ds.entities)
    place(
      e.cosmic_time,
      hrefFor("entities", e.slug),
      kala.nameOf("entities", e.slug),
      tt("entities"),
    );
  for (const p of ds.places)
    place(p.cosmic_time, hrefFor("places", p.slug), kala.nameOf("places", p.slug), tt("places"));
  for (const k of ds.kingdoms)
    place(
      k.cosmic_time,
      hrefFor("kingdoms", k.slug),
      kala.nameOf("kingdoms", k.slug),
      tt("kingdoms"),
    );

  return (
    <ModePage
      title={tn("cosmic")}
      intro={
        <>
          <p>{t("intro")}</p>
          <p className="mt-2 rounded border border-celestial/40 bg-celestial/5 p-2 text-sm text-celestial">
            {t("notice")}
          </p>
        </>
      }
    >
      {kala.dataset.journeys.map((j) => (
        <p key={j.slug} className="mt-4">
          <Link
            prefetch={false}
            href={`/journey/${j.slug}`}
            className="rounded-full border border-gold/50 px-4 py-1.5 text-gold hover:bg-gold/10"
          >
            {tj("cosmicLink")}
          </Link>
        </p>
      ))}
      <Suspense fallback={null}>
        <CosmicExplorer models={models} placements={placements} />
      </Suspense>

      <Section title={ts("heading")}>
        <ul className="space-y-2 text-sm">
          {ds.cosmic.map((m) => (
            <li key={m.slug}>
              <span className="text-ink">{kala.nameOf("variants", m.variant)}: </span>
              <Cite refs={[...m.references, ...m.yugas.flatMap((y) => y.references)]} kala={kala} />
            </li>
          ))}
        </ul>
      </Section>
    </ModePage>
  );
}
