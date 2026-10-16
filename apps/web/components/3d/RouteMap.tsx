"use client";
// Epic route map (brief §6.5): the journey drawn stage by stage up to the current step. The route is a
// literary reconstruction from the text, never a verified itinerary; stops without an agreed location
// are listed but not drawn. Camera moves are instant under reduced motion.
import maplibregl, { type GeoJSONSource, type Map as MLMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import type { RouteStopView } from "@/lib/phase3/epic";
import { cssVar } from "./colors";

const STYLE_URL = "https://tiles.openfreemap.org/styles/dark";

type Props = {
  stops: RouteStopView[];
  /** Index of the current stop (0-based). The path is drawn up to it. */
  step: number;
  onStep: (i: number) => void;
  reducedMotion: boolean;
  /** Accessible name for the map region (localised by the caller). */
  label: string;
};

const mapped = (stops: RouteStopView[]) =>
  stops
    .map((s, i) => ({ ...s, i }))
    .filter((s): s is typeof s & { point: [number, number] } => s.point !== null);

function pathUpTo(stops: RouteStopView[], step: number) {
  const coords = mapped(stops)
    .filter((s) => s.i <= step)
    .map((s) => s.point);
  return {
    type: "Feature" as const,
    properties: {},
    geometry: { type: "LineString" as const, coordinates: coords.length > 1 ? coords : [] },
  };
}

function stopPoints(stops: RouteStopView[], step: number) {
  return {
    type: "FeatureCollection" as const,
    features: mapped(stops).map((s) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: s.point },
      properties: {
        i: s.i,
        label: s.label,
        state: s.i === step ? "current" : s.i < step ? "past" : "future",
      },
    })),
  };
}

export default function RouteMap({ stops, step, onStep, reducedMotion, label }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MLMap | null>(null);
  const ready = useRef(false);
  const onStepRef = useRef(onStep);
  onStepRef.current = onStep;

  useEffect(() => {
    if (!container.current) return;
    const m = new maplibregl.Map({
      container: container.current,
      style: STYLE_URL,
      center: [79, 21],
      zoom: 3.6,
      attributionControl: { compact: true },
    });
    map.current = m;
    m.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    m.on("style.load", () => {
      const gold = cssVar("--kala-gold");
      const ink = cssVar("--kala-ink");
      const muted = cssVar("--kala-muted");
      const voidc = cssVar("--kala-void");
      m.addSource("route-path", { type: "geojson", data: pathUpTo(stops, step) });
      m.addSource("route-stops", { type: "geojson", data: stopPoints(stops, step) });
      m.addLayer({
        id: "route-path",
        type: "line",
        source: "route-path",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": gold, "line-width": 3, "line-dasharray": [2, 1.5] },
      });
      m.addLayer({
        id: "route-stops",
        type: "circle",
        source: "route-stops",
        paint: {
          "circle-radius": ["match", ["get", "state"], "current", 9, 6],
          "circle-color": ["match", ["get", "state"], "future", muted, gold],
          "circle-stroke-color": voidc,
          "circle-stroke-width": 1.5,
        },
      });
      m.addLayer({
        id: "route-labels",
        type: "symbol",
        source: "route-stops",
        layout: {
          "text-field": ["get", "label"],
          "text-font": ["Noto Sans Regular"],
          "text-size": 12,
          "text-offset": [0, 1.2],
          "text-anchor": "top",
          "text-optional": true,
        },
        paint: { "text-color": ink, "text-halo-color": voidc, "text-halo-width": 1.5 },
      });
      m.on("click", "route-stops", (e) => {
        const i = e.features?.[0]?.properties?.i;
        if (typeof i === "number") onStepRef.current(i);
      });
      m.on("mouseenter", "route-stops", () => (m.getCanvas().style.cursor = "pointer"));
      m.on("mouseleave", "route-stops", () => (m.getCanvas().style.cursor = ""));
      const pts = mapped(stops).map((s) => s.point);
      if (pts.length > 1) {
        const b = new maplibregl.LngLatBounds(pts[0], pts[0]);
        for (const p of pts) b.extend(p);
        m.fitBounds(b, { padding: 50, animate: false });
      }
      ready.current = true;
    });
    return () => {
      ready.current = false;
      m.remove();
      map.current = null;
    };
    // The map is created once per route; step changes are applied below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stops]);

  useEffect(() => {
    const m = map.current;
    if (!m) return;
    const apply = () => {
      (m.getSource("route-path") as GeoJSONSource | undefined)?.setData(pathUpTo(stops, step));
      (m.getSource("route-stops") as GeoJSONSource | undefined)?.setData(stopPoints(stops, step));
      const p = stops[step]?.point;
      if (p) {
        if (reducedMotion) m.jumpTo({ center: p });
        else m.easeTo({ center: p, duration: 900 });
      }
    };
    if (ready.current) apply();
    else m.once("idle", apply);
  }, [stops, step, reducedMotion]);

  return <div ref={container} className="size-full" role="region" aria-label={label} />;
}
