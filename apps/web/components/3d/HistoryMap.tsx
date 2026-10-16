"use client";
// Historical atlas map: each polity's approximate reach (a soft area around its attested sites —
// never a border) and the dated sites of the chosen period.
import maplibregl, { type GeoJSONSource, type Map as MLMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import type { AtlasPolity, AtlasSite } from "@/lib/phase4/atlas";
import { cssVar } from "./colors";

const STYLE_URL = "https://tiles.openfreemap.org/styles/dark";
const TONES = ["--kala-gold", "--kala-celestial", "--kala-copper", "--kala-deep-red", "--kala-ink"];

function areas(polities: AtlasPolity[]) {
  return {
    type: "FeatureCollection" as const,
    features: polities.flatMap((p, i) =>
      p.area
        ? [
            {
              type: "Feature" as const,
              geometry: { type: "Polygon" as const, coordinates: [p.area] },
              properties: { label: p.label, tone: i % TONES.length },
            },
          ]
        : [],
    ),
  };
}

function points(sites: AtlasSite[]) {
  return {
    type: "FeatureCollection" as const,
    features: sites.map((s) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: s.point },
      properties: { label: s.label },
    })),
  };
}

export default function HistoryMap({
  polities,
  sites,
  label,
}: {
  polities: AtlasPolity[];
  sites: AtlasSite[];
  label: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MLMap | null>(null);
  const ready = useRef(false);

  useEffect(() => {
    if (!container.current) return;
    const m = new maplibregl.Map({
      container: container.current,
      style: STYLE_URL,
      center: [78, 23],
      zoom: 3.3,
      attributionControl: { compact: true },
    });
    map.current = m;
    m.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    m.on("style.load", () => {
      const colors = TONES.map((t) => cssVar(t));
      const voidc = cssVar("--kala-void");
      m.addSource("reach", { type: "geojson", data: areas(polities) });
      m.addSource("sites", { type: "geojson", data: points(sites) });
      const tone = [
        "match",
        ["get", "tone"],
        0,
        colors[0],
        1,
        colors[1],
        2,
        colors[2],
        3,
        colors[3],
        colors[4],
      ] as unknown as string;
      m.addLayer({
        id: "reach-fill",
        type: "fill",
        source: "reach",
        paint: { "fill-color": tone, "fill-opacity": 0.16 },
      });
      m.addLayer({
        id: "reach-edge",
        type: "line",
        source: "reach",
        paint: { "line-color": tone, "line-opacity": 0.45, "line-width": 6, "line-blur": 6 },
      });
      m.addLayer({
        id: "reach-label",
        type: "symbol",
        source: "reach",
        layout: {
          "text-field": ["get", "label"],
          "text-font": ["Noto Sans Regular"],
          "text-size": 13,
        },
        paint: {
          "text-color": cssVar("--kala-ink"),
          "text-halo-color": voidc,
          "text-halo-width": 1.5,
        },
      });
      m.addLayer({
        id: "sites",
        type: "circle",
        source: "sites",
        paint: {
          "circle-radius": 4.5,
          "circle-color": cssVar("--kala-gold"),
          "circle-stroke-color": voidc,
          "circle-stroke-width": 1,
        },
      });
      m.addLayer({
        id: "site-labels",
        type: "symbol",
        source: "sites",
        minzoom: 4.5,
        layout: {
          "text-field": ["get", "label"],
          "text-font": ["Noto Sans Regular"],
          "text-size": 11,
          "text-offset": [0, 1.1],
          "text-anchor": "top",
          "text-optional": true,
        },
        paint: {
          "text-color": cssVar("--kala-ink"),
          "text-halo-color": voidc,
          "text-halo-width": 1.2,
        },
      });
      ready.current = true;
    });
    return () => {
      ready.current = false;
      m.remove();
      map.current = null;
    };
    // Created once; data updates below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const m = map.current;
    if (!m) return;
    const apply = () => {
      (m.getSource("reach") as GeoJSONSource | undefined)?.setData(areas(polities));
      (m.getSource("sites") as GeoJSONSource | undefined)?.setData(points(sites));
    };
    if (ready.current) apply();
    else m.once("idle", apply);
  }, [polities, sites]);

  return <div ref={container} className="size-full" role="region" aria-label={label} />;
}
