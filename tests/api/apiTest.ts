import { assert } from "chai";
import * as td from "testdouble";

import { Api, ApiImmediate } from "../../src/api/api";
import { Cache } from "../../src/api/cache";
import { Chapter, FollowedStory, Story } from "../../src/api/data";

describe("Api", function () {
	before(function () {
		global["GM_getValue"] = (a, b) => b;
		global["GM_setValue"] = () => undefined;

		td.replace(console, "debug");
	});

	after(function () {
		td.reset();
	});

	describe("Alerts", function () {
		it("should put alert state for Api and Cache", async function () {
			const story: Story = {} as any;
			const cache = td.object<Cache>();
			const api = td.object<ApiImmediate>();
			const sut = new Api(cache, api);

			await sut.putAlert(story);

			td.verify(api.putAlert(story));
			td.verify(cache.putAlert(story));
		});

		it("should retrieve alerts list from Cache", async function () {
			const story: FollowedStory = {} as any;
			const cache = td.object<Cache>();
			td.when(cache.isAlertsFresh()).thenResolve(true);
			td.when(cache.getAlerts()).thenResolve([story]);

			const sut = new Api(cache, {} as any);

			const list = await sut.getStoryAlerts();

			assert.isArray(list);
			assert.lengthOf(list, 1);
			assert.equal(list[0], story);
		});

		it("should retrieve alerts list from Api", async function () {
			const story: FollowedStory = {} as any;
			const cache = td.object<Cache>();
			const api = td.object<ApiImmediate>();
			td.when(cache.isAlertsFresh()).thenResolve(false);
			td.when(api.getStoryAlerts()).thenResolve([story]);

			const sut = new Api(cache, api);

			const list = await sut.getStoryAlerts();

			td.verify(cache.putAlerts([story]));

			assert.isArray(list);
			assert.lengthOf(list, 1);
			assert.equal(list[0], story);
		});
	});

	describe("Favorites", function () {
		it("should put favorite state for Api and Cache", async function () {
			const story: Story = {} as any;
			const cache = td.object<Cache>();
			const api = td.object<ApiImmediate>();
			const sut = new Api(cache, api);

			await sut.putFavorite(story);

			td.verify(api.putFavorite(story));
			td.verify(cache.putFavorite(story));
		});

		it("should retrieve favorite list from Cache", async function () {
			const story: FollowedStory = {} as any;
			const cache = td.object<Cache>();
			td.when(cache.isFavoritesFresh()).thenResolve(true);
			td.when(cache.getFavorites()).thenResolve([story]);

			const sut = new Api(cache, {} as any);

			const list = await sut.getStoryFavorites();

			assert.isArray(list);
			assert.lengthOf(list, 1);
			assert.equal(list[0], story);
		});

		it("should retrieve favorites list from Api", async function () {
			const story: FollowedStory = {} as any;
			const cache = td.object<Cache>();
			const api = td.object<ApiImmediate>();
			td.when(cache.isFavoritesFresh()).thenResolve(false);
			td.when(api.getStoryFavorites()).thenResolve([story]);

			const sut = new Api(cache, api);

			const list = await sut.getStoryFavorites();

			td.verify(cache.putFavorites([story]));

			assert.isArray(list);
			assert.lengthOf(list, 1);
			assert.equal(list[0], story);
		});
	});

	describe("Story Info", function () {
		it("should return info from Cache", async function () {
			const story: Story = {
				chapters: [{
					words: 100,
				}],
				follow: { subscribe: td.function() },
				favorite: { subscribe: td.function() },
			} as any;
			const cache = td.object<Cache>();
			td.when(cache.getStory(123)).thenResolve(story);

			const sut = new Api(cache, {} as any);

			const result = await sut.getStoryInfo(123);

			assert.equal(result, story);
		});

		it("should return info from Api", async function () {
			const story = td.object<Story>();
			story.follow.subscribe = td.function() as any;
			story.favorite.subscribe = td.function() as any;
			const cache = td.object<Cache>();
			const api = td.object<ApiImmediate>();
			td.when(cache.getStory(123)).thenThrow(new Error("not in cache"));
			td.when(cache.isAlertsFresh()).thenResolve(true);
			td.when(cache.isFavoritesFresh()).thenResolve(true);
			td.when(cache.hasAlert(td.matchers.anything())).thenResolve(true);
			td.when(cache.isFavorite(td.matchers.anything())).thenResolve(true);
			td.when(api.getStoryInfo(123)).thenResolve(story);

			const sut = new Api(cache, api);

			const result = await sut.getStoryInfo(123);

			td.verify(api.applyChapterLengths(td.matchers.anything()));
			td.verify(story.follow.subscribe(td.matchers.anything()));
			td.verify(story.favorite.subscribe(td.matchers.anything()));
			td.verify(story.follow(true));
			td.verify(story.favorite(true));

			assert.equal(result, story);
		});

		it("should attach alerts handler", async function () {
			const story = td.object<Story>();
			story.follow.subscribe = td.function() as any;
			story.favorite.subscribe = td.function() as any;
			(story as any).chapters = [ td.object<Chapter>() ];
			const cache = td.object<Cache>();
			const api = td.object<ApiImmediate>();
			td.when(cache.getStory(123)).thenResolve(story);

			const sut = new Api(cache, api);

			await sut.getStoryInfo(123);

			const callback = td.matchers.captor();
			td.verify(story.follow.subscribe(callback.capture()));

			await callback.value();

			td.verify(cache.putAlert(td.matchers.anything()));
			td.verify(api.putAlert(td.matchers.anything()));
		});

		it("should attach favorites handler", async function () {
			const story = td.object<Story>();
			story.follow.subscribe = td.function() as any;
			story.favorite.subscribe = td.function() as any;
			(story as any).chapters = [ td.object<Chapter>() ];
			const cache = td.object<Cache>();
			const api = td.object<ApiImmediate>();
			td.when(cache.getStory(123)).thenResolve(story);

			const sut = new Api(cache, api);

			await sut.getStoryInfo(123);

			const callback = td.matchers.captor();
			td.verify(story.favorite.subscribe(callback.capture()));

			await callback.value();

			td.verify(cache.putFavorite(td.matchers.anything()));
			td.verify(api.putFavorite(td.matchers.anything()));
		});
	});
});

