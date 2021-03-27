import { setCookie, timeout } from "../utils";
import StoryText from "./StoryText";

describe("Story Text", () => {
  beforeEach(() => {
    ((global as unknown) as { XCOOKIE: unknown }).XCOOKIE = {};
    // eslint-disable-next-line camelcase,no-underscore-dangle
    ((global as unknown) as { _fontastic_save: () => void })._fontastic_save = jest.fn();
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

  it("should set a better default style", async () => {
    document.body.innerHTML = `<div id="storytextp"><div id="storytext"></div></div>`;
    const fragment = document.body.firstElementChild as HTMLDivElement;

    const storyText = new StoryText();
    await storyText.enhance();

    expect((fragment.firstElementChild as HTMLElement).style.fontSize).toBe("1.2em");
    expect(+(fragment.firstElementChild as HTMLElement).style.lineHeight).toBe(2);
  });

  it("should not set styles if styles were modified", async () => {
    setCookie("xcookie2", "dummy");
    document.body.innerHTML = `<div id="storytextp"><div id="storytext"></div></div>`;
    const fragment = document.body.firstElementChild as HTMLDivElement;

    const storyText = new StoryText();
    await storyText.enhance();

    expect((fragment.firstElementChild as HTMLElement).style.fontSize).toBe("");
    expect((fragment.firstElementChild as HTMLElement).style.lineHeight).toBe("");
  });
});
