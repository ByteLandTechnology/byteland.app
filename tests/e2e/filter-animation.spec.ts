import { expect, test, type Page } from "@playwright/test";

const fixturePosts = Array.from({ length: 12 }, (_, index) => ({
  slug: `animation-fixture/${index + 1}`,
  title: `Animation fixture ${index + 1}`,
  date: `2026-06-${String(28 - index).padStart(2, "0")}`,
  tags: ["shared", `topic-${index + 1}`],
  author: "E2E",
  description: "Animation fixture",
  image: null,
}));

async function installBlogFixture(page: Page) {
  await page.route("**/_next/data/**/blog.json", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        pageProps: { allPosts: fixturePosts },
        __N_SSG: true,
      }),
    }),
  );
  await page.goto("/");
  await page.getByRole("link", { name: "Blog", exact: true }).first().click();
  await expect(page).toHaveURL(/\/blog$/);
  await expect(
    page.locator("[data-filter-results] [data-filter-card]"),
  ).toHaveCount(12);
}

async function armMotionSampler(page: Page) {
  await page.evaluate(() => {
    const root = window as typeof window & {
      __filterMotionSamples?: unknown[];
    };
    root.__filterMotionSamples = [];
    const row = document.querySelector<HTMLElement>("[data-filter-chips]");
    if (!row) throw new Error("Filter chip row is missing");
    row.addEventListener(
      "click",
      (event) => {
        if (
          !(event.target instanceof Element) ||
          !event.target.closest("button[data-filter]")
        )
          return;
        const started = performance.now();
        const sample = () => {
          const elapsed = performance.now() - started;
          const indicator = row.querySelector<HTMLElement>(
            "[data-filter-indicator]",
          );
          const rect = indicator?.getBoundingClientRect();
          const cards = [
            ...document.querySelectorAll<HTMLElement>(
              "[data-filter-results] [data-filter-card]",
            ),
          ];
          root.__filterMotionSamples?.push({
            elapsed,
            indicator: rect ? { x: rect.x, width: rect.width } : null,
            cards: cards.map((card) => {
              const bounds = card.getBoundingClientRect();
              const style = getComputedStyle(card);
              const transform = new DOMMatrixReadOnly(style.transform);
              const tags =
                card.closest<HTMLElement>("[data-tags]")?.dataset.tags ?? "";
              return {
                y: bounds.y,
                opacity: Number(style.opacity),
                translateY: transform.m42,
                tags,
              };
            }),
          });
          if (elapsed < 750) requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
      },
      { once: true, capture: true },
    );
  });
}

async function readMotionSamples(page: Page) {
  return page.evaluate(
    () =>
      (
        window as typeof window & {
          __filterMotionSamples?: Array<{
            elapsed: number;
            indicator: { x: number; width: number } | null;
            cards: Array<{
              y: number;
              opacity: number;
              translateY: number;
              tags: string;
            }>;
          }>;
        }
      ).__filterMotionSamples ?? [],
  );
}

async function filterRowPosition(page: Page) {
  return page.locator("[data-filter-chips]").evaluate((row) => {
    const rect = row.getBoundingClientRect();
    return { x: rect.x, y: rect.y, scrollY: window.scrollY };
  });
}

async function expectNoChipDotOrReservedGap(page: Page) {
  const metrics = await page
    .locator("[data-filter-chips] button[data-filter]")
    .evaluateAll((buttons) =>
      buttons.map((button) => {
        const label = [...button.children].find(
          (child) => child.textContent?.trim() === button.textContent?.trim(),
        );
        if (!label) return { valid: false, children: -1, labelGap: Number.NaN };
        const buttonStyle = getComputedStyle(button);
        const buttonRect = button.getBoundingClientRect();
        const labelRect = label.getBoundingClientRect();
        const expectedLeft =
          buttonRect.left +
          Number.parseFloat(buttonStyle.borderLeftWidth) +
          Number.parseFloat(buttonStyle.paddingLeft);
        const extraChildren = [...button.children].filter(
          (child) =>
            child !== label && !child.hasAttribute("data-filter-indicator"),
        );
        return {
          valid: label.children.length === 0 && extraChildren.length === 0,
          children: label.children.length + extraChildren.length,
          labelGap: labelRect.left - expectedLeft,
        };
      }),
    );
  expect(metrics.length).toBeGreaterThan(1);
  expect(
    metrics.every((entry) => entry.valid && Math.abs(entry.labelGap) <= 1),
    JSON.stringify(metrics),
  ).toBeTruthy();
}

test("normal motion moves the chip indicator without dot reservation, then settles", async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const row = page.locator("[data-filter-chips]");
  const target = row.locator('button[data-filter="layout"]');
  await expect(page.locator("[data-filter-indicator]")).toBeVisible();
  await expect(
    page.locator("[data-filter-results] [data-filter-card]").first(),
  ).toBeVisible();
  await expectNoChipDotOrReservedGap(page);
  await row.scrollIntoViewIfNeeded();
  const rowBefore = await filterRowPosition(page);
  await armMotionSampler(page);
  await target.click();
  await expect(target).toHaveAttribute("aria-pressed", "true");
  await page.waitForTimeout(800);

  const samples = await readMotionSamples(page);
  const initial = await row
    .locator('button[data-filter="all"]')
    .evaluate((button) => {
      const rect = button.getBoundingClientRect();
      return { x: rect.x, width: rect.width };
    });
  const targetRect = await target.evaluate((button) => {
    const rect = button.getBoundingClientRect();
    return { x: rect.x, width: rect.width };
  });
  expect(samples.length).toBeGreaterThan(5);
  const trajectory = samples.filter(
    (sample) => sample.elapsed <= 300 && sample.indicator !== null,
  );
  const intermediate = trajectory.filter(
    (sample) =>
      Math.abs(sample.indicator!.x - initial.x) > 2 &&
      Math.abs(sample.indicator!.x - targetRect.x) > 2,
  );
  expect(
    intermediate.length,
    "the indicator should occupy a visible in-between position during its trajectory",
  ).toBeGreaterThan(0);
  const firstPosition = trajectory[0]?.indicator?.x;
  const latestPosition = trajectory.at(-1)?.indicator?.x;
  expect(firstPosition).toBeDefined();
  expect(latestPosition).toBeDefined();
  expect(Math.abs(latestPosition! - targetRect.x)).toBeLessThan(
    Math.abs(firstPosition! - targetRect.x),
  );

  const settled = samples.filter((sample) => sample.elapsed >= 600).slice(-5);
  expect(settled.length).toBeGreaterThanOrEqual(3);
  const settledIndicatorXs = settled.map(
    (sample) => sample.indicator?.x ?? Number.NaN,
  );
  expect(
    Math.max(...settledIndicatorXs) - Math.min(...settledIndicatorXs),
  ).toBeLessThanOrEqual(1);
  expect(
    Math.abs(settledIndicatorXs.at(-1)! - targetRect.x),
  ).toBeLessThanOrEqual(2);

  const rowAfter = await filterRowPosition(page);
  expect(Math.abs(rowAfter.x - rowBefore.x)).toBeLessThanOrEqual(2);
  expect(Math.abs(rowAfter.y - rowBefore.y)).toBeLessThanOrEqual(2);
  expect(Math.abs(rowAfter.scrollY - rowBefore.scrollY)).toBeLessThanOrEqual(2);
  expect(pageErrors).toEqual([]);
  await test.info().attach("home-normal-filter-motion.json", {
    body: Buffer.from(
      JSON.stringify({ samples, rowBefore, rowAfter }, null, 2),
    ),
    contentType: "application/json",
  });
});

