import { getStoryInfo } from "../api/api";
import * as jQueryProxy from "jquery";
import { parseFollowedStoryList } from "../util/parser";
import { Enhancer } from "./Enhancer";
import { StoryCard } from "./component/StoryCard";

import "./FollowsList.css";

const $: JQueryStatic = (jQueryProxy as any).default || jQueryProxy;

export class FollowsList implements Enhancer {
	public enhance() {
		const cardFactory = new StoryCard(document);
		const list = parseFollowedStoryList(document);
		const $container = $("<ul class='ffe-follows-list'></ul>");

		for (const followedStory of list) {
			const $item = $("<li class='ffe-follows-item'></li>");
			$container.append($item);

			getStoryInfo(followedStory.id)
				.then(story => {
					const card = cardFactory.createElement(story);
					$item.append(card);
				});
		}

		const table = document.getElementById("gui_table1i").parentElement;
		table.parentElement.replaceChild($container[0], table);
	}
}
