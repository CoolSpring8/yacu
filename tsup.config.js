import { defineConfig } from "tsup";
import browserslistToEsbuild from "browserslist-to-esbuild";
import { userscriptMetadataGenerator } from "userscript-metadata-generator";
import { YacuScriptVersion } from "./src/constants.js";

/**
 * @type {import('userscript-metadata-generator').Metadata}
 */
const metadata = {
  name: "YACU：CC98优化摸鱼体验",
  namespace: "https://github.com/CoolSpring8/",
  version: YacuScriptVersion,
  match: ["*://www.cc98.org/*", "*://www-cc98-org-s.webvpn.zju.edu.cn:8001/*"],
  "run-at": "document-idle",
  grant: ["GM.getValue", "GM.setValue", "GM.registerMenuCommand"],
};

export default defineConfig({
  entry: {
    "yacu.user": "src/index.ts",
  },
  format: "iife",
  legacyOutput: true,
  target: browserslistToEsbuild(),
  esbuildOptions(options) {
    options.banner = {
      ...options.banner,
      js: userscriptMetadataGenerator(metadata),
    };
    options.charset = "utf8";
  },
});
