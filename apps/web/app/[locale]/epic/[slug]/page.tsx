import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FamilyTree } from "@/components/cards/FamilyTree";
import { Badge, Cite, NameBlock, RecordLink, Section, VariantTag } from "@/components/cards/ui";
import { RouteExplorer } from "@/components/explore/RouteExplorer";
import { Page } from "@/components/shell/Header";
import { Link } from "@/i18n/navigation";
import { getKala } from "@/lib/content";
import { countNodes, familyForest } from "@/lib/phase3/family";
import { epicPeople, retellingTexts, routeView, storyBySection } from "@/lib/phase3/epic";
import { citer, epicPolitics } from "@/lib/phase3/views";

type Props = { params: Promise<{ slug: string; locale: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const kala = await getKala();
  const texts = new Set(
    kala.dataset.events.flatMap((e) => (e.narrative_order ? [e.narrative_order.text] : [])),
  );
  return [...texts].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const kala = await getKala();
  return { title: `${kala.nameOf("texts", slug)} · KĀLA` };
}

export default async function EpicPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "epic" });
  const tc = await getTranslations({ locale, namespace: "confidence" });
  const tk = await getTranslations({ locale, namespace: "enums.kingdomRelation" });
  const kala = await getKala();
  const text = kala.get("texts", slug);
  if (!text) notFound();

  const story = storyBySection(kala, slug);
  const people = epicPeople(kala, slug);
  const forest = familyForest(kala.dataset.relationships, people);
  const cite = citer(kala);
  const routes = kala.dataset.routes
    .filter((r) => r.text === slug)
    .map((r) => routeView(kala, r.slug, cite));
  const battles = kala.dataset.battlefields.filter((b) => b.text === slug);
  const politics = epicPolitics(kala, slug);
  const retold = retellingTexts(kala, slug);
  const confidenceLabels = Object.fromEntries(
    ["verified", "traditional", "debated", "mythical"].map((c) => [c, tc(`${c}.label`)]),
  );

  const nav = [
    { id: "story", label: t("story"), show: story.count > 0 },
    { id: "family", label: t("family"), show: forest.length > 0 },
    { id: "journeys", label: t("journeys"), show: routes.length > 0 },
    { id: "battle", label: t("battle"), show: battles.length > 0 },
    {
      id: "politics",
      label: t("politics"),
      show: politics.relations.length > 0 || politics.kingdoms.length > 0,
    },
  ].filter((n) => n.show);

  return (
    <Page>
      <p className="text-xs tracking-[0.2em] text-muted uppercase">{t("label")}</p>
      <NameBlock names={text.names} />
      <p className="mt-3 max-w-3xl text-lg leading-relaxed">{text.summary_beginner}</p>
      <p className="mt-2 flex flex-wrap gap-1.5">
        <Badge tone="gold">{t("countEvents", { count: story.count })}</Badge>
        <Badge tone="celestial">{t("countPeople", { count: people.size })}</Badge>
        <Link
          href={`/text/${slug}`}
          className="text-sm text-celestial underline decoration-celestial/40 underline-offset-2"
        >
          {t("aboutText")}
        </Link>
      </p>
      <p className="mt-3 max-w-3xl rounded border border-celestial/40 bg-celestial/5 p-2 text-sm text-celestial">
        {t("storyNote")}
      </p>
      {retold.length > 0 && (
        <p className="mt-3 text-sm">
          <span className="text-muted">{t("otherTellings")}: </span>
          {retold.map((r, i) => (
            <span key={r}>
              {i > 0 && ", "}
              <RecordLink href={`/epic/${r}`}>{kala.nameOf("texts", r)}</RecordLink>
            </span>
          ))}
        </p>
      )}

      <nav aria-label={t("contents")} className="mt-6 flex flex-wrap gap-2">
        {nav.map((n) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            className="rounded-full border border-white/15 px-3 py-1 text-sm hover:border-gold/60"
          >
            {n.label}
          </a>
        ))}
      </nav>

      {story.count > 0 && (
        <section id="story" aria-labelledby="story-title" className="mt-10 scroll-mt-24">
          <h2 id="story-title" className="text-2xl text-gold">
            {t("story")}
          </h2>
          {story.groups.map((g) => (
            <Section key={g.id} title={g.label}>
              <ol className="space-y-3">
                {g.events.map((e) => (
                  <li key={e.slug} className="rounded-lg border border-white/10 p-3">
                    <RecordLink href={`/event/${e.slug}`}>
                      {kala.nameOf("events", e.slug)}
                    </RecordLink>
                    <VariantTag kala={kala} variant={e.variant} />
                    <p className="mt-1 text-sm text-ink/85">{e.summary_beginner}</p>
                    <p className="mt-1 text-xs text-muted">
                      {e.participants.slice(0, 8).map((p, i) => (
                        <span key={p.entity}>
                          {i > 0 && ", "}
                          <RecordLink href={`/entity/${p.entity}`}>
                            {kala.nameOf("entities", p.entity)}
                          </RecordLink>
                        </span>
                      ))}
                      {e.participants.length > 8 && ` +${e.participants.length - 8}`}
                      {e.places.length > 0 && (
                        <>
                          {" · "}
                          {e.places.map((p, i) => (
                            <span key={p}>
                              {i > 0 && ", "}
                              <RecordLink href={`/place/${p}`}>
                                {kala.nameOf("places", p)}
                              </RecordLink>
                            </span>
                          ))}
                        </>
                      )}
                    </p>
                    {e.same_story_as.length > 0 && (
                      <p className="mt-1 text-xs">
                        <span className="text-muted">{t("alsoTold")}: </span>
                        {e.same_story_as.map((s, i) => (
                          <span key={s}>
                            {i > 0 && ", "}
                            <RecordLink href={`/event/${s}`}>{kala.nameOf("events", s)}</RecordLink>
                          </span>
                        ))}
                      </p>
                    )}
                    <Cite refs={e.references} kala={kala} />
                  </li>
                ))}
              </ol>
            </Section>
          ))}
          {story.rest.length > 0 && (
            <Section title={t("unplaced")}>
              <ul className="space-y-1">
                {story.rest.map((e) => (
                  <li key={e.slug}>
                    <RecordLink href={`/event/${e.slug}`}>
                      {kala.nameOf("events", e.slug)}
                    </RecordLink>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </section>
      )}

      {forest.length > 0 && (
        <section id="family" aria-labelledby="family-title" className="mt-12 scroll-mt-24">
          <h2 id="family-title" className="text-2xl text-gold">
            {t("family")}
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted">
            {t("familyNote", { count: countNodes(forest) })}
          </p>
          <div className="mt-4">
            <FamilyTree kala={kala} forest={forest} />
          </div>
          <p className="mt-3 text-sm">
            <Link
              href="/genealogy"
              className="text-celestial underline decoration-celestial/40 underline-offset-2"
            >
              {t("traceLink")}
            </Link>
          </p>
        </section>
      )}

      {routes.length > 0 && (
        <section id="journeys" aria-labelledby="journeys-title" className="mt-12 scroll-mt-24">
          <h2 id="journeys-title" className="text-2xl text-gold">
            {t("journeys")}
          </h2>
          <div className="mt-4">
            <Suspense fallback={null}>
              <RouteExplorer routes={routes} confidenceLabels={confidenceLabels} />
            </Suspense>
          </div>
        </section>
      )}

      {battles.length > 0 && (
        <section id="battle" aria-labelledby="battle-title" className="mt-12 scroll-mt-24">
          <h2 id="battle-title" className="text-2xl text-gold">
            {t("battle")}
          </h2>
          {battles.map((b) => (
            <div key={b.slug} className="mt-4 rounded-xl border border-white/10 p-4">
              <h3 className="text-xl">
                <RecordLink href={`/battlefield/${b.slug}`}>
                  {kala.nameOf("battlefields", b.slug)}
                </RecordLink>
              </h3>
              <p className="mt-1 text-ink/85">{b.summary_beginner}</p>
              <p className="mt-2 flex flex-wrap gap-1.5">
                <Badge tone="red">{t("countDays", { count: b.days.length })}</Badge>
                <Badge>
                  {t("countFallen", { count: b.days.reduce((s, d) => s + d.fallen.length, 0) })}
                </Badge>
              </p>
              <p className="mt-2">
                <Link
                  href={`/battlefield/${b.slug}`}
                  className="rounded-full border border-gold/50 px-4 py-1.5 text-sm text-gold hover:bg-gold/10"
                >
                  {t("openBattle")}
                </Link>
              </p>
            </div>
          ))}
        </section>
      )}

      {(politics.relations.length > 0 || politics.kingdoms.length > 0) && (
        <section id="politics" aria-labelledby="politics-title" className="mt-12 scroll-mt-24">
          <h2 id="politics-title" className="text-2xl text-gold">
            {t("politics")}
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted">{t("politicsNote")}</p>
          {politics.kingdoms.length > 0 && (
            <p className="mt-3 text-sm">
              {politics.kingdoms.map((k, i) => (
                <span key={k.slug}>
                  {i > 0 && " · "}
                  <RecordLink href={k.href}>{k.label}</RecordLink>
                </span>
              ))}
            </p>
          )}
          {politics.relations.length > 0 && (
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {politics.relations.map((r, i) => (
                <li key={i} className="rounded-lg border border-white/10 p-3 text-sm">
                  <RecordLink href={r.from.href}>{r.from.label}</RecordLink>{" "}
                  <Badge>{tk.has(r.type) ? tk(r.type) : r.type}</Badge>{" "}
                  <RecordLink href={r.to.href}>{r.to.label}</RecordLink>
                  <VariantTag kala={kala} variant={r.variant} />
                  <p className="mt-1 text-ink/85">{r.note}</p>
                  <p className="text-xs text-muted">
                    {r.cites.map((c, j) => (
                      <span key={j}>
                        {j > 0 && "; "}
                        <Link href={c.href} className="underline decoration-dotted">
                          {c.text}
                        </Link>
                      </span>
                    ))}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </Page>
  );
}
