import { assert } from "chai";

import { environment } from "../../src/util/environment";
import { parseProfile } from "../../src/util/parser";

describe("Story Profile Parser", function() {
	environment.validGenres.push(
		"Adventure",
		"Fantasy",
		"Sci-Fi",
	);

	const params = [
		{
			fragment: `<!--suppress HtmlUnknownTarget, HtmlRequiredAltAttribute -->
<div id="test-wrapper">
	<div id="profile_top">
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
	</div>
	<select id="chap_select">
		<option value="1">Chapter 1</option>
		<option value="2">Chapter 2</option>
	</select>
</div>`,
			test: "With Image",
			title: "title",
			authorId: 678,
			author: "author",
			description: "description",
			imageUrl: "/src/img.jpg",
			rating: "M",
			language: "Elvish",
			genre: ["Fantasy"],
			characters: [],
			chapters: [{
				id: 1,
				name: "Chapter 1",
			}, {
				id: 2,
				name: "Chapter 2",
			}],
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
			fragment: `<!--suppress HtmlUnknownTarget, HtmlRequiredAltAttribute -->
<div id="test-wrapper">
	<div id="profile_top">
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
	</div>
	<select id="chap_select">
		<option value="1">Intro</option>
	</select>
</div>`,
			test: "Without Image",
			title: "story",
			authorId: 345,
			author: "guy",
			description: "something",
			imageUrl: undefined,
			rating: "T",
			language: "Klingon",
			genre: ["Sci-Fi"],
			characters: [],
			chapters: [{
				id: 1,
				name: "Intro",
			}],
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
		{
			fragment: `<!--suppress HtmlUnknownTarget, HtmlRequiredAltAttribute, HtmlUnknownTag -->
<div id="test-wrapper">
	<div id="profile_top">
		<span><img src="/image/12345/75/" width="75" height="100"></span>
		<button><!-- follow+fav button --></button>
		<b>The Title</b>
		<span><div style="height:5px"></div>By:</span>
		<a href="/u/12345/author">Author</a>
		<span><!-- mail icon --></span>
		<a><!-- message link --></a>
		<div>Description.</div>
		<span class="xgray xcontrast_txt">Rated: <a>Fiction  T</a>
		 - English - Adventure -  Naruto U., Shikamaru N., OC - Chapters: 145   - Words: 692,018 - Reviews:
		 <a href="/r/12345/">21,234</a> - Favs: 13,936 - Follows: 13,707 - Updated: <span data-xutime="1520735917">Mar 11
		 </span> - Published: <span data-xutime="1315014342">Sep 3, 2011</span> - id: 123456 </span>
	</div>
	<select id="chap_select">
		<option value="1">Intro</option>
	</select>
</div>
`,
			test: "Tags with garbage data",
			title: "The Title",
			authorId: 12345,
			author: "Author",
			description: "Description.",
			imageUrl: "/image/12345/75/",
			rating: "T",
			language: "English",
			genre: ["Adventure"],
			characters: ["Naruto U.", "Shikamaru N.", "OC"],
			chapters: [{
				id: 1,
				name: "Intro",
			}],
			words: 692018,
			reviews: 21234,
			favs: 13936,
			follows: 13707,
			updated: 1520735917000,
			updatedWords: "Mar 11",
			published: 1315014342000,
			publishedWords: "Sep 3, 2011",
			id: 123456,
		},
		{
			fragment: `<!--suppress HtmlUnknownTarget, HtmlRequiredAltAttribute -->
<div id="test-wrapper">
	<div id="profile_top">
		<span><img src="/src/img.jpg" /></span>
		<button><!-- follow+fav button --></button>
		<b>title</b>
		<span>by</span>
		<a href="/u/678/author">author</a>
		<span><!-- mail icon --></span>
		<a><!-- message link --></a>
		<div>description</div>
		<span>
			Rated: <a>M</a> - Elvish - Fantasy - [Romeo, Juliet] Steve - Chapters: 33 - Words: 1,234 - Reviews:
			<a>123</a> - Favs: 345 - Follows: 567 - Updated: <span data-xutime="1517639271">Feb 3</span> - Published:
			<span data-xutime="1426879324">Mar 20, 2015</span> - id: 12345678
		</span>
	</div>
	<div id="storytext">Two words.</div>
</div>`,
			test: "Missing Chapter Select",
			title: "title",
			authorId: 678,
			author: "author",
			description: "description",
			imageUrl: "/src/img.jpg",
			rating: "M",
			language: "Elvish",
			genre: ["Fantasy"],
			characters: [
				["Romeo", "Juliet"],
				"Steve",
			],
			chapters: [{
				id: 1,
				name: "title",
			}],
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
			fragment: `<!--suppress HtmlUnknownTarget, HtmlRequiredAltAttribute, HtmlUnknownTag -->
<div id="test-wrapper">
	<div id="profile_top">
		<span><img src="/image/12345/75/" width="75" height="100"></span>
		<button><!-- follow+fav button --></button>
		<b>The Title</b>
		<span><div style="height:5px"></div>By:</span>
		<a href="/u/12345/author">Author</a>
		<span><!-- mail icon --></span>
		<a><!-- message link --></a>
		<div>Description.</div>
		<span class="xgray xcontrast_txt">Rated: <a>Fiction  T</a>
		 - English - Naruto U., Shikamaru N., OC - Chapters: 145   - Words: 692,018 - Reviews:
		 <a href="/r/12345/">21,234</a> - Favs: 13,936 - Follows: 13,707 - Updated: <span data-xutime="1520735917">Mar 11
		 </span> - Published: <span data-xutime="1315014342">Sep 3, 2011</span> - id: 123456 </span>
	</div>
	<select id="chap_select">
		<option value="1">Intro</option>
	</select>
</div>
`,
			test: "Missing genre tag",
			title: "The Title",
			authorId: 12345,
			author: "Author",
			description: "Description.",
			imageUrl: "/image/12345/75/",
			rating: "T",
			language: "English",
			genre: [],
			characters: ["Naruto U.", "Shikamaru N.", "OC"],
			chapters: [{
				id: 1,
				name: "Intro",
			}],
			words: 692018,
			reviews: 21234,
			favs: 13936,
			follows: 13707,
			updated: 1520735917000,
			updatedWords: "Mar 11",
			published: 1315014342000,
			publishedWords: "Sep 3, 2011",
			id: 123456,
		},
	];

	params.forEach(function(param) {
		describe("(" + param.test + ")", function() {
			it("should recognize id", function() {
				const result = parseProfile(param.fragment);
				assert.equal(result.id, param.id);
			});

			it("should recognize title", function() {
				const result = parseProfile(param.fragment);
				assert.equal(result.title, param.title);
			});

			it("should recognize author", function() {
				const result = parseProfile(param.fragment);
				assert.equal(result.authorId, param.authorId);
				assert.equal(result.author, param.author);
			});

			it("should recognize description", function() {
				const result = parseProfile(param.fragment);
				assert.equal(result.description, param.description);
			});

			it("should recognize chapters", function() {
				const result = parseProfile(param.fragment);
				assert.equal(result.chapters.length, param.chapters.length);
				for (let i = 0; i < param.chapters.length; i++) {
					assert.equal(result.chapters[i].id, param.chapters[i].id);
					assert.equal(result.chapters[i].name, param.chapters[i].name);
				}
			});

			it("should recognize image url", function() {
				const result = parseProfile(param.fragment);
				assert.equal(result.imageUrl, param.imageUrl);
			});

			it("should recognize favorites", function() {
				const result = parseProfile(param.fragment);
				assert.equal(result.favorites, param.favs);
			});

			it("should recognize follows", function() {
				const result = parseProfile(param.fragment);
				assert.equal(result.follows, param.follows);
			});

			it("should recognize reviews", function() {
				const result = parseProfile(param.fragment);
				assert.equal(result.reviews, param.reviews);
			});

			it("should recognize genre", function() {
				const result = parseProfile(param.fragment);
				assert.deepEqual(result.genre, param.genre);
			});

			it("should recognize characters", function() {
				const result = parseProfile(param.fragment);
				assert.deepEqual(result.characters, param.characters);
			});

			it("should recognize language", function() {
				const result = parseProfile(param.fragment);
				assert.equal(result.language, param.language);
			});

			it("should recognize publish date", function() {
				const result = parseProfile(param.fragment);
				assert.equal(result.published, new Date(param.published).toISOString());
			});

			it("should recognize update date", function() {
				const result = parseProfile(param.fragment);
				assert.equal(result.updated, new Date(param.updated).toISOString());
			});

			it("should recognize rating", function() {
				const result = parseProfile(param.fragment);
				assert.equal(result.rating, param.rating);
			});

			it("should recognize words", function() {
				const result = parseProfile(param.fragment);
				assert.equal(result.words, param.words);
			});
		});
	});
});
