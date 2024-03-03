import { parseFollows, parseStory } from "ffn-parser";
import Container from "./container";
import { environment, Page } from "./util/environment";
import { oAuth2LandingPage } from "./api/DropBox";
import { StoryText } from "./enhance";
import { CacheName } from "./api/ValueContainer";

import "./theme.css";
import "./main.css";

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
    const list = await parseFollows(document);
    if (list) {
      await Promise.all(
        list.map(async (item) => {
          const value = valueContainer[getterName](item.id);
          await value.update(true);
        }),
      );
    }

    const followsListEnhancer = container.getFollowsList();
    await followsListEnhancer.enhance();
  }

  if (environment.currentPageType === Page.StoryList) {
    const storyListEnhancer = container.getStoryListEnhancer();
    await storyListEnhancer.enhance();

    const saveListSettingsEnhancer = container.getSaveListSettings();
    await saveListSettingsEnhancer.enhance();
  }

  if (environment.currentPageType === Page.UniverseList || environment.currentPageType === Page.CommunityList) {
    const saveListSettingsEnhancer = container.getSaveListSettings();
    await saveListSettingsEnhancer.enhance();
  }

  if (environment.currentPageType === Page.Story) {
    const currentStory = await parseStory(document);
    if (currentStory) {
      const storyValue = valueContainer.getStoryValue(currentStory.id);
      await storyValue.update(currentStory);
    }

    const storyProfileEnhancer = container.getStoryProfile();
    await storyProfileEnhancer.enhance();

    const chapterListEnhancer = container.getChapterList();
    await chapterListEnhancer.enhance();
  }

  if (environment.currentPageType === Page.Chapter) {
    const currentStory = await parseStory(document);
    if (currentStory) {
      const storyValue = valueContainer.getStoryValue(currentStory.id);
      await storyValue.update(currentStory);

      if (environment.currentChapterId) {
        const wordCountValue = valueContainer.getWordCountValue(currentStory.id, environment.currentChapterId);
        await wordCountValue.update(
          document.getElementById("storytext")?.textContent?.trim()?.split(/\s+/).length ?? 0,
        );
      }

      const storyProfileEnhancer = container.getStoryProfile();
      await storyProfileEnhancer.enhance();

      const storyTextEnhancer = new StoryText();
      await storyTextEnhancer.enhance();

      if (environment.currentChapterId) {
        const readValue = valueContainer.getChapterReadValue(currentStory.id, environment.currentChapterId);
        const markRead = async () => {
          const amount = document.documentElement.scrollTop;
          const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;

          if (amount / (max - 550) >= 1) {
            window.removeEventListener("scroll", markRead);
            console.log(
              "Setting '%s' chapter '%s' to read",
              currentStory.title,
              currentStory.chapters.find((c) => c.id === environment.currentChapterId)?.title,
            );
            await readValue.set(true);
          }
        };

        window.addEventListener("scroll", markRead);
      }
    }
  }
}

async function migrate() {
  const readListStr = await GM.getValue("ffe-cache-read");
  if (!readListStr) {
    return;
  }

  const readList = JSON.parse(readListStr as string);
  for (const [storyId, story] of Object.entries(readList)) {
    for (const [chapterId, chapter] of Object.entries(story as object)) {
      await GM.setValue(CacheName.chapterRead(+storyId, +chapterId), chapter);
    }
  }

  await GM.deleteValue("ffe-cache-read");
  await GM.deleteValue("ffe-cache-alerts");
}

migrate().then(main).catch(console.error);
