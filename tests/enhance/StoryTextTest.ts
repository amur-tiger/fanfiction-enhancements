import { assert } from "chai";
import { JSDOM } from "jsdom";

import { setCookie } from "../../src/utils";
import { StoryText } from "../../src/enhance/StoryText";

describe("Story Text", function() {
	const domFragment = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
	global["window"] = domFragment.window;
	global["document"] = domFragment.window.document;
	global["XCOOKIE"] = {};
	global["_fontastic_save"] = () => {
		// dummy function
	};

	it("should fix user-select", function(done) {
		const fragment = JSDOM.fragment(`<div id="storytextp" style="user-select: none;"><div id="storytext"></div></div>`)
			.firstChild as HTMLElement;
		setTimeout(() => fragment.style.userSelect = "none", 200);

		const sut = new StoryText(fragment);
		sut.enhance();

		setTimeout(() => {
			assert.equal(fragment.style.userSelect, "inherit");
			done();
		}, 350);
	});

	it("should set a better default style", function() {
		let hit = false;
		global["_fontastic_save"] = () => hit = true;
		const fragment = JSDOM.fragment(`<div id="storytextp"><div id="storytext"></div></div>`)
			.firstChild as HTMLElement;
		const sut = new StoryText(fragment);
		sut.enhance();

		assert.isTrue(hit, "should save styles");
		assert.equal((fragment.firstElementChild as HTMLElement).style.fontSize, "1.2em");
		assert.equal((fragment.firstElementChild as HTMLElement).style.lineHeight, "2.00");
	});

	it("should not set styles if styles were modified", function() {
		setCookie("xcookie2", "dummy value");
		const fragment = JSDOM.fragment(`<div id="storytextp"><div id="storytext"></div></div>`)
			.firstChild as HTMLElement;
		const sut = new StoryText(fragment);
		sut.enhance();

		assert.equal((fragment.firstElementChild as HTMLElement).style.fontSize, "");
		assert.equal((fragment.firstElementChild as HTMLElement).style.lineHeight, "");
	});
});
