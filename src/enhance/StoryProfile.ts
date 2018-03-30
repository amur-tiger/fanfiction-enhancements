import StoryProfileParser from "../util/StoryProfileParser";
import StoryCard from "./component/StoryCard";
import Enhancer from "./Enhancer";
import "./StoryProfile.css";

export default class StoryProfile implements Enhancer {
	constructor(private profile: HTMLElement) {
	}

	public enhance() {
		const parser = new StoryProfileParser();
		const meta = parser.parse(this.profile);

		const card = new StoryCard(document);
		const replacement = card.createElement(meta);

		this.profile.parentElement.replaceChild(replacement, this.profile);
	}
}
