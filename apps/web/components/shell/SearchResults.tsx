"use client";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { subLang } from "@/lib/i18n-helpers";
import { search, type SearchItem } from "@/lib/search/search";

export function SearchResults({ index }: { index: SearchItem[] }) {
  const t = useTranslations("search");
  const tt = useTranslations("types");
  const locale = useLocale();
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get("q") ?? "";
  const results = useMemo(() => search(index, q), [index, q]);

  return (
    <div className="mt-6">
      <label htmlFor="search-page-input" className="sr-only">
        {t("label")}
      </label>
      <input
        id="search-page-input"
        type="search"
        defaultValue={q}
        onChange={(e) => router.replace(`/search?q=${encodeURIComponent(e.target.value)}`)}
        className="w-full max-w-xl rounded-full border border-white/15 bg-white/5 px-4 py-2 focus:border-gold focus:outline-none"
        placeholder={t("placeholder")}
      />
      {q && (
        <p className="mt-4 text-sm text-muted" aria-live="polite">
          {t("results", { count: results.length, query: q })}
        </p>
      )}
      <ul className="mt-3 space-y-2">
        {results.map((r) => (
          <li key={r.href}>
            <span className="mr-2 inline-block w-20 text-xs text-muted">{tt(r.type)}</span>
            <Link
              href={r.href}
              className="text-lg text-celestial underline decoration-celestial/40 underline-offset-2 hover:decoration-celestial"
            >
              {r.label}
            </Link>
            {r.sub && (
              <span lang={subLang(locale)} className="ml-2 text-ink/70">
                {r.sub}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
