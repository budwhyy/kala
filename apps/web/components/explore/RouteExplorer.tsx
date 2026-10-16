"use client";
// Route player: choose a telling, then step (or play) through its stages on the map and in the list.
// The list is the accessible equivalent of the map and always shows every stop, mapped or not.
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { CONFIDENCE_STYLE } from "@/components/3d/colors";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import type { RouteView } from "@/lib/phase3/epic";
import { useReducedMotion, useViewMode } from "@/lib/state/view";
import { ViewToggle } from "./ViewToggle";

const RouteMap = dynamic(() => import("@/components/3d/RouteMap"), { ssr: false });

export function RouteExplorer({
  routes,
  confidenceLabels,
}: {
  routes: RouteView[];
  confidenceLabels: Record<string, string>;
}) {
  const t = useTranslations("route");
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [view, setView, webgl, ready] = useViewMode({ heavy: true });

  const route = routes.find((r) => r.slug === params.get("route")) ?? routes[0];
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setStep(0);
    setPlaying(false);
  }, [route?.slug]);

  useEffect(() => {
    if (!playing || !route) return;
    if (step >= route.stops.length - 1) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setStep((s) => s + 1), reducedMotion ? 2500 : 1800);
    return () => clearTimeout(id);
  }, [playing, step, route, reducedMotion]);

  if (!route) return null;
  const choose = (slug: string) => {
    const next = new URLSearchParams(params.toString());
    next.set("route", slug);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };
  const current = route.stops[step];
  const unmapped = route.stops.filter((s) => !s.point).length;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        {routes.length > 1 && (
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted">{t("telling")}</span>
            <select
              value={route.slug}
              onChange={(e) => choose(e.target.value)}
              className="rounded border border-white/15 bg-void px-2 py-1"
            >
              {routes.map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <div className="ml-auto">
          <ViewToggle view={view} setView={setView} webgl={webgl} />
        </div>
      </div>

      <p className="mt-3 rounded border border-celestial/40 bg-celestial/5 p-2 text-sm text-celestial">
        {t("literary")}
      </p>
      <p className="mt-2 max-w-3xl text-ink/85">{route.summary}</p>
      <p className="mt-1 text-sm text-muted">
        {t("account")}: {route.variantName}
        {route.travellers.length > 0 && (
          <>
            {" · "}
            {t("travellers")}:{" "}
            {route.travellers.map((tr, i) => (
              <span key={tr.href}>
                {i > 0 && ", "}
                <Link href={tr.href} className="underline decoration-dotted">
                  {tr.label}
                </Link>
              </span>
            ))}
          </>
        )}
      </p>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div>
          {view === "3d" && (
            <div className="h-[24rem] overflow-hidden rounded-xl border border-white/10 sm:h-[30rem]">
              {ready && (
                <RouteMap
                  stops={route.stops}
                  step={step}
                  onStep={setStep}
                  reducedMotion={reducedMotion}
                  label={t("mapLabel", { name: route.name })}
                />
              )}
            </div>
          )}
          <div
            className="mt-3 flex flex-wrap items-center gap-2"
            role="group"
            aria-label={t("controls")}
          >
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="rounded-full border border-white/20 px-3 py-1 text-sm disabled:opacity-40"
            >
              {t("back")}
            </button>
            <button
              type="button"
              onClick={() => {
                if (step >= route.stops.length - 1) setStep(0);
                setPlaying((p) => !p);
              }}
              aria-pressed={playing}
              className="rounded-full bg-gold px-4 py-1 text-sm text-void"
            >
              {playing ? t("pause") : t("play")}
            </button>
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(route.stops.length - 1, s + 1))}
              disabled={step >= route.stops.length - 1}
              className="rounded-full border border-white/20 px-3 py-1 text-sm disabled:opacity-40"
            >
              {t("next")}
            </button>
            <span className="text-sm text-muted" aria-live="polite">
              {t("stageOf", { current: step + 1, total: route.stops.length })}
              {current && ` — ${current.label}`}
            </span>
          </div>
          {unmapped > 0 && (
            <p className="mt-2 text-xs text-muted">{t("unmapped", { count: unmapped })}</p>
          )}
        </div>

        <ol className="space-y-2" aria-label={t("stops")}>
          {route.stops.map((s, i) => (
            <li
              key={`${s.order}-${s.place}`}
              className={`rounded-lg border p-3 text-sm ${i === step ? "border-gold bg-gold/5" : "border-white/10"}`}
              aria-current={i === step ? "step" : undefined}
            >
              <button
                type="button"
                onClick={() => setStep(i)}
                className="mr-2 text-gold tabular-nums"
              >
                {i + 1}.
              </button>
              <Link
                href={s.href}
                className="text-celestial underline decoration-celestial/40 underline-offset-2"
              >
                {s.label}
              </Link>{" "}
              <span
                className="text-xs"
                style={{
                  color: CONFIDENCE_STYLE[s.confidence as keyof typeof CONFIDENCE_STYLE]?.color,
                }}
              >
                {confidenceLabels[s.confidence] ?? s.confidence}
              </span>
              {!s.point && <span className="ml-1 text-xs text-muted">· {t("notDrawn")}</span>}
              {s.event && (
                <p className="mt-1">
                  <Link href={s.event.href} className="underline decoration-dotted">
                    {s.event.label}
                  </Link>
                </p>
              )}
              {s.note && <p className="mt-1 text-ink/80">{s.note}</p>}
              <p className="mt-1 text-xs text-muted">
                {s.cites.map((c, j) => (
                  <span key={j}>
                    {j > 0 && "; "}
                    <Link href={c.href} className="underline decoration-dotted">
                      {c.text}
                    </Link>
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
