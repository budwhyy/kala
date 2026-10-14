import Link from "next/link";
import { Section } from "@/components/cards/ui";
import { ModePage } from "@/components/shell/ModePage";
import { getKala } from "@/lib/content";
import { displayName } from "@/lib/graph/kala";

export const metadata = { title: "Genealogy · KĀLA" };

export default async function GenealogyPage() {
  const kala = await getKala();
  const byTradition = new Map<string, typeof kala.dataset.entities>();
  for (const e of kala.dataset.entities) {
    const t = e.traditions[0]!;
    byTradition.set(t, [...(byTradition.get(t) ?? []), e]);
  }
  return (
    <ModePage
      title="Genealogy"
      intro={
        <p>
          Families of gods, sages, beings and kings, as the texts describe them. Where texts
          disagree about a parent or a list, each account is kept and labelled.
        </p>
      }
    >
      {[...byTradition.entries()].map(([t, entities]) => (
        <Section key={t} title={kala.nameOf("traditions", t)}>
          <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2 md:grid-cols-3">
            {[...entities]
              .sort((a, b) => displayName(a.names).localeCompare(displayName(b.names)))
              .map((e) => (
                <li key={e.slug}>
                  <Link href={`/entity/${e.slug}`} className="text-celestial hover:underline">
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
    </ModePage>
  );
}
