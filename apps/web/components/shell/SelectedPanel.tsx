"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { SearchItem } from "@/lib/search/search";
import { selectionFromParams, type SelectionParam } from "@/lib/state/selection";

const PARAM_TYPE: Partial<Record<SelectionParam, string>> = {
  entity: "entities",
  place: "places",
  kingdom: "kingdoms",
  dynasty: "dynasties",
  text: "texts",
};

const TYPE_LABEL: Record<string, string> = {
  entities: "Figure",
  places: "Place",
  kingdoms: "Kingdom",
  dynasties: "Dynasty",
  texts: "Text",
};

/** Shows what the visitor is exploring, carried across modes in the URL. */
export function SelectedPanel({ lookup }: { lookup: Record<string, SearchItem> }) {
  const params = useSearchParams();
  const selection = selectionFromParams(new URLSearchParams(params.toString()));
  const items = (Object.entries(selection) as [SelectionParam, string][])
    .map(([param, slug]) => lookup[`${PARAM_TYPE[param]}:${slug}`])
    .filter((x): x is SearchItem => Boolean(x));

  if (items.length === 0) return null;
  return (
    <aside
      aria-label="Currently exploring"
      data-testid="selected-panel"
      className="mb-8 rounded-lg border border-gold/40 bg-gold/5 p-4"
    >
      <p className="text-xs tracking-[0.2em] text-muted uppercase">Currently exploring</p>
      <ul className="mt-1 space-y-1">
        {items.map((item) => (
          <li key={item.href}>
            <span className="mr-2 text-xs text-muted">{TYPE_LABEL[item.type]}</span>
            <Link href={item.href} className="text-xl text-gold hover:underline">
              {item.label}
            </Link>
            {item.sub && <span className="ml-2 text-ink/70">{item.sub}</span>}
          </li>
        ))}
      </ul>
    </aside>
  );
}
