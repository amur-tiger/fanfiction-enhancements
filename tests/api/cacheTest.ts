import { assert } from "chai";
import * as td from "testdouble";

import { Cache } from "../../src/api/cache";
import { Chapter, Story } from "../../src/api/data";

describe("Cache", function () {
	beforeEach(function () {
		global["GM_getValue"] = (a, b) => b;
		global["GM_setValue"] = () => undefined;

		td.replace(console, "debug");
	});

	afterEach(function () {
		td.reset();
	});

	describe("Alerts", function () {
		it("should retrieve items from localStorage", async function () {
			const storage = td.object<Storage>();
			const sut = new Cache(storage);

			const list = await sut.getAlerts();

			td.verify(storage.getItem("ffe-cache-alerts"));
			assert.isArray(list);
			assert.isEmpty(list);
		});

		it("should convert items correctly", async function () {
			const storage = td.object<Storage>();
			const sut = new Cache(storage);
			td.when(storage.getItem("ffe-cache-alerts")).thenReturn(JSON.stringify({
				123: {
					data: {
						title: "value",
					},
					timestamp: new Date().getTime(),
				},
			}));

			const list = await sut.getAlerts();

			assert.isArray(list);
			assert.lengthOf(list, 1);
			assert.equal(list[0].title, "value");
		});

		it("should evict expired items", async function () {
			const now = new Date().getTime();
			const storage = td.object<Storage>();
			const sut = new Cache(storage);
			td.when(storage.getItem("ffe-cache-alerts")).thenReturn(JSON.stringify({
				123: {
					data: {
						title: "new",
					},
					timestamp: now,
				},
				321: {
					data: {
						title: "old",
					},
					timestamp: 0,
				},
			}));

			const list = await sut.getAlerts();

			td.verify(storage.setItem("ffe-cache-alerts", JSON.stringify({
				123: {
					data: {
						title: "new",
					},
					timestamp: now,
				},
			})));
			assert.isArray(list);
			assert.lengthOf(list, 1);
			assert.equal(list[0].title, "new");
		});

		it("should delete last entries", async function () {
			const storage = td.object<Storage>();
			const sut = new Cache(storage);
			td.when(storage.getItem("ffe-cache-alerts")).thenReturn(JSON.stringify({
				123: {
					data: {
						title: "old",
					},
					timestamp: 0,
				},
			}));

			const list = await sut.getAlerts();

			td.verify(storage.removeItem("ffe-cache-alerts"));
			assert.isArray(list);
			assert.isEmpty(list);
		});

		it("should find story in cache", async function () {
			const storage = td.object<Storage>();
			const sut = new Cache(storage);
			td.when(storage.getItem("ffe-cache-alerts")).thenReturn(JSON.stringify({
				123: {
					data: {
						title: "value",
					},
					timestamp: new Date().getTime(),
				},
			}));

			const found = await sut.hasAlert(123);

			assert.isTrue(found);
		});

		it("should not find story not in cache", async function () {
			const storage = td.object<Storage>();
			const sut = new Cache(storage);
			td.when(storage.getItem("ffe-cache-alerts")).thenReturn(JSON.stringify({
				123: {
					data: {
						title: "value",
					},
					timestamp: new Date().getTime(),
				},
			}));

			const found = await sut.hasAlert(321);

			assert.isFalse(found);
		});

		it("should put positive state in cache", async function () {
			const now = new Date().getTime();
			const story = td.object<Story>();
			const storage = td.object<Storage>();
			const sut = new Cache(storage);
			(story as any).id = 321;
			td.when(story.follow()).thenReturn(true);
			td.when(storage.getItem("ffe-cache-alerts")).thenReturn(JSON.stringify({
				123: {
					data: {
						title: "value",
					},
					timestamp: now,
				},
			}));

			await sut.putAlert(story);

			td.verify(storage.setItem("ffe-cache-alerts", td.matchers.argThat(value => {
				assert.hasAllKeys(JSON.parse(value), ["123", "321"]);

				return true;
			})));
		});

		it("should remove negative state from cache", async function () {
			const now = new Date().getTime();
			const story = td.object<Story>();
			const storage = td.object<Storage>();
			const sut = new Cache(storage);
			(story as any).id = 123;
			td.when(story.follow()).thenReturn(false);
			td.when(storage.getItem("ffe-cache-alerts")).thenReturn(JSON.stringify({
				123: {
					data: {
						title: "value",
					},
					timestamp: now,
				},
			}));

			await sut.putAlert(story);

			td.verify(storage.removeItem("ffe-cache-alerts"));
		});

		it("should say fresh", async function () {
			const storage = td.object<Storage>();
			const sut = new Cache(storage);
			td.when(storage.getItem("ffe-cache-alerts-scan")).thenReturn(new Date().getTime());

			const fresh = await sut.isAlertsFresh();

			assert.isTrue(fresh);
		});

		it("should not say fresh", async function () {
			const storage = td.object<Storage>();
			const sut = new Cache(storage);

			const fresh = await sut.isAlertsFresh();

			td.verify(storage.getItem("ffe-cache-alerts-scan"));
			assert.isFalse(fresh);
		});

		it("should replace all entries", async function () {
			const storage = td.object<Storage>();
			const sut = new Cache(storage);

			await sut.putAlerts([
				{
					id: 123,
					title: "title",
					author: undefined,
				},
			]);

			td.verify(storage.setItem("ffe-cache-alerts", td.matchers.argThat(function (value) {
				assert.hasAllKeys(JSON.parse(value), ["123"]);

				return true;
			})));
			td.verify(storage.setItem("ffe-cache-alerts-scan", td.matchers.contains(/^\d+$/)));
		});
	});

	describe("Favorites", function () {
		it("should retrieve items from localStorage", async function () {
			const storage = td.object<Storage>();
			const sut = new Cache(storage);
			td.when(storage.getItem("ffe-cache-favorites")).thenReturn(undefined);

			const list = await sut.getFavorites();

			assert.isArray(list);
			assert.isEmpty(list);
		});

		it("should convert items correctly", async function () {
			const storage = td.object<Storage>();
			const sut = new Cache(storage);
			td.when(storage.getItem("ffe-cache-favorites")).thenReturn(JSON.stringify({
				123: {
					data: {
						title: "value",
					},
					timestamp: new Date().getTime(),
				},
			}));

			const list = await sut.getFavorites();

			assert.isArray(list);
			assert.lengthOf(list, 1);
			assert.equal(list[0].title, "value");
		});

		it("should evict expired items", async function () {
			const now = new Date().getTime();
			const storage = td.object<Storage>();
			const sut = new Cache(storage);
			td.when(storage.getItem("ffe-cache-favorites")).thenReturn(JSON.stringify({
				123: {
					data: {
						title: "new",
					},
					timestamp: now,
				},
				321: {
					data: {
						title: "old",
					},
					timestamp: 0,
				},
			}));

			const list = await sut.getFavorites();

			td.verify(storage.setItem("ffe-cache-favorites", JSON.stringify({
				123: {
					data: {
						title: "new",
					},
					timestamp: now,
				},
			})));
			assert.isArray(list);
			assert.lengthOf(list, 1);
			assert.equal(list[0].title, "new");
		});

		it("should delete last entries", async function () {
			const storage = td.object<Storage>();
			const sut = new Cache(storage);
			td.when(storage.getItem("ffe-cache-favorites")).thenReturn(JSON.stringify({
				123: {
					data: {
						title: "old",
					},
					timestamp: 0,
				},
			}));

			const list = await sut.getFavorites();

			td.verify(storage.removeItem("ffe-cache-favorites"));
			assert.isArray(list);
			assert.isEmpty(list);
		});

		it("should find story in cache", async function () {
			const storage = td.object<Storage>();
			const sut = new Cache(storage);
			td.when(storage.getItem("ffe-cache-favorites")).thenReturn(JSON.stringify({
				123: {
					data: {
						title: "value",
					},
					timestamp: new Date().getTime(),
				},
			}));

			const found = await sut.isFavorite(123);

			assert.isTrue(found);
		});

		it("should not find story not in cache", async function () {
			const storage = td.object<Storage>();
			const sut = new Cache(storage);
			td.when(storage.getItem("ffe-cache-favorites")).thenReturn(JSON.stringify({
				123: {
					data: {
						title: "value",
					},
					timestamp: new Date().getTime(),
				},
			}));

			const found = await sut.isFavorite(321);

			assert.isFalse(found);
		});

		it("should put positive state in cache", async function () {
			const now = new Date().getTime();
			const story = td.object<Story>();
			const storage = td.object<Storage>();
			const sut = new Cache(storage);
			(story as any).id = 321;
			td.when(story.favorite()).thenReturn(true);
			td.when(storage.getItem("ffe-cache-favorites")).thenReturn(JSON.stringify({
				123: {
					data: {
						title: "value",
					},
					timestamp: now,
				},
			}));

			await sut.putFavorite(story);

			td.verify(storage.setItem("ffe-cache-favorites", td.matchers.argThat(function (value) {
				assert.hasAllKeys(JSON.parse(value), ["123", "321"]);

				return true;
			})));
		});

		it("should remove negative state from cache", async function () {
			const now = new Date().getTime();
			const story = td.object<Story>();
			const storage = td.object<Storage>();
			const sut = new Cache(storage);
			(story as any).id = 123;
			td.when(story.favorite()).thenReturn(false);
			td.when(storage.getItem("ffe-cache-favorites")).thenReturn(JSON.stringify({
				123: {
					data: {
						title: "value",
					},
					timestamp: now,
				},
			}));

			await sut.putFavorite(story);

			td.verify(storage.removeItem("ffe-cache-favorites"));
		});

		it("should say fresh", async function () {
			const storage = td.object<Storage>();
			const sut = new Cache(storage);
			td.when(storage.getItem("ffe-cache-favorites-scan")).thenReturn(new Date().getTime());

			const fresh = await sut.isFavoritesFresh();

			assert.isTrue(fresh);
		});

		it("should not say fresh", async function () {
			const storage = td.object<Storage>();
			const sut = new Cache(storage);
			td.when(storage.getItem("ffe-cache-favorites-scan")).thenReturn(undefined);

			const fresh = await sut.isFavoritesFresh();

			assert.isFalse(fresh);
		});

		it("should replace all entries", async function () {
			const storage = td.object<Storage>();
			const sut = new Cache(storage);

			await sut.putFavorites([
				{
					id: 123,
					title: "title",
					author: undefined,
				},
			]);

			td.verify(storage.setItem("ffe-cache-favorites", td.matchers.argThat(function (value) {
				assert.hasAllKeys(JSON.parse(value), ["123"]);

				return true;
			})));
			td.verify(storage.setItem("ffe-cache-favorites-scan", td.matchers.contains(/^\d+$/)));
		});
	});

	describe("Story", function () {
		it("should return a story object", async function () {
			const storage = td.object<Storage>();
			const sut = new Cache(storage);
			td.when(storage.getItem("ffe-cache-stories")).thenReturn(JSON.stringify({
				123: {
					data: {
						id: 123,
						title: "story",
						chapters: [
							{
								id: 1,
								name: "chapter",
							},
						],
						meta: {},
					},
					timestamp: new Date().getTime(),
				},
			}));

			const story = await sut.getStory(123);

			assert.instanceOf(story, Story);
			assert.equal(story.id, 123);
			assert.equal(story.title, "story");
			assert.isArray(story.chapters);
			assert.lengthOf(story.chapters, 1);
			assert.instanceOf(story.chapters[0], Chapter);
			assert.equal(story.chapters[0].storyId, 123);
			assert.equal(story.chapters[0].id, 1);
		});

		it("should reject unknown keys", async function () {
			const storage = td.object<Storage>();
			const sut = new Cache(storage);
			td.when(storage.getItem("ffe-cache-stories")).thenReturn(undefined);

			try {
				// cannot use assert.throws() as that does not await the promise
				await sut.getStory(123);
				assert.fail("Promise should have failed");
			} catch (e) {
				assert.instanceOf(e, Error);
				assert.equal(e.message, "Story with id '123' does not exist in cache.");
			}
		});

		it("should add story to cache", async function () {
			const now = new Date().getTime();
			const story = td.object<Story>();
			const storage = td.object<Storage>();
			const sut = new Cache(storage);
			(story as any).id = 321;
			(story as any).chapters = [];
			td.when(story.follow()).thenReturn(true);
			td.when(storage.getItem("ffe-cache-stories")).thenReturn(JSON.stringify({
				123: {
					data: {
						title: "value",
					},
					timestamp: now,
				},
			}));

			await sut.putStory(story);

			td.verify(storage.setItem("ffe-cache-stories", td.matchers.argThat(function (value) {
				assert.hasAllKeys(JSON.parse(value), ["123", "321"]);

				return true;
			})));
		});
	});
});
