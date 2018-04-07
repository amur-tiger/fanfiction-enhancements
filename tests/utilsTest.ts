import { assert } from "chai";
import { JSDOM } from "jsdom";

import { getByAjax, loadScript, ptToEm, rgbToHex } from "../src/utils";

describe("Utility Functions", function() {
	const domFragment = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
	global["window"] = domFragment.window;
	global["document"] = domFragment.window.document;

	describe("Loading Scripts", function() {
		it("should return a promise", function() {
			const promise = loadScript("some url");
			assert.isTrue(promise instanceof Promise);
			promise.catch(() => {
				// do nothing
			});
		});
	});

	describe("Making XHR GET calls", function() {
		it("should return a promise", function() {
			const promise = getByAjax("some url");
			assert.isTrue(promise instanceof Promise);
			promise.catch(() => {
				// do nothing
			});
		});
	});

	describe("Parsing RGB values", function() {
		it("should parse valid RGB values", function() {
			assert.equal(rgbToHex("rgb(82,160,186)"), "#52a0ba");
			assert.equal(rgbToHex("rgb(151, 186, 82)"), "#97ba52");
			assert.equal(rgbToHex("rgb(242,12,146)"), "#f20c92");
		});

		it("should return false on black or inherit", function() {
			assert.equal(rgbToHex("rgb(0,0,0)"), false);
			assert.equal(rgbToHex("inherit"), false);
		});

		it("should return false on an invalid value", function() {
			assert.equal(rgbToHex(""), false);
			assert.equal(rgbToHex("true"), false);
			assert.equal(rgbToHex("#f2df0c"), false);
			assert.equal(rgbToHex("2345.23"), false);
			assert.equal(rgbToHex(undefined), false);
		});
	});

	describe("Converting PT to EM", function() {
		it("should convert valid pt values", function() {
			assert.equal(ptToEm("14pt"), "1.167em");
			assert.equal(ptToEm("6pt"), "0.5em");
			assert.equal(ptToEm("24pt"), "2em");
		});

		it("should return false for 11pt and 12pt", function() {
			assert.equal(ptToEm("11pt"), false);
			assert.equal(ptToEm("12pt"), false);
		});

		it("should return false on an invalid value", function() {
			assert.equal(ptToEm("24"), false);
			assert.equal(ptToEm("size"), false);
			assert.equal(ptToEm("16px"), false);
			assert.equal(ptToEm("32.23"), false);
			assert.equal(ptToEm(undefined), false);
		});

		it("should scale sizes correctly if given", function() {
			assert.equal(ptToEm("12pt", 12), false);
			assert.equal(ptToEm("14pt", 14), false);
			assert.equal(ptToEm("24pt", 24), false);
			assert.equal(ptToEm("12pt", 24), "0.5em");
			assert.equal(ptToEm("24pt", 12), "2em");
			assert.equal(ptToEm("24pt", 16), "1.5em");
			assert.equal(ptToEm("12pt", 16), "0.75em");
		});
	});
});
