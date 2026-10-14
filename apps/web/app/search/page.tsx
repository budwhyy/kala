import { Suspense } from "react";
import { Page } from "@/components/shell/Header";
import { SearchResults } from "@/components/shell/SearchResults";
import { getContent } from "@/lib/content";

export const metadata = { title: "Search · KĀLA" };

export default async function SearchPage() {
  const { searchIndex } = await getContent();
  return (
    <Page>
      <h1 className="text-3xl text-gold">Search</h1>
      <p className="mt-2 text-muted">English, Hindi (Devanagari) or IAST — diacritics optional.</p>
      <Suspense fallback={null}>
        <SearchResults index={searchIndex} />
      </Suspense>
    </Page>
  );
}
