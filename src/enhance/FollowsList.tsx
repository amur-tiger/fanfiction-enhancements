import { parseFollows } from "ffn-parser";
import ChapterList from "./components/ChapterList/ChapterList";
import StoryCard from "./components/StoryCard/StoryCard";
import type Enhancer from "./Enhancer";
import type ValueContainer from "../api/ValueContainer";

import "./FollowsList.css";

export default class FollowsList implements Enhancer {
  public constructor(private readonly valueContainer: ValueContainer) {}

  public async enhance(): Promise<void> {
    const list = await parseFollows(document);
    if (!list) {
      return;
    }

    const container = document.createElement("ul");
    container.classList.add("ffe-follows-list");

    const table = document.getElementById("gui_table1i")?.parentElement;
    if (!table) {
      return;
    }

    table.parentElement?.insertBefore(container, table);

    for (const followedStory of list) {
      const item = document.createElement("li");
      item.classList.add("ffe-follows-item");
      container.appendChild(item);

      // suppressed to keep sorting
      const story = await this.valueContainer.getStory(followedStory.id);
      if (story) {
        const card = <StoryCard story={story} />;
        item.appendChild(card);

        const chapterList = <ChapterList story={story} />;
        item.appendChild(chapterList);
      }
    }

    table.parentElement?.removeChild(table);
  }
}
