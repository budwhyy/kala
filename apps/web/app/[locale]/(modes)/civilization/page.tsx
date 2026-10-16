import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { TYPE_TONE } from "@/components/3d/transmission-colors";
import { Badge, Section } from "@/components/cards/ui";
import { CivExplorer } from "@/components/explore/CivExplorer";
import { ModePage } from "@/components/shell/ModePage";
import { Link } from "@/i18n/navigation";
import { getKala } from "@/lib/content";
import { civData, TRANSMISSION_TYPES, type CivLink } from "@/lib/phase4/civ";
import { enumLabel } from "@/lib/i18n-helpers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "civ" });
  return { title: `${t("title")} · KĀLA` };
}

const link =
  "text-celestial underline decoration-celestial/40 underline-offset-2 hover:decoration-celestial";

type Branch = { slug: string; label: string; children: Branch[] };
function Tree({ nodes }: { nodes: Branch[] }) {
  return (
    <ul className="ml-4 border-l border-white/15 pl-3">
      {nodes.map((n) => (
        <li key={n.slug} className="py-0.5">
          <Link href={`/tradition/${n.slug}`} className={link}>
            {n.label}
          </Link>
          {n.children.length > 0 && <Tree nodes={n.children} />}
        </li>
      ))}
    </ul>
  );
}

export default async function CivilizationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("civ");
  const te = await getTranslations("enums");
  const kala = await getKala();
  const { links, branches } = civData(kala);

  const groups = new Map<string, CivLink[]>();
  for (const l of links) groups.set(l.group, [...(groups.get(l.group) ?? []), l]);

  const swatch = (type: CivLink["type"]) => (
    <span
      aria-hidden
      className={`inline-block h-1 w-6 align-middle ${TYPE_TONE[type].swatch} ${TYPE_TONE[type].dashed ? "opacity-60 [mask:repeating-linear-gradient(90deg,#000_0_4px,transparent_4px_8px)]" : ""}`}
    />
  );

  const list = (
    <div className="space-y-6">
      <Section title={t("legend")}>
        <dl className="grid gap-3 sm:grid-cols-2">
          {TRANSMISSION_TYPES.map((type) => (
            <div key={type} className="rounded-lg border border-white/10 p-3">
              <dt className="flex items-center gap-2">
                {swatch(type)} <Badge>{t(type)}</Badge>
              </dt>
              <dd className="mt-1 text-sm text-muted">{t(`${type}Explain`)}</dd>
            </div>
          ))}
        </dl>
      </Section>
      <Section title={t("transmissions")}>
        {links.length === 0 ? (
          <p className="text-muted">{t("empty")}</p>
        ) : (
          [...groups].map(([group, ls]) => (
            <div key={group} className="mb-4">
              <h3 className="font-serif text-gold">
                {group ? t("fromText", { name: group }) : t("otherLinks")}
              </h3>
              <ul className="mt-2 space-y-3">
                {ls.map((l) => (
                  <li key={l.slug}>
                    <div className="flex flex-wrap items-center gap-2">
                      {swatch(l.type)}
                      <Badge>{t(l.type)}</Badge>
                      <Link href={`/transmission/${l.slug}`} className={link}>
                        {l.label}
                      </Link>
                    </div>
                    {l.to && (
                      <p className="text-sm text-muted">
                        →{" "}
                        <Link href={l.to.href} className={link}>
                          {l.to.label}
                        </Link>
                      </p>
                    )}
                    <p className="text-sm text-ink/85">{l.summary}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </Section>
      <Section title={t("branches")}>
        <div className="grid gap-4 sm:grid-cols-2">
          {branches.map((b) => (
            <div key={b.family}>
              <h3 className="font-serif text-gold">{enumLabel(te, "family", b.family)}</h3>
              <Tree nodes={b.roots} />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  return (
    <ModePage title={t("title")} intro={<p>{t("intro")}</p>}>
      <p className="mb-4 rounded-lg border border-copper/40 bg-copper/5 p-3 text-sm">
        {t("nations")}
      </p>
      <Suspense fallback={null}>
        <CivExplorer links={links} list={list} />
      </Suspense>
    </ModePage>
  );
}
