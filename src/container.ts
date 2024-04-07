import MenuBar from "./enhance/MenuBar/MenuBar";
import FollowsList from "./enhance/FollowsList/FollowsList";
import StoryList from "./enhance/StoryList/StoryList";
import StoryProfile from "./enhance/StoryProfile/StoryProfile";
import ChapterList from "./enhance/ChapterList/ChapterList";
import SaveListSettings from "./enhance/SaveListSettings/SaveListSettings";
import StoryText from "./enhance/StoryText/StoryText";
import type Enhancer from "./enhance/Enhancer";

export default class Container {
  private menuBar?: MenuBar;

  private followsList?: FollowsList;

  private storyList?: StoryList;

  private storyProfile?: StoryProfile;

  private chapterList?: ChapterList;

  private saveListSettings?: SaveListSettings;

  private storyText?: StoryText;

  public getMenuBar(): MenuBar {
    if (!this.menuBar) {
      this.menuBar = new MenuBar();
    }

    return this.menuBar;
  }

  public getFollowsList(): FollowsList {
    if (!this.followsList) {
      this.followsList = new FollowsList();
    }

    return this.followsList;
  }

  public getStoryListEnhancer(): StoryList {
    if (!this.storyList) {
      this.storyList = new StoryList();
    }

    return this.storyList;
  }

  public getStoryProfile(): StoryProfile {
    if (!this.storyProfile) {
      this.storyProfile = new StoryProfile();
    }

    return this.storyProfile;
  }

  public getChapterList(): ChapterList {
    if (!this.chapterList) {
      this.chapterList = new ChapterList();
    }

    return this.chapterList;
  }

  public getSaveListSettings(): SaveListSettings {
    if (!this.saveListSettings) {
      this.saveListSettings = new SaveListSettings();
    }

    return this.saveListSettings;
  }

  public getStoryText(): StoryText {
    if (!this.storyText) {
      this.storyText = new StoryText();
    }
    return this.storyText;
  }

  public getEnhancer(): Enhancer[] {
    // order is important for now
    return [
      this.getMenuBar(),
      this.getFollowsList(),
      this.getStoryListEnhancer(),
      this.getSaveListSettings(),
      this.getStoryProfile(),
      this.getChapterList(),
      this.getStoryText(),
    ];
  }

  public getContainer(): Container {
    return this;
  }
}
