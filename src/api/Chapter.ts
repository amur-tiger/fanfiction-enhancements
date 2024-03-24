import type { Chapter as ChapterData } from "ffn-parser";
import type { Signal } from "../signal/signal";
import getChapterRead from "./chapter-read";

export default class Chapter {
  public readonly storyId: number;

  public readonly id: number;

  public readonly title: string;

  public readonly read: Signal<boolean | undefined>;

  constructor(storyId: number, data: ChapterData) {
    this.storyId = storyId;
    this.id = data.id;
    this.title = data.title;

    this.read = getChapterRead(storyId, data.id);
  }
}
