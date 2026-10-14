import { Opening, type Pathway } from "@/components/opening/Opening";
import { getKala } from "@/lib/content";
import { displayName } from "@/lib/graph/kala";

export default async function Home() {
  const kala = await getKala();
  const pathways: Pathway[] = kala.dataset.variants
    .filter((v) => v.kind === "creation_pathway")
    .map((v) => ({
      slug: v.slug,
      name: displayName(v.names),
      tradition: kala.nameOf("traditions", v.tradition),
      text: v.text ? kala.nameOf("texts", v.text) : undefined,
      description: v.description,
    }));
  return <Opening pathways={pathways} />;
}
