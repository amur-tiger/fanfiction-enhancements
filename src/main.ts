import { Container } from "./container";
import { Story } from "./api/data";
import { environment, Page } from "./util/environment";
import { parseProfile } from "./util/parser";
import { ChapterList } from "./enhance/ChapterList";
import { FollowsList } from "./enhance/FollowsList";
import { MenuBar } from "./enhance/MenuBar";
import { StoryProfile } from "./enhance/StoryProfile";
import { StoryText } from "./enhance/StoryText";

const container = new Container();

const menuBarEnhancer = new MenuBar();
menuBarEnhancer.enhance();

if (environment.currentPageType === Page.Alerts || environment.currentPageType === Page.Favorites) {
	const followsListEnhancer = new FollowsList(container.getApi());
	followsListEnhancer.enhance();
}

if (environment.currentPageType === Page.Story) {
	const currentStory: Story = parseProfile(document);
	container.getApi().putStoryInfo(currentStory)
		.then(() => {
			const storyProfileEnhancer = new StoryProfile(document, container.getApi());
			storyProfileEnhancer.enhance();

			const chapterListEnhancer = new ChapterList(document, container.getApi());
			chapterListEnhancer.enhance();
		});
}

if (environment.currentPageType === Page.Chapter) {
	const currentStory: Story = parseProfile(document);
	container.getApi().putStoryInfo(currentStory)
		.then(() => {
			const storyProfileEnhancer = new StoryProfile(document, container.getApi());
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
		});
}
