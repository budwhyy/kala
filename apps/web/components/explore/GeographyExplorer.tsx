"use client";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { CONFIDENCE_STYLE } from "@/components/3d/colors";
import type { MapPlace } from "@/lib/geo/features";
import { subLang } from "@/lib/i18n-helpers";
import { useReducedMotion, useViewMode } from "@/lib/state/view";
import { ViewToggle } from "./ViewToggle";

function GlobeLoading() {
  const t = useTranslations("geography");
  return <div className="grid h-full place-items-center text-muted">{t("loading")}</div>;
}

const GeoMap = dynamic(() => import("@/components/3d/GeoMap"), {
  ssr: false,
  loading: () => <GlobeLoading />,
});

type Lens = "all" | "mythological" | "historical";
const LENSES: { id: Lens; label: string; hint?: string }[] = [
  { id: "all", label: "lensAll" },
  { id: "mythological", label: "lensMythological", hint: "hintMythological" },
  { id: "historical", label: "lensHistorical", hint: "hintHistorical" },
];

export function GeographyExplorer({
  places,
  cosmological,
  list,
  networkNames,
}: {
  places: MapPlace[];
  cosmological: MapPlace[];
  list: ReactNode;
  /** Pilgrimage networks that have places, by slug, for the filter. */
  networkNames: Record<string, string>;
}) {
  const t = useTranslations("geography");
  const tc = useTranslations("common");
  const tcf = useTranslations("confidence");
  const t2 = useTranslations("geography2");
  const locale = useLocale();
  const [view, setView, webgl, ready] = useViewMode({ heavy: true });
  const reducedMotion = useReducedMotion();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const selected = params.get("place");
  const [lens, setLens] = useState<Lens>("all");
  const [modern, setModern] = useState(0.6);

  const network = params.get("network");
  const activeNetwork = network && networkNames[network] ? network : null;
  const shown = useMemo(
    () =>
      places.filter(
        (p) =>
          (lens === "all" || (lens === "mythological" ? p.mythological : p.historical)) &&
          (!activeNetwork || p.networks.includes(activeNetwork)),
      ),
    [places, lens, activeNetwork],
  );
  const setNetwork = (slug: string) => {
    const next = new URLSearchParams(params.toString());
    if (slug) next.set("network", slug);
    else next.delete("network");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };
  const place = [...places, ...cosmological].find((p) => p.slug === selected);
  const select = (slug: string) => {
    const next = new URLSearchParams(params.toString());
    next.set("place", slug);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-3">
        <div role="radiogroup" aria-label={t("whichRecord")} className="flex flex-wrap gap-1">
          {LENSES.map((l) => (
            <button
              key={l.id}
              role="radio"
              aria-checked={lens === l.id}
              onClick={() => setLens(l.id)}
              className={`rounded-full border px-3 py-1 text-sm ${
                lens === l.id ? "border-celestial text-celestial" : "border-white/15 text-ink/80"
              }`}
            >
              {t(l.label)}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <ViewToggle view={view} setView={setView} webgl={webgl} />
        </div>
      </div>
      {lens !== "all" && (
        <p className="mt-2 rounded border border-celestial/40 bg-celestial/5 p-2 text-sm text-celestial">
          {t(LENSES.find((l) => l.id === lens)!.hint!)} {t("lensNote")}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <label htmlFor="network-filter" className="text-muted">
          {t2("networkFilter")}
        </label>
        <select
          id="network-filter"
          value={activeNetwork ?? ""}
          onChange={(e) => setNetwork(e.target.value)}
          className="rounded border border-white/15 bg-void px-2 py-1"
        >
          <option value="">{t2("allNetworks")}</option>
          {Object.entries(networkNames).map(([slug, name]) => (
            <option key={slug} value={slug}>
              {name}
            </option>
          ))}
        </select>
      </div>
      {activeNetwork && (
        <div
          className="mt-2 rounded border border-copper/40 bg-copper/5 p-3 text-sm"
          aria-live="polite"
        >
          <p>{t2("showing", { count: shown.length, name: networkNames[activeNetwork]! })}</p>
          <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
            {shown.map((p) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => select(p.slug)}
                  className="text-celestial underline decoration-celestial/40 underline-offset-2"
                >
                  {p.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div>
          {view === "3d" ? (
            <>
              <div className="h-[26rem] overflow-hidden rounded-xl border border-white/10 sm:h-[34rem]">
                {ready && (
                  <GeoMap
                    places={shown}
                    selected={selected}
                    onSelect={select}
                    modern={modern}
                    reducedMotion={reducedMotion}
                  />
                )}
              </div>
              <label className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span className="text-muted">{t("ancientView")}</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={modern}
                  onChange={(e) => setModern(Number(e.target.value))}
                  className="w-48 accent-[var(--kala-gold)]"
                  aria-label={t("modernOverlay")}
                />
                <span className="text-muted">{t("modernMap")}</span>
              </label>
              <p className="mt-1 text-xs text-muted">{t("modernNote")}</p>
            </>
          ) : (
            list
          )}
          <Legend />
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-white/10 p-4" aria-live="polite">
            {place ? (
              <>
                <p className="text-xs tracking-[0.2em] text-muted uppercase">
                  {t("selectedPlace")}
                </p>
                <h2 className="text-2xl text-gold">{place.label}</h2>
                {place.sub && (
                  <p lang={subLang(locale)} className="text-ink/75">
                    {place.sub}
                  </p>
                )}
                <p
                  className="mt-1 text-sm"
                  style={{ color: CONFIDENCE_STYLE[place.confidence].color }}
                >
                  {tcf(`${place.confidence}.label`)}
                </p>
                {place.modern && (
                  <p className="text-sm text-muted">{t("today", { place: place.modern })}</p>
                )}
                <p className="mt-2 text-sm">{place.summary}</p>
                {place.kingdoms.length > 0 && (
                  <ul className="mt-2 text-sm">
                    {place.kingdoms.map((k) => (
                      <li key={k.slug}>
                        <Link
                          href={`/kingdom/${k.slug}`}
                          className="text-celestial underline decoration-celestial/40 underline-offset-2 hover:decoration-celestial"
                        >
                          {k.label}
                        </Link>{" "}
                        <span className="text-xs text-muted">
                          {k.legendary ? t("epicLegendary") : t("historical")}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  href={`/place/${place.slug}`}
                  className="mt-2 inline-block text-sm text-celestial underline decoration-celestial/40 underline-offset-2 hover:decoration-celestial"
                >
                  {tc("openCard")}
                </Link>
              </>
            ) : (
              <p className="text-sm text-muted">{t("prompt")}</p>
            )}
          </div>

          <div className="rounded-xl border border-indigo/60 bg-indigo/15 p-4">
            <h2 className="text-celestial">{t("notOnMap")}</h2>
            <p className="mt-1 text-sm text-muted">{t("notOnMapBody")}</p>
            <ul className="mt-2 space-y-1 text-sm">
              {cosmological.map((p) => (
                <li key={p.slug}>
                  <button
                    type="button"
                    onClick={() => select(p.slug)}
                    className="text-celestial underline decoration-celestial/40 underline-offset-2 hover:decoration-celestial"
                  >
                    {p.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Legend() {
  const t = useTranslations("geography");
  const tcf = useTranslations("confidence");
  return (
    <ul
      aria-label={t("legend")}
      className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/80"
    >
      {(["verified", "traditional", "debated"] as const).map((c) => (
        <li key={c} className="inline-flex items-center gap-1.5">
          <span
            className="inline-block size-2.5 rounded-full"
            style={{ background: CONFIDENCE_STYLE[c].color }}
          />
          {tcf(`${c}.label`)}
        </li>
      ))}
      <li className="inline-flex items-center gap-1.5">
        <span
          className="inline-block size-2.5 rounded-full border"
          style={{ borderColor: CONFIDENCE_STYLE.debated.color }}
        />
        {t("proposedLegend")}
      </li>
    </ul>
  );
}
