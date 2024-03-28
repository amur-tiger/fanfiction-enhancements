import { beforeEach, describe, expect, it } from "vitest";
import type { Chapter, Story } from "ffn-parser";
import { timeout } from "../../utils";

// todo eliminate setTimeout call for sleep-less tests
// todo update for new hidden chapters rendering
describe.skip("ChapterList Component", async () => {
  const mod = await import("./ChapterList");
  const ChapterList = mod.default;

  function isRead(item: Element) {
    expect((item.firstElementChild?.firstElementChild as HTMLInputElement).checked).toBe(true);
  }

  function isNotRead(item: Element) {
    expect((item.firstElementChild?.firstElementChild as HTMLInputElement).checked).toBe(false);
  }

  function isShown(item: HTMLElement) {
    expect(item.style.display).not.toBe("none");
  }

  function isNotShown(item: HTMLElement) {
    expect(item.style.display).toBe("none");
  }

  function isShowCommand(item: HTMLElement) {
    expect(item.className).toBe("ffe-cl-chapter ffe-cl-collapsed");
  }

  let chapterId = 0;

  beforeEach(() => {
    chapterId = 0;
  });

  function chapter(read: boolean): Chapter {
    chapterId += 1;
    return {
      storyId: 0,
      id: chapterId,
      title: `Chapter ${chapterId}`,
    };
  }

  it("should hide read chapters", async () => {
    const story: Story = {
      chapters: [chapter(true), chapter(true), chapter(true), chapter(false), chapter(false)],
    } as never;

    const element = ChapterList({ storyId: 123 }) as HTMLElement;
    await timeout(15);
    const items = Array.from(element.getElementsByClassName("ffe-cl-chapter")) as HTMLElement[];

    isShowCommand(items[3]);

    isRead(items[0]);
    isRead(items[1]);
    isRead(items[2]);
    isNotRead(items[4]);
    isNotRead(items[5]);

    isNotShown(items[0]);
    isNotShown(items[1]);
    isNotShown(items[2]);
    isShown(items[4]);
    isShown(items[5]);
  });

  it("should hide unread chapters", async () => {
    const story: Story = {
      chapters: [
        chapter(false),
        chapter(false),
        chapter(false),
        chapter(false),
        chapter(false),
        chapter(false),
        chapter(false),
        chapter(false),
        chapter(false),
        chapter(false),
      ],
    } as never;

    const element = ChapterList({ storyId: 123 }) as HTMLElement;
    await timeout(15);
    const items = Array.from(element.getElementsByClassName("ffe-cl-chapter")) as HTMLElement[];

    isShowCommand(items[7]);

    isNotRead(items[0]);
    isNotRead(items[1]);
    isNotRead(items[2]);
    isNotRead(items[3]);
    isNotRead(items[4]);
    isNotRead(items[5]);
    isNotRead(items[6]);
    isNotRead(items[8]);
    isNotRead(items[9]);
    isNotRead(items[10]);

    isShown(items[0]);
    isShown(items[1]);
    isNotShown(items[2]);
    isNotShown(items[3]);
    isNotShown(items[4]);
    isNotShown(items[5]);
    isNotShown(items[6]);
    isShown(items[8]);
    isShown(items[9]);
    isShown(items[10]);
  });

  it("should show unread chapters after read chapters", async () => {
    const story: Story = {
      chapters: [
        chapter(true),
        chapter(true),
        chapter(true),
        chapter(true),
        chapter(true),
        chapter(false),
        chapter(false),
        chapter(false),
        chapter(false),
        chapter(false),
        chapter(false),
        chapter(false),
        chapter(false),
        chapter(false),
        chapter(false),
        chapter(false),
        chapter(false),
      ],
    } as never;

    const element = ChapterList({ storyId: 123 }) as HTMLElement;
    await timeout(15);
    const items = Array.from(element.getElementsByClassName("ffe-cl-chapter")) as HTMLElement[];

    isShowCommand(items[5]);
    isShowCommand(items[15]);

    isRead(items[0]);
    isRead(items[1]);
    isRead(items[2]);
    isRead(items[3]);
    isRead(items[4]);
    isNotRead(items[6]);
    isNotRead(items[7]);
    isNotRead(items[8]);
    isNotRead(items[9]);
    isNotRead(items[10]);
    isNotRead(items[11]);
    isNotRead(items[12]);
    isNotRead(items[13]);
    isNotRead(items[14]);
    isNotRead(items[16]);
    isNotRead(items[17]);
    isNotRead(items[18]);

    isNotShown(items[0]);
    isNotShown(items[1]);
    isNotShown(items[2]);
    isNotShown(items[3]);
    isNotShown(items[4]);
    isShown(items[6]);
    isShown(items[7]);
    isNotShown(items[8]);
    isNotShown(items[9]);
    isNotShown(items[10]);
    isNotShown(items[11]);
    isNotShown(items[12]);
    isNotShown(items[13]);
    isNotShown(items[14]);
    isShown(items[16]);
    isShown(items[17]);
    isShown(items[18]);
  });
});
