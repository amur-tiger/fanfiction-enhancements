import { Api } from "../api/api";
import { parseFollowedStoryList } from "../util/parser";
import { Enhancer } from "./Enhancer";
import { StoryCard } from "./component/StoryCard";

import "./FollowsList.css";

export class FollowsList implements Enhancer {
	public constructor(private readonly api: Api) {
	}

	public enhance(): Promise<any> {
		const cardFactory = new StoryCard(document, this.api);
		const list = parseFollowedStoryList(document);
		const container = document.createElement("ul");
		container.classList.add("ffe-follows-list");

		// the chain of promises ensures that the first request finishes before the next is started. This
		// ensures that the Api has time to cache some results and fires off fewer requests.
		let p = Promise.resolve();
		for (const followedStory of list) {
			const item = document.createElement("li");
			item.classList.add("ffe-follows-item");
			container.appendChild(item);

			p = p.then(() => this.api.getStoryInfo(followedStory.id)
				.then(story => {
					const card = cardFactory.createElement(story);
					item.appendChild(card);
				})
				.catch(err => {
					console.error("%s\n%s", err, err.stack);
					item.textContent = "Failed to retrieve story info. " + err.toString();
				}));
		}

		const table = document.getElementById("gui_table1i").parentElement;
		table.parentElement.replaceChild(container, table);

		return p;
	}
}
