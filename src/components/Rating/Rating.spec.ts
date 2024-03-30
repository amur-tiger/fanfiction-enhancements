import { describe, expect, it } from "vitest";
import Rating from "./Rating";

describe("Rating Component", () => {
  it("should create an anchor element with certain properties", () => {
    const element = Rating({ rating: "K" }) as HTMLAnchorElement;

    expect(element.href).toBe("https://www.fictionratings.com/");
    expect(element.rel).toBe("noreferrer");
    expect(element.target).toBe("rating");
  });

  it("should create default element for invalid ratings", () => {
    const element = Rating({ rating: "not a rating" }) as HTMLAnchorElement;

    expect(element.textContent).toBe("?");
    expect(element.title).toBe("No Rating Available");
  });

  it("should create element for general audiences", () => {
    const element = Rating({ rating: "K" }) as HTMLAnchorElement;

    expect(element.textContent).toBe("K");
    expect(element.title).toBe("General Audience (5+)");
  });

  it("should create element for young children", () => {
    const element = Rating({ rating: "K+" }) as HTMLAnchorElement;

    expect(element.textContent).toBe("K+");
    expect(element.title).toBe("Young Children (9+)");
  });

  it("should create element for teens", () => {
    const element = Rating({ rating: "T" }) as HTMLAnchorElement;

    expect(element.textContent).toBe("T");
    expect(element.title).toBe("Teens (13+)");
  });

  it("should create element for elder teens", () => {
    const element = Rating({ rating: "M" }) as HTMLAnchorElement;

    expect(element.textContent).toBe("M");
    expect(element.title).toBe("Teens (16+)");
  });

  it("should create element for mature audiences", () => {
    const element = Rating({ rating: "MA" }) as HTMLAnchorElement;

    expect(element.textContent).toBe("MA");
    expect(element.title).toBe("Mature (18+)");
  });
});
