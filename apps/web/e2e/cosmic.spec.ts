import { expect, test } from "@playwright/test";

test("cosmic wheel: select a yuga, switch to list view", async ({ page }) => {
  await page.goto("/cosmic");
  await expect(page.getByText("Traditional chronology, not historical dating")).toBeVisible();
  await page.getByRole("button", { name: /treta yuga/i }).click();
  await expect(page.getByRole("heading", { name: /treta yuga/i })).toBeVisible();
  await page.getByRole("button", { name: "List view" }).click();
  await expect(page).toHaveURL(/view=list/);
  await expect(page.getByRole("table")).toBeVisible();
});
