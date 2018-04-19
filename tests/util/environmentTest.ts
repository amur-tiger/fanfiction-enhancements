import { assert } from "chai";

import { getPage, Page } from "../../src/util/environment";

describe("Environment", function() {
	describe("Page Identification", function() {
		const noOp = () => {
			// no operation
		};

		it("should recognize user pages", function() {
			const location: Location = {
				hash: "",
				host: "www.fanfiction.net",
				hostname: "www.fanfiction.net",
				href: "https://www.fanfiction.net/u/1234567/username",
				origin: "https://www.fanfiction.net",
				pathname: "/u/1234567/username",
				port: "",
				protocol: "https:",
				search: "",

				assign: noOp,
				reload: noOp,
				replace: noOp,
			};

			assert.equal(getPage(location), Page.User);
		});

		it("should recognize chapter pages", function() {
			const location: Location = {
				hash: "",
				host: "www.fanfiction.net",
				hostname: "www.fanfiction.net",
				href: "https://www.fanfiction.net/s/1234567/1/chapter",
				origin: "https://www.fanfiction.net",
				pathname: "/s/1234567/1/chapter",
				port: "",
				protocol: "https:",
				search: "",

				assign: noOp,
				reload: noOp,
				replace: noOp,
			};

			assert.equal(getPage(location), Page.Chapter);
		});

		it("should return other on other pages", function() {
			const location: Location = {
				hash: "",
				host: "www.fanfiction.net",
				hostname: "www.fanfiction.net",
				href: "https://www.fanfiction.net/blog/1234567/some-blog-post",
				origin: "https://www.fanfiction.net",
				pathname: "/blog/1234567/some-blog-post",
				port: "",
				protocol: "https:",
				search: "",

				assign: noOp,
				reload: noOp,
				replace: noOp,
			};

			assert.equal(getPage(location), Page.Other);
		});
	});
});
