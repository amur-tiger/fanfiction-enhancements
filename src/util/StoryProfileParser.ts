import { StoryMetaData } from "../enhance/StoryMetaData";

export default class StoryProfileParser {
	public parse(element: HTMLElement): StoryMetaData {
		let offset = 0;
		const icon = element.children[0].firstChild;
		if (icon.nodeName !== "IMG") {
			offset--;
		}

		const titleElement = element.children[offset + 2] as HTMLElement;
		const authorElement = element.children[offset + 4] as HTMLAnchorElement;
		const descriptionElement = element.children[offset + 7] as HTMLElement;
		const tagsElement = element.children[offset + 8] as HTMLElement;

		const result = this.parseTags(tagsElement);
		result.title = titleElement.textContent;
		result.author = {
			id: +authorElement.href.match(/\/u\/(\d+)\//i)[1],
			name: authorElement.textContent,
		};
		result.description = descriptionElement.textContent;
		result.imageUrl = icon.nodeName === "IMG" ? (icon as HTMLImageElement).src : undefined;

		return result;
	}

	private parseTags(tagsElement: HTMLElement): StoryMetaData {
		const result: StoryMetaData = {};

		const tagsArray = tagsElement.innerHTML.split(" - ");
		const tempElement = document.createElement("div");

		tempElement.innerHTML = tagsArray[0].trim().substring(7).replace(/>.*?\s+(.*?)</, ">$1<");
		result.rating = (tempElement.firstElementChild as HTMLElement).textContent;

		result.language = tagsArray[1].trim();
		result.genre = tagsArray[2].trim();

		for (let i = 3; i < tagsArray.length; i++) {
			const tagNameMatch = tagsArray[i].match(/^(\w+):/);
			if (!tagNameMatch) {
				result.characters = tagsArray[i].trim().split(/,\s+/);
				continue;
			}

			const tagName = tagNameMatch[1].toLowerCase();
			const tagValue = tagsArray[i].match(/^.*?:\s+(.*?)\s*$/)[1];

			switch (tagName) {
				case "characters":
					result.characters = tagsArray[i].trim().split(/,\s+/);
					break;
				case "reviews":
					tempElement.innerHTML = tagValue;
					result.reviews = +(tempElement.firstElementChild as HTMLElement).textContent;
					break;
				case "published":
				case "updated":
					tempElement.innerHTML = tagValue;
					result[tagName] = new Date(+tempElement.firstElementChild.getAttribute("data-xutime") * 1000);
					result[tagName + "Words"] = tempElement.firstElementChild.textContent;
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
}
