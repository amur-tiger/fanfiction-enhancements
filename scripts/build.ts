import { build, Plugin } from "esbuild";
import fs from "fs/promises";
import path from "path";
import process from "process";
import header from "./header";

const gmCssLoader = (): Plugin => ({
  name: "gmCssLoader",
  setup(b) {
    b.onResolve({ filter: /\.css$/ }, (args) => {
      if (args.resolveDir === "") return undefined;
      return {
        path: path.isAbsolute(args.path)
          ? args.path
          : path.relative(process.cwd(), path.join(args.resolveDir, args.path)),
        namespace: "gm-css",
      };
    });

    b.onLoad({ filter: /.*/, namespace: "gm-css" }, async (args) => {
      const content = await fs.readFile(args.path);
      return {
        contents: `GM_addStyle(\`${content.toString().replace(/`/g, "\\`")}\`)`,
        loader: "js",
      };
    });
  },
});

fs.mkdir("target/latest", { recursive: true })
  .then(() =>
    Promise.all([
      fs.copyFile("LICENSE", "target/LICENSE"),
      fs.copyFile("README.md", "target/README.md"),
      fs.writeFile("target/latest/fanfiction-enhancements.meta.js", header),

      build({
        entryPoints: ["src/main.ts"],
        outfile: "target/latest/fanfiction-enhancements.user.js",
        bundle: true,
        format: "iife",
        target: ["chrome89", "firefox87"],
        banner: {
          js: header,
        },
        plugins: [gmCssLoader()],
        watch: process.argv.some((a) => a === "--watch") && {
          onRebuild(error, result) {
            if (!error) {
              // eslint-disable-next-line no-console
              console.log("Build succeeded");
              if (result && result.warnings.length > 0) {
                // eslint-disable-next-line no-console
                console.warn(result.warnings);
              }
            }
          },
        },
      }),
    ])
  )
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  });
