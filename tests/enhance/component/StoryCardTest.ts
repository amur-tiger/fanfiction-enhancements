import { assert } from "chai";
import { JSDOM } from "jsdom";
import StoryCard from "../../../src/enhance/component/StoryCard";

describe("Components", function() {
	describe("StoryCard", function() {
		const domFragment = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
		const document = domFragment.window.document;

		it("should create a div element", function() {
			const element = new StoryCard(document).createElement({});
			assert.equal(element.tagName, "DIV");
		});

		it("should insert a rating", function() {
			const element = new StoryCard(document).createElement({
				rating: "T",
			});
			assert.isDefined(element.querySelector(".ffe-rating"));
		});

		it("should insert title", function() {
			const element = new StoryCard(document).createElement({
				id: 123,
				title: "the title",
			});
			const title = element.querySelector(".ffe-sc-title") as HTMLAnchorElement;
			assert.equal(title.tagName, "A");
			assert.equal(title.textContent, "the title");
			assert.equal(title.href, "/s/123");
		});

		it("should insert author", function() {
			const element = new StoryCard(document).createElement({
				author: {
					id: 456,
					name: "author",
				},
			});
			const author = element.querySelector(".ffe-sc-author") as HTMLAnchorElement;
			assert.equal(author.tagName, "A");
			assert.equal(author.textContent, "author");
			assert.equal(author.href, "/u/456");
		});

		it("should insert image", function() {
			const element = new StoryCard(document).createElement({
				imageUrl: "/src/img.jpg",
			});
			const image = element.querySelector(".ffe-sc-image img") as HTMLImageElement;
			assert.equal(image.tagName, "IMG");
			assert.equal(image.src, "/src/img.jpg");
		});

		it("should insert description", function() {
			const element = new StoryCard(document).createElement({
				description: "this is a description",
			});
			const description = element.querySelector(".ffe-sc-description");
			assert.equal(description.tagName, "DIV");
			assert.equal(description.textContent, "this is a description");
		});

		it("should insert relevant tags", function() {
			const element = new StoryCard(document).createElement({
				id: 123,
				language: "Elvish",
				genre: "Adventure/Fantasy",
				reviews: 11,
				updated: new Date(),
				updatedWords: "today",
			});
			const tags = element.querySelectorAll(".ffe-sc-tags .ffe-sc-tag");
			assert.equal(tags.length, 3);

			assert.equal(tags[0].textContent, "Elvish");
			assert.equal(tags[1].textContent, "Adventure/Fantasy");
			assert.equal(tags[2].firstElementChild.tagName, "A");
			assert.equal((tags[2].firstElementChild as HTMLAnchorElement).href, "/r/123");
		});

		it("should insert footer", function() {
			const element = new StoryCard(document).createElement({
				words: 12345,
				status: "Complete",
				published: new Date(),
				publishedWords: "today",
			});
			const footer = element.querySelector(".ffe-sc-footer");
			assert.equal(footer.childElementCount, 3);
			assert.equal(footer.children[0].textContent, "12,345 words");
			assert.equal(footer.children[1].textContent, "Complete");
			assert.equal(footer.children[2].lastElementChild.tagName, "TIME");
			assert.equal(footer.children[2].textContent, "Published: today");
		});
	});
});
