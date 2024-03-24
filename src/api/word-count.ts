import { createSignal, type Signal, type SignalEx } from "../signal/signal";
import effect from "../signal/effect";
import { tryParse, type WithTimestamp } from "../utils";
import { CacheName } from "./ValueContainer";
import { environment, Page } from "../util/environment";

export interface WordCount {
  count: number;
  isEstimate: boolean;
}

type WordCountCache = Record<number, WithTimestamp<WordCount> | undefined>;

function getWordCountCache(storyId: number): Signal<WordCountCache> {
  const key = `ffe-story-${storyId}-words`;

  const signal = createSignal(tryParse<WordCountCache>(localStorage.getItem(key), {}), {
    onChange(next) {
      localStorage.setItem(key, JSON.stringify(next));

      dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue: JSON.stringify(next),
        }),
      );
    },
  });

  effect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key !== key) {
        return;
      }

      const next = tryParse<WordCountCache>(event.newValue);
      if (next) {
        (signal as SignalEx<WordCountCache>).set(next, { silent: true });
      }
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  });

  return signal;
}

export default function getWordCount(storyId: number, chapterId: number): Signal<WordCount | undefined> {
  const signal = getWordCountCache(storyId);
  // @ts-ignore
  return Object.assign(
    function () {
      return signal()[chapterId]?.count;
    },
    {
      set: (words: WordCount) => signal.set((prev) => ({ ...prev, [chapterId]: { ...words, timestamp: Date.now() } })),
      peek: () => signal.peek()[chapterId]?.count,
    },
  );
}

if (environment.currentPageType === Page.Chapter) {
  const key = CacheName.wordCount(environment.currentStoryId!, environment.currentChapterId!);
  const wordCount = document.getElementById("storytext")?.textContent?.trim()?.split(/\s+/).length ?? 0;
  localStorage.setItem(key, JSON.stringify(wordCount));
  localStorage.setItem(key + "+timestamp", Date.now().toString());
}

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
