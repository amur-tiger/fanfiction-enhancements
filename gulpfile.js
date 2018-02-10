const path = require("path");

const gulp = require("gulp");
const clean = require("gulp-clean");
const rollup = require("gulp-rollup");
const replace = require("gulp-replace");
const concat = require("gulp-concat");
const merge = require("merge-stream");

const typescript = require("rollup-plugin-typescript2");

const pkg = require("./package.json");
const external = Object.keys(pkg.dependencies || {});

const OUT_FOLDER = "target";

gulp.task("build", () => {
	"use strict";

	const build = process.env.TRAVIS_BUILD_NUMBER;
	const commit = process.env.TRAVIS_COMMIT;
	const version = pkg.version +
		(build || commit ? "+" : "") +
		(build ? build : "") +
		(build && commit ? "." : "") +
		(commit ? commit.substr(0, 7) : "");

	const header = gulp.src("./src/header.txt")
		.pipe(replace(/\${version}/g, version))
		.pipe(replace(/\${description}/g, pkg.description))
		.pipe(replace(/\${author}/g, pkg.author))
		.pipe(replace(/\${homepage}/g, pkg.homepage))
		.pipe(replace(/\${bugs}/g, pkg.bugs.url));

	const source = gulp.src("./src/**/*.ts")
		.pipe(rollup({
			input: "src/main.ts",
			plugins: [
				typescript()
			],
			external: external,
			output: {
				format: "iife"
			}
		}));

	merge(header, source)
		.pipe(concat(pkg.main))
		.pipe(gulp.dest(path.join(OUT_FOLDER, "latest")));

	const meta = pkg.main.replace(".user.js", ".meta.js");
	header
		.pipe(concat(meta))
		.pipe(gulp.dest(path.join(OUT_FOLDER, "latest")));

	gulp.src("./README.md").pipe(gulp.dest(OUT_FOLDER));
	gulp.src("./LICENSE").pipe(gulp.dest(OUT_FOLDER));
});

gulp.task("watch", () => {
	"use strict";

	gulp.watch("./src/**/*.ts", ["build"]);
	gulp.watch("./src/header.txt", ["build"]);
	gulp.watch("./package.json", ["build"]);
});

gulp.task("clean", () => {
	"use strict";

	gulp.src(["src/**/*.js", "tests/**/*.js", OUT_FOLDER])
		.pipe(clean());
});
