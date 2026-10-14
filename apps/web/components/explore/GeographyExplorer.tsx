"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { CONFIDENCE_STYLE } from "@/components/3d/colors";
import type { MapPlace } from "@/lib/geo/features";
import { useReducedMotion, useViewMode } from "@/lib/state/view";
import { ViewToggle } from "./ViewToggle";

const GeoMap = dynamic(() => import("@/components/3d/GeoMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center text-muted">Loading the globe…</div>
  ),
});

type Lens = "all" | "mythological" | "historical";
const LENSES: { id: Lens; label: string; hint: string }[] = [
  { id: "all", label: "All places", hint: "" },
  {
    id: "mythological",
    label: "In the epics & Puranas",
    hint: "Places the texts connect to stories, figures or legendary kingdoms. Positions in story time, not dates.",
  },
  {
    id: "historical",
    label: "In the historical record",
    hint: "Places with archaeological or historical evidence, or a historical state. Dated by evidence.",
  },
];

export function GeographyExplorer({
  places,
  cosmological,
  list,
}: {
  places: MapPlace[];
  cosmological: MapPlace[];
  list: ReactNode;
}) {
  const [view, setView, webgl] = useViewMode();
  const reducedMotion = useReducedMotion();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const selected = params.get("place");
  const [lens, setLens] = useState<Lens>("all");
  const [modern, setModern] = useState(0.6);

  const shown = useMemo(
    () =>
      places.filter(
        (p) => lens === "all" || (lens === "mythological" ? p.mythological : p.historical),
      ),
    [places, lens],
  );
  const place = [...places, ...cosmological].find((p) => p.slug === selected);
  const select = (slug: string) => {
    const next = new URLSearchParams(params.toString());
    next.set("place", slug);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-3">
        <div role="radiogroup" aria-label="Which record" className="flex flex-wrap gap-1">
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
              {l.label}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <ViewToggle view={view} setView={setView} webgl={webgl} />
        </div>
      </div>
      {lens !== "all" && (
        <p className="mt-2 rounded border border-celestial/40 bg-celestial/5 p-2 text-sm text-celestial">
          {LENSES.find((l) => l.id === lens)!.hint} Story time and historical dates are different
          systems and are never placed on one timeline.
        </p>
      )}

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div>
          {view === "3d" ? (
            <>
              <div className="h-[26rem] overflow-hidden rounded-xl border border-white/10 sm:h-[34rem]">
                <GeoMap
                  places={shown}
                  selected={selected}
                  onSelect={select}
                  modern={modern}
                  reducedMotion={reducedMotion}
                />
              </div>
              <label className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span className="text-muted">Ancient view</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={modern}
                  onChange={(e) => setModern(Number(e.target.value))}
                  className="w-48 accent-[var(--kala-gold)]"
                  aria-label="Modern map overlay"
                />
                <span className="text-muted">Modern map</span>
              </label>
              <p className="mt-1 text-xs text-muted">
                Modern names and borders are shown for orientation only. They are never projected
                back onto ancient places.
              </p>
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
                <p className="text-xs tracking-[0.2em] text-muted uppercase">Selected place</p>
                <h2 className="text-2xl text-gold">{place.label}</h2>
                {place.sub && <p className="text-ink/75">{place.sub}</p>}
                <p
                  className="mt-1 text-sm"
                  style={{ color: CONFIDENCE_STYLE[place.confidence].color }}
                >
                  {CONFIDENCE_STYLE[place.confidence].label}
                </p>
                {place.modern && <p className="text-sm text-muted">Today: {place.modern}</p>}
                <p className="mt-2 text-sm">{place.summary}</p>
                {place.kingdoms.length > 0 && (
                  <ul className="mt-2 text-sm">
                    {place.kingdoms.map((k) => (
                      <li key={k.slug}>
                        <Link
                          href={`/kingdom/${k.slug}`}
                          className="text-celestial hover:underline"
                        >
                          {k.label}
                        </Link>{" "}
                        <span className="text-xs text-muted">
                          {k.legendary ? "epic / legendary" : "historical"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  href={`/place/${place.slug}`}
                  className="mt-2 inline-block text-sm text-celestial hover:underline"
                >
                  Open full card →
                </Link>
              </>
            ) : (
              <p className="text-sm text-muted">Select a place on the globe or in the list.</p>
            )}
          </div>

          <div className="rounded-xl border border-indigo/60 bg-indigo/15 p-4">
            <h2 className="text-celestial">Not on the map</h2>
            <p className="mt-1 text-sm text-muted">
              Cosmological realms are part of the cosmos the texts describe, not places on Earth.
              They have no coordinates.
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              {cosmological.map((p) => (
                <li key={p.slug}>
                  <button
                    type="button"
                    onClick={() => select(p.slug)}
                    className="text-celestial hover:underline"
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
  return (
    <ul aria-label="Legend" className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/80">
      {(["verified", "traditional", "debated"] as const).map((c) => (
        <li key={c} className="inline-flex items-center gap-1.5">
          <span
            className="inline-block size-2.5 rounded-full"
            style={{ background: CONFIDENCE_STYLE[c].color }}
          />
          {CONFIDENCE_STYLE[c].label}
        </li>
      ))}
      <li className="inline-flex items-center gap-1.5">
        <span
          className="inline-block size-2.5 rounded-full border"
          style={{ borderColor: CONFIDENCE_STYLE.debated.color }}
        />
        Proposed location of a debated place
      </li>
    </ul>
  );
}
