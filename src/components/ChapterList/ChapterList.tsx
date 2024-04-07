import clsx from "clsx";
import render from "@jsx/render";
import { getStory, type StoryData } from "../../api/story";
import type { Chapter } from "ffn-parser";
import { createSignal } from "../../signal/signal";
import getChapterRead from "../../api/chapter-read";
import ChapterListEntry from "./ChapterListEntry";
import classes from "./ChapterList.css";

function hiddenChapterMapper(story: StoryData, isRead: (chapter: Chapter) => boolean, onShow: () => void) {
  return (chapter: Chapter, idx: number, chapters: Chapter[]) => {
    if (isRead(chapter)) {
      // if last element in list or next element is unread
      if (idx === chapters.length - 1 || !isRead(chapters[idx + 1])) {
        let count = 0;
        for (let i = idx; i >= 0; i--) {
          if (!isRead(chapters[i])) {
            break;
          }
          count += 1;
        }

        if (count <= 1) {
          return <ChapterListEntry storyId={story.id} chapter={chapter} />;
        }

        return (
          <li class={clsx(classes.chapter, classes.collapsed)}>
            <a onClick={onShow}>
              Show {count} hidden chapter{count !== 1 && "s"}
            </a>
          </li>
        );
      }

      return null;
    }

    if (idx > 1) {
      if (idx === chapters.length - 4) {
        let count = 0;
        for (let i = idx; i >= 0; i--) {
          if (isRead(chapters[i])) {
            break;
          }
          count += 1;
        }

        count -= 2;

        if (count <= 1) {
          return <ChapterListEntry storyId={story.id} chapter={chapter} />;
        }

        return (
          <li class={clsx(classes.chapter, classes.collapsed)}>
            <a onClick={onShow}>
              Show {count} hidden chapter{count !== 1 && "s"}
            </a>
          </li>
        );
      }

      if (idx < chapters.length - 3 && !isRead(chapters[idx - 1]) && !isRead(chapters[idx - 2])) {
        return null;
      }
    }

    return <ChapterListEntry storyId={story.id} chapter={chapter} />;
  };
}

export interface ChapterListProps {
  class?: string;
  storyId: number;
}

export default function ChapterList({ class: className, storyId }: ChapterListProps) {
  const isExtended = createSignal(false);

  return render(() => {
    const storySignal = getStory(storyId);
    const story = storySignal();

    if (!story) {
      return <div class={clsx(classes.container, className)} />;
    }

    const isReadMap = new Map(story.chapters?.map((chapter) => [chapter.id, getChapterRead(story.id, chapter.id)]));

    return (
      <div class={clsx(classes.container, className)}>
        <ol class={classes.list}>
          {isExtended()
            ? story.chapters?.map((chapter) => <ChapterListEntry storyId={story.id} chapter={chapter} />)
            : story.chapters?.flatMap(
                hiddenChapterMapper(
                  story,
                  (chapter: Chapter) => isReadMap.get(chapter.id)!(),
                  () => isExtended.set(true),
                ),
              )}
        </ol>
      </div>
    );
  });
}
