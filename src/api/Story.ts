import { User } from "./data";
import { Chapter, ChapterData } from "./Chapter";
import { SmartValue } from "./SmartValue";
import { ValueContainer } from "./ValueContainer";

export interface StoryData {
	id?: number;
	title?: string;
	author?: string;
	authorId?: number;
	description?: string;
	chapters?: ChapterData[];
	imageUrl?: string;
	imageOriginalUrl?: string;
	favorites?: number;
	follows?: number;
	reviews?: number;
	genre?: string[];
	language?: string;
	published?: string;
	updated?: string;
	rating?: string;
	words?: number;
	characters?: (string | string[])[];
	status?: string;
	universes?: string[];
}

export class Story {
	public readonly id: number;
	public readonly title: string;
	public readonly description: string;
	public readonly chapters: Chapter[];
	public readonly imageUrl: string;
	public readonly imageOriginalUrl: string;
	public readonly favorites: number;
	public readonly follows: number;
	public readonly reviews: number;
	public readonly genre: string[];
	public readonly language: string;
	public readonly published: Date;
	public readonly updated: Date;
	public readonly rating: string;
	public readonly words: number;
	public readonly characters: (string | string[])[];
	public readonly status: string;
	public readonly universes: string[];

	public readonly author: User;
	public readonly alert: SmartValue<boolean>;
	public readonly favorite: SmartValue<boolean>;

	constructor(data: StoryData, valueManager: ValueContainer) {
		this.id = data.id;
		this.title = data.title;
		this.description = data.description;
		this.chapters = data.chapters ? data.chapters.map(chapter => new Chapter(chapter, valueManager)) : undefined;
		this.imageUrl = data.imageUrl;
		this.imageOriginalUrl = data.imageOriginalUrl;
		this.favorites = data.favorites;
		this.follows = data.follows;
		this.reviews = data.reviews;
		this.genre = data.genre;
		this.language = data.language;
		this.published = data.published ? new Date(data.published) : undefined;
		this.updated = data.updated ? new Date(data.updated) : undefined;
		this.rating = data.rating;
		this.words = data.words;
		this.characters = data.characters;
		this.status = data.status;
		this.universes = data.universes;

		this.author = {
			id: data.authorId,
			name: data.author,
			profileUrl: undefined,
			avatarUrl: undefined,
		};
		this.alert = valueManager.getAlertValue(data.id);
		this.favorite = valueManager.getFavoriteValue(data.id);
	}

	public async isRead(): Promise<boolean> {
		const read = await Promise.all(this.chapters.map(chapter => chapter.read.get()));

		return read.every(r => r);
	}

	public async setRead(read: boolean): Promise<void> {
		await Promise.all(this.chapters.map(chapter => chapter.read.set(read)));
	}
}
