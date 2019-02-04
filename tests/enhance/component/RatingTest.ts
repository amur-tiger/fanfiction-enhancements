import { assert } from "chai";

import { Rating } from "../../../src/enhance/component/Rating";

describe("Rating Component", function() {
	it("should create an anchor element with certain properties", function() {
		const element = new Rating({ rating: "K" }).render();

		assert.equal(element.href, "https://www.fictionratings.com/");
		assert.include(element.className, "ffe-rating");
		assert.equal(element.rel, "noreferrer");
		assert.equal(element.target, "rating");
	});

	it("should create default element for invalid ratings", function() {
		const element = new Rating({ rating: "not a rating" }).render();

		assert.equal(element.textContent, "?");
		assert.equal(element.className, "ffe-rating");
		assert.equal(element.title, "No Rating Available");
	});

	it("should create element for general audiences", function() {
		const element = new Rating({ rating: "K" }).render();

		assert.equal(element.textContent, "K");
		assert.equal(element.className, "ffe-rating ffe-rating-k");
		assert.equal(element.title, "General Audience (5+)");
	});

	it("should create element for young children", function() {
		const element = new Rating({ rating: "K+" }).render();

		assert.equal(element.textContent, "K+");
		assert.equal(element.className, "ffe-rating ffe-rating-kp");
		assert.equal(element.title, "Young Children (9+)");
	});

	it("should create element for teens", function() {
		const element = new Rating({ rating: "T" }).render();

		assert.equal(element.textContent, "T");
		assert.equal(element.className, "ffe-rating ffe-rating-t");
		assert.equal(element.title, "Teens (13+)");
	});

	it("should create element for elder teens", function() {
		const element = new Rating({ rating: "M" }).render();

		assert.equal(element.textContent, "M");
		assert.equal(element.className, "ffe-rating ffe-rating-m");
		assert.equal(element.title, "Teens (16+)");
	});

	it("should create element for mature audiences", function() {
		const element = new Rating({ rating: "MA" }).render();

		assert.equal(element.textContent, "MA");
		assert.equal(element.className, "ffe-rating ffe-rating-ma");
		assert.equal(element.title, "Mature (18+)");
	});
});
