import { environment } from "../util/environment";
import type Enhancer from "./Enhancer";
import ChapterListComponent from "../components/ChapterList/ChapterList";

export default class ChapterList implements Enhancer {
  public async enhance(): Promise<void> {
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
          (e.className === "lc-wrapper" && e.id !== "pre_story_links"),
      )
      .forEach((e) => contentWrapper.removeChild(e));
    const storyText = document.getElementById("storytextp");
    if (storyText) {
      contentWrapper.removeChild(storyText);
    }

    // add chapter list
    const chapterList = <ChapterListComponent storyId={environment.currentStoryId} />;
    contentWrapper.insertBefore(chapterList, document.getElementById("review_success"));
  }
}
