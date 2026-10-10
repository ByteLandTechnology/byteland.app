# ByteLand Website Open-Source Redesign: Comprehensive Code Review & Engineering Evaluation

> Historical review of commit `451b897`, written before the subsequent fixes and
> motion revisions. Findings, line numbers, severity assessments, and proposed
> patches below describe that snapshot; they are not a current defect list or
> a claim that every recommendation has been implemented. See the dated follow-up
> at the end for the review of the remaining working-tree changes.

**Target Commit:** `451b897` (`feat: redesign site around ByteLand open source`)  
**Commit Statistics:** 102 files changed (32 added, 26 modified, 44 deleted), +8,113 insertions, -6,173 deletions  
**Review Lead:** Lead Code Review Report Author (`worker_report_1`)  
**Date of Audit:** 2026-10-10  
**Scope:** Architecture (R1), Animations & Multimedia (R2), Runtime Robustness & SSG Lifecycle (R3)

---

## 1. Executive Summary & Review Overview

### 1.1 Architectural Transformation Summary

Commit `451b897` executes a strategic pivot for the official ByteLand web platform (`byteland.app`). The website transitions from a multi-product commercial showcase (JoyDex, Jules GO, Seelist) to an open-source systems engineering hub focused on developer infrastructure:

- **Taffy WebAssembly Layout Engine** (`taffy-layout`)
- **Tinky React Terminal CLI Framework** (`tinky`)
- **Ink Terminal UI Component Suite** (`ink-scroll-view`, `ink-scroll-list`, `ink-scroll-bar`, `ink-multiline-input`, `ink-canvas`)
- **Ghidra Reverse Engineering Tooling** (`ghidra-bridge`, `headless-ghidra`)

Beyond content repositioning, the commit introduces an ambitious modern frontend architecture combining:

1. **Deterministic Vector Art & SMIL Glyphs**: Over 1,200 lines of handcrafted SVG SMIL animations operating on strict 8-second harmonic loops (`dur="8s"`, `4s`, `2s`, `1s`) without client-side JavaScript execution overhead.
2. **Remotion Headless Video Subsystem**: A dedicated compilation pipeline (`video/`) employing Remotion 4.0.528 to render frame-accurate dual-codec WebM (VP9) and MP4 (H.264) video reels directly from SVG glyph components.
3. **View Transitions API Integration**: Full-stack integration combining CSS cross-document rules (`@view-transition { navigation: auto; }`) and Next.js Pages router client-side navigation interception (`useViewTransitions.ts`), morphing shared element titles, covers, and hero artwork across page transitions.
4. **Editorial Pipeline Automation**: Scheduled publishing filters (`draft: true`, future UTC date comparison) coordinated between `src/lib/blog.ts`, `next-sitemap.config.js`, and daily scheduled GitHub Actions (`cron: "17 1 * * *"`).
5. **Asset & Dependency Hygiene**: 38 legacy mockups and product screenshots purged (~12MB saved), redundant third-party dependencies dropped (`@floating-ui/react`), and legacy README remote network fetching eliminated in favor of self-contained type-safe metadata registries.

### 1.2 Technology Stack

