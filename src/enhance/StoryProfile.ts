import { Enhancer } from "./Enhancer";
import { StoryCard } from "./component/StoryCard";
import { StoryProfileParser } from "../util/StoryProfileParser";

import "./StoryProfile.css";

export class StoryProfile implements Enhancer {
	constructor(private document: Document) {
	}

	public enhance() {
		const profile = this.document.getElementById("profile_top");
		if (!profile) {
			throw new Error("Could not find profile element. Check for update?");
		}

		const chapters = this.document.getElementById("chap_select");
		if (!chapters) {
			throw new Error("Could not find chapter select element. Check for update?");
		}

		const parser = new StoryProfileParser();
		const story = parser.parse(profile, chapters);

		const card = new StoryCard(document);
		const replacement = card.createElement(story);

		profile.parentElement.replaceChild(replacement, profile);
	}
}
