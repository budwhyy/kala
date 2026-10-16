"use client";
// Historical atlas (brief §6.8): pick a period, see the dated sites and the approximate reach of
// the states active in it. Historical years only — no narrative or cosmic time on this axis.
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useMemo } from "react";
import type { AtlasPeriod, AtlasPolity, AtlasSite } from "@/lib/phase4/atlas";
import { overlaps } from "@/lib/phase4/reach";
import { useViewMode } from "@/lib/state/view";
import { ViewToggle } from "./ViewToggle";

function Loading() {
  const t = useTranslations("atlas");
  return <div className="grid h-full place-items-center text-muted">{t("loading")}</div>;
}

const HistoryMap = dynamic(() => import("@/components/3d/HistoryMap"), {
  ssr: false,
  loading: () => <Loading />,
});

const link =
  "text-celestial underline decoration-celestial/40 underline-offset-2 hover:decoration-celestial";
const chip = (on: boolean) =>
  `min-h-11 rounded-full border px-3 text-sm ${on ? "border-gold bg-gold text-void" : "border-white/15 hover:bg-white/10"}`;

export function AtlasExplorer({
  periods,
  polities,
  sites,
  years,
}: {
  periods: AtlasPeriod[];
  polities: AtlasPolity[];
  sites: AtlasSite[];
  /** Formatted label for every start/end year, keyed by the signed year. */
  years: Record<number, string>;
}) {
  const t = useTranslations("atlas");
  const [view, setView, webgl, ready] = useViewMode({ heavy: true });
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const period = periods.find((p) => p.slug === params.get("period")) ?? null;

  const choose = (slug: string | null) => {
    const q = new URLSearchParams(params.toString());
    if (slug) q.set("period", slug);
    else q.delete("period");
    const s = q.toString();
    router.replace(`${pathname}${s ? `?${s}` : ""}`, { scroll: false });
  };

  const shownPolities = useMemo(
    () => (period ? polities.filter((p) => overlaps(p, period)) : polities),
    [period, polities],
  );
  const shownSites = useMemo(
    () => (period ? sites.filter((s) => overlaps(s, period)) : sites),
    [period, sites],
  );
  const span = (x: { start: number; end: number }) => `${years[x.start]} – ${years[x.end]}`;

  if (periods.length === 0 && polities.length === 0)
    return <p className="text-muted">{t("empty")}</p>;

  const bounds = [...periods, ...polities];
  const min = Math.min(...bounds.map((p) => p.start));
  const max = Math.max(...bounds.map((p) => p.end));
  const pct = (y: number) => ((y - min) / Math.max(1, max - min)) * 100;

  return (
    <div>
      <p className="mb-3 rounded-lg border border-copper/40 bg-copper/5 p-3 text-sm">
        {t("historyOnly")}
      </p>

      <div role="group" aria-label={t("periodLabel")} className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={!period}
          onClick={() => choose(null)}
          className={chip(!period)}
        >
          {t("allPeriods")}
        </button>
        {periods.map((p) => (
          <button
            key={p.slug}
            type="button"
            aria-pressed={period?.slug === p.slug}
            onClick={() => choose(p.slug)}
            className={chip(period?.slug === p.slug)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {period && (
        <div className="mt-3 rounded-lg border border-white/10 p-3 text-sm">
          <p>
            <Link href={`/period/${period.slug}`} className={link}>
              {period.label}
            </Link>{" "}
            <span className="text-muted">{span(period)}</span>
          </p>
          <p className="mt-1 text-ink/85">{period.summary}</p>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <ViewToggle view={view} setView={setView} webgl={webgl} />
      </div>

      <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div>
          {view === "3d" ? (
            <div className="h-[26rem] overflow-hidden rounded-xl border border-white/10 sm:h-[34rem]">
              {ready && (
                <HistoryMap polities={shownPolities} sites={shownSites} label={t("mapLabel")} />
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 p-4">
              <h2 className="font-serif text-lg text-gold">{t("sites")}</h2>
              {shownSites.length === 0 ? (
                <p className="text-muted">{t("none")}</p>
              ) : (
                <ul className="mt-2 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                  {shownSites.map((s) => (
                    <li key={s.slug}>
                      <Link href={s.href} className={link}>
                        {s.label}
                      </Link>{" "}
                      <span className="text-sm text-muted">{span(s)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <p className="mt-2 text-xs text-muted">{t("reachExplain")}</p>
        </div>

        <aside>
          <h2 className="font-serif text-lg text-gold">{t("polities")}</h2>
          {shownPolities.length === 0 ? (
            <p className="text-muted">{t("none")}</p>
          ) : (
            <ul className="mt-2 space-y-3">
              {shownPolities.map((p) => (
                <li key={p.slug}>
                  <Link href={p.href} className={link}>
                    {p.label}
                  </Link>
                  <div className="text-sm text-muted">{span(p)}</div>
                  <div className="text-xs text-muted">
                    {p.siteCount > 0 ? t("reachNote", { count: p.siteCount }) : t("noReach")}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      {periods.length > 0 && (
        <section className="mt-8">
          <h2 className="font-serif text-lg text-gold">{t("timeline")}</h2>
          <ol aria-label={t("timelineLabel")} className="mt-3 space-y-1.5">
            {periods.map((p) => {
              const left = pct(p.start);
              const width = Math.max(1, pct(p.end) - left);
              return (
                <li key={p.slug} className="relative h-9">
                  <button
                    type="button"
                    onClick={() => choose(p.slug)}
                    aria-pressed={period?.slug === p.slug}
                    aria-label={`${p.label}: ${span(p)}`}
                    className={`absolute top-0 h-9 rounded border ${period?.slug === p.slug ? "border-gold bg-gold/30" : "border-copper/50 bg-copper/15 hover:bg-copper/25"}`}
                    style={{ left: `${left}%`, width: `${width}%` }}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute top-2 whitespace-nowrap text-xs"
                    style={
                      left > 50
                        ? { right: `${Math.max(0, 100 - left - width)}%` }
                        : { left: `calc(${left}% + 0.25rem)` }
                    }
                  >
                    {p.label}
                  </span>
                </li>
              );
            })}
          </ol>
          <div className="mt-1 flex justify-between text-xs text-muted">
            <span>{years[min]}</span>
            <span>{years[max]}</span>
          </div>
        </section>
      )}
    </div>
  );
}
