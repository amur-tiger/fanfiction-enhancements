import { timeout } from "../../utils";
import { Chapter, Story } from "../../api";
import { SmartValue } from "../../api/SmartValue";
import ChapterList from "./ChapterList";

describe("ChapterList Component", () => {
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
    const r: SmartValue<boolean> = {
      get: () => Promise.resolve(read),
      subscribe: () => undefined,
    } as any;
    const w: SmartValue<number> = {
      get: () => Promise.resolve(1),
      subscribe: () => undefined,
    } as any;

    return {
      storyId: 0,
      id: chapterId,
      name: `Chapter ${chapterId}`,
      read: r,
      words: w,
    };
  }

  it("should hide read chapters", async () => {
    const story: Story = {
      chapters: [chapter(true), chapter(true), chapter(true), chapter(false), chapter(false)],
    } as any;

    const element = new ChapterList({ story }).render();
    await timeout(10);
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
    } as any;

    const element = new ChapterList({ story }).render();
    await timeout(10);
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
    } as any;

    const element = new ChapterList({ story }).render();
    await timeout(10);
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
