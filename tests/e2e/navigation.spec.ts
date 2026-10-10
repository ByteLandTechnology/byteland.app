import { expect, test } from "@playwright/test";

test("back navigation restores the previous route's scroll position", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();

  const homeY = await page.evaluate(() => {
    const max = Math.max(
      0,
      document.documentElement.scrollHeight - innerHeight,
    );
    const y = Math.min(520, Math.floor(max / 2));
    window.scrollTo({ top: y, behavior: "instant" });
    return window.scrollY;
  });
  expect(homeY).toBeGreaterThan(0);

  await page
    .locator("header nav")
    .getByRole("link", { name: "Blog", exact: true })
    .click();
  await expect(page).toHaveURL(/\/blog$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

  await page.evaluate(() => window.scrollTo({ top: 240, behavior: "instant" }));
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect
    .poll(() =>
      page.evaluate((expectedY) => Math.abs(window.scrollY - expectedY), homeY),
    )
    .toBeLessThanOrEqual(2);
});

test("same-page hash navigation accounts for the fixed header", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => {
    const target = document.createElement("div");
    target.id = "navigation-hash-target";
    target.style.height = "1px";
    const spacer = document.createElement("div");
    spacer.style.height = `${window.innerHeight * 2}px`;
    document.body.append(target, spacer);

    const link = document.createElement("a");
    link.href = "#navigation-hash-target";
    link.textContent = "Jump to test target";
    link.style.cssText = "position:fixed;left:8px;top:8px;z-index:1000";
    document.body.prepend(link);
    link.click();
  });

  await expect(page).toHaveURL(/#navigation-hash-target$/);
  await expect
    .poll(() =>
      page
        .locator("#navigation-hash-target")
        .evaluate((element) =>
          Math.abs(element.getBoundingClientRect().top - 64),
        ),
    )
    .toBeLessThanOrEqual(2);
});

test("rapid route pushes leave the latest destination and clear transition state", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  test.skip(
    !(await page.evaluate(() => "startViewTransition" in document)),
    "View Transition API is unavailable in this browser",
  );

  const target = "/opensource/taffy-layout";
  await page.evaluate((destination) => {
    const dispatchClick = (link: HTMLAnchorElement | null | undefined) => {
      if (!link) throw new Error("Expected navigation link was not found");
      link.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          button: 0,
        }),
      );
    };
    const blogLink = [
      ...document.querySelectorAll<HTMLAnchorElement>("a"),
    ].find((link) => link.textContent?.trim() === "Blog");
    const projectLink = document.querySelector<HTMLAnchorElement>(
      `a[href="${destination}"]`,
    );
    dispatchClick(blogLink);
    dispatchClick(projectLink);
  }, target);

  await expect(page).toHaveURL(new RegExp(`${target.replaceAll("/", "\\/")}$`));
  await expect(page.locator("h1")).toContainText("taffy-layout");
  await expect
    .poll(() => page.locator("html").getAttribute("data-view-transition"))
    .toBeNull();
  await page.waitForTimeout(400);
  await expect(page).toHaveURL(new RegExp(`${target.replaceAll("/", "\\/")}$`));
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-view-transition",
    "active",
  );
});

test("changing to reduced motion during a route transition clears its active marker", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  test.skip(
    !(await page.evaluate(() => "startViewTransition" in document)),
    "View Transition API is unavailable in this browser",
  );
  await page
    .locator("header nav")
    .getByRole("link", { name: "Blog", exact: true })
    .click();
  await expect(page).toHaveURL(/\/blog$/);
  await expect(page.locator("html")).toHaveAttribute(
    "data-view-transition",
    "active",
  );

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-view-transition",
    "active",
  );
});

test("a pending route still navigates when reduced motion changes before its snapshot callback", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    const documentWithTransition = document as unknown as {
      startViewTransition?: (callback: () => Promise<void>) => {
        updateCallbackDone: Promise<void>;
        finished: Promise<void>;
        skipTransition: () => void;
      };
    };
    documentWithTransition.startViewTransition = (callback) => {
      let finishUpdate!: () => void;
      let finishTransition!: () => void;
      const updateCallbackDone = new Promise<void>((resolve) => {
        finishUpdate = resolve;
      });
      const finished = new Promise<void>((resolve) => {
        finishTransition = resolve;
      });
      Object.assign(window, {
        runPendingViewTransitionUpdate: () => {
          void callback().then(finishUpdate, finishUpdate);
        },
      });
      return {
        updateCallbackDone,
        finished,
        skipTransition: finishTransition,
      };
    };
  });
  await page.goto("/");
  await page
    .locator("header nav")
    .getByRole("link", { name: "Blog", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-view-transition",
    "active",
  );

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-view-transition",
    "active",
  );
  await page.evaluate(() => {
    (
      window as Window & { runPendingViewTransitionUpdate?: () => void }
    ).runPendingViewTransitionUpdate?.();
  });
  await expect(page).toHaveURL(/\/blog$/);
});

test("closing the mobile navigation immediately removes its links from tab order", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");

  const trigger = page.getByRole("button", { name: "Open menu" });
  await trigger.click();
  const navigation = page.locator("#mobile-site-navigation");
  await expect(navigation).toBeVisible();
  await page.getByRole("button", { name: "Close menu" }).click();

  await expect
    .poll(() =>
      page.evaluate(() => {
        const element = document.getElementById("mobile-site-navigation");
        return (
          !element ||
          (element.inert && element.getAttribute("aria-hidden") === "true")
        );
      }),
    )
    .toBe(true);
  await page.keyboard.press("Tab");
  expect(
    await page.evaluate(
      () => document.activeElement?.closest("#mobile-site-navigation") !== null,
    ),
  ).toBe(false);
});