describe("ApiImmediate", function () {
	global["GM_getValue"] = (a, b) => b;
	global["GM_setValue"] = () => undefined;

	beforeEach(function () {
		td.replace(console, "debug");
		global["fetch"] = td.function("fetch");
	});

	afterEach(function () {
		td.reset();
		delete global["fetch"];
	});

	describe("Alerts", function () {
		it("should put positive alert state", async function () {
			const story = td.object<Story>();
			const response = td.object<Response>();
			const urlCaptor = td.matchers.captor();
			const argsCaptor = td.matchers.captor();
			td.when(story.follow()).thenReturn(true);
			td.when(response.json()).thenResolve({});
			td.when(fetch(urlCaptor.capture(), argsCaptor.capture())).thenResolve(response);

			const sut = new ApiImmediate();

			await sut.putAlert(story);

			assert.equal(urlCaptor.value, "/api/ajax_subs.php");
			assert.equal(argsCaptor.value.method, "POST");
			const fd: FormData = argsCaptor.value.body;
			assert.equal(fd.get("storyid").valueOf(), story.id);
			assert.equal(fd.get("storyalert").valueOf(), 1);
		});

		it("should put negative alert state", async function () {
			const story = td.object<Story>();
			const response = td.object<Response>();
			const urlCaptor = td.matchers.captor();
			const argsCaptor = td.matchers.captor();
			td.when(story.follow()).thenReturn(false);
			td.when(response.json()).thenResolve({});
			td.when(fetch(urlCaptor.capture(), argsCaptor.capture())).thenResolve(response);

			const sut = new ApiImmediate();

			await sut.putAlert(story);

			assert.equal(urlCaptor.value, "/alert/story.php");
			assert.equal(argsCaptor.value.method, "POST");
			const fd: FormData = argsCaptor.value.body;
			assert.equal(fd.get("action").valueOf(), "remove-multi");
			assert.equal(fd.get("rids[]").valueOf(), story.id);
		});

		it("should retrieve multi-page alerts list", async function () {
			const page1 = `<!--suppress HtmlUnknownTarget, HtmlDeprecatedTag -->
			<div id="content_wrapper_inner">
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
			const page2 = `<!--suppress HtmlUnknownTarget -->
			<table id="gui_table1i">
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

			const response1 = td.object<Response>();
			const response2 = td.object<Response>();
			const urlCaptor = td.matchers.captor();
			const sut = new ApiImmediate();
			td.when(response1.text()).thenResolve(page1);
			td.when(response2.text()).thenResolve(page2);
			td.when(fetch(urlCaptor.capture())).thenResolve(response1, response2);

			const list = await sut.getStoryAlerts();

			assert.equal(urlCaptor.values[0], "/alert/story.php");
			assert.equal(urlCaptor.values[1], "/alert/story.php?p=2");

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

	describe("Favorites", function () {
		it("should put positive favorite state", async function () {
			const story = td.object<Story>();
			const response = td.object<Response>();
			const urlCaptor = td.matchers.captor();
			const argsCaptor = td.matchers.captor();
			td.when(story.favorite()).thenReturn(true);
			td.when(response.json()).thenResolve({});
			td.when(fetch(urlCaptor.capture(), argsCaptor.capture())).thenResolve(response);

			const sut = new ApiImmediate();

			await sut.putFavorite(story);

			assert.equal(urlCaptor.value, "/api/ajax_subs.php");
			assert.equal(argsCaptor.value.method, "POST");
			const fd: FormData = argsCaptor.value.body;
			assert.equal(fd.get("storyid").valueOf(), story.id);
			assert.equal(fd.get("favstory").valueOf(), 1);
		});

		it("should put negative favorite state", async function () {
			const story = td.object<Story>();
			const response = td.object<Response>();
			const urlCaptor = td.matchers.captor();
			const argsCaptor = td.matchers.captor();
			td.when(story.favorite()).thenReturn(false);
			td.when(response.json()).thenResolve({});
			td.when(fetch(urlCaptor.capture(), argsCaptor.capture())).thenResolve(response);

			const sut = new ApiImmediate();

			await sut.putFavorite(story);

			assert.equal(urlCaptor.value, "/favorites/story.php");
			assert.equal(argsCaptor.value.method, "POST");
			const fd: FormData = argsCaptor.value.body;
			assert.equal(fd.get("action").valueOf(), "remove-multi");
			assert.equal(fd.get("rids[]").valueOf(), story.id);
		});

		it("should retrieve multi-page favorites list", async function () {
			const page1 = `<!--suppress HtmlUnknownTarget, HtmlDeprecatedTag -->
			<div id="content_wrapper_inner">
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
			const page2 = `<!--suppress HtmlUnknownTarget -->
			<table id="gui_table1i">
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

			const response1 = td.object<Response>();
			const response2 = td.object<Response>();
			const urlCaptor = td.matchers.captor();
			const sut = new ApiImmediate();
			td.when(response1.text()).thenResolve(page1);
			td.when(response2.text()).thenResolve(page2);
			td.when(fetch(urlCaptor.capture())).thenResolve(response1, response2);

			const list = await sut.getStoryFavorites();

			assert.equal(urlCaptor.values[0], "/favorites/story.php");
			assert.equal(urlCaptor.values[1], "/favorites/story.php?p=2");

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

	describe("Stories", function () {
		it("should retrieve story info", async function () {
			const page = `<!--suppress HtmlUnknownTarget, HtmlRequiredAltAttribute -->
			<div id="test-wrapper">
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
			</div>`;

			const urlCaptor = td.matchers.captor();
			const response = td.object<Response>();
			const sut = new ApiImmediate();
			td.when(response.text()).thenResolve(page);
			td.when(fetch(urlCaptor.capture())).thenResolve(response);

			const story = await sut.getStoryInfo(123);

			assert.equal(urlCaptor.value, "/s/123");
			assert.instanceOf(story, Story);
			assert.equal(story.id, 123);
			assert.equal(story.title, "title");
		});
	});
});