test("retained blog cards do not replay; new cards fade in gently", async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await installBlogFixture(page);
  const row = page.locator("[data-filter-chips]");
  const target = row.locator('button[data-filter="topic-12"]');
  await expectNoChipDotOrReservedGap(page);
  await row.scrollIntoViewIfNeeded();
  const before = await filterRowPosition(page);
  await target.click();
  await expect(target).toHaveAttribute("aria-pressed", "true");
  const retained = page.locator("[data-filter-results] [data-filter-card]");
  await expect(retained).toHaveCount(1);
  await expect
    .poll(() =>
      retained.evaluate(
        (card) => card.closest<HTMLElement>("[data-tags]")?.dataset.tags ?? "",
      ),
    )
    .toContain("topic-12");
  await page.waitForTimeout(300);

  await armMotionSampler(page);
  await row.locator('button[data-filter="all"]').click();
  await expect(row.locator('button[data-filter="all"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(
    page.locator("[data-filter-results] [data-filter-card]"),
  ).toHaveCount(12);
  await page.waitForTimeout(300);
  const samples = await readMotionSamples(page);
  const retainedSamples = samples.flatMap((sample) =>
    sample.cards.filter((card) => card.tags.includes("topic-12")),
  );
  expect(retainedSamples.length).toBeGreaterThan(0);
  expect(
    retainedSamples.every(
      (card) => card.opacity >= 0.999 && Math.abs(card.translateY) <= 0.5,
    ),
    JSON.stringify(retainedSamples),
  ).toBeTruthy();

  const newCardFading = samples.some(
    (sample) =>
      sample.elapsed >= 0 &&
      sample.elapsed <= 180 &&
      sample.cards.some(
        (card) =>
          !card.tags.includes("topic-12") &&
          card.opacity > 0.65 &&
          card.opacity < 0.999 &&
          Math.abs(card.translateY) <= 0.5,
      ),
  );
  expect(
    newCardFading,
    "new cards should fade in without a vertical entrance translation",
  ).toBeTruthy();
  const settled = samples.filter((sample) => sample.elapsed >= 240).slice(-5);
  expect(settled.length).toBeGreaterThanOrEqual(3);
  expect(
    settled.every((sample) =>
      sample.cards.every(
        (card) => card.opacity >= 0.999 && Math.abs(card.translateY) <= 0.5,
      ),
    ),
  ).toBeTruthy();
  const after = await filterRowPosition(page);
  expect(Math.abs(after.x - before.x)).toBeLessThanOrEqual(2);
  expect(
    Math.abs(after.y - before.y),
    `blog controls moved: ${JSON.stringify({ before, after })}`,
  ).toBeLessThanOrEqual(2);
  expect(Math.abs(after.scrollY - before.scrollY)).toBeLessThanOrEqual(2);
  expect(pageErrors).toEqual([]);
  await test.info().attach("blog-normal-filter-motion.json", {
    body: Buffer.from(JSON.stringify({ samples, before, after }, null, 2)),
    contentType: "application/json",
  });
});

