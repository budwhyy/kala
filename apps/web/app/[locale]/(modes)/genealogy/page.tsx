import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Suspense } from "react";
import { Section, shortSource } from "@/components/cards/ui";
import { GenealogyExplorer } from "@/components/explore/GenealogyExplorer";
import { ModePage } from "@/components/shell/ModePage";
import { getKala } from "@/lib/content";
import { groupOf, type CEdge, type CNode } from "@/lib/graph/constellation";
import { displayName } from "@/lib/graph/kala";
import { subName } from "@/lib/i18n-helpers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.title" });
  return { title: t("genealogy") };
}

export default async function GenealogyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("genealogy");
  const tn = await getTranslations("nav");
  const kala = await getKala();
  const nm = (names: Parameters<typeof displayName>[0]) => displayName(names, kala.locale);
  const ds = kala.dataset;

  const nodes: CNode[] = ds.entities.map((e) => {
    return {
      slug: e.slug,
      label: nm(e.names),
      sub: subName(e.names, kala.locale),
      group: groupOf(e.kinds),
      degree: kala.relationsOf(e.slug).length,
      summary: e.summary_beginner,
    };
  });
  const edges: CEdge[] = ds.relationships.map((r) => ({
    id: r.id,
    from: r.from,
    to: r.to,
    type: r.type,
    variant: r.variant,
    explanation: r.explanation,
    cites: r.references.map((ref) => ({
      text: `${shortSource(kala, ref.source)} ${ref.locator}`,
      href: `/source/${ref.source}`,
    })),
  }));
  const variantNames = Object.fromEntries(ds.variants.map((v) => [v.slug, nm(v.names)]));

  const byTradition = new Map<string, typeof ds.entities>();
  for (const e of ds.entities) {
    const t = e.traditions[0]!;
    byTradition.set(t, [...(byTradition.get(t) ?? []), e]);
  }
  const list = (
    <div className="rounded-xl border border-white/10 p-4">
      {[...byTradition.entries()].map(([trad, entities]) => (
        <Section key={trad} title={kala.nameOf("traditions", trad)}>
          <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {[...entities]
              .sort((a, b) => nm(a.names).localeCompare(nm(b.names), kala.locale))
              .map((e) => (
                <li key={e.slug}>
                  <Link
                    href={`/entity/${e.slug}`}
                    className="text-celestial underline decoration-celestial/40 underline-offset-2 hover:decoration-celestial"
                  >
                    {nm(e.names)}
                  </Link>
                  <span className="ml-2 text-sm text-muted">
                    {t("connections", { count: kala.relationsOf(e.slug).length })}
                  </span>
                </li>
              ))}
          </ul>
        </Section>
      ))}
    </div>
  );

  return (
    <ModePage title={tn("genealogy")} intro={<p>{t("intro")}</p>}>
      <Suspense fallback={null}>
        <GenealogyExplorer nodes={nodes} edges={edges} variantNames={variantNames} list={list} />
      </Suspense>
    </ModePage>
  );
}
