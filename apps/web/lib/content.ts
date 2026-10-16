// Loads and validates content/ once per server process (at build time for static pages).
// Fails the build if content is invalid, so a bad record can never reach the site.
import "server-only";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import { loadContent } from "@kala/schema/load";
import { getLocale } from "next-intl/server";
import { join } from "node:path";
import { cache } from "react";
import { buildKala } from "./graph/kala";
import { buildSearchIndex } from "./search/search";

const CONTENT_DIR = join(process.cwd(), "..", "..", "content");

let pending: ReturnType<typeof load> | undefined;

async function load() {
  const { dataset, issues } = await loadContent(CONTENT_DIR);
  if (issues.length > 0) {
    const list = issues.map((i) => `  ${i.file}: ${i.message}`).join("\n");
    throw new Error(`content/ has ${issues.length} issue(s):\n${list}`);
  }
  // One index per language: names (and so labels and links) follow the visitor's locale.
  return Object.fromEntries(
    ["en", "hi", "ta"].map((locale) => {
      const kala = buildKala(dataset, locale);
      return [locale, { kala, searchIndex: buildSearchIndex(kala) }];
    }),
  ) as Record<
    Locale,
    { kala: ReturnType<typeof buildKala>; searchIndex: ReturnType<typeof buildSearchIndex> }
  >;
}

const loaded = () => (pending ??= load());

/** Content for the current request's locale. Call setRequestLocale() first in static pages. */
export const getContent = cache(async () => {
  let locale: string = "en";
  try {
    locale = await getLocale();
  } catch (error) {
    // generateStaticParams and similar build-time hooks run outside a request: there is no locale
    // to read, and they only need slugs, which are identical in every language.
    if (!(error instanceof Error && error.message.includes("outside a request scope"))) throw error;
  }
  return (await loaded())[hasLocale(routing.locales, locale) ? locale : "en"];
});

/** Content for an explicit locale, for code that runs outside a request (generateStaticParams). */
export async function getContentFor(locale: Locale) {
  return (await loaded())[locale];
}

export async function getKala() {
  return (await getContent()).kala;
}
