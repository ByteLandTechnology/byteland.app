import { expect, test, type Locator, type Page } from "@playwright/test";
import { writeFile } from "node:fs/promises";

type MotionSetting = "reduce" | "no-preference";

const fixturePosts = Array.from({ length: 28 }, (_, index) => {
  const title = `Fixture article ${String(index + 1).padStart(2, "0")}`;
  const uniqueTag = `topic-${String(index + 1).padStart(2, "0")}`;
  return {
    slug: `test/${index + 1}`,
    title,
    date: `2025-12-${String(28 - index).padStart(2, "0")}`,
    tags: [...(index < 27 ? ["shared"] : []), uniqueTag],
    author: "E2E",
    description: "fixture",
    image: null,
  };
});

async function installBlogFixture(page: Page, posts: typeof fixturePosts) {
  await page.route("**/_next/data/**/blog.json", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ pageProps: { allPosts: posts }, __N_SSG: true }),
    });
  });
  await page.goto("/");
  await page
    .locator("header")
    .getByRole("link", { name: "Blog", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/blog$/);
}

async function openFilterPage(page: Page, path: string, motion: MotionSetting) {
  await page.emulateMedia({ reducedMotion: motion });
  await page.goto(path);
  await expect(page.locator("[data-filter-chips]")).toBeVisible();
}

async function chipRowMetrics(row: Locator) {
  return row.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
      spacerHeight:
        document.querySelector("[data-filter-spacer]")?.getBoundingClientRect()
          .height ?? 0,
      scrollHeight: document.documentElement.scrollHeight,
      innerHeight: window.innerHeight,
      scrollY: window.scrollY,
    };
  });
}

