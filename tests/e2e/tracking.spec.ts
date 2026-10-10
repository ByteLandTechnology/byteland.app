import { expect, test } from "@playwright/test";

type TrackingCall = [string, string, Record<string, unknown>?];

async function installGtagStub(page: import("@playwright/test").Page) {
  await page.evaluate(() => {
    const trackingWindow = window as Window & {
      __trackingCalls?: TrackingCall[];
      gtag?: (...args: TrackingCall) => void;
    };
    trackingWindow.__trackingCalls = [];
    trackingWindow.gtag = (...args) =>
      trackingWindow.__trackingCalls?.push(args);
  });
}

test("page tracking records the initial route when gtag is already available", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const trackingWindow = window as Window & {
      __trackingCalls?: TrackingCall[];
      gtag?: (...args: TrackingCall) => void;
    };
    trackingWindow.__trackingCalls = [];
    trackingWindow.gtag = (...args) =>
      trackingWindow.__trackingCalls?.push(args);
  });
  await page.goto("/");

  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as Window & { __trackingCalls?: TrackingCall[] }
          ).__trackingCalls?.filter(
            ([command, id, config]) =>
              command === "config" &&
              id === "G-M02B2FCL1G" &&
              config?.page_path === "/",
          ).length ?? 0,
      ),
    )
    .toBe(1);
});

test("page tracking subscribes before gtag becomes available", async ({
  page,
}) => {
  await page.goto("/");
  await installGtagStub(page);

  await page
    .locator("header nav")
    .getByRole("link", { name: "Blog", exact: true })
    .click();
  await expect(page).toHaveURL(/\/blog$/);
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as Window & { __trackingCalls?: TrackingCall[] }
          ).__trackingCalls?.filter(
            ([command, id, config]) =>
              command === "config" &&
              id === "G-M02B2FCL1G" &&
              config?.page_path === "/blog",
          ).length ?? 0,
      ),
    )
    .toBe(1);
});
