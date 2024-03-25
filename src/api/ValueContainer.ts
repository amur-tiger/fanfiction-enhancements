import type { Story as StoryData } from "ffn-parser";
import Api from "./Api";
import type { Synchronizer } from "./DropBox";
import { type SmartValue, SmartValueLS } from "./SmartValue";
import Story from "./story";

export class CacheName {
  public static story(id: number): string {
    return `ffe-story-${id}`;
  }

  public static isStoryKey(key: string): boolean {
    return /^ffe-story-\d+$/.test(key);
  }

  public static storyAlert(id: number): string {
    return `ffe-story-${id}-alert`;
  }

  public static isStoryAlertKey(key: string): boolean {
    return /^ffe-story-\d+-alert$/.test(key);
  }

  public static storyFavorite(id: number): string {
    return `ffe-story-${id}-favorite`;
  }

  public static isStoryFavoriteKey(key: string): boolean {
    return /^ffe-story-\d+-favorite$/.test(key);
  }

  public static wordCount(storyId: number, chapterId: number): string {
    return `ffe-story-${storyId}-chapter-${chapterId}-words`;
  }

  public static isWordCountKey(key: string): boolean {
    return /^ffe-story-\d+-chapter-\d+-words$/.test(key);
  }

  public static chapterRead(storyId: number, chapterId: number): string {
    return `ffe-story-${storyId}-chapter-${chapterId}-read`;
  }

  public static isChapterReadKey(key: string): boolean {
    return /^ffe-story-\d+-chapter-\d+-read$/.test(key);
  }

  public static isTimestampKey(key: string): boolean {
    return /\+timestamp$/.test(key);
  }
}

/** @deprecated */
export default class ValueContainer {
  private readonly instances: Record<string, SmartValue<any>> = {};

  constructor(
    private readonly storage: Storage,
    private readonly api: Api,
    private readonly synchronizer: Synchronizer,
  ) {
    window.addEventListener("storage", async (event) => {
      const value = event.key && this.instances[event.key];
      if (!value) {
        return;
      }

      await (
        value as unknown as {
          trigger: (item: unknown) => Promise<unknown>;
        }
      ).trigger(JSON.parse(event.newValue as string));
    });

    synchronizer.onValueUpdate(async (key, value) => {
      const instance = this.instances[key];
      if (!instance) {
        await GM.setValue(key, JSON.stringify(value));
        await GM.setValue(`${key}+timestamp`, new Date().getTime());

        return;
      }

      await instance.update(value);
    });
  }

  public getStoryValue(id: number): SmartValue<StoryData> {
    const key = CacheName.story(id);
    if (!this.instances[key]) {
      this.instances[key] = new SmartValueLS(key, this.storage, () => this.api.getStoryData(id));
    }

    return this.instances[key] as SmartValue<StoryData>;
  }
}
