import { Config } from "@remotion/cli/config";
import { makeWebpackOverride } from "./webpack-override";

// The Remotion CLI (npm run studio) runs from this package's directory.
Config.overrideWebpackConfig(makeWebpackOverride(process.cwd()));
