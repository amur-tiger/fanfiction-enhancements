import { assert } from "chai";
import { JSDOM } from "jsdom";
import * as sinon from "sinon";

import { Chapter, Story } from "../../src/api/data";

describe("Data Objects", function() {
	describe("Chapter", function() {
		beforeEach(function() {
			global["GM_getValue"] = sinon.stub();
			global["GM_setValue"] = sinon.spy();
			global["GM_deleteValue"] = sinon.spy();
		});

		it("should return false from read by default", function() {
			const story: Story = {
				id: 123,
				title: "",
				author: undefined,
				chapters: [],
				meta: undefined,
			};

			const sut = new Chapter(story, 1, "chapter");

			assert.isFalse(sut.read);
			sinon.assert.calledOnce(global["GM_getValue"]);
			sinon.assert.notCalled(global["GM_setValue"]);
			sinon.assert.notCalled(global["GM_deleteValue"]);
		});

		it("should retrieve read value via GM", function() {
			global["GM_getValue"].returns(true);

			const story: Story = {
				id: 123,
				title: "",
				author: undefined,
				chapters: [],
				meta: undefined,
			};

			const sut = new Chapter(story, 1, "chapter");

			assert.isTrue(sut.read);
			sinon.assert.calledOnce(global["GM_getValue"]);
			sinon.assert.notCalled(global["GM_setValue"]);
			sinon.assert.notCalled(global["GM_deleteValue"]);
		});

		it("should set read value via GM", function() {
			const story: Story = {
				id: 123,
				title: "",
				author: undefined,
				chapters: [],
				meta: undefined,
			};

			const sut = new Chapter(story, 1, "chapter");
			sut.read = true;

			sinon.assert.notCalled(global["GM_getValue"]);
			sinon.assert.calledWith(global["GM_setValue"], "ffe-story-123-chapter-1-read", true);
			sinon.assert.notCalled(global["GM_deleteValue"]);
		});

		it("should delete read value via GM", function() {
			const story: Story = {
				id: 123,
				title: "",
				author: undefined,
				chapters: [],
				meta: undefined,
			};

			const sut = new Chapter(story, 1, "chapter");
			sut.read = false;

			sinon.assert.notCalled(global["GM_getValue"]);
			sinon.assert.notCalled(global["GM_setValue"]);
			sinon.assert.calledWith(global["GM_deleteValue"], "ffe-story-123-chapter-1-read");
		});
	});
});
