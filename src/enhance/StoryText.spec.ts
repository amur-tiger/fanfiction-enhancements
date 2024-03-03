import { beforeEach, describe, expect, it, vi } from "vitest";
import { timeout } from "../utils";
import StoryText from "./StoryText";

describe("Story Text", () => {
  beforeEach(() => {
    (global as unknown as { XCOOKIE: unknown }).XCOOKIE = {};
    (global as unknown as { _fontastic_save: () => void })._fontastic_save = vi.fn();
  });

  it("should fix user-select", async () => {
    document.body.innerHTML = `<div id="storytextp" style="user-select: none;"><div id="storytext"></div></div>`;
    const fragment = document.body.firstElementChild as HTMLDivElement;
    setTimeout(() => {
      fragment.style.userSelect = "none";
    }, 200);

    const storyText = new StoryText();
    await storyText.enhance();

    await timeout(350);
    expect(fragment.style.userSelect).toBe("inherit");
  });
});
