import { assert } from "chai";
import { JSDOM } from "jsdom";
import StoryProfile from "../src/StoryProfile";

describe("Story Profile", function() {
	const domFragment = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
	global["window"] = domFragment.window;
	global["document"] = domFragment.window.document;

	global["GM_addStyle"] = () => {
		// dummy function
	};

	const params = [
		{
			fragment: JSDOM.fragment(`<div>
	<span><img /></span>
	<button><!-- follow+fav button --></button>
	<b>title</b>
	<span>by</span>
	<a href="#author-url">author</a>
	<span><!-- mail icon --></span>
	<a><!-- message link --></a>
	<div>description</div>
	<span>
		Rated: <a>M</a> - Elvish - Fantasy - Chapters: 33 - Words: 1,234 - Reviews: <a>123</a> - Favs: 345 - Follows: 
		567 - Updated: <span data-xutime="1517639271">Feb 3</span> - Published: 
		<span data-xutime="1426879324">Mar 20, 2015</span> - id: 12345678
	</span>
</div>`).firstChild as HTMLElement,
			test: "With Image",
			title: "title",
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
			published: 1426879324000,
			id: 12345678,
		},
		{
			fragment: JSDOM.fragment(`<div>
	<button><!-- follow+fav button --></button>
	<b>story</b>
	<span>by</span>
	<a href="#author-url">guy</a>
	<span><!-- mail icon --></span>
	<a><!-- message link --></a>
	<div>something</div>
	<span>
		Rated: <a>T</a> - Klingon - Sci-Fi - Chapters: 19 - Words: 3,210 - Reviews: <a>123</a> - Favs: 345 - Follows: 
		567 - Updated: <span data-xutime="1517639271">Feb 3</span> - Published: 
		<span data-xutime="1426879324">Mar 20, 2015</span> - id: 12345678
	</span>
</div>`).firstChild as HTMLElement,
			test: "Without Image",
			title: "story",
			author: "guy",
			description: "something",
			rating: "T",
			language: "Klingon",
			genre: "Sci-Fi",
			chapters: 19,
			words: 3210,
			reviews: 123,
			favs: 345,
			follows: 567,
			updated: 1517639271000,
			published: 1426879324000,
			id: 12345678,
		},
	];

	params.forEach(function(param) {
		describe("(" + param.test + ")", function() {
			describe("Element Recognition", function() {
				it("should recognize title", function() {
					const sut = new StoryProfile(param.fragment);
					assert.equal(sut.titleElement.textContent, param.title);
				});

				it("should recognize author", function() {
					const sut = new StoryProfile(param.fragment);
					assert.equal(sut.authorElement.textContent, param.author);
				});

				it("should recognize description", function() {
					const sut = new StoryProfile(param.fragment);
					assert.equal(sut.descriptionElement.textContent, param.description);
				});

				it("should recognize tags", function() {
					const sut = new StoryProfile(param.fragment);
					assert.isAbove(sut.tagsElement.textContent.length, 100);
				});
			});

			describe("Tag Recognition", function() {
				it("should recognize id", function() {
					const sut = new StoryProfile(param.fragment);
					assert.equal(sut.tags.id, param.id);
				});

				it("should recognize chapters", function() {
					const sut = new StoryProfile(param.fragment);
					assert.equal(sut.tags.chapters, param.chapters);
				});

				it("should recognize favorites", function() {
					const sut = new StoryProfile(param.fragment);
					assert.equal(sut.tags.favs, param.favs);
				});

				it("should recognize follows", function() {
					const sut = new StoryProfile(param.fragment);
					assert.equal(sut.tags.follows, param.follows);
				});

				it("should recognize reviews", function() {
					const sut = new StoryProfile(param.fragment);
					assert.equal(sut.tags.reviews, param.reviews);
				});

				it("should recognize genre", function() {
					const sut = new StoryProfile(param.fragment);
					assert.equal(sut.tags.genre, param.genre);
				});

				it("should recognize language", function() {
					const sut = new StoryProfile(param.fragment);
					assert.equal(sut.tags.language, param.language);
				});

				it("should recognize publish date", function() {
					const sut = new StoryProfile(param.fragment);
					assert.equal(sut.tags.published.getTime(), param.published);
				});

				it("should recognize update date", function() {
					const sut = new StoryProfile(param.fragment);
					assert.equal(sut.tags.updated.getTime(), param.updated);
				});

				it("should recognize rating", function() {
					const sut = new StoryProfile(param.fragment);
					assert.equal(sut.tags.rating, param.rating);
				});

				it("should recognize words", function() {
					const sut = new StoryProfile(param.fragment);
					assert.equal(sut.tags.words, param.words);
				});
			});
		});
	});

	describe("HTML Insertion", function() {
		const param = params[0];

		it("should insert styles", function() {
			let hit = false;
			global["GM_addStyle"] = str => hit = str.length > 0;

			const sut = new StoryProfile(param.fragment.cloneNode(true) as HTMLElement);
			sut.enhance();

			assert.equal(hit, true);
		});

		it("should insert rating indicator", function() {
			const fragment = param.fragment.cloneNode(true) as HTMLElement;
			const sut = new StoryProfile(fragment);
			sut.enhance();

			const element = fragment.children[2] as HTMLAnchorElement;
			assert.equal(element.href, "https://www.fictionratings.com/");
			assert.equal(element.textContent, "M");
			assert.equal(element.title, "Teens (16+)");
		});
	});
});
