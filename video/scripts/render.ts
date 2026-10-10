// Render every composition to ../public/videos/<id>.webm and .mp4.
// Set REMOTION_BROWSER to use an existing Chrome/headless-shell binary.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia } from "@remotion/renderer";
import type { Codec } from "@remotion/renderer";
import { makeWebpackOverride } from "../webpack-override";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.resolve(root, "..", "public", "videos");
fs.mkdirSync(outDir, { recursive: true });

const browserExecutable = process.env.REMOTION_BROWSER || null;
const serveUrl = await bundle({
  entryPoint: path.join(root, "src", "index.ts"),
  webpackOverride: makeWebpackOverride(root),
});
const compositions = await getCompositions(serveUrl, { browserExecutable });

interface VideoFormat {
  codec: Codec;
  ext: string;
  crf: number;
  x264Preset?: "slow" | "medium" | "fast";
}

// VP9/WebM first for Chromium builds without H.264, MP4/H.264 for the rest.
const FORMATS: VideoFormat[] = [
  { codec: "vp9", ext: "webm", crf: 36 },
  // Slower encode, smaller files.
  { codec: "h264", ext: "mp4", crf: 28, x264Preset: "slow" },
];

for (const composition of compositions) {
  for (const { ext, ...format } of FORMATS) {
    const outputLocation = path.join(outDir, `${composition.id}.${ext}`);
    await renderMedia({
      composition,
      serveUrl,
      outputLocation,
      browserExecutable,
      pixelFormat: "yuv420p",
      ...format,
    });
    const kb = Math.round(fs.statSync(outputLocation).size / 1024);
    console.log(`rendered public/videos/${composition.id}.${ext} (${kb} KB)`);
  }
}
