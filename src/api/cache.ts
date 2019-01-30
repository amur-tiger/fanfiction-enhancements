import { Chapter, FollowedStory, Identifiable, Story } from "./data";

export interface Map<T> {
	[key: number]: T;
}

function values(obj: any): any[] {
	return Object.keys(obj).map(key => obj[key]);
}

export class Cache {
	private static readonly FOLLOWS_LIFETIME = 86400000; // one day in milliseconds
	private static readonly STORIES_LIFETIME = 604800000; // one week in milliseconds
	private static readonly ALERTS_KEY = "ffe-cache-alerts";
	private static readonly ALERTS_LAST_SCAN_KEY = "ffe-cache-alerts-scan";
	private static readonly FAVORITES_KEY = "ffe-cache-favorites";
	private static readonly FAVORITES_LAST_SCAN_KEY = "ffe-cache-favorites-scan";
	private static readonly STORIES_KEY = "ffe-cache-stories";

	public constructor(private readonly storage: Storage) {
	}

	/**
	 * Retrieves cached story alerts. May contain stories that are actually no longer followed and may
	 * be missing stories that are actually followed.
	 *
	 * @returns {Promise<FollowedStory[]>}
	 */
	public async getAlerts(): Promise<FollowedStory[]> {
		const items = this.getMap(Cache.ALERTS_KEY, Cache.FOLLOWS_LIFETIME);

		return values(items).map(item => item.data);
	}

	/**
	 * Determines if a story is present in the cached story alerts.
	 *
	 * @param {FollowedStory | number} story
	 * @returns {Promise<boolean>}
	 */
	public async hasAlert(story: FollowedStory | number): Promise<boolean> {
		const id = (story as any).id || story;
		const items = this.getMap(Cache.ALERTS_KEY, Cache.FOLLOWS_LIFETIME);

		return items.hasOwnProperty(id);
	}

	/**
	 * Updates the alert state of a story in this cache.
	 *
	 * @param {Story} story
	 * @returns {Promise<Story>}
	 */
	public async putAlert(story: Story): Promise<void> {
		if (story.follow()) {
			this.addToMap(Cache.ALERTS_KEY, story, Cache.FOLLOWS_LIFETIME);
		} else {
			this.removeFromMap(Cache.ALERTS_KEY, story, Cache.FOLLOWS_LIFETIME);
		}
	}

	/**
	 * Checks whether the cached list of story alerts is still fresh. This helps determining whether the alerts
	 * pages of the user need scanning again. The timestamp gets reset when the alerts get replaced with the
	 * {putAlerts} method.
	 *
	 * @returns {Promise<boolean>}
	 */
	public async isAlertsFresh(): Promise<boolean> {
		const timestamp = +this.storage.getItem(Cache.ALERTS_LAST_SCAN_KEY);

		return timestamp + Cache.FOLLOWS_LIFETIME > new Date().getTime();
	}

	/**
	 * Replaces all cached story alerts with the given alerts. The current timestamp is saved and determines the
	 * result of the {isAlertsFresh} method.
	 *
	 * @param {FollowedStory[]} stories
	 * @returns {Promise<FollowedStory[]>}
	 */
	public async putAlerts(stories: FollowedStory[]): Promise<void> {
		const items: Map<CacheItem<FollowedStory>> = {};
		for (const story of stories) {
			items[story.id] = {
				data: story,
				timestamp: new Date().getTime(),
			};
		}

		this.setMap(Cache.ALERTS_KEY, items);
		this.storage.setItem(Cache.ALERTS_LAST_SCAN_KEY, "" + new Date().getTime());
	}

	/**
	 * Retrieves cached story favorites. May contain stories that are actually no longer favorites and may
	 * be missing stories that are actually favorites.
	 *
	 * @returns {Promise<FollowedStory[]>}
	 */
	public async getFavorites(): Promise<FollowedStory[]> {
		const items = this.getMap(Cache.FAVORITES_KEY, Cache.FOLLOWS_LIFETIME);

		return values(items).map(item => item.data);
	}

	/**
	 * Determines if a story is present in the cached story favorites.
	 *
	 * @param {FollowedStory | number} story
	 * @returns {Promise<boolean>}
	 */
	public async isFavorite(story: FollowedStory | number): Promise<boolean> {
		const id = (story as any).id || story;
		const items = this.getMap(Cache.FAVORITES_KEY, Cache.FOLLOWS_LIFETIME);

		return items.hasOwnProperty(id);
	}

	/**
	 * Updates the favorite state of a story in this cache.
	 *
	 * @param {Story} story
	 * @returns {Promise<Story>}
	 */
	public async putFavorite(story: Story): Promise<void> {
		if (story.favorite()) {
			this.addToMap(Cache.FAVORITES_KEY, story, Cache.FOLLOWS_LIFETIME);
		} else {
			this.removeFromMap(Cache.FAVORITES_KEY, story, Cache.FOLLOWS_LIFETIME);
		}
	}

