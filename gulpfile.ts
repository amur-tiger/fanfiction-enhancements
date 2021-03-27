import fs from "fs";
import path from "path";
import gulp from "gulp";
import { rollup } from "rollup";
import postCss from "rollup-plugin-postcss";
import typescript from "rollup-plugin-typescript2";
import header from "./scripts/header";

const PACKAGE = JSON.parse(fs.readFileSync("./package.json").toString("utf-8"));
const EXTERNAL = Object.keys(PACKAGE.dependencies || {});
const OUT_FOLDER = "target";

gulp.task("build-source", async () => {
  const bundle = await rollup({
    input: "./src/main.ts",
    external: EXTERNAL,
    plugins: [postCss(), (typescript as any)()],
  });

  await bundle.write({
    file: path.join(OUT_FOLDER, "latest", PACKAGE.main),
    format: "iife",
    banner: header,
    globals: {
      "ffn-parser": "ffnParser",
    },
  });
});

gulp.task("build-meta", (done) => {
  fs.existsSync(OUT_FOLDER) || fs.mkdirSync(OUT_FOLDER);
  fs.existsSync(path.join(OUT_FOLDER, "latest")) || fs.mkdirSync(path.join(OUT_FOLDER, "latest"));

  fs.writeFileSync(path.join(OUT_FOLDER, "latest", PACKAGE.main.replace(".user.js", ".meta.js")), header);

  done();
});

gulp.task("build-copy-readme", () => {
  return gulp.src("./README.md").pipe(gulp.dest(OUT_FOLDER));
});

gulp.task("build-copy-license", () => {
  return gulp.src("./LICENSE").pipe(gulp.dest(OUT_FOLDER));
});

gulp.task("build-copy-other", gulp.parallel("build-copy-readme", "build-copy-license"));

gulp.task("build", gulp.parallel("build-source", "build-meta", "build-copy-other"));
