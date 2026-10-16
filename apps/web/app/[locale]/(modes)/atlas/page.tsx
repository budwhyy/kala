import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { AtlasExplorer } from "@/components/explore/AtlasExplorer";
import { ModePage } from "@/components/shell/ModePage";
import { getKala } from "@/lib/content";
import { atlasData } from "@/lib/phase4/atlas";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "atlas" });
  return { title: `${t("title")} · KĀLA` };
}

export default async function AtlasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("atlas");
  const tt = await getTranslations("time");
  const kala = await getKala();
  const { periods, polities, sites } = atlasData(kala);
  const all = [...periods, ...polities, ...sites].flatMap((x) => [x.start, x.end]);
  const years = Object.fromEntries(
    all.map((y) => [y, y < 0 ? tt("bce", { year: -y }) : tt("ce", { year: y })]),
  );

  return (
    <ModePage title={t("title")} intro={<p>{t("intro")}</p>}>
      <Suspense fallback={null}>
        <AtlasExplorer periods={periods} polities={polities} sites={sites} years={years} />
      </Suspense>
    </ModePage>
  );
}
