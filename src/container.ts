import { DropBox } from "./api/DropBox";
import Api from "./api/Api";
import ValueContainer from "./api/ValueContainer";
import MenuBar from "./enhance/MenuBar";
import FollowsList from "./enhance/FollowsList";
import StoryList from "./enhance/StoryList";
import StoryProfile from "./enhance/StoryProfile";
import ChapterList from "./enhance/ChapterList";
import SaveListSettings from "./enhance/SaveListSettings";

export default class Container {
  private api?: Api;

  private valueManager?: ValueContainer;

  private menuBar?: MenuBar;

  private followsList?: FollowsList;

  private storyList?: StoryList;

  private storyProfile?: StoryProfile;

  private chapterList?: ChapterList;

  private saveListSettings?: SaveListSettings;

  private dropBox?: DropBox;

  public getApi(): Api {
    if (!this.api) {
      this.api = new Api();
    }

    return this.api;
  }

  public getValueContainer(): ValueContainer {
    if (!this.valueManager) {
      this.valueManager = new ValueContainer(this.getStorage(), this.getApi(), this.getDropBox());
    }

    return this.valueManager;
  }

  public getMenuBar(): MenuBar {
    if (!this.menuBar) {
      this.menuBar = new MenuBar(this.getDropBox());
    }

    return this.menuBar;
  }

  public getFollowsList(): FollowsList {
    if (!this.followsList) {
      this.followsList = new FollowsList(this.getValueContainer());
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
      this.storyProfile = new StoryProfile(this.getValueContainer());
    }

    return this.storyProfile;
  }

  public getChapterList(): ChapterList {
    if (!this.chapterList) {
      this.chapterList = new ChapterList(this.getValueContainer());
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

  public getStorage(): Storage {
    return localStorage;
  }
}
