import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { JSDOM } from "jsdom";
import * as td from "testdouble";

import { Chapter } from "../../src/api/Chapter";
import { ChapterList } from "../../src/enhance/ChapterList";
import { SmartValue } from "../../src/api/SmartValue";
import { Story } from "../../src/api/Story";
import { ValueContainer } from "../../src/api/ValueContainer";

chai.use(chaiAsPromised);
const assert = chai.assert;

describe("Chapter List", function () {
	const fragmentHTML = `<!--suppress HtmlUnknownTarget, HtmlRequiredAltAttribute -->
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
		const story: Story = {
			id: 0,
		} as any;

		(story as any).chapters = chapters || [
			createChapter(0, "prologue", 1),
			createChapter(1, "chapter 1", 2),
			createChapter(2, "epilogue", 3),
		];

		return story;
	}

	function createChapter(id: number, name: string, words: number): Chapter {
		const r: SmartValue<boolean> = {
			get: () => Promise.resolve(true),
			subscribe: () => undefined,
		} as any;
		const w: SmartValue<number> = {
			get: () => Promise.resolve(1),
			subscribe: () => undefined,
		} as any;

		return {
			storyId: 0,
			id: id,
			name: name,
			read: r,
			words: w,
		};
	}

	afterEach(function () {
		document.body.innerHTML = "";
	});

	it("should clean elements", async function () {
		const fragment = JSDOM.fragment(fragmentHTML);
		document.body.appendChild(fragment);

		const valueContainer = td.object<ValueContainer>();
		const sut = new ChapterList(valueContainer);
		td.when(valueContainer.getStory(td.matchers.anything())).thenResolve(createStory());

		await sut.enhance();

		const preStoryLinks = document.getElementById("pre_story_links");
		assert.isNotNull(preStoryLinks);

		const image = document.getElementById("img_large");
		assert.isNotNull(image);

		const profile = document.getElementById("profile_top");
		assert.isNotNull(profile);

		const review = document.getElementById("review");
		assert.isNotNull(review);

		const storyText = document.getElementById("storytextp");
		assert.isNull(storyText);

		assert.equal(document.getElementById("content_wrapper_inner").children.length, 7);
	});

	it("should insert chapter list", async function () {
		const fragment = JSDOM.fragment(fragmentHTML);
		document.body.appendChild(fragment);

		const valueContainer = td.object<ValueContainer>();
		const sut = new ChapterList(valueContainer);
		td.when(valueContainer.getStory(td.matchers.anything())).thenResolve(createStory());

		await sut.enhance();

		const container = document.getElementsByClassName("ffe-cl-container");
		assert.lengthOf(container, 1);
	});
});
