"use client";
// Interactive battlefield (brief §6.5): day selector, the day's commanders, formations, encounters and
// the fallen, both sides with the kingdoms the text says joined them. Everything is the epic's
// narrative, flagged as literary — not an archaeological or historical record.
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

type L = { label: string; href: string };
type Cite = { text: string; href: string };

export type BattleView = {
  sides: {
    id: string;
    name: string;
    leaders: L[];
    kingdoms: (L & { note: string; cites: Cite[] })[];
    cites: Cite[];
  }[];
  days: {
    day: number;
    section?: string | undefined;
    summary?: string | undefined;
    commanders: (L & { side: string; cites: Cite[] })[];
    formations: {
      side: string;
      name: string;
      sub?: string | undefined;
      note?: string | undefined;
      cites: Cite[];
    }[];
    encounters: { people: L[]; summary: string; cites: Cite[] }[];
    fallen: (L & { by: L[]; note?: string | undefined; cites: Cite[] })[];
    cites: Cite[];
  }[];
};

function Cites({ cites }: { cites: Cite[] }) {
  return (
    <span className="text-xs text-muted">
      {cites.map((c, i) => (
        <span key={i}>
          {i > 0 && "; "}
          <Link href={c.href} className="underline decoration-dotted">
            {c.text}
          </Link>
        </span>
      ))}
    </span>
  );
}

function People({ people }: { people: L[] }) {
  return (
    <>
      {people.map((p, i) => (
        <span key={p.href}>
          {i > 0 && ", "}
          <Link
            href={p.href}
            className="text-celestial underline decoration-celestial/40 underline-offset-2"
          >
            {p.label}
          </Link>
        </span>
      ))}
    </>
  );
}

