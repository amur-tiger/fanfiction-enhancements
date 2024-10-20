import clsx from "clsx";
import type { Chapter } from "ffn-parser";
import CheckBox from "../CheckBox/CheckBox";
import getChapterRead from "../../api/chapter-read";
import getWordCount from "../../api/word-count";
import classes from "./ChapterList.css";

export interface ChapterListEntryProps {
  storyId: number;
  chapter: Chapter;
}

export default function ChapterListEntry({ storyId, chapter }: ChapterListEntryProps) {
  const isRead = getChapterRead(storyId, chapter.id);
  const words = getWordCount(storyId, chapter.id);

  return (
    <li class={classes.chapter}>
      <CheckBox checked={isRead()} onChange={isRead.set} />
      <span>
        <a href={`/s/${storyId}/${chapter.id}`}>{chapter.title}</a>
      </span>
      {words() != null && (
        <span class={clsx(classes.words, { [classes.estimate]: words()?.isEstimate })}>
          <b>{words()?.count.toLocaleString("en")}</b> words
        </span>
      )}
    </li>
  );
}
