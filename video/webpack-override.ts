import type { WebpackOverrideFn } from "@remotion/bundler";
import path from "node:path";

/**
 * The site's SVG art (../src/components/art) is shared with the videos.
 * Resolve React from this package so both sides use a single copy.
 * `videoDir` is this package's directory.
 */
export const makeWebpackOverride =
  (videoDir: string): WebpackOverrideFn =>
  (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias ?? {}),
        react: path.join(videoDir, "node_modules/react"),
        "react-dom": path.join(videoDir, "node_modules/react-dom"),
      },
    },
  });
