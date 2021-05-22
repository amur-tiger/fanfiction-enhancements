import { getPage, Page } from "./environment";

describe("Environment", () => {
  describe("Page Identification", () => {
    const noOp = () => {
      // no operation
    };

    it("should recognize user pages", () => {
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
        ancestorOrigins: undefined as unknown as DOMStringList,

        assign: noOp,
        reload: noOp,
        replace: noOp,
      };

      expect(getPage(location)).toBe(Page.User);
    });

    it("should match story list crossovers 1", () => {
      const location: Location = {
        hash: "",
        host: "www.fanfiction.net",
        hostname: "www.fanfiction.net",
        href: "https://www.fanfiction.net/Harry-Potter-Crossovers/224/0/?&srt=4&r=10",
        origin: "https://www.fanfiction.net",
        pathname: "/Harry-Potter-Crossovers/224/0/?&srt=4&r=10",
        port: "",
        protocol: "https:",
        search: "",
        ancestorOrigins: undefined as unknown as DOMStringList,

        assign: noOp,
        reload: noOp,
        replace: noOp,
      };

      expect(getPage(location)).toBe(Page.StoryList);
    });

    it("should match story list crossovers 2", () => {
      const location: Location = {
        hash: "",
        host: "www.fanfiction.net",
        hostname: "www.fanfiction.net",
        href: "https://www.fanfiction.net/Harry-Potter_Crossovers/224/0/?&srt=4&r=10&p=2",
        origin: "https://www.fanfiction.net",
        pathname: "/Harry-Potter_Crossovers/224/0/?&srt=4&r=10&p=2",
        port: "",
        protocol: "https:",
        search: "",
        ancestorOrigins: undefined as unknown as DOMStringList,

        assign: noOp,
        reload: noOp,
        replace: noOp,
      };

      expect(getPage(location)).toBe(Page.StoryList);
    });

    it("should recognize the alerts page", () => {
      const location: Location = {
        hash: "",
        host: "www.fanfiction.net",
        hostname: "www.fanfiction.net",
        href: "https://www.fanfiction.net/alert/story.php",
        origin: "https://www.fanfiction.net",
        pathname: "/alert/story.php",
        port: "",
        protocol: "https:",
        search: "",
        ancestorOrigins: undefined as unknown as DOMStringList,

        assign: noOp,
        reload: noOp,
        replace: noOp,
      };

      expect(getPage(location)).toBe(Page.Alerts);
    });

    it("should recognize the favorites page", () => {
      const location: Location = {
        hash: "",
        host: "www.fanfiction.net",
        hostname: "www.fanfiction.net",
        href: "https://www.fanfiction.net/favorites/story.php",
        origin: "https://www.fanfiction.net",
        pathname: "/favorites/story.php",
        port: "",
        protocol: "https:",
        search: "",
        ancestorOrigins: undefined as unknown as DOMStringList,

        assign: noOp,
        reload: noOp,
        replace: noOp,
      };

      expect(getPage(location)).toBe(Page.Favorites);
    });

    it("should recognize story pages", () => {
      const location: Location = {
        hash: "",
        host: "www.fanfiction.net",
        hostname: "www.fanfiction.net",
        href: "https://www.fanfiction.net/s/1234567",
        origin: "https://www.fanfiction.net",
        pathname: "/s/1234567",
        port: "",
        protocol: "https:",
        search: "",
        ancestorOrigins: undefined as unknown as DOMStringList,

        assign: noOp,
        reload: noOp,
        replace: noOp,
      };

      expect(getPage(location)).toBe(Page.Story);
    });

    it("should recognize chapter pages", () => {
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
        ancestorOrigins: undefined as unknown as DOMStringList,

        assign: noOp,
        reload: noOp,
        replace: noOp,
      };

      expect(getPage(location)).toBe(Page.Chapter);
    });

    it("should recognize oauth return page", () => {
      const location: Location = {
        hash: "",
        host: "www.fanfiction.net",
        hostname: "www.fanfiction.net",
        href: "https://www.fanfiction.net/ffe-oauth2-return",
        origin: "https://www.fanfiction.net",
        pathname: "/ffe-oauth2-return",
        port: "",
        protocol: "https:",
        search: "",
        ancestorOrigins: undefined as unknown as DOMStringList,

        assign: noOp,
        reload: noOp,
        replace: noOp,
      };

      expect(getPage(location)).toBe(Page.OAuth2);
    });

    it("should return other on other pages", () => {
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
        ancestorOrigins: undefined as unknown as DOMStringList,

        assign: noOp,
        reload: noOp,
        replace: noOp,
      };

      expect(getPage(location)).toBe(Page.Other);
    });
  });
});
