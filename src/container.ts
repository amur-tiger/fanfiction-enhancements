import { DropBox } from "./api/DropBox";
import MenuBar from "./enhance/MenuBar";
import FollowsList from "./enhance/FollowsList";
import StoryList from "./enhance/StoryList";
import StoryProfile from "./enhance/StoryProfile";
import ChapterList from "./enhance/ChapterList";
import SaveListSettings from "./enhance/SaveListSettings";

export default class Container {
  private menuBar?: MenuBar;

  private followsList?: FollowsList;

  private storyList?: StoryList;

  private storyProfile?: StoryProfile;

  private chapterList?: ChapterList;

  private saveListSettings?: SaveListSettings;

  private dropBox?: DropBox;

  public getMenuBar(): MenuBar {
    if (!this.menuBar) {
      this.menuBar = new MenuBar(this.getDropBox());
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

  public getDropBox(): DropBox {
    if (!this.dropBox) {
      this.dropBox = new DropBox();
    }

    return this.dropBox;
  }

  public getContainer(): Container {
    return this;
  }
}
