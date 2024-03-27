import { ChangeEvent, createSignal, type Signal } from "../signal/signal";
import { listen } from "../signal/effect";
import { tryParse, type WithTimestamp } from "../utils";
import { environment, Page } from "../util/environment";
import view from "../signal/view";
import { getStoryMetadata } from "./story";

export interface WordCount {
  count: number;
  isEstimate: boolean;
}

type WordCountCache = Record<number, WithTimestamp<WordCount> | undefined>;

function getWordCountCache(storyId: number): Signal<WordCountCache> {
  const key = `ffe-story-${storyId}-words`;
  const signal = createSignal(tryParse<WordCountCache>(localStorage.getItem(key), {}));

  listen(signal, "change", (event: ChangeEvent<WordCountCache>) => {
    if (event.isInternal) {
      return;
    }

    localStorage.setItem(key, JSON.stringify(event.newValue));

    dispatchEvent(
      new StorageEvent("storage", {
        key,
        newValue: JSON.stringify(event.newValue),
      }),
    );
  });

  listen(window, "storage", (event) => {
    if (event.key !== key) {
      return;
    }

    const next = tryParse<WordCountCache>(event.newValue);
    if (next) {
      signal.set(next, { isInternal: true });
    }
  });

  return signal;
}

export default function getWordCount(storyId: number, chapterId: number): Signal<WordCount | undefined> {
  return view(getWordCountCache(storyId), {
    get(cache) {
      const count = cache[chapterId];
      if (count && !count.isEstimate) {
        return count;
      }
      return getWordCountOrEstimate(cache, storyId, chapterId);
    },

    set(cache, next) {
      return {
        ...cache,
        [chapterId]: next,
      };
    },

    equals(previous, next) {
      return (
        previous?.count === next?.count &&
        previous?.isEstimate === next?.isEstimate &&
        previous?.timestamp === next?.timestamp
      );
    },
  });
}

function getWordCountOrEstimate(
  cache: WordCountCache,
  storyId: number,
  chapterId: number,
): WithTimestamp<WordCount> | undefined {
  const cached = cache[chapterId];
  if (cached && !cached.isEstimate) {
    return cached;
  }

  const story = getStoryMetadata(storyId)();
  if (!story?.words || !story.chapters) {
    return cached;
  }

  const { countedWords, unknownChapters } = story.chapters.reduce(
    ({ countedWords, unknownChapters }, chapter) => {
      const c = cache[chapter.id];
      if (!c || c.isEstimate) {
        return { countedWords, unknownChapters: unknownChapters + 1 };
      }
      return { countedWords: countedWords + c.count, unknownChapters };
    },
    {
      countedWords: 0,
      unknownChapters: 0,
    },
  );

  return {
    count: Math.floor((story.words - countedWords) / unknownChapters),
    isEstimate: true,
    timestamp: Date.now(),
  };
}

function updateWordCount() {
  if (environment.currentPageType === Page.Chapter) {
    const key = `ffe-story-${environment.currentStoryId}-words`;
    const wordCount = document.getElementById("storytext")?.textContent?.trim()?.split(/\s+/).length ?? 0;
    const cache = tryParse<WordCountCache>(localStorage.getItem(key), {});
    cache[environment.currentChapterId!] = {
      count: wordCount,
      isEstimate: false,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cache));
  }
}

function migrateWordCount() {
  // Cache migration from < 0.8
  const keys = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i) as string);
  for (const key of keys) {
    const match = key && key.match(/^ffe-story-(\d+)-chapter-(\d+)-words$/);
    if (match) {
      const [, storyId, chapterId] = match;
      const cache = tryParse<WordCountCache>(localStorage.getItem(`ffe-story-${storyId}-words`), {});
      cache[+chapterId] = {
        count: +localStorage.getItem(key)!,
        isEstimate: false,
        timestamp: +(localStorage.getItem(key + "+timestamp") || Date.now()),
      };
      localStorage.setItem(`ffe-story-${storyId}-words`, JSON.stringify(cache));
      localStorage.removeItem(key);
      localStorage.removeItem(key + "+timestamp");
    }
  }
}

if (process.env.MODE !== "test") {
  migrateWordCount();
  updateWordCount();
}
