import type { PlaceConfidence } from "@kala/schema";
import Link from "next/link";
import { Suspense } from "react";
import { KingdomKind } from "@/components/cards/PlaceCard";
import { Badge, CONFIDENCE, Section } from "@/components/cards/ui";
import { GeographyExplorer } from "@/components/explore/GeographyExplorer";
import { ModePage } from "@/components/shell/ModePage";
import { getKala } from "@/lib/content";
import { mapPlaces } from "@/lib/geo/features";
import { displayName } from "@/lib/graph/kala";

export const metadata = { title: "Geography · KĀLA" };

const ORDER: PlaceConfidence[] = ["verified", "traditional", "debated", "mythical"];

export default async function GeographyPage() {
  const kala = await getKala();
  const { onMap, cosmological } = mapPlaces(kala);

  const list = (
    <div className="rounded-xl border border-white/10 p-4">
      <dl className="grid gap-3 sm:grid-cols-2">
        {ORDER.map((c) => (
          <div key={c} className="rounded-lg border border-white/10 p-3">
            <dt>
              <Badge tone={CONFIDENCE[c].tone}>{CONFIDENCE[c].label}</Badge>
            </dt>
            <dd className="mt-1 text-sm text-muted">{CONFIDENCE[c].explain}</dd>
          </div>
        ))}
      </dl>
      {ORDER.map((c) => {
        const places = kala.dataset.places
          .filter((p) => p.confidence === c)
          .sort((a, b) => displayName(a.names).localeCompare(displayName(b.names)));
        return (
          <Section key={c} title={`${CONFIDENCE[c].label} (${places.length})`}>
            <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {places.map((p) => (
                <li key={p.slug}>
                  <Link href={`/place/${p.slug}`} className="text-celestial hover:underline">
                    {displayName(p.names)}
                  </Link>
                  {p.modern_admin && (
                    <span className="ml-2 text-sm text-muted">
                      {p.modern_admin.region ?? p.modern_admin.country}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        );
      })}
      <Section title="Kingdoms">
        <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {[...kala.dataset.kingdoms]
            .sort((a, b) => displayName(a.names).localeCompare(displayName(b.names)))
            .map((k) => (
              <li key={k.slug}>
                <Link href={`/kingdom/${k.slug}`} className="text-celestial hover:underline">
                  {displayName(k.names)}
                </Link>
                <KingdomKind kala={kala} slug={k.slug} />
              </li>
            ))}
        </ul>
      </Section>
    </div>
  );

  return (
    <ModePage
      title="Geography"
      intro={
        <p>
          Sacred and ancient places, each marked with how confident the identification is. A place
          being real does not make the stories set there historical.
        </p>
      }
    >
      <Suspense fallback={null}>
        <GeographyExplorer places={onMap} cosmological={cosmological} list={list} />
      </Suspense>
    </ModePage>
  );
}
