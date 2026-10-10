# ByteLand Technology

Source code for the [ByteLand Technology](https://byteland.app) website. The site showcases our open-source work under [ByteLandTechnology](https://github.com/ByteLandTechnology) and hosts the ByteLog blog.

## 📦 Projects

The site shows these projects on the home page, each with its own showcase page at `/opensource/<id>`:

- **Layout Engine**: [taffy-layout](https://github.com/ByteLandTechnology/taffy-layout)
- **Tinky Framework**: [tinky](https://github.com/ByteLandTechnology/tinky) and its `tinky-*` packages
- **Ink Components**: [ink-scroll-view](https://github.com/ByteLandTechnology/ink-scroll-view), [ink-scroll-list](https://github.com/ByteLandTechnology/ink-scroll-list), [ink-scroll-bar](https://github.com/ByteLandTechnology/ink-scroll-bar), [ink-multiline-input](https://github.com/ByteLandTechnology/ink-multiline-input), [ink-canvas](https://github.com/ByteLandTechnology/ink-canvas)
- **Reverse Engineering**: [ghidra-bridge](https://github.com/ByteLandTechnology/ghidra-bridge), [headless-ghidra](https://github.com/ByteLandTechnology/headless-ghidra)

To add a project:

1. Add an entry to `projects` in [`src/config/projects.ts`](src/config/projects.ts).
2. Add its page content (headline, highlights, quick-start code) to [`src/config/project-pages.ts`](src/config/project-pages.ts).
3. Add an animated glyph to `PROJECT_GLYPHS` in [`src/components/art/glyphs.tsx`](src/components/art/glyphs.tsx).

The page, the sitemap entry and the project's video are generated from these.

## ✍️ Writing a blog post

Posts are Markdown files in `public/posts/<YYYY-MM>/`. Pushing to `main` deploys the site.

1. **Create** a post in `public/posts/<YYYY-MM>/<slug>.md` (e.g. `public/posts/2026-10/hello-byteland.md`), and optionally an asset folder next to it (`public/posts/<YYYY-MM>/<slug>/`). You can create the file locally or in GitHub's web editor.

2. **Write** the post. Put images in the asset folder and reference them relatively, e.g. `![Diagram](./<slug>/diagram.svg)`.

3. **Publish**: set `draft: false` and push or merge to `main`.

Frontmatter:

| Field         | Required | Notes                                                    |
| ------------- | -------- | -------------------------------------------------------- |
| `title`       | yes      |                                                          |
| `date`        | yes      | `YYYY-MM-DD`. A future date schedules the post.          |
| `description` | no       | Shown on cards and used as the meta description.         |
| `tags`        | no       | Used for the blog filter.                                |
| `author`      | no       | Defaults to "The ByteLand Team".                         |
| `image`       | no       | Cover image. Without one, a gradient cover is generated. |
| `draft`       | no       | `true` keeps the post out of the site and the sitemap.   |

**Scheduling:** the deploy workflow also runs every day at 01:17 UTC. A post whose `date` is in the future stays hidden until the first daily build on or after that date. No extra step is needed.

## 🎬 Videos

The looping videos on the site are made with [Remotion](https://www.remotion.dev/) from the sources in [`video/`](video/): one for the home hero and one per project. They reuse the site's own SVG animations (`src/components/art`), paused and seeked frame by frame, plus the project name and highlights from `src/config`. Only the source is committed. CI renders `public/videos/*.webm` and `*.mp4` before building and caches them until `video/` or the shared sources change.

```bash
npm ci --prefix video
npm run studio --prefix video   # preview and edit in Remotion Studio
npm run render --prefix video   # render into public/videos/
```

Every SMIL animation in `src/components/art` uses a duration that divides 8 seconds, so the 8-second videos loop seamlessly. Keep that rule when adding art.

Without rendered files the site shows the SVG animation instead, so local development works without rendering. Remotion is free for individuals and companies of up to 3 people. Larger companies need a [company license](https://www.remotion.dev/license).

## 🛠️ Tech Stack

This website is built using:

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Deployment**: [GitHub Pages](https://pages.github.com/) (static export)

## Motion and accessibility

`useMotionPolicy` follows the system preference live and defaults to still,
visible content during server rendering and hydration. Reduced motion uses
immediate state changes, including filters, menus, scrolling, SVG art and video.
Use the shared presets in `src/lib/motion.ts` for new interactions and `Reveal`
for once-only viewport entrances; already-visible server content does not replay
an entrance on hydration. Route snapshots own page entrances while active.

Home and blog filters share `useStableFilter`: results shrink naturally while
the controls retain their viewport position. A trailing spacer supplies only
the height needed when the document would otherwise become too short to retain
the scroll position. Do not animate the result container's height or add an exit
queue before updating the selected results.
In ordinary motion mode, the chip background glides without a dot or bounce.
`FilterCardMotion` keeps retained cards opaque and animates nearby position
changes for 240ms; large jumps settle immediately. Only newly added cards fade
from 65% opacity over 180ms, without scale, rise, stagger, or an exit queue.
Rapid selections interrupt movement, and reduced motion cancels it immediately.

Run `npm run build` followed by `npm run test:e2e` for the browser regression
suite. See [the browser test guide](tests/README.md) for fixtures, performance
measurements and browser installation. Remotion's `Seek` wrapper opts shared SVG
art into manual animation control so browser visibility policies do not affect
frame exports.

## 💻 Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/ByteLandTechnology/byteland.app.git
   cd byteland.app
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

## 📄 License

This project is licensed under the [CC BY-NC-SA 4.0 License](LICENSE).

---

© ByteLand Technology Limited. All rights reserved.
