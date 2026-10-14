import { setRequestLocale } from "next-intl/server";
import { Opening, type Pathway } from "@/components/opening/Opening";
import { getKala } from "@/lib/content";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const kala = await getKala();
  const pathways: Pathway[] = kala.dataset.variants
    .filter((v) => v.kind === "creation_pathway")
    .map((v) => ({
      slug: v.slug,
      name: kala.nameOf("variants", v.slug),
      tradition: kala.nameOf("traditions", v.tradition),
      text: v.text ? kala.nameOf("texts", v.text) : undefined,
      description: v.description,
    }));
  return <Opening pathways={pathways} />;
}
