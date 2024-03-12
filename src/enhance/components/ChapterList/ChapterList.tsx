import type Story from "../../../api/Story";
import CheckBox from "../CheckBox/CheckBox";
import "./ChapterList.css";
import { createSignal } from "../../../signal/signal";
import ChapterListEntry from "./ChapterListEntry";

const isExtended = createSignal(false);

function hideLongChapterList(list: HTMLElement) {
  const elements = Array.from(list.children);
  const isRead = (e: Element) => (e.firstElementChild?.firstElementChild as HTMLInputElement)?.checked ?? false;

  let currentBlockIsRead = isRead(elements[0]);
  let currentBlockCount = 0;

  for (let i = 0; i < elements.length; i++) {
    const read = isRead(elements[i]);
    if (read === currentBlockIsRead) {
      // no change from previous chapter, continue
      currentBlockCount += 1;
      continue;
    }

    if (!currentBlockIsRead && currentBlockCount < 5) {
      // didn't go over enough chapters to hide any
      currentBlockIsRead = read;
      currentBlockCount = 1;
      continue;
    }

    let off = 0;
    if (currentBlockIsRead) {
      // we can hide more chapters if they are already read
      elements.slice(i - currentBlockCount, i).forEach((element) => {
        (element as HTMLElement).style.display = "none";
      });
    } else {
      // some unread chapters here, show a bit more of them
      elements.slice(i - currentBlockCount + 2, i - 2).forEach((element) => {
        (element as HTMLElement).style.display = "none";
      });
      off = 2;
    }

    // insert a link to show the hidden chapters
    const showLink = document.createElement("a");
    showLink.style.cursor = "pointer";
    showLink.textContent = `Show ${currentBlockCount - off * 2} hidden chapters`;
    showLink.addEventListener("click", () => {
      for (let j = 0; j < list.children.length; j++) {
        const element = list.children.item(j) as HTMLElement;
        if (element.classList.contains("ffe-cl-collapsed")) {
          element.style.display = "none";
        } else {
          element.style.display = "block";
        }
      }
    });

    const showLinkContainer = document.createElement("li");
    showLinkContainer.classList.add("ffe-cl-chapter", "ffe-cl-collapsed");
    showLinkContainer.appendChild(showLink);

    elements[0].parentElement?.insertBefore(showLinkContainer, elements[i - off]);

    currentBlockIsRead = read;
    currentBlockCount = 1;
  }

  // the last visited block might be long enough to hide
  if (currentBlockCount > 6) {
    elements.slice(elements.length - currentBlockCount + 2, elements.length - 3).forEach((element) => {
      (element as HTMLElement).style.display = "none";
    });

    const showLinkContainer = (
      <li class="ffe-cl-chapter ffe-cl-collapsed">
        <a style="cursor: pointer;">Show {currentBlockCount - 5} hidden chapters</a>
      </li>
    );

    showLinkContainer.querySelector("a")!.addEventListener("click", () => {
      isExtended(true);
    });

    elements[0].parentElement?.insertBefore(showLinkContainer, elements[elements.length - 3]);
  }
}

export interface ChapterListProps {
  story: Story;
}

export default function ChapterList({ story }: ChapterListProps) {
  const element = (
    <div class="ffe-cl-container">
      <div class="ffe-cl">
        <ol>
          {story.chapters.map((chapter) => (
            <ChapterListEntry storyId={story.id} chapter={chapter} />
          ))}
        </ol>
      </div>
    </div>
  );

  if (!isExtended()) {
    setTimeout(() => {
      // The getter for the read status are asynchronous, so the read status is not set immediately. This is
      // necessary for hideLongChapterList(), though, so it has to wait. Since the data is saved locally, this
      // little timeout should be plenty. If there are problems, though, maybe the getter have to be primed and
      // waited on.
      hideLongChapterList(element.querySelector("ol")!);
    }, 5);
  }

  return element;
}
