"use client";
// 3D Cosmic Time Wheel (brief §6.2). Rings, outside in: kalpa (manvantaras), manvantara
// (mahayugas), mahayuga (the four yugas, sized by the model's stated lengths). Answers "how do the
// ages nest, and how long is each relative to the others?" — never "when", in years.
import type { YugaName } from "@kala/schema";
import { Html } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import type { Group } from "three";
import type { CycleSummary } from "@/lib/time/cycle";
import { YUGA_TONE, cssVar } from "./colors";

const TAU = Math.PI * 2;
/** Angles run clockwise from the top. */
const theta = (fraction: number) => Math.PI / 2 - fraction * TAU;

function Arc({
  inner,
  outer,
  from,
  to,
  color,
  opacity = 1,
  ...events
}: {
  inner: number;
  outer: number;
  from: number;
  to: number;
  color: string;
  opacity?: number;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}) {
  const length = (to - from) * TAU;
  return (
    <mesh {...events}>
      <ringGeometry
        args={[inner, outer, Math.max(8, Math.round(length * 24)), 1, theta(to), length]}
      />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

function Wheel({
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
  const group = useRef<Group>(null);
  const [hover, setHover] = useState<YugaName | null>(null);
  const colors = useMemo(
    () => ({
      gold: cssVar("--kala-gold"),
      muted: cssVar("--kala-muted"),
      indigo: cssVar("--kala-indigo"),
      yuga: Object.fromEntries(Object.entries(YUGA_TONE).map(([k, v]) => [k, cssVar(v)])),
    }),
    [],
  );

  useFrame((_, delta) => {
    if (!reducedMotion && group.current && !hover) group.current.rotation.z -= delta * 0.03;
  });

  const kalpa = cycle.manvantarasPerKalpa;
  const mahayugas = cycle.mahayugasPerManvantara;

  return (
    <group ref={group} rotation={[-0.35, 0, 0]}>
      {/* Mandala guide circles */}
      {[0.6, 0.9, 1.25].map((r) => (
        <Arc
          key={r}
          inner={r}
          outer={r + 0.01}
          from={0}
          to={1}
          color={colors.gold}
          opacity={0.35}
        />
      ))}

      {/* Mahayuga: the four yugas */}
      {cycle.yugas.map((y) => {
        const active = selected === y.yuga || hover === y.yuga;
        return (
          <group key={y.yuga}>
            <Arc
              inner={1.4}
              outer={active ? 2.25 : 2.1}
              from={y.start + 0.004}
              to={y.start + y.share - 0.004}
              color={colors.yuga[y.yuga]!}
              opacity={selected && selected !== y.yuga ? 0.45 : 0.95}
              onClick={() => onSelect(y.yuga)}
              onPointerOver={() => {
                setHover(y.yuga);
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                setHover(null);
                document.body.style.cursor = "";
              }}
            />
            <Html
              position={[
                Math.cos(theta(y.start + y.share / 2)) * 2.55,
                Math.sin(theta(y.start + y.share / 2)) * 2.55,
                0,
              ]}
              center
              style={{ pointerEvents: "none" }}
            >
              <span className="whitespace-nowrap text-xs text-ink capitalize">{y.yuga}</span>
            </Html>
          </group>
        );
      })}

      {/* Manvantara: one tick per mahayuga */}
      {Array.from({ length: mahayugas }, (_, i) => (
        <Arc
          key={i}
          inner={3.0}
          outer={3.25}
          from={i / mahayugas + 0.002}
          to={(i + 1) / mahayugas - 0.002}
          color={colors.gold}
          opacity={i === 0 ? 0.95 : 0.4}
        />
      ))}

      {/* Kalpa: one segment per manvantara, if the text states how many */}
      {kalpa
        ? Array.from({ length: kalpa }, (_, i) => (
            <Arc
              key={i}
              inner={3.6}
              outer={3.9}
              from={i / kalpa + 0.004}
              to={(i + 1) / kalpa - 0.004}
              color={colors.indigo}
              opacity={i === 0 ? 1 : 0.6}
            />
          ))
        : Array.from({ length: 60 }, (_, i) => (
            <Arc
              key={i}
              inner={3.7}
              outer={3.8}
              from={i / 60}
              to={i / 60 + 0.008}
              color={colors.muted}
              opacity={0.5}
            />
          ))}
    </group>
  );
}

export default function CosmicWheel(props: {
  cycle: CycleSummary;
  selected: YugaName | null;
  onSelect: (y: YugaName) => void;
  reducedMotion: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 45 }}
      dpr={[1, 1.5]}
      frameloop={props.reducedMotion ? "demand" : "always"}
      aria-hidden
    >
      <Wheel {...props} />
    </Canvas>
  );
}
