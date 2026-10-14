import { Suspense, type ReactNode } from "react";
import { getContent } from "@/lib/content";
import { Page } from "./Header";
import { SelectedPanel } from "./SelectedPanel";

export async function ModePage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  const { searchIndex } = await getContent();
  // Only what the "Currently exploring" box needs: the five selectable record types, without the
  // search keys (which are the bulk of the index and would otherwise ship with every mode page).
  const SELECTABLE = new Set(["entities", "places", "kingdoms", "dynasties", "texts"]);
  const lookup = Object.fromEntries(
    searchIndex
      .filter((i) => SELECTABLE.has(i.type))
      .map((i) => [
        `${i.type}:${i.slug}`,
        { type: i.type, slug: i.slug, href: i.href, label: i.label, sub: i.sub },
      ]),
  );
  return (
    <Page>
      <Suspense fallback={null}>
        <SelectedPanel lookup={lookup} />
      </Suspense>
      <h1 className="text-3xl text-gold">{title}</h1>
      <div className="mt-2 max-w-3xl text-ink/85">{intro}</div>
      {children}
    </Page>
  );
}
