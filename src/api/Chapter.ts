import type { Chapter as ChapterData } from "ffn-parser";
import { CacheName } from "./ValueContainer";
import type { Signal } from "../signal/signal";
import createGmSignal from "../signal/gm-signal";

export default class Chapter {
  public readonly storyId: number;

  public readonly id: number;

  public readonly title: string;

  public readonly read: Signal<boolean | undefined>;

  constructor(storyId: number, data: ChapterData) {
    this.storyId = storyId;
    this.id = data.id;
    this.title = data.title;

    this.read = createGmSignal(CacheName.chapterRead(storyId, data.id));
  }
}
