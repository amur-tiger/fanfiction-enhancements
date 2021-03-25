import { assert } from "chai";
import * as td from "testdouble";

import { Api } from "../../src/api/Api";

describe("Api", function () {
	beforeEach(function () {
		td.replace(console, "log");
		// @ts-ignore
		global["fetch"] = td.function("fetch");
	});

	afterEach(function () {
		td.reset();
		delete global["fetch"];
	});

	describe("Alerts", function () {
		it("should add alert", async function () {
			const response = td.object<Response>();
			const urlCaptor = td.matchers.captor();
			const argsCaptor = td.matchers.captor();
			td.when(response.json()).thenResolve({});
			td.when(fetch(urlCaptor.capture(), argsCaptor.capture())).thenResolve(response);

			const sut = new Api();

			await sut.addStoryAlert(1);

			assert.equal(urlCaptor.value, "/api/ajax_subs.php");
			assert.equal(argsCaptor.value.method, "POST");
			const fd: FormData = argsCaptor.value.body;
			assert.equal(fd.get("storyid").valueOf(), 1);
			assert.equal(fd.get("storyalert").valueOf(), 1);
		});

		it("should remove alert", async function () {
			const response = td.object<Response>();
			const urlCaptor = td.matchers.captor();
			const argsCaptor = td.matchers.captor();
			td.when(response.json()).thenResolve({});
			td.when(fetch(urlCaptor.capture(), argsCaptor.capture())).thenResolve(response);

			const sut = new Api();

			await sut.removeStoryAlert(1);

			assert.equal(urlCaptor.value, "/alert/story.php");
			assert.equal(argsCaptor.value.method, "POST");
			const fd: FormData = argsCaptor.value.body;
			assert.equal(fd.get("action").valueOf(), "remove-multi");
			assert.equal(fd.get("rids[]").valueOf(), 1);
		});

		it("should retrieve multi-page alerts list", async function () {
			const page1 = `<!--suppress HtmlUnknownTarget, HtmlDeprecatedTag -->
			<div id="content_wrapper_inner">
				<form>
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
				</form>
			</div>`;
			const page2 = `<!--suppress HtmlUnknownTarget -->
			<form>
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
				</table>
			</form>`;

			const response1 = td.object<Response>();
			const response2 = td.object<Response>();
			const urlCaptor = td.matchers.captor();
			const sut = new Api();
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

			const item2 = list[1];
			assert.equal(item2.id, 125);
			assert.equal(item2.title, "Story 2");
			assert.equal(item2.author.id, 125);
			assert.equal(item2.author.name, "Cool Guy");
		});
	});

	describe("Favorites", function () {
		it("should add favorite", async function () {
			const response = td.object<Response>();
			const urlCaptor = td.matchers.captor();
			const argsCaptor = td.matchers.captor();
			td.when(response.json()).thenResolve({});
			td.when(fetch(urlCaptor.capture(), argsCaptor.capture())).thenResolve(response);

			const sut = new Api();

			await sut.addStoryFavorite(1);

			assert.equal(urlCaptor.value, "/api/ajax_subs.php");
			assert.equal(argsCaptor.value.method, "POST");
			const fd: FormData = argsCaptor.value.body;
			assert.equal(fd.get("storyid").valueOf(), 1);
			assert.equal(fd.get("favstory").valueOf(), 1);
		});

		it("should remove favorite", async function () {
			const response = td.object<Response>();
			const urlCaptor = td.matchers.captor();
			const argsCaptor = td.matchers.captor();
			td.when(response.json()).thenResolve({});
			td.when(fetch(urlCaptor.capture(), argsCaptor.capture())).thenResolve(response);

			const sut = new Api();

			await sut.removeStoryFavorite(1);

			assert.equal(urlCaptor.value, "/favorites/story.php");
			assert.equal(argsCaptor.value.method, "POST");
			const fd: FormData = argsCaptor.value.body;
			assert.equal(fd.get("action").valueOf(), "remove-multi");
			assert.equal(fd.get("rids[]").valueOf(), 1);
		});

		it("should retrieve multi-page favorites list", async function () {
			const page1 = `<!--suppress HtmlUnknownTarget, HtmlDeprecatedTag -->
			<div id="content_wrapper_inner">
				<form>
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
				</form>
			</div>`;
			const page2 = `<!--suppress HtmlUnknownTarget -->
			<form>
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
				</table>
			</form>`;

			const response1 = td.object<Response>();
			const response2 = td.object<Response>();
			const urlCaptor = td.matchers.captor();
			const sut = new Api();
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

			const item2 = list[1];
			assert.equal(item2.id, 125);
			assert.equal(item2.title, "Story 2");
			assert.equal(item2.author.id, 125);
			assert.equal(item2.author.name, "Cool Guy");
		});
	});

	describe("Stories", function () {
		it("should retrieve story data", async function () {
			const page = `<!--suppress HtmlUnknownTarget, HtmlRequiredAltAttribute -->
			<div id="test-wrapper">
				<div id="pre_story_links">
					<span>
						<a href="bla">uni</a>
					</span>
				</div>
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
			const sut = new Api();
			td.when(response.text()).thenResolve(page);
			td.when(fetch(urlCaptor.capture())).thenResolve(response);
			global["GM_getValue"] = (a, b) => b;

			const story = await sut.getStoryData(123);

			assert.equal(urlCaptor.value, "/s/123");
			assert.equal(story.id, 123);
			assert.equal(story.title, "title");
		});
	});
});
