import StoryProfile from "./enhance/StoryProfile";
import StoryText from "./enhance/StoryText";
import PageIdentifier, { Page } from "./PageIdentifier";

const identifier = new PageIdentifier(window.location);
const page = identifier.getPage();

if (page == Page.Chapter) {
	const storyProfile = new StoryProfile(document);
	storyProfile.enhance();

	const text = document.getElementById("storytextp");
	const storyText = new StoryText(text);
	storyText.enhance();
}
