import { FollowedStory, StoryMetaData } from "../api/data";
import { environment } from "./environment";
import { ChapterData } from "../api/Chapter";
import { StoryData } from "../api/Story";

export function parseProfile(fragment: string | Document | DocumentFragment): StoryData {
	const container = typeof fragment === "string" ? (() => {
		const template = document.createElement("template");
		template.innerHTML = fragment;

		return template.content;
	})() : fragment;

	const profileElement = container.getElementById("profile_top");
	const chapterElement = container.getElementById("chap_select");
	const breadCrumbElement = container.getElementById("pre_story_links");

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

	const universeLink = breadCrumbElement.querySelector("span :last-child") as HTMLAnchorElement;
	const universes = universeLink.href.includes("Crossovers") ?
		universeLink.textContent.split(/\s+\+\s+/) : [universeLink.textContent];

	resultMeta.title = titleElement.textContent.trim();
	resultMeta.author = authorElement.textContent.trim();
	resultMeta.authorId = +authorElement.href.match(/\/u\/(\d+)\//i)[1];
	resultMeta.description = descriptionElement.textContent.trim();
	resultMeta.chapters = chapterElement ? parseChapters(resultMeta.id, chapterElement) : [{
		storyId: resultMeta.id,
		id: 1,
		name: titleElement.textContent.trim(),
	}];
	resultMeta.universes = universes;

	return resultMeta;
}

export function parseZListItem(container: HTMLElement): StoryData {
	const titleElement = container.querySelector(".stitle") as HTMLAnchorElement;
	const authorElement = container.querySelector("a[href^=\"/u/\"]") as HTMLAnchorElement;
	const descriptionElement = container.querySelector(".z-indent");
	const tagsElement = container.querySelector(".z-padtop2");

	const resultMeta = parseTags(tagsElement);

	// will probably get placeholder as cover as well
	const cover = titleElement.querySelector("img") as HTMLImageElement;
	if (cover) {
		resultMeta.imageUrl = cover.dataset.original ? cover.dataset.original : cover.src;
	}

	resultMeta.id = +titleElement.href.match(/\/s\/(\d+)\//i)[1];
	resultMeta.title = titleElement.textContent.trim();
	resultMeta.author = authorElement.textContent.trim();
	resultMeta.authorId = +authorElement.href.match(/\/u\/(\d+)\//i)[1];
	resultMeta.description = Array.from(descriptionElement.childNodes)
		.find(node => node.nodeName === "#text").nodeValue.trim();

	return resultMeta;
}

function parseTags(tagsElement: Element): StoryData {
	const result: StoryData = {
		genre: [],
		characters: [],
	};

	const tagsArray = tagsElement.innerHTML.split(/\s+-\s+/);
	const tempElement = document.createElement("div");

	if (tagsArray[0] === "Crossover") {
		tagsArray.shift();
		const universes = tagsArray.shift();
		result.universes = universes.split(/\s+(?:&|&amp;)\s+/).map(u => u.trim());
	}

	if (tagsArray[1].startsWith("Rated:")) {
		result.universes = [tagsArray.shift().trim()];
	}

	tempElement.innerHTML = tagsArray[0].trim().substring(7).replace(/>.*?\s+(.*?)</, ">$1<");
	result.rating = tempElement.firstElementChild ?
		(tempElement.firstElementChild as HTMLElement).textContent : tempElement.textContent;

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
			if (tagsArray[i] === "Complete") {
				result.status = tagsArray[i];
			} else {
				result.characters = parseCharacters(tagsArray[i]);
			}

			continue;
		}

		const tagName = tagNameMatch[1].toLowerCase();
		const tagValue = tagsArray[i].match(/^.*?:\s+([^]*?)\s*$/)[1];

		switch (tagName) {
			case "favs":
				result.favorites = +tagValue.replace(/,/g, "");
				break;
			case "reviews":
				tempElement.innerHTML = tagValue;
				result.reviews = tempElement.firstElementChild ?
					+(tempElement.firstElementChild as HTMLElement).textContent.replace(/,/g, "") : +tempElement.textContent;
				break;
			case "published":
			case "updated":
				tempElement.innerHTML = tagValue;
				result[tagName] = new Date(+tempElement.firstElementChild.getAttribute("data-xutime") * 1000).toISOString();
				break;
			case "chapters":
				// get chapter count via story.chapters.length instead
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
function parseChapters(storyId: number, selectElement: ParentNode): ChapterData[] {
	const result: ChapterData[] = [];

	for (let i = 0; i < selectElement.children.length; i++) {
		const option = selectElement.children[i];
		if (option.tagName !== "OPTION") {
			continue;
		}

		result.push({
			storyId: storyId,
			id: +option.getAttribute("value"),
			name: option.textContent,
		});
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

export function parseStoryList(fragment: string | Document | DocumentFragment):
	(FollowedStory & { row: HTMLElement })[] {
	const container = typeof fragment === "string" ? (() => {
		const template = document.createElement("template");
		template.innerHTML = fragment;

		return template.content;
	})() : fragment;

	const rows = container.querySelectorAll(".z-list") as NodeListOf<HTMLDivElement>;

	return Array.from(rows)
		.map((row: HTMLDivElement) => {
			const storyAnchor = row.firstElementChild as HTMLAnchorElement;
			const authorAnchor = row.querySelector("a[href^=\"/u/\"]") as HTMLAnchorElement;

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
