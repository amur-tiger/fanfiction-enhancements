import { getStory, type StoryData2 } from "../../../api/story";
import type { Chapter } from "ffn-parser";
import { createSignal } from "../../../signal/signal";
import getChapterRead from "../../../api/chapter-read";
import ChapterListEntry from "./ChapterListEntry";
import "./ChapterList.css";

function hiddenChapterMapper(story: StoryData2, isRead: (chapter: Chapter) => boolean, onShow: () => void) {
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

        return (
          <li class="ffe-cl-chapter ffe-cl-collapsed">
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

        return (
          <li class="ffe-cl-chapter ffe-cl-collapsed">
            <a onclick={onShow}>
              Show {count - 2} hidden chapter{count !== 3 && "s"}
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
  storyId: number;
}

export default function ChapterList({ storyId }: ChapterListProps) {
  const story = getStory(storyId)();
  if (!story) {
    return <div class="ffe-cl-container" />;
  }

  const isReadMap = new Map(story.chapters?.map((chapter) => [chapter.id, getChapterRead(story.id, chapter.id)]));
  const isExtended = createSignal(false);

  return (
    <div class="ffe-cl-container">
      <div class="ffe-cl">
        <ol>
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
    </div>
  );
}
