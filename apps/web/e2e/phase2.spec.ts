// Phase 2: Avatars, Philosophy, Pilgrimage, the Yuga journey, and event retellings.
import { expect, test } from "@playwright/test";

test("avatars: lists are compared and the four kinds of 'form' are explained separately", async ({
  page,
}) => {
  await page.goto("/avatar");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const glossary = page.locator("dl").first();
  await expect(glossary.locator("dt")).toHaveCount(4);

  // The comparison table shows which figures are not in every list (e.g. Buddha, Balarama).
  const table = page.getByRole("table").first();
  await expect(table).toBeVisible();
  await expect(table.getByText("not in every list").first()).toBeVisible();

  // Variant lists are shown as ordered lists with positions and sources.
  await expect(page.getByText(/^No\. 1$/).first()).toBeVisible();
  await expect(page.locator('main a[href^="/source/"]').first()).toBeVisible();
});

test("the Puranic Buddha avatar is not the historical Buddha", async ({ page }) => {
  await page.goto("/entity/buddha-avatar");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Buddha");
  await expect(
    page.getByText(/not the historical Buddha|not the Buddha of Buddhism/i).first(),
  ).toBeVisible();
  await expect(page.locator('main a[href="/tradition/buddhist"]')).toHaveCount(0);
});

test("philosophy: a concept shows several schools side by side, each sourced", async ({ page }) => {
  await page.goto("/philosophy");
  await expect(page.getByText("Buddhist and Jain understandings are distinct")).toBeVisible();
  await page.getByRole("link", { name: "Atman" }).first().click();
  await expect(page).toHaveURL(/\/concept\/atman$/);
  const schools = page.locator("main li h3");
  expect(await schools.count()).toBeGreaterThanOrEqual(3);
  await expect(page.locator('main a[href^="/source/"]').first()).toBeVisible();
});

test("pilgrimage: traditions stay in separate groups; networks list their places", async ({
  page,
}) => {
  await page.goto("/pilgrimage");
  await expect(
    page.getByRole("heading", { name: "Hindu traditions", level: 2, exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Buddhist", level: 2, exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Jain", level: 2, exact: true })).toBeVisible();

  await page
    .getByRole("link", { name: /^Char Dham$/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/network\/char-dham$/);
  await expect(page.getByText("Badrinath").first()).toBeVisible();
  await expect(page.getByRole("link", { name: /See these places on the map/ })).toBeVisible();

  // Jyotirlingas come in more than one list; each is labelled.
  await page.goto("/network/jyotirlingas");
  await expect(page.getByText("More than one list")).toBeVisible();
});

test("Buddhist and Jain networks do not contain Hindu-only sites and vice versa", async ({
  page,
}) => {
  await page.goto("/network/buddhist-four-great-places");
  await expect(page.getByText("Lumbini").first()).toBeVisible();
  await expect(page.getByText("Badrinath")).toHaveCount(0);
});

test("yuga journey: step through, with sources and the wheel", async ({ page }) => {
  await page.goto("/journey/yugas");
  await expect(
    page.getByText("Traditional chronology, not historical dating").first(),
  ).toBeVisible();
  await expect(page.getByText(/Step 1 of \d+/)).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page).toHaveURL(/step=2/);
  await expect(page.getByText(/Step 2 of/)).toBeVisible();
  await expect(page.locator('main a[href^="/source/"]').first()).toBeVisible();
  // Jump to the end and see the finish panel.
  const steps = page.getByRole("navigation", { name: "Journey progress" }).getByRole("button");
  await steps.last().click();
  await expect(page.getByText("You have reached the end of this journey.")).toBeVisible();
});

test("retellings of the churning are linked, each labelled with its account", async ({ page }) => {
  await page.goto("/event/samudra-manthana-vishnu-purana");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator('main a[href="/event/samudra-manthana-mahabharata"]')).toBeVisible();
  await expect(page.locator('main a[href="/event/samudra-manthana-ramayana"]')).toBeVisible();
});
