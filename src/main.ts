import { Container } from "./container";
import { environment, Page } from "./util/environment";
import { parseFollowedStoryList, parseProfile2 } from "./util/parser";
import { StoryText } from "./enhance/StoryText";

const container = new Container();
async function main() {
	const valueContainer = container.getValueContainer();

	const menuBarEnhancer = container.getMenuBar();
	await menuBarEnhancer.enhance();

	if (environment.currentPageType === Page.Alerts || environment.currentPageType === Page.Favorites) {
		const getterName = environment.currentPageType === Page.Alerts ? "getAlertValue" : "getFavoriteValue";
		const list = parseFollowedStoryList(document);
		for (const item of list) {
			const value = valueContainer[getterName](item.id);
			await value.update(true);
		}

		const followsListEnhancer = container.getFollowsList();
		await followsListEnhancer.enhance();
	}

	if (environment.currentPageType === Page.Story) {
		const currentStory = parseProfile2(document);
		const storyValue = valueContainer.getStoryValue(currentStory.id);
		await storyValue.update(currentStory);

		const storyProfileEnhancer = container.getStoryProfile();
		await storyProfileEnhancer.enhance();

		const chapterListEnhancer = container.getChapterList();
		await chapterListEnhancer.enhance();
	}

	if (environment.currentPageType === Page.Chapter) {
		const currentStory = parseProfile2(document);
		const storyValue = valueContainer.getStoryValue(currentStory.id);
		await storyValue.update(currentStory);

		const storyProfileEnhancer = container.getStoryProfile();
		await storyProfileEnhancer.enhance();

		const storyTextEnhancer = new StoryText(document);
		await storyTextEnhancer.enhance();

		// if (currentStory.currentChapter) {
		// 	const markRead = () => {
		// 		const amount = document.documentElement.scrollTop;
		// 		const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
		//
		// 		if (amount / (max - 550) >= 1) {
		// 			currentStory.currentChapter.read(true);
		// 			window.removeEventListener("scroll", markRead);
		// 		}
		// 	};
		//
		// 	window.addEventListener("scroll", markRead);
		// }
	}
}

main().catch(console.error);
