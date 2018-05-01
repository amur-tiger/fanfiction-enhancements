import { getFollowedStories } from "./api/api";
import { environment, Page } from "./util/environment";
import { currentStory } from "./util/parser";
import { ChapterList } from "./enhance/ChapterList";
import { StoryProfile } from "./enhance/StoryProfile";
import { StoryText } from "./enhance/StoryText";

if (environment.currentPageType === Page.Alerts || environment.currentPageType === Page.Favorites) {
	// todo
}

if (environment.currentPageType === Page.Story) {
	const storyProfileEnhancer = new StoryProfile(document);
	storyProfileEnhancer.enhance();

	const chapterListEnhancer = new ChapterList(document);
	chapterListEnhancer.enhance();
}

if (environment.currentPageType === Page.Chapter) {
	const storyProfileEnhancer = new StoryProfile(document);
	storyProfileEnhancer.enhance();

	const storyTextEnhancer = new StoryText(document);
	storyTextEnhancer.enhance();

	if (currentStory.currentChapter) {
		const markRead = () => {
			const amount = document.documentElement.scrollTop;
			const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;

			if (amount / (max - 550) >= 1) {
				currentStory.currentChapter.read(true);
				window.removeEventListener("scroll", markRead);
			}
		};

		window.addEventListener("scroll", markRead);
	}
}
