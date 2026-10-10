import { expect, test } from "@playwright/test";

test("detail descriptions override the site default in static HTML and navigation", async ({
  page,
  request,
}) => {
  for (const path of [
    "/",
    "/opensource/taffy-layout",
    "/blog/2025-12/unlocking-visual-editing-react-puck",
  ]) {
    const response = await request.get(path);
    expect(response.ok()).toBeTruthy();
    const html = await response.text();
    expect(html.match(/<meta\b[^>]*name="description"[^>]*>/g)).toHaveLength(1);
    await page.goto(path);
    await expect(page.locator('head meta[name="description"]')).toHaveCount(1);
  }
  await expect(page.locator("article table")).toHaveCount(2);
  await expect(page.locator("article table").first()).toContainText(
    "Self-Hosted",
  );
  await page
    .locator("header nav")
    .getByRole("link", { name: "Home", exact: true })
    .click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('head meta[name="description"]')).toHaveCount(1);
  await expect(page.locator('head meta[name="description"]')).toHaveAttribute(
    "content",
    /ByteLand Technology builds/,
  );
});

test("unknown routes return the branded 404 with a working way home", async ({
  page,
}) => {
  const response = await page.goto("/blog/this-post-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Page not found", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Back to Home", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("[data-filter-chips]")).toBeVisible();
});
