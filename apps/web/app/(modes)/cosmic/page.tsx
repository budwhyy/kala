import type { CosmicTime, YugaName } from "@kala/schema";
import { Suspense } from "react";
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

export const metadata = { title: "Cosmic time · KĀLA" };

export default async function CosmicPage() {
  const kala = await getKala();
  const ds = kala.dataset;

  const models: CosmicModelView[] = ds.cosmic.map((m) => ({
    slug: m.slug,
    name: displayName(m.names),
    variantName: kala.nameOf("variants", m.variant),
    summary: m.summary_beginner,
    cycle: summarizeCycle(m),
    sandhiNote: m.sandhi_note,
    manvantaras: m.manvantaras.map((x) => ({
      ordinal: x.ordinal,
      name: displayName(x.names),
      manuHref: x.manu ? (hrefFor("entities", x.manu) ?? undefined) : undefined,
    })),
    pralaya: m.pralaya.map((p) => ({ name: displayName(p.names), explanation: p.explanation })),
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
    place(e.cosmic_time, hrefFor("entities", e.slug), displayName(e.names), "Figure");
  for (const p of ds.places)
    place(p.cosmic_time, hrefFor("places", p.slug), displayName(p.names), "Place");
  for (const k of ds.kingdoms)
    place(k.cosmic_time, hrefFor("kingdoms", k.slug), displayName(k.names), "Kingdom");

  return (
    <ModePage
      title="Cosmic time"
      intro={
        <>
          <p>
            Many Hindu texts describe time as cycles of ages (yugas) nested inside larger cycles.
            Different texts give different figures, so each account is shown on its own.
          </p>
          <p className="mt-2 rounded border border-celestial/40 bg-celestial/5 p-2 text-sm text-celestial">
            Traditional chronology, not historical dating. These cycles cannot be placed on a
            calendar of years BCE/CE.
          </p>
        </>
      }
    >
      <Suspense fallback={null}>
        <CosmicExplorer models={models} placements={placements} />
      </Suspense>

      <Section title="Sources">
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
