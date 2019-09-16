import { Container } from "./container";
import { environment, Page } from "./util/environment";
import { parseFollowedStoryList } from "./util/parser";
import { oAuth2LandingPage } from "./api/DropBox";
import { StoryText } from "./enhance/StoryText";
import { CacheName } from "./api/ValueContainer";

const container = new Container();
async function main() {
	if (environment.currentPageType === Page.OAuth2) {
		console.log("OAuth 2 landing page - no enhancements will be applied");
		oAuth2LandingPage();

		return;
	}

	const valueContainer = container.getValueContainer();

	const dropBox = container.getDropBox();
	if (await dropBox.isAuthorized()) {
		dropBox.synchronize().catch(console.error);
	}

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

	if (environment.currentPageType === Page.StoryList) {
		const storyListEnhancer = container.getStoryListEnhancer();
		await storyListEnhancer.enhance();
	}

	if (environment.currentPageType === Page.Story) {
		const storyProfileEnhancer = container.getStoryProfile();
		await storyProfileEnhancer.enhance();

		const chapterListEnhancer = container.getChapterList();
		await chapterListEnhancer.enhance();
	}

	if (environment.currentPageType === Page.Chapter) {
		const currentStory = await valueContainer.getStory(environment.currentStoryId!);

		const storyProfileEnhancer = container.getStoryProfile();
		await storyProfileEnhancer.enhance();

		const storyTextEnhancer = new StoryText();
		await storyTextEnhancer.enhance();

		const readValue = valueContainer.getChapterReadValue(currentStory.id, environment.currentChapterId!);
		const markRead = async () => {
			const amount = document.documentElement.scrollTop;
			const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;

			if (amount / (max - 550) >= 1) {
				window.removeEventListener("scroll", markRead);
				console.log("Setting '%s' chapter '%s' to read", currentStory.title,
					currentStory.chapters.find(c => c.id === environment.currentChapterId)!.name);
				await readValue.set(true);
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
	await GM.deleteValue("ffe-cache-alerts");
}

migrate()
	.then(main)
	.catch(console.error);

// important: some broken tag recognition for stories in:
// https://www.fanfiction.net/community/Rebirth-Society/92829/99/4/1/0/0/0/0/
