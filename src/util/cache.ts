import { Chapter } from "../api/data";

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

export class Cache {
	public readonly read: Read = new Read();
}

export const cache = new Cache();
