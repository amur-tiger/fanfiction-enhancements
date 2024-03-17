import type Story from "../../../api/Story";
import "./ChapterList.css";
import { createSignal } from "../../../signal/signal";
import ChapterListEntry from "./ChapterListEntry";
import type Chapter from "../../../api/Chapter";

function hiddenChapterMapper(story: Story, onShow: () => void) {
  return (chapter: Chapter, idx: number, chapters: Chapter[]) => {
    if (chapter.read()) {
      // if last element in list or next element is unread
      if (idx === chapters.length - 1 || !chapters[idx + 1].read()) {
        let count = 0;
        for (let i = idx; i >= 0; i--) {
          if (!chapters[i].read()) {
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
          if (chapters[i].read()) {
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

      if (idx < chapters.length - 3 && !chapters[idx - 1].read() && !chapters[idx - 2].read()) {
        return null;
      }
    }

    return <ChapterListEntry storyId={story.id} chapter={chapter} />;
  };
}

export interface ChapterListProps {
  story: Story;
}

export default function ChapterList({ story }: ChapterListProps) {
  const isExtended = createSignal(false);

  return (
    <div class="ffe-cl-container">
      <div class="ffe-cl">
        <ol>
          {isExtended()
            ? story.chapters.map((chapter) => <ChapterListEntry storyId={story.id} chapter={chapter} />)
            : story.chapters.flatMap(hiddenChapterMapper(story, () => isExtended.set(true)))}
        </ol>
      </div>
    </div>
  );
}
