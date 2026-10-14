import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { Kala, RelationView } from "@/lib/graph/kala";

/**
 * Which accounts this record's claims come from. Claims without a variant are undisputed in the
 * sources KĀLA holds; tagged claims belong to one account and others may differ (principle 3).
 */
export function VariantPanel({ kala, relations }: { kala: Kala; relations: RelationView[] }) {
  const t = useTranslations("variantPanel");
  const counts = new Map<string, number>();
  let shared = 0;
  for (const v of relations) {
    const variant = v.relationship.variant;
    if (variant) counts.set(variant, (counts.get(variant) ?? 0) + 1);
    else shared++;
  }
  if (counts.size === 0) return null;

  return (
    <aside
      aria-label={t("aria")}
      className="mt-6 rounded-lg border border-celestial/30 bg-celestial/5 p-4 text-sm"
    >
      <h2 className="text-celestial">{t("heading")}</h2>
      <p className="mt-1 text-muted">
        {t("body")} {shared > 0 && t("shared", { count: shared })}
      </p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {[...counts.entries()].map(([variant, n]) => (
          <li key={variant}>
            <Link
              href={`/variant/${variant}`}
              className="rounded border border-celestial/40 px-2 py-0.5 text-celestial hover:bg-celestial/10"
            >
              {kala.nameOf("variants", variant)} · {n}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
