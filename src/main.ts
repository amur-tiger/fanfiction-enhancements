import { environment, Page } from "./util/environment";
import { ChapterList } from "./enhance/ChapterList";
import { getFollowedStories } from "./api/StoryApi";
import { StoryProfile } from "./enhance/StoryProfile";
import { StoryText } from "./enhance/StoryText";

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

	if (environment.currentChapter) {
		const markRead = () => {
			const amount = document.documentElement.scrollTop;
			const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;

			if (amount / (max - 550) >= 1) {
				environment.currentChapter.read(true);
				window.removeEventListener("scroll", markRead);
			}
		};

		window.addEventListener("scroll", markRead);
	}
}
