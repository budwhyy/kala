// Builds a statically generated detail route for one collection.
import type { CollectionName } from "@kala/schema";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { Page } from "@/components/shell/Header";
import type { Kala } from "./graph/kala";
import { getKala } from "./content";
import type { SelectionParam } from "./state/selection";

type Params = { params: Promise<{ slug: string }> };

export function recordPage(
  collection: CollectionName,
  Card: ComponentType<{ kala: Kala; slug: string }>,
  selectionParam?: SelectionParam,
) {
  return {
    async generateStaticParams() {
      const kala = await getKala();
      return (kala.dataset[collection] as { slug: string }[]).map((r) => ({ slug: r.slug }));
    },
    async generateMetadata({ params }: Params): Promise<Metadata> {
      const { slug } = await params;
      const kala = await getKala();
      return { title: `${kala.nameOf(collection, slug)} · KĀLA` };
    },
    async Page({ params }: Params) {
      const { slug } = await params;
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
