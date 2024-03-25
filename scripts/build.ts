import { build, type BuildOptions, context } from "esbuild";
import fs from "node:fs/promises";
import gmCssLoader from "./gm-css-loader";
import svgLoader from "./svg-loader";
import jsxTransform from "./jsx-transform";
import header from "./header";

const watch = process.argv.some((a) => a === "--watch");
const serve = process.argv.some((a) => a === "--serve");

await fs.mkdir("target/latest", { recursive: true });
await fs.copyFile("LICENSE", "target/LICENSE");
await fs.copyFile("README.md", "target/README.md");
await fs.writeFile("target/latest/fanfiction-enhancements.meta.js", header);

const buildOptions: BuildOptions = {
  entryPoints: ["src/main.ts"],
  outfile: "target/latest/fanfiction-enhancements.user.js",
  bundle: true,
  format: "iife",
  target: ["chrome89", "firefox87"],
  define: {
    "process.env.MODE": '"production"',
  },
  banner: {
    js: header,
  },
  plugins: [jsxTransform(), gmCssLoader(), svgLoader()],
};

if (watch || serve) {
  const ctx = await context(buildOptions);
  if (watch) {
    await ctx.watch();
  }
  if (serve) {
    await ctx.serve({
      port: 4000,
    });
  }
} else {
  await build(buildOptions);
}
