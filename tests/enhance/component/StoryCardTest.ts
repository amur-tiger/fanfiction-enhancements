import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as td from "testdouble";

import { SmartValue } from "../../../src/api/SmartValue";
import { Story } from "../../../src/api/Story";
import { StoryCard } from "../../../src/enhance/component/StoryCard";

chai.use(chaiAsPromised);
const assert = chai.assert;

describe("StoryCard Component", function () {
	function createStory(props?: object): Story {
		const story = {} as any;
		(story as any).alert = td.object<SmartValue<boolean>>();
		(story as any).favorite = td.object<SmartValue<boolean>>();
		(story as any).published = new Date();
		(story as any).updated = new Date();

		td.when(story.alert.get()).thenResolve(true);
		td.when(story.favorite.get()).thenResolve(true);

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
		const story = createStory();

		const element = new StoryCard({ story: story }).render();

		assert.equal(element.tagName, "DIV");
	});

	it("should insert a rating", function () {
		const story = createStory();

		const element = new StoryCard({ story: story }).render();

		assert.isDefined(element.querySelector(".ffe-rating"));
	});

	it("should insert title", function () {
		const story = createStory({
			id: 123,
			title: "the title",
		});

		const element = new StoryCard({ story: story }).render();

		const title = element.querySelector(".ffe-sc-title") as HTMLAnchorElement;
		assert.equal(title.tagName, "A");
		assert.equal(title.textContent, "the title");
		assert.equal(title.href, "/s/123");
	});

	it("should insert author", function () {
		const story = createStory({
			author: {
				id: 456,
				name: "author",
			},
		});

		const element = new StoryCard({ story: story }).render();

		const author = element.querySelector(".ffe-sc-author") as HTMLAnchorElement;
		assert.equal(author.tagName, "A");
		assert.equal(author.textContent, "author");
		assert.equal(author.href, "/u/456");
	});

	it("should insert buttons", function () {
		const story = createStory();

		const element = new StoryCard({ story: story }).render();

		const buttons = element.querySelector(".ffe-sc-mark") as HTMLDivElement;
		const follow = buttons.querySelector(".ffe-sc-follow") as HTMLSpanElement;
		const fav = buttons.querySelector(".ffe-sc-favorite") as HTMLSpanElement;

		assert.equal(follow.className, "btn ffe-sc-follow icon-bookmark-2");
		assert.equal(fav.className, "btn ffe-sc-favorite icon-heart");
	});

	it("should insert image", function () {
		const story = createStory({
			imageUrl: "/src/img.jpg",
			imageOriginalUrl: "/src/imgBig.jpg",
		});

		const element = new StoryCard({ story: story }).render();

		const image = element.querySelector(".ffe-sc-image img") as HTMLImageElement;
		assert.equal(image.tagName, "IMG");
		assert.equal(image.src, "/src/imgBig.jpg");
	});

	it("should insert description", function () {
		const story = createStory({
			description: "this is a description",
		});

		const element = new StoryCard({ story: story }).render();

		const description = element.querySelector(".ffe-sc-description");
		assert.equal(description.tagName, "DIV");
		assert.equal(description.textContent, "this is a description");
	});

	it("should insert relevant tags", function () {
		const story = createStory({
			id: 123,
			follows: 2,
			favorites: 1,
			language: "Elvish",
			genre: ["Adventure", "Fantasy"],
			characters: [["Adam", "Eva"], "Steve"],
			reviews: 11,
		});

		const element = new StoryCard({ story: story }).render();

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

		assert.equal(tags[5].textContent, "Reviews:\u00A011");
		assert.equal(tags[5].firstElementChild.tagName, "A");
		assert.equal((tags[5].firstElementChild as HTMLAnchorElement).href, "/r/123/");

		assert.equal(tags[6].textContent, "Favorites:\u00A01");
		assert.equal(tags[6].className, "ffe-sc-tag ffe-sc-tag-favorites");

		assert.equal(tags[7].textContent, "Follows:\u00A02");
		assert.equal(tags[7].className, "ffe-sc-tag ffe-sc-tag-follows");
	});

	it("should insert footer", function () {
		const story = createStory({
			words: 12345,
			status: "Complete",
			published: new Date(2012, 1, 3),
			updated: new Date(2012, 11, 24),
		});

		const element = new StoryCard({ story: story }).render();

		const footer = element.querySelector(".ffe-sc-footer");
		assert.equal(footer.childElementCount, 4);
		assert.equal(footer.children[0].textContent, "12,345 words");
		assert.equal(footer.children[1].textContent, "Complete");
		assert.equal(footer.children[2].lastElementChild.tagName, "TIME");
		assert.equal(footer.children[2].textContent, "Published:\u00A02/3/2012");
		assert.equal(footer.children[3].lastElementChild.tagName, "TIME");
		assert.equal(footer.children[3].textContent, "Updated:\u00A012/24/2012");
	});
});
