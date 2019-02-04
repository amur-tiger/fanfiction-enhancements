import { SmartValue } from "./SmartValue";
import { ValueContainer } from "./ValueContainer";

export interface ChapterData {
	storyId: number;
	id: number;
	name: string;
}

export class Chapter {
	public readonly storyId: number;
	public readonly id: number;
	public readonly name: string;

	public readonly words: SmartValue<number>;
	public readonly read: SmartValue<boolean>;

	constructor(data: ChapterData, valueManager: ValueContainer) {
		this.storyId = data.storyId;
		this.id = data.id;
		this.name = data.name;

		this.words = valueManager.getWordCountValue(data.storyId, data.id);
		this.read = valueManager.getChapterReadValue(data.storyId, data.id);
	}
}
