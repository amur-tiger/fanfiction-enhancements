import { assert } from "chai";
import * as sinon from "sinon";

import { Cache } from "../../src/util/cache";

describe("Cache", function() {
	let gmGetValue;
	let gmSetValue;

	beforeEach(function() {
		global["GM_getValue"] = gmGetValue = sinon.stub();
		global["GM_setValue"] = gmSetValue = sinon.spy();
	});

	describe("Read", function() {
		it("should return false if no data is present", function() {
			gmGetValue.returnsArg(1);
			const chapter = {
				storyId: 123,
				id: 1,
			};

			const sut = new Cache();

			assert.isFalse(sut.read.isRead(chapter as any));
		});

		it("should return saved data", function() {
			gmGetValue.returns(JSON.stringify({
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
			gmGetValue.returnsArg(1);
			const chapter = {
				storyId: 123,
				id: 1,
				read: () => true,
			};

			const sut = new Cache();
			sut.read.setRead(chapter as any);

			sinon.assert.calledWith(gmSetValue, "ffe-cache-read", JSON.stringify({
				123: {
					1: true,
				},
			}));
		});

		it("should merge data instead of overwriting", function() {
			gmGetValue.returns(JSON.stringify({
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

			sinon.assert.calledWith(gmSetValue, "ffe-cache-read", JSON.stringify({
				101: {
					1: true,
				},
				123: {
					1: true,
					2: true,
				},
			}));
		});
	});

	describe("Alerts", function() {
		describe("Follows", function() {
			it("should return false if no data is present", function() {
				gmGetValue.returnsArg(1);
				const story = {
					id: 123,
				};

				const sut = new Cache();
				const result = sut.alerts.isFollowed(story as any);

				assert.isFalse(result);
			});

			it("should return saved data", function() {
				gmGetValue.returns(JSON.stringify({
					follows: {
						123: true,
					},
				}));
				const story = {
					id: 123,
				};

				const sut = new Cache();
				const result = sut.alerts.isFollowed(story as any);

				assert.isTrue(result);
			});

			it("should save data", function() {
				gmGetValue.returnsArg(1);
				const story = {
					id: 123,
					follow: () => true,
				};

				const sut = new Cache();
				sut.alerts.setFollowed(story as any);

				sinon.assert.calledWith(gmSetValue, "ffe-cache-alerts", JSON.stringify({
					follows: {
						123: true,
					},
				}));
			});

			it("should merge data instead of overwriting", function() {
				gmGetValue.returns(JSON.stringify({
					follows: {
						1: true,
						2: false,
					},
					favorites: {
						1: true,
					},
				}));
				const story = {
					id: 123,
					follow: () => true,
				};

				const sut = new Cache();
				sut.alerts.setFollowed(story as any);

				sinon.assert.calledWith(gmSetValue, "ffe-cache-alerts", JSON.stringify({
					follows: {
						1: true,
						2: false,
						123: true,
					},
					favorites: {
						1: true,
					},
				}));
			});
		});

		describe("Favorites", function() {
			it("should return false if no data is present", function() {
				gmGetValue.returnsArg(1);
				const story = {
					id: 123,
				};

				const sut = new Cache();
				const result = sut.alerts.isFavorited(story as any);

				assert.isFalse(result);
			});

			it("should return saved data", function() {
				gmGetValue.returns(JSON.stringify({
					favorites: {
						123: true,
					},
				}));
				const story = {
					id: 123,
				};

				const sut = new Cache();
				const result = sut.alerts.isFavorited(story as any);

				assert.isTrue(result);
			});

			it("should save data", function() {
				gmGetValue.returnsArg(1);
				const story = {
					id: 123,
					favorite: () => true,
				};

				const sut = new Cache();
				sut.alerts.setFavorited(story as any);

				sinon.assert.calledWith(gmSetValue, "ffe-cache-alerts", JSON.stringify({
					favorites: {
						123: true,
					},
				}));
			});

			it("should merge data instead of overwriting", function() {
				gmGetValue.returns(JSON.stringify({
					follows: {
						1: true,
					},
					favorites: {
						1: true,
						2: false,
					},
				}));
				const story = {
					id: 123,
					favorite: () => true,
				};

				const sut = new Cache();
				sut.alerts.setFavorited(story as any);

				sinon.assert.calledWith(gmSetValue, "ffe-cache-alerts", JSON.stringify({
					follows: {
						1: true,
					},
					favorites: {
						1: true,
						2: false,
						123: true,
					},
				}));
			});
		});
	});
});
