import { describe, expect, it } from "vitest";
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

    it("should recognize universe listing", () => {
      const location: Location = {
        hash: "",
        host: "www.fanfiction.net",
        hostname: "www.fanfiction.net",
        href: "https://www.fanfiction.net/book/",
        origin: "https://www.fanfiction.net",
        pathname: "/book/",
        port: "",
        protocol: "https:",
        search: "",
        ancestorOrigins: undefined as unknown as DOMStringList,

        assign: noOp,
        reload: noOp,
        replace: noOp,
      };

      expect(getPage(location)).toBe(Page.UniverseList);
    });

    it("should recognize crossover universe listing 1", () => {
      const location: Location = {
        hash: "",
        host: "www.fanfiction.net",
        hostname: "www.fanfiction.net",
        href: "https://www.fanfiction.net/crossovers/anime/",
        origin: "https://www.fanfiction.net",
        pathname: "/crossovers/anime/",
        port: "",
        protocol: "https:",
        search: "",
        ancestorOrigins: undefined as unknown as DOMStringList,

        assign: noOp,
        reload: noOp,
        replace: noOp,
      };

      expect(getPage(location)).toBe(Page.UniverseList);
    });

    it("should recognize crossover universe listing 2", () => {
      const location: Location = {
        hash: "",
        host: "www.fanfiction.net",
        hostname: "www.fanfiction.net",
        href: "https://www.fanfiction.net/crossovers/Naruto/1402/",
        origin: "https://www.fanfiction.net",
        pathname: "/crossovers/Naruto/1402/",
        port: "",
        protocol: "https:",
        search: "",
        ancestorOrigins: undefined as unknown as DOMStringList,

        assign: noOp,
        reload: noOp,
        replace: noOp,
      };

      expect(getPage(location)).toBe(Page.UniverseList);
    });

    it("should recognize community listing", () => {
      const location: Location = {
        hash: "",
        host: "www.fanfiction.net",
        hostname: "www.fanfiction.net",
        href: "https://www.fanfiction.net/communities/general/0/",
        origin: "https://www.fanfiction.net",
        pathname: "/communities/general/0/",
        port: "",
        protocol: "https:",
        search: "",
        ancestorOrigins: undefined as unknown as DOMStringList,

        assign: noOp,
        reload: noOp,
        replace: noOp,
      };

      expect(getPage(location)).toBe(Page.CommunityList);
    });

    it("should ignore community category listing", () => {
      const location: Location = {
        hash: "",
        host: "www.fanfiction.net",
        hostname: "www.fanfiction.net",
        href: "https://www.fanfiction.net/communities/misc/",
        origin: "https://www.fanfiction.net",
        pathname: "/communities/misc/",
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
