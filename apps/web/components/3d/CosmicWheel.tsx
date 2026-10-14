"use client";
// Cosmic Time Wheel (brief §6.2). Rings, outside in: kalpa (manvantaras), manvantara
// (mahayugas), mahayuga (the four yugas, sized by the model's stated lengths). Answers "how do the
// ages nest, and how long is each relative to the others?" — never "when", in years.
//
// Drawn as SVG tilted in 3D with CSS perspective rather than WebGL: the wheel is made of flat
// rings, and this keeps the page interactive well inside the 4 s mobile budget (DECISIONS.md).
import type { YugaName } from "@kala/schema";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { CycleSummary } from "@/lib/time/cycle";
import { YUGA_TONE } from "./colors";

/** SVG path for a ring segment between two fractions of a turn (clockwise from the top). */
function arc(inner: number, outer: number, from: number, to: number): string {
  const p = (r: number, f: number) => {
    const a = f * Math.PI * 2 - Math.PI / 2;
    return `${(r * Math.cos(a)).toFixed(3)} ${(r * Math.sin(a)).toFixed(3)}`;
  };
  const large = to - from > 0.5 ? 1 : 0;
  return `M ${p(outer, from)} A ${outer} ${outer} 0 ${large} 1 ${p(outer, to)} L ${p(inner, to)} A ${inner} ${inner} 0 ${large} 0 ${p(inner, from)} Z`;
}

function point(r: number, f: number): { x: number; y: number } {
  const a = f * Math.PI * 2 - Math.PI / 2;
  return { x: r * Math.cos(a), y: r * Math.sin(a) };
}

export default function CosmicWheel({
  cycle,
  selected,
  onSelect,
  reducedMotion,
}: {
  cycle: CycleSummary;
  selected: YugaName | null;
  onSelect: (y: YugaName) => void;
  reducedMotion: boolean;
}) {
  const ty = useTranslations("enums.yugaShort");
  const [hover, setHover] = useState<YugaName | null>(null);
  const kalpa = cycle.manvantarasPerKalpa;
  const mahayugas = cycle.mahayugasPerManvantara;
  const spinning = !reducedMotion && !hover;

  return (
    <div
      className="grid size-full place-items-center overflow-hidden [perspective:1100px]"
      aria-hidden
    >
      <div className="aspect-square h-[92%] [transform:rotateX(32deg)]">
        <svg viewBox="-100 -100 200 200" className="size-full overflow-visible">
          <g className="kala-spin" style={{ animationPlayState: spinning ? "running" : "paused" }}>
            {/* Kalpa: one segment per manvantara, if the text states how many */}
            {kalpa
              ? Array.from({ length: kalpa }, (_, i) => (
                  <path
                    key={i}
                    d={arc(86, 94, i / kalpa + 0.003, (i + 1) / kalpa - 0.003)}
                    fill="var(--kala-indigo)"
                    stroke="var(--kala-celestial)"
                    strokeOpacity={0.4}
                    strokeWidth={0.3}
                    opacity={i === 0 ? 1 : 0.75}
                  />
                ))
              : Array.from({ length: 72 }, (_, i) => (
                  <path
                    key={i}
                    d={arc(89, 91, i / 72, i / 72 + 0.006)}
                    fill="var(--kala-muted)"
                    opacity={0.5}
                  />
                ))}

            {/* Manvantara: one tick per mahayuga */}
            {Array.from({ length: mahayugas }, (_, i) => (
              <path
                key={i}
                d={arc(72, 79, i / mahayugas + 0.0015, (i + 1) / mahayugas - 0.0015)}
                fill="var(--kala-gold)"
                opacity={i === 0 ? 0.95 : 0.4}
              />
            ))}

            {/* Mandala guide circles */}
            {[16, 24, 30].map((r) => (
              <circle
                key={r}
                r={r}
                fill="none"
                stroke="var(--kala-gold)"
                strokeOpacity={0.35}
                strokeWidth={0.3}
              />
            ))}

            {/* Mahayuga: the four yugas */}
            {cycle.yugas.map((y) => {
              const active = selected === y.yuga || hover === y.yuga;
              const mid = point(64, y.start + y.share / 2);
              return (
                <g key={y.yuga}>
                  <path
                    d={arc(34, active ? 57 : 53, y.start + 0.003, y.start + y.share - 0.003)}
                    fill={`var(${YUGA_TONE[y.yuga]})`}
                    opacity={selected && selected !== y.yuga ? 0.45 : 0.95}
                    className="cursor-pointer transition-opacity duration-300"
                    onClick={() => onSelect(y.yuga)}
                    onPointerEnter={() => setHover(y.yuga)}
                    onPointerLeave={() => setHover(null)}
                  />
                  <text
                    x={mid.x}
                    y={mid.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={6}
                    fill="var(--kala-ink)"
                    className="pointer-events-none capitalize"
                  >
                    {ty(y.yuga)}
                  </text>
                </g>
              );
            })}
            <circle r={3} fill="var(--kala-gold)" />
          </g>
        </svg>
      </div>
    </div>
  );
}
