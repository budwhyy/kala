"use client";
// 3D or list view for a mode, kept in the URL (?view=list) so it survives reloads and links.
// Defaults to list when WebGL is unavailable; reduced-motion users still get 3D, but static.
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { hasWebGL } from "@/components/3d/colors";

export type ViewMode = "3d" | "list";

export function useViewMode(): [ViewMode, (v: ViewMode) => void, boolean] {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [webgl, setWebgl] = useState(true);
  useEffect(() => setWebgl(hasWebGL()), []);

  const requested = params.get("view") === "list" ? "list" : "3d";
  const view: ViewMode = webgl ? requested : "list";
  const setView = (v: ViewMode) => {
    const next = new URLSearchParams(params.toString());
    if (v === "list") next.set("view", "list");
    else next.delete("view");
    const q = next.toString();
    router.replace(`${pathname}${q ? `?${q}` : ""}`, { scroll: false });
  };
  return [view, setView, webgl];
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
