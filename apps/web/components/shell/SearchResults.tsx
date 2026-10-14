"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { search, type SearchItem } from "@/lib/search/search";

const TYPE_LABEL: Record<string, string> = {
  entities: "Figure",
  places: "Place",
  kingdoms: "Kingdom",
  dynasties: "Dynasty",
  texts: "Text",
  traditions: "Tradition",
  variants: "Account",
};

export function SearchResults({ index }: { index: SearchItem[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get("q") ?? "";
  const results = useMemo(() => search(index, q), [index, q]);

  return (
    <div className="mt-6">
      <label htmlFor="search-page-input" className="sr-only">
        Search
      </label>
      <input
        id="search-page-input"
        type="search"
        defaultValue={q}
        onChange={(e) => router.replace(`/search?q=${encodeURIComponent(e.target.value)}`)}
        className="w-full max-w-xl rounded-full border border-white/15 bg-white/5 px-4 py-2 focus:border-gold focus:outline-none"
        placeholder="Kashyapa, कश्यप, Kaśyapa, Gandhara…"
      />
      {q && (
        <p className="mt-4 text-sm text-muted" aria-live="polite">
          {results.length} result{results.length === 1 ? "" : "s"} for “{q}”
        </p>
      )}
      <ul className="mt-3 space-y-2">
        {results.map((r) => (
          <li key={r.href}>
            <span className="mr-2 inline-block w-20 text-xs text-muted">{TYPE_LABEL[r.type]}</span>
            <Link href={r.href} className="text-lg text-celestial hover:underline">
              {r.label}
            </Link>
            {r.sub && <span className="ml-2 text-ink/70">{r.sub}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
