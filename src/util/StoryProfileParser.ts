import Chapter from "../api/data/Chapter";
import Story from "../api/data/Story";
import StoryMetaData from "../api/data/StoryMetaData";

export default class StoryProfileParser {
	public parse(profile: Element, chapters: ParentNode): Story {
		if (!profile) {
			throw new Error("Profile node must be defined.");
		}

		if (!chapters) {
			throw new Error("Chapters must be defined.");
		}

		const story = this.parseProfile(profile);
		story.chapters = this.parseChapters(chapters);

		return story;
	}

	private parseProfile(profileElement: Element): Story {
		let offset = 0;
		const icon = profileElement.children[0].firstElementChild;
		if (!icon || icon.nodeName !== "IMG") {
			offset--;
		}

		const titleElement = profileElement.children[offset + 2];
		const authorElement = profileElement.children[offset + 4] as HTMLAnchorElement;
		const descriptionElement = profileElement.children[offset + 7];
		const tagsElement = profileElement.children[offset + 8];

		const resultMeta = this.parseTags(tagsElement);
		resultMeta.imageUrl = icon && icon.nodeName === "IMG" ? (icon as HTMLImageElement).src : undefined;

		return {
			id: resultMeta.id,
			title: titleElement.textContent,
			author: {
				id: +authorElement.href.match(/\/u\/(\d+)\//i)[1],
				name: authorElement.textContent,
				profileUrl: authorElement.href,
				avatarUrl: undefined,
			},
			description: descriptionElement.textContent,
			chapters: undefined,
			meta: resultMeta,
		};
	}

	private parseTags(tagsElement: Element): StoryMetaData {
		const result: StoryMetaData = {};

		const tagsArray = tagsElement.innerHTML.split(" - ");
		const tempElement = document.createElement("div");

		tempElement.innerHTML = tagsArray[0].trim().substring(7).replace(/>.*?\s+(.*?)</, ">$1<");
		result.rating = (tempElement.firstElementChild as HTMLElement).textContent;

		result.language = tagsArray[1].trim();
		result.genre = tagsArray[2].trim().split("/");

		for (let i = 3; i < tagsArray.length; i++) {
			const tagNameMatch = tagsArray[i].match(/^(\w+):/);
			if (!tagNameMatch) {
				result.characters = tagsArray[i].trim().split(/,\s+/);
				continue;
			}

			const tagName = tagNameMatch[1].toLowerCase();
			const tagValue = tagsArray[i].match(/^.*?:\s+([^]*?)\s*$/)[1];

			switch (tagName) {
				case "characters":
					result.characters = tagsArray[i].trim().split(/,\s+/);
					break;
				case "reviews":
					tempElement.innerHTML = tagValue;
					result.reviews = +(tempElement.firstElementChild as HTMLElement).textContent.replace(/,/g, "");
					break;
				case "published":
				case "updated":
					tempElement.innerHTML = tagValue;
					result[tagName] = new Date(+tempElement.firstElementChild.getAttribute("data-xutime") * 1000);
					result[tagName + "Words"] = tempElement.firstElementChild.textContent.trim();
					break;
				default:
					if (/^[0-9,.]*$/.test(tagValue)) {
						result[tagName] = +tagValue.replace(/,/g, "");
					} else {
						result[tagName] = tagValue;
					}
					break;
			}
		}

		return result;
	}

	private parseChapters(selectElement: ParentNode): Chapter[] {
		const result: Chapter[] = [];

		for (let i = 0; i < selectElement.children.length; i++) {
			const option = selectElement.children[i];
			if (option.tagName !== "OPTION") {
				continue;
			}

			const chapter: Chapter = {
				id: +option.getAttribute("value"),
				name: option.textContent,
			};

			result.push(chapter);
		}

		return result;
	}
}
