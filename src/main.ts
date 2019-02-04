import { Container } from "./container";
import { environment, Page } from "./util/environment";
import { parseFollowedStoryList, parseProfile } from "./util/parser";
import { StoryText } from "./enhance/StoryText";
import { CacheName } from "./api/ValueContainer";

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
		const currentStory = parseProfile(document);
		const storyValue = valueContainer.getStoryValue(currentStory.id);
		await storyValue.update(currentStory);

		const storyProfileEnhancer = container.getStoryProfile();
		await storyProfileEnhancer.enhance();

		const chapterListEnhancer = container.getChapterList();
		await chapterListEnhancer.enhance();
	}

	if (environment.currentPageType === Page.Chapter) {
		const currentStory = parseProfile(document);
		const storyValue = valueContainer.getStoryValue(currentStory.id);
		await storyValue.update(currentStory);

		const wordCountValue = valueContainer.getWordCountValue(currentStory.id, environment.currentChapterId);
		await wordCountValue.update(document.getElementById("storytext")
			.textContent.trim().split(/\s+/).length);

		const storyProfileEnhancer = container.getStoryProfile();
		await storyProfileEnhancer.enhance();

		const storyTextEnhancer = new StoryText();
		await storyTextEnhancer.enhance();

		const readValue = valueContainer.getChapterReadValue(currentStory.id, environment.currentChapterId);
		const markRead = async () => {
			const amount = document.documentElement.scrollTop;
			const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;

			if (amount / (max - 550) >= 1) {
				await readValue.set(true);
				window.removeEventListener("scroll", markRead);
			}
		};

		window.addEventListener("scroll", markRead);
	}
}

async function migrate() {
	const readListStr = await GM.getValue("ffe-cache-read");
	if (!readListStr) {
		return;
	}

	const readList = JSON.parse(readListStr as string);
	for (const storyId in readList) {
		if (!readList.hasOwnProperty(storyId)) {
			continue;
		}

		for (const chapterId in readList[storyId]) {
			if (!readList[storyId].hasOwnProperty(chapterId)) {
				continue;
			}

			await GM.setValue(CacheName.chapterRead(+storyId, +chapterId), readList[storyId][chapterId]);
		}
	}

	await GM.deleteValue("ffe-cache-read");
}

migrate()
	.then(main)
	.catch(console.error);
