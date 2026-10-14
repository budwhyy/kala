// Builds a statically generated detail route for one collection.
import type { CollectionName } from "@kala/schema";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { Page } from "@/components/shell/Header";
import type { Kala } from "./graph/kala";
import { getContentFor, getKala } from "./content";
import type { SelectionParam } from "./state/selection";

type Params = { params: Promise<{ slug: string; locale: string }> };

export function recordPage(
  collection: CollectionName,
  Card: ComponentType<{ kala: Kala; slug: string }>,
  selectionParam?: SelectionParam,
) {
  return {
    async generateStaticParams() {
      // Runs outside a request, so it cannot ask for the current locale. Slugs are the same in
      // every language.
      const { kala } = await getContentFor("en");
      return (kala.dataset[collection] as { slug: string }[]).map((r) => ({ slug: r.slug }));
    },
    async generateMetadata({ params }: Params): Promise<Metadata> {
      const { slug, locale } = await params;
      setRequestLocale(locale);
      const kala = await getKala();
      return { title: `${kala.nameOf(collection, slug)} · KĀLA` };
    },
    async Page({ params }: Params) {
      const { slug, locale } = await params;
      setRequestLocale(locale);
      const kala = await getKala();
      if (!kala.get(collection, slug)) notFound();
      return (
        <Page context={selectionParam ? { [selectionParam]: slug } : undefined}>
          <Card kala={kala} slug={slug} />
        </Page>
      );
    },
  };
}
