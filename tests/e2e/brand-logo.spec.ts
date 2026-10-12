import { expect, test } from "@playwright/test";

test("SDF logo preserves the static mark with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const mark = page.locator("header [data-brand-logo=sdf]");
  await expect(mark).toHaveAccessibleName("ByteLand logo");
  await expect(mark.locator("img")).toBeVisible();
  await expect(mark.locator("canvas")).toBeHidden();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  // Platforms without WebGL keep the equally usable static outline.
  await expect(mark).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(mark.locator("img")).toBeVisible();
  await expect(mark.locator("canvas")).toBeHidden();
});

test("SDF logo remains visible when WebGL is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (type === "webgl2") return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await page.goto("/");
  await expect(page.locator("header [data-brand-logo=sdf] img")).toBeVisible();
  await expect(
    page.locator("header [data-brand-logo=sdf] canvas"),
  ).toBeHidden();
});

test("SDF logo falls back on GPU loss and remains through navigation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const mark = page.locator("header [data-brand-logo=sdf]");
  await mark
    .locator("canvas")
    .dispatchEvent("webglcontextlost", { cancelable: true });
  await expect(mark.locator("img")).toBeVisible();
  await page
    .locator("header")
    .getByRole("link", { name: "Blog", exact: true })
    .click();
  await expect(page.locator("header [data-brand-logo=sdf]")).toBeVisible();
  await page.goBack();
  await expect(page.locator("header [data-brand-logo=sdf]")).toBeVisible();
});
