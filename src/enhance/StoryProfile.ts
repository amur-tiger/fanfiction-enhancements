import { Api } from "../api/api";
import { environment } from "../util/environment";
import { Enhancer } from "./Enhancer";
import { StoryCard } from "./component/StoryCard";

import "./StoryProfile.css";

export class StoryProfile implements Enhancer {
	constructor(private readonly document: Document, private readonly api: Api) {
	}

	public enhance(): Promise<any> {
		const profile = this.document.getElementById("profile_top");
		const card = new StoryCard(document, this.api);

		return this.api.getStoryInfo(environment.currentStoryId)
			.then(story => {
				const replacement = card.createElement(story);

				// profile.parentElement.replaceChild(replacement, profile);
				profile.parentElement.insertBefore(replacement, profile);
				profile.style.display = "none";
			});
	}
}
