import { assert } from "chai";
import * as jQuery from "jquery";
import { JSDOM } from "jsdom";
import * as sinon from "sinon";

import { setCookie } from "../../src/utils";
import { StoryText } from "../../src/enhance/StoryText";

describe("Story Text", function() {
	const dom = new JSDOM();
	const document = dom.window.document;

	let fontasticSave;
	beforeEach(function() {
		global["XCOOKIE"] = {};
		global["_fontastic_save"] = fontasticSave = sinon.spy();

		while (document.lastChild) {
			document.removeChild(document.lastChild);
		}
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
		const fragment = JSDOM.fragment(`<div id="storytextp"><div id="storytext"></div></div>`)
			.firstChild as HTMLElement;
		document.appendChild(fragment);

		const sut = new StoryText(document);
		sut.enhance();

		sinon.assert.calledOnce(fontasticSave);
		assert.equal((fragment.firstElementChild as HTMLElement).style.fontSize, "1.2em");
		assert.equal((fragment.firstElementChild as HTMLElement).style.lineHeight, "2.00");
	});

	it("should not set styles if styles were modified", function() {
		jQuery.cookie("xcookie2", "dummy");
		const fragment = JSDOM.fragment(`<div id="storytextp"><div id="storytext"></div></div>`)
			.firstChild as HTMLElement;
		document.appendChild(fragment);

		const sut = new StoryText(document);
		sut.enhance();

		assert.equal((fragment.firstElementChild as HTMLElement).style.fontSize, "");
		assert.equal((fragment.firstElementChild as HTMLElement).style.lineHeight, "");
	});
});
