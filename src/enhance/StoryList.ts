import { parseStoryList, parseZListItem } from "../util/parser";
import { ChapterList } from "./component/ChapterList";
import { Enhancer } from "./Enhancer";
import { Story } from "../api/Story";
import { StoryCard } from "./component/StoryCard";
import { ValueContainer } from "../api/ValueContainer";

import "./FollowsList.css";

export class StoryList implements Enhancer {
	public constructor(private readonly valueContainer: ValueContainer) {
	}

	public async enhance(): Promise<any> {
		const list = parseStoryList(document);
		const container = document.createElement("ul");
		container.classList.add("ffe-follows-list");

		const firstElement = document.getElementsByClassName("z-list")[0];
		firstElement.parentElement.insertBefore(container, firstElement);

		const deferChapterList = [];
		for (const followedStory of list) {
			const item = document.createElement("li");
			item.classList.add("ffe-follows-item");
			container.appendChild(item);

			const story = new Story(parseZListItem(followedStory.row), this.valueContainer);
			const card = new StoryCard({ story: story }).render();
			item.appendChild(card);

			deferChapterList.push([story, item]);

			followedStory.row.parentElement.removeChild(followedStory.row);
		}

		/*for (const [story, item] of deferChapterList) {
			const chapterList = new ChapterList({ story: story });
			item.appendChild(chapterList.render());
		}*/
	}
}
