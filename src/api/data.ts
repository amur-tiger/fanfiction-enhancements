import * as ko from "knockout";

declare function GM_getValue(key: string, def?: string | number | boolean): string | number | boolean;
declare function GM_setValue(key: string, value: string | number | boolean): void;
declare function GM_deleteValue(key: string): void;

export class Chapter {
	public readonly read = ko.observable();

	constructor(private readonly storyId: number, public readonly id: number, public readonly name: string) {
		const key = "ffe-story-" + this.storyId + "-chapter-" + this.id + "-read";

		this.read(!!GM_getValue(key));
		this.read.subscribe(value => {
			if (value) {
				GM_setValue(key, true);
			} else {
				GM_deleteValue(key);
			}
		});
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
	public readonly read = ko.pureComputed({
		read: () => {
			for (const chapter of this.chapters) {
				if (!chapter.read()) {
					return false;
				}
			}

			return true;
		},
		write: value => {
			for (const chapter of this.chapters) {
				chapter.read(value);
			}
		},
	});

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
