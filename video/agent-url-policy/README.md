# Agent URL Policy: approved video source

This is the editable source for the published 2026-10 article video, revision 12.
It is intentionally separate from the site's existing `video/` compositions and CI.
No generated frames, browser, model weights, render caches, or old design alternatives are included.

## Rebuild

Use Node 22, Python 3.12, FFmpeg 7.1.5, and Linux with librsvg, Cairo, EGL and Mesa GLES 3.
The source dependencies are locked in package-lock.json; Python versions are in requirements.txt.
Install dependencies only in an isolated workspace after inspecting the scripts:

```sh
cd video/agent-url-policy
npm ci --ignore-scripts
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
npm run build:brand
npm run typecheck
npm run build:audio
npm run render
```

`npm run render` writes `out/agent-url-policy.mp4`: 1280×720, 60 fps, 3,868 frames,
64.4667 seconds. It evaluates the actual React SVG body, rasterizes with librsvg,
renders the analytical brand SDF through EGL, composites them, then muxes audio with FFmpeg.
This is the production rendering route. The Remotion composition is also supplied
(`npm run preview` / `npm run render:remotion`); browser Remotion rendering was not
used to produce the approved movie. Run build:brand and build:audio before either.

The native rendering needs several GB of temporary frame storage. It performs no
network calls, uploads, deployment, or paid cloud rendering. The final mux re-encodes
AAC from the preserved PCM mix. Video/font/system-library or encoder differences can
change hashes; this package does not promise byte-for-byte MP4 reproduction.
The approved published MP4 SHA-256 is
`3b6c509ba294107116d6ded3dc2fb4b7d73353447a7b22fe371a472d64a36e50`.

## Editable parts

- `src/Video.tsx`: chapter diagrams, single chapter header, layout, transitions, bottom progress.
- `src/timing.json`: shared scene/narration/ending timeline.
- `brand/design.js` and companion modules: analytical GLSL SDF geometry, E3 letter outlines,
  three-color material, and continuous B5 trajectories. No image/font texture replaces the SDF.
- `build-brand.cjs`: approved fast C2 docking, stationary opening wordmark, small corner logo,
  and accelerating tricolor-dot finish. Generated state data is reproducible and ignored.
- `src/BrandCanvas.tsx`: equivalent WebGL2 foreground layer for the Remotion composition.
- `renderer/`: transparent GLSL adapter and native EGL renderer.
- `scripts/build-audio.py`: deterministic seed-812 pops, airy swishes and bright mallet sounds,
  with speech ducking; no borrowed sound samples, drone, background bed, or added reverb.
- `audio/narration.wav`: approved original stock-voice narration stem, 24 kHz mono PCM.
  Its script and provenance are adjacent. Preserve it to reproduce timing without TTS inference.
- `captions/`: English, Simplified Chinese, Traditional Chinese and Japanese SRT/VTT files.
  Captions remain external and are not burned into the movie.

The original narration was generated with Chatterbox Nano's bundled stock voice,
without a supplied person's voice or reference recording. Model revision is recorded
in audio/provenance.json. Model weights and the original inference environment are
not included; this package rebuilds the approved soundtrack from the included stem.
New narration must be checked by listening, aligned again, and approved as a new version.

## Rights and dependencies

ByteLand's original animation and synthesized effect source follow the repository license.
Exo 2-derived E3 outlines retain their SIL Open Font License in `brand/Exo2-OFL.txt`.
Remotion is pinned to 4.0.534 and has its own license. The repository uses
CC BY-NC-SA 4.0; see the root LICENSE file.
Its current free tier covers organizations with up to three employees; reassess eligibility
and version-specific terms before future use. No subscription or paid rendering is enabled.

- Remotion: https://www.remotion.dev/license
- Chatterbox Nano model card (MIT): https://huggingface.co/ResembleAI/chatterbox-nano
- Exo 2: https://github.com/google/fonts/tree/main/ofl/exo2

License sources checked 2026-10-12. Dependency and model licenses remain their own;
this directory does not relicense them. Font rendering in SVG body text can vary with
system fonts; use the same font stack to compare layouts rather than expecting identical pixels.
