# Website SDF logo

`logo-sdf.ts` evaluates the same analytic rounded-leaf distance field as the
approved E3/B5 video in `video/agent-url-policy/brand/design.js`. It specializes
the fully formed state: growth/spread/fold/zoom are 1, leaf offsets and local
turns are 0. The original 41/161/281-degree arrangement, radius values,
translation, brand colors and red/green/blue paint order are retained. Wordmark
and formation branches are omitted from the tiny website shader.

The live canvas rotates clockwise at 0.8 radians per second. It stops when the
page is hidden or the mark is outside the viewport. The image fallback is the
analytic SVG outline of this settled field, rather than an older icon. It is
visible during server rendering, with JavaScript disabled, with reduced motion,
without WebGL2, or after a context loss. A remount can retry the GPU context.
The component releases programs, shaders, VAOs, observers, animation callbacks
and event listeners on cleanup. Each mark has one accessible image name.

The PNG and ICO icons are rendered from the approved video SDF at this same
settled state and transparent background. No image or font textures are used by
the live SDF renderer.

## Validation (2026-10-12)

At 512×512 pixels on Mesa EGL, the compact shader and approved video shader
agree within 1/255 per premultiplied RGBA channel (mean absolute error
0.001214/255). The SVG fallback has 99.836% occupied-pixel intersection over
union; its edge rasterizer differs from GPU antialiasing. These are numerical
render comparisons, not browser performance measurements.

`tests/e2e/brand-logo.spec.ts` covers reduced-motion changes, absent WebGL and
context loss/navigation. Run it against the built static export using the
repository's normal Playwright workflow. Test source typechecking and lint are
separate from executing a browser test.
