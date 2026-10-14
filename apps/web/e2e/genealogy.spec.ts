import { expect, test } from "@playwright/test";

test("trace Kashyapa → Garuda with sources, and keep it in list view", async ({ page }) => {
  await page.goto("/genealogy?entity=kashyapa");
  await page.getByLabel("To").selectOption("garuda");
  await expect(page).toHaveURL(/trace=garuda/);
  const trace = page.locator("ol").filter({ hasText: "parent of" }).first();
  await expect(trace).toContainText("Kashyapa");
  await expect(trace).toContainText("Garuda");
  await expect(trace.locator('a[href^="/source/"]').first()).toBeVisible();

  await page.getByRole("button", { name: "List view" }).click();
  await expect(page).toHaveURL(/view=list/);
  await expect(page.getByRole("link", { name: "Garuda" }).first()).toBeVisible();
  await expect(trace).toContainText("Garuda");
});
