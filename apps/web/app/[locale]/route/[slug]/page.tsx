import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { NameBlock, RecordLink } from "@/components/cards/ui";
import { RouteExplorer } from "@/components/explore/RouteExplorer";
import { Page } from "@/components/shell/Header";
import { getKala } from "@/lib/content";
import { routeView } from "@/lib/phase3/epic";
import { citer } from "@/lib/phase3/views";

type Props = { params: Promise<{ slug: string; locale: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const kala = await getKala();
  return kala.dataset.routes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const kala = await getKala();
  return { title: `${kala.nameOf("routes", slug)} · KĀLA` };
}

export default async function RoutePage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "epic" });
  const tc = await getTranslations({ locale, namespace: "confidence" });
  const kala = await getKala();
  const route = kala.get("routes", slug);
  if (!route) notFound();
  const confidenceLabels = Object.fromEntries(
    ["verified", "traditional", "debated", "mythical"].map((c) => [c, tc(`${c}.label`)]),
  );
  return (
    <Page>
      <NameBlock names={route.names} />
      <p className="mt-2 text-sm">
        <span className="text-muted">{t("partOf")}: </span>
        <RecordLink href={`/epic/${route.text}`}>{kala.nameOf("texts", route.text)}</RecordLink>
      </p>
      <div className="mt-6">
        <Suspense fallback={null}>
          <RouteExplorer
            routes={[routeView(kala, slug, citer(kala))]}
            confidenceLabels={confidenceLabels}
          />
        </Suspense>
      </div>
    </Page>
  );
}
