import { parseStoryList } from "ffn-parser";
import type Enhancer from "./Enhancer";
import { Page } from "../util/environment";
import StoryCard from "../components/StoryCard/StoryCard";
import "./StoryList.css";

export default class StoryList implements Enhancer {
  public canEnhance(type: Page): boolean {
    return type === Page.StoryList;
  }

  public async enhance(): Promise<void> {
    const list = await parseStoryList(document);
    if (!list) {
      return;
    }

    const cw = document.getElementById("content_wrapper");
    if (!cw) {
      return;
    }

    const container = document.createElement("ul");
    container.classList.add("ffe-story-list", "maxwidth");
    cw.parentElement?.insertBefore(container, null);

    for (const followedStory of list) {
      const item = document.createElement("li");
      item.classList.add("ffe-story-item");
      container.appendChild(item);

      const card = <StoryCard storyId={followedStory.id} />;
      item.appendChild(card);
    }

    cw.querySelectorAll(".z-list").forEach((e) => e.parentElement?.removeChild(e));

    const pageNav = cw.querySelector("center:last-of-type");
    if (pageNav) {
      const footer = document.createElement("div");
      footer.id = "content_wrapper_inner";
      footer.classList.add("maxwidth");
      footer.style.backgroundColor = "white";
      footer.style.height = "35px";
      footer.style.lineHeight = "35px";
      footer.appendChild(pageNav);
      cw.parentElement?.insertBefore(footer, null);
    }
  }
}
