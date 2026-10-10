# Motion and filter browser checks

These end-to-end checks run against the production Next.js static export; they do not run against `next dev`. Build first with `npm run build`, then run `npm run test:e2e`. The default script excludes `@perf` to keep broad cross-browser runs from adding timing noise. The Playwright server helper serves the existing `out/` files with Node built-ins and adds no runtime dependency. Tests cover Chromium, Firefox, and WebKit. `npm run test:e2e:baseline` runs the Chromium cases tagged `@baseline`; `npm run test:e2e:perf` runs the fixed Chromium timing case serially.

The home project filters and baseline blog tag filters use the repository's actual static content. Dedicated blog fixtures intercept the static export's `/_next/data/.../blog.json` client navigation payload; one fixture has 28 posts with shared and unique tags, including a one-result filter, and an empty fixture checks the empty-state rendering. The fixtures never modify public posts or exported files.

The filter assertions use `data-filter-chips`, `data-filter-results`, and `data-filter-spacer` as stable test hooks. E2E checks chip row x/y and `scrollY` within 2 CSS px at top, middle, and near the end of the home page, sampling one animation frame after each immediate selection. If the trailing spacer is nonzero, its final document height must be minimal: `scrollHeight` must match `scrollY + innerHeight` within 2 CSS px. A zero spacer is accepted when natural content already preserves the viewport. Geometry and natural `scrollHeight` metrics are attached as JSON for each page and motion preference. A 390px-wide viewport must produce a horizontally scrollable chip row on both pages.

The performance case warms five interactions on each page, then measures 30 reduced-motion chip selections per page, including All-to-category/remount cases, from the browser click handler to the second `requestAnimationFrame` callback. Each sample also verifies selected state and that the matching result group/cards are present. This is a frame proxy, not proof that pixels reached the display. It writes the per-click samples and P95 to a JSON attachment and requires P95 below 100 ms. Run on the same machine and browser build with one worker for comparisons; this guard complements a DevTools trace and frame-time profile. Runtime preference changes also check that active Web Animations stop, SVG SMIL is paused, and video elements are removed.

There is no before-change browser trace: implementation work was already in progress when browser testing was added, and the checked-in tree did not have a usable production export. The `@baseline` label identifies the current repeatable browser baseline only; compare future revisions against its attached geometry and timing data without claiming a measured before/after gain.

Before running, install the browser engines once with `npx playwright install chromium firefox webkit`. Do not commit generated `playwright-report/` or `test-results/` artifacts.

The current reference runner is an Apple Silicon Mac on macOS 26.6.2 with Node.js 26.11.0 and Playwright 1.64.0. The installed browser projects are Chromium 156.0.8078.4, Firefox 157.0, and WebKit 27.2. Record these versions with any new performance comparison because click-to-frame timings are browser and hardware dependent.

## Verification recorded on 2026-10-11

- Motion/filter suite: 48 cases passed across the three browser engines, including natural shrinking, minimal spacers, keyboard operation, mobile overflow and live reduced-motion changes.
- Navigation suite: 18 cases passed, including history restoration, native fragments, interrupted transitions and changing motion preference before a pending navigation callback runs.
- Media suite: 6 cases passed with the generated video fixture. Background visibility is simulated; this is not an operating-system background-tab test.
- Serial Chromium performance: 30 selections per page, P95 34.6 ms on home and 34.7 ms on blog, measured using the double-frame proxy described above.
- Production export, TypeScript and lint for changed motion/test files passed. Full-repository ESLint still reports five existing errors in `next-sitemap.config.js` and `MarkdownRenderer.tsx`.
- Remotion hero frames 0 and 239 rendered successfully and its TypeScript check passed.

Real Safari/iOS hardware validation and an optimized-vs-original performance comparison were not performed. WebKit automation does not replace a physical-device check.

`filter-animation.spec.ts` samples actual intermediate positions and opacity via `data-filter-indicator` and `data-filter-card`. It checks visible ordinary-mode motion, settled geometry, immediate reduced-motion changes, and rapid selection without a queued follow-up across Chromium, Firefox, and WebKit.
