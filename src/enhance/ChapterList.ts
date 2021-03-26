import { environment } from "../util/environment";
import { ChapterList as ChapterListComponent } from "./component";
import Enhancer from "./Enhancer";
import { ValueContainer } from "../api";

export default class ChapterList implements Enhancer {
  public constructor(private readonly valueContainer: ValueContainer) {}

  public async enhance(): Promise<any> {
    const contentWrapper = document.getElementById("content_wrapper_inner");
    if (!contentWrapper || !environment.currentStoryId) {
      return;
    }

    // clean up content
    Array.from(contentWrapper.children)
      .filter(
        (e) =>
          (!e.textContent && (e as HTMLDivElement).style.height === "5px") ||
          (e.firstElementChild && e.firstElementChild.nodeName === "SELECT") ||
          (e.className === "lc-wrapper" && e.id !== "pre_story_links")
      )
      .forEach((e) => contentWrapper.removeChild(e));
    const storyText = document.getElementById("storytextp");
    if (storyText) {
      contentWrapper.removeChild(storyText);
    }

    // add chapter list
    const story = await this.valueContainer.getStory(environment.currentStoryId);
    const chapterList = new ChapterListComponent({ story });
    contentWrapper.insertBefore(chapterList.render(), document.getElementById("review_success"));
  }
}
