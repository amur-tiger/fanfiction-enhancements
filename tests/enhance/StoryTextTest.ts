import { assert } from "chai";
import { JSDOM } from "jsdom";
import * as td from "testdouble";
import { setCookie, timeout } from "../../src/utils";

import { StoryText } from "../../src/enhance/StoryText";

describe("Story Text", function() {
	const dom = new JSDOM();
	const document = dom.window.document;

	beforeEach(function() {
		global["XCOOKIE"] = {};
		global["_fontastic_save"] = td.function("_fontastic_save");

		while (document.lastChild) {
			document.removeChild(document.lastChild);
		}
	});

	it("should fix user-select", async function() {
		const fragment = JSDOM.fragment(`<div id="storytextp" style="user-select: none;"><div id="storytext"></div></div>`)
			.firstChild as HTMLElement;
		document.appendChild(fragment);
		setTimeout(() => fragment.style.userSelect = "none", 200);

		const sut = new StoryText(document);
		await sut.enhance();

		await timeout(350);
		assert.equal(fragment.style.userSelect, "inherit");
	});

	it("should set a better default style", async function() {
		const fragment = JSDOM.fragment(`<div id="storytextp"><div id="storytext"></div></div>`)
			.firstChild as HTMLElement;
		document.appendChild(fragment);

		const sut = new StoryText(document);
		await sut.enhance();

		td.verify(global["_fontastic_save"]());
		assert.equal((fragment.firstElementChild as HTMLElement).style.fontSize, "1.2em");
		assert.equal((fragment.firstElementChild as HTMLElement).style.lineHeight, "2.00");
	});

	it("should not set styles if styles were modified", async function() {
		setCookie("xcookie2", "dummy");
		const fragment = JSDOM.fragment(`<div id="storytextp"><div id="storytext"></div></div>`)
			.firstChild as HTMLElement;
		document.appendChild(fragment);

		const sut = new StoryText(document);
		await sut.enhance();

		assert.equal((fragment.firstElementChild as HTMLElement).style.fontSize, "");
		assert.equal((fragment.firstElementChild as HTMLElement).style.lineHeight, "");
	});
});
