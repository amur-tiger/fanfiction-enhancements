import { parseStoryList, parseZListItem } from "../util/parser";
import { Enhancer } from "./Enhancer";
import { Story } from "../api/Story";
import { StoryCard } from "./component/StoryCard";
import { ValueContainer } from "../api/ValueContainer";

import "./StoryList.css";

export class StoryList implements Enhancer {
	public constructor(private readonly valueContainer: ValueContainer) {
	}

	public async enhance(): Promise<any> {
		const list = parseStoryList(document);
		const container = document.createElement("ul");
		container.classList.add("ffe-story-list", "maxwidth");

		const cw = document.getElementById("content_wrapper");
		cw.parentElement.insertBefore(container, undefined);

		const deferChapterList = [];
		for (const followedStory of list) {
			const item = document.createElement("li");
			item.classList.add("ffe-story-item");
			container.appendChild(item);

			const story = new Story(parseZListItem(followedStory.row), this.valueContainer);
			const card = new StoryCard({ story: story }).render();
			item.appendChild(card);

			deferChapterList.push([story, item]);

			followedStory.row.parentElement.removeChild(followedStory.row);
		}
	}
}
