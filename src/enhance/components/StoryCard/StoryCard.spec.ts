import { beforeEach, describe, expect, it, vi } from "vitest";
import RequestManager from "../../../api/request-manager/RequestManager";
import type Story from "../../../api/Story";
import StoryCard from "./StoryCard";

// todo find way to run with included SVG
describe.skip("StoryCard Component", () => {
  function createStory(props?: Partial<Story>): Story {
    // (story as any).alert = td.object<SmartValue<boolean>>();
    // (story as any).favorite = td.object<SmartValue<boolean>>();

    return {
      author: { id: 123, name: "Author" },
      published: new Date(),
      updated: new Date(),
      ...props,
    } as Story;
  }

  let requestManager: RequestManager;
  beforeEach(() => {
    requestManager = new RequestManager();
    vi.spyOn(requestManager, "fetch").mockRejectedValue(new Error("not implemented"));
  });

  it("should create a div element", () => {
    const story = createStory();

    const element = StoryCard({ requestManager, story });

    expect(element.tagName).toBe("DIV");
  });

  it("should insert a rating", () => {
    const story = createStory();

    const element = StoryCard({ requestManager, story });

    expect(element.querySelector(".ffe-rating")).toBeDefined();
  });

  it("should insert title", () => {
    const story = createStory({
      id: 123,
      title: "the title",
    });

    const element = StoryCard({ requestManager, story });

    const title = element.querySelector(".ffe-sc-title") as HTMLAnchorElement;
    expect(title.tagName).toBe("A");
    expect(title.textContent).toBe("the title");
    expect(title.href).toMatch(/\/s\/123$/);
  });

  it("should insert author", () => {
    const story = createStory({
      author: {
        id: 456,
        name: "author",
      },
    });

    const element = StoryCard({ requestManager, story });

    const author = element.querySelector(".ffe-sc-author") as HTMLAnchorElement;
    expect(author.tagName).toBe("A");
    expect(author.textContent).toBe("author");
    expect(author.href).toMatch(/\/u\/456$/);
  });

  it("should insert buttons", () => {
    const story = createStory();

    const element = StoryCard({ requestManager, story });

    const buttons = element.querySelector(".ffe-sc-mark") as HTMLDivElement;
    const follow = buttons.querySelector(".ffe-sc-follow") as HTMLSpanElement;
    const fav = buttons.querySelector(".ffe-sc-favorite") as HTMLSpanElement;

    expect(follow.className).toBe("btn ffe-sc-follow");
    expect(fav.className).toBe("btn ffe-sc-favorite icon-heart");
  });

  it("should insert image", () => {
    const story = createStory({
      imageUrl: "/src/img.jpg",
    });

    const element = StoryCard({ requestManager, story });

    const image = element.querySelector(".ffe-sc-image img") as HTMLImageElement;
    expect(image.tagName).toBe("IMG");
    expect(image.src).toMatch(/\/src\/img.jpg$/);
  });

  it("should insert description", () => {
    const story = createStory({
      description: "this is a description",
    });

    const element = StoryCard({ requestManager, story });

    const description = element.querySelector(".ffe-sc-description");
    expect(description?.tagName).toBe("DIV");
    expect(description?.textContent).toBe("this is a description");
  });

  it("should insert relevant tags", () => {
    const story = createStory({
      id: 123,
      follows: 2,
      favorites: 1,
      language: "Elvish",
      genre: ["Adventure", "Fantasy"],
      characters: [["Adam", "Eva"], ["Steve"]],
      reviews: 11,
    });

    const element = StoryCard({ requestManager, story });

    const tags = element.querySelectorAll(".ffe-sc-tags .ffe-sc-tag");
    expect(tags.length).toBe(8);

    expect(tags[0].textContent).toBe("Elvish");
    expect(tags[0].className).toBe("ffe-sc-tag ffe-sc-tag-language");

    expect(tags[1].textContent).toBe("Adventure");
    expect(tags[1].className).toBe("ffe-sc-tag ffe-sc-tag-genre");
    expect(tags[2].textContent).toBe("Fantasy");
    expect(tags[2].className).toBe("ffe-sc-tag ffe-sc-tag-genre");

    expect(tags[3].className).toBe("ffe-sc-tag ffe-sc-tag-ship");
    expect(tags[3].firstElementChild?.textContent).toBe("Adam");
    expect(tags[3].firstElementChild?.className).toBe("ffe-sc-tag-character");
    expect(tags[3].lastElementChild?.textContent).toBe("Eva");
    expect(tags[3].lastElementChild?.className).toBe("ffe-sc-tag-character");
    expect(tags[4].textContent).toBe("Steve");
    expect(tags[4].className).toBe("ffe-sc-tag ffe-sc-tag-character");

    expect(tags[5].textContent).toBe("Reviews:\u00A011");
    expect(tags[5].firstElementChild?.tagName).toBe("A");
    expect((tags[5].firstElementChild as HTMLAnchorElement).href).toMatch(/\/r\/123\/$/);

    expect(tags[6].textContent).toBe("Favorites:\u00A01");
    expect(tags[6].className).toBe("ffe-sc-tag ffe-sc-tag-favorites");

    expect(tags[7].textContent).toBe("Follows:\u00A02");
    expect(tags[7].className).toBe("ffe-sc-tag ffe-sc-tag-follows");
  });

  it("should insert footer", () => {
    const story = createStory({
      words: 12345,
      status: "Complete",
      published: new Date(2012, 1, 3),
      updated: new Date(2012, 11, 24),
    });

    const element = StoryCard({ requestManager, story });

    const footer = element.querySelector(".ffe-sc-footer");
    expect(footer?.childElementCount).toBe(4);
    expect(footer?.children[0].textContent).toBe("12,345 words");
    expect(footer?.children[1].textContent).toBe("Complete");
    expect(footer?.children[2].lastElementChild?.tagName).toBe("TIME");
    expect(footer?.children[2].textContent).toBe("Published:\u00A02/3/2012");
    expect(footer?.children[3].lastElementChild?.tagName).toBe("TIME");
    expect(footer?.children[3].textContent).toBe("Updated:\u00A012/24/2012");
  });
});
