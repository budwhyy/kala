import { expect, test } from "@playwright/test";

// The map itself needs external tiles, so this test checks the panels and list view, which work
// without them (and are the accessible equivalent of the globe).
test("geography: place panel, cosmological realms off the map, list view", async ({ page }) => {
  await page.goto("/geography?entity=kashyapa&place=hastinapura");
  await expect(page.getByTestId("selected-panel")).toContainText("Kashyapa");
  const aside = page.locator("aside").filter({ hasText: "Selected place" });
  await expect(aside).toContainText("Hastinapura");
  await expect(aside).toContainText("Historically verified");
  await expect(aside).toContainText("Uttar Pradesh");
  await aside.getByRole("link", { name: "Kuru (Mahabharata)" }).click();
  await expect(page).toHaveURL(/\/kingdom\/kuru-kingdom-epic$/);
  await page.goBack();

  const offMap = page.locator("div").filter({ hasText: /^Not on the map/ });
  await expect(offMap.getByRole("button", { name: "Vaikuntha" })).toBeVisible();

  await page.getByRole("radio", { name: "In the historical record" }).click();
  await expect(page.getByText("never placed on one timeline")).toBeVisible();

  await page.getByRole("button", { name: "List view" }).click();
  await expect(page.getByRole("link", { name: "Hastinapura" }).first()).toBeVisible();
});
