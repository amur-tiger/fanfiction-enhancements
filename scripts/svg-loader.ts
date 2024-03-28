import fs from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "esbuild";

export default function svgLoader(): Plugin {
  return {
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
  };
}
