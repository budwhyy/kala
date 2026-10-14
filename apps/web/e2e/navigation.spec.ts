// §8 gate 4 (Phase 1 subset): the navigation chain and mode switching that keeps the selection.
import { expect, test } from "@playwright/test";

test("Place → Kingdom → Dynasty → Character → Text round trip", async ({ page }) => {
  await page.goto("/place/hastinapura");
  await expect(page.getByRole("heading", { level: 1, name: "Hastinapura" })).toBeVisible();
  await expect(page.getByText("Historically verified").first()).toBeVisible();

  await page.getByRole("link", { name: "Kuru (Mahabharata)" }).first().click();
  await expect(page).toHaveURL(/\/kingdom\/kuru-kingdom-epic$/);
  await expect(page.getByText("Same name, separate record")).toBeVisible();

  await page.locator('a[href="/dynasty/kuru-dynasty"]').first().click();
  await expect(page).toHaveURL(/\/dynasty\/kuru-dynasty$/);

  await page.locator('main a[href^="/entity/"]').first().click();
  await expect(page).toHaveURL(/\/entity\//);

  await page.locator('main a[href^="/source/"]').first().click();
  await expect(page).toHaveURL(/\/source\//);
  await page.locator('main a[href^="/text/"]').first().click();
  await expect(page).toHaveURL(/\/text\//);
  await page.goBack();
  await page.goBack();
  await expect(page).toHaveURL(/\/entity\//);
});

test("mode switch keeps the selected figure", async ({ page }) => {
  await page.goto("/entity/kashyapa");
  await page
    .getByRole("navigation", { name: "Exploration modes" })
    .getByRole("link", { name: "Geography" })
    .click();
  await expect(page).toHaveURL(/\/geography\?entity=kashyapa$/);
  await expect(page.getByTestId("selected-panel")).toContainText("Kashyapa");

  await page
    .getByRole("navigation", { name: "Exploration modes" })
    .getByRole("link", { name: "Cosmic time" })
    .click();
  await expect(page).toHaveURL(/\/cosmic\?entity=kashyapa$/);
  await expect(page.getByTestId("selected-panel")).toContainText("Kashyapa");
});

test("cosmological places show no map position", async ({ page }) => {
  await page.goto("/place/vaikuntha");
  await expect(page.getByText("Cosmological").first()).toBeVisible();
  await expect(page.getByText("Modern location")).toHaveCount(0);
});

test("search works in Devanagari", async ({ page }) => {
  await page.goto(`/search?q=${encodeURIComponent("कश्यप")}`);
  await expect(page.getByRole("link", { name: "Kashyapa" })).toBeVisible();
});
