import { createSignal, type Signal, type SignalEx } from "../signal/signal";
import effect from "../signal/effect";
import { tryParse, type WithTimestamp } from "../utils";
import { environment, Page } from "../util/environment";
import view from "../signal/view";

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
  return view(getWordCountCache(storyId), chapterId);
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
