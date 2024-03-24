import clsx from "clsx";
import type { Chapter } from "ffn-parser";
import CheckBox from "../CheckBox/CheckBox";
import getWordCount from "../../../api/word-count";
import createGmSignal from "../../../signal/gm-signal";
import { CacheName } from "../../../api/ValueContainer";

export interface ChapterListEntryProps {
  storyId: number;
  chapter: Chapter;
}

export default function ChapterListEntry({ storyId, chapter }: ChapterListEntryProps) {
  const isRead = createGmSignal<boolean>(CacheName.chapterRead(storyId, chapter.id));
  const words = getWordCount(storyId, chapter.id);

  return (
    <li class="ffe-cl-chapter">
      <CheckBox checked={isRead()} onChange={isRead} />
      <span class="ffe-cl-chapter-title">
        <a href={`/s/${storyId}/${chapter.id}`}>{chapter.title}</a>
      </span>
      {words() != null && (
        <span class={clsx("ffe-cl-words", { "ffe-cl-estimate": words()?.isEstimate })}>
          <b>{words()?.count.toLocaleString("en")}</b> words
        </span>
      )}
    </li>
  );
}