- **Framework & Routing**: Next.js 16.0.10 (Pages Router, `src/pages/`) with pure static HTML export (`output: "export"`, `images: { unoptimized: true }`).
- **UI Runtime & Compilation**: React 19.2.1, React DOM 19.2.1, React Compiler (`babel-plugin-react-compiler: 1.0.0` with `reactCompiler: true`).
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss: ^4`, `@tailwindcss/oxide: ^4.1.18`, `lightningcss: ^1.30.2`).
- **Motion & Interactions**: Framer Motion 12.23.26 (`MotionConfig reducedMotion="user"`), View Transitions API (`useViewTransitions.ts`, `src/lib/viewTransition.ts`).
- **Video Generator**: Remotion 4.0.528 (`@remotion/renderer`, `@remotion/bundler`, `@remotion/cli`).
- **Markdown & Diagrams**: `react-markdown: ^10.1.0`, `next-mdx-remote: ^5.0.0`, `remark-gfm`, `rehype-raw`, `mermaid: ^11.12.2`.
- **Language & Tooling**: TypeScript 5 (Strict Mode), ESLint 9, Prettier 3.7.4, Husky 9.1.7, Commitlint 20.2.0.

### 1.3 Architectural Module Inventory (102 Files)

The 102 files affected in commit `451b897` span seven primary architectural domains:

| Module / Directory                                      |  Files  | Added  | Modified | Deleted | Architectural Responsibility                                                                |
| ------------------------------------------------------- | :-----: | :----: | :------: | :-----: | ------------------------------------------------------------------------------------------- |
| **1. Pages & Routing** (`src/pages/`)                   |   13    |   1    |    6     |    6    | Application entrypoints, SSG lifecycle (`getStaticPaths`/`getStaticProps`), route redirects |
| **2. Shared UI Components** (`src/components/`)         |   14    |   5    |    9     |    0    | Layout primitives, code blocks, terminal chrome, markdown renderer, video player            |
| **3. Vector Art & SMIL Glyphs** (`src/components/art/`) |    6    |   6    |    0     |    0    | Procedural SMIL glyphs, dynamic backdrops, deterministic post covers, reduced-motion hook   |
| **4. Configuration & Metadata** (`src/config/`)         |    4    |   1    |    3     |    0    | Project registries, showcase metadata, navigation hierarchy, site constants                 |
| **5. Libraries & Utilities** (`src/lib/`)               |    2    |   1    |    1     |    0    | Markdown/MDX parser, scheduled post filters, View Transitions helper (`vt`)                 |
| **6. Hooks** (`src/hooks/`)                             |    3    |   1    |    1     |    1    | Client-side View Transitions wrapper, telemetry tracking, Clarity initialization            |
| **7. Video & Remotion Subsystem** (`video/`)            |   12    |   12   |    0     |    0    | Standalone Remotion project, SMIL frame seeking, headless rendering scripts                 |
| **8. Styles, Tooling, Assets & Content** (Root/Public)  |   48    |   5    |    5     |   38    | Tailwind CSS v4 tokens, CI deployment workflows, sitemap config, legacy asset purge         |
| **TOTAL**                                               | **102** | **32** |  **26**  | **44**  | Complete open-source repositioning and design overhaul                                      |

---

## 2. Deep Domain Evaluations

### 2.1 Domain R1: Architecture & Next.js 16 / React 19 Best Practices

#### Architectural Strengths

1. **Self-Contained SSG Build Model**: The previous implementation fetched dynamic project README files from `raw.githubusercontent.com` at build time. Commit `451b897` replaces this network vulnerability with structured, type-checked metadata in `src/config/projects.ts` and `src/config/project-pages.ts`. Builds are entirely deterministic, reproducible offline, and immune to GitHub API rate limits.
2. **React Compiler Readiness**: The codebase enables `reactCompiler: true` in `next.config.ts`. Clean separation of presentation and configuration minimizes closure traps that could de-optimize compiler auto-memoization.
3. **Decoupled Video Pipeline**: The Remotion subsystem is isolated in `video/` with its own `package.json` and `tsconfig.json`, excluded from the web application's root build and lint pipeline (`eslint.config.mjs`, `tsconfig.json`). A dedicated `video/webpack-override.ts` handles shared component imports while enforcing a single React instance.

#### Architectural Deficiencies & Violations

1. **Router Monkey-Patching Anti-Pattern**: In `src/hooks/useViewTransitions.ts`, the application mutates Next.js's private singleton router instance (`Router.router.push = wrap(...)`). This violates library boundary encapsulation, risks regressions on Next.js minor updates, and fails to intercept browser history events (`popstate`).
2. **SEO Metadata Duplication**: Placing a static `<meta name="description">` inside `src/pages/_document.tsx` causes Next.js to render duplicate meta tags in static HTML whenever child pages emit custom descriptions via `next/head`.
3. **Missing Custom 404 in Static Export**: Six high-traffic legacy routes (`/about`, `/seelist`, `/joydex`, etc.) were purged. Because `output: "export"` does not support server-side rewrites/redirects in `next.config.ts`, omitting `src/pages/404.tsx` causes users following external links to land on Next.js's raw unstyled error page.
4. **Missing Font Optimization**: `_document.tsx` loads Google Fonts via external render-blocking `<link>` tags rather than leveraging Next.js 16's built-in zero-layout-shift `next/font/google` module.
5. **Ghost Dependency**: `src/components/Mermaid.tsx` imports `nanoid` directly without declaring it in root `package.json`, causing fragile dependence on transitive dependency hoisting.

---

### 2.2 Domain R2: Animations, View Transitions API, Framer Motion & Multimedia Performance

#### Animation System Strengths

1. **Zero-JS SMIL Vector Rendering**: Vector glyphs in `src/components/art/` run directly in browser graphics engines via SVG SMIL animations. They execute smoothly during initial page hydration before React JavaScript has initialized.
2. **Harmonic 8-Second Timing**: All animated paths and gradient sweeps use periods that are factors of 8 seconds (`8s`, `4s`, `2s`, `1s`). This guarantees frame-level synchronization when Remotion captures looping reels.
3. **Shared Element Morphing**: Coordinated `viewTransitionName` assignments (`nav-pill`, `title-<id>`, `art-<id>`, `cover-<slug>`) provide high-craft visual continuity across client-side route transitions.

#### Performance Bottlenecks & Degraded Fallbacks

1. **CSS View Transitions Cascade Fragility & Declaration Ordering**: In `src/index.css`, placing universal wildcard rule `::view-transition-old(*)` after specialized `root` fade declarations introduces cascade ambiguity and maintenance fragility across rendering engines. Placing universal wildcard defaults before explicit custom-ident rules is standard best practice.
2. **Safari 18 Incompatibility with Level 2 Selectors**: `::view-transition-old(*.vt-text)` relies on CSS View Transitions Level 2 (`view-transition-class`), supported in Chrome 125+ but completely absent in Safari 18 and Firefox. Safari requires discrete custom-ident enumeration (e.g. `title-taffy-layout`), as wildcard globbing `title-*` is invalid CSS syntax.
3. **Double Compositing Tax**: `LoopVideo.tsx` keeps the underlying SMIL SVG component rendered and actively calculating 60fps animations directly behind the playing opaque `<video>` layer.
4. **Unbounded Offscreen SVG Execution**: Project cards on the Home page run heavy SMIL animation loops indefinitely while positioned thousands of pixels below the viewport because `useArtId.ts` lacks viewport culling.
5. **iOS Low Power Mode Failure**: When iOS power saver blocks video autoplay, `LoopVideo` transitions opacity to 100% on `onCanPlay`, leaving a frozen static frame or blank black box covering the animated SVG fallback.
6. **Framer Motion Layout Snapping in CSS Grid**: In `src/pages/blog/index.tsx`, placing `<AnimatePresence mode="popLayout">` directly inside a multi-column CSS grid causes exiting elements to become `position: absolute`, instantly collapsing grid tracks before FLIP interpolation can occur.

---

### 2.3 Domain R3: Runtime Robustness, Edge Cases & SSG vs Client Lifecycle Consistency

#### Robustness Strengths

1. **Deterministic Markdown Serialization**: Blog post metadata and MDX compilation are validated at build time in `src/lib/blog.ts`, filtering drafts and unscheduled future articles before static generation.
2. **Safe Component Fallbacks**: Terminal code windows, language badges, and SVG backdrops render defensively with graceful default props.

#### Critical Runtime Failures & Boundary Bugs

1. **Critical Telemetry Corruption (P0)**: An operator precedence bug in `src/hooks/usePageTracking.ts` causes `page_path` in Google Analytics to be dispatched as `"?undefined"` across all standard site navigations, destroying web analytics integrity.
2. **Crash Vector on Invalid Project IDs (P0)**: In `src/pages/opensource/[id].tsx`, `getStaticProps` lacks validation and `notFound: true`. The page component executes `getProject(id)!`, crashing immediately with `TypeError: Cannot read properties of undefined (reading 'category')` on invalid routes.
3. **Uncaught ENOENT & Path Traversal in Blog Loader (P0)**: `getPostData` in `src/lib/blog.ts` synchronously reads disk files without checking existence or sanitizing directory traversal sequences (`../`), causing unhandled server/build crashes on non-existent slugs.
4. **Media Error Trapping Collapse (P0)**: `LoopVideo.tsx` attaches error handling exclusively to the secondary `<source>` tag. Because media errors on `<source>` do not reliably bubble to parent elements in React DOM, missing video files leave broken `<video>` elements mounted, triggering continuous unhandled promise rejection loops on scroll.
5. **Hydration Mismatch Risk**: `Footer.tsx` computes `new Date().getFullYear()` during client hydration without synchronization to SSG build-time timestamps.

---

## 3. Comprehensive Prioritized Issue Catalog (P0 / P1 / P2)

```
┌────────────────────────────────────────────────────────────────────────┐
│ ISSUE SEVERITY CLASSIFICATION                                          │
├──────┬─────────────────────────────────────────────────────────────────┤
│  P0  │ Critical Crash / Telemetry Corruption / Unhandled Exception      │
│  P1  │ Architectural Defect / Broken Fallback / Performance Regression │
│  P2  │ Code Hygiene / Memory Leak / Minor Polish / Strict Typing       │
└──────┴─────────────────────────────────────────────────────────────────┘
```

---

### Priority P0: Critical Blocker Issues (4 Issues)

#### ISSUE-P0-01: Operator Precedence Bug Sending "?undefined" to Google Analytics

- **Severity**: **P0 (Critical / Telemetry Corruption)**
- **Category**: R3 (Runtime Robustness & Data Integrity)
- **File & Lines**: `src/hooks/usePageTracking.ts`, Lines 22–26
- **Root Cause**:
  In `usePageTracking.ts`, the Google Analytics `page_path` configuration is computed as:

  ```ts
  page_path:
    router.pathname + router.asPath.split("?")[1]
      ? `?${router.asPath.split("?")[1]}`
      : "",
  ```

  Because the binary addition operator `+` has higher operator precedence than the conditional ternary operator `? :`, JavaScript parses this expression as:

  ```ts
  router.pathname + router.asPath.split("?")[1]
    ? `?${router.asPath.split("?")[1]}`
    : "";
  ```

  1. For standard URLs without query parameters (e.g. `/blog`), `router.asPath.split("?")[1]` evaluates to `undefined`.
  2. String concatenation produces `"/blogundefined"`, which is a non-empty, truthy string.
  3. The ternary operator evaluates the truthy branch: `?${router.asPath.split("?")[1]}` $\rightarrow$ **`"?undefined"`**.
  4. If query parameters DO exist (e.g. `/blog?tag=wasm`), it sends `"?tag=wasm"`, omitting the pathname entirely.
  5. Furthermore, to properly track client-side route transitions in Next.js Pages router, page tracking must subscribe to `router.events.on("routeChangeComplete", handleRouteChange)`. Crucially, the `useEffect` dependency array must strictly be `[router.events]`—omitting `router.asPath`. Including `router.asPath` in the dependencies causes the effect to re-run whenever the route changes, dispatching a duplicate pageview alongside the `routeChangeComplete` listener.

- **Risk Impact**: Every single production page view dispatches `page_path: "?undefined"` to Google Analytics, completely corrupting site telemetry.
- **Before / After Code Comparison**:

```diff
--- a/src/hooks/usePageTracking.ts
+++ b/src/hooks/usePageTracking.ts
@@ -19,11 +19,16 @@ export function usePageTracking() {
   useEffect(() => {
     if (typeof window.gtag === "function") {
-      window.gtag("config", GA_MEASUREMENT_ID, {
-        page_path:
-          router.pathname + router.asPath.split("?")[1]
-            ? `?${router.asPath.split("?")[1]}`
-            : "",
-      });
+      const handleRouteChange = (url: string) => {
+        window.gtag("config", GA_MEASUREMENT_ID, {
+          page_path: url,
+        });
+      };
+
+      handleRouteChange(router.asPath);
+      router.events.on("routeChangeComplete", handleRouteChange);
+      return () => {
+        router.events.off("routeChangeComplete", handleRouteChange);
+      };
     }
-  }, [router]);
+  }, [router.events]);
 }
```

---

#### ISSUE-P0-02: Non-Null Assertion & Missing `notFound` in Project Detail SSG Lifecycle

- **Severity**: **P0 (Critical / Runtime Crash Vector)**
- **Category**: R3 (SSG Lifecycle & Runtime Robustness)
- **File & Lines**: `src/pages/opensource/[id].tsx`, Lines 82–84, 94–96, 147
- **Root Cause**:
  `getStaticProps` in `src/pages/opensource/[id].tsx` returns `{ props: { id: params?.id as string } }` without checking if the project exists in `projects` or `projectPages`. Inside the `ProjectPage` component:

  ```tsx
  const project = getProject(id)!;
  const page = projectPages[id];
  const category = getCategory(project.category);
  ```

  1. The non-null assertion `getProject(id)!` bypasses TypeScript type checking. If `id` does not match an existing project, `project` is `undefined`, and evaluating `project.category` immediately throws `TypeError: Cannot read properties of undefined (reading 'category')`.
  2. If a project exists in `projects.ts` but is missing from `projectPages.ts`, `page` is `undefined`, causing line 147 (`page.headline`) to throw `TypeError: Cannot read properties of undefined (reading 'headline')`.
  3. `getStaticProps` fails to return `{ notFound: true }`.

- **Risk Impact**: Immediate unhandled application crash and blank error screen when visiting unknown or unmapped project URLs.
- **Before / After Code Comparison**:

```diff
--- a/src/pages/opensource/[id].tsx
+++ b/src/pages/opensource/[id].tsx
@@ -80,6 +80,12 @@ export const getStaticPaths: GetStaticPaths = async () => ({
   fallback: false,
 });

