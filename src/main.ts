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
}
