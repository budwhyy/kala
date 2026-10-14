// §8 gate 5: automated accessibility scan (WCAG 2.1 A/AA rules) on every page type, plus a
// keyboard-only path through cards and mode switching.
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = [
  "/",
  "/entity/kashyapa",
  "/place/hastinapura",
  "/place/vaikuntha",
  "/kingdom/kuru-kingdom-epic",
  "/dynasty/kuru-dynasty",
  "/text/mahabharata",
  "/source/ganguli-mahabharata",
  "/variant/deities-creation-nasadiya-sukta",
  "/tradition/vaishnava",
  "/cosmic?view=list",
  "/genealogy?view=list&entity=kashyapa&trace=garuda",
  "/geography?view=list&place=hastinapura",
  "/search?q=kashyapa",
];

for (const path of PAGES) {
  test(`no serious accessibility violations: ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const serious = violations
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => `${v.id}: ${v.help} (${v.nodes.length}) e.g. ${v.nodes[0]?.target.join(" ")}`);
    expect(serious).toEqual([]);
  });
}

test("keyboard only: switch mode and follow a card link", async ({ page }) => {
  await page.goto("/entity/kashyapa");
  const geo = page
    .getByRole("navigation", { name: "Exploration modes" })
    .getByRole("link", { name: "Geography" });
  await geo.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/geography\?entity=kashyapa/);
  await page.goBack();
  const garuda = page.locator('main a[href="/entity/garuda"]').first();
  await garuda.focus();
  await expect(garuda).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/entity\/garuda$/);
});
