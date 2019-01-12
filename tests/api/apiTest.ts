import { assert } from "chai";
import * as jQueryProxy from "jquery";
import { assert as sAssert, fake, match, SinonSpy, stub } from "sinon";

import { Api, ApiImmediate } from "../../src/api/api";
import { Cache } from "../../src/api/cache";
import { Story } from "../../src/api/data";

const $: JQueryStatic = (jQueryProxy as any).default || jQueryProxy;

describe("Api", function () {
	const consoleDebugSave = console.debug;

	global["GM_getValue"] = (a, b) => b;
	global["GM_setValue"] = () => undefined;

	before(function () {
		console.debug = () => undefined;
	});

	after(function () {
		console.debug = consoleDebugSave;
	});

	describe("Alerts", function () {
		it("should put alert state for Api and Cache", function () {
			const story: Story = {} as any;
			(story as any).follow = () => true;

			const cache: Cache = {} as any;
			cache.putAlert = fake();
			const api: ApiImmediate = {} as any;
			api.putAlert = fake();
			const sut = new Api(cache, api);

			const result = sut.putAlert(story);

			return result.then(mirror => {
				sAssert.calledOnce(cache.putAlert as SinonSpy);
				sAssert.calledWith(cache.putAlert as SinonSpy, story);
				sAssert.calledOnce(api.putAlert as SinonSpy);
				sAssert.calledWith(api.putAlert as SinonSpy, story);

				assert.equal(mirror, story);
			});
		});

		it("should retrieve alerts list from Cache", function () {
			const cache: Cache = {} as any;
			cache.isAlertsFresh = fake.resolves(true);
			cache.getAlerts = fake.resolves([{
				id: 1,
				title: "Title",
				author: undefined,
			}]);
			const sut = new Api(cache, {} as any);

			const result = sut.getStoryAlerts();

			return result.then(list => {
				sAssert.calledOnce(cache.isAlertsFresh as SinonSpy);
				sAssert.calledOnce(cache.getAlerts as SinonSpy);

				assert.isArray(list);
				assert.lengthOf(list, 1);
				assert.deepEqual(list[0], {
					id: 1,
					title: "Title",
					author: undefined,
				});
			});
		});

		it("should retrieve alerts list from Api", function () {
			const cache: Cache = {} as any;
			cache.isAlertsFresh = fake.resolves(false);
			cache.putAlerts = fake(a => Promise.resolve(a));
			const api: ApiImmediate = {} as any;
			api.getStoryAlerts = fake.resolves([{
				id: 1,
				title: "Title",
				author: undefined,
			}]);
			const sut = new Api(cache, api);

			const result = sut.getStoryAlerts();

			return result.then(list => {
				sAssert.calledOnce(cache.isAlertsFresh as SinonSpy);
				sAssert.calledOnce(cache.putAlerts as SinonSpy);
				sAssert.calledWith(cache.putAlerts as SinonSpy, [{
					id: 1,
					title: "Title",
					author: undefined,
				}]);
				sAssert.calledOnce(api.getStoryAlerts as SinonSpy);

				assert.isArray(list);
				assert.lengthOf(list, 1);
				assert.deepEqual(list[0], {
					id: 1,
					title: "Title",
					author: undefined,
				});
			});
		});
	});

	describe("Favorites", function () {
		it("should put favorite state for Api and Cache", function () {
			const story: Story = {} as any;
			(story as any).follow = () => true;

			const cache: Cache = {} as any;
			cache.putFavorite = fake();
			const api: ApiImmediate = {} as any;
			api.putFavorite = fake();
			const sut = new Api(cache, api);

			const result = sut.putFavorite(story);

			return result.then(mirror => {
				sAssert.calledOnce(cache.putFavorite as SinonSpy);
				sAssert.calledWith(cache.putFavorite as SinonSpy, story);
				sAssert.calledOnce(api.putFavorite as SinonSpy);
				sAssert.calledWith(api.putFavorite as SinonSpy, story);

				assert.equal(mirror, story);
			});
		});

		it("should retrieve favorite list from Cache", function () {
			const cache: Cache = {} as any;
			cache.isFavoritesFresh = fake.resolves(true);
			cache.getFavorites = fake.resolves([{
				id: 1,
				title: "Title",
				author: undefined,
			}]);
			const sut = new Api(cache, {} as any);

			const result = sut.getStoryFavorites();

			return result.then(list => {
				sAssert.calledOnce(cache.isFavoritesFresh as SinonSpy);
				sAssert.calledOnce(cache.getFavorites as SinonSpy);

				assert.isArray(list);
				assert.lengthOf(list, 1);
				assert.deepEqual(list[0], {
					id: 1,
					title: "Title",
					author: undefined,
				});
			});
		});

		it("should retrieve favorites list from Api", function () {
			const cache: Cache = {} as any;
			cache.isFavoritesFresh = fake.resolves(false);
			cache.putFavorites = fake(a => Promise.resolve(a));
			const api: ApiImmediate = {} as any;
			api.getStoryFavorites = fake.resolves([{
				id: 1,
				title: "Title",
				author: undefined,
			}]);
			const sut = new Api(cache, api);

			const result = sut.getStoryFavorites();

			return result.then(list => {
				sAssert.calledOnce(cache.isFavoritesFresh as SinonSpy);
				sAssert.calledOnce(cache.putFavorites as SinonSpy);
				sAssert.calledWith(cache.putFavorites as SinonSpy, [{
					id: 1,
					title: "Title",
					author: undefined,
				}]);
				sAssert.calledOnce(api.getStoryFavorites as SinonSpy);

				assert.isArray(list);
				assert.lengthOf(list, 1);
				assert.deepEqual(list[0], {
					id: 1,
					title: "Title",
					author: undefined,
				});
			});
		});
	});

	describe("Story Info", function () {
		it("should return info from Cache", function () {
			const cache: Cache = {} as any;
			cache.getStory = fake.resolves({
				id: 123,
				title: "Title",
				chapters: [
					{
						words: 1,
					},
				],
				follow: {
					subscribe: fake(),
				},
				favorite: {
					subscribe: fake(),
				},
			});
			const api: ApiImmediate = {} as any;
			const sut = new Api(cache, api);

			const result = sut.getStoryInfo(123);

			return result.then(story => {
				sAssert.calledOnce(cache.getStory as SinonSpy);
				sAssert.calledWith(cache.getStory as SinonSpy, 123);

				assert.equal(story.id, 123);
				assert.equal(story.title, "Title");
			});
		});

		it("should return info from Api", function () {
			const cache: Cache = {} as any;
			cache.getStory = fake.rejects(undefined);
			cache.putStory = fake(a => Promise.resolve(a));
			cache.isAlertsFresh = fake.resolves(true);
			cache.hasAlert = fake.resolves(true);
			cache.isFavoritesFresh = fake.resolves(true);
			cache.isFavorite = fake.resolves(false);
			const api: ApiImmediate = {} as any;
			const story = {
				id: 123,
				title: "Title",
				chapters: [
					{
						words: 1,
					},
				],
				follow: fake(),
				favorite: fake(),
			};
			(story.follow as any).subscribe = fake();
			(story.favorite as any).subscribe = fake();
			api.getStoryInfo = fake.resolves(story);
			api.applyChapterLengths = fake.resolves(story);
			const sut = new Api(cache, api);

			const result = sut.getStoryInfo(123);

			return result.then(r => {
				sAssert.calledOnce(cache.getStory as SinonSpy);
				sAssert.calledWith(cache.getStory as SinonSpy, 123);
				sAssert.calledOnce(cache.putStory as SinonSpy);
				sAssert.calledWith(cache.putStory as SinonSpy, match(s => {
					assert.equal(s.id, 123);
					assert.equal(s.title, "Title");

					return true;
				}));
				sAssert.calledOnce(api.getStoryInfo as SinonSpy);
				sAssert.calledWith(api.getStoryInfo as SinonSpy, 123);

				sAssert.calledOnce(cache.isAlertsFresh as SinonSpy);
				sAssert.calledOnce(cache.hasAlert as SinonSpy);
				sAssert.calledOnce(story.follow);
				sAssert.calledOnce(cache.isFavoritesFresh as SinonSpy);
				sAssert.calledOnce(cache.isFavorite as SinonSpy);
				sAssert.calledOnce(story.favorite);

				assert.equal(r.id, 123);
				assert.equal(r.title, "Title");
			});
		});

		it("should attach alerts handler", function () {
			const cache: Cache = {
				putAlert: fake(),
			} as any;
			const story = {
				id: 123,
				chapters: [
					{
						words: 1,
					},
				],
				follow: fake(),
				favorite: fake(),
			};
			(story.follow as any).subscribe = fake();
			(story.favorite as any).subscribe = fake();
			cache.getStory = fake.resolves(story);
			const api: ApiImmediate = {
				putAlert: fake(),
			} as any;
			const sut = new Api(cache, api);

			const result = sut.getStoryInfo(123);

			return result
				.then(s => {
					sAssert.calledOnce((s.follow as any).subscribe);
					sAssert.calledWith((s.follow as any).subscribe, match.func);

					((s.follow as any).subscribe as SinonSpy).args[0][0]();

					return s;
				})
				.then(s => {
					sAssert.calledOnce(cache.putAlert as SinonSpy);
					sAssert.calledOnce(api.putAlert as SinonSpy);
				});
		});

		it("should attach favorites handler", function () {
			const cache: Cache = {
				putFavorite: fake(),
			} as any;
			const story = {
				id: 123,
				chapters: [
					{
						words: 1,
					},
				],
				follow: fake(),
				favorite: fake(),
			};
			(story.follow as any).subscribe = fake();
			(story.favorite as any).subscribe = fake();
			cache.getStory = fake.resolves(story);
			const api: ApiImmediate = {
				putFavorite: fake(),
			} as any;
			const sut = new Api(cache, api);

			const result = sut.getStoryInfo(123);

			return result
				.then(s => {
					sAssert.calledOnce((s.favorite as any).subscribe);
					sAssert.calledWith((s.favorite as any).subscribe, match.func);

					((s.favorite as any).subscribe as SinonSpy).args[0][0]();

					return s;
				})
				.then(s => {
					sAssert.calledOnce(cache.putFavorite as SinonSpy);
					sAssert.calledOnce(api.putFavorite as SinonSpy);
				});
		});
	});
});

