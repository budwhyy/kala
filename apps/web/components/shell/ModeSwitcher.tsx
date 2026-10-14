"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { selectionFromParams, toQuery, useSelection, type Selection } from "@/lib/state/selection";

// Phase 1 modes (brief §5). Later modes are added here as they are built.
const MODES = [
  { href: "/cosmic", label: "Cosmic time" },
  { href: "/genealogy", label: "Genealogy" },
  { href: "/geography", label: "Geography" },
];

/**
 * Switches exploration mode while keeping the current selection in the URL.
 * `context` is the record a detail page shows (e.g. { entity: "kashyapa" }).
 */
export function ModeSwitcher({ context }: { context?: Selection }) {
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
    <nav aria-label="Exploration modes" className="flex flex-wrap gap-1">
      {MODES.map((m) => {
        const active = pathname === m.href;
        return (
          <Link
            key={m.href}
            href={`${m.href}${toQuery(current)}`}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              active ? "bg-gold text-void" : "text-ink/80 hover:bg-white/10 hover:text-ink"
            }`}
          >
            {m.label}
          </Link>
        );
      })}
    </nav>
  );
}
