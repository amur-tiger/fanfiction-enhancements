import { Chapter, Story, StoryMetaData } from "../api/data";

export class StoryProfileParser {
	private readonly validGenres = [
		"Adventure",
		"Angst",
		"Crime",
		"Drama",
		"Family",
		"Fantasy",
		"Friendship",
		"General",
		"Horror",
		"Humor",
		"Hurt/Comfort",
		"Mystery",
		"Parody",
		"Poetry",
		"Romance",
		"Sci-Fi",
		"Spiritual",
		"Supernatural",
		"Suspense",
		"Tragedy",
		"Western",
	];

	public parse(profile: Element, chapters: ParentNode): Story {
		if (!profile) {
			console.error("Profile node not found. Cannot parse story info.");

			return undefined;
		}

		const story = this.parseProfile(profile);

		if (chapters) {
			story.chapters = this.parseChapters(story, chapters);
		} else {
			story.chapters = [new Chapter(story, 1, story.title)];
		}

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
		const result: StoryMetaData = {
			genre: [],
			characters: [],
		};

		const tagsArray = tagsElement.innerHTML.split(" - ");
		const tempElement = document.createElement("div");

		tempElement.innerHTML = tagsArray[0].trim().substring(7).replace(/>.*?\s+(.*?)</, ">$1<");
		result.rating = (tempElement.firstElementChild as HTMLElement).textContent;

		result.language = tagsArray[1].trim();
		result.genre = tagsArray[2].trim().split("/");

		// Some genres might not have a genre tagged. If so, index 2 should be the characters instead.
		if (result.genre.some(g => !this.validGenres.includes(g))) {
			result.genre = [];
			result.characters = this.parseCharacters(tagsArray[2]);
		}

		for (let i = 3; i < tagsArray.length; i++) {
			const tagNameMatch = tagsArray[i].match(/^(\w+):/);
			if (!tagNameMatch) {
				result.characters = this.parseCharacters(tagsArray[i]);
				continue;
			}

			const tagName = tagNameMatch[1].toLowerCase();
			const tagValue = tagsArray[i].match(/^.*?:\s+([^]*?)\s*$/)[1];

			switch (tagName) {
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

	private parseCharacters(tag: string): (string | string[])[] {
		const result = [];
		const ships = tag.trim().split(/([\[\]])\s*/).filter(ship => ship.length);
		let inShip = false;

		for (const ship of ships) {
			if (ship == "[") {
				inShip = true;
				continue;
			}

			if (ship == "]") {
				inShip = false;
				continue;
			}

			const characters = ship.split(/,\s+/);
			if (!inShip || characters.length == 1) {
				result.push(...characters);
			} else {
				result.push(characters);
			}
		}

		return result;
	}

	private parseChapters(story: Story, selectElement: ParentNode): Chapter[] {
		const result: Chapter[] = [];

		for (let i = 0; i < selectElement.children.length; i++) {
			const option = selectElement.children[i];
			if (option.tagName !== "OPTION") {
				continue;
			}

			result.push(new Chapter(story, +option.getAttribute("value"), option.textContent));
		}

		return result;
	}
}

let currentStory: Story = undefined;
export function getCurrentStory(): Story {
	if (!currentStory) {
		currentStory = new StoryProfileParser()
			.parse(document.getElementById("profile_top"), document.getElementById("chap_select"));
	}

	return currentStory;
}
