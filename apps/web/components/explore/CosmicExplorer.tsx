"use client";
import type { YugaName } from "@kala/schema";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { YUGA_TONE } from "@/components/3d/colors";
import { useReducedMotion, useViewMode } from "@/lib/state/view";
import type { CycleSummary } from "@/lib/time/cycle";
import { ViewToggle } from "./ViewToggle";

const CosmicWheel = dynamic(() => import("@/components/3d/CosmicWheel"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center text-muted">Loading the wheel…</div>
  ),
});

export type CosmicModelView = {
  slug: string;
  name: string;
  variantName: string;
  summary: string;
  cycle: CycleSummary;
  sandhiNote?: string | undefined;
  manvantaras: { ordinal: number; name: string; manuHref?: string | undefined }[];
  pralaya: { name: string; explanation: string }[];
};

export type Placement = { href: string; label: string; kind: string; variantName: string };

export function CosmicExplorer({
  models,
  placements,
}: {
  models: CosmicModelView[];
  placements: Record<YugaName, Placement[]>;
}) {
  const [view, setView, webgl] = useViewMode();
  const reducedMotion = useReducedMotion();
  const [modelSlug, setModelSlug] = useState(models[0]?.slug);
  const [selected, setSelected] = useState<YugaName | null>(null);
  const model = models.find((m) => m.slug === modelSlug) ?? models[0];
  if (!model) return null;
  const yuga = model.cycle.yugas.find((y) => y.yuga === selected);

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-3">
        <div role="tablist" aria-label="Account of the cycle" className="flex flex-wrap gap-1">
          {models.map((m) => (
            <button
              key={m.slug}
              role="tab"
              aria-selected={m.slug === model.slug}
              onClick={() => setModelSlug(m.slug)}
              className={`rounded-full border px-3 py-1 text-sm ${
                m.slug === model.slug
                  ? "border-celestial text-celestial"
                  : "border-white/15 text-ink/80"
              }`}
            >
              {m.variantName}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <ViewToggle view={view} setView={setView} webgl={webgl} />
        </div>
      </div>

      <p className="mt-3 max-w-3xl text-ink/85">{model.summary}</p>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div>
          {view === "3d" ? (
            <div className="h-[22rem] rounded-xl border border-white/10 bg-gradient-to-b from-indigo/30 to-void sm:h-[30rem]">
              <CosmicWheel
                cycle={model.cycle}
                selected={selected}
                onSelect={setSelected}
                reducedMotion={reducedMotion}
              />
            </div>
          ) : (
            <CycleTable model={model} />
          )}

          <div role="group" aria-label="Choose a yuga" className="mt-3 flex flex-wrap gap-2">
            {model.cycle.yugas.map((y) => (
              <button
                key={y.yuga}
                type="button"
                aria-pressed={selected === y.yuga}
                onClick={() => setSelected(selected === y.yuga ? null : y.yuga)}
                className="rounded-full border px-3 py-1 text-sm capitalize"
                style={{
                  borderColor: `var(${YUGA_TONE[y.yuga]})`,
                  background: selected === y.yuga ? `var(${YUGA_TONE[y.yuga]})` : "transparent",
                  color: selected === y.yuga ? "var(--kala-void)" : "var(--kala-ink)",
                }}
              >
                {y.yuga} Yuga
              </button>
            ))}
          </div>
          <Legend model={model} />
        </div>

        <aside aria-live="polite" className="rounded-xl border border-white/10 p-4">
          {yuga ? (
            <>
              <h2 className="text-2xl text-gold capitalize">{yuga.yuga} Yuga</h2>
              <p className="mt-1 text-sm text-muted">According to the {model.variantName}</p>
              <dl className="mt-3 space-y-1 text-sm">
                <div>
                  <dt className="inline text-muted">Length: </dt>
                  <dd className="inline">{yuga.divineYears.toLocaleString("en")} divine years</dd>
                </div>
                {yuga.dawn !== undefined && (
                  <div>
                    <dt className="inline text-muted">Twilights: </dt>
                    <dd className="inline">
                      {yuga.dawn} at dawn, {yuga.dusk ?? 0} at dusk (included)
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="inline text-muted">Share of a mahayuga: </dt>
                  <dd className="inline">{Math.round(yuga.share * 100)}%</dd>
                </div>
              </dl>
              <h3 className="mt-4 text-xs tracking-[0.2em] text-muted uppercase">
                Placed in this yuga
              </h3>
              {placements[yuga.yuga].length === 0 ? (
                <p className="mt-1 text-sm text-muted">
                  No figures or events are placed in this yuga in KĀLA’s content yet.
                </p>
              ) : (
                <ul className="mt-1 space-y-1 text-sm">
                  {placements[yuga.yuga].map((p) => (
                    <li key={p.href + p.variantName}>
                      <Link href={p.href} className="text-celestial hover:underline">
                        {p.label}
                      </Link>{" "}
                      <span className="text-xs text-muted">
                        {p.kind} · {p.variantName}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p className="text-sm text-muted">
              Select a yuga on the wheel or with the buttons to see its length and what the texts
              place in it.
            </p>
          )}
        </aside>
      </div>

      {model.pralaya.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-xs tracking-[0.2em] text-muted uppercase">
            Dissolution (pralaya) in the {model.variantName}
          </h2>
          <dl className="grid gap-3 md:grid-cols-2">
            {model.pralaya.map((p) => (
              <div key={p.name} className="rounded-lg border border-white/10 p-3">
                <dt className="text-gold">{p.name}</dt>
                <dd className="mt-1 text-sm text-ink/85">{p.explanation}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  );
}

function Legend({ model }: { model: CosmicModelView }) {
  const c = model.cycle;
  return (
    <ul className="mt-4 space-y-1 text-sm text-ink/85">
      <li>
        <span className="text-muted">Inner ring · </span>one mahayuga ={" "}
        {c.mahayugaDivineYears.toLocaleString("en")} divine years, split into four yugas.
      </li>
      <li>
        <span className="text-muted">Middle ring · </span>one manvantara (age of a Manu) ={" "}
        {c.mahayugasPerManvantara} mahayugas.
        {model.sandhiNote && <span className="text-muted"> {model.sandhiNote}</span>}
      </li>
      <li>
        <span className="text-muted">Outer ring · </span>
        {c.manvantarasPerKalpa
          ? `one kalpa (day of Brahma) = ${c.manvantarasPerKalpa} manvantaras.`
          : "this text does not state how many manvantaras make a kalpa, so the ring is left undivided."}
        {c.mahayugasPerKalpaStated &&
          ` The text gives ${c.mahayugasPerKalpaStated.toLocaleString("en")} mahayugas for a day of Brahma.`}
      </li>
    </ul>
  );
}

function CycleTable({ model }: { model: CosmicModelView }) {
  return (
    <div className="rounded-xl border border-white/10 p-4">
      <table className="w-full text-left text-sm">
        <caption className="mb-2 text-left text-muted">
          The four yugas of one mahayuga, in divine years
        </caption>
        <thead className="text-muted">
          <tr>
            <th className="py-1 font-normal">Yuga</th>
            <th className="py-1 font-normal">Divine years</th>
            <th className="py-1 font-normal">Twilights (included)</th>
            <th className="py-1 font-normal">Share</th>
          </tr>
        </thead>
        <tbody>
          {model.cycle.yugas.map((y) => (
            <tr key={y.yuga} className="border-t border-white/10">
              <td className="py-1.5 capitalize">{y.yuga}</td>
              <td className="py-1.5">{y.divineYears.toLocaleString("en")}</td>
              <td className="py-1.5 text-muted">
                {y.dawn !== undefined ? `${y.dawn} + ${y.dusk ?? 0}` : "—"}
              </td>
              <td className="py-1.5">{Math.round(y.share * 100)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      {model.manvantaras.length > 0 && (
        <>
          <h3 className="mt-4 text-sm text-muted">Manvantaras named in this text</h3>
          <ol className="mt-1 grid gap-x-4 text-sm sm:grid-cols-2">
            {model.manvantaras.map((m) => (
              <li key={m.ordinal}>
                {m.ordinal}.{" "}
                {m.manuHref ? (
                  <Link href={m.manuHref} className="text-celestial hover:underline">
                    {m.name}
                  </Link>
                ) : (
                  m.name
                )}
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
