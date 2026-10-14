"use client";
// Opening experience (brief §6.1): darkness → light → the question → a luminous structure →
// the creation pathways, each a named account from content. None is presented as the origin story.
import Link from "next/link";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/state/view";
import { SoundToggle } from "./Soundscape";
import { Starfield } from "./Starfield";

export type Pathway = {
  slug: string;
  name: string;
  tradition: string;
  text?: string | undefined;
  description: string;
};

const LINES = [
  "Before kingdoms.",
  "Before heroes.",
  "Before the stories of gods and mortals —",
  "what was existence?",
];
/** Phase timeline in ms: stars, each line, the mandala, the pathways. */
const TIMELINE = [400, 1800, 3000, 4200, 5600, 7200, 8800];
const SEEN_KEY = "kala-intro-seen";

export function Opening({ pathways }: { pathways: Pathway[] }) {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const done = phase >= TIMELINE.length;

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    if (seen || reducedMotion) {
      setPhase(TIMELINE.length);
      return;
    }
    const timers = TIMELINE.map((ms, i) => setTimeout(() => setPhase(i + 1), ms));
    return () => timers.forEach(clearTimeout);
  }, [reducedMotion]);

  useEffect(() => {
    if (!done) return;
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {}
  }, [done]);

  const lineVisible = (i: number) => phase >= i + 2;
  const mandala = phase >= 6;

  return (
    <div className="relative min-h-dvh overflow-hidden bg-void">
      <Starfield reducedMotion={reducedMotion} brightness={phase >= 1 ? 1 : 0} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-[3000ms]"
        style={{
          opacity: phase >= 5 ? 1 : 0,
          background:
            "radial-gradient(circle at 50% 38%, rgba(212,166,74,0.16), rgba(43,42,107,0.18) 35%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex items-center justify-between px-4 py-4">
        <span className="text-lg tracking-[0.3em] text-gold">KĀLA</span>
        <div className="flex items-center gap-2">
          <SoundToggle />
          {!done && (
            <button
              type="button"
              onClick={() => setPhase(TIMELINE.length)}
              className="rounded-full border border-white/20 px-3 py-1 text-xs text-ink/80 hover:text-ink"
            >
              Skip intro
            </button>
          )}
        </div>
      </div>

      <main className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 pb-24 text-center">
        <h1 className="sr-only">
          KĀLA — an atlas of Indian mythology, cosmology, genealogy and sacred geography
        </h1>
        <div
          className="mt-[8vh] min-h-[9rem] space-y-1 text-2xl leading-snug text-ink sm:text-4xl"
          aria-live="polite"
        >
          {LINES.map((line, i) => (
            <p
              key={line}
              className={`transition-all duration-[1600ms] ${
                lineVisible(i) || done ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              } ${i === LINES.length - 1 ? "text-gold" : ""}`}
            >
              {line}
            </p>
          ))}
        </div>

        <Mandala visible={mandala || done} reducedMotion={reducedMotion} />

        <section
          aria-labelledby="pathways-heading"
          className={`w-full transition-opacity duration-[1600ms] ${done ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <h2 id="pathways-heading" className="text-xl text-gold">
            Different texts answer differently
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-ink/80">
            Hymns, philosophies and Puranas each give their own account of how things began. KĀLA
            keeps them side by side. Choose one to begin.
          </p>
          <ul className="mt-6 grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-3">
            {pathways.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/variant/${p.slug}`}
                  tabIndex={done ? 0 : -1}
                  className="block h-full rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-gold/60 hover:bg-gold/5 focus-visible:border-gold"
                >
                  <span className="text-xs tracking-[0.15em] text-celestial uppercase">
                    {p.tradition}
                  </span>
                  <span className="mt-1 block text-lg text-gold">{p.name}</span>
                  <span className="mt-1 line-clamp-3 block text-sm text-ink/80">
                    {p.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <nav
            aria-label="Or explore directly"
            className="mt-8 flex flex-wrap justify-center gap-3 text-sm"
          >
            <span className="text-muted">Or explore directly:</span>
            <Link
              href="/cosmic"
              tabIndex={done ? 0 : -1}
              className="text-celestial underline decoration-celestial/40 underline-offset-2 hover:decoration-celestial"
            >
              Cosmic time
            </Link>
            <Link
              href="/genealogy"
              tabIndex={done ? 0 : -1}
              className="text-celestial underline decoration-celestial/40 underline-offset-2 hover:decoration-celestial"
            >
              Genealogy
            </Link>
            <Link
              href="/geography"
              tabIndex={done ? 0 : -1}
              className="text-celestial underline decoration-celestial/40 underline-offset-2 hover:decoration-celestial"
            >
              Geography
            </Link>
            <Link
              href="/search"
              tabIndex={done ? 0 : -1}
              className="text-celestial underline decoration-celestial/40 underline-offset-2 hover:decoration-celestial"
            >
              Search
            </Link>
          </nav>
        </section>
      </main>
    </div>
  );
}

/** A luminous mandala that draws itself: concentric circles and a sixteen-petalled ring. */
function Mandala({ visible, reducedMotion }: { visible: boolean; reducedMotion: boolean }) {
  const petals = Array.from({ length: 16 }, (_, i) => i * 22.5);
  const draw = visible ? 0 : 1;
  const transition = reducedMotion ? "none" : "stroke-dashoffset 2600ms ease-out, opacity 1600ms";
  return (
    <svg
      viewBox="-110 -110 220 220"
      aria-hidden
      className="my-8 size-44 sm:size-56"
      style={{ opacity: visible ? 1 : 0, transition: reducedMotion ? "none" : "opacity 1600ms" }}
    >
      <g fill="none" stroke="var(--kala-gold)" strokeWidth="0.8" pathLength={1}>
        {[100, 78, 56, 30, 10].map((r) => (
          <circle
            key={r}
            r={r}
            pathLength={1}
            strokeDasharray="1"
            style={{ strokeDashoffset: draw, transition }}
            opacity={r === 100 ? 0.5 : 0.85}
          />
        ))}
        {petals.map((a) => (
          <path
            key={a}
            d="M0,-30 C14,-46 14,-64 0,-78 C-14,-64 -14,-46 0,-30Z"
            transform={`rotate(${a})`}
            pathLength={1}
            strokeDasharray="1"
            style={{ strokeDashoffset: draw, transition }}
            stroke="var(--kala-celestial)"
            opacity={0.7}
          />
        ))}
      </g>
      <circle
        r="4"
        fill="var(--kala-gold)"
        style={{ filter: "drop-shadow(0 0 6px var(--kala-gold))" }}
      />
    </svg>
  );
}
