import { assert } from "chai";
import { JSDOM } from "jsdom";
import * as ko from "knockout";
import { fake } from "sinon";

import { Chapter, Story } from "../../src/api/data";
import { ChapterList } from "../../src/enhance/ChapterList";

describe("Chapter List", function () {
	const fragmentHTML = `
		<div id="content_wrapper_inner">
			<div class="lc-wrapper" id="pre_story_links"></div>

			<div id="img_large" class="hide modal fade">
				<div class="modal-body"><img class="lazy cimage" src="source"></div>
			</div>

			<div id="profile_top">
				<div class="ffe-sc-footer">
					<div></div>
				</div>
			</div>

			<div role="main" aria-label="story content" class="storytextp" id="storytextp">
				<div class="storytext xcontrast_txt nocopy" id="storytext">
					Story here
				</div>
			</div>

			<div style="height:5px"></div>

			<div style="clear:both;text-align:right;">
				<select id="chap_select" title="Chapter Navigation" name="chapter">
					<option value="1" selected="">1. Prologue</option>
				</select>
			</div>

			<div id="review_success">
				The author would like to thank you for your continued support. Your review has been posted.
			</div>

			<div id="review"></div>

			<div style="height:15px"></div>

			<div align="center" class="lc-wrapper">
				<div class="lc"></div>
			</div>

			<div style="height:5px"></div>
		</div>`;

	function createStory(chapters: Chapter[] = undefined): Story {
		return new Story(
			0,
			"title",
			{
				id: 0,
				name: "",
				profileUrl: "",
				avatarUrl: "",
			},
			"description",
			chapters ? chapters :
				[
					new Chapter(0, 0, "prologue", 1),
					new Chapter(0, 1, "chapter 1", 2),
					new Chapter(0, 2, "epilogue", 3),
				],
			undefined,
		);
	}

	let dom;
	let document;
	beforeEach(function () {
		dom = new JSDOM();
		document = dom.window.document;
	});

	it("should clean elements", function () {
		const fragment = JSDOM.fragment(fragmentHTML);
		document.body.appendChild(fragment);

		const sut = new ChapterList(document, {
			getStoryInfo: fake.resolves(createStory()),
		} as any);
		sut.enhance();

		const preStoryLinks = document.getElementById("pre_story_links");
		assert.isNotNull(preStoryLinks);

		const image = document.getElementById("img_large");
		assert.isNotNull(image);

		const profile = document.getElementById("profile_top");
		assert.isNotNull(profile);

		const review = document.getElementById("review");
		assert.isNotNull(review);

		const storytext = document.getElementById("storytextp");
		assert.isNull(storytext);

		assert.equal(document.getElementById("content_wrapper_inner").children.length, 7);
	});

	it("should insert chapter list", function () {
		const fragment = JSDOM.fragment(fragmentHTML);
		document.body.appendChild(fragment);

		const sut = new ChapterList(document, {
			getStoryInfo: fake.resolves(createStory()),
		} as any);

		return sut.enhance()
			.then(() => {
				const container = document.getElementsByClassName("ffe-cl-container");
				assert.lengthOf(container, 1);

				const items = document.getElementsByClassName("ffe-cl-chapter");
				assert.lengthOf(items, 3);

				const prologue = items[0];
				assert.equal(prologue.children[1].firstElementChild.nodeName, "A");
				assert.equal(prologue.children[1].firstElementChild.href, "/s/0/0");
				assert.equal(prologue.children[1].textContent.trim(), "prologue");
				assert.equal(prologue.children[2].textContent.trim(), "1 words");

				const chapter = items[1];
				assert.equal(chapter.children[1].firstElementChild.nodeName, "A");
				assert.equal(chapter.children[1].firstElementChild.href, "/s/0/1");
				assert.equal(chapter.children[1].textContent.trim(), "chapter 1");
				assert.equal(chapter.children[2].textContent.trim(), "2 words");

				const epilogue = items[2];
				assert.equal(epilogue.children[1].firstElementChild.nodeName, "A");
				assert.equal(epilogue.children[1].firstElementChild.href, "/s/0/2");
				assert.equal(epilogue.children[1].textContent.trim(), "epilogue");
				assert.equal(epilogue.children[2].textContent.trim(), "3 words");
			});
	});

	describe("Chapter hiding", function () {
		const createChapterRun = (...blockLengths) => {
			const result: Chapter[] = [];
			let chapterRunningIndex = 1;
			let readToggle = false;
			blockLengths.forEach(length => {
				readToggle = !readToggle;
				for (let i = 0; i < length; i++) {
					result.push({
						storyId: 0,
						id: chapterRunningIndex++,
						name: "",
						read: ko.observable(readToggle),
						words: 0,
					});
				}
			});

			return result;
		};

		const scenarios = [
			{
				name: "should hide read chapters",
				chapters: createChapterRun(3, 2),
				spec: [{
					count: 3,
					read: true,
					show: false,
				},
					{
						count: 2,
						read: false,
						show: true,
					}],
			},
			{
				name: "should hide unread chapters",
				chapters: createChapterRun(0, 11),
				spec: [{
					count: 2,
					read: false,
					show: true,
				},
					{
						count: 6,
						read: false,
						show: false,
					},
					{
						count: 3,
						read: false,
						show: true,
					}],
			},
			{
				name: "should show unread chapters after read chapters",
				chapters: createChapterRun(5, 15),
				spec: [{
					count: 5,
					read: true,
					show: false,
				},
					{
						count: 2,
						read: false,
						show: true,
					},
					{
						count: 10,
						read: false,
						show: false,
					},
					{
						count: 3,
						read: false,
						show: true,
					}],
			},
		];

		scenarios.forEach(function (scenario) {
			it(scenario.name, function () {
				const fragment = JSDOM.fragment(fragmentHTML);
				document.body.appendChild(fragment);

				const sut = new ChapterList(document, {
					getStoryInfo: fake.resolves(createStory(scenario.chapters)),
				} as any);

				return sut.enhance()
					.then(() => {
						const items = document.getElementsByClassName("ffe-cl-chapter");
						let i = 0;
						let prevShown = scenario.spec[0].show;
						for (const spec of scenario.spec) {
							if (spec.show && !prevShown) {
								const showCommand = items[i++];
								assert.equal(showCommand.className, "ffe-cl-chapter ffe-cl-collapsed");
							}

							prevShown = spec.show;

							while (spec.count-- > 0) {
								const item = items[i++];

								const read = !!(item.firstElementChild.firstElementChild as HTMLInputElement).checked;
								assert.equal(read, spec.read,
									"Element " + i + " should be " + (spec.read ? "read" : "unread") + ", but is not.");

								const shown = item.style.display !== "none";
								assert.equal(shown, spec.show,
									"Element " + i + " should be " + (spec.show ? "shown" : "hidden") + ", but is not.");
							}
						}
					});
			});
		});
	});
});
