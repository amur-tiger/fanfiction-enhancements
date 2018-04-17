export interface Chapter {
	id: number;
	name: string;
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

export interface Story {
	id: number;
	title: string;
	author: User;
	description?: string;

	chapters: Chapter[];
	meta: StoryMetaData;
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
