import { Chapter, Story } from "../api/data";

declare function GM_getValue(key: string, def?: string | number | boolean): string | number | boolean;
declare function GM_setValue(key: string, value: string | number | boolean): void;

function GM_getObject(key: string): any {
	return JSON.parse(GM_getValue(key, "{}") as string);
}

function GM_setObject(key: string, value: any): void {
	GM_setValue(key, JSON.stringify(value));
}

class Read {
	private static readonly READ_KEY = "ffe-cache-read";

	public isRead(chapter: Chapter): boolean {
		const data = GM_getObject(Read.READ_KEY);

		return !!(data[chapter.storyId] && data[chapter.storyId][chapter.id]);
	}

	public setRead(chapter: Chapter) {
		const data = GM_getObject(Read.READ_KEY);
		if (!data[chapter.storyId]) {
			data[chapter.storyId] = {};
		}

		data[chapter.storyId][chapter.id] = chapter.read();
		GM_setObject(Read.READ_KEY, data);
	}
}

class Alerts {
	private static readonly ALERTS_KEY = "ffe-cache-alerts";

	public isFollowed(story: Story): boolean {
		const data = GM_getObject(Alerts.ALERTS_KEY);

		return !!(data.follows && data.follows[story.id]);
	}

	public setFollowed(story: Story) {
		const data = GM_getObject(Alerts.ALERTS_KEY);
		if (!data.follows) {
			data.follows = {};
		}

		data.follows[story.id] = story.follow();
		GM_setObject(Alerts.ALERTS_KEY, data);
	}

	public isFavorited(story: Story): boolean {
		const data = GM_getObject(Alerts.ALERTS_KEY);

		return !!(data.favorites && data.favorites[story.id]);
	}

	public setFavorited(story: Story) {
		const data = GM_getObject(Alerts.ALERTS_KEY);
		if (!data.favorites) {
			data.favorites = {};
		}

		data.favorites[story.id] = story.favorite();
		GM_setObject(Alerts.ALERTS_KEY, data);
	}
}

export class Cache {
	public readonly read: Read = new Read();
	/**
	 * @deprecated
	 * @type {Alerts}
	 */
	public readonly alerts: Alerts = new Alerts();
}

export const cache = new Cache();
