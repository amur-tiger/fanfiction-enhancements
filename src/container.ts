import { Api } from "./api/Api";
import { ChapterList } from "./enhance/ChapterList";
import { DropBox } from "./api/DropBox";
import { FollowsList } from "./enhance/FollowsList";
import { MenuBar } from "./enhance/MenuBar";
import { StoryProfile } from "./enhance/StoryProfile";
import { ValueContainer } from "./api/ValueContainer";

export class Container {
	private api: Api;
	private valueManager: ValueContainer;
	private menuBar: MenuBar;
	private followsList: FollowsList;
	private storyProfile: StoryProfile;
	private chapterList: ChapterList;
	private dropBox: DropBox;

	public getApi(): Api {
		return this.api || (this.api = new Api());
	}

	public getValueContainer(): ValueContainer {
		return this.valueManager ||
			(this.valueManager = new ValueContainer(this.getStorage(), this.getApi(), this.getDropBox()));
	}

	public getMenuBar(): MenuBar {
		return this.menuBar || (this.menuBar = new MenuBar(this.getDropBox()));
	}

	public getFollowsList(): FollowsList {
		return this.followsList || (this.followsList = new FollowsList(this.getValueContainer()));
	}

	public getStoryProfile(): StoryProfile {
		return this.storyProfile || (this.storyProfile = new StoryProfile(this.getValueContainer()));
	}

	public getChapterList(): ChapterList {
		return this.chapterList || (this.chapterList = new ChapterList(this.getValueContainer()));
	}

	public getDropBox(): DropBox {
		return this.dropBox || (this.dropBox = new DropBox());
	}

	public getContainer(): Container {
		return this;
	}

	public getStorage(): Storage {
		return localStorage;
	}
}
