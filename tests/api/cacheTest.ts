import { assert } from "chai";
import { assert as sAssert, fake, match, SinonSpy } from "sinon";

import { Cache } from "../../src/api/cache";
import { Chapter, Story } from "../../src/api/data";

describe("Cache", function () {
	const consoleDebugSave = console.debug;

	before(function () {
		console.debug = () => undefined;
	});

	after(function () {
		console.debug = consoleDebugSave;
	});

	describe("Alerts", function () {
		it("should retrieve items from localStorage", function () {
			const storage: Storage = {} as any;
			storage.getItem = fake.returns(undefined);
			const sut = new Cache(storage);

			const result = sut.getAlerts();

			return result.then(list => {
				sAssert.calledOnce(storage.getItem as SinonSpy);
				sAssert.calledWith(storage.getItem as SinonSpy, "ffe-cache-alerts");

				assert.isArray(list);
				assert.isEmpty(list);
			});
		});

		it("should convert items correctly", function () {
			const storage: Storage = {} as any;
			storage.getItem = fake.returns(JSON.stringify({
				123: {
					data: {
						title: "value",
					},
					timestamp: new Date().getTime(),
				},
			}));
			const sut = new Cache(storage);

			const result = sut.getAlerts();

			return result.then(list => {
				sAssert.calledOnce(storage.getItem as SinonSpy);
				sAssert.calledWith(storage.getItem as SinonSpy, "ffe-cache-alerts");

				assert.isArray(list);
				assert.lengthOf(list, 1);
				assert.equal(list[0].title, "value");
			});
		});

		it("should evict expired items", function () {
			const now = new Date().getTime();
			const storage: Storage = {} as any;
			storage.getItem = fake.returns(JSON.stringify({
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
			storage.setItem = fake();
			const sut = new Cache(storage);

			const result = sut.getAlerts();

			return result.then(list => {
				sAssert.calledOnce(storage.getItem as SinonSpy);
				sAssert.calledWith(storage.getItem as SinonSpy, "ffe-cache-alerts");
				sAssert.calledOnce(storage.setItem as SinonSpy);
				sAssert.calledWith(storage.setItem as SinonSpy, "ffe-cache-alerts", JSON.stringify({
					123: {
						data: {
							title: "new",
						},
						timestamp: now,
					},
				}));

				assert.isArray(list);
				assert.lengthOf(list, 1);
				assert.equal(list[0].title, "new");
			});
		});

		it("should delete last entries", function () {
			const storage: Storage = {} as any;
			storage.getItem = fake.returns(JSON.stringify({
				123: {
					data: {
						title: "old",
					},
					timestamp: 0,
				},
			}));
			storage.removeItem = fake();
			const sut = new Cache(storage);

			const result = sut.getAlerts();

			return result.then(list => {
				sAssert.calledOnce(storage.getItem as SinonSpy);
				sAssert.calledWith(storage.getItem as SinonSpy, "ffe-cache-alerts");
				sAssert.calledOnce(storage.removeItem as SinonSpy);
				sAssert.calledWith(storage.removeItem as SinonSpy, "ffe-cache-alerts");

				assert.isArray(list);
				assert.isEmpty(list);
			});
		});

		it("should find story in cache", function () {
			const storage: Storage = {} as any;
			storage.getItem = fake.returns(JSON.stringify({
				123: {
					data: {
						title: "value",
					},
					timestamp: new Date().getTime(),
				},
			}));
			const sut = new Cache(storage);

			const result = sut.hasAlert(123);

			return result.then(found => {
				assert.isTrue(found);
			});
		});

		it("should not find story not in cache", function () {
			const storage: Storage = {} as any;
			storage.getItem = fake.returns(JSON.stringify({
				123: {
					data: {
						title: "value",
					},
					timestamp: new Date().getTime(),
				},
			}));
			const sut = new Cache(storage);

			const result = sut.hasAlert(321);

			return result.then(found => {
				assert.isFalse(found);
			});
		});

		it("should put positive state in cache", function () {
			const now = new Date().getTime();
			const story: Story = {
				id: 321,
			} as any;
			(story as any).follow = () => true;
			const storage: Storage = {} as any;
			storage.getItem = fake.returns(JSON.stringify({
				123: {
					data: {
						title: "value",
					},
					timestamp: now,
				},
			}));
			storage.setItem = fake();
			const sut = new Cache(storage);

			const result = sut.putAlert(story);

			return result.then(mirror => {
				sAssert.calledOnce(storage.getItem as SinonSpy);
				sAssert.calledWith(storage.getItem as SinonSpy, "ffe-cache-alerts");
				sAssert.calledOnce(storage.setItem as SinonSpy);
				sAssert.calledWith(storage.setItem as SinonSpy, "ffe-cache-alerts", match(function (value) {
					assert.hasAllKeys(JSON.parse(value), ["123", "321"]);

					return true;
				}));

				assert.equal(mirror, story);
			});
		});

		it("should remove negative state from cache", function () {
			const now = new Date().getTime();
			const story: Story = {
				id: 123,
			} as any;
			(story as any).follow = () => false;
			const storage: Storage = {} as any;
			storage.getItem = fake.returns(JSON.stringify({
				123: {
					data: {
						title: "value",
					},
					timestamp: now,
				},
			}));
			storage.removeItem = fake();
			const sut = new Cache(storage);

			const result = sut.putAlert(story);

			return result.then(mirror => {
				sAssert.calledOnce(storage.getItem as SinonSpy);
				sAssert.calledWith(storage.getItem as SinonSpy, "ffe-cache-alerts");
				sAssert.calledOnce(storage.removeItem as SinonSpy);
				sAssert.calledWith(storage.removeItem as SinonSpy, "ffe-cache-alerts");

				assert.equal(mirror, story);
			});
		});

		it("should say fresh", function () {
			const storage: Storage = {} as any;
			storage.getItem = fake.returns(new Date().getTime());
			const sut = new Cache(storage);

			const result = sut.isAlertsFresh();

			return result.then(fresh => {
				sAssert.calledOnce(storage.getItem as SinonSpy);
				sAssert.calledWith(storage.getItem as SinonSpy, "ffe-cache-alerts-scan");

				assert.isTrue(fresh);
			});
		});

		it("should not say fresh", function () {
			const storage: Storage = {} as any;
			storage.getItem = fake.returns(undefined);
			const sut = new Cache(storage);

			const result = sut.isAlertsFresh();

			return result.then(fresh => {
				sAssert.calledOnce(storage.getItem as SinonSpy);
				sAssert.calledWith(storage.getItem as SinonSpy, "ffe-cache-alerts-scan");

				assert.isFalse(fresh);
			});
		});

		it("should replace all entries", function () {
			const storage: Storage = {} as any;
			storage.setItem = fake();
			const sut = new Cache(storage);

			const result = sut.putAlerts([
				{
					id: 123,
					title: "title",
					author: undefined,
				},
			]);

			return result.then(list => {
				sAssert.calledTwice(storage.setItem as SinonSpy);
				sAssert.calledWith(storage.setItem as SinonSpy, "ffe-cache-alerts", match(function (value) {
					assert.hasAllKeys(JSON.parse(value), ["123"]);

					return true;
				}));
				sAssert.calledWith(storage.setItem as SinonSpy, "ffe-cache-alerts-scan", match(/\d+/));

				assert.isArray(list);
				assert.lengthOf(list, 1);
				assert.equal(list[0].title, "title");
			});
		});
	});

	describe("Favorites", function () {
		it("should retrieve items from localStorage", function () {
			const storage: Storage = {} as any;
			storage.getItem = fake.returns(undefined);
			const sut = new Cache(storage);

			const result = sut.getFavorites();

			return result.then(list => {
				sAssert.calledOnce(storage.getItem as SinonSpy);
				sAssert.calledWith(storage.getItem as SinonSpy, "ffe-cache-favorites");

				assert.isArray(list);
				assert.isEmpty(list);
			});
		});

		it("should convert items correctly", function () {
			const storage: Storage = {} as any;
			storage.getItem = fake.returns(JSON.stringify({
				123: {
					data: {
						title: "value",
					},
					timestamp: new Date().getTime(),
				},
			}));
			const sut = new Cache(storage);

			const result = sut.getFavorites();

			return result.then(list => {
				sAssert.calledOnce(storage.getItem as SinonSpy);
				sAssert.calledWith(storage.getItem as SinonSpy, "ffe-cache-favorites");

				assert.isArray(list);
				assert.lengthOf(list, 1);
				assert.equal(list[0].title, "value");
			});
		});

		it("should evict expired items", function () {
			const now = new Date().getTime();
			const storage: Storage = {} as any;
			storage.getItem = fake.returns(JSON.stringify({
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
			storage.setItem = fake();
			const sut = new Cache(storage);

			const result = sut.getFavorites();

			return result.then(list => {
				sAssert.calledOnce(storage.getItem as SinonSpy);
				sAssert.calledWith(storage.getItem as SinonSpy, "ffe-cache-favorites");
				sAssert.calledOnce(storage.setItem as SinonSpy);
				sAssert.calledWith(storage.setItem as SinonSpy, "ffe-cache-favorites", JSON.stringify({
					123: {
						data: {
							title: "new",
						},
						timestamp: now,
					},
				}));

				assert.isArray(list);
				assert.lengthOf(list, 1);
				assert.equal(list[0].title, "new");
			});
		});

		it("should delete last entries", function () {
			const storage: Storage = {} as any;
			storage.getItem = fake.returns(JSON.stringify({
				123: {
					data: {
						title: "old",
					},
					timestamp: 0,
				},
			}));
			storage.removeItem = fake();
			const sut = new Cache(storage);

			const result = sut.getFavorites();

			return result.then(list => {
				sAssert.calledOnce(storage.getItem as SinonSpy);
				sAssert.calledWith(storage.getItem as SinonSpy, "ffe-cache-favorites");
				sAssert.calledOnce(storage.removeItem as SinonSpy);
				sAssert.calledWith(storage.removeItem as SinonSpy, "ffe-cache-favorites");

				assert.isArray(list);
				assert.isEmpty(list);
			});
		});

		it("should find story in cache", function () {
			const storage: Storage = {} as any;
			storage.getItem = fake.returns(JSON.stringify({
				123: {
					data: {
						title: "value",
					},
					timestamp: new Date().getTime(),
				},
			}));
			const sut = new Cache(storage);

			const result = sut.isFavorite(123);

			return result.then(found => {
				assert.isTrue(found);
			});
		});

		it("should not find story not in cache", function () {
			const storage: Storage = {} as any;
			storage.getItem = fake.returns(JSON.stringify({
				123: {
					data: {
						title: "value",
					},
					timestamp: new Date().getTime(),
				},
			}));
			const sut = new Cache(storage);

			const result = sut.isFavorite(321);

			return result.then(found => {
				assert.isFalse(found);
			});
		});

		it("should put positive state in cache", function () {
			const now = new Date().getTime();
			const story: Story = {
				id: 321,
			} as any;
			(story as any).favorite = () => true;
			const storage: Storage = {} as any;
			storage.getItem = fake.returns(JSON.stringify({
				123: {
					data: {
						title: "value",
					},
					timestamp: now,
				},
			}));
			storage.setItem = fake();
			const sut = new Cache(storage);

			const result = sut.putFavorite(story);

			return result.then(mirror => {
				sAssert.calledOnce(storage.getItem as SinonSpy);
				sAssert.calledWith(storage.getItem as SinonSpy, "ffe-cache-favorites");
				sAssert.calledOnce(storage.setItem as SinonSpy);
				sAssert.calledWith(storage.setItem as SinonSpy, "ffe-cache-favorites", match(function (value) {
					assert.hasAllKeys(JSON.parse(value), ["123", "321"]);

					return true;
				}));

				assert.equal(mirror, story);
			});
		});

		it("should remove negative state from cache", function () {
			const now = new Date().getTime();
			const story: Story = {
				id: 123,
			} as any;
			(story as any).favorite = () => false;
			const storage: Storage = {} as any;
			storage.getItem = fake.returns(JSON.stringify({
				123: {
					data: {
						title: "value",
					},
					timestamp: now,
				},
			}));
			storage.removeItem = fake();
			const sut = new Cache(storage);

			const result = sut.putFavorite(story);

			return result.then(mirror => {
				sAssert.calledOnce(storage.getItem as SinonSpy);
				sAssert.calledWith(storage.getItem as SinonSpy, "ffe-cache-favorites");
				sAssert.calledOnce(storage.removeItem as SinonSpy);
				sAssert.calledWith(storage.removeItem as SinonSpy, "ffe-cache-favorites");

				assert.equal(mirror, story);
			});
		});

		it("should say fresh", function () {
			const storage: Storage = {} as any;
			storage.getItem = fake.returns(new Date().getTime());
			const sut = new Cache(storage);

			const result = sut.isFavoritesFresh();

			return result.then(fresh => {
				sAssert.calledOnce(storage.getItem as SinonSpy);
				sAssert.calledWith(storage.getItem as SinonSpy, "ffe-cache-favorites-scan");

				assert.isTrue(fresh);
			});
		});

		it("should not say fresh", function () {
			const storage: Storage = {} as any;
			storage.getItem = fake.returns(undefined);
			const sut = new Cache(storage);

			const result = sut.isFavoritesFresh();

			return result.then(fresh => {
				sAssert.calledOnce(storage.getItem as SinonSpy);
				sAssert.calledWith(storage.getItem as SinonSpy, "ffe-cache-favorites-scan");

				assert.isFalse(fresh);
			});
		});

		it("should replace all entries", function () {
			const storage: Storage = {} as any;
			storage.setItem = fake();
			const sut = new Cache(storage);

			const result = sut.putFavorites([
				{
					id: 123,
					title: "title",
					author: undefined,
				},
			]);

			return result.then(list => {
				sAssert.calledTwice(storage.setItem as SinonSpy);
				sAssert.calledWith(storage.setItem as SinonSpy, "ffe-cache-favorites", match(function (value) {
					assert.hasAllKeys(JSON.parse(value), ["123"]);

					return true;
				}));
				sAssert.calledWith(storage.setItem as SinonSpy, "ffe-cache-favorites-scan", match(/\d+/));

				assert.isArray(list);
				assert.lengthOf(list, 1);
				assert.equal(list[0].title, "title");
			});
		});
	});

	describe("Story", function () {
		it("should return a story object", function () {
			const storage: Storage = {} as any;
			storage.getItem = fake.returns(JSON.stringify({
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
			const sut = new Cache(storage);

			const result = sut.getStory(123);

			return result.then(story => {
				sAssert.calledOnce(storage.getItem as SinonSpy);
				sAssert.calledWith(storage.getItem as SinonSpy, "ffe-cache-stories");

				assert.instanceOf(story, Story);
				assert.equal(story.id, 123);
				assert.equal(story.title, "story");
				assert.isArray(story.chapters);
				assert.lengthOf(story.chapters, 1);
				assert.instanceOf(story.chapters[0], Chapter);
				assert.equal(story.chapters[0].storyId, 123);
				assert.equal(story.chapters[0].id, 1);
			});
		});

		it("should reject unknown keys", function () {
			const storage: Storage = {} as any;
			storage.getItem = fake.returns(undefined);
			const sut = new Cache(storage);

			const result = sut.getStory(123);

			return result
				.then(() => assert.fail("Promise should have failed"))
				.catch(e => {
					sAssert.calledOnce(storage.getItem as SinonSpy);
					sAssert.calledWith(storage.getItem as SinonSpy, "ffe-cache-stories");

					assert.instanceOf(e, Error);
					assert.equal(e.message, "Story with id '123' does not exist in cache.");
				});
		});

		it("should add story to cache", function () {
			const now = new Date().getTime();
			const story: Story = {
				id: 321,
				chapters: [],
				follow: () => true,
				favorite: () => false,
			} as any;
			const storage: Storage = {} as any;
			storage.getItem = fake.returns(JSON.stringify({
				123: {
					data: {
						title: "value",
					},
					timestamp: now,
				},
			}));
			storage.setItem = fake();
			const sut = new Cache(storage);

			const result = sut.putStory(story);

			return result.then(mirror => {
				sAssert.calledTwice(storage.getItem as SinonSpy);
				sAssert.calledWith(storage.getItem as SinonSpy, "ffe-cache-stories");
				sAssert.calledOnce(storage.setItem as SinonSpy);
				sAssert.calledWith(storage.setItem as SinonSpy, "ffe-cache-stories", match(function (value) {
					assert.hasAllKeys(JSON.parse(value), ["123", "321"]);

					return true;
				}));

				assert.equal(mirror, story);
			});
		});
	});
});
