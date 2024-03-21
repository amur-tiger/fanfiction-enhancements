import type { Chapter as ChapterData } from "ffn-parser";
import ValueContainer, { CacheName } from "./ValueContainer";
import type { Signal } from "../signal/signal";
import createGmSignal from "../signal/gm-signal";

export default class Chapter {
  public readonly storyId: number;

  public readonly id: number;

  public readonly title: string;

  public readonly words: Signal<number | undefined>;

  public readonly read: Signal<boolean | undefined>;

  constructor(storyId: number, data: ChapterData, valueManager: ValueContainer) {
    this.storyId = storyId;
    this.id = data.id;
    this.title = data.title;

    this.words = valueManager.getWordCountValue(storyId, data.id).signal;
    this.read = createGmSignal(CacheName.chapterRead(storyId, data.id));
  }
}
