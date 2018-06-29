import { Api } from "../api/api";
import * as jQueryProxy from "jquery";
import { parseFollowedStoryList } from "../util/parser";
import { Enhancer } from "./Enhancer";
import { StoryCard } from "./component/StoryCard";

import "./FollowsList.css";

const $: JQueryStatic = (jQueryProxy as any).default || jQueryProxy;

export class FollowsList implements Enhancer {
	public constructor(private readonly api: Api) {
	}

	public enhance(): Promise<any> {
		const cardFactory = new StoryCard(document, this.api);
		const list = parseFollowedStoryList(document);
		const $container = $("<ul class='ffe-follows-list'></ul>");

		// the chain of promises ensures that the first request finishes before the next is started. This
		// ensures that the Api has time to cache some results and fires off fewer requests.
		let p = Promise.resolve();
		for (const followedStory of list) {
			const $item = $("<li class='ffe-follows-item'></li>");
			$container.append($item);

			p = p.then(() => this.api.getStoryInfo(followedStory.id)
				.then(story => {
					const card = cardFactory.createElement(story);
					$item.append(card);
				})
				.catch(err => {
					console.error("%s\n%s", err, err.stack);
					$item.append("Failed to retrieve story info. " + err.toString());
				}));
		}

		const table = document.getElementById("gui_table1i").parentElement;
		table.parentElement.replaceChild($container[0], table);

		return p;
	}
}
