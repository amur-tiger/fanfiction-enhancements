import { assert } from "chai";
import * as ko from "knockout";
import * as sinon from "sinon";

import { cache, Cache } from "../../src/util/cache";
import { Chapter, Story } from "../../src/api/data";

describe("Data Objects", function() {
	before(function() {
		global["cache"] = new Cache();
	});

	describe("Story", function() {
		let isFollowed;
		let setFollowed;
		let isFavorited;
		let setFavorited;

		beforeEach(function() {
			cache.alerts.isFollowed = isFollowed = sinon.stub();
			cache.alerts.setFollowed = setFollowed = sinon.spy();
			cache.alerts.isFavorited = isFavorited = sinon.stub();
			cache.alerts.setFavorited = setFavorited = sinon.spy();
		});

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
		let isRead;
		let setRead;

		beforeEach(function() {
			cache.read.isRead = isRead = sinon.stub();
			cache.read.setRead = setRead = sinon.spy();
		});

		it("should retrieve read value via cache", function() {
			isRead.returns(true);

			const sut = new Chapter(123, 1, "chapter", 0);

			assert.isTrue(sut.read());
			sinon.assert.calledOnce(isRead);
			sinon.assert.notCalled(setRead);
		});

		it("should set read value via cache", function() {
			isRead.returns(false);

			const sut = new Chapter(123, 1, "chapter", 0);
			sut.read(true);

			sinon.assert.calledOnce(isRead);
			sinon.assert.calledWith(setRead, sut);
		});
	});
});
