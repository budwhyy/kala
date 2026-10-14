import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { Page } from "@/components/shell/Header";
import { SearchResults } from "@/components/shell/SearchResults";
import { getContent } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.title" });
  return { title: t("search") };
}

export default async function SearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("search");
  const { searchIndex } = await getContent();
  return (
    <Page>
      <h1 className="text-3xl text-gold">{t("title")}</h1>
      <p className="mt-2 text-muted">{t("intro")}</p>
      <Suspense fallback={null}>
        <SearchResults index={searchIndex} />
      </Suspense>
    </Page>
  );
}
