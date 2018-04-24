import { assert } from "chai";
import { JSDOM } from "jsdom";
import * as ko from "knockout";
import * as sinon from "sinon";

import { Chapter, Story } from "../../src/api/data";

describe("Data Objects", function() {
	describe("Story", function() {
		it("should report read if all chapters are read", function() {
			const a = { read: ko.observable(true) };
			const b = { read: ko.observable(true) };

			const sut = new Story(0, "", {
				id: 0,
				name: "",
				profileUrl: "",
				avatarUrl: "",
			}, "", [a, b] as any, {});

			assert.isTrue(sut.read());
		});

		it("should report unread if some chapters are unread", function() {
			const a = { read: ko.observable(true) };
			const b = { read: ko.observable(false) };

			const sut = new Story(0, "", {
				id: 0,
				name: "",
				profileUrl: "",
				avatarUrl: "",
			}, "", [a, b] as any, {});

			assert.isFalse(sut.read());
		});

		it("should set all chapters read", function() {
			const a = { read: ko.observable(true) };
			const b = { read: ko.observable(false) };

			const sut = new Story(0, "", {
				id: 0,
				name: "",
				profileUrl: "",
				avatarUrl: "",
			}, "", [a, b] as any, {});

			sut.read(true);

			assert.isTrue(a.read());
			assert.isTrue(b.read());
		});

		it("should set all chapters unread", function() {
			const a = { read: ko.observable(true) };
			const b = { read: ko.observable(false) };

			const sut = new Story(0, "", {
				id: 0,
				name: "",
				profileUrl: "",
				avatarUrl: "",
			}, "", [a, b] as any, {});

			sut.read(false);

			assert.isFalse(a.read());
			assert.isFalse(b.read());
		});
	});

	describe("Chapter", function() {
		let gmGetValue;
		let gmSetValue;
		let gmDeleteValue;

		beforeEach(function() {
			global["GM_getValue"] = gmGetValue = sinon.stub();
			global["GM_setValue"] = gmSetValue = sinon.spy();
			global["GM_deleteValue"] = gmDeleteValue = sinon.spy();
		});

		it("should return false from read by default", function() {
			const sut = new Chapter(123, 1, "chapter");

			assert.isFalse(sut.read());
			sinon.assert.calledOnce(gmGetValue);
			sinon.assert.notCalled(gmSetValue);
			sinon.assert.notCalled(gmDeleteValue);
		});

		it("should retrieve read value via GM", function() {
			gmGetValue.returns(true);

			const sut = new Chapter(123, 1, "chapter");

			assert.isTrue(sut.read());
			sinon.assert.calledOnce(gmGetValue);
			sinon.assert.notCalled(gmSetValue);
			sinon.assert.notCalled(gmDeleteValue);
		});

		it("should set read value via GM", function() {
			const sut = new Chapter(123, 1, "chapter");
			sut.read(true);

			sinon.assert.calledOnce(gmGetValue);
			sinon.assert.calledWith(gmSetValue, "ffe-story-123-chapter-1-read", true);
			sinon.assert.notCalled(gmDeleteValue);
		});

		it("should delete read value via GM", function() {
			gmGetValue.returns(true);

			const sut = new Chapter(123, 1, "chapter");
			sut.read(false);

			sinon.assert.calledOnce(gmGetValue);
			sinon.assert.notCalled(gmSetValue);
			sinon.assert.calledWith(gmDeleteValue, "ffe-story-123-chapter-1-read");
		});
	});
});
