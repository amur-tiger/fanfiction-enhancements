import { cache } from "../util/cache";
import { environment } from "../util/environment";
import * as ko from "knockout";

export interface Identifiable {
	id: number;
}

export class Chapter {
	public readonly read = ko.observable();

	constructor(public readonly storyId: number, public readonly id: number, public readonly name: string) {
		this.read(cache.read.isRead(this));
		this.read.subscribe(value => {
			cache.read.setRead(this);
		});
	}
}

export interface Comment {
	user: User;
	date: Date;
	text: string;
}

export interface FollowedStory extends Identifiable {
	id: number;
	title: string;
	author: User;
}

export class Story implements FollowedStory {
	public readonly follow = ko.observable();
	public readonly favorite = ko.observable();
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
	public readonly currentChapter;

	constructor(public readonly id: number,
		public readonly title: string,
		public readonly author: User,
		public readonly description: string,
		public readonly chapters: Chapter[],
		public readonly meta: StoryMetaData) {

		if (chapters.length === 0) {
			throw new Error("A story must have at least one chapter.");
		}

		if (id === environment.currentStoryId) {
			this.currentChapter = this.chapters.filter(c => c.id === environment.currentChapterId)[0];
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