	/**
	 * Checks whether the cached list of story favorites is still fresh. This helps determining whether the favorites
	 * pages of the user need scanning again. The timestamp gets reset when the favorites get replaced with the
	 * {putFavorites} method.
	 *
	 * @returns {Promise<boolean>}
	 */
	public async isFavoritesFresh(): Promise<boolean> {
		const timestamp = +this.storage.getItem(Cache.FAVORITES_LAST_SCAN_KEY);

		return timestamp + Cache.FOLLOWS_LIFETIME > new Date().getTime();
	}

	/**
	 * Replaces all cached story favorites with the given favorites. The current timestamp is saved and determines the
	 * result of the {isFavoritesFresh} method.
	 *
	 * @param {FollowedStory[]} stories
	 * @returns {Promise<FollowedStory[]>}
	 */
	public async putFavorites(stories: FollowedStory[]): Promise<FollowedStory[]> {
		const items: Map<CacheItem<FollowedStory>> = {};
		for (const story of stories) {
			items[story.id] = {
				data: story,
				timestamp: new Date().getTime(),
			};
		}

		this.setMap(Cache.FAVORITES_KEY, items);
		this.storage.setItem(Cache.FAVORITES_LAST_SCAN_KEY, "" + new Date().getTime());

		return stories;
	}

	/**
	 * Returns a story from the cache by id. If the story does not exist in the cache, the resulting
	 * promise is rejected.
	 *
	 * @param {number} id
	 * @returns {Promise<Story>}
	 */
	public async getStory(id: number): Promise<Story> {
		const items = this.getMap(Cache.STORIES_KEY, Cache.STORIES_LIFETIME);
		if (!items.hasOwnProperty(id)) {
			throw new Error(`Story with id '${id}' does not exist in cache.`);
		}

		const protoStory = items[id].data as Story;
		const story = new Story(
			protoStory.id,
			protoStory.title,
			protoStory.author,
			protoStory.description,
			protoStory.chapters.map(c => new Chapter(protoStory.id, c.id, c.name, c.words)),
			protoStory.meta,
		);

		story.follow(protoStory.follow);
		story.favorite(protoStory.favorite);

		if (story.meta.published) {
			story.meta.published = new Date(story.meta.published);
		}

		if (story.meta.updated) {
			story.meta.updated = new Date(story.meta.updated);
		}

		return story;
	}

	/**
	 * Adds a story object to the cache. The story object will be evicted after some time.
	 *
	 * @param {Story} story
	 * @returns {Promise<Story>}
	 */
	public async putStory(story: Story): Promise<Story> {
		const cacheStory: any = {};
		const save = cached => {
			cacheStory.id = story.id;
			cacheStory.title = story.title;
			cacheStory.author = story.author;
			cacheStory.description = story.description;

			cacheStory.chapters = [];
			for (const chapter of story.chapters) {
				const cachedChapter = cached && cached.chapters.find(c => c.id === chapter.id);
				cacheStory.chapters.push({
					id: chapter.id,
					name: chapter.name,
					words: chapter.words || cachedChapter.words,
				});
			}

			cacheStory.meta = story.meta;
			cacheStory.follow = story.follow();
			cacheStory.favorite = story.favorite();

			this.addToMap(Cache.STORIES_KEY, cacheStory, Cache.STORIES_LIFETIME);
		};

		try {
			save(await this.getStory(story.id));
		} catch (e) {
			save(undefined);
		}

		return story;
	}

	private getMap<T extends Identifiable>(key: string, lifetime: number): Map<CacheItem<T>> {
		const raw = this.storage.getItem(key);
		const items: Map<CacheItem<T>> = (raw && JSON.parse(raw)) || {};

		let flush = false;
		for (const id in items) {
			if (!items.hasOwnProperty(id)) {
				continue;
			}

			if (this.isExpired(items[id], lifetime)) {
				delete items[id];
				flush = true;
			}
		}

		if (flush) {
			if (Object.keys(items).length === 0) {
				this.storage.removeItem(key);
			} else {
				this.storage.setItem(key, JSON.stringify(items));
			}
		}

		return items;
	}

	private setMap<T extends Identifiable>(key: string, data: Map<CacheItem<T>>): void {
		if (Object.keys(data).length === 0) {
			this.storage.removeItem(key);

			return;
		}

		this.storage.setItem(key, JSON.stringify(data));
	}

	private addToMap<T extends Identifiable>(key: string, data: T, lifetime: number): void {
		const items = this.getMap(key, lifetime);
		items[data.id] = {
			data: data,
			timestamp: new Date().getTime(),
		};

		this.setMap(key, items);
	}

	private removeFromMap<T extends Identifiable>(key: string, data: T, lifetime: number): void {
		const items = this.getMap(key, lifetime);
		delete items[data.id];
		this.setMap(key, items);
	}

	private isExpired<T>(item: CacheItem<T>, lifetime: number): boolean {
		return item.timestamp + lifetime < new Date().getTime();
	}
}

interface CacheItem<T> {
	data: T;
	timestamp: number;
}
