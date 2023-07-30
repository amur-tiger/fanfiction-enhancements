import { build, type BuildOptions, context, type Plugin } from "esbuild";
import * as fs from "fs/promises";
import * as path from "path";
import header from "./header";

const watch = process.argv.some((a) => a === "--watch");
const serve = process.argv.some((a) => a === "--serve");

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

const svgLoader = (): Plugin => ({
  name: "svgLoader",
  setup(b) {
    b.onResolve({ filter: /\.svg$/ }, (args) => {
      if (args.resolveDir === "") return undefined;
      return {
        path: path.isAbsolute(args.path)
          ? args.path
          : path.relative(process.cwd(), path.join(args.resolveDir, args.path)),
        namespace: "svg",
      };
    });

    b.onLoad({ filter: /.*/, namespace: "svg" }, async (args) => {
      const content = await fs.readFile(args.path);
      return {
        contents: `export default (() => {
          const parser = new DOMParser();
          return () => {
            const doc = parser.parseFromString(\`${content.toString().replace(/`/g, "\\`")}\`, "image/svg+xml");
            return doc.documentElement;
          };
        })();
        `,
        loader: "js",
      };
    });
  },
});

fs.mkdir("target/latest", { recursive: true })
  .then(() => {
    const buildOptions: BuildOptions = {
      entryPoints: ["src/main.ts"],
      outfile: "target/latest/fanfiction-enhancements.user.js",
      bundle: true,
      format: "iife",
      target: ["chrome89", "firefox87"],
      banner: {
        js: header,
      },
      plugins: [gmCssLoader(), svgLoader()],
    };

    return Promise.all([
      fs.copyFile("LICENSE", "target/LICENSE"),
      fs.copyFile("README.md", "target/README.md"),
      fs.writeFile("target/latest/fanfiction-enhancements.meta.js", header),

      watch || serve
        ? context(buildOptions).then((ctx) => {
            if (watch) {
              ctx.watch();
            }
            if (serve) {
              ctx.serve({
                port: 4000,
              });
            }
          })
        : build(buildOptions),
    ]);
  })
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  });
