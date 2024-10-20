import { parseFollows } from "ffn-parser";
import type Enhancer from "../Enhancer";
import { Page } from "../../util/environment";
import ChapterList from "../../components/ChapterList/ChapterList";
import StoryCard from "../../components/StoryCard/StoryCard";
import classes from "./FollowsList.css";

export default class FollowsList implements Enhancer {
  public canEnhance(type: Page): boolean {
    return type === Page.Alerts || type === Page.Favorites;
  }

  public async enhance(): Promise<void> {
    console.log("enhancing follows");
    const list = await parseFollows(document);
    if (!list) {
      console.warn("no follows list found");
      return;
    }

    const container = <ul class={classes.list} />;

    const table = document.getElementById("gui_table1")?.parentElement;
    if (!table) {
      return;
    }

    table.parentElement?.insertBefore(container, table);

    for (const followedStory of list) {
      const item = <li class={classes.item} />;
      container.appendChild(item);

      const card = <StoryCard class={classes.storyCard} storyId={followedStory.id} />;
      item.appendChild(card);

      const chapterList = <ChapterList class={classes.chapterList} storyId={followedStory.id} />;
      item.appendChild(chapterList);
    }

    table.parentElement?.removeChild(table);
  }
}
