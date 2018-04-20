declare function GM_getValue(key: string, def?: string | number | boolean): string | number | boolean;
declare function GM_setValue(key: string, value: string | number | boolean): void;
declare function GM_deleteValue(key: string): void;

export class Chapter {
	private readonly readKey: string;

	constructor(private readonly storyId: number, public readonly id: number, public readonly name: string) {
		this.readKey = "ffe-story-" + storyId + "-chapter-" + id + "-read";
	}

	get read(): boolean {
		return !!GM_getValue(this.readKey);
	}

	set read(value: boolean) {
		if (value) {
			GM_setValue(this.readKey, true);
		} else {
			GM_deleteValue(this.readKey);
		}
	}
}

export interface Comment {
	user: User;
	date: Date;
	text: string;
}

export interface FollowedStory {
	id: number;
	title: string;
	author: User;
}

export class Story {
	constructor(public readonly id: number,
		public readonly title: string,
		public readonly author: User,
		public readonly description: string,
		public readonly chapters: Chapter[],
		public readonly meta: StoryMetaData) {

		if (chapters.length === 0) {
			throw new Error("A story must have at least one chapter.");
		}
	}

	get read(): boolean {
		for (const chapter of this.chapters) {
			if (!chapter.read) {
				return false;
			}
		}

		return true;
	}

	set read(value: boolean) {
		for (const chapter of this.chapters) {
			chapter.read = value;
		}
	}
}

export interface StoryMetaData {
	id?: number;
	imageUrl?: string;
	imageOriginalUrl?: string;
	favs?: number;
	follows?: number;
	reviews?: number;
	genre?: string[];
	language?: string;
	published?: Date;
	publishedWords?: string;
	updated?: Date;
	updatedWords?: string;
	rating?: string;
	words?: number;
	characters?: (string | string[])[];
	status?: string;
}

export interface User {
	id: number;
	name: string;
	profileUrl: string;
	avatarUrl: string;
}
