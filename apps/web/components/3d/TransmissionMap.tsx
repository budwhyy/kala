"use client";
// Civilisation atlas map: one curved arc per transmission, coloured by the kind of connection.
// Dashed arcs mark connections the sources do not establish (independent similarity, hypotheses).
import maplibregl, { type Map as MLMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import type { CivLink } from "@/lib/phase4/civ";
import { TYPE_TONE } from "./transmission-colors";
import { cssVar } from "./colors";

const STYLE_URL = "https://tiles.openfreemap.org/styles/dark";

export default function TransmissionMap({ links, label }: { links: CivLink[]; label: string }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MLMap | null>(null);

  useEffect(() => {
    if (!container.current) return;
    const m = new maplibregl.Map({
      container: container.current,
      style: STYLE_URL,
      center: [92, 15],
      zoom: 2.6,
      attributionControl: { compact: true },
    });
    map.current = m;
    m.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    m.on("style.load", () => {
      const features = links.flatMap((l) =>
        l.arc
          ? [
              {
                type: "Feature" as const,
                geometry: { type: "LineString" as const, coordinates: l.arc },
                properties: { type: l.type, label: l.label },
              },
            ]
          : [],
      );
      const ends = links.flatMap((l) =>
        l.arc
          ? [l.arc[0]!, l.arc[l.arc.length - 1]!].map((c) => ({
              type: "Feature" as const,
              geometry: { type: "Point" as const, coordinates: c },
              properties: {},
            }))
          : [],
      );
      m.addSource("arcs", { type: "geojson", data: { type: "FeatureCollection", features } });
      m.addSource("ends", { type: "geojson", data: { type: "FeatureCollection", features: ends } });
      const color = [
        "match",
        ["get", "type"],
        ...Object.entries(TYPE_TONE).flatMap(([k, v]) => [k, cssVar(v.css)]),
        cssVar("--kala-ink"),
      ] as unknown as string;
      const solid = [
        "in",
        ["get", "type"],
        ["literal", ["direct", "shared_ancestry", "reinterpretation"]],
      ];
      m.addLayer({
        id: "arcs-solid",
        type: "line",
        source: "arcs",
        filter: solid as never,
        paint: { "line-color": color, "line-width": 2.5, "line-opacity": 0.9 },
      });
      m.addLayer({
        id: "arcs-dashed",
        type: "line",
        source: "arcs",
        filter: ["!", solid] as never,
        paint: {
          "line-color": color,
          "line-width": 2,
          "line-opacity": 0.9,
          "line-dasharray": [2, 2],
        },
      });
      m.addLayer({
        id: "ends",
        type: "circle",
        source: "ends",
        paint: {
          "circle-radius": 4,
          "circle-color": cssVar("--kala-gold"),
          "circle-stroke-color": cssVar("--kala-void"),
          "circle-stroke-width": 1,
        },
      });
    });
    return () => {
      m.remove();
      map.current = null;
    };
  }, [links]);

  return <div ref={container} className="size-full" role="region" aria-label={label} />;
}