test("switching to reduced motion cancels an in-progress new-card fade", async ({
  page,
}) => {
  await installBlogFixture(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const row = page.locator("[data-filter-chips]");
  const retainedButton = row.locator('button[data-filter="topic-12"]');
  await retainedButton.click();
  await expect(
    page.locator("[data-filter-results] [data-filter-card]"),
  ).toHaveCount(1);
  await page.waitForTimeout(300);
  await row
    .locator('button[data-filter="all"]')
    .evaluate((button: HTMLButtonElement) => button.click());
  await expect(
    page.locator("[data-filter-results] [data-filter-card]"),
  ).toHaveCount(12);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document
            .getAnimations()
            .filter((animation) => animation.playState === "running").length,
      ),
    )
    .toBe(0);
  const cards = await page
    .locator("[data-filter-results] [data-filter-card]")
    .evaluateAll((elements) =>
      elements.map((element) => ({
        opacity: Number(getComputedStyle(element).opacity),
        transform: getComputedStyle(element).transform,
      })),
    );
  expect(
    cards.every(
      (card) =>
        card.opacity >= 0.999 &&
        (card.transform === "none" ||
          Math.abs(new DOMMatrixReadOnly(card.transform).m42) <= 0.5),
    ),
  ).toBeTruthy();
});

test("reduced motion applies the final filter state immediately", async ({
  page,
}) => {
  await installBlogFixture(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const row = page.locator("[data-filter-chips]");
  const target = row.locator('button[data-filter="topic-12"]');
  await expect(
    page.locator("[data-filter-results] [data-filter-card]"),
  ).toHaveCount(12);
  await row.scrollIntoViewIfNeeded();
  const before = await filterRowPosition(page);
  await armMotionSampler(page);
  await target.click();
  await expect(target).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.locator("[data-filter-results] [data-filter-card]"),
  ).toHaveCount(1);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  const samples = await readMotionSamples(page);
  const targetRect = await target.evaluate((button) => {
    const rect = button.getBoundingClientRect();
    return { x: rect.x, width: rect.width };
  });
  const indicator = await page.locator("[data-filter-indicator]").boundingBox();
  expect(indicator).not.toBeNull();
  expect(Math.abs(indicator!.x - targetRect.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(indicator!.width - targetRect.width)).toBeLessThanOrEqual(2);
  expect(
    samples
      .filter((sample) => sample.elapsed <= 180)
      .every(
        (sample) =>
          sample.indicator !== null &&
          Math.abs(sample.indicator.x - targetRect.x) <= 1 &&
          sample.cards.every(
            (card) => Math.abs(card.translateY) <= 0.5 && card.opacity >= 0.999,
          ),
      ),
  ).toBeTruthy();
  const after = await filterRowPosition(page);
  expect(Math.abs(after.x - before.x)).toBeLessThanOrEqual(2);
  expect(Math.abs(after.y - before.y)).toBeLessThanOrEqual(2);
  expect(Math.abs(after.scrollY - before.scrollY)).toBeLessThanOrEqual(2);
});

test("rapid filter changes finish on the latest choice without a queued follow-up", async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await installBlogFixture(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const row = page.locator("[data-filter-chips]");
  await row.scrollIntoViewIfNeeded();
  const before = await filterRowPosition(page);
  const sequence = ["topic-2", "shared", "topic-8", "topic-4"];
  for (const filter of sequence) {
    await row
      .locator(`button[data-filter="${filter}"]`)
      .evaluate((button: HTMLButtonElement) => button.click());
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
    );
  }
  const finalChoice = row.locator('button[data-filter="topic-4"]');
  await expect(finalChoice).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.locator("[data-filter-results] [data-filter-card]"),
  ).toHaveCount(1);
  await expect(
    page.locator("[data-filter-results] [data-filter-card]"),
  ).toContainText("Animation fixture 4");
  await page.waitForTimeout(700);
  const afterSettle = await filterRowPosition(page);
  expect(Math.abs(afterSettle.x - before.x)).toBeLessThanOrEqual(2);
  expect(Math.abs(afterSettle.y - before.y)).toBeLessThanOrEqual(2);
  expect(Math.abs(afterSettle.scrollY - before.scrollY)).toBeLessThanOrEqual(2);
  await expect(finalChoice).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.locator("[data-filter-results] [data-filter-card]"),
  ).toHaveCount(1);
  expect(pageErrors).toEqual([]);
});
