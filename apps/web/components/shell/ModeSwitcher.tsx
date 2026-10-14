"use client";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { selectionFromParams, toQuery, useSelection, type Selection } from "@/lib/state/selection";

// Exploration modes (brief §5). Phase 1: cosmic, genealogy, geography. Phase 2: avatar,
// philosophy, pilgrimage. Labels for the Phase 2 modes live in the `nav2` messages.
const MODES = [
  { href: "/cosmic", key: "cosmic", ns: "nav" },
  { href: "/genealogy", key: "genealogy", ns: "nav" },
  { href: "/geography", key: "geography", ns: "nav" },
  { href: "/avatar", key: "avatar", ns: "nav2" },
  { href: "/philosophy", key: "philosophy", ns: "nav2" },
  { href: "/pilgrimage", key: "pilgrimage", ns: "nav2" },
] as const;

/**
 * Switches exploration mode while keeping the current selection in the URL.
 * `context` is the record a detail page shows (e.g. { entity: "kashyapa" }).
 */
export function ModeSwitcher({ context }: { context?: Selection }) {
  const t = useTranslations("nav");
  const t2 = useTranslations("nav2");
  const pathname = usePathname();
  const params = useSearchParams();
  const { selection, setSelection } = useSelection();

  const fromUrl = selectionFromParams(new URLSearchParams(params.toString()));
  const current: Selection = context ?? (Object.keys(fromUrl).length > 0 ? fromUrl : selection);
  const key = JSON.stringify(current);

  useEffect(() => {
    if (Object.keys(current).length > 0) setSelection(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, setSelection]);

  return (
    <nav aria-label={t("modes")} className="flex flex-wrap gap-1">
      {MODES.map((m) => {
        const active = pathname === m.href;
        return (
          <Link
            prefetch={false}
            key={m.href}
            href={`${m.href}${toQuery(current)}`}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              active ? "bg-gold text-void" : "text-ink/80 hover:bg-white/10 hover:text-ink"
            }`}
          >
            {m.ns === "nav" ? t(m.key) : t2(m.key)}
          </Link>
        );
      })}
    </nav>
  );
}
