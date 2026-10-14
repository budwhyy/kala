import type { PlaceConfidence } from "@kala/schema";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Suspense } from "react";
import { KingdomKind } from "@/components/cards/PlaceCard";
import { Badge, CONFIDENCE_TONE, Section } from "@/components/cards/ui";
import { GeographyExplorer } from "@/components/explore/GeographyExplorer";
import { ModePage } from "@/components/shell/ModePage";
import { getKala } from "@/lib/content";
import { mapPlaces } from "@/lib/geo/features";
import { displayName } from "@/lib/graph/kala";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.title" });
  return { title: t("geography") };
}

const ORDER: PlaceConfidence[] = ["verified", "traditional", "debated", "mythical"];

export default async function GeographyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("geography");
  const tc = await getTranslations("confidence");
  const tn = await getTranslations("nav");
  const kala = await getKala();
  const nm = (names: Parameters<typeof displayName>[0]) => displayName(names, kala.locale);
  const { onMap, cosmological } = mapPlaces(kala);

  const list = (
    <div className="rounded-xl border border-white/10 p-4">
      <dl className="grid gap-3 sm:grid-cols-2">
        {ORDER.map((c) => (
          <div key={c} className="rounded-lg border border-white/10 p-3">
            <dt>
              <Badge tone={CONFIDENCE_TONE[c]}>{tc(`${c}.label`)}</Badge>
            </dt>
            <dd className="mt-1 text-sm text-muted">{tc(`${c}.explain`)}</dd>
          </div>
        ))}
      </dl>
      {ORDER.map((c) => {
        const places = kala.dataset.places
          .filter((p) => p.confidence === c)
          .sort((a, b) => nm(a.names).localeCompare(nm(b.names), kala.locale));
        return (
          <Section key={c} title={`${tc(`${c}.label`)} (${places.length})`}>
            <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {places.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/place/${p.slug}`}
                    className="text-celestial underline decoration-celestial/40 underline-offset-2 hover:decoration-celestial"
                  >
                    {nm(p.names)}
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
      <Section title={t("kingdoms")}>
        <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {[...kala.dataset.kingdoms]
            .sort((a, b) => nm(a.names).localeCompare(nm(b.names), kala.locale))
            .map((k) => (
              <li key={k.slug}>
                <Link
                  href={`/kingdom/${k.slug}`}
                  className="text-celestial underline decoration-celestial/40 underline-offset-2 hover:decoration-celestial"
                >
                  {nm(k.names)}
                </Link>
                <KingdomKind kala={kala} slug={k.slug} />
              </li>
            ))}
        </ul>
      </Section>
    </div>
  );

  return (
    <ModePage title={tn("geography")} intro={<p>{t("intro")}</p>}>
      <Suspense fallback={null}>
        <GeographyExplorer
          places={onMap}
          cosmological={cosmological}
          list={list}
          networkNames={Object.fromEntries(
            kala.dataset.networks
              .filter((n) => onMap.some((p) => p.networks.includes(n.slug)))
              .map((n) => [n.slug, kala.nameOf("networks", n.slug)]),
          )}
        />
      </Suspense>
    </ModePage>
  );
}