for (const motion of ["reduce", "no-preference"] as const) {
  for (const [path, label] of [
    ["/", "projects"],
    ["/blog", "blog"],
  ] as const) {
    test(`@baseline ${label} filters select, stay in place, and expose correct results (${motion})`, async ({
      page,
    }) => {
      await openFilterPage(page, path, motion);
      const row = page.locator("[data-filter-chips]");
      await row.scrollIntoViewIfNeeded();
      const metricsBefore = await chipRowMetrics(row);
      await expect(page.locator("[data-filter-spacer]")).toHaveCount(1);
      const chips = row.locator("button[data-filter]");
      await expect(chips.first()).toHaveAttribute("aria-pressed", "true");
      const second = chips.nth(1);
      await second.click();
      await expect(second).toHaveAttribute("aria-pressed", "true");
      await expect(page.locator("[data-filter-results]")).toBeVisible();
      const afterSelect = await chipRowMetrics(row);
      expect(Math.abs(afterSelect.x - metricsBefore.x)).toBeLessThanOrEqual(2);
      expect(Math.abs(afterSelect.y - metricsBefore.y)).toBeLessThanOrEqual(2);
      expect(afterSelect.scrollY).toBe(metricsBefore.scrollY);

      for (let i = 0; i < 5; i += 1) {
        await chips.nth(i % (await chips.count())).click();
      }
      const finalMetrics = await chipRowMetrics(row);
      expect(Math.abs(finalMetrics.x - metricsBefore.x)).toBeLessThanOrEqual(2);
      expect(Math.abs(finalMetrics.y - metricsBefore.y)).toBeLessThanOrEqual(2);
      expect(finalMetrics.scrollY).toBe(metricsBefore.scrollY);
      await test.info().attach(`${label}-${motion}-chip-geometry.json`, {
        body: Buffer.from(
          JSON.stringify(
            {
              before: metricsBefore,
              afterSelection: afterSelect,
              afterRapidSelections: finalMetrics,
            },
            null,
            2,
          ),
        ),
        contentType: "application/json",
      });
    });

    test(`${label} filter row supports keyboard and horizontal scrolling (${motion})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await openFilterPage(page, path, motion);
      const row = page.locator("[data-filter-chips]");
      const chips = row.locator("button[data-filter]");
      await chips.nth(1).focus();
      await page.keyboard.press("Space");
      await expect(chips.nth(1)).toHaveAttribute("aria-pressed", "true");
      await chips.nth(2).focus();
      await page.keyboard.press("Enter");
      await expect(chips.nth(2)).toHaveAttribute("aria-pressed", "true");
      await expect
        .poll(() =>
          row.evaluate((element) => element.scrollWidth > element.clientWidth),
        )
        .toBeTruthy();
      await row.evaluate((element) => {
        element.scrollLeft = element.scrollWidth;
      });
      await expect
        .poll(() => row.evaluate((element) => element.scrollLeft))
        .toBeGreaterThan(0);
    });
  }
}

test("blog tag filter fixture covers multiple results without changing public posts", async ({
  page,
}) => {
  await installBlogFixture(page, fixturePosts);
  const row = page.locator("[data-filter-chips]");
  await expect(row.locator("button[data-filter]")).toHaveCount(30);
  await row.locator('button[data-filter="shared"]').click();
  await expect(page.locator("[data-filter-results] [data-tags]")).toHaveCount(
    27,
  );
  await row.locator('button[data-filter="topic-28"]').click();
  await expect(page.locator("[data-filter-results] [data-tags]")).toHaveCount(
    1,
  );
  await row.locator('button[data-filter="all"]').click();
  await expect(page.locator("[data-filter-results] [data-tags]")).toHaveCount(
    28,
  );
});

test("empty blog fixture renders its empty state without exposing filter controls", async ({
  page,
}) => {
  await installBlogFixture(page, []);
  await expect(page.locator("[data-filter-chips]")).toHaveCount(0);
  await expect(page.locator("[data-filter-results]")).toContainText(
    "No posts yet.",
  );
});

test("@baseline home filter keeps its control position at top, middle, and near page end", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const row = page.locator("[data-filter-chips]");
  await expect(row).toBeVisible();
  await expect(page.locator("[data-filter-spacer]")).toHaveCount(1);
  const initialLayout = await row.evaluate((element) => ({
    documentHeight: document.documentElement.scrollHeight,
    documentTop: element.getBoundingClientRect().top + window.scrollY,
  }));
  const tallViewport = Math.max(
    900,
    Math.ceil(initialLayout.documentHeight - initialLayout.documentTop + 200),
  );
  await page.setViewportSize({ width: 1280, height: tallViewport });
  const positions: Array<{
    label: string;
    before: Awaited<ReturnType<typeof chipRowMetrics>>;
    after: Awaited<ReturnType<typeof chipRowMetrics>>;
  }> = [];

  for (const label of ["top", "middle", "near-bottom"] as const) {
    await page
      .locator('[data-filter="all"]')
      .evaluate((button: HTMLButtonElement) => button.click());
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
    );
    const expectedY = await page.evaluate((position) => {
      const max = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const top =
        position === "top"
          ? 0
          : position === "middle"
            ? Math.floor(max / 2)
            : max;
      window.scrollTo({ top, behavior: "instant" });
      return window.scrollY;
    }, label);
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBe(expectedY);
    const before = await chipRowMetrics(row);
    expect(before.y).toBeGreaterThanOrEqual(0);
    expect(before.y + before.height).toBeLessThanOrEqual(tallViewport);
    const chipCount = await row.locator("button[data-filter]").count();
    const sequence = [1, 2, 3, 0, 1, 3, 2, 1].map((index) => index % chipCount);
    const samples = [];
    for (const index of sequence) {
      await row
        .locator("button[data-filter]")
        .nth(index)
        .evaluate((button: HTMLButtonElement) => button.click());
      await page.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => resolve()),
          ),
      );
      await expect(
        row.locator("button[data-filter]").nth(index),
      ).toHaveAttribute("aria-pressed", "true");
      const sample = await chipRowMetrics(row);
      expect(Math.abs(sample.x - before.x)).toBeLessThanOrEqual(2);
      expect(Math.abs(sample.y - before.y)).toBeLessThanOrEqual(2);
      expect(Math.abs(sample.scrollY - before.scrollY)).toBeLessThanOrEqual(2);
      if (sample.spacerHeight > 0) {
        expect(
          Math.abs(sample.scrollHeight - (sample.scrollY + sample.innerHeight)),
        ).toBeLessThanOrEqual(2);
      }
      samples.push(sample);
    }
    positions.push({ label, before, after: samples.at(-1)! });
  }
  await test.info().attach("home-chip-position-by-scroll-position.json", {
    body: Buffer.from(JSON.stringify(positions, null, 2)),
    contentType: "application/json",
  });
});

test("reduced motion disables chip CSS motion and changes immediately at runtime", async ({
  page,
}) => {
  await openFilterPage(page, "/", "no-preference");
  const row = page.locator("[data-filter-chips]");
  const button = row.locator("button[data-filter]").nth(1);
  await button.hover();
  const regular = await button.evaluate(
    (element) => getComputedStyle(element).transitionDuration,
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(() =>
      button.evaluate(
        (element) => getComputedStyle(element).transitionDuration,
      ),
    )
    .not.toBe(regular);
  const reduced = await button.evaluate((element) => ({
    transition: getComputedStyle(element).transitionDuration,
    animation: getComputedStyle(element).animationName,
  }));
  expect(
    reduced.transition
      .split(",")
      .every((duration) => Number.parseFloat(duration) === 0),
  ).toBeTruthy();
  expect(reduced.animation).toBe("none");
  await button.click();
  await expect(button).toHaveAttribute("aria-pressed", "true");
});

test("reduced motion pauses SVG motion, removes video, and leaves no active WAAPI motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => page.locator("video").count()).toBe(0);
  const smil = await page.locator("svg").evaluateAll((svgs) => {
    const roots = svgs.filter((svg) =>
      svg.querySelector("animate, animateTransform, animateMotion, set"),
    );
    return {
      count: roots.length,
      allPaused: roots.every((svg) =>
        (svg as SVGSVGElement).animationsPaused(),
      ),
    };
  });
  expect(smil.count).toBeGreaterThan(0);
  await expect
    .poll(() =>
      page
        .locator("svg")
        .evaluateAll((svgs) =>
          svgs
            .filter((svg) =>
              svg.querySelector(
                "animate, animateTransform, animateMotion, set",
              ),
            )
            .every((svg) => (svg as SVGSVGElement).animationsPaused()),
        ),
    )
    .toBeTruthy();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.documentElement
            .getAnimations({ subtree: true })
            .filter((animation) => animation.playState === "running").length,
      ),
    )
    .toBe(0);
});

test("mobile menu Escape closes menu and restores trigger focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open menu" });
  await trigger.click();
  await expect(
    page.getByRole("button", { name: "Close menu" }),
  ).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  await expect(
    page
      .getByRole("navigation")
      .filter({ has: page.getByRole("link", { name: "Blog" }) })
      .last(),
  ).toBeHidden();
});

test("hash and browser history navigation remain functional under reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#projects");
  await expect(page).toHaveURL(/#projects$/);
  const projectScrollY = await page.evaluate(() => window.scrollY);
  expect(projectScrollY).toBeGreaterThan(0);
  await page
    .locator("header")
    .getByRole("link", { name: "Blog", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/blog$/);
  await page.goBack();
  await expect(page).toHaveURL(/#projects$/);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeCloseTo(projectScrollY, 0);
});

test("video media failures keep fallback artwork visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.route("**/videos/**", (route) => route.abort());
  const mediaRequest = page.waitForRequest((request) =>
    request.url().includes("/videos/"),
  );
  await page.goto("/");
  await mediaRequest;
  const wrapper = page.locator("[data-video]").first();
  await expect(wrapper).toBeVisible();
  await expect(wrapper.locator("video")).toHaveCount(0);
  await expect(wrapper.locator("svg").first()).toBeVisible();
});

test("@perf warm Chromium home and blog chip click-to-frame P95 stays below 100 ms", async ({
  page,
  browserName,
}, testInfo) => {
  test.skip(
    browserName !== "chromium",
    "Performance budget is fixed to Chromium.",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  const reports = [];
  for (const path of ["/", "/blog"]) {
    await page.goto(path);
    const chips = page.locator("[data-filter-chips] button[data-filter]");
    const count = await chips.count();
    for (let i = 0; i < 5; i += 1) await chips.nth((i + 1) % count).click();
    await chips.nth(0).click();
    await expect(chips.nth(0)).toHaveAttribute("aria-pressed", "true");
    await page.evaluate(() => {
      const target = window as typeof window & {
        __chipFrameSamples?: number[];
      };
      target.__chipFrameSamples = [];
      document.addEventListener(
        "click",
        (event) => {
          if (
            !(event.target instanceof Element) ||
            !event.target.closest("[data-filter-chips] button[data-filter]")
          )
            return;
          const started = performance.now();
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              target.__chipFrameSamples?.push(performance.now() - started);
            }),
          );
        },
        true,
      );
    });
    for (let i = 0; i < 30; i += 1) {
      const index = (i + 1) % count;
      await chips.nth(index).click();
      await expect(chips.nth(index)).toHaveAttribute("aria-pressed", "true");
      const filter = await chips.nth(index).getAttribute("data-filter");
      if (path === "/" && filter !== "all") {
        await expect(
          page.locator(`[data-filter-results] [data-group="${filter}"]`),
        ).toHaveCount(1);
      } else if (path === "/blog" && filter !== "all") {
        const matches = await page
          .locator("[data-filter-results] [data-tags]")
          .evaluateAll(
            (cards, tag) =>
              cards.filter((card) =>
                (card.getAttribute("data-tags") ?? "")
                  .split("|")
                  .includes(tag as string),
              ).length,
            filter,
          );
        expect(matches).toBeGreaterThan(0);
      } else {
        const allRows =
          path === "/"
            ? page.locator("[data-filter-results] [data-group]")
            : page.locator("[data-filter-results] [data-tags]");
        await expect(allRows).toHaveCount(path === "/" ? 4 : 4);
      }
      await expect
        .poll(() =>
          page.evaluate(
            () =>
              (window as typeof window & { __chipFrameSamples?: number[] })
                .__chipFrameSamples?.length ?? 0,
          ),
        )
        .toBe(i + 1);
    }
    const samples = await page.evaluate(
      () =>
        (window as typeof window & { __chipFrameSamples?: number[] })
          .__chipFrameSamples ?? [],
    );
    const sorted = [...samples].sort((a, b) => a - b);
    const p95 = sorted[Math.ceil(sorted.length * 0.95) - 1];
    reports.push({
      page: path,
      samplesMs: samples,
      p95Ms: p95,
      metric:
        "click-handler-to-second-requestAnimationFrame proxy (not a display paint measurement)",
    });
    expect(p95).toBeLessThan(100);
  }
  const performancePath = testInfo.outputPath(
    "chip-switching-performance.json",
  );
  await writeFile(
    performancePath,
    JSON.stringify(
      { browser: browserName, motion: "reduce", reports },
      null,
      2,
    ),
  );
  await testInfo.attach("chip-switching-performance.json", {
    path: performancePath,
    contentType: "application/json",
  });
});
