import { Container } from "../container";
import { environment } from "../util/environment";
import { Enhancer } from "./Enhancer";
import { ValueContainer } from "../api/ValueContainer";

import "./StoryProfile.css";

export class StoryProfile implements Enhancer {
	constructor(private readonly container: Container, private readonly valueContainer: ValueContainer) {
	}

	public async enhance(): Promise<any> {
		const profile = document.getElementById("profile_top");
		const card = this.container.getStoryCard();
		const story = await this.valueContainer.getStory(environment.currentStoryId);

		const replacement = card.createElement(story);

		// profile.parentElement.replaceChild(replacement, profile);
		profile.parentElement.insertBefore(replacement, profile);
		profile.style.display = "none";
	}
}
