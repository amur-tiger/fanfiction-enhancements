export default interface StoryMetaData {
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
	characters?: string[];
	status?: string;
}
