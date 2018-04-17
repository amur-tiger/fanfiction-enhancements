import { FollowedStory, Story } from "./data";
import { StoryProfileParser } from "../util/StoryProfileParser";

declare const userid: number;

const BASE_URL = "https://www.fanfiction.net";

function urlencoded(obj: any): string {
	const result = [];
	for (const key of Object.keys(obj)) {
		result.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
	}

	return result.join("&");
}

function ajaxCall(url: string, method: string, body: any, options?: any): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.addEventListener("load", () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				resolve(xhr.response);
			} else {
				reject(xhr.response);
			}
		});
		xhr.addEventListener("error", () => {
			reject(xhr.response);
		});
		xhr.open(method, url, true);
		let content = body;
		if (options) {
			if (options.headers) {
				Object.keys(options.headers).forEach(key => {
					xhr.setRequestHeader(key, options.headers[key]);
				});
			}

			if ((!options.headers || !options.headers["content-type"]) && options.type) {
				switch (options.type) {
					case "json":
						xhr.setRequestHeader("content-type", "application/json; encoding=utf-8");
						content = JSON.stringify(content);
						break;
					case "urlencoded":
						xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded; encoding=utf8");
						content = urlencoded(content);
						break;
				}
			}
		}
		if (content) {
			xhr.send(content);
		} else {
			xhr.send();
		}
	});
}

/**
 * Follows the story with the given id.
 * @param storyid
 */
export function followStory(storyid: number): Promise<any> {
	return ajaxCall(BASE_URL + "/api/ajax_subs.php", "POST", {
		storyid: storyid,
		userid: userid,
		storyalert: 1,
	}, {
		type: "urlencoded",
	}).then(data => {
		return JSON.parse(data);
	});
}

/**
 * Stops following the story with the given id.
 * @param storyid
 */
export function unFollowStory(storyid: number): Promise<any> {
	return ajaxCall(BASE_URL + "/alert/story.php", "POST", {
		action: "remove-multi",
		"rids[]": storyid,
	}, {
		type: "urlencoded",
	});
}

/**
 * Favorites the story with the given id.
 * @param storyid
 */
export function favoriteStory(storyid: number): Promise<any> {
	return ajaxCall(BASE_URL + "/api/ajax_subs.php", "POST", {
		storyid: storyid,
		userid: userid,
		favstory: 1,
	}, {
		type: "urlencoded",
	}).then(data => {
		return JSON.parse(data);
	});
}

/**
 * Removes the story with the given id from favorites.
 * @param storyid
 */
export function unFavoriteStory(storyid: number): Promise<any> {
	return ajaxCall(BASE_URL + "/favorites/story.php", "POST", {
		action: "remove-multi",
		"rids[]": storyid,
	}, {
		type: "urlencoded",
	});
}

function parseFollowedStoryList(body): FollowedStory[] {
	const template = document.createElement("template");
	template.innerHTML = body;

	const rows = template.content.querySelectorAll("#gui_table1i tbody tr");

	return Array.from(rows).map((row: HTMLTableRowElement) => {
		if ((row.firstElementChild as HTMLTableCellElement).colSpan > 1) {
			return undefined;
		}

		const storyAnchor = row.children[0].firstElementChild as HTMLAnchorElement;
		const authorAnchor = row.children[1].firstElementChild as HTMLAnchorElement;

		return {
			id: +storyAnchor.href.match(/\/s\/(\d+)\/.*/i)[1],
			title: storyAnchor.textContent,
			author: {
				id: +authorAnchor.href.match(/\/u\/(\d+)\/.*/i)[1],
				name: authorAnchor.textContent,
				profileUrl: authorAnchor.href,
				avatarUrl: "",
			},
		};
	}).filter(story => story);
}

export function getFollowedStories(): Promise<FollowedStory[]> {
	return ajaxCall(BASE_URL + "/alert/story.php", "GET", undefined)
		.then(parseFollowedStoryList);
}

export function getFavoritedStories(): Promise<FollowedStory[]> {
	return ajaxCall(BASE_URL + "/favorites/story.php", "GET", undefined)
		.then(parseFollowedStoryList);
}

/**
 * Returns information about the story with the given id.
 * @param storyid
 */
export function getStoryInfo(storyid: number): Promise<Story> {
	return ajaxCall(BASE_URL + "/s/" + storyid, "GET", undefined)
		.then(body => {
			const parser = new StoryProfileParser();
			const template = document.createElement("template");
			template.innerHTML = body;

			const profile = template.content.getElementById("profile_top");
			const chapters = template.content.getElementById("chap_select");

			if (!profile) {
				throw new Error("Story " + storyid + " does not exist.");
			}

			return parser.parse(profile, chapters);
		});
}

/*export function getComments(storyId: number): Promise<Comment[]> {
	// fetch all comment pages, not just the first!
	// to do that, fetch first and find out how many there are
	// url is /r/<storyId>/<chapterId>/<pageNumber>/
	// warning: trailing slash is mandatory!
}*/
