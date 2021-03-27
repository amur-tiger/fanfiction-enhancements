// eslint-disable-next-line max-classes-per-file
import { Follow, Story as StoryData } from "ffn-parser";
import Api from "./Api";
import { Synchronizer } from "./DropBox";
import { SmartValue, SmartValueLocal, SmartValueRoaming } from "./SmartValue";
import Story from "./Story";

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

export default class ValueContainer {
  private readonly instances: { [key: string]: SmartValue<any> } = {};

  constructor(
    private readonly storage: Storage,
    private readonly api: Api,
    private readonly synchronizer: Synchronizer
  ) {
    window.addEventListener("storage", async (event) => {
      const value = this.instances[event.key as any];
      if (!value) {
        return;
      }

      await (value as any).trigger(JSON.parse(event.newValue as any));
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

  public async getStory(id: number): Promise<Story | undefined> {
    const storyData = await this.getStoryValue(id).get();
    if (!storyData) {
      return undefined;
    }

    return new Story(storyData, this);
  }

  public getStoryValue(id: number): SmartValue<StoryData> {
    const key = CacheName.story(id);
    if (!this.instances[key]) {
      this.instances[key] = new SmartValueLocal(key, this.storage, () => this.api.getStoryData(id));
    }

    return this.instances[key];
  }

  public getAlertValue(id: number): SmartValue<boolean> {
    const key = CacheName.storyAlert(id);
    if (!this.instances[key]) {
      this.instances[key] = new SmartValueLocal<boolean>(
        key,
        this.storage,
        async () => {
          const alerts = await this.api.getStoryAlerts();
          await this.followedStoryDiff(CacheName.isStoryAlertKey, alerts, this.getAlertValue);

          return !!alerts.find((alert) => alert.id === id);
        },
        async (alert) => {
          if (alert) {
            await this.api.addStoryAlert(id);
          } else {
            await this.api.removeStoryAlert(id);
          }
        }
      );
    }

    return this.instances[key];
  }

  public getFavoriteValue(id: number): SmartValue<boolean> {
    const key = CacheName.storyFavorite(id);
    if (!this.instances[key]) {
      this.instances[key] = new SmartValueLocal<boolean>(
        key,
        this.storage,
        async () => {
          const favorites = await this.api.getStoryFavorites();
          await this.followedStoryDiff(CacheName.isStoryFavoriteKey, favorites, this.getFavoriteValue);

          return !!favorites.find((favorite) => favorite.id === id);
        },
        async (favorite) => {
          if (favorite) {
            await this.api.addStoryFavorite(id);
          } else {
            await this.api.removeStoryFavorite(id);
          }
        }
      );
    }

    return this.instances[key];
  }

  public getWordCountValue(storyId: number, chapterId: number): SmartValue<number> {
    const key = CacheName.wordCount(storyId, chapterId);
    if (!this.instances[key]) {
      this.instances[key] = new SmartValueLocal<number>(key, this.storage, () =>
        this.api.getChapterWordCount(storyId, chapterId)
      );
    }

    return this.instances[key];
  }

  public getChapterReadValue(storyId: number, chapterId: number): SmartValue<boolean> {
    const key = CacheName.chapterRead(storyId, chapterId);
    if (!this.instances[key]) {
      this.instances[key] = new SmartValueRoaming<boolean>(key, undefined, undefined, this.synchronizer);
    }

    return this.instances[key];
  }

  private async followedStoryDiff(
    matchFn: (key: string) => boolean,
    updated: Follow[],
    valueGetter: (id: number) => SmartValue<boolean>
  ) {
    const visited = new Set();
    await Promise.all(
      updated.map(async (followed) => {
        const value = valueGetter.call(this, followed.id);

        visited.add(value.name);
        await value.update(true);
      })
    );

    const current = Object.keys(this.instances)
      .filter(matchFn)
      .map((key) => this.instances[key]);
    await Promise.all(
      current.map(async (value) => {
        if (!visited.has(value.name)) {
          await value.update(false);
        }
      })
    );
  }
}
