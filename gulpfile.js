const path = require("path");
const fs = require("fs");

const gulp = require("gulp");
const clean = require("gulp-clean");

const rollup = require("rollup");
const postCss = require("rollup-plugin-postcss");
const typescript = require("rollup-plugin-typescript2");

const pkg = require("./package.json");
const external = Object.keys(pkg.dependencies || {});

const OUT_FOLDER = "target";

function asPromise(call, ...args) {
	return new Promise((resolve, reject) => {
		args.push(function (err, data) {
			if (err) {
				reject(err);
			}

			resolve(data);
		});

		call.apply(this, args);
	});
}

function getHeader() {
	const build = process.env.TRAVIS_BUILD_NUMBER;
	const commit = process.env.TRAVIS_COMMIT;
	const version = pkg.version +
		(build || commit ? "+" : "") +
		(build ? build : "") +
		(build && commit ? "." : "") +
		(commit ? commit.substr(0, 7) : "");

	return asPromise(fs.readFile, "./src/header.txt")
		.then(header => {
			return header.toString()
				.replace(/\${version}/g, version)
				.replace(/\${description}/g, pkg.description)
				.replace(/\${author}/g, pkg.author)
				.replace(/\${homepage}/g, pkg.homepage)
				.replace(/\${bugs}/g, pkg.bugs.url);
		});
}

gulp.task("build", ["build-source", "build-meta", "build-copy-other"]);

gulp.task("build-source", () => {
	return rollup.rollup({
		input: "./src/main.ts",
		external: external,
		plugins: [
			postCss(),
			typescript(),
		],
	}).then(bundle => {
		return bundle.write({
			file: path.join(OUT_FOLDER, "latest", pkg.main),
			format: "iife",
			banner: getHeader,
		});
	});
});

gulp.task("build-meta", () => {
	return getHeader()
		.then(header => {
			fs.existsSync(OUT_FOLDER) || fs.mkdirSync(OUT_FOLDER);
			fs.existsSync(path.join(OUT_FOLDER, "latest")) || fs.mkdirSync(path.join(OUT_FOLDER, "latest"));

			return asPromise(fs.writeFile, path.join(OUT_FOLDER, "latest",
				pkg.main.replace(".user.js", ".meta.js")), header);
		});
});

gulp.task("build-copy-other", ["build-copy-readme", "build-copy-license"]);

gulp.task("build-copy-readme", () => {
	return gulp.src("./README.md").pipe(gulp.dest(OUT_FOLDER));
});

gulp.task("build-copy-license", () => {
	return gulp.src("./LICENSE").pipe(gulp.dest(OUT_FOLDER));
});

gulp.task("clean", () => {
	return gulp.src(["src/**/*.{js,map}", "tests/**/*.{js,map}", OUT_FOLDER]).pipe(clean());
});
