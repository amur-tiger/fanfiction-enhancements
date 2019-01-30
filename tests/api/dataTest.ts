import { assert } from "chai";
import * as td from "testdouble";

import { cache } from "../../src/util/cache";
import { Chapter, Story } from "../../src/api/data";

describe("Data Objects", function() {
	beforeEach(function () {
		global["GM_getValue"] = td.function("GM_getValue");
	});

	afterEach(function() {
		td.reset();
	});

	describe("Story", function() {
		it("should report read if all chapters are read", function() {
			const a = { read: () => true };
			const b = { read: () => true };

			const sut = new Story(0, "", undefined, "", [a, b] as any, {});

			assert.isTrue(sut.read());
		});

		it("should report unread if some chapters are unread", function() {
			const a = { read: () => true };
			const b = { read: () => false };

			const sut = new Story(0, "", undefined, "", [a, b] as any, {});

			assert.isFalse(sut.read());
		});

		it("should set all chapters read", function() {
			const a = { read: td.function() };
			const b = { read: td.function() };
			td.when(a.read()).thenReturn(true);
			td.when(b.read()).thenReturn(false);

			const sut = new Story(0, "", undefined, "", [a, b] as any, {});

			sut.read(true);

			td.verify(a.read(true));
			td.verify(b.read(true));
		});

		it("should set all chapters unread", function() {
			const a = { read: td.function() };
			const b = { read: td.function() };
			td.when(a.read()).thenReturn(true);
			td.when(b.read()).thenReturn(false);

			const sut = new Story(0, "", undefined, "", [a, b] as any, {});

			sut.read(false);

			td.verify(a.read(false));
			td.verify(b.read(false));
		});
	});

	describe("Chapter", function() {
		it("should retrieve read value via cache", function() {
			td.replace(cache, "read");
			td.when(cache.read.isRead(td.matchers.anything())).thenReturn(true);

			const sut = new Chapter(123, 1, "chapter", 0);

			assert.isTrue(sut.read());
		});

		it("should set read value via cache", function() {
			td.replace(cache, "read");
			td.when(cache.read.isRead(td.matchers.anything())).thenReturn(false);

			const sut = new Chapter(123, 1, "chapter", 0);
			sut.read(true);

			td.verify(cache.read.setRead(sut));
		});
	});
});
