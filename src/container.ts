import { Api } from "./api/api";
import { Cache } from "./api/cache";
import { ChapterList } from "./enhance/ChapterList";
import { FollowsList } from "./enhance/FollowsList";
import { MenuBar } from "./enhance/MenuBar";
import { StoryCard } from "./enhance/component/StoryCard";
import { StoryProfile } from "./enhance/StoryProfile";
import { ValueContainer } from "./api/ValueContainer";

export class Container {
	private api: Api;
	private cache: Cache;
	private valueManager: ValueContainer;
	private menuBar: MenuBar;
	private followsList: FollowsList;
	private storyProfile: StoryProfile;
	private chapterList: ChapterList;
	private storyCard: StoryCard;

	public getApi(): Api {
		return this.api || (this.api = new Api());
	}

	public getCache(): Cache {
		return this.cache || (this.cache = new Cache(this.getStorage()));
	}

	public getValueContainer(): ValueContainer {
		return this.valueManager || (this.valueManager = new ValueContainer(this.getStorage(), this.getApi()));
	}

	public getMenuBar(): MenuBar {
		return this.menuBar || (this.menuBar = new MenuBar());
	}

	public getFollowsList(): FollowsList {
		return this.followsList || (this.followsList = new FollowsList(this.getValueContainer()));
	}

	public getStoryProfile(): StoryProfile {
		return this.storyProfile || (this.storyProfile = new StoryProfile(this.getContainer(), this.getValueContainer()));
	}

	public getChapterList(): ChapterList {
		return this.chapterList || (this.chapterList = new ChapterList(this.getValueContainer()));
	}

	public getStoryCard(): StoryCard {
		return this.storyCard || (this.storyCard = new StoryCard(this.getValueContainer()));
	}

	public getContainer(): Container {
		return this;
	}

	public getStorage(): Storage {
		return localStorage;
	}
}
