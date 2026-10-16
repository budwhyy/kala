// Phase 4: historical atlas, civilisation atlas, periods, transmissions, Tamil.
import { expect, test } from "@playwright/test";

test("historical atlas: period chips filter states; reach is labelled, not a border", async ({
  page,
}) => {
  await page.goto("/atlas?view=list");
  await expect(page.getByText(/Historical years only/)).toBeVisible();
  await page.getByRole("button", { name: "Maurya period", exact: true }).click();
  await expect(page).toHaveURL(/period=maurya-period/);
  const aside = page.locator("aside");
  await expect(aside.getByRole("link", { name: "Maurya empire" })).toBeVisible();
  await expect(aside.getByRole("link", { name: /Gupta/ })).toHaveCount(0);
  await expect(
    aside.getByText(/Approximate reach based on \d+ attested site/).first(),
  ).toBeVisible();
});

test("civilisation atlas: typed transmissions, legend and the modern-nations disclaimer", async ({
  page,
}) => {
  await page.goto("/civilization?view=list");
  await expect(page.getByText(/No modern nation is presented as the heir/)).toBeVisible();
  await expect(page.getByText("Uncertain hypothesis").first()).toBeVisible();
  await page.getByRole("link", { name: "The Rama story in the Buddhist Dasaratha Jataka" }).click();
  await expect(page).toHaveURL(/\/transmission\/ramayana-to-dasaratha-jataka/);
  await expect(page.getByText("Reinterpretation").first()).toBeVisible();
});

test("period page lists the states active in it", async ({ page }) => {
  await page.goto("/period/maurya-period");
  await expect(page.locator('a[href="/kingdom/maurya-empire"]').first()).toBeVisible();
});

test("kingdom card shows where the evidence is", async ({ page }) => {
  await page.goto("/kingdom/maurya-empire");
  await expect(page.getByRole("heading", { name: "Where the evidence is" })).toBeVisible();
});

test("epics index keeps Buddhist and Jain story worlds separate", async ({ page }) => {
  await page.goto("/epic");
  await expect(page.getByRole("heading", { name: "Buddhist", level: 2 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Jain", level: 2 })).toBeVisible();
});

test("Tamil: interface in Tamil, names fall back to English", async ({ page }) => {
  await page.goto("/ta/atlas?view=list");
  await expect(page.locator("html")).toHaveAttribute("lang", "ta");
  await expect(page.getByRole("link", { name: "தமிழ்" })).toHaveAttribute("aria-current", "true");
  await expect(page.getByRole("link", { name: "Maurya empire" }).first()).toBeVisible();
});

for (const path of ["/atlas", "/civilization", "/period/maurya-period", "/ta/atlas"]) {
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
