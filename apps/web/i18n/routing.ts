import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "hi"],
  defaultLocale: "en",
  // English keeps its plain URLs (/entity/kashyapa); Hindi lives under /hi/…
  localePrefix: "as-needed",
  // The visitor chooses the language with the switcher; no surprise redirects from Accept-Language.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
