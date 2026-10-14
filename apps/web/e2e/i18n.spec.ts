// Hindi UI (Phase 2): /hi/... routes, Devanagari names first, language switching that keeps the
// page and the exploration context, and unprefixed English URLs.
import { expect, test } from "@playwright/test";

test("English URLs stay unprefixed and the document language is en", async ({ page }) => {
  await page.goto("/entity/kashyapa");
  await expect(page).toHaveURL(/\/entity\/kashyapa$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Kashyapa/);
  // No Hindi-only notice on the English site.
  await expect(page.getByTestId("content-language-notice")).toHaveCount(0);
});

test("Hindi home and mode pages are in Hindi", async ({ page }) => {
  await page.goto("/hi");
  await expect(page.locator("html")).toHaveAttribute("lang", "hi");
  await expect(page.getByText("अस्तित्व क्या था?")).toBeVisible();

  await page.goto("/hi/cosmic");
  await expect(page.locator("html")).toHaveAttribute("lang", "hi");
  const modes = page.getByRole("navigation", { name: "अन्वेषण के तरीके" });
  await expect(modes.getByRole("link", { name: "ब्रह्मांडीय काल" })).toBeVisible();
  await expect(modes.getByRole("link", { name: "वंशावली" })).toBeVisible();
  await expect(modes.getByRole("link", { name: "भूगोल" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ब्रह्मांडीय काल");
  // Content stays English, and the page says so honestly.
  await expect(page.getByTestId("content-language-notice")).toContainText("अंग्रेज़ी");
});

test("a Hindi record page leads with the Devanagari name", async ({ page }) => {
  await page.goto("/hi/entity/kashyapa");
  await expect(page.locator("html")).toHaveAttribute("lang", "hi");
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toHaveText("कश्यप");
  await expect(h1.locator("span")).toHaveAttribute("lang", "sa");
  // English and IAST are secondary text.
  await expect(page.locator("main").getByText("Kashyapa").first()).toBeVisible();
  await expect(page.locator("main").getByText("Kaśyapa").first()).toBeVisible();
  // Links stay inside /hi.
  const first = page.locator('main a[href^="/hi/entity/"]').first();
  await expect(first).toBeVisible();
});

test("switching language keeps the path and the query string", async ({ page }) => {
  await page.goto("/entity/kashyapa?view=list");
  const switcher = page.getByRole("navigation", { name: "Language" });
  await expect(switcher.getByRole("link", { name: "English" })).toHaveAttribute(
    "aria-current",
    "true",
  );
  await switcher.getByRole("link", { name: "हिन्दी" }).click();
  await expect(page).toHaveURL(/\/hi\/entity\/kashyapa\?view=list$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "hi");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("कश्यप");

  const back = page.getByRole("navigation", { name: "भाषा" });
  await expect(back.getByRole("link", { name: "हिन्दी" })).toHaveAttribute("aria-current", "true");
  await back.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/entity\/kashyapa\?view=list$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("the language switcher keeps a selection in the URL", async ({ page }) => {
  await page.goto("/genealogy?view=list&entity=kashyapa");
  await page
    .getByRole("navigation", { name: "Language" })
    .getByRole("link", { name: "हिन्दी" })
    .click();
  await expect(page).toHaveURL(/\/hi\/genealogy\?(?=.*entity=kashyapa)(?=.*view=list)/);
  await expect(page.getByTestId("selected-panel")).toContainText("कश्यप");
});

test("header search works under /hi", async ({ page }) => {
  await page.goto("/hi/cosmic");
  const box = page.getByRole("searchbox", { name: "KĀLA में खोजें" });
  await box.fill("kashyapa");
  await box.press("Enter");
  await expect(page).toHaveURL(/\/hi\/search\?q=kashyapa$/);
  await expect(page.getByRole("link", { name: "कश्यप" })).toBeVisible();
});

test("Hindi mode switching keeps the selection and the locale", async ({ page }) => {
  await page.goto("/hi/entity/kashyapa");
  await page
    .getByRole("navigation", { name: "अन्वेषण के तरीके" })
    .getByRole("link", { name: "भूगोल" })
    .click();
  await expect(page).toHaveURL(/\/hi\/geography\?entity=kashyapa$/);
  await expect(page.getByTestId("selected-panel")).toContainText("कश्यप");
});
