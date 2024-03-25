import { type Chapter, type Follow, parseStory, type Story as StoryData, type User, parseFollows } from "ffn-parser";
import { createSignal, type Signal, type SignalEx } from "../signal/signal";
import { toDate, tryParse, type WithTimestamp } from "../utils";
import effect from "../signal/effect";
import { environment, Page } from "../util/environment";
import Api from "./Api";

export default class Story {
  public readonly id: number;

  public readonly title: string;

  public readonly description: string;

  public readonly chapters: Chapter[];

  public readonly imageUrl: string | undefined;

  public readonly imageOriginalUrl: string | undefined;

  public readonly favorites: number;

  public readonly follows: number;

  public readonly reviews: number;

  public readonly genre: string[];

  public readonly language: string;

  public readonly published: Date;

  public readonly updated: Date | undefined;

  public readonly rating: StoryData["rating"];

  public readonly words: number;

  public readonly characters: string[][];

  public readonly status: StoryData["status"];

  public readonly universes: string[];

  public readonly author: User;

  constructor(data: StoryData) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.chapters = data.chapters;
    this.imageUrl = data.imageUrl;
    this.imageOriginalUrl = data.imageUrl;
    this.favorites = data.favorites;
    this.follows = data.follows;
    this.reviews = data.reviews;
    this.genre = data.genre;
    this.language = data.language;
    this.published = data.published instanceof Date ? data.published : new Date(data.published);
    this.updated = data.updated == null || data.updated instanceof Date ? data.updated : new Date(data.updated);
    this.rating = data.rating;
    this.words = data.words;
    this.characters = data.characters;
    this.status = data.status;
    this.universes = data.universes;

    this.author = {
      id: data.author.id,
      name: data.author.name,
    };
  }
}

const api = new Api();

type Intersect<T, S> = { [K in keyof (S & T)]: (S & T)[K] };

export type StoryData2 = Intersect<
  {
    [K in keyof StoryData as K extends keyof Follow ? K : never]: StoryData[K];
  },
  {
    [K in keyof StoryData as K extends keyof Follow ? never : K]?: StoryData[K];
  }
>;

type StoryCache = WithTimestamp<StoryData2>;

/**
 * Determine cache key for story data.
 * @param storyId
 */
function getKey(storyId: number) {
  return `ffe-story-${storyId}`;
}

/**
 * Gets story data from cache.
 * @param storyId
 */
function getStoryCache(storyId: number): StoryCache | undefined {
  return tryParse(localStorage.getItem(getKey(storyId)));
}

/**
 * Writes story data to cache and notifies observers.
 * @param storyId
 * @param story
 */
function setStoryCache(storyId: number, story: StoryCache | undefined) {
  if (story && storyId !== story.id) {
    throw new TypeError();
  }

  const key = getKey(storyId);
  const newValue = story ? JSON.stringify(story) : undefined;

  if (newValue) {
    localStorage.setItem(key, newValue);
  } else {
    localStorage.removeItem(key);
  }

  dispatchEvent(
    new StorageEvent("storage", {
      key,
      newValue,
    }),
  );
}

/**
 * Creates a signal for story cache data.
 * @param storyId
 * @param onChange
 */
function getStoryMetadata(
  storyId: number,
  onChange?: (next: StoryCache | undefined) => void,
): Signal<StoryCache | undefined> {
  const signal = createSignal(getStoryCache(storyId), {
    onChange: (next) => {
      setStoryCache(storyId, next);
      onChange?.(next);
    },
  });

  effect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key !== getKey(storyId)) {
        return;
      }

      const next = tryParse<StoryCache>(event.newValue);
      if (next) {
        (signal as SignalEx<StoryCache>).set(next, { silent: true });
      }
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  });

  return signal;
}

/**
 * Creates a signal for story data. Story data is automatically downloaded if missing.
 * @param storyId
 */
export function getStory(storyId: number): Signal<StoryData2 | undefined> {
  const signal = getStoryMetadata(storyId, (next) => {
    if (next?.chapters == null) {
      api.getStoryData(storyId).then((story) => {
        if (story) {
          signal.set({ ...story, timestamp: Date.now() });
        }
      });
    }
  });

  if (signal.peek()?.chapters == null) {
    api.getStoryData(storyId).then((story) => {
      if (story) {
        signal.set({ ...story, timestamp: Date.now() });
      }
    });
  }

  return signal;
}

/**
 * Parses follows data from the current page.
 */
if (environment.currentPageType === Page.Alerts || environment.currentPageType === Page.Favorites) {
  parseFollows().then((follows) => {
    if (follows) {
      for (const follow of follows) {
        let cached = getStoryCache(follow.id);
        if (
          cached &&
          (cached.id !== follow.id ||
            cached.title !== follow.title ||
            cached.author.id !== follow.author.id ||
            cached.author.name !== follow.author.name ||
            (cached.updated && toDate(cached.updated).getTime() < follow.updated.getTime()))
        ) {
          console.debug("Cache for '%s' is outdated, overwriting.", cached.title);
          cached = undefined;
        }
        if (cached == null) {
          console.debug("Set story data for '%s' from follow.", follow.title);
          setStoryCache(follow.id, {
            id: follow.id,
            title: follow.title,
            author: follow.author,
            updated: follow.updated,
            timestamp: Date.now(),
          });
        }
      }
    }
  });
}

/**
 * Parses story data from the current page.
 */
if (environment.currentPageType === Page.Story || environment.currentPageType === Page.Chapter) {
  parseStory().then((story) => {
    if (story) {
      console.debug("Set story data for '%s' from story page.", story.title);
      setStoryCache(story.id, {
        ...story,
        timestamp: Date.now(),
      });
    }
  });
}

/**
 * Cache migration from < 0.8
 */
const keys = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i) as string);
for (const key of keys) {
  if (key && /^ffe-story-\d+$/.test(key)) {
    const cache = tryParse<StoryCache>(localStorage.getItem(key));
    if (cache) {
      cache.timestamp = +(localStorage.getItem(key + "+timestamp") ?? 0);
      localStorage.setItem(key, JSON.stringify(cache));
    }
    localStorage.removeItem(key + "+timestamp");
  }
}
