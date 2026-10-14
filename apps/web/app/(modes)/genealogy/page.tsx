import Link from "next/link";
import { Suspense } from "react";
import { Section, shortSource } from "@/components/cards/ui";
import { GenealogyExplorer } from "@/components/explore/GenealogyExplorer";
import { ModePage } from "@/components/shell/ModePage";
import { getKala } from "@/lib/content";
import { groupOf, type CEdge, type CNode } from "@/lib/graph/constellation";
import { displayName } from "@/lib/graph/kala";

export const metadata = { title: "Genealogy · KĀLA" };

export default async function GenealogyPage() {
  const kala = await getKala();
  const ds = kala.dataset;

  const nodes: CNode[] = ds.entities.map((e) => {
    const deva = e.names.find((n) => n.script === "Deva");
    return {
      slug: e.slug,
      label: displayName(e.names),
      sub: deva ? `${deva.text}${deva.iast ? ` · ${deva.iast}` : ""}` : undefined,
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
  const variantNames = Object.fromEntries(ds.variants.map((v) => [v.slug, displayName(v.names)]));

  const byTradition = new Map<string, typeof ds.entities>();
  for (const e of ds.entities) {
    const t = e.traditions[0]!;
    byTradition.set(t, [...(byTradition.get(t) ?? []), e]);
  }
  const list = (
    <div className="rounded-xl border border-white/10 p-4">
      {[...byTradition.entries()].map(([t, entities]) => (
        <Section key={t} title={kala.nameOf("traditions", t)}>
          <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {[...entities]
              .sort((a, b) => displayName(a.names).localeCompare(displayName(b.names)))
              .map((e) => (
                <li key={e.slug}>
                  <Link
                    href={`/entity/${e.slug}`}
                    className="text-celestial underline decoration-celestial/40 underline-offset-2 hover:decoration-celestial"
                  >
                    {displayName(e.names)}
                  </Link>
                  <span className="ml-2 text-sm text-muted">
                    {kala.relationsOf(e.slug).length} connections
                  </span>
                </li>
              ))}
          </ul>
        </Section>
      ))}
    </div>
  );

  return (
    <ModePage
      title="Genealogy"
      intro={
        <p>
          Families of gods, sages, beings and kings, as the texts describe them. Every line is a
          connection a source makes. Where texts disagree, each account is kept and labelled.
        </p>
      }
    >
      <Suspense fallback={null}>
        <GenealogyExplorer nodes={nodes} edges={edges} variantNames={variantNames} list={list} />
      </Suspense>
    </ModePage>
  );
}
