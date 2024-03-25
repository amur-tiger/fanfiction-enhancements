import { describe, expect, it, vi } from "vitest";
import type { Chapter, Story } from "ffn-parser";
import { environment } from "../util/environment";
import ChapterList from "./ChapterList";

vi.mock("../util/environment");

describe.skip("Chapter List", () => {
  const fragmentHTML = `<!--suppress HtmlUnknownTarget, HtmlRequiredAltAttribute, HtmlDeprecatedAttribute -->
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

  function createChapter(id: number, name: string, words: number): Chapter {
    return {
      storyId: 0,
      id,
      title: name,
    };
  }

  function createStory(id: number, chapters?: Chapter[]): Story {
    const story: Story = {
      id,
    } as never;

    (story as { chapters?: Chapter[] }).chapters = chapters ?? [
      createChapter(0, "prologue", 1),
      createChapter(1, "chapter 1", 2),
      createChapter(2, "epilogue", 3),
    ];

    return story;
  }

  it("should clean elements", async () => {
    document.body.innerHTML = fragmentHTML;
    environment.currentStoryId = 1;

    const chapterList = new ChapterList();

    await chapterList.enhance();

    const preStoryLinks = document.getElementById("pre_story_links");
    expect(preStoryLinks).toBeDefined();

    const image = document.getElementById("img_large");
    expect(image).toBeDefined();

    const profile = document.getElementById("profile_top");
    expect(profile).toBeDefined();

    const review = document.getElementById("review");
    expect(review).toBeDefined();

    const storyText = document.getElementById("storytextp");
    expect(storyText).toBeNull();

    const contentWrapper = document.getElementById("content_wrapper_inner");
    expect(contentWrapper?.children.length).toBe(7);
  });

  it("should insert chapter list", async () => {
    document.body.innerHTML = fragmentHTML;
    environment.currentStoryId = 1;

    const chapterList = new ChapterList();

    await chapterList.enhance();

    const container = document.getElementsByClassName("ffe-cl-container");
    expect(container).toHaveLength(1);
  });
});
