import * as fs from "fs";
import * as path from "path";

import * as gulp from "gulp";
import * as clean from "gulp-clean";

import * as rollup from "rollup";
import * as postCss from "rollup-plugin-postcss";
import * as typescript from "rollup-plugin-typescript2";

const PACKAGE = JSON.parse(fs.readFileSync("./package.json").toString("utf-8"));
const EXTERNAL = Object.keys(PACKAGE.dependencies || {});
const OUT_FOLDER = "target";

function getHeader(): string {
	const build = process.env.TRAVIS_BUILD_NUMBER;
	const commit = process.env.TRAVIS_COMMIT;
	const version = PACKAGE.version +
		(build || commit ? "+" : "") +
		(build ? build : "") +
		(build && commit ? "." : "") +
		(commit ? commit.substr(0, 7) : "");

	let header = fs.readFileSync("./src/header.txt").toString("utf-8");

	header = header.replace(/\${version}/g, version)
		.replace(/\${description}/g, PACKAGE.description)
		.replace(/\${author}/g, PACKAGE.author)
		.replace(/\${homepage}/g, PACKAGE.homepage)
		.replace(/\${bugs}/g, PACKAGE.bugs.url);

	for (const pkg of EXTERNAL) {
		const searchKey = `\${${pkg}.version}`;
		header = header.split(searchKey).join(PACKAGE.dependencies[pkg].replace(/^[~^]/, ""));
	}

	return header;
}

gulp.task("build-source", () => {
	return rollup.rollup({
		input: "./src/main.ts",
		external: EXTERNAL,
		plugins: [
			postCss(),
			(typescript as any)(),
		],
	}).then(bundle => {
		return bundle.write({
			file: path.join(OUT_FOLDER, "latest", PACKAGE.main),
			format: "iife",
			banner: getHeader(),
			globals: {
				jquery: "jQuery",
				knockout: "ko",
			},
		});
	});
});

gulp.task("build-meta", done => {
	fs.existsSync(OUT_FOLDER) || fs.mkdirSync(OUT_FOLDER);
	fs.existsSync(path.join(OUT_FOLDER, "latest")) || fs.mkdirSync(path.join(OUT_FOLDER, "latest"));

	fs.writeFileSync(path.join(OUT_FOLDER, "latest", PACKAGE.main.replace(".user.js", ".meta.js")), getHeader());

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

gulp.task("clean-js-map", () => {
	return gulp.src(["src/**/*.{js,map}", "tests/**/*.{js,map}"]).pipe(clean());
});

gulp.task("clean-target", () => {
	return gulp.src(OUT_FOLDER, { allowEmpty: true }).pipe(clean());
});

gulp.task("clean", gulp.parallel("clean-js-map", "clean-target"));