export function BattlefieldExplorer({ view }: { view: BattleView }) {
  const t = useTranslations("battle");
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const days = view.days;
  const requested = Number(params.get("day"));
  const day = days.find((d) => d.day === requested) ?? days[0];
  if (!day) return null;
  const index = days.indexOf(day);
  const go = (n: number) => {
    const next = new URLSearchParams(params.toString());
    next.set("day", String(n));
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };
  const sideName = (id: string) => view.sides.find((s) => s.id === id)?.name ?? id;
  const allFallen = days.flatMap((d) => d.fallen.map((f) => ({ ...f, day: d.day })));

  return (
    <div className="mt-6">
      <p className="rounded border border-celestial/40 bg-celestial/5 p-2 text-sm text-celestial">
        {t("literary")}
      </p>

      <section aria-labelledby="sides-title" className="mt-6">
        <h2
          id="sides-title"
          className="mb-3 text-xs font-semibold tracking-[0.2em] text-muted uppercase"
        >
          {t("sides")}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {view.sides.map((s) => (
            <div key={s.id} className="rounded-lg border border-white/10 p-4">
              <h3 className="text-xl text-gold">{s.name}</h3>
              {s.leaders.length > 0 && (
                <p className="mt-1 text-sm">
                  <span className="text-muted">{t("leaders")}: </span>
                  <People people={s.leaders} />
                </p>
              )}
              {s.kingdoms.length > 0 && (
                <>
                  <h4 className="mt-3 text-sm text-muted">{t("kingdoms")}</h4>
                  <ul className="mt-1 space-y-1 text-sm">
                    {s.kingdoms.map((k) => (
                      <li key={k.href}>
                        <Link
                          href={k.href}
                          className="text-celestial underline decoration-celestial/40 underline-offset-2"
                        >
                          {k.label}
                        </Link>
                        <span className="text-ink/80"> — {k.note}</span> <Cites cites={k.cites} />
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <p className="mt-2">
                <Cites cites={s.cites} />
              </p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="days-title" className="mt-8">
        <h2
          id="days-title"
          className="mb-3 text-xs font-semibold tracking-[0.2em] text-muted uppercase"
        >
          {t("days")}
        </h2>
        <div role="group" aria-label={t("chooseDay")} className="flex flex-wrap gap-1">
          {days.map((d) => (
            <button
              key={d.day}
              type="button"
              onClick={() => go(d.day)}
              aria-pressed={d.day === day.day}
              aria-label={t("dayN", { n: d.day })}
              className={`size-9 rounded-full border text-sm tabular-nums ${
                d.day === day.day
                  ? "border-gold bg-gold text-void"
                  : "border-white/15 hover:border-gold/60"
              }`}
            >
              {d.day}
            </button>
          ))}
        </div>

        <article className="mt-4 rounded-xl border border-white/10 p-4" aria-live="polite">
          <div className="flex flex-wrap items-baseline gap-3">
            <h3 className="text-2xl text-gold">{t("dayN", { n: day.day })}</h3>
            {day.section && (
              <span className="text-sm text-muted">{t("told", { section: day.section })}</span>
            )}
            <span className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={() => go(days[index - 1]!.day)}
                disabled={index === 0}
                className="rounded-full border border-white/20 px-3 py-1 text-sm disabled:opacity-40"
              >
                {t("prev")}
              </button>
              <button
                type="button"
                onClick={() => go(days[index + 1]!.day)}
                disabled={index === days.length - 1}
                className="rounded-full border border-white/20 px-3 py-1 text-sm disabled:opacity-40"
              >
                {t("next")}
              </button>
            </span>
          </div>
          {day.summary && <p className="mt-2 max-w-3xl leading-relaxed">{day.summary}</p>}
          <p className="mt-1">
            <Cites cites={day.cites} />
          </p>

          {(day.commanders.length > 0 || day.formations.length > 0) && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {view.sides.map((s) => {
                const cmd = day.commanders.filter((c) => c.side === s.id);
                const frm = day.formations.filter((f) => f.side === s.id);
                if (cmd.length === 0 && frm.length === 0) return null;
                return (
                  <div key={s.id} className="rounded-lg border border-white/10 p-3 text-sm">
                    <h4 className="text-gold">{s.name}</h4>
                    {cmd.map((c) => (
                      <p key={c.href} className="mt-1">
                        <span className="text-muted">{t("commander")}: </span>
                        <Link
                          href={c.href}
                          className="text-celestial underline decoration-celestial/40 underline-offset-2"
                        >
                          {c.label}
                        </Link>{" "}
                        <Cites cites={c.cites} />
                      </p>
                    ))}
                    {frm.map((f, i) => (
                      <p key={i} className="mt-1">
                        <span className="text-muted">{t("formation")}: </span>
                        {f.name}
                        {f.sub && (
                          <span className="ml-1 text-ink/70" lang="sa">
                            ({f.sub})
                          </span>
                        )}
                        {f.note && <span className="text-ink/80"> — {f.note}</span>}{" "}
                        <Cites cites={f.cites} />
                      </p>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {day.encounters.length > 0 && (
            <>
              <h4 className="mt-4 text-sm text-muted">{t("encounters")}</h4>
              <ul className="mt-1 space-y-2 text-sm">
                {day.encounters.map((e, i) => (
                  <li key={i}>
                    <People people={e.people} />
                    <p className="text-ink/85">{e.summary}</p>
                    <Cites cites={e.cites} />
                  </li>
                ))}
              </ul>
            </>
          )}

          {day.fallen.length > 0 && (
            <>
              <h4 className="mt-4 text-sm text-muted">{t("fallen")}</h4>
              <ul className="mt-1 space-y-1 text-sm">
                {day.fallen.map((f) => (
                  <li key={f.href}>
                    <Link
                      href={f.href}
                      className="text-celestial underline decoration-celestial/40 underline-offset-2"
                    >
                      {f.label}
                    </Link>
                    {f.by.length > 0 && (
                      <span className="text-ink/80">
                        {" "}
                        — {t("by")} <People people={f.by} />
                      </span>
                    )}
                    {f.note && <span className="text-ink/70"> ({f.note})</span>}{" "}
                    <Cites cites={f.cites} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </article>
      </section>

      {allFallen.length > 0 && (
        <section aria-labelledby="fallen-title" className="mt-8">
          <h2
            id="fallen-title"
            className="mb-3 text-xs font-semibold tracking-[0.2em] text-muted uppercase"
          >
            {t("whoFell")}
          </h2>
          <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <caption className="sr-only">{t("whoFell")}</caption>
              <thead className="text-muted">
                <tr>
                  <th scope="col" className="p-2 font-normal">
                    {t("day")}
                  </th>
                  <th scope="col" className="p-2 font-normal">
                    {t("warrior")}
                  </th>
                  <th scope="col" className="p-2 font-normal">
                    {t("by")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {allFallen.map((f) => (
                  <tr key={f.href} className="border-t border-white/10">
                    <td className="p-2 tabular-nums">
                      <button
                        type="button"
                        onClick={() => go(f.day)}
                        className="underline decoration-dotted"
                      >
                        {f.day}
                      </button>
                    </td>
                    <th scope="row" className="p-2 font-normal">
                      <Link
                        href={f.href}
                        className="text-celestial underline decoration-celestial/40 underline-offset-2"
                      >
                        {f.label}
                      </Link>
                    </th>
                    <td className="p-2">{f.by.length > 0 ? <People people={f.by} /> : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted">
            {t("sideNote", { a: sideName(view.sides[0]!.id), b: sideName(view.sides[1]!.id) })}
          </p>
        </section>
      )}
    </div>
  );
}
