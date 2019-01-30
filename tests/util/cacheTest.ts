import { assert } from "chai";
import * as td from "testdouble";

import { Cache } from "../../src/util/cache";

describe("Cache", function() {
	let gmGetValue;
	let gmSetValue;

	beforeEach(function() {
		global["GM_getValue"] = gmGetValue = td.function("GM_getValue");
		global["GM_setValue"] = gmSetValue = td.function("GM_getValue");
	});

	describe("Read", function() {
		it("should return false if no data is present", function() {
			td.when(gmGetValue("ffe-cache-read", "{}")).thenReturn("{}");
			const chapter = {
				storyId: 123,
				id: 1,
			};

			const sut = new Cache();

			assert.isFalse(sut.read.isRead(chapter as any));
		});

		it("should return saved data", function() {
			td.when(gmGetValue("ffe-cache-read", "{}")).thenReturn(JSON.stringify({
				123: {
					1: true,
					2: false,
				},
			}));
			const chapter1 = {
				storyId: 123,
				id: 1,
			};
			const chapter2 = {
				storyId: 123,
				id: 2,
			};

			const sut = new Cache();

			assert.isTrue(sut.read.isRead(chapter1 as any));
			assert.isFalse(sut.read.isRead(chapter2 as any));
		});

		it("should save data", function() {
			td.when(gmGetValue("ffe-cache-read", "{}")).thenReturn("{}");
			const chapter = {
				storyId: 123,
				id: 1,
				read: () => true,
			};

			const sut = new Cache();
			sut.read.setRead(chapter as any);

			td.verify(gmSetValue("ffe-cache-read", JSON.stringify({
				123: {
					1: true,
				},
			})));
		});

		it("should merge data instead of overwriting", function() {
			td.when(gmGetValue("ffe-cache-read", "{}")).thenReturn(JSON.stringify({
				101: {
					1: true,
				},
				123: {
					1: true,
				},
			}));
			const chapter = {
				storyId: 123,
				id: 2,
				read: () => true,
			};

			const sut = new Cache();
			sut.read.setRead(chapter as any);

			td.verify(gmSetValue("ffe-cache-read", JSON.stringify({
				101: {
					1: true,
				},
				123: {
					1: true,
					2: true,
				},
			})));
		});
	});
});
