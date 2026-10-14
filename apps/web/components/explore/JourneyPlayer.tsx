"use client";
// Guided journey player: one step at a time, in plain English, with the cosmic wheel beside steps
// that are about it. All text arrives from content (journeys/*.yaml) via the server page.
import type { YugaName } from "@kala/schema";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useReducedMotion } from "@/lib/state/view";
import type { CycleSummary } from "@/lib/time/cycle";

const CosmicWheel = dynamic(() => import("@/components/3d/CosmicWheel"));

export type JourneyStepView = {
  id: string;
  title: string;
  body: string;
  detail?: string | undefined;
  cites: { text: string; href: string }[];
  links: { label: string; href: string; kind: string; note?: string | undefined }[];
  cosmicModel?: string | undefined;
  focusYuga?: YugaName | undefined;
};

export function JourneyPlayer({
  steps,
  cycles,
  modelNames,
}: {
  steps: JourneyStepView[];
  cycles: Record<string, CycleSummary>;
  modelNames: Record<string, string>;
}) {
  const t = useTranslations("journey");
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const heading = useRef<HTMLHeadingElement>(null);

  const raw = Number(params.get("step") ?? "1");
  const index = Math.min(Math.max(Number.isFinite(raw) ? Math.floor(raw) : 1, 1), steps.length) - 1;
  const step = steps[index]!;
  const cycle = step.cosmicModel ? cycles[step.cosmicModel] : undefined;

  const go = (i: number) => {
    const next = new URLSearchParams(params.toString());
    next.set("step", String(i + 1));
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };
  // Move focus to the step heading when the step changes, for keyboard and screen-reader users.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    heading.current?.focus();
  }, [index]);

  const last = index === steps.length - 1;
  const wheelSelected = useMemo(() => step.focusYuga ?? null, [step.focusYuga]);

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[16rem_1fr]">
      <nav aria-label={t("progress")} className="lg:sticky lg:top-20 lg:self-start">
        <ol className="flex flex-wrap gap-1 lg:flex-col lg:gap-0.5">
          {steps.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-current={i === index ? "step" : undefined}
                className={`w-full rounded px-2 py-1 text-left text-sm ${
                  i === index
                    ? "bg-gold text-void"
                    : i < index
                      ? "text-ink/90 hover:bg-white/10"
                      : "text-muted hover:bg-white/10"
                }`}
              >
                <span className="mr-1.5 tabular-nums">{i + 1}.</span>
                <span className="hidden lg:inline">{s.title}</span>
                <span className="sr-only lg:hidden">{s.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <section aria-labelledby="step-title">
        <p className="text-xs tracking-[0.2em] text-muted uppercase">
          {t("stepOf", { current: index + 1, total: steps.length })}
        </p>
        <div className="mt-2 grid gap-6 xl:grid-cols-[1fr_20rem]">
          <div>
            <h2
              id="step-title"
              ref={heading}
              tabIndex={-1}
              className="text-3xl text-gold outline-none"
            >
              {step.title}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed">{step.body}</p>
            {step.detail && (
              <details className="mt-4 max-w-2xl rounded border border-white/10 p-3">
                <summary className="cursor-pointer text-sm text-muted">{t("moreDetail")}</summary>
                <p className="mt-2 leading-relaxed text-ink/90">{step.detail}</p>
              </details>
            )}
            {step.links.length > 0 && (
              <div className="mt-5">
                <h3 className="text-xs tracking-[0.2em] text-muted uppercase">
                  {t("exploreFurther")}
                </h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {step.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        title={l.note}
                        className="rounded-full border border-celestial/40 px-3 py-1 text-sm text-celestial hover:bg-celestial/10"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-5 text-xs text-muted">
              <span className="mr-1">{t("sources")}:</span>
              {step.cites.map((c, i) => (
                <span key={i}>
                  {i > 0 && "; "}
                  <Link href={c.href} className="underline decoration-dotted">
                    {c.text}
                  </Link>
                </span>
              ))}
            </p>
          </div>

          {cycle && step.cosmicModel && (
            <figure className="rounded-xl border border-white/10 bg-gradient-to-b from-indigo/30 to-void p-2">
              <div className="h-64 xl:h-72">
                <CosmicWheel
                  cycle={cycle}
                  selected={wheelSelected}
                  onSelect={() => {}}
                  reducedMotion={reducedMotion}
                />
              </div>
              <figcaption className="px-2 pb-1 text-xs text-muted">
                {t("wheelCaption", { account: modelNames[step.cosmicModel] ?? step.cosmicModel })}
                <br />
                {t("notHistorical")}
              </figcaption>
            </figure>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            className="rounded-full border border-white/20 px-4 py-1.5 text-sm disabled:opacity-40"
          >
            {t("back")}
          </button>
          {!last ? (
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="rounded-full bg-gold px-5 py-1.5 text-sm text-void"
            >
              {t("next")}
            </button>
          ) : (
            <div className="rounded-lg border border-gold/40 bg-gold/5 p-3 text-sm">
              <p>{t("finished")}</p>
              <p className="mt-2 flex flex-wrap gap-x-4">
                <Link href="/cosmic" className="text-celestial underline underline-offset-2">
                  {t("toWheel")}
                </Link>
                <Link href="/genealogy" className="text-celestial underline underline-offset-2">
                  {t("toGenealogy")}
                </Link>
                <button
                  type="button"
                  onClick={() => go(0)}
                  className="text-celestial underline underline-offset-2"
                >
                  {t("restart")}
                </button>
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
