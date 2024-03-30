import { parseFollows } from "ffn-parser";
import type Enhancer from "./Enhancer";
import { Page } from "../util/environment";
import ChapterList from "../components/ChapterList/ChapterList";
import StoryCard from "../components/StoryCard/StoryCard";
import "./FollowsList.css";

export default class FollowsList implements Enhancer {
  public canEnhance(type: Page): boolean {
    return type === Page.Alerts || type === Page.Favorites;
  }

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

      const card = <StoryCard storyId={followedStory.id} />;
      item.appendChild(card);

      const chapterList = <ChapterList storyId={followedStory.id} />;
      item.appendChild(chapterList);
    }

    table.parentElement?.removeChild(table);
  }
}
