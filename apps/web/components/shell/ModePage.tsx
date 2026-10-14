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
  const lookup = Object.fromEntries(searchIndex.map((i) => [`${i.type}:${i.slug}`, i]));
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
