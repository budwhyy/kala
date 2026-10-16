// Phase 3: the epics — story in order, family trees, routes, the battlefield, kingdoms.
import { expect, test } from "@playwright/test";

test("epics index lists the Ramayana and the Mahabharata", async ({ page }) => {
  await page.goto("/epic");
  await expect(page.getByRole("link", { name: "Ramayana of Valmiki" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Mahabharata" }).first()).toBeVisible();
});

test("Ramayana: friendly URL, story by kanda, family tree, route as literary reconstruction", async ({
  page,
}) => {
  await page.goto("/epic/ramayana");
  await expect(page).toHaveURL(/\/epic\/valmiki-ramayana/);
  await expect(page.getByText("This is the story as the text tells it.")).toBeVisible();

  // Story grouped by kanda, with events linking to their pages.
  await expect(page.locator('#story a[href^="/event/ramayana-"]').first()).toBeVisible();
  // The family tree includes Dasharatha.
  await expect(page.locator('#family a[href="/entity/dasharatha"]').first()).toBeVisible();
  // The Ramcharitmanas is offered as another telling.
  await expect(page.locator('a[href="/epic/ramcharitmanas"]').first()).toBeVisible();

  // The route: literary notice, list view works without map tiles, steps advance.
  await page.getByRole("button", { name: "List view" }).first().click();
  await expect(page.getByText(/literary reconstruction from the text/i)).toBeVisible();
  await expect(page.getByText(/^Stage 1 of \d+/)).toBeVisible();
  await page.getByRole("button", { name: "Next", exact: true }).first().click();
  await expect(page.getByText(/^Stage 2 of \d+/)).toBeVisible();
});

test("Mahabharata: divine and legal fathers kept, kingdoms and alliances listed", async ({
  page,
}) => {
  await page.goto("/epic/mahabharata");
  const family = page.locator("#family");
  await expect(family.locator('a[href="/entity/pandu"]').first()).toBeVisible();
  await expect(family.getByText(/divine birth father/i).first()).toBeVisible();
  await expect(page.locator("#politics")).toBeVisible();
  await expect(page.locator('a[href="/battlefield/kurukshetra-war"]').first()).toBeVisible();
});

test("Kurukshetra: day selector, commanders, the fallen, sides", async ({ page }) => {
  await page.goto("/battlefield/kurukshetra-war");
  await expect(page.getByText(/formations, encounters and deaths are literary/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: "The armies" })).toBeVisible();
  await page.getByRole("button", { name: "Day 10" }).click();
  await expect(page).toHaveURL(/day=10/);
  await expect(page.getByRole("heading", { name: "Day 10" })).toBeVisible();
  await expect(page.getByRole("table")).toContainText("Bhishma");
});

test("Krishna and Arjuna are connected, with sources", async ({ page }) => {
  await page.goto("/genealogy?entity=krishna&trace=arjuna&view=list");
  const trace = page.locator("ol").filter({ hasText: "Arjuna" }).first();
  await expect(trace).toBeVisible();
  await expect(trace.locator('a[href^="/source/"]').first()).toBeVisible();
});

test("an epic character page shows journeys and battle role", async ({ page }) => {
  await page.goto("/entity/bhishma");
  await expect(page.locator('main a[href="/battlefield/kurukshetra-war"]').first()).toBeVisible();
  await page.goto("/entity/sita");
  await expect(page.locator('main a[href^="/route/"]').first()).toBeVisible();
});

// Brief: layouts work at phone width with no horizontal page scroll.
for (const path of [
  "/epic/valmiki-ramayana",
  "/epic/mahabharata",
  "/battlefield/kurukshetra-war",
  "/route/rama-exile-route-valmiki",
  "/entity/arjuna",
  "/hi/epic/mahabharata",
]) {
  test(`no sideways scrolling at phone width: ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const { scroll, client } = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(scroll).toBeLessThanOrEqual(client + 1);
  });
}
