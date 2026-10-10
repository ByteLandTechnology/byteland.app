import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";

const tinyWebm = readFileSync(
  path.resolve(process.cwd(), "tests/fixtures/tiny-motion.webm"),
);

async function useValidVideo(page: Page) {
  await page.route("**/videos/**", async (route) => {
    if (route.request().url().endsWith(".webm")) {
      await route.fulfill({
        status: 200,
        contentType: "video/webm",
        headers: { "accept-ranges": "bytes" },
        body: tinyWebm,
      });
      return;
    }
    await route.abort();
  });
}

async function waitForPlaying(page: Page) {
  const video = page.locator('[data-video="hero"] video');
  await expect(video).toHaveCount(1);
  await expect
    .poll(() =>
      video.evaluate(
        (element: HTMLVideoElement) =>
          !element.paused &&
          element.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA,
      ),
    )
    .toBeTruthy();
  return video;
}

test("video overlays and pauses fallback art, then pauses offscreen and resumes", async ({
  page,
}) => {
  await useValidVideo(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");

  const wrapper = page.locator('[data-video="hero"]');
  const video = await waitForPlaying(page);
  const art = wrapper.locator("svg").first();
  await expect(wrapper).toHaveAttribute("data-motion-overlay", "video");
  await expect
    .poll(() =>
      art.evaluate((svg) => (svg as SVGSVGElement).animationsPaused()),
    )
    .toBeTruthy();

  await page.evaluate(() =>
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    }),
  );
  await expect
    .poll(() => video.evaluate((element: HTMLVideoElement) => element.paused))
    .toBeTruthy();

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect
    .poll(() => video.evaluate((element: HTMLVideoElement) => !element.paused))
    .toBeTruthy();
  await expect(wrapper).toHaveAttribute("data-motion-overlay", "video");
  await expect
    .poll(() =>
      art.evaluate((svg) => (svg as SVGSVGElement).animationsPaused()),
    )
    .toBeTruthy();
});

test("video responds to background visibility and reduced-motion changes", async ({
  page,
}) => {
  await useValidVideo(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");

  const wrapper = page.locator('[data-video="hero"]');
  const video = await waitForPlaying(page);
  const art = wrapper.locator("svg").first();

  // Playwright does not move a tab to the operating-system background. Shadow
  // document.hidden and dispatch the same event to exercise the component path.
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect
    .poll(() => video.evaluate((element: HTMLVideoElement) => element.paused))
    .toBeTruthy();

  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect
    .poll(() => video.evaluate((element: HTMLVideoElement) => !element.paused))
    .toBeTruthy();

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(wrapper.locator("video")).toHaveCount(0);
  await expect
    .poll(() =>
      art.evaluate((svg) => (svg as SVGSVGElement).animationsPaused()),
    )
    .toBeTruthy();

  await page.emulateMedia({ reducedMotion: "no-preference" });
  const resumedVideo = await waitForPlaying(page);
  await expect(wrapper).toHaveAttribute("data-motion-overlay", "video");
  await expect
    .poll(() =>
      art.evaluate((svg) => (svg as SVGSVGElement).animationsPaused()),
    )
    .toBeTruthy();
  await expect
    .poll(() =>
      resumedVideo.evaluate((element: HTMLVideoElement) => !element.paused),
    )
    .toBeTruthy();
});
