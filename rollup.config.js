/* eslint-disable unicorn/no-await-expression-member */
import { defineConfig } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import svelte from "rollup-plugin-svelte";
import postcss from "rollup-plugin-postcss";
import prettier from "rollup-plugin-prettier";
import metablock from "rollup-plugin-userscript-metablock";
import svelteConfig from "./svelte.config";
import package_ from "./package.json";

const isDevelopment = process.env.NODE_ENV === "development";
console.log(`isDevelopment: ${isDevelopment}`);

export default (async () =>
  defineConfig({
    input: "src/main.ts",
    output: {
      file: "dist/cc98-evolved.userscript.js",
      /**
       * 不要在 main.ts 里导出
       * 这样设置只是因为没有必要创建 IIFE
       */
      format: "esm",
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      svelte(svelteConfig),
      postcss(),
      ...(isDevelopment
        ? [
            (await import("rollup-plugin-esbuild")).default({
              minify: false,
              target: "esnext",
            }),
          ]
        : [
            (await import("@rollup/plugin-typescript")).default(),
            (await import("@rollup/plugin-babel")).babel({
              babelHelpers: "bundled",
              exclude: "node_modules/**",
              extensions: [
                ".js",
                ".jsx",
                ".es6",
                ".es",
                ".mjs",
                ".ts",
                ".tsx",
                ".svelte",
              ],
            }),
            (await import("rollup-plugin-terser")).terser({ mangle: false }),
          ]),
      prettier({ parser: "babel" }),
      metablock({
        file: "src/meta.json",
        override: {
          version: package_.version,
          description: package_.description,
          homepage: package_.homepage,
          author: package_.author,
          license: package_.license,
        },
      }),
    ],
  }))();
