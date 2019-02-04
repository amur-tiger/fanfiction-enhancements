import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as td from "testdouble";

import { SmartValue } from "../../../src/api/SmartValue";
import { Story } from "../../../src/api/Story";
import { StoryCard } from "../../../src/enhance/component/StoryCard";
import { ValueContainer } from "../../../src/api/ValueContainer";

chai.use(chaiAsPromised);
const assert = chai.assert;

describe("StoryCard Component", function () {
	function createStory(props?: object): Story {
		const story = {} as any;
		(story as any).alert = td.object<SmartValue<boolean>>();
		(story as any).favorite = td.object<SmartValue<boolean>>();
		(story as any).published = new Date();
		(story as any).updated = new Date();

		td.when(story.alert.get()).thenResolve();
		td.when(story.favorite.get()).thenResolve();

		if (props) {
			for (const key in props) {
				if (!props.hasOwnProperty(key)) {
					continue;
				}

				story[key] = props[key];
			}
		}

		return story;
	}

	afterEach(function () {
		td.reset();
	});

	it("should create a div element", function () {
		const vc = td.object<ValueContainer>();
		const story = createStory();

		const element = new StoryCard(vc).createElement(story);

		assert.equal(element.tagName, "DIV");
	});

	it("should insert a rating", function () {
		const vc = td.object<ValueContainer>();
		const story = createStory();

		const element = new StoryCard(vc).createElement(story);

		assert.isDefined(element.querySelector(".ffe-rating"));
	});

	it("should insert title", function () {
		const vc = td.object<ValueContainer>();
		const story = createStory({
			id: 123,
			title: "the title",
		});

		const element = new StoryCard(vc).createElement(story);

		const title = element.querySelector(".ffe-sc-title") as HTMLAnchorElement;
		assert.equal(title.tagName, "A");
		assert.equal(title.textContent, "the title");
		assert.equal(title.href, "/s/123");
	});

	it("should insert author", function () {
		const vc = td.object<ValueContainer>();
		const story = createStory({
			author: {
				id: 456,
				name: "author",
			},
		});

		const element = new StoryCard(vc).createElement(story);

		const author = element.querySelector(".ffe-sc-author") as HTMLAnchorElement;
		assert.equal(author.tagName, "A");
		assert.equal(author.textContent, "author");
		assert.equal(author.href, "/u/456");
	});

	it("should insert buttons", function () {
		const vc = td.object<ValueContainer>();
		const story = createStory();

		const element = new StoryCard(vc).createElement(story);

		const buttons = element.querySelector(".ffe-sc-mark") as HTMLDivElement;
		const follow = buttons.querySelector(".ffe-sc-follow") as HTMLSpanElement;
		const fav = buttons.querySelector(".ffe-sc-favorite") as HTMLSpanElement;

		assert.equal(follow.className, "ffe-sc-follow btn icon-bookmark-2");
		assert.equal(fav.className, "ffe-sc-favorite btn icon-heart");
	});

	it("should insert image", function () {
		const vc = td.object<ValueContainer>();
		const story = createStory({
			imageUrl: "/src/img.jpg",
			imageOriginalUrl: "/src/imgBig.jpg",
		});

		const element = new StoryCard(vc).createElement(story);

		const image = element.querySelector(".ffe-sc-image img") as HTMLImageElement;
		assert.equal(image.tagName, "IMG");
		assert.equal(image.src, "/src/imgBig.jpg");
	});

	it("should insert description", function () {
		const vc = td.object<ValueContainer>();
		const story = createStory({
			description: "this is a description",
		});

		const element = new StoryCard(vc).createElement(story);

		const description = element.querySelector(".ffe-sc-description");
		assert.equal(description.tagName, "DIV");
		assert.equal(description.textContent, "this is a description");
	});

	it("should insert relevant tags", function () {
		const vc = td.object<ValueContainer>();
		const story = createStory({
			id: 123,
			follows: 2,
			favorites: 1,
			language: "Elvish",
			genre: ["Adventure", "Fantasy"],
			characters: [["Adam", "Eva"], "Steve"],
			reviews: 11,
		});

		const element = new StoryCard(vc).createElement(story);

		const tags = element.querySelectorAll(".ffe-sc-tags .ffe-sc-tag");
		assert.equal(tags.length, 8);

		assert.equal(tags[0].textContent, "Elvish");
		assert.equal(tags[0].className, "ffe-sc-tag ffe-sc-tag-language");

		assert.equal(tags[1].textContent, "Adventure");
		assert.equal(tags[1].className, "ffe-sc-tag ffe-sc-tag-genre");
		assert.equal(tags[2].textContent, "Fantasy");
		assert.equal(tags[2].className, "ffe-sc-tag ffe-sc-tag-genre");

		assert.equal(tags[3].className, "ffe-sc-tag ffe-sc-tag-ship");
		assert.equal(tags[3].firstElementChild.textContent, "Adam");
		assert.equal(tags[3].firstElementChild.className, "ffe-sc-tag-character");
		assert.equal(tags[3].lastElementChild.textContent, "Eva");
		assert.equal(tags[3].lastElementChild.className, "ffe-sc-tag-character");
		assert.equal(tags[4].textContent, "Steve");
		assert.equal(tags[4].className, "ffe-sc-tag ffe-sc-tag-character");

		assert.equal(tags[5].textContent, "Reviews: 11");
		assert.equal(tags[5].firstElementChild.tagName, "A");
		assert.equal((tags[5].firstElementChild as HTMLAnchorElement).href, "/r/123/");

		assert.equal(tags[6].textContent, "Favorites: 1");
		assert.equal(tags[6].className, "ffe-sc-tag ffe-sc-tag-favs");

		assert.equal(tags[7].textContent, "Follows: 2");
		assert.equal(tags[7].className, "ffe-sc-tag ffe-sc-tag-follows");
	});

	it("should insert footer", function () {
		const vc = td.object<ValueContainer>();
		const story = createStory({
			words: 12345,
			status: "Complete",
		});

		const element = new StoryCard(vc).createElement(story);

		const footer = element.querySelector(".ffe-sc-footer");
		assert.equal(footer.childElementCount, 4);
		assert.equal(footer.children[0].textContent, "12,345 words");
		assert.equal(footer.children[1].textContent, "Complete");
		assert.equal(footer.children[2].lastElementChild.tagName, "TIME");
		assert.match(footer.children[2].textContent, /^Published: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
		assert.equal(footer.children[3].lastElementChild.tagName, "TIME");
		assert.match(footer.children[3].textContent, /^Updated: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
	});
});
