import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Cite, NameBlock, RecordLink, Summaries, VariantTag } from "@/components/cards/ui";
import { BattlefieldExplorer } from "@/components/explore/BattlefieldExplorer";
import { Page } from "@/components/shell/Header";
import { getKala } from "@/lib/content";
import { battleView } from "@/lib/phase3/views";

type Props = { params: Promise<{ slug: string; locale: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const kala = await getKala();
  return kala.dataset.battlefields.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const kala = await getKala();
  return { title: `${kala.nameOf("battlefields", slug)} · KĀLA` };
}

export default async function BattlefieldPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "epic" });
  const kala = await getKala();
  const b = kala.get("battlefields", slug);
  if (!b) notFound();
  return (
    <Page>
      <NameBlock names={b.names} />
      <p className="mt-2 text-sm">
        <span className="text-muted">{t("partOf")}: </span>
        <RecordLink href={`/epic/${b.text}`}>{kala.nameOf("texts", b.text)}</RecordLink>
        {" · "}
        <RecordLink href={`/place/${b.place}`}>{kala.nameOf("places", b.place)}</RecordLink>
        <VariantTag kala={kala} variant={b.variant} />
      </p>
      <Summaries beginner={b.summary_beginner} scholar={b.summary_scholar} />
      <p className="mt-2">
        <Cite refs={b.references} kala={kala} />
      </p>
      <Suspense fallback={null}>
        <BattlefieldExplorer view={battleView(kala, slug)} />
      </Suspense>
    </Page>
  );
}
