export interface StoryMetaData {
	id?: number;
	title?: string;
	author?: User;
	description?: string;
	imageUrl?: string;
	chapters?: number;
	favs?: number;
	follows?: number;
	reviews?: number;
	genre?: string;
	language?: string;
	published?: Date;
	publishedWords?: string;
	updated?: Date;
	updatedWords?: string;
	rating?: string;
	words?: number;
	characters?: string[];
	status?: string;
}

export interface User {
	id: number;
	name: string;
	imageUrl?: string;
}
