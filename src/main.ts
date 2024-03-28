import { parseStory } from "ffn-parser";
import Container from "./container";
import { environment, Page } from "./util/environment";
import StoryText from "./enhance/StoryText";
import getChapterRead from "./api/chapter-read";
import { syncChapterReadStatus, uploadMetadata } from "./sync/sync";

import "./theme.css";
import "./main.css";

const container = new Container();

async function main() {
  if (environment.currentPageType === Page.OAuth2) {
    console.log("OAuth 2 landing page - no enhancements will be applied");
    return;
  }

  syncChapterReadStatus().catch(console.error);

  const menuBarEnhancer = container.getMenuBar();
  await menuBarEnhancer.enhance();

  if (environment.currentPageType === Page.Alerts || environment.currentPageType === Page.Favorites) {
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
    const storyProfileEnhancer = container.getStoryProfile();
    await storyProfileEnhancer.enhance();

    const chapterListEnhancer = container.getChapterList();
    await chapterListEnhancer.enhance();
  }

  if (environment.currentPageType === Page.Chapter) {
    const currentStory = await parseStory(document);
    if (currentStory) {
      const storyProfileEnhancer = container.getStoryProfile();
      await storyProfileEnhancer.enhance();

      const storyTextEnhancer = new StoryText();
      await storyTextEnhancer.enhance();

      if (environment.currentChapterId) {
        const isRead = getChapterRead(currentStory.id, environment.currentChapterId);
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
            isRead.set(true);
            await uploadMetadata();
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
      await GM.setValue(`ffe-story-${storyId}-chapter-${chapterId}-read`, chapter);
    }
  }

  await GM.deleteValue("ffe-cache-read");
  await GM.deleteValue("ffe-cache-alerts");
}

migrate().then(main).catch(console.error);
