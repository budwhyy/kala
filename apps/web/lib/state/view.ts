"use client";
// 3D or list view for a mode, kept in the URL (?view=list) so it survives reloads and links.
// Defaults to list when WebGL is unavailable; reduced-motion users still get 3D, but static.
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { hasWebGL } from "@/components/3d/colors";

export type ViewMode = "3d" | "list";

/**
 * `heavy` scenes (the constellation, the map) start as the lightweight list on narrow screens and
 * load their 3D code only when the visitor asks for it, keeping phones fast. Wide screens get 3D
 * unless `?view=list`. Returns `ready` = false until the browser has been inspected, so callers
 * never start a heavy download before knowing which view applies.
 */
export function useViewMode({ heavy = false }: { heavy?: boolean } = {}): [
  ViewMode,
  (v: ViewMode) => void,
  boolean,
  boolean,
] {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [env, setEnv] = useState<{ small: boolean; webgl: boolean } | null>(null);
  useEffect(
    () => setEnv({ small: window.matchMedia("(max-width: 767px)").matches, webgl: hasWebGL() }),
    [],
  );

  const asked = params.get("view");
  const requested: ViewMode =
    asked === "list" ? "list" : asked === "3d" ? "3d" : heavy && env?.small ? "list" : "3d";
  const webgl = env?.webgl ?? true;
  const view: ViewMode = webgl ? requested : "list";
  const setView = (v: ViewMode) => {
    const next = new URLSearchParams(params.toString());
    if (v === "list") next.set("view", "list");
    else if (heavy) next.set("view", "3d");
    else next.delete("view");
    const q = next.toString();
    router.replace(`${pathname}${q ? `?${q}` : ""}`, { scroll: false });
  };
  return [view, setView, webgl, env !== null];
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}
