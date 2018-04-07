import { Chapter } from "./Chapter";
import { StoryMetaData } from "./StoryMetaData";
import { User } from "./User";

export interface Story {
	id: number;
	title: string;
	author: User;
	description?: string;

	chapters: Chapter[];
	meta: StoryMetaData;
}
