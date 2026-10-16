import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

// Messages are split by area so they can be edited independently:
//   core.json   — shell, cards, modes from Phase 1
//   phase2.json — avatars, philosophy, pilgrimage, journeys
//   phase3.json — epics, routes, battlefields, family trees
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = routing.locales.find((l) => l === requested) ?? routing.defaultLocale;
  const [core, phase2, phase3] = await Promise.all([
    import(`../messages/${locale}/core.json`),
    import(`../messages/${locale}/phase2.json`),
    import(`../messages/${locale}/phase3.json`),
  ]);
  return { locale, messages: { ...core.default, ...phase2.default, ...phase3.default } };
});
