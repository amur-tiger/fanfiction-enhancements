import { environment } from "../util/environment";
import ChapterListComponent from "./components/ChapterList/ChapterList";
import type Enhancer from "./Enhancer";
import ValueContainer from "../api/ValueContainer";

export default class ChapterList implements Enhancer {
  public constructor(private readonly valueContainer: ValueContainer) {}

  public async enhance(): Promise<void> {
    const contentWrapper = document.getElementById("content_wrapper_inner");
    if (!contentWrapper || !environment.currentStoryId) {
      return;
    }

    const story = await this.valueContainer.getStory(environment.currentStoryId);
    if (!story) {
      return;
    }

    // clean up content
    Array.from(contentWrapper.children)
      .filter(
        (e) =>
          (!e.textContent && (e as HTMLDivElement).style.height === "5px") ||
          (e.firstElementChild && e.firstElementChild.nodeName === "SELECT") ||
          (e.className === "lc-wrapper" && e.id !== "pre_story_links"),
      )
      .forEach((e) => contentWrapper.removeChild(e));
    const storyText = document.getElementById("storytextp");
    if (storyText) {
      contentWrapper.removeChild(storyText);
    }

    // add chapter list
    const chapterList = ChapterListComponent({ story });
    contentWrapper.insertBefore(chapterList, document.getElementById("review_success"));
  }
}
