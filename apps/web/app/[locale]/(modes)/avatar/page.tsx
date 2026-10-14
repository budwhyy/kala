import { getTranslations, setRequestLocale } from "next-intl/server";
import { Badge, Cite, RecordLink, Section, VariantTag } from "@/components/cards/ui";
import { ModePage } from "@/components/shell/ModePage";
import { getKala } from "@/lib/content";
import { hrefFor } from "@/lib/graph/kala";
import {
  compareLists,
  formGroups,
  FORM_TYPES,
  orderedLists,
  type FormType,
} from "@/lib/phase2/forms";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "avatar" });
  return { title: `${t("title")} · KĀLA` };
}

const TONE: Record<FormType, "gold" | "copper" | "celestial" | "red"> = {
  avatar_of: "gold",
  manifestation_of: "copper",
  aspect_of: "celestial",
  identified_with: "red",
};

export default async function AvatarPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "avatar" });
  const kala = await getKala();
  const rels = kala.dataset.relationships;

  const lists = orderedLists(rels);
  // Compare lists that describe the same principal in the same way (e.g. all avatar lists of Vishnu).
  const comparable = new Map<string, typeof lists>();
  for (const l of lists) {
    const key = `${l.principal}|${l.type}`;
    comparable.set(key, [...(comparable.get(key) ?? []), l]);
  }
  const groups = formGroups(rels);

  return (
    <ModePage title={t("title")} intro={<p>{t("intro")}</p>}>
      <Section title={t("glossaryTitle")}>
        <dl className="grid gap-3 md:grid-cols-2">
          {FORM_TYPES.map((type) => (
            <div key={type} className="rounded-lg border border-white/10 p-3">
              <dt>
                <Badge tone={TONE[type]}>{t(`types.${type}.name`)}</Badge>
              </dt>
              <dd className="mt-1 text-sm text-ink/85">{t(`types.${type}.definition`)}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {[...comparable.entries()].map(([key, group]) => {
        const principal = group[0]!.principal;
        const type = group[0]!.type;
        const rows = compareLists(group);
        const name = kala.nameOf("entities", principal);
        return (
          <div key={key}>
            <Section title={t("listsTitle", { name, type: t(`types.${type}.name`) })}>
              <p className="max-w-3xl text-sm text-muted">{t("listsIntro")}</p>
            </Section>

            {group.length > 1 && (
              <Section title={t("compareTitle")}>
                <p className="mb-2 max-w-3xl text-sm text-muted">{t("compareIntro")}</p>
                <div className="overflow-x-auto rounded-lg border border-white/10">
                  <table className="w-full min-w-[32rem] text-left text-sm">
                    <caption className="sr-only">{t("compareCaption", { name })}</caption>
                    <thead className="text-muted">
                      <tr>
                        <th scope="col" className="p-2 font-normal">
                          {t("figure")}
                        </th>
                        {group.map((l) => (
                          <th key={l.variant} scope="col" className="p-2 font-normal">
                            {kala.nameOf("variants", l.variant)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr
                          key={r.slug}
                          className={`border-t border-white/10 ${r.inAll ? "" : "bg-gold/5"}`}
                        >
                          <th scope="row" className="p-2 font-normal">
                            <RecordLink href={hrefFor("entities", r.slug)}>
                              {kala.nameOf("entities", r.slug)}
                            </RecordLink>
                            {!r.inAll && (
                              <span className="ml-2 text-xs text-gold">{t("differs")}</span>
                            )}
                          </th>
                          {group.map((l) => (
                            <td key={l.variant} className="p-2">
                              {r.positions[l.variant] ?? (
                                <span aria-label={t("notIncluded")}>—</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            )}

            {group.map((l) => (
              <Section key={l.variant} title={kala.nameOf("variants", l.variant)}>
                <p className="mb-2 text-xs text-muted">
                  <Cite refs={kala.get("variants", l.variant)?.references ?? []} kala={kala} />
                </p>
                <ol className="grid gap-3 md:grid-cols-2">
                  {l.entries.map((e) => (
                    <li key={e.relationship.id} className="rounded-lg border border-white/10 p-3">
                      <span className="mr-2 text-sm text-gold">
                        {t("position", { n: e.position })}
                      </span>
                      <RecordLink href={hrefFor("entities", e.slug)}>
                        {kala.nameOf("entities", e.slug)}
                      </RecordLink>
                      <p className="mt-1 text-sm text-ink/85">{e.relationship.explanation}</p>
                      <Cite refs={e.relationship.references} kala={kala} />
                    </li>
                  ))}
                </ol>
              </Section>
            ))}
          </div>
        );
      })}

      {groups.length > 0 && (
        <Section title={t("formsTitle")}>
          <p className="mb-3 max-w-3xl text-sm text-muted">{t("formsIntro")}</p>
          <div className="space-y-6">
            {groups.map((g) => (
              <div key={g.principal}>
                <h3 className="text-xl text-gold">
                  <RecordLink href={hrefFor("entities", g.principal)}>
                    {kala.nameOf("entities", g.principal)}
                  </RecordLink>
                </h3>
                <ul className="mt-2 grid gap-3 md:grid-cols-2">
                  {g.forms.map((f) => (
                    <li key={f.id} className="rounded-lg border border-white/10 p-3">
                      <Badge tone={TONE[f.type as FormType]}>{t(`types.${f.type}.name`)}</Badge>{" "}
                      <RecordLink href={hrefFor("entities", f.from)}>
                        {kala.nameOf("entities", f.from)}
                      </RecordLink>
                      <VariantTag kala={kala} variant={f.variant} />
                      <p className="mt-1 text-sm text-ink/85">{f.explanation}</p>
                      <Cite refs={f.references} kala={kala} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {lists.length === 0 && groups.length === 0 && <p className="mt-6 text-muted">{t("empty")}</p>}
    </ModePage>
  );
}
