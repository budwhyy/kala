"use client";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { subLang } from "@/lib/i18n-helpers";
import type { SearchItem } from "@/lib/search/search";
import { selectionFromParams, type SelectionParam } from "@/lib/state/selection";

const PARAM_TYPE: Partial<Record<SelectionParam, string>> = {
  entity: "entities",
  place: "places",
  kingdom: "kingdoms",
  dynasty: "dynasties",
  text: "texts",
};

/** Shows what the visitor is exploring, carried across modes in the URL. */
export function SelectedPanel({ lookup }: { lookup: Record<string, Omit<SearchItem, "keys">> }) {
  const t = useTranslations("selected");
  const tt = useTranslations("types");
  const locale = useLocale();
  const params = useSearchParams();
  const selection = selectionFromParams(new URLSearchParams(params.toString()));
  const items = (Object.entries(selection) as [SelectionParam, string][])
    .map(([param, slug]) => lookup[`${PARAM_TYPE[param]}:${slug}`])
    .filter((x): x is Omit<SearchItem, "keys"> => Boolean(x));

  if (items.length === 0) return null;
  return (
    <aside
      aria-label={t("heading")}
      data-testid="selected-panel"
      className="mb-8 rounded-lg border border-gold/40 bg-gold/5 p-4"
    >
      <p className="text-xs tracking-[0.2em] text-muted uppercase">{t("heading")}</p>
      <ul className="mt-1 space-y-1">
        {items.map((item) => (
          <li key={item.href}>
            <span className="mr-2 text-xs text-muted">{tt(item.type)}</span>
            <Link href={item.href} className="text-xl text-gold hover:underline">
              {item.label}
            </Link>
            {item.sub && (
              <span lang={subLang(locale)} className="ml-2 text-ink/70">
                {item.sub}
              </span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
