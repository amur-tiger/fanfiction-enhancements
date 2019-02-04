import { environment } from "../util/environment";
import { ChapterList as ChapterListComponent } from "./component/ChapterList";
import { Enhancer } from "./Enhancer";
import { ValueContainer } from "../api/ValueContainer";

export class ChapterList implements Enhancer {
	public constructor(private readonly valueContainer: ValueContainer) {
	}

	public async enhance(): Promise<any> {
		const contentWrapper = document.getElementById("content_wrapper_inner");

		// clean up content
		Array.from(contentWrapper.children)
			.filter(e => (!e.textContent && (e as HTMLDivElement).style.height === "5px")
				|| (e.firstElementChild && e.firstElementChild.nodeName === "SELECT")
				|| (e.className === "lc-wrapper" && e.id !== "pre_story_links"))
			.forEach(e => contentWrapper.removeChild(e));
		contentWrapper.removeChild(document.getElementById("storytextp"));

		// add chapter list
		const story = await this.valueContainer.getStory(environment.currentStoryId);
		const chapterList = new ChapterListComponent({ story: story });
		contentWrapper.insertBefore(chapterList.render(), document.getElementById("review_success"));
	}
}
