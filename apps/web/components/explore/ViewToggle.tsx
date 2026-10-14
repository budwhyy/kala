"use client";
import { useTranslations } from "next-intl";
import type { ViewMode } from "@/lib/state/view";

/** One-click switch between the 3D scene and its accessible list equivalent (brief §3.3). */
export function ViewToggle({
  view,
  setView,
  webgl,
}: {
  view: ViewMode;
  setView: (v: ViewMode) => void;
  webgl: boolean;
}) {
  const t = useTranslations("view");
  return (
    <div
      role="group"
      aria-label={t("label")}
      className="inline-flex rounded-full border border-white/15 p-0.5 text-sm"
    >
      {(["3d", "list"] as const).map((v) => (
        <button
          key={v}
          type="button"
          disabled={v === "3d" && !webgl}
          aria-pressed={view === v}
          onClick={() => setView(v)}
          className={`rounded-full px-3 py-1 ${view === v ? "bg-gold text-void" : "text-ink/80 hover:text-ink"} disabled:opacity-40`}
          title={v === "3d" && !webgl ? t("noWebgl") : undefined}
        >
          {v === "3d" ? t("threeD") : t("list")}
        </button>
      ))}
    </div>
  );
}
