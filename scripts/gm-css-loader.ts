import fs from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "esbuild";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import postcssNested from "postcss-nested";

export default function gmCssLoader(): Plugin {
  return {
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
        const content = await fs.readFile(args.path, "utf-8");
        if (content.trim().length === 0) {
          return {
            contents: "",
            loader: "js",
          };
        }

        const transformed = await postcss([autoprefixer, postcssNested]).process(content, {
          map: false,
          from: args.path,
        });

        return {
          contents: `GM_addStyle(\`${transformed.css.replace(/`/g, "\\`")}\`)`,
          loader: "js",
        };
      });
    },
  };
}
