import { SmartValue } from "./SmartValue";
import { StoryData } from "./Story";
import { ValueContainer } from "./ValueContainer";

export interface ChapterData {
	story: StoryData;
	id: number;
	name: string;
	words: number;
}

export class Chapter {
	public readonly storyId: number;
	public readonly id: number;
	public readonly name: string;
	public readonly words: number;

	public readonly read: SmartValue<boolean>;

	constructor(data: ChapterData, valueManager: ValueContainer) {
		this.storyId = data.story.id;
		this.id = data.id;
		this.name = data.name;
		this.words = data.words;

		this.read = valueManager.getChapterReadValue(data.story.id, data.id);
	}
}
