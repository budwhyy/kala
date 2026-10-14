// Brief §9 "Phase 1 is done when": land, choose a creation pathway, open the Cosmic Wheel, jump to
// Kashyapa, trace Kashyapa → Garuda with sources, open Geography without losing Kashyapa, click
// Hastinapura, see its confidence class and modern location, and reach the Kuru dynasty stub.
// Runs on the desktop and mobile projects.
import { expect, test } from "@playwright/test";

test("Phase 1 acceptance journey", async ({ page }) => {
  // Land; skip the animated intro.
  await page.goto("/");
  await expect(page.getByText("what was existence?")).toBeVisible();
  const skip = page.getByRole("button", { name: "Skip intro" });
  if (await skip.isVisible()) await skip.click();

  // Choose a creation pathway.
  await page.getByRole("link", { name: /Nasadiya Sukta/ }).click();
  await expect(page).toHaveURL(/\/variant\//);
  await expect(page.getByText("One account among several")).toBeVisible();

  // Open the Cosmic Wheel.
  await page.getByRole("link", { name: /cycles of time/ }).click();
  await expect(page).toHaveURL(/\/cosmic/);
  await expect(page.getByText("Traditional chronology, not historical dating")).toBeVisible();

  // Jump to Kashyapa (via search).
  await page.getByRole("searchbox", { name: "Search KĀLA" }).fill("Kashyapa");
  await page.getByRole("searchbox", { name: "Search KĀLA" }).press("Enter");
  await page.getByRole("link", { name: "Kashyapa" }).first().click();
  await expect(page).toHaveURL(/\/entity\/kashyapa$/);

  // Trace Kashyapa → Garuda with sources.
  await page
    .getByRole("navigation", { name: "Exploration modes" })
    .getByRole("link", { name: "Genealogy" })
    .click();
  await expect(page).toHaveURL(/\/genealogy\?entity=kashyapa/);
  await page.getByLabel("To").selectOption("garuda");
  const trace = page.locator("ol").filter({ hasText: "parent of" }).first();
  await expect(trace).toContainText("Garuda");
  await expect(trace.locator('a[href^="/source/"]').first()).toBeVisible();

  // Geography keeps Kashyapa in context.
  await page
    .getByRole("navigation", { name: "Exploration modes" })
    .getByRole("link", { name: "Geography" })
    .click();
  await expect(page).toHaveURL(/\/geography\?entity=kashyapa/);
  await expect(page.getByTestId("selected-panel")).toContainText("Kashyapa");

  // Click Hastinapura (list view: works without map tiles) and see confidence + modern location.
  await page.getByRole("button", { name: "List view" }).click();
  await page.getByRole("link", { name: "Hastinapura" }).first().click();
  await expect(page).toHaveURL(/\/place\/hastinapura$/);
  await expect(page.getByText("Historically verified").first()).toBeVisible();
  await expect(page.getByText(/Uttar Pradesh/).first()).toBeVisible();

  // Reach the Kuru dynasty stub.
  await page.getByRole("link", { name: "Kuru (Mahabharata)" }).first().click();
  await page.locator('a[href="/dynasty/kuru-dynasty"]').first().click();
  await expect(page).toHaveURL(/\/dynasty\/kuru-dynasty$/);
  await expect(page.getByText("Legendary dynasty")).toBeVisible();
});

test("under reduced motion the intro is skipped and sound starts off", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Different texts answer differently" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Skip intro" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Sound off" })).toBeVisible();
});
