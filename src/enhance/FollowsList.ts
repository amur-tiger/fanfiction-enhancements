import { parseFollows } from "ffn-parser";
import { ChapterList } from "./component/ChapterList";
import { Enhancer } from "./Enhancer";
import { StoryCard } from "./component/StoryCard";
import { ValueContainer } from "../api/ValueContainer";

import "./FollowsList.css";

export class FollowsList implements Enhancer {
	public constructor(private readonly valueContainer: ValueContainer) {
	}

	public async enhance(): Promise<any> {
		const list = await parseFollows(document);
		const container = document.createElement("ul");
		container.classList.add("ffe-follows-list");

		const table = document.getElementById("gui_table1i").parentElement;
		table.parentElement.insertBefore(container, table);

		for (const followedStory of list) {
			const item = document.createElement("li");
			item.classList.add("ffe-follows-item");
			container.appendChild(item);

			const story = await this.valueContainer.getStory(followedStory.id);
			const card = new StoryCard({ story: story }).render();
			item.appendChild(card);

			const chapterList = new ChapterList({ story: story }).render();
			item.appendChild(chapterList);
		}

		table.parentElement.removeChild(table);
	}
}
