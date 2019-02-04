import { Chapter, FollowedStory, Story, StoryMetaData } from "../api/data";
import { environment } from "./environment";
import { StoryData } from "../api/Story";

export function parseProfile(fragment: string | Document | DocumentFragment): Story {
	const container = typeof fragment === "string" ? (() => {
		const template = document.createElement("template");
		template.innerHTML = fragment;

		return template.content;
	})() : fragment;

	const profileElement = container.getElementById("profile_top");
	const chapterElement = container.getElementById("chap_select");

	if (!profileElement) {
		console.error("Profile node not found. Cannot parse story info.");

		return undefined;
	}

	let offset = 0;
	const cover = profileElement.children[0].firstElementChild;
	if (!cover || cover.nodeName !== "IMG") {
		offset--;
	}

	const titleElement = profileElement.children[offset + 2];
	const authorElement = profileElement.children[offset + 4] as HTMLAnchorElement;
	const descriptionElement = profileElement.children[offset + 7];
	const tagsElement = profileElement.children[offset + 8];

	const resultMeta = parseTags(tagsElement);
	if (cover && cover.nodeName === "IMG") {
		resultMeta.imageUrl = (cover as HTMLImageElement).src;
		const oImage = document && document.querySelector("#img_large img");
		if (oImage && oImage.nodeName === "IMG") {
			resultMeta.imageOriginalUrl = oImage.getAttribute("data-original");
		}
	}

	return new Story(
		resultMeta.id,
		titleElement.textContent,
		{
			id: +authorElement.href.match(/\/u\/(\d+)\//i)[1],
			name: authorElement.textContent,
			profileUrl: authorElement.href,
			avatarUrl: undefined,
		},
		descriptionElement.textContent,
		chapterElement ? parseChapters(resultMeta.id, chapterElement) : [
			new Chapter(resultMeta.id, 1, titleElement.textContent,
				container.getElementById("storytext").textContent.trim().split(/\s+/).length),
		],
		resultMeta,
	);
}

export function parseProfile2(fragment: string | Document | DocumentFragment): StoryData {
	const story = parseProfile(fragment);

	return {
		id: story.id,
		title: story.title,
		author: story.author.name,
		authorId: story.author.id,
		description: story.description,
		chapters: story.chapters.map(chapter => {
			return {
				storyId: story.id,
				id: chapter.id,
				name: chapter.name,
			};
		}),
		imageUrl: story.meta.imageUrl,
		imageOriginalUrl: story.meta.imageOriginalUrl,
		favs: story.meta.favs,
		follows: story.meta.follows,
		reviews: story.meta.reviews,
		genre: story.meta.genre,
		language: story.meta.language,
		published: story.meta.published ? story.meta.published.toISOString() : undefined,
		updated: story.meta.updated ? story.meta.updated.toISOString() : undefined,
		rating: story.meta.rating,
		words: story.meta.words,
		characters: story.meta.characters,
		status: story.meta.status,
	};
}

function parseTags(tagsElement: Element): StoryMetaData {
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

	// Some stories might not have a genre tagged. If so, index 2 should be the characters instead.
	if (result.genre.some(g => !environment.validGenres.includes(g))) {
		result.genre = [];
		result.characters = parseCharacters(tagsArray[2]);
	}

	for (let i = 3; i < tagsArray.length; i++) {
		const tagNameMatch = tagsArray[i].match(/^(\w+):/);
		if (!tagNameMatch) {
			result.characters = parseCharacters(tagsArray[i]);
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

function parseCharacters(tag: string): (string | string[])[] {
	const result = [];
	const pairings = tag.trim().split(/([\[\]])\s*/).filter(pairing => pairing.length);
	let inPairing = false;

	for (const pairing of pairings) {
		if (pairing == "[") {
			inPairing = true;
			continue;
		}

		if (pairing == "]") {
			inPairing = false;
			continue;
		}

		const characters = pairing.split(/,\s+/);
		if (!inPairing || characters.length == 1) {
			result.push(...characters);
		} else {
			result.push(characters);
		}
	}

	return result;
}

/**
 * Parses chapters of the currently opened story. Warning: chapter word counts will not be set!
 *
 * @param {number} storyId
 * @param {ParentNode} selectElement
 * @returns {Chapter[]}
 */
function parseChapters(storyId: number, selectElement: ParentNode): Chapter[] {
	const result: Chapter[] = [];

	for (let i = 0; i < selectElement.children.length; i++) {
		const option = selectElement.children[i];
		if (option.tagName !== "OPTION") {
			continue;
		}

		result.push(new Chapter(storyId, +option.getAttribute("value"), option.textContent, undefined));
	}

	return result;
}

export function parseFollowedStoryList(fragment: string | Document | DocumentFragment):
	(FollowedStory & { row: HTMLTableRowElement })[] {
	const container = typeof fragment === "string" ? (() => {
		const template = document.createElement("template");
		template.innerHTML = fragment;

		return template.content;
	})() : fragment;

	const rows = container.querySelectorAll("#gui_table1i tbody tr") as NodeListOf<HTMLTableRowElement>;

	return Array.from(rows)
		.filter(row => {
			return (row.firstElementChild as HTMLTableCellElement).colSpan === 1;
		})
		.map(row => {
			const storyAnchor = row.children[0].firstElementChild as HTMLAnchorElement;
			const authorAnchor = row.children[1].firstElementChild as HTMLAnchorElement;

			return {
				row: row,
				id: +storyAnchor.href.match(/\/s\/(\d+)\/.*/i)[1],
				title: storyAnchor.textContent,
				author: {
					id: +authorAnchor.href.match(/\/u\/(\d+)\/.*/i)[1],
					name: authorAnchor.textContent,
					profileUrl: authorAnchor.href,
					avatarUrl: "",
				},
			};
		});
}
