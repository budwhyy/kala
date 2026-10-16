// Family tree of an epic as nested lists: each person under the parent the text names (legal father
// first), partners beside them, and other parents (divine, biological, foster, or a rival account's)
// kept as notes. Deep branches are collapsible. Server component: no client JavaScript.
import { useTranslations } from "next-intl";
import type { Kala } from "@/lib/graph/kala";
import { countNodes, type FamilyNode } from "@/lib/phase3/family";
import { RecordLink, VariantTag } from "./ui";

function Person({
  kala,
  node,
  depth,
  chained = false,
}: {
  kala: Kala;
  node: FamilyNode;
  depth: number;
  chained?: boolean;
}) {
  const t = useTranslations("family");
  const tm = useTranslations("enums.mode");
  const label = (
    <>
      <RecordLink href={`/entity/${node.slug}`}>{kala.nameOf("entities", node.slug)}</RecordLink>
      <VariantTag kala={kala} variant={node.variant} />
      {node.partners.length > 0 && (
        <span className="ml-2 text-sm text-ink/75">
          ⚭{" "}
          {node.partners.map((p, i) => (
            <span key={p}>
              {i > 0 && ", "}
              <RecordLink href={`/entity/${p}`}>{kala.nameOf("entities", p)}</RecordLink>
            </span>
          ))}
        </span>
      )}
      {node.otherParents.length > 0 && (
        <span className="ml-2 text-xs text-muted">
          (
          {node.otherParents.map((p, i) => (
            <span key={`${p.slug}-${p.mode}-${p.variant ?? ""}`}>
              {i > 0 && "; "}
              {t(p.role === "mother" ? "otherMother" : "otherFather", {
                mode: tm.has(p.mode) ? tm(p.mode) : p.mode,
              })}{" "}
              <RecordLink href={`/entity/${p.slug}`}>{kala.nameOf("entities", p.slug)}</RecordLink>
              <VariantTag kala={kala} variant={p.variant} />
            </span>
          ))}
          )
        </span>
      )}
    </>
  );
  const mark = chained ? (
    <span aria-hidden className="mr-1 text-gold/70">
      ↳
    </span>
  ) : null;
  if (node.children.length === 0)
    return (
      <li className="py-0.5 break-words">
        {mark}
        {label}
      </li>
    );
  // A single line of descent (e.g. thirty-odd kings of the Ikshvaku line) is listed straight down,
  // marked ↳, instead of indenting each generation: indentation is kept for real branching, so the
  // tree stays inside a phone screen however long the lineage.
  if (node.children.length === 1)
    return (
      <>
        <li className="py-0.5 break-words">
          {mark}
          {label}
        </li>
        <Person kala={kala} node={node.children[0]!} depth={depth} chained />
      </>
    );
  // The names stay outside the disclosure control (links must not sit inside <summary>).
  return (
    <li className="py-0.5">
      <span className="break-words">
        {mark}
        {label}
      </span>
      <details open={depth < 2 || node.inStory} className="mt-0.5">
        <summary className="list-item w-fit min-h-6 cursor-pointer py-1 text-xs text-muted">
          {t("descendants", { count: countNodes(node.children) })}
        </summary>
        <ul className="ml-2 border-l border-gold/25 pl-3 sm:ml-3 sm:pl-4">
          {node.children.map((c) => (
            <Person key={c.slug} kala={kala} node={c} depth={depth + 1} />
          ))}
        </ul>
      </details>
    </li>
  );
}

export function FamilyTree({ kala, forest }: { kala: Kala; forest: FamilyNode[] }) {
  return (
    <ul className="space-y-3">
      {forest.map((root) => (
        <Person key={root.slug} kala={kala} node={root} depth={0} />
      ))}
    </ul>
  );
}
