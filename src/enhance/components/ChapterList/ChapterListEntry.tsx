import CheckBox from "../CheckBox/CheckBox";
import type Chapter from "../../../api/Chapter";

export interface ChapterListEntryProps {
  storyId: number;
  chapter: Chapter;
}

export default function ChapterListEntry({ storyId, chapter }: ChapterListEntryProps) {
  return (
    <li class="ffe-cl-chapter">
      <CheckBox checked={chapter.read()} onChange={chapter.read} />
      <span class="ffe-cl-chapter-title">
        <a href={`/s/${storyId}/${chapter.id}`}>{chapter.title}</a>
      </span>
      {chapter.words() != null && (
        <span class="ffe-cl-words">
          <b>{chapter.words()?.toLocaleString("en")}</b> words
        </span>
      )}
    </li>
  );
}
