import { createSignal, type Signal } from "../signal/signal";
import view from "../signal/view";
import { tryParse } from "../utils";

export interface ChapterReadMetadata {
  version: 1;
  stories: Record<number, Record<number, IsRead | undefined> | undefined>;
}

interface IsRead {
  read: boolean;
  timestamp: number;
}

let chapterReadMetadata: Signal<ChapterReadMetadata>;

export function getChapterReadMetadata() {
  if (chapterReadMetadata == null) {
    chapterReadMetadata = createSignal<ChapterReadMetadata>({ version: 1, stories: {} });

    GM.getValue("ffe-chapter-read").then((value) =>
      chapterReadMetadata.set(
        tryParse<ChapterReadMetadata>(value as string, {
          version: 1,
          stories: {},
        }),
        {
          isInternal: true,
        },
      ),
    );

    chapterReadMetadata.addEventListener("change", async (event) => {
      if (event.isInternal) {
        return;
      }

      await GM.setValue("ffe-chapter-read", JSON.stringify(event.newValue));
    });

    if (GM_addValueChangeListener != null) {
      GM_addValueChangeListener("ffe-chapter-read", (name, oldValue, newValue) => {
        const metadata = tryParse<ChapterReadMetadata>(newValue as string);
        if (metadata != null) {
          chapterReadMetadata.set(metadata, { isInternal: true });
        }
      });
    }
  }

  return chapterReadMetadata;
}

export default function getChapterRead(storyId: number, chapterId: number): Signal<boolean> {
  return view(getChapterReadMetadata(), {
    get(value) {
      return value.stories[storyId]?.[chapterId]?.read ?? false;
    },

    set(previous, value) {
      return {
        ...previous,
        stories: {
          ...previous.stories,
          [storyId]: {
            ...previous.stories[storyId],
            [chapterId]: {
              ...previous.stories[storyId]?.[chapterId],
              read: value,
              timestamp: Date.now(),
            },
          },
        },
      };
    },
  });
}

async function migrateChapterRead() {
  const metadata = tryParse<ChapterReadMetadata>((await GM.getValue("ffe-chapter-read")) as string, {
    version: 1,
    stories: {},
  });

  let hasChanges = false;
  const list = await GM.listValues();
  for (const key of list) {
    const match = /^ffe-story-(\d+)-chapter-(\d+)-read$/.exec(key);
    if (match) {
      const [, storyId, chapterId] = match;
      metadata.stories[+storyId] ??= {};

      const metadataChapter = metadata.stories[+storyId]![+chapterId];
      const oldTimestamp = await GM.getValue(`ffe-story-${storyId}-chapter-${chapterId}-read+timestamp`, 0);
      if (metadataChapter == null || metadataChapter.timestamp < oldTimestamp) {
        hasChanges = true;
        metadata.stories[+storyId]![+chapterId] = {
          read: (await GM.getValue(key, "")) === "true",
          timestamp: oldTimestamp,
        };
      }

      await GM.deleteValue(key);
      await GM.deleteValue(key + "+timestamp");
    }
  }

  if (hasChanges) {
    await GM.setValue("ffe-chapter-read", JSON.stringify(metadata));
  }
}

if (process.env.MODE !== "test") {
  void migrateChapterRead();
}
