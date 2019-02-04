import { Container } from "../container";
import { environment } from "../util/environment";
import { Enhancer } from "./Enhancer";
import { StoryCard } from "./component/StoryCard";
import { ValueContainer } from "../api/ValueContainer";

import "./StoryProfile.css";

export class StoryProfile implements Enhancer {
	constructor(private readonly valueContainer: ValueContainer) {
	}

	public async enhance(): Promise<any> {
		const profile = document.getElementById("profile_top");
		const story = await this.valueContainer.getStory(environment.currentStoryId);
		const card = new StoryCard({ story: story });
		const replacement = card.render();

		// profile.parentElement.replaceChild(replacement, profile);
		profile.parentElement.insertBefore(replacement, profile);
		profile.style.display = "none";
	}
}
