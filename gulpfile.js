const gulp = require("gulp");
const rollup = require("gulp-rollup");
const replace = require("gulp-replace");
const concat = require("gulp-concat");
const merge = require("merge-stream");

const typescript = require("rollup-plugin-typescript2");

const pkg = require("./package.json");
const external = Object.keys(pkg.dependencies || {});

gulp.task("build", () => {
	"use strict";

	const header = gulp.src("./src/header.txt")
		.pipe(replace(/\${version}/g, pkg.version))
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
		.pipe(gulp.dest("./latest/"));

	const meta = pkg.main.replace(".user.js", ".meta.js");
	header
		.pipe(concat(meta))
		.pipe(gulp.dest("./latest/"));
});

gulp.task("watch", () => {
	"use strict";

	gulp.watch("./src/**/*.ts", ["build"]);
	gulp.watch("./src/header.txt", ["build"]);
	gulp.watch("./package.json", ["build"]);
});
