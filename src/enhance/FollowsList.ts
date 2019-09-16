import { parseFollowedStoryList } from "../util/parser";
import { ChapterList } from "./component/ChapterList";
import { Enhancer } from "./Enhancer";
import { StoryCard } from "./component/StoryCard";
import { ValueContainer } from "../api/ValueContainer";

import "./FollowsList.css";

export class FollowsList implements Enhancer {
	public constructor(private readonly valueContainer: ValueContainer) {
	}

	public async enhance(): Promise<any> {
		const list = parseFollowedStoryList(document);
		const container = document.createElement("ul");
		container.classList.add("ffe-follows-list");

		const tableElement = document.getElementById("gui_table1i");
		if (!tableElement) {
			return;
		}

		const table = tableElement.parentElement!;
		table.parentElement!.insertBefore(container, table);

		const stories = await this.valueContainer.getStories(list.map(fs => fs.id));

		for (const story of stories) {
			const item = document.createElement("li");
			item.classList.add("ffe-follows-item");
			container.appendChild(item);

			const card = new StoryCard({ story: story }).render();
			item.appendChild(card);

			const chapterList = new ChapterList({ story: story }).render();
			item.appendChild(chapterList);

			// followedStory.row.parentElement!.removeChild(followedStory.row);
		}

		table.parentElement!.removeChild(table);
	}
}
