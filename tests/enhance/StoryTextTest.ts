import { assert } from "chai";
import { JSDOM } from "jsdom";

import { setCookie } from "../../src/utils";
import { StoryText } from "../../src/enhance/StoryText";

describe("Story Text", function() {
	const dom = new JSDOM();
	const document = dom.window.document;

	global["XCOOKIE"] = {};
	global["_fontastic_save"] = () => {
		// no operation
	};

	beforeEach(function() {
		Array.from(document.children).forEach(child => document.removeChild(child));
	});

	it("should fix user-select", function(done) {
		const fragment = JSDOM.fragment(`<div id="storytextp" style="user-select: none;"><div id="storytext"></div></div>`)
			.firstChild as HTMLElement;
		document.appendChild(fragment);
		setTimeout(() => fragment.style.userSelect = "none", 200);

		const sut = new StoryText(document);
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
		document.appendChild(fragment);

		const sut = new StoryText(document);
		sut.enhance();

		assert.isTrue(hit, "should save styles");
		assert.equal((fragment.firstElementChild as HTMLElement).style.fontSize, "1.2em");
		assert.equal((fragment.firstElementChild as HTMLElement).style.lineHeight, "2.00");
	});

	it("should not set styles if styles were modified", function() {
		setCookie("xcookie2", "dummy value");
		const fragment = JSDOM.fragment(`<div id="storytextp"><div id="storytext"></div></div>`)
			.firstChild as HTMLElement;
		document.appendChild(fragment);

		const sut = new StoryText(document);
		sut.enhance();

		assert.equal((fragment.firstElementChild as HTMLElement).style.fontSize, "");
		assert.equal((fragment.firstElementChild as HTMLElement).style.lineHeight, "");
	});
});
