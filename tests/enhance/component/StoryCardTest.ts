import { assert } from "chai";

import { Api } from "../../../src/api/api";
import { Chapter, Story } from "../../../src/api/data";
import { StoryCard } from "../../../src/enhance/component/StoryCard";

describe("StoryCard Component", function() {
	it("should create a div element", function() {
		const api: Api = {} as any;
		const element = new StoryCard(document, api).createElement(new Story(0, "", {
				id: 0,
				name: "",
				profileUrl: "",
				avatarUrl: "",
			}, "", [new Chapter(0, 0, "", 0)], {}));

		assert.equal(element.tagName, "DIV");
	});

	it("should insert a rating", function() {
		const api: Api = {} as any;
		const element = new StoryCard(document, api).createElement(new Story(0, "", {
			id: 0,
			name: "",
			profileUrl: "",
			avatarUrl: "",
		}, "", [new Chapter(0, 0, "", 0)], {}));

		assert.isDefined(element.querySelector(".ffe-rating"));
	});

	it("should insert title", function() {
		const api: Api = {} as any;
		const element = new StoryCard(document, api).createElement(new Story(123, "the title", {
			id: 0,
			name: "",
			profileUrl: "",
			avatarUrl: "",
		}, "", [new Chapter(0, 0, "", 0)], {}));

		const title = element.querySelector(".ffe-sc-title") as HTMLAnchorElement;
		assert.equal(title.tagName, "A");
		assert.equal(title.textContent, "the title");
		assert.equal(title.href, "/s/123");
	});

	it("should insert author", function() {
		const api: Api = {} as any;
		const element = new StoryCard(document, api).createElement(new Story(0, "", {
			id: 456,
			name: "author",
			profileUrl: "/u/456",
			avatarUrl: "",
		}, "", [new Chapter(0, 0, "", 0)], {}));

		const author = element.querySelector(".ffe-sc-author") as HTMLAnchorElement;
		assert.equal(author.tagName, "A");
		assert.equal(author.textContent, "author");
		assert.equal(author.href, "/u/456");
	});

	it("should insert buttons", function() {
		const api: Api = {} as any;
		const element = new StoryCard(document, api).createElement(new Story(0, "", {
			id: 0,
			name: "",
			profileUrl: "",
			avatarUrl: "",
		}, "", [new Chapter(0, 0, "", 0)], {}));

		const buttons = element.querySelector(".ffe-sc-mark") as HTMLDivElement;
		const follow = buttons.querySelector(".ffe-sc-follow") as HTMLSpanElement;
		const fav = buttons.querySelector(".ffe-sc-favorite") as HTMLSpanElement;

		assert.equal(follow.className, "ffe-sc-follow btn icon-bookmark-2");
		assert.equal(fav.className, "ffe-sc-favorite btn icon-heart");
	});

	it("should insert image", function() {
		const api: Api = {} as any;
		const element = new StoryCard(document, api).createElement(new Story(0, "", {
			id: 0,
			name: "",
			profileUrl: "",
			avatarUrl: "",
		}, "", [new Chapter(0, 0, "", 0)], {
			imageUrl: "/src/img.jpg",
			imageOriginalUrl: "/src/imgBig.jpg",
		}));

		const image = element.querySelector(".ffe-sc-image img") as HTMLImageElement;
		assert.equal(image.tagName, "IMG");
		assert.equal(image.src, "/src/imgBig.jpg");
	});

	it("should insert description", function() {
		const api: Api = {} as any;
		const element = new StoryCard(document, api).createElement(new Story(0, "", {
			id: 0,
			name: "",
			profileUrl: "",
			avatarUrl: "",
		}, "this is a description", [new Chapter(0, 0, "", 0)], {}));

		const description = element.querySelector(".ffe-sc-description");
		assert.equal(description.tagName, "DIV");
		assert.equal(description.textContent, "this is a description");
	});

	it("should insert relevant tags", function() {
		const api: Api = {} as any;
		const element = new StoryCard(document, api).createElement(new Story(123, "", {
			id: 0,
			name: "",
			profileUrl: "",
			avatarUrl: "",
		}, "", [new Chapter(0, 0, "", 0)], {
			language: "Elvish",
			genre: ["Adventure", "Fantasy"],
			characters: [
				["Adam", "Eva"],
				"Steve",
			],
			reviews: 11,
			updated: new Date(),
			updatedWords: "today",
		}));

		const tags = element.querySelectorAll(".ffe-sc-tags .ffe-sc-tag");
		assert.equal(tags.length, 6);

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
	});

	it("should insert footer", function() {
		const api: Api = {} as any;
		const element = new StoryCard(document, api).createElement(new Story(0, "", {
			id: 0,
			name: "",
			profileUrl: "",
			avatarUrl: "",
		}, "", [new Chapter(0, 0, "", 0)], {
			words: 12345,
			status: "Complete",
			published: new Date(),
			publishedWords: "today",
		}));

		const footer = element.querySelector(".ffe-sc-footer");
		assert.equal(footer.childElementCount, 3);
		assert.equal(footer.children[0].textContent, "12,345 words");
		assert.equal(footer.children[1].textContent, "Complete");
		assert.equal(footer.children[2].lastElementChild.tagName, "TIME");
		assert.equal(footer.children[2].textContent, "Published: today");
	});
});
