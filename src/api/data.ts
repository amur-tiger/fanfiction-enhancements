export interface Identifiable {
	id: number;
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

/**
 * @deprecated
 */
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

/**
 * @deprecated
 */
export interface User {
	id: number;
	name: string;
	profileUrl: string;
	avatarUrl: string;
}
