import { assert } from "chai";
import { JSDOM } from "jsdom";
import StoryProfile from "../../src/enhance/StoryProfile";

describe("Story Profile", function() {
	const domFragment = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
	global["window"] = domFragment.window;
	global["document"] = domFragment.window.document;

	describe("HTML Insertion", function() {
		const param = {
			fragment: JSDOM.fragment(`<div>
	<span><img /></span>
	<button><!-- follow+fav button --></button>
	<b>title</b>
	<span>by</span>
	<a href="/u/234/author">author</a>
	<span><!-- mail icon --></span>
	<a><!-- message link --></a>
	<div>description</div>
	<span>
		Rated: <a>M</a> - Elvish - Fantasy - Chapters: 33 - Words: 1,234 - Reviews: <a>123</a> - Favs: 345 - Follows: 
		567 - Updated: <span data-xutime="1517639271">Feb 3</span> - Published: 
		<span data-xutime="1426879324">Mar 20, 2015</span> - id: 12345678
	</span>
</div>`).firstChild as HTMLElement,
			title: "title",
			authorId: 234,
			author: "author",
			description: "description",
			rating: "M",
			language: "Elvish",
			genre: "Fantasy",
			chapters: 33,
			words: 1234,
			reviews: 123,
			favs: 345,
			follows: 567,
			updated: 1517639271000,
			updatedWords: "Feb 3",
			published: 1426879324000,
			publishedWords: "Mar 20, 2015",
			id: 12345678,
		};
		const wrapper = document.createElement("div");
		wrapper.appendChild(param.fragment);
		wrapper.appendChild(document.createElement("div"));

		it("should insert story card", function() {
			const fragment = wrapper.cloneNode(true) as HTMLElement;
			const sut = new StoryProfile(fragment.firstElementChild as HTMLElement);
			sut.enhance();

			const element = (fragment.firstElementChild as HTMLElement);
			assert.equal(element.className, "ffe-sc");
			assert.equal(fragment.children.length, 2);
		});
	});
});
