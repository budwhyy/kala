"use client";
// 3D genealogy constellation (brief §6.3). Answers "who is connected to whom, and how?":
// stars are figures, lines are sourced relationships, a traced path is drawn in gold.
import { CameraControls, Html, Line } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { BufferAttribute, BufferGeometry, Color } from "three";
import type { CEdge, CNode } from "@/lib/graph/constellation";
import { GROUP_STYLE } from "@/lib/graph/constellation";
import type { Positions } from "@/lib/graph/force";
import { EDGE_FAMILY } from "@/lib/graph/trace";
import { cssVar } from "./colors";

const EDGE_TOKEN = {
  family: "--kala-gold",
  narrative: "--kala-copper",
  spiritual: "--kala-celestial",
};

type Props = {
  nodes: CNode[];
  edges: CEdge[];
  positions: Positions;
  selected: string | null;
  highlight: { nodes: Set<string>; edges: Set<string> };
  onSelect: (slug: string) => void;
  reducedMotion: boolean;
};

/** Frame the selected figure, or the whole constellation; animated unless reduced motion. */
function Framing({
  focus,
  reducedMotion,
}: {
  focus: [number, number, number] | null;
  reducedMotion: boolean;
}) {
  const controls = useRef<CameraControls>(null);
  const [fx, fy, fz] = focus ?? [0, 0, 0];
  const hasFocus = focus !== null;
  useEffect(() => {
    const distance = hasFocus ? 11 : 24;
    controls.current?.setLookAt(fx, fy, fz + distance, fx, fy, fz, !reducedMotion);
  }, [fx, fy, fz, hasFocus, reducedMotion]);
  return <CameraControls ref={controls} makeDefault minDistance={2} maxDistance={60} />;
}

function Scene({ nodes, edges, positions, selected, highlight, onSelect, reducedMotion }: Props) {
  const [hover, setHover] = useState<string | null>(null);
  const tracing = highlight.edges.size > 0;

  const nodeColor = useMemo(
    () => Object.fromEntries(Object.entries(GROUP_STYLE).map(([g, s]) => [g, cssVar(s.token)])),
    [],
  );
  const gold = useMemo(() => cssVar("--kala-gold"), []);

  // All edges in one draw call, coloured by family/narrative/spiritual.
  const edgeGeometry = useMemo(() => {
    const colors = Object.fromEntries(
      Object.entries(EDGE_TOKEN).map(([k, t]) => [k, new Color(cssVar(t))]),
    ) as Record<keyof typeof EDGE_TOKEN, Color>;
    const pos: number[] = [];
    const col: number[] = [];
    for (const e of edges) {
      const a = positions[e.from];
      const b = positions[e.to];
      if (!a || !b) continue;
      const c = colors[EDGE_FAMILY[e.type]].clone().multiplyScalar(tracing ? 0.25 : 0.6);
      pos.push(...a, ...b);
      col.push(c.r, c.g, c.b, c.r, c.g, c.b);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute("color", new BufferAttribute(new Float32Array(col), 3));
    return g;
  }, [edges, positions, tracing]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[20, 20, 20]} intensity={600} />
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial vertexColors transparent opacity={0.9} />
      </lineSegments>

      {edges
        .filter((e) => highlight.edges.has(e.id))
        .map((e) => {
          const a = positions[e.from];
          const b = positions[e.to];
          return a && b ? <Line key={e.id} points={[a, b]} color={gold} lineWidth={3} /> : null;
        })}

      {nodes.map((n) => {
        const p = positions[n.slug];
        if (!p) return null;
        const isSelected = n.slug === selected;
        const lit = isSelected || highlight.nodes.has(n.slug) || hover === n.slug;
        const dim = tracing && !highlight.nodes.has(n.slug) && !isSelected;
        const r = 0.16 + Math.min(0.24, n.degree * 0.012);
        return (
          <group key={n.slug} position={p}>
            <mesh
              onClick={(ev) => {
                ev.stopPropagation();
                onSelect(n.slug);
              }}
              onPointerOver={(ev) => {
                ev.stopPropagation();
                setHover(n.slug);
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                setHover(null);
                document.body.style.cursor = "";
              }}
            >
              <sphereGeometry args={[isSelected ? r * 1.6 : r, 16, 12]} />
              <meshStandardMaterial
                color={nodeColor[n.group]}
                emissive={nodeColor[n.group]}
                emissiveIntensity={lit ? 1.2 : 0.35}
                transparent
                opacity={dim ? 0.25 : 1}
              />
            </mesh>
            {lit && (
              <Html
                distanceFactor={14}
                style={{ pointerEvents: "none" }}
                position={[0, r + 0.25, 0]}
                center
              >
                <span
                  className={`whitespace-nowrap rounded px-1 text-xs ${
                    isSelected ? "bg-gold text-void" : "bg-void/70 text-ink"
                  }`}
                >
                  {n.label}
                </span>
              </Html>
            )}
          </group>
        );
      })}
      <Framing focus={(selected && positions[selected]) || null} reducedMotion={reducedMotion} />
    </>
  );
}

export default function GenealogyConstellation(props: Props) {
  return (
    <Canvas camera={{ position: [0, 0, 24], fov: 55 }} dpr={[1, 1.5]} aria-hidden>
      <Scene {...props} />
    </Canvas>
  );
}
