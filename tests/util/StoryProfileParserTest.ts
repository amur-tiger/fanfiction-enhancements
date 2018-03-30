import { assert } from "chai";
import { JSDOM } from "jsdom";
import StoryProfileParser from "../../src/util/StoryProfileParser";

describe("Story Profile Parser", function() {
	const params = [
		{
			fragment: JSDOM.fragment(`<div>
	<span><img src="/src/img.jpg" /></span>
	<button><!-- follow+fav button --></button>
	<b>title</b>
	<span>by</span>
	<a href="/u/678/author">author</a>
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
			authorId: 678,
			author: "author",
			description: "description",
			imageUrl: "/src/img.jpg",
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
		},
		{
			fragment: JSDOM.fragment(`<div>
	<button><!-- follow+fav button --></button>
	<b>story</b>
	<span>by</span>
	<a href="/u/345/guy">guy</a>
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
			authorId: 345,
			author: "guy",
			description: "something",
			imageUrl: undefined,
			rating: "T",
			language: "Klingon",
			genre: "Sci-Fi",
			chapters: 19,
			words: 3210,
			reviews: 123,
			favs: 345,
			follows: 567,
			updated: 1517639271000,
			updatedWords: "Feb 3",
			published: 1426879324000,
			publishedWords: "Mar 20, 2015",
			id: 12345678,
		},
	];

	params.forEach(function(param) {
		describe("(" + param.test + ")", function() {
			it("should recognize id", function() {
				const sut = new StoryProfileParser();
				const result = sut.parse(param.fragment);
				assert.equal(result.id, param.id);
			});

			it("should recognize title", function() {
				const sut = new StoryProfileParser();
				const result = sut.parse(param.fragment);
				assert.equal(result.title, param.title);
			});

			it("should recognize author", function() {
				const sut = new StoryProfileParser();
				const result = sut.parse(param.fragment);
				assert.equal(result.author.id, param.authorId);
				assert.equal(result.author.name, param.author);
			});

			it("should recognize description", function() {
				const sut = new StoryProfileParser();
				const result = sut.parse(param.fragment);
				assert.equal(result.description, param.description);
			});

			it("should recognize image url", function() {
				const sut = new StoryProfileParser();
				const result = sut.parse(param.fragment);
				assert.equal(result.imageUrl, param.imageUrl);
			});

			it("should recognize chapters", function() {
				const sut = new StoryProfileParser();
				const result = sut.parse(param.fragment);
				assert.equal(result.chapters, param.chapters);
			});

			it("should recognize favorites", function() {
				const sut = new StoryProfileParser();
				const result = sut.parse(param.fragment);
				assert.equal(result.favs, param.favs);
			});

			it("should recognize follows", function() {
				const sut = new StoryProfileParser();
				const result = sut.parse(param.fragment);
				assert.equal(result.follows, param.follows);
			});

			it("should recognize reviews", function() {
				const sut = new StoryProfileParser();
				const result = sut.parse(param.fragment);
				assert.equal(result.reviews, param.reviews);
			});

			it("should recognize genre", function() {
				const sut = new StoryProfileParser();
				const result = sut.parse(param.fragment);
				assert.equal(result.genre, param.genre);
			});

			it("should recognize language", function() {
				const sut = new StoryProfileParser();
				const result = sut.parse(param.fragment);
				assert.equal(result.language, param.language);
			});

			it("should recognize publish date", function() {
				const sut = new StoryProfileParser();
				const result = sut.parse(param.fragment);
				assert.equal(result.published.getTime(), param.published);
				assert.equal(result.publishedWords, param.publishedWords);
			});

			it("should recognize update date", function() {
				const sut = new StoryProfileParser();
				const result = sut.parse(param.fragment);
				assert.equal(result.updated.getTime(), param.updated);
				assert.equal(result.updatedWords, param.updatedWords);
			});

			it("should recognize rating", function() {
				const sut = new StoryProfileParser();
				const result = sut.parse(param.fragment);
				assert.equal(result.rating, param.rating);
			});

			it("should recognize words", function() {
				const sut = new StoryProfileParser();
				const result = sut.parse(param.fragment);
				assert.equal(result.words, param.words);
			});
		});
	});
});
