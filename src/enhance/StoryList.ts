import { parseStoryList } from "ffn-parser";
import Enhancer from "./Enhancer";
import { Story, ValueContainer } from "../api";
import { StoryCard } from "./component";

import "./StoryList.css";

export default class StoryList implements Enhancer {
  public constructor(private readonly valueContainer: ValueContainer) {}

  public async enhance(): Promise<any> {
    const list = await parseStoryList(document);
    if (!list) {
      return;
    }

    const container = document.createElement("ul");
    container.classList.add("ffe-story-list", "maxwidth");

    const cw = document.getElementById("content_wrapper");
    if (!cw) {
      return;
    }

    cw.parentElement?.insertBefore(container, null);

    const deferChapterList = [];
    for (const followedStory of list) {
      const item = document.createElement("li");
      item.classList.add("ffe-story-item");
      container.appendChild(item);

      const story = new Story(
        {
          ...followedStory,
          chapters: [],
        },
        this.valueContainer
      );
      const card = new StoryCard({ story }).render();
      item.appendChild(card);

      deferChapterList.push([story, item]);
    }

    cw.parentElement?.removeChild(cw);
  }
}
