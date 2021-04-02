import { parseFollows } from "ffn-parser";
import { ChapterList, StoryCard } from "./component";
import Enhancer from "./Enhancer";
import { ValueContainer } from "../api";

import "./FollowsList.css";

export default class FollowsList implements Enhancer {
  public constructor(private readonly valueContainer: ValueContainer) {}

  public async enhance(): Promise<any> {
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
      // eslint-disable-next-line no-await-in-loop
      const story = await this.valueContainer.getStory(followedStory.id);
      if (story) {
        const card = StoryCard({ story });
        item.appendChild(card);

        const chapterList = ChapterList({ story });
        item.appendChild(chapterList);
      }
    }

    table.parentElement?.removeChild(table);
  }
}
