"use client";
// Geography explorer (brief §6.4): a 3D globe that zooms seamlessly into a local map (MapLibre
// globe projection), Himalayan relief, places coloured by confidence class, competing
// identifications for debated places, and a modern-overlay slider. Cosmological realms are never
// drawn here — they have no coordinates.
import maplibregl, { type GeoJSONSource, type Map as MLMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import type { MapPlace } from "@/lib/geo/features";
import { cssVar } from "./colors";

const STYLE_URL = "https://tiles.openfreemap.org/styles/dark";
const TERRAIN_TILES = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png";
const OUR_LAYERS = new Set(["relief", "kala-alt", "kala-places", "kala-labels"]);

export type GeoMapProps = {
  places: MapPlace[];
  selected: string | null;
  onSelect: (slug: string) => void;
  /** 0 = ancient view (relief and KĀLA places only), 1 = full modern map. */
  modern: number;
  reducedMotion: boolean;
};

function toGeoJSON(places: MapPlace[]) {
  return {
    type: "FeatureCollection" as const,
    features: places.flatMap((p) =>
      p.point
        ? [
            {
              type: "Feature" as const,
              geometry: { type: "Point" as const, coordinates: p.point },
              properties: { slug: p.slug, label: p.label, confidence: p.confidence },
            },
          ]
        : [],
    ),
  };
}

function alternativesGeoJSON(places: MapPlace[]) {
  return {
    type: "FeatureCollection" as const,
    features: places.flatMap((p) =>
      p.alternatives.map((a) => ({
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: a.point },
        properties: { slug: p.slug, label: `${p.label}? (${a.label})` },
      })),
    ),
  };
}

/** Fade the basemap's own labels, roads and borders; KĀLA layers and relief stay. */
function applyModern(map: MLMap, modern: number) {
  for (const layer of map.getStyle().layers ?? []) {
    if (OUR_LAYERS.has(layer.id)) continue;
    if (layer.type === "symbol") {
      map.setPaintProperty(layer.id, "text-opacity", modern);
      map.setPaintProperty(layer.id, "icon-opacity", modern);
    } else if (layer.type === "line") {
      map.setPaintProperty(layer.id, "line-opacity", 0.15 + 0.85 * modern);
    }
  }
}

export default function GeoMap({ places, selected, onSelect, modern, reducedMotion }: GeoMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const ready = useRef(false);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    if (!container.current) return;
    const map = new maplibregl.Map({
      container: container.current,
      style: STYLE_URL,
      center: [79, 23],
      zoom: 2.2,
      attributionControl: { compact: true },
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");

    map.on("style.load", () => {
      map.setProjection({ type: "globe" });
      const tone = {
        verified: cssVar("--kala-gold"),
        traditional: cssVar("--kala-copper"),
        debated: "#e07a7f",
        ink: cssVar("--kala-ink"),
        void: cssVar("--kala-void"),
      };

      map.addSource("terrain", {
        type: "raster-dem",
        tiles: [TERRAIN_TILES],
        encoding: "terrarium",
        tileSize: 256,
        maxzoom: 12,
      });
      const firstSymbol = map.getStyle().layers?.find((l) => l.type === "symbol")?.id;
      map.addLayer(
        {
          id: "relief",
          type: "hillshade",
          source: "terrain",
          paint: { "hillshade-exaggeration": 0.5 },
        },
        firstSymbol,
      );

      map.addSource("kala-places", { type: "geojson", data: toGeoJSON(places) });
      map.addSource("kala-alt", { type: "geojson", data: alternativesGeoJSON(places) });
      map.addLayer({
        id: "kala-alt",
        type: "circle",
        source: "kala-alt",
        paint: {
          "circle-radius": 6,
          "circle-color": "rgba(0,0,0,0)",
          "circle-stroke-color": tone.debated,
          "circle-stroke-width": 1.5,
        },
      });
      map.addLayer({
        id: "kala-places",
        type: "circle",
        source: "kala-places",
        paint: {
          "circle-radius": ["case", ["==", ["get", "slug"], selected ?? ""], 9, 6],
          "circle-color": [
            "match",
            ["get", "confidence"],
            "verified",
            tone.verified,
            "traditional",
            tone.traditional,
            tone.debated,
          ],
          "circle-stroke-color": tone.void,
          "circle-stroke-width": 1.5,
        },
      });
      map.addLayer({
        id: "kala-labels",
        type: "symbol",
        source: "kala-places",
        layout: {
          "text-field": ["get", "label"],
          "text-font": ["Noto Sans Regular"],
          "text-size": 12,
          "text-offset": [0, 1.2],
          "text-anchor": "top",
          "text-optional": true,
        },
        paint: { "text-color": tone.ink, "text-halo-color": tone.void, "text-halo-width": 1.5 },
      });

      for (const id of ["kala-places", "kala-alt"]) {
        map.on("click", id, (e) => {
          const slug = e.features?.[0]?.properties?.slug;
          if (typeof slug === "string") onSelectRef.current(slug);
        });
        map.on("mouseenter", id, () => (map.getCanvas().style.cursor = "pointer"));
        map.on("mouseleave", id, () => (map.getCanvas().style.cursor = ""));
      }
      ready.current = true;
      applyModern(map, modern);
    });

    return () => {
      ready.current = false;
      map.remove();
      mapRef.current = null;
    };
    // The map is created once; later prop changes are applied by the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Data / filter changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready.current) return;
    (map.getSource("kala-places") as GeoJSONSource | undefined)?.setData(toGeoJSON(places));
    (map.getSource("kala-alt") as GeoJSONSource | undefined)?.setData(alternativesGeoJSON(places));
  }, [places]);

  useEffect(() => {
    const map = mapRef.current;
    if (map && ready.current) applyModern(map, modern);
  }, [modern]);

  // Fly to the selected place.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const go = () => {
      map.setPaintProperty("kala-places", "circle-radius", [
        "case",
        ["==", ["get", "slug"], selected ?? ""],
        9,
        6,
      ]);
      const p = places.find((x) => x.slug === selected);
      const target = p?.point ?? p?.alternatives[0]?.point;
      if (target) {
        const camera = { center: target, zoom: 6.5 };
        if (reducedMotion) map.jumpTo(camera);
        else map.flyTo({ ...camera, speed: 1.4 });
      }
    };
    if (ready.current) go();
    else map.once("idle", go);
  }, [selected, places, reducedMotion]);

  return <div ref={container} className="size-full" aria-label="Map of places" role="region" />;
}
