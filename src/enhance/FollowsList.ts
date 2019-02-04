import { Api } from "../api/api";
import { parseFollowedStoryList } from "../util/parser";
import { Enhancer } from "./Enhancer";
import { StoryCard } from "./component/StoryCard";

import "./FollowsList.css";
import { ValueContainer } from "../api/ValueContainer";

export class FollowsList implements Enhancer {
	public constructor(private readonly valueContainer: ValueContainer) {
	}

	public async enhance(): Promise<any> {
		const list = parseFollowedStoryList(document);
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

			followedStory.row.parentElement.removeChild(followedStory.row);
		}

		table.parentElement.removeChild(table);
	}
}