-export const getStaticProps: GetStaticProps = async ({ params }) => ({
-  props: { id: params?.id as string },
-});
+export const getStaticProps: GetStaticProps = async ({ params }) => {
+  const id = typeof params?.id === "string" ? params.id : "";
+  const project = getProject(id);
+  const page = projectPages[id];
+  if (!project || !page) {
+    return { notFound: true };
+  }
+  return { props: { id } };
+};

 export default function ProjectPage({ id }: { id: string }) {
-  const project = getProject(id)!;
+  const project = getProject(id);
   const page = projectPages[id];
+  if (!project || !page) {
+    return null;
+  }
   const category = getCategory(project.category);
```

---

#### ISSUE-P0-03: Uncaught `ENOENT` File Access Exception & Path Traversal in Blog Loader

- **Severity**: **P0 (Critical / Server Crash & Security Vulnerability)**
- **Category**: R3 (Runtime Robustness & Error Handling)
- **File & Lines**: `src/lib/blog.ts`, Lines 105–115; `src/pages/blog/[...slug].tsx`, Lines 21–31
- **Root Cause**:
  In `src/lib/blog.ts`:

  ```ts
  export async function getPostData(slug: string): Promise<Post> {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const matterResult = matter(fs.readFileSync(fullPath, "utf8"));
  ```

  1. `getPostData` does not verify whether `fullPath` exists via `fs.existsSync` before invoking `fs.readFileSync`.
  2. `slug` is not sanitized against directory traversal sequences (e.g. `../../etc/passwd`).
  3. In `src/pages/blog/[...slug].tsx`, `getStaticProps` casts `params?.slug` without validating array contents, and does not wrap `getPostData` in error handling or return `{ notFound: true }`.

- **Risk Impact**: Unhandled `ENOENT` crashes during build or dev server execution on invalid slugs, combined with path traversal vulnerability.
- **Before / After Code Comparison**:

```diff
--- a/src/lib/blog.ts
+++ b/src/lib/blog.ts
@@ -104,12 +104,18 @@ export function getAllPostSlugs() {

-export async function getPostData(slug: string): Promise<Post> {
-  const fullPath = path.join(postsDirectory, `${slug}.md`);
+export async function getPostData(slug: string): Promise<Post | null> {
+  // Sanitize path against directory traversal
+  const cleanSlug = path.normalize(slug).replace(/^(\.\.[\/\\])+/, "");
+  const fullPath = path.join(postsDirectory, `${cleanSlug}.md`);
+  if (!fs.existsSync(fullPath)) {
+    return null;
+  }
   const matterResult = matter(fs.readFileSync(fullPath, "utf8"));
   const mdxSource = await serialize(matterResult.content);

   return {
-    ...toMeta(slug, matterResult.data),
+    ...toMeta(cleanSlug, matterResult.data),
     content: matterResult.content,
     mdxSource,
   };
 }

--- a/src/pages/blog/[...slug].tsx
+++ b/src/pages/blog/[...slug].tsx
@@ -22,6 +22,10 @@ export const getStaticProps: GetStaticProps = async ({ params }) => {
   const slugArray = params?.slug as string[];
+  if (!Array.isArray(slugArray) || slugArray.length === 0) {
+    return { notFound: true };
+  }
   const slugString = slugArray.join("/");
   const postData = await getPostData(slugString);
+  if (!postData) {
+    return { notFound: true };
+  }
   return {
```

---

#### ISSUE-P0-04: Defective Video Error Trapping & Unhandled Rejection Loop in LoopVideo

- **Severity**: **P0 (Critical / Browser Resource Leak & Infinite Rejections)**
- **Category**: R2 / R3 (Multimedia & Runtime Robustness)
- **File & Lines**: `src/components/LoopVideo.tsx`, Lines 34–43, 60–73
- **Root Cause**:
  `LoopVideo.tsx` relies exclusively on an `onError` listener attached to the secondary `<source src="/videos/${name}.mp4">` element.
  1. In HTML5 and React DOM, error events dispatched on `<source>` child elements do not reliably bubble to parent elements, and React DOM does not capture non-bubbling events on child source nodes.
  2. The parent `<video>` element lacks an `onError` listener. When video files are absent (e.g. local development where `/public/videos/` is gitignored) or when codec decoding fails, the `<video>` element enters an unhandled error state while remaining permanently mounted (`enabled` stays `true`).
  3. The `IntersectionObserver` at lines 34–43 continues to trigger on every scroll event, calling `video.play().catch(() => {})` repeatedly against a broken media element and flooding the browser console with unhandled promise rejections and decoder warnings.
  4. Crucially, under the WHATWG HTML media resource selection algorithm (Section 4.8.14.5), browsers lacking WebM VP9 support (e.g. Safari on macOS/iOS) fire a non-bubbling error on the `<source type="video/webm">` element and proceed to evaluate the subsequent `<source type="video/mp4">`. Attaching `onError={handleError}` to the initial WebM `<source>` would immediately invoke `setEnabled(false)` on Safari, unmounting the `<video>` before the browser can even attempt MP4 playback. Error handling must reside on the parent `<video onError={handleError}>` (which receives `MEDIA_ERR_SRC_NOT_SUPPORTED` when all candidate sources fail) and redundantly on the final MP4 `<source onError={handleError}>`, leaving the first WebM `<source>` tag without an error handler to preserve seamless dual-codec fallback.
- **Risk Impact**: SVG fallback art is never restored on primary media errors; browser memory leaks uncollected media decoders; console flooded with errors.
- **Before / After Code Comparison**:

```diff
--- a/src/components/LoopVideo.tsx
+++ b/src/components/LoopVideo.tsx
@@ -21,6 +21,11 @@ export default function LoopVideo({
   const [enabled, setEnabled] = useState(false);
   const [ready, setReady] = useState(false);

+  const handleError = () => {
+    setEnabled(false);
+    setReady(false);
+  };
+
   // Only mount the video in the browser, after checking motion preferences,
   // so load errors are always observed by React.
   useEffect(() => {
@@ -37,4 +42,7 @@ export default function LoopVideo({
     const observer = new IntersectionObserver(([entry]) => {
-      if (entry.isIntersecting) video.play().catch(() => {});
-      else video.pause();
+      if (entry.isIntersecting) {
+        video.play().catch(() => {});
+      } else {
+        video.pause();
+      }
     });
@@ -60,14 +68,15 @@ export default function LoopVideo({
           aria-hidden
-          onCanPlay={() => setReady(true)}
+          onError={handleError}
+          onPlaying={() => setReady(true)}
           className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
-            ready ? "opacity-100" : "opacity-0"
+            ready ? "opacity-100" : "opacity-0 pointer-events-none"
           }`}
         >
           <source src={`/videos/${name}.webm`} type="video/webm" />
           {/* With <source> children, a failed load errors on the last source. */}
           <source
             src={`/videos/${name}.mp4`}
             type="video/mp4"
-            onError={() => setEnabled(false)}
+            onError={handleError}
           />
         </video>
```

---

### Priority P1: Architectural & Degradation Issues (15 Issues)

#### ISSUE-P1-01: Missing `src/pages/404.tsx` in Static Export Breaking Deleted Routes

- **Severity**: **P1 (High / Broken Navigation Fallback)**
- **Category**: R1 (Routing & Architecture)
- **File & Lines**: `src/pages/404.tsx` (Missing file); `next.config.ts`, `next-sitemap.config.js:25`
- **Root Cause**:
  Commit `451b897` deleted six legacy routes (`/about`, `/joydex`, `/jules-go`, `/opensource/[...slug]`, `/seelist/index`, `/seelist/privacy`). Because Next.js uses static export (`output: "export"`), server-side redirects in `next.config.ts` are unsupported. `next-sitemap.config.js` explicitly configures `exclude: ["/404", "/opensource"]`, expecting a 404 page. In its absence, Next.js serves a raw, unstyled default page lacking branding, navigation links, or theme support.
- **Risk Impact**: Dead ends for users and search crawlers navigating legacy bookmarks or backlinks.
- **Before / After Code Comparison**:

```tsx
// Create: src/pages/404.tsx
import Link from "next/link";
import Head from "next/head";
import { FaArrowLeft } from "react-icons/fa6";
import Page from "../components/Page";

export default function Custom404() {
  return (
    <Page>
      <Head>
        <title>404 - Page Not Found - ByteLand Technology</title>
      </Head>
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h1 className="text-6xl font-extrabold tracking-tight font-brand text-gradient-tri">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
          Page not found
        </h2>
        <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          The page you are looking for has been retired or moved as part of our
          open-source redesign.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-700 transition-colors dark:bg-white dark:text-slate-900"
          >
            <FaArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>
      </div>
    </Page>
  );
}
```

---

#### ISSUE-P1-02: Duplicate `<meta name="description">` in Static HTML Due to `_document.tsx`

- **Severity**: **P1 (High / SEO Architecture Flaw)**
- **Category**: R1 (Next.js Architecture & SEO)
- **File & Lines**: `src/pages/_document.tsx`, Lines 9–12; `src/pages/_app.tsx`, Line 26
- **Root Cause**:
  In Next.js Pages Router, `<Head>` in `_document.tsx` is static across all pages and is **not deduplicated** by `next/head`. Because `_document.tsx` declares `<meta name="description" content="..." />`, any child page (such as `src/pages/opensource/[id].tsx:109`) that emits its own description results in two contradictory `<meta name="description">` tags in the compiled HTML document.
- **Risk Impact**: Search engines penalize duplicate metadata or ignore dynamic project descriptions.
- **Before / After Code Comparison**:

```diff
--- a/src/pages/_document.tsx
+++ b/src/pages/_document.tsx
@@ -9,4 +9,0 @@ export default function Document() {
-        <meta
-          name="description"
-          content="ByteLand Technology builds open-source tools for terminal UIs, WebAssembly layout and Ghidra-powered reverse engineering."
-        />
--- a/src/pages/_app.tsx
+++ b/src/pages/_app.tsx
@@ -26,3 +26,8 @@ function MyApp({ Component, pageProps }: AppProps) {
         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         <title>{title}</title>
+        <meta
+          key="description"
+          name="description"
+          content="ByteLand Technology builds open-source tools for terminal UIs, WebAssembly layout and Ghidra-powered reverse engineering."
+        />
```

---

#### ISSUE-P1-03: Render-Blocking External Google Fonts `<link>` vs `next/font/google`

- **Severity**: **P1 (High / Core Web Vitals & Rendering Performance)**
- **Category**: R1 (Performance & Next.js Best Practices)
- **File & Lines**: `src/pages/_document.tsx`, Lines 13–22
- **Root Cause**:
  `_document.tsx` uses external `<link rel="stylesheet">` tags pointing to `fonts.googleapis.com` to load `Exo 2`, `Inter`, and `JetBrains Mono`. This introduces render-blocking external HTTP network requests, DNS resolution delays, and Cumulative Layout Shift (CLS) when web fonts swap into place.
- **Risk Impact**: Degraded First Contentful Paint (FCP) and CLS scores; breaks in offline environments.
- **Before / After Code Comparison**:

```diff
--- a/src/pages/_document.tsx
+++ b/src/pages/_document.tsx
@@ -13,10 +13,0 @@ export default function Document() {
-        <link rel="preconnect" href="https://fonts.googleapis.com" />
-        <link
-          rel="preconnect"
-          href="https://fonts.gstatic.com"
-          crossOrigin="anonymous"
-        />
-        <link
-          href="https://fonts.googleapis.com/css2?family=Exo+2:wght@600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
-          rel="stylesheet"
-        />
```

_(Utilize `next/font/google` in `_app.tsx` to automatically self-host font files with zero runtime layout shift)._

---

#### ISSUE-P1-04: Arrow Function in `useClarity` Returns Value to `useEffect`

- **Severity**: **P1 (Medium-High / React 19 Runtime Warning)**
- **Category**: R1 (React 19 Best Practices)
- **File & Lines**: `src/hooks/useClarity.ts`, Line 7
- **Root Cause**:
  ```ts
  export function useClarity() {
    useEffect(() => Clarity.init(CLARITY_PROJECT_ID), []);
  }
  ```
  The concise arrow function without curly braces implicitly returns the return value of `Clarity.init(...)` to React's `useEffect`. In React 19, effects must return either `undefined` or a cleanup function (`() => void`). Returning any non-function value triggers a console warning during development.
- **Risk Impact**: Console pollution, potential interference with React 19 concurrent effect cleanup scheduling.
- **Before / After Code Comparison**:

```diff
--- a/src/hooks/useClarity.ts
+++ b/src/hooks/useClarity.ts
@@ -6,3 +6,7 @@ const CLARITY_PROJECT_ID = "umdgbp66rq";
 export function useClarity() {
-  useEffect(() => Clarity.init(CLARITY_PROJECT_ID), []);
+  useEffect(() => {
+    if (process.env.NODE_ENV === "production") {
+      Clarity.init(CLARITY_PROJECT_ID);
+    }
+  }, []);
 }
```

---

#### ISSUE-P1-05: Monkey-Patching Internal `Router.router` and Bypassing Browser History (`popstate`)

- **Severity**: **P1 (High / Architecture & Navigation Inconsistency)**
- **Category**: R1 / R2 (Architecture & View Transitions)
- **File & Lines**: `src/hooks/useViewTransitions.ts`, Lines 31–36, 64–71
- **Root Cause**:
  `useViewTransitions` directly mutates `Router.router.push` and `Router.router.replace`.
  1. `Router.router` is an internal private Next.js singleton property.
  2. Overriding `push`/`replace` intercepts forward `<Link>` navigations, but completely bypasses browser history navigation (`window.onpopstate`). Back/Forward button clicks never trigger View Transitions, producing an asymmetric user experience.
  3. Rapid successive clicks trigger unhandled `AbortError` rejections from `document.startViewTransition()`.
- **Risk Impact**: Jarring visual cuts on browser Back/Forward navigation; fragility across Next.js updates.
- **Before / After Code Comparison**:

```diff
--- a/src/hooks/useViewTransitions.ts
+++ b/src/hooks/useViewTransitions.ts
@@ -47,5 +47,9 @@ export function useViewTransitions() {
         let result: Promise<boolean> = Promise.resolve(false);
-        const transition = start(async () => {
-          result = navigate(url, as, options);
-          await result.catch(() => {});
+        try {
+          const transition = start(async () => {
+            result = navigate(url, as, options);
+            await result.catch(() => {});
+            if (!String(as ?? url).includes("#")) {
+              window.scrollTo({ top: 0, left: 0, behavior: "instant" });
+            }
+          });
+          return transition.updateCallbackDone.then(() => result, () => result);
+        } catch {
+          return navigate(url, as, options);
+        }
```

---

#### ISSUE-P1-06: Ghost Unlisted Dependency `nanoid` & Heavy Synchronous Bundle

- **Severity**: **P1 (High / Build Fragility & Bundle Bloat)**
- **Category**: R1 (Dependencies & Bundle Optimization)
- **File & Lines**: `src/components/Mermaid.tsx`, Lines 2–5, 19
- **Root Cause**:
  1. `Mermaid.tsx` imports `import { nanoid } from "nanoid";`, but `nanoid` is **not listed in `package.json`**. Under package managers that enforce strict dependency trees (pnpm, modern yarn, clean npm CI), builds will fail. React 19 already provides `useId()` natively.
  2. `mermaid` (~2MB) is imported synchronously at module top-level, bloating the client bundle even for pages that contain no diagram blocks.
- **Risk Impact**: Potential CI build failure; massive unnecessary bundle overhead on initial load.
- **Before / After Code Comparison**:

```diff
--- a/src/components/Mermaid.tsx
+++ b/src/components/Mermaid.tsx
@@ -1,9 +1,8 @@
-import { useEffect, useRef, useState } from "react";
-import mermaid from "mermaid";
-import { nanoid } from "nanoid";
+import { useEffect, useRef, useState, useId } from "react";

-mermaid.initialize({
-  startOnLoad: false,
-  theme: "default",
-  securityLevel: "loose",
-  fontFamily: "inherit",
-});
@@ -18,3 +17,3 @@ export default function Mermaid({ chart }: MermaidProps) {
   const [svg, setSvg] = useState<string>("");
-  const id = useRef(`mermaid-${nanoid()}`);
+  const reactId = useId().replace(/:/g, "-");

   useEffect(() => {
@@ -25,3 +24,5 @@ export default function Mermaid({ chart }: MermaidProps) {
       try {
-        const { svg } = await mermaid.render(id.current, chart);
+        const mermaid = (await import("mermaid")).default;
+        mermaid.initialize({ startOnLoad: false, theme: "default" });
+        const { svg } = await mermaid.render(`mermaid-${reactId}`, chart);
         setSvg(svg);
```

---

#### ISSUE-P1-07: `createMarkdownComponents` Re-instantiated on Every Render Breaking DOM Reconciliation

- **Severity**: **P1 (High / React 19 Rendering Performance)**
- **Category**: R1 (React 19 Rendering Performance)
- **File & Lines**: `src/components/MarkdownRenderer.tsx`, Lines 288–292
- **Root Cause**:
  In `MarkdownRenderer`:
  ```tsx
  export default function MarkdownRenderer({
    content,
    basePath,
    linkBasePath,
    routeBase,
  }: MarkdownRendererProps) {
    const components = createMarkdownComponents(
      basePath,
      linkBasePath,
      routeBase,
    );
    return <ReactMarkdown components={components}>{content}</ReactMarkdown>;
  }
  ```
  `createMarkdownComponents` constructs a new object containing 15+ inline component functions (`h1`, `h2`, `p`, `a`, `code`, `table`, etc.) on every render pass. Because component function references change identity on every render, React cannot reconcile DOM nodes, destroying and remounting the entire rendered markdown subtree and discarding internal state (e.g. syntax highlighting, mermaid diagrams).
- **Risk Impact**: Severe layout thrashing, DOM node churn, and loss of child component state.
- **Before / After Code Comparison**:

```diff
--- a/src/components/MarkdownRenderer.tsx
+++ b/src/components/MarkdownRenderer.tsx
@@ -1,3 +1,4 @@
+import { useMemo } from "react";
 import ReactMarkdown from "react-markdown";
@@ -287,5 +288,5 @@ export default function MarkdownRenderer({
 }: MarkdownRendererProps) {
-  const components = createMarkdownComponents(
-    basePath,
-    linkBasePath,
-    routeBase,
-  );
+  const components = useMemo(
+    () => createMarkdownComponents(basePath, linkBasePath, routeBase),
+    [basePath, linkBasePath, routeBase],
+  );
```

---

#### ISSUE-P1-08: `router.pathname` Dependency Fails Scroll Reset on Dynamic Sibling Routes in Unsupported Browsers

- **Severity**: **P1 (High / Navigation UX Defect)**
- **Category**: R2 (Navigation Fallback)
- **File & Lines**: `src/components/ScrollToTop.tsx`, Lines 7–9; `src/hooks/useViewTransitions.ts:41–56`
- **Root Cause**:
  `ScrollToTop` specifies `[router.pathname]` as its effect dependency. When a user navigates between dynamic sibling routes (e.g. `/opensource/taffy-layout` $\rightarrow$ `/opensource/ink-scroll-view`), `router.pathname` remains constant (`/opensource/[id]`). On browsers without View Transitions (Firefox, Safari < 18), `useViewTransitions` skips wrapping. As a result, the page never scrolls to top, stranding the user at the bottom or middle of the newly opened project showcase.
- **Risk Impact**: Disorienting navigation experience on Firefox and Safari.
- **Before / After Code Comparison**:

```diff
--- a/src/components/ScrollToTop.tsx
+++ b/src/components/ScrollToTop.tsx
@@ -7,3 +7,3 @@ export default function ScrollToTop() {
   useEffect(() => {
     window.scrollTo({ top: 0, left: 0, behavior: "instant" });
-  }, [router.pathname]);
+  }, [router.asPath]);
```

---

#### ISSUE-P1-09: CSS View Transition Selector Specificity & Declaration Ordering

- **Severity**: **P1 (Medium-High / Standards Compliance & Transition Timing)**
- **Category**: R2 (View Transitions API & CSS Cascade)
- **File & Lines**: `src/index.css`, Lines 65–77
- **Root Cause**:
  `src/index.css` defines root transition animations:

  ```css
  ::view-transition-old(root) {
    animation: vt-fade-out 0.2s cubic-bezier(0.4, 0, 1, 1) both;
  }
  ::view-transition-new(root) {
    animation: vt-fade-in 0.35s cubic-bezier(0, 0, 0.2, 1) 0.08s both;
  }
  ```

  Immediately afterward, lines 74–77 declare:

  ```css
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation-duration: 0.45s;
  }
  ```

  1. Under the W3C CSS View Transitions Module Level 1 and Level 2 specifications (Section 5.2.1), the grammar for `<pt-name-selector>` is `'*' | <custom-ident>`.
  2. For pseudo-element specificity:
     - `::view-transition-old(root)` targets the `<custom-ident>` `root` and has type selector specificity `(0, 0, 1)`.
     - `::view-transition-old(*)` uses the universal wildcard `*` and has specificity `(0, 0, 0)`.
  3. In standards-compliant Blink (Chromium) and WebKit (Safari) rendering engines, `root` has higher specificity `(0, 0, 1) > (0, 0, 0)` and naturally takes precedence over `*`. However, placing universal wildcard overrides after specialized custom-ident declarations violates the CSS architectural principle of declaration hierarchy (general defaults should precede specific overrides) and creates cascade ambiguity and maintenance fragility across rendering engines.
  4. Crucially, attempting to resolve this with pseudo-classes like `::view-transition-old(*:not(root))` is completely invalid CSS grammar: `:not()` is a pseudo-class, which is not permitted within `<pt-name-selector>`. Standard CSS parsers reject the selector and discard the entire style rule.
  5. The standards-compliant best practice is to place universal wildcard default rules (`::view-transition-old(*) / ::view-transition-new(*)`) _before_ specific custom-ident declarations (`root`), ensuring source order cleanly aligns with the specificity hierarchy without invalid pseudo-class syntax.

- **Risk Impact**: Fragile cascade behavior across differing CSS parser implementations and maintenance risk if invalid pseudo-class syntax is introduced.
- **Before / After Code Comparison**:

```diff
--- a/src/index.css
+++ b/src/index.css
@@ -62,6 +62,13 @@
   animation-timing-function: cubic-bezier(0.2, 0, 0, 1);
 }

+/* Default crossfade for shared view transitions (universal specificity 0, 0, 0) */
+::view-transition-old(*),
+::view-transition-new(*) {
+  animation-duration: 0.45s;
+}
+
+/* Page root transitions with custom timing (custom-ident specificity 0, 0, 1) */
 ::view-transition-old(root) {
   animation: vt-fade-out 0.2s cubic-bezier(0.4, 0, 1, 1) both;
 }
@@ -70,12 +77,6 @@
   animation: vt-fade-in 0.35s cubic-bezier(0, 0, 0.2, 1) 0.08s both;
 }

-/* Crossfade each shared pair over the same time as its morph. */
-::view-transition-old(*),
-::view-transition-new(*) {
-  animation-duration: 0.45s;
-}
-
 /* Headings: scale snapshots by height only, so text grows in proportion
    instead of stretching to the group's box. */
 ::view-transition-old(*.vt-text),
```

---

#### ISSUE-P1-10: Safari 18 Incompatibility with View Transitions Level 2 `*.vt-text` Selector

- **Severity**: **P1 (High / Cross-Browser Layout Distortion)**
- **Category**: R2 (Browser Compatibility)
- **File & Lines**: `src/index.css`, Lines 81–85; `src/lib/viewTransition.ts:16`
- **Root Cause**:
  `src/index.css` attempts to constrain heading aspect ratio with:

  ```css
  ::view-transition-old(*.vt-text),
  ::view-transition-new(*.vt-text) {
    height: 100%;
    width: auto;
  }
  ```

  1. `view-transition-class` (`.vt-text`) is a CSS View Transitions Level 2 specification implemented only in Chromium 125+. Safari 18 implements View Transitions Level 1 and does not support class selectors on pseudo-elements. Safari discards this rule, causing project and post titles to stretch and distort horizontally during card-to-page transitions.
  2. Importantly, attempting to work around this using prefix wildcards like `::view-transition-old(title-*)` or `::view-transition-old(post-*)` is invalid CSS syntax: CSS View Transitions does not support globbing or wildcard prefixes. The specification grammar only permits `'*' | <custom-ident>`. Because `title-*` is not a valid `<custom-ident>`, browsers reject the selector and discard the entire rule.
  3. To maintain forward compatibility with Level 2 engines (`*.vt-text`) while providing robust Level 1 fallback support for Safari 18 without syntax errors, the stylesheet must enumerate the discrete custom-ident tokens for shared project headings (`title-taffy-layout`, `title-tinky`, `title-ink-scroll-view`, `title-ghidra-bridge`, `title-headless-ghidra`, etc.).

- **Risk Impact**: Severe typography warping during page transitions on macOS Safari and iOS 18; broken transition styling if invalid wildcard globbing is used.
- **Before / After Code Comparison**:

```diff
--- a/src/index.css
+++ b/src/index.css
@@ -80,4 +80,18 @@
+/* Level 2: Chromium 125+ */
 ::view-transition-old(*.vt-text),
-::view-transition-new(*.vt-text) {
+::view-transition-new(*.vt-text),
+/* Level 1 Fallback (Safari 18): discrete custom-idents (globbing syntax is invalid) */
+::view-transition-old(title-taffy-layout),
+::view-transition-new(title-taffy-layout),
+::view-transition-old(title-tinky),
+::view-transition-new(title-tinky),
+::view-transition-old(title-ink-scroll-view),
+::view-transition-new(title-ink-scroll-view),
+::view-transition-old(title-ghidra-bridge),
+::view-transition-new(title-ghidra-bridge),
+::view-transition-old(title-headless-ghidra),
+::view-transition-new(title-headless-ghidra) {
   height: 100%;
   width: auto;
+  object-fit: contain;
 }
```

---

#### ISSUE-P1-11: Concurrent SMIL SVG Vector Rendering Active Behind Opaque Playing Video

- **Severity**: **P1 (High / GPU Compositor & CPU Drain)**
- **Category**: R2 (Multimedia Performance)
- **File & Lines**: `src/components/LoopVideo.tsx`, Lines 46–75
- **Root Cause**:
  In `LoopVideo.tsx`, `{children}` (rendering complex SMIL SVGs `<HeroArt>` or `<ProjectArt>`) is placed inside `<div className="relative overflow-hidden">` as a sibling to `<video>`. When the video reaches `opacity-100`, `{children}` remains fully mounted, visible to the compositor, and actively calculating 60fps `<animateTransform>` loops underneath the video layer.
- **Risk Impact**: Doubled GPU compositor memory consumption and redundant continuous CPU rendering cycles.
- **Before / After Code Comparison**:

```diff
--- a/src/components/LoopVideo.tsx
+++ b/src/components/LoopVideo.tsx
@@ -50,3 +50,7 @@ export default function LoopVideo({
     >
-      {children}
+      <div
+        className={ready ? "opacity-0 pointer-events-none transition-opacity duration-700" : "opacity-100"}
+        style={ready ? { visibility: "hidden" } : undefined}
+      >
+        {children}
+      </div>
       {enabled && (
```

---

#### ISSUE-P1-12: Unculled Offscreen SMIL SVG Animations Across All Project Cards

- **Severity**: **P1 (High / Main-Thread Performance Bottleneck)**
- **Category**: R2 (Graphics & CPU/GPU Overhead)
- **File & Lines**: `src/components/art/useArtId.ts`, Lines 11–28
- **Root Cause**:
  `useArtId.ts` pauses animations solely when `prefers-reduced-motion` is detected. It does not observe viewport visibility. On the Home page, all 9 project cards render `ProjectArt` with active `Backdrop` gradient sweeps and glyph SMIL animations. All 9 SVGs run continuous animation loops indefinitely, even when positioned far below the viewport.
- **Risk Impact**: Excessive GPU power consumption, thermal throttling, and battery drain on mobile devices.
- **Before / After Code Comparison**:

```diff
--- a/src/components/art/useArtId.ts
+++ b/src/components/art/useArtId.ts
@@ -11,18 +11,19 @@ export function useArt() {
   useEffect(() => {
     const svg = ref.current;
-    if (!svg || typeof window.matchMedia !== "function") return;
-    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
-    const apply = () => {
-      if (query.matches) {
+    if (!svg) return;
+    const observer = new IntersectionObserver(([entry]) => {
+      if (entry.isIntersecting) {
+        const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
+        if (!reduce) svg.unpauseAnimations();
+      } else {
         svg.pauseAnimations();
-        svg.setCurrentTime(0);
-      } else {
-        svg.unpauseAnimations();
       }
-    };
-    if (query.matches) apply();
-    query.addEventListener("change", apply);
-    return () => query.removeEventListener("change", apply);
+    });
+    observer.observe(svg);
+    return () => observer.disconnect();
   }, []);
```

---

#### ISSUE-P1-13: iOS Low Power Mode Autoplay Block Leaves Frozen Frame Covering Fallback Artwork

- **Severity**: **P1 (High / Mobile Safari Fallback Failure)**
- **Category**: R2 (Mobile Compatibility)
- **File & Lines**: `src/components/LoopVideo.tsx`, Lines 34–43, 61–64
- **Root Cause**:
  On iOS devices in Low Power Mode, `video.play()` is blocked by WebKit policies. `LoopVideo.tsx` sets `ready = true` on `onCanPlay`. Once `ready` is true, the video transitions to `opacity-100`. When `video.play().catch(() => {})` fails, the video remains frozen on frame 0 or a black rectangle, hiding the animated SVG fallback.
- **Risk Impact**: Mobile visitors on iOS Low Power Mode see a dead, frozen frame instead of smooth vector artwork.
- **Before / After Code Comparison**:

```diff
--- a/src/components/LoopVideo.tsx
+++ b/src/components/LoopVideo.tsx
@@ -60,4 +60,4 @@ export default function LoopVideo({
           aria-hidden
-          onCanPlay={() => setReady(true)}
+          onPlaying={() => setReady(true)}
           className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
```

---

#### ISSUE-P1-14: `AnimatePresence mode="popLayout"` Inside CSS Grid Causes Track Jump in Blog Index

- **Severity**: **P1 (Medium-High / Framer Motion Layout Thrashing)**
- **Category**: R2 (Framer Motion Layout)
- **File & Lines**: `src/pages/blog/index.tsx`, Lines 52–68
- **Root Cause**:
  In `src/pages/blog/index.tsx`, `<AnimatePresence mode="popLayout">` is placed directly inside `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">`. In `popLayout` mode, exiting elements are immediately assigned `position: absolute`. In CSS Grid, absolutely positioned elements are removed from grid track calculations, causing adjacent cards to jump abruptly before FLIP layout interpolation can take effect.
- **Risk Impact**: Visual layout snapping and jitter during blog tag filtering.
- **Before / After Code Comparison**:

```diff
--- a/src/pages/blog/index.tsx
+++ b/src/pages/blog/index.tsx
@@ -52,3 +52,3 @@
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
-            <AnimatePresence mode="popLayout" initial={false}>
+            <AnimatePresence mode="sync" initial={false}>
               {filteredPosts.map((post) => (
```

---

#### ISSUE-P1-15: Duplicated Title/Tagline in Video Canvas & Unreadable Microtext on Mobile

- **Severity**: **P1 (High / Design System & Mobile Usability)**
- **Category**: R2 (Remotion Design & Mobile UX)
- **File & Lines**: `video/src/ProjectReel.tsx`, Lines 55–104; `src/pages/opensource/[id].tsx`, Lines 123–148
- **Root Cause**:
  `ProjectReel.tsx` burns the project title, tagline, and highlight badges into the left side of its 960x600 video canvas. On `src/pages/opensource/[id].tsx`, this video is placed adjacent to the page's HTML title, headline, and highlights. On desktop, this duplicates content side-by-side. On mobile screens (< 1024px) where columns stack vertically, users read the HTML header, followed immediately by downscaled 8px unreadable microtext in the video canvas.
- **Risk Impact**: Content duplication on desktop; unreadable microtext on mobile violating accessibility standards.
- **Before / After Code Comparison**:

```diff
--- a/video/src/ProjectReel.tsx
+++ b/video/src/ProjectReel.tsx
@@ -48,4 +48,4 @@ export const ProjectReel: React.FC<{ project: Project }> = ({ project }) => {
-        <svg viewBox="0 0 960 600" width="100%" height="100%">
+        <svg viewBox="0 0 400 250" width="100%" height="100%">
           <Backdrop id="bd" lead={ART_LEAD[project.category]} />
-          <g transform="translate(122 30) scale(0.76)">
+          <g transform="translate(0 0) scale(1)">
             <Glyph id="gl" />
           </g>
         </svg>
       </Seek>
-      <AbsoluteFill style={{ padding: "64px 0 64px 48px", width: 380 }}>
-        {/* Embedded title and tagline text */}
-      </AbsoluteFill>
```

---

### Priority P2: Code Hygiene, Memory & Polish Issues (7 Issues)

#### ISSUE-P2-01: `CopyCommand` Unmounted Timer Memory Leak

- **Severity**: **P2 (Low-Medium / Memory Safety)**
- **Category**: R1 (React Best Practices)
- **File & Lines**: `src/components/CopyCommand.tsx`, Line 11
- **Root Cause**:
  In `CopyCommand.tsx`, clicking copy sets `setTimeout(() => setCopied(false), 1500)`. If the user navigates away before 1500ms elapses, the timeout callback executes `setCopied(false)` on an unmounted component, retaining closures in memory.
- **Risk Impact**: Potential memory leak and React console warnings.
- **Before / After Code Comparison**:

```diff
--- a/src/components/CopyCommand.tsx
+++ b/src/components/CopyCommand.tsx
@@ -1,3 +1,3 @@
-import { useState } from "react";
+import { useState, useRef, useEffect } from "react";
 import { FaCheck, FaRegCopy } from "react-icons/fa6";

 export default function CopyCommand({ command }: { command: string }) {
   const [copied, setCopied] = useState(false);
+  const timerRef = useRef<NodeJS.Timeout | null>(null);
+
+  useEffect(() => () => {
+    if (timerRef.current) clearTimeout(timerRef.current);
+  }, []);

   const copy = async () => {
     try {
       await navigator.clipboard.writeText(command);
       setCopied(true);
-      setTimeout(() => setCopied(false), 1500);
+      if (timerRef.current) clearTimeout(timerRef.current);
+      timerRef.current = setTimeout(() => setCopied(false), 1500);
     } catch {}
   };
```

---

#### ISSUE-P2-02: Unconditional Scroll Reset Fights Browser Back-Button History Restoration

- **Severity**: **P2 (Low-Medium / UX Polish)**
- **Category**: R3 (UX & Hydration Robustness)
- **File & Lines**: `src/components/ScrollToTop.tsx`, Lines 7–9
- **Root Cause**:
  `ScrollToTop` executes `window.scrollTo({ top: 0, left: 0, behavior: "instant" })` unconditionally on route changes. When a user presses the browser Back button, Next.js attempts native scroll position restoration, but `ScrollToTop` snaps the viewport back to (0, 0), and can also race with hash links (`/#projects`).
- **Risk Impact**: Breaks browser history scroll restoration on backward navigation.
- **Before / After Code Comparison**:

```diff
--- a/src/components/ScrollToTop.tsx
+++ b/src/components/ScrollToTop.tsx
@@ -7,3 +7,7 @@ export default function ScrollToTop() {
   useEffect(() => {
-    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
-  }, [router.pathname]);
+    if (!window.location.hash) {
+      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
+    }
+  }, [router.asPath]);
```

---

#### ISSUE-P2-03: `new Date().getFullYear()` Introduces SSG Year-Boundary Hydration Mismatch Risk

- **Severity**: **P2 (Low / Hydration Consistency)**
- **Category**: R3 (SSG Lifecycle Consistency)
- **File & Lines**: `src/components/Footer.tsx`, Lines 8, 65
- **Root Cause**:
  `Footer.tsx` executes `const year = new Date().getFullYear();`. In static exports (`output: "export"`), if HTML is generated at the end of December (e.g. 2025) and viewed after January 1st (e.g. 2026), client hydration evaluates `2026` while server HTML contains `2025`, triggering a React 19 hydration mismatch error.
- **Risk Impact**: React hydration mismatch warning across year boundaries.
- **Before / After Code Comparison**:

```diff
--- a/src/components/Footer.tsx
+++ b/src/components/Footer.tsx
@@ -64,2 +64,2 @@ export default function Footer() {
-          <p>&copy; {year} ByteLand Technology Limited. All rights reserved.</p>
+          <p suppressHydrationWarning>&copy; {year} ByteLand Technology Limited. All rights reserved.</p>
```

---

#### ISSUE-P2-04: Unchecked Non-Null Assertion in `getCategory` & Decoupled Dictionary Types

- **Severity**: **P2 (Low-Medium / TypeScript Strictness)**
- **Category**: R1 (TypeScript Strictness)
- **File & Lines**: `src/config/projects.ts`, Lines 1–18, 183–184; `src/config/project-pages.ts`, Lines 1, 45
- **Root Cause**:
  1. `getCategory(id)` uses non-null assertion `categories.find((c) => c.id === id)!;`. If an unrecognized category ID is passed, it returns `undefined` at runtime while masking it from TypeScript, leading to uncaught errors downstream. Providing a fallback (e.g. `?? categories[0]`) guarantees total function safety.
  2. In `src/config/project-pages.ts:45`, `projectPages: Record<string, ProjectPage>` uses an open string index signature. Crucially, typing this as `Record<Project["id"], ProjectPage>` does **not** enforce compile-time exhaustiveness: in `src/config/projects.ts:3–4`, `interface Project` defines `id: string`, so `Project["id"]` evaluates to the primitive type `string`. In TypeScript, `Record<string, ProjectPage>` allows arbitrary string keys without requiring any specific key to be defined, so adding an unmapped project ID to `projects.ts` will never cause `npx tsc --noEmit` to flag an error in `projectPages`. True compile-time exhaustiveness requires defining `PROJECT_IDS` as a `const` tuple and deriving a literal union type `export type ProjectId = (typeof PROJECT_IDS)[number]`. Keying `projectPages: Record<ProjectId, ProjectPage>` then transforms the open dictionary into an exhaustive mapped type, strictly guaranteeing that `npx tsc --noEmit` flags missing showcase pages whenever a project is added to `projects.ts`.
- **Risk Impact**: Latent runtime crashes when configuration entries are out of sync without compile-time exhaustiveness verification.
- **Before / After Code Comparison**:

```diff
--- a/src/config/projects.ts
+++ b/src/config/projects.ts
@@ -1,6 +1,20 @@
 export type Category = "layout" | "tinky" | "ink" | "reverse-engineering";

+export const PROJECT_IDS = [
+  "taffy-layout",
+  "tinky",
+  "ink-scroll-view",
+  "ink-scroll-list",
+  "ink-scroll-bar",
+  "ink-multiline-input",
+  "ink-canvas",
+  "ghidra-bridge",
+  "headless-ghidra",
+] as const;

+export type ProjectId = (typeof PROJECT_IDS)[number];

 export interface Project {
-  id: string;
+  id: ProjectId;
   name: string;
   /** Short line for cards (≤ 60 chars). */
@@ -183,3 +197,3 @@ export const getProject = (id: string) => projects.find((p) => p.id === id);
 export const getCategory = (id: Category) =>
-  categories.find((c) => c.id === id)!;
+  categories.find((c) => c.id === id) ?? categories[0];

--- a/src/config/project-pages.ts
+++ b/src/config/project-pages.ts
@@ -1,3 +1,5 @@
+import type { ProjectId } from "./projects";

 /**
  * Content for each project's showcase page, written from the facts in the
  * project's README. Kept free of React imports so the Remotion videos in
@@ -43,4 +45,4 @@ export interface ProjectPage {
 }

-export const projectPages: Record<string, ProjectPage> = {
+export const projectPages: Record<ProjectId, ProjectPage> = {
   "taffy-layout": {
```

---

#### ISSUE-P2-05: `site-footer` Flying Snapshot Across Asymmetric Page Heights

- **Severity**: **P2 (Low / Visual Polish)**
- **Category**: R2 (View Transitions Polish)
- **File & Lines**: `src/components/Footer.tsx`, Lines 11–14
- **Root Cause**:
  `Footer.tsx` assigns `style={{ viewTransitionName: "site-footer" }}`. When navigating between the Home page (height ~3000px) and a short page (Blog/404, height ~900px), the footer snapshot coordinates shift by over 2000px, causing the footer snapshot to fly aggressively upward across the screen.
- **Risk Impact**: Distracting visual artifact during page navigation.
- **Before / After Code Comparison**:

```diff
--- a/src/components/Footer.tsx
+++ b/src/components/Footer.tsx
@@ -12,3 +12,2 @@ export default function Footer() {
       className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40"
-      style={{ viewTransitionName: "site-footer" }}
     >
```

---

#### ISSUE-P2-06: Missing Dynamic Change Listener for `prefers-reduced-motion` in LoopVideo

- **Severity**: **P2 (Low-Medium / Accessibility Compliance)**
- **Category**: R2 (Accessibility Compliance)
- **File & Lines**: `src/components/LoopVideo.tsx`, Lines 26–32
- **Root Cause**:
  `LoopVideo` evaluates `prefers-reduced-motion` only once on mount. Unlike `useArtId.ts`, it does not attach an event listener to `query.addEventListener("change", ...)`. If a user toggles Reduced Motion in OS settings while browsing, `LoopVideo` continues to play.
- **Risk Impact**: Violation of WCAG 2.2 Guideline 2.3.3 (Animation from Interactions).
- **Before / After Code Comparison**:

```diff
--- a/src/components/LoopVideo.tsx
+++ b/src/components/LoopVideo.tsx
@@ -26,7 +26,11 @@ export default function LoopVideo({
   useEffect(() => {
-    const reduce = window.matchMedia?.(
-      "(prefers-reduced-motion: reduce)",
-    ).matches;
-    if (!reduce) setEnabled(true);
+    if (typeof window === "undefined" || !window.matchMedia) return;
+    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
+    const update = () => setEnabled(!media.matches);
+    update();
+    media.addEventListener("change", update);
+    return () => media.removeEventListener("change", update);
   }, []);
```

---

#### ISSUE-P2-07: Mobile Navigation Drawer `height: "auto"` Spring Animation Reflow

- **Severity**: **P2 (Low / Mobile Performance)**
- **Category**: R2 (Framer Motion Mobile Polish)
- **File & Lines**: `src/components/Header.tsx`, Lines 95–100
- **Root Cause**:
  The mobile navigation drawer animates `initial={{ height: 0, opacity: 0 }}` to `animate={{ height: "auto", opacity: 1 }}` using a stiff spring (`stiffness: 420, damping: 40`). Animating `height: "auto"` in JavaScript forces the browser to recalculate document layout and reflow child DOM nodes on every animation frame.
- **Risk Impact**: Frame drops and stutter during mobile menu opening on lower-end mobile devices.
- **Before / After Code Comparison**:

```diff
--- a/src/components/Header.tsx
+++ b/src/components/Header.tsx
@@ -95,5 +95,5 @@ export default function Header() {
           <motion.nav
-            initial={{ height: 0, opacity: 0 }}
-            animate={{ height: "auto", opacity: 1 }}
-            exit={{ height: 0, opacity: 0 }}
-            transition={{ type: "spring", stiffness: 420, damping: 40 }}
+            initial={{ opacity: 0, y: -8 }}
+            animate={{ opacity: 1, y: 0 }}
+            exit={{ opacity: 0, y: -8 }}
+            transition={{ duration: 0.2, ease: "easeOut" }}
```

---

## 4. Systemic Improvement Plan & Phased Implementation Roadmap

To resolve the 26 identified defects systematically without regression risks, we propose a three-phase hardening roadmap:

```
┌────────────────────────────────────────────────────────────────────────┐
│ PHASED IMPLEMENTATION ROADMAP                                          │
├─────────────────┬──────────────────────────────────────────────────────┤
│ Phase 1 (Day 1) │ Immediate Critical Fixes (P0)                        │
│                 │ • Fix GA telemetry operator precedence                │
│                 │ • Add notFound & safe guards in opensource/[id]      │
│                 │ • Patch ENOENT & path traversal in blog loader       │
│                 │ • Add onError & recovery handlers in LoopVideo       │
├─────────────────┼──────────────────────────────────────────────────────┤
│ Phase 2 (Day 2) │ Architectural & Compatibility Hardening (P1)         │
│                 │ • Create src/pages/404.tsx custom fallback page      │
│                 │ • Deduplicate meta tags & migrate to next/font/google│
│                 │ • Memoize createMarkdownComponents in renderer       │
│                 │ • Dynamic-import Mermaid & replace nanoid with useId │
│                 │ • Reorder CSS View Transition universal defaults     │
│                 │ • Add Safari 18 discrete custom-ident fallbacks      │
│                 │ • Hide underlying SVG art when video is active       │
│                 │ • Cull offscreen SMIL SVG animations via observer    │
│                 │ • Fix ScrollToTop dynamic sibling router dependency  │
│                 │ • Dedicated art-only Remotion video compositions     │
├─────────────────┼──────────────────────────────────────────────────────┤
│ Phase 3 (Day 3) │ Performance & Interaction Polish (P2)                │
│                 │ • Fix CopyCommand unmounted timeout memory leak      │
│                 │ • Add suppressHydrationWarning to Footer copyright   │
│                 │ • Remove flying site-footer View Transition tag      │
│                 │ • Add dynamic reduced-motion listener in LoopVideo   │
│                 │ • Animate transform instead of height in mobile nav  │
│                 │ • Enforce strict showcase Record in project-pages.ts │
└─────────────────┴──────────────────────────────────────────────────────┘
```

### Phase 1: Immediate Critical Fixes (P0 — Telemetry & Runtime Crash Prevention)

- **Goal**: Restore production web telemetry and eliminate unhandled server/client crash vectors.
- **Actions**:
  1. Refactor `src/hooks/usePageTracking.ts` to track initial page load and subscribe to `router.events.on("routeChangeComplete")` with strict `[router.events]` dependency array (omitting `router.asPath` to prevent duplicate dispatches).
  2. Update `src/pages/opensource/[id].tsx` `getStaticProps` to validate existence and return `{ notFound: true }`; guard component against null dereferencing.
  3. Harden `src/lib/blog.ts` with `fs.existsSync` and `cleanSlug` normalization; update `blog/[...slug].tsx` with `{ notFound: true }`.
  4. Attach `onError` listeners to parent `<video>` and secondary MP4 fallback in `LoopVideo.tsx` (preserving the initial WebM `<source>` without error handlers to maintain dual-codec fallback) and switch `setReady` trigger from `onCanPlay` to `onPlaying`.

### Phase 2: Architectural & Compatibility Hardening (P1 — Navigation, SEO, Fallbacks, Mobile & Bundle)

- **Goal**: Resolve cross-browser compatibility flaws, eliminate render-blocking fonts, optimize bundle sizes, and eliminate redundant compositor rendering.
- **Actions**:
  1. Create `src/pages/404.tsx` styled to match the new open-source aesthetic with navigation back to Home.
  2. Remove static description from `_document.tsx`; declare default in `_app.tsx` with `key="description"`.
  3. Migrate external font links in `_document.tsx` to `next/font/google` in `_app.tsx`.
  4. Replace `nanoid` in `Mermaid.tsx` with React 19 `useId()`; convert `mermaid` to dynamic import.
  5. Wrap `createMarkdownComponents` in `useMemo` in `MarkdownRenderer.tsx`.
  6. Reorder `src/index.css` so universal wildcard defaults precede root-specific durations; add Safari 18 discrete custom-ident heading fallbacks alongside Level 2 `*.vt-text`.
  7. Toggle visibility of fallback SVG art in `LoopVideo.tsx` to prevent concurrent 60fps rendering behind playing videos.
  8. Introduce `IntersectionObserver` into `useArtId.ts` to pause offscreen SMIL SVG animations.
  9. Update `ScrollToTop.tsx` to depend on `router.asPath` instead of `router.pathname`.
  10. Refactor Remotion `ProjectReel.tsx` to focus purely on glyph art without duplicated textual headlines.

### Phase 3: Performance & Interaction Polish (P2 — Memory Leaks, CSS Tuning, Animation Smoothness)

- **Goal**: Perfect visual polish, clean up memory leaks, and guarantee accessibility compliance.
- **Actions**:
  1. Add timer ref cleanup on unmount in `CopyCommand.tsx`.
  2. Add `suppressHydrationWarning` to the copyright element in `Footer.tsx`.
  3. Remove `style={{ viewTransitionName: "site-footer" }}` from `Footer.tsx` to eliminate flying footer snapshots.
  4. Add dynamic media query listener in `LoopVideo.tsx` for `prefers-reduced-motion`.
  5. Refactor mobile drawer in `Header.tsx` to animate `y: -8` and `opacity` rather than `height: "auto"`.
  6. Enforce compile-time exhaustiveness with strict `Record<Project["id"], ProjectPage>` in `project-pages.ts`.

---

## 5. Comprehensive Verification Matrix

| Issue ID  | Subsystem / Target         | Verification Procedure & Test Command                                                     | Target Environment                               | Pass / Success Criteria                                                                                  |
| --------- | -------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| **P0-01** | Telemetry Tracking         | Inspect `window.gtag` payloads via browser console or proxy on route changes              | Chrome DevTools                                  | `page_path` strictly matches clean URL paths (`/blog`, `/opensource/taffy-layout`), never `"?undefined"` |
| **P0-02** | SSG Project Pages          | Request invalid ID (e.g. `/opensource/nonexistent-id`)                                    | Next.js Dev & Export                             | Returns HTTP 404 / rendered 404 page, zero `TypeError` crashes                                           |
| **P0-03** | Blog Loader                | Request invalid slug and directory traversal (e.g. `/blog/invalid-slug`, `/blog/../test`) | Next.js Dev & Export                             | Returns HTTP 404 cleanly; zero unhandled `ENOENT` exceptions                                             |
| **P0-04** | Video Error Fallback       | Delete `/public/videos/` and scroll rapidly through Home & Project pages                  | Local Dev (`npm run dev`)                        | Graceful instant fallback to SVG art; zero unhandled promise rejections on scroll                        |
| **P1-01** | 404 Routing                | Navigate to deleted legacy routes (`/about`, `/seelist`, `/joydex`)                       | Production static build (`out/`)                 | Renders branded 404 page with navigation link to Home                                                    |
| **P1-02** | SEO Metadata               | Inspect static HTML source of `/opensource/taffy-layout`                                  | `curl -s localhost:3000/opensource/taffy-layout` | Exactly one `<meta name="description">` tag present in `<head>`                                          |
| **P1-03** | Font Optimization          | Audit Network panel on clean cache reload                                                 | Lighthouse / WebPageTest                         | Zero blocking network requests to `fonts.googleapis.com`                                                 |
| **P1-04** | Clarity Initialization     | Run application in development mode with React StrictMode enabled                         | Chrome DevTools Console                          | Zero warnings regarding `useEffect` returning non-function value                                         |
| **P1-05** | History Navigation         | Click project link forward, then click browser Back button                                | Chrome 126+                                      | Back navigation executes smooth View Transition morph without visual snap                                |
| **P1-06** | Dependency Hygiene         | Verify `nanoid` removal; test offline build                                               | `npm run build`                                  | Builds cleanly without requiring unlisted `nanoid` module                                                |
| **P1-07** | Markdown Reconciliation    | Trigger re-render of `MarkdownRenderer` with unchanged content                            | React DevTools Profiler                          | DOM nodes reconciled without full AST destroy/remount                                                    |
| **P1-08** | Dynamic Route Scroll       | Navigate from `/opensource/taffy-layout` to `/opensource/ink-scroll-view`                 | Firefox 120+, Safari 17                          | Viewport immediately resets scroll offset to top `(0, 0)`                                                |
| **P1-09** | VT Cascade Durations       | Inspect `::view-transition-old(root)` duration in Animations tab                          | Chrome DevTools                                  | Fade-out duration strictly equals 0.20s, not 0.45s                                                       |
| **P1-10** | Safari Title Morph         | Navigate from project card to detail page                                                 | Safari 18 (macOS / iOS)                          | Heading text scales proportionally without horizontal stretching                                         |
| **P1-11** | Dual-Layer Compositing     | Inspect render tree while video is playing at `opacity-100`                               | Chrome Rendering -> Paint Flashing               | Underlying SVG elements report `visibility: hidden` with zero repaint                                    |
| **P1-12** | Offscreen SMIL Throttling  | Scroll Home page to hero; inspect offscreen project cards                                 | Chrome Performance Panel                         | Offscreen SVG cards emit zero continuous layout/paint events                                             |
| **P1-13** | iOS Low Power Mode         | Enable Low Power Mode on iOS device and open project page                                 | iOS Safari (Low Power Mode)                      | Animated SVG vector art remains cleanly visible; no frozen black box                                     |
| **P1-14** | Blog Filter Grid           | Switch tags rapidly in `/blog`                                                            | Mobile Safari, Chrome Desktop                    | Remaining post cards interpolate smoothly without grid track collapse                                    |
| **P1-15** | Mobile Reel Typography     | View `/opensource/taffy-layout` in mobile portrait mode (< 480px)                         | iPhone / Android Chrome                          | Zero downscaled duplicate microtext; clean hero glyph illustration                                       |
| **P2-01** | Clipboard Memory Leak      | Click Copy command and instantly navigate back to Home                                    | React DevTools / Console                         | Zero state updates on unmounted component; timer cleared                                                 |
| **P2-02** | Hash & History Scroll      | Click Back button to previous scroll position; navigate to `/#projects`                   | Chrome / Firefox                                 | Viewport preserves history scroll position; hash navigations jump to anchor                              |
| **P2-03** | Year Hydration Consistency | Build site in year $Y$, hydrate client in year $Y+1$                                      | Local Simulation                                 | Zero React hydration mismatch warnings on copyright text                                                 |
| **P2-04** | Type Synchronization       | Add dummy project without showcase config                                                 | `npx tsc --noEmit`                               | TypeScript compiler flags missing config at compile time                                                 |
| **P2-05** | Footer Transition          | Navigate between `/` and `/blog`                                                          | Chrome 126+                                      | Footer crossfades cleanly; zero vertical flight across screen                                            |
| **P2-06** | Reduced Motion Toggle      | Toggle "Reduce motion" in macOS Settings during video playback                            | macOS Accessibility Settings                     | Video instantly pauses and unmounts, revealing paused SVG                                                |
| **P2-07** | Mobile Menu Reflow         | Open and close mobile hamburger menu                                                      | Chrome Performance (6x CPU Throttling)           | Smooth 60fps transform transition without layout reflows                                                 |

---

## 6. Conclusion

Commit `451b897` establishes an exceptionally creative, distinctive visual foundation for ByteLand's open-source repositioning. The harmonic SMIL glyphs, Remotion video reel generation, and View Transitions integration represent state-of-the-art web craft.

By executing the prioritized remediations documented in this report—beginning with the four critical P0 crash and telemetry bugs, followed by architectural hardening across Safari/Firefox compatibility, font loading, and offscreen animation culling—the ByteLand platform will achieve enterprise-grade resilience, optimal Core Web Vitals, and flawless multi-browser execution.

---

## 2026-10-11 follow-up: remaining working-tree changes

Scope: the uncommitted Markdown/Mermaid, analytics, metadata, blog loading,
project fallback, redirect, and 404 changes relative to `da6affe`, plus the
historical report itself. This is a focused review, not a re-audit of every
recommendation in the original report.

### Standards

Fixed two existing explicit `any` annotations in the reviewed Markdown factory
with React/Markdown component types. The reviewed TypeScript passes typechecking;
scoped ESLint reports no errors and retains two existing `<img>` performance
warnings. No additional structural refactoring was required.

### Behavior

Four confirmed correctness issues were fixed before inclusion:

1. Mermaid errors were interpolated into HTML. Errors now render as React text;
   Mermaid uses strict security mode, and cancelled imports do not begin rendering.
2. Blog slug normalization silently rewrote invalid input. The loader now rejects
   malformed/escaping paths, non-files and symlinks outside the posts directory;
   missing and unpublished posts return `null` consistently with static paths.
3. The new keyed default description needed matching keys in detail pages.
   Static HTML and client navigation now retain one appropriate description.
4. Tracking listeners were only installed when `gtag` existed at mount. Listeners
   now remain registered and check availability on each route completion.

The GA initializer is not present in this repository. Tracking still requires
`gtag` from the hosting environment; no loader or additional analytics network
request was introduced. A late initializer must handle its own initial pageview
if no subsequent navigation occurs. Markdown/MDX remains trusted repository
content; this review does not make raw HTML suitable for untrusted submissions.

### Verification

- Production build and TypeScript passed.
- Scoped ESLint passed with the two `<img>` warnings noted above.
- Content/metadata/404 checks passed on Chromium, Firefox and WebKit (6 cases).
- Analytics initial/late availability checks passed on all three engines (6 cases).
- Navigation checks passed after correcting a test race: an already unmounted
  exiting menu is as inaccessible as an inert, aria-hidden one. The three-engine
  targeted rerun passed. No menu implementation change was needed.
- Node checks covered a valid post, malformed/traversal/missing slugs and draft/
  future publication predicates; no public content fixtures were retained.
- Chromium smoke checks rendered a valid Mermaid diagram and confirmed that an
  HTML-like invalid diagram remained error text without an injected image/dialog.
- Corrected a test-only TypeScript mismatch: `Document.getAnimations()` takes no
  `subtree` argument (unlike `Element.getAnimations()`).