describe("ApiImmediate", function () {
	const consoleDebugSave = console.debug;
	const ajaxSave = $.ajax;

	global["GM_getValue"] = (a, b) => b;
	global["GM_setValue"] = () => undefined;

	before(function () {
		console.debug = () => undefined;
	});

	after(function () {
		console.debug = consoleDebugSave;
		$.ajax = ajaxSave;
	});

	describe("Alerts", function () {
		it("should put positive alert state", function () {
			const story: Story = {
				id: 123,
			} as any;
			(story as any).follow = () => true;

			const ajax = $.ajax = fake.resolves(undefined);
			const sut = new ApiImmediate();

			const result = sut.putAlert(story);

			sAssert.calledOnce(ajax);
			const args = ajax.getCall(0).args[0] as JQueryAjaxSettings;

			assert.equal(args.method, "POST");
			assert.equal(args.url, "/api/ajax_subs.php");
			assert.deepEqual(args.data, {
				storyid: 123,
				userid: undefined,
				storyalert: 1,
			});

			return result.then(mirror => {
				assert.equal(mirror, story);
			});
		});

		it("should put negative alert state", function () {
			const story: Story = {
				id: 123,
			} as any;
			(story as any).follow = () => false;

			const ajax = $.ajax = fake.resolves(undefined);
			const sut = new ApiImmediate();

			const result = sut.putAlert(story);

			sAssert.calledOnce(ajax);
			const args = ajax.getCall(0).args[0] as JQueryAjaxSettings;

			assert.equal(args.method, "POST");
			assert.equal(args.url, "/alert/story.php");
			assert.deepEqual(args.data, {
				action: "remove-multi",
				"rids[]": 123,
			});

			return result.then(mirror => {
				assert.equal(mirror, story);
			});
		});

		it("should retrieve multi-page alerts list", function () {
			const page1 = `<div id="content_wrapper_inner">
				<table id="gui_table1i">
					<tbody>
						<tr>
							<td><a href="/s/123/story-1">Story 1</a></td>
							<td><a href="/u/123/author">Author</a></td>
							<td>Category 1</td>
							<td>date updated...</td>
							<td>date added...</td>
							<td>checkbox</td>
						</tr>
						<tr>
							<td colspan="6"></td>
						</tr>
					</tbody>
				</table>
				<center>
					Page <b>1</b> 2 <a href="https://www.fanfiction.net/alert/story.php?p=2">Next</a>
				</center>
			</div>`;
			const page2 = `<table id="gui_table1i">
				<tbody>
					<tr>
						<td><a href="/s/125/story-2">Story 2</a></td>
						<td><a href="/u/125/cool-guy">Cool Guy</a></td>
						<td>Category 2</td>
						<td>date updated...</td>
						<td>date added...</td>
						<td>checkbox</td>
					</tr>
					<tr>
						<td colspan="6"></td>
					</tr>
				</tbody>
			</table>`;

			const ajax = $.ajax = stub();
			ajax.onCall(0).resolves(page1);
			ajax.onCall(1).resolves(page2);
			ajax.throws();
			const sut = new ApiImmediate();

			const result = sut.getStoryAlerts();

			return result.then(list => {
				sAssert.calledTwice(ajax);

				const args1 = ajax.getCall(0).args[0] as JQueryAjaxSettings;
				assert.equal(args1.method, "GET");
				assert.equal(args1.url, "/alert/story.php");
				assert.equal(args1.data, undefined);

				const args2 = ajax.getCall(1).args[0] as JQueryAjaxSettings;
				assert.equal(args2.method, "GET");
				assert.equal(args2.url, "/alert/story.php?p=2");
				assert.equal(args2.data, undefined);

				assert.equal(list.length, 2);

				const item1 = list[0];
				assert.equal(item1.id, 123);
				assert.equal(item1.title, "Story 1");
				assert.equal(item1.author.id, 123);
				assert.equal(item1.author.name, "Author");
				assert.equal(item1.author.profileUrl, "/u/123/author");

				const item2 = list[1];
				assert.equal(item2.id, 125);
				assert.equal(item2.title, "Story 2");
				assert.equal(item2.author.id, 125);
				assert.equal(item2.author.name, "Cool Guy");
				assert.equal(item2.author.profileUrl, "/u/125/cool-guy");
			});
		});
	});

	describe("Favorites", function () {
		it("should put positive favorite state", function () {
			const story: Story = {
				id: 123,
			} as any;
			(story as any).favorite = () => true;

			const ajax = $.ajax = fake.resolves(undefined);
			const sut = new ApiImmediate();

			const result = sut.putFavorite(story);

			sAssert.calledOnce(ajax);
			const args = ajax.getCall(0).args[0] as JQueryAjaxSettings;

			assert.equal(args.method, "POST");
			assert.equal(args.url, "/api/ajax_subs.php");
			assert.deepEqual(args.data, {
				storyid: 123,
				userid: undefined,
				favstory: 1,
			});

			return result.then(mirror => {
				assert.equal(mirror, story);
			});
		});

		it("should put negative favorite state", function () {
			const story: Story = {
				id: 123,
			} as any;
			(story as any).favorite = () => false;

			const ajax = $.ajax = fake.resolves(undefined);
			const sut = new ApiImmediate();

			const result = sut.putFavorite(story);

			sAssert.calledOnce(ajax);
			const args = ajax.getCall(0).args[0] as JQueryAjaxSettings;

			assert.equal(args.method, "POST");
			assert.equal(args.url, "/favorites/story.php");
			assert.deepEqual(args.data, {
				action: "remove-multi",
				"rids[]": 123,
			});

			return result.then(mirror => {
				assert.equal(mirror, story);
			});
		});

		it("should retrieve multi-page favorites list", function () {
			const page1 = `<div id="content_wrapper_inner">
				<table id="gui_table1i">
					<tbody>
						<tr>
							<td><a href="/s/123/story-1">Story 1</a></td>
							<td><a href="/u/123/author">Author</a></td>
							<td>Category 1</td>
							<td>date updated...</td>
							<td>date added...</td>
							<td>checkbox</td>
						</tr>
						<tr>
							<td colspan="6"></td>
						</tr>
					</tbody>
				</table>
				<center>
					Page <b>1</b> 2 <a href="https://www.fanfiction.net/favorites/story.php?p=2">Next</a>
				</center>
			</div>`;
			const page2 = `<table id="gui_table1i">
				<tbody>
					<tr>
						<td><a href="/s/125/story-2">Story 2</a></td>
						<td><a href="/u/125/cool-guy">Cool Guy</a></td>
						<td>Category 2</td>
						<td>date updated...</td>
						<td>date added...</td>
						<td>checkbox</td>
					</tr>
					<tr>
						<td colspan="6"></td>
					</tr>
				</tbody>
			</table>`;

			const ajax = $.ajax = stub();
			ajax.onCall(0).resolves(page1);
			ajax.onCall(1).resolves(page2);
			ajax.throws();
			const sut = new ApiImmediate();

			const result = sut.getStoryFavorites();

			return result.then(list => {
				sAssert.calledTwice(ajax);

				const args1 = ajax.getCall(0).args[0] as JQueryAjaxSettings;
				assert.equal(args1.method, "GET");
				assert.equal(args1.url, "/favorites/story.php");
				assert.equal(args1.data, undefined);

				const args2 = ajax.getCall(1).args[0] as JQueryAjaxSettings;
				assert.equal(args2.method, "GET");
				assert.equal(args2.url, "/favorites/story.php?p=2");
				assert.equal(args2.data, undefined);

				assert.equal(list.length, 2);

				const item1 = list[0];
				assert.equal(item1.id, 123);
				assert.equal(item1.title, "Story 1");
				assert.equal(item1.author.id, 123);
				assert.equal(item1.author.name, "Author");
				assert.equal(item1.author.profileUrl, "/u/123/author");

				const item2 = list[1];
				assert.equal(item2.id, 125);
				assert.equal(item2.title, "Story 2");
				assert.equal(item2.author.id, 125);
				assert.equal(item2.author.name, "Cool Guy");
				assert.equal(item2.author.profileUrl, "/u/125/cool-guy");
			});
		});
	});

	describe("Stories", function () {
		it("should retrieve story info", function () {
			const ajax = $.ajax = fake.resolves(`<div id="test-wrapper">
	<div id="profile_top">
		<span><img src="/src/img.jpg" /></span>
		<button><!-- follow+fav button --></button>
		<b>title</b>
		<span>by</span>
		<a href="/u/678/author">author</a>
		<span><!-- mail icon --></span>
		<a><!-- message link --></a>
		<div>description</div>
		<span>
			Rated: <a>M</a> - Elvish - Fantasy - [Romeo, Juliet] Steve - Chapters: 33 - Words: 1,234 - Reviews:
			<a>123</a> - Favs: 345 - Follows: 567 - Updated: <span data-xutime="1517639271">Feb 3</span> - Published:
			<span data-xutime="1426879324">Mar 20, 2015</span> - id: 123
		</span>
	</div>
	<div id="storytext">Two words.</div>
</div>`);
			const sut = new ApiImmediate();

			const result = sut.getStoryInfo(123);

			return result.then(story => {
				sAssert.calledOnce(ajax);

				const args = ajax.getCall(0).args[0] as JQueryAjaxSettings;
				assert.equal(args.method, "GET");
				assert.equal(args.url, "/s/123");
				assert.equal(args.data, undefined);

				assert.instanceOf(story, Story);
				assert.equal(story.id, 123);
				assert.equal(story.title, "title");
			});
		});
	});
});
