import { Chapter as ChapterData } from "ffn-parser";
import { SmartValue } from "./SmartValue";
import { ValueContainer } from "./ValueContainer";

export class Chapter {
	public readonly storyId: number;
	public readonly id: number;
	public readonly name: string;

	public readonly words: SmartValue<number>;
	public readonly read: SmartValue<boolean>;

	constructor(storyId: number, data: ChapterData, valueManager: ValueContainer) {
		this.storyId = storyId;
		this.id = data.id;
		this.name = data.title;

		this.words = valueManager.getWordCountValue(storyId, data.id);
		this.read = valueManager.getChapterReadValue(storyId, data.id);
	}
}
