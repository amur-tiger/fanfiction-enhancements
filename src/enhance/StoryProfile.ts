import { Story } from "../api/data";
import { currentStory } from "../util/parser";
import { Enhancer } from "./Enhancer";
import { StoryCard } from "./component/StoryCard";

import "./StoryProfile.css";

export class StoryProfile implements Enhancer {
	constructor(private document: Document) {
	}

	public enhance() {
		const profile = this.document.getElementById("profile_top");

		const card = new StoryCard(document);
		const replacement = card.createElement(currentStory);

		// profile.parentElement.replaceChild(replacement, profile);
		profile.parentElement.insertBefore(replacement, profile);
		profile.style.display = "none";
	}
}
