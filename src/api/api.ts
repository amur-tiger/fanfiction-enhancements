import { FollowedStory, Story } from "./data";
import { environment } from "../util/environment";
import { StoryProfileParser } from "../util/parser";

const BASE_URL = "https://www.fanfiction.net";
const CACHE_FOLLOWS_KEY = "ffe-api-follows";
const CACHE_FAVORITES_KEY = "ffe-api-favorites";

const cache = {
	get follows(): FollowedStory[] {
		const value = localStorage.getItem(CACHE_FOLLOWS_KEY);

		return value && JSON.parse(value);
	},

	set follows(value: FollowedStory[]) {
		localStorage.setItem(CACHE_FOLLOWS_KEY, JSON.stringify(value));
	},

	addFollow: (story: FollowedStory) => {
		const value = localStorage.getItem(CACHE_FOLLOWS_KEY);
		const list = (value && JSON.parse(value)) as FollowedStory[];
		if (list && list.every(f => f.id !== story.id)) {
			list.push(story);
			localStorage.setItem(CACHE_FOLLOWS_KEY, JSON.stringify(list));
		}
	},

	removeFollow: (story: FollowedStory) => {
		const value = localStorage.getItem(CACHE_FOLLOWS_KEY);
		let list = (value && JSON.parse(value)) as FollowedStory[];
		if (list) {
			list = list.filter(f => f.id !== story.id);
			localStorage.setItem(CACHE_FOLLOWS_KEY, JSON.stringify(list));
		}
	},

	get favorites(): FollowedStory[] {
		const value = localStorage.getItem(CACHE_FAVORITES_KEY);

		return value && JSON.parse(value);
	},

	set favorites(value: FollowedStory[]) {
		localStorage.setItem(CACHE_FAVORITES_KEY, JSON.stringify(value));
	},

	addFavorite: (story: FollowedStory) => {
		const value = localStorage.getItem(CACHE_FAVORITES_KEY);
		const list = (value && JSON.parse(value)) as FollowedStory[];
		if (list && list.every(f => f.id !== story.id)) {
			list.push(story);
			localStorage.setItem(CACHE_FAVORITES_KEY, JSON.stringify(list));
		}
	},

	removeFavorite: (story: FollowedStory) => {
		const value = localStorage.getItem(CACHE_FAVORITES_KEY);
		let list = (value && JSON.parse(value)) as FollowedStory[];
		if (list) {
			list = list.filter(f => f.id !== story.id);
			localStorage.setItem(CACHE_FAVORITES_KEY, JSON.stringify(list));
		}
	},
};

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
export function followStory(story: Story): Promise<any> {
	return ajaxCall(BASE_URL + "/api/ajax_subs.php", "POST", {
		storyid: story.id,
		userid: environment.currentUserId,
		storyalert: 1,
	}, {
		type: "urlencoded",
	}).then(data => {
		cache.addFollow({
			id: story.id,
			title: story.title,
			author: story.author,
		});

		return JSON.parse(data);
	});
}

/**
 * Stops following the story with the given id.
 * @param storyid
 */
export function unFollowStory(story: Story): Promise<any> {
	return ajaxCall(BASE_URL + "/alert/story.php", "POST", {
		action: "remove-multi",
		"rids[]": story.id,
	}, {
		type: "urlencoded",
	}).then(data => {
		cache.removeFollow({
			id: story.id,
			title: story.title,
			author: story.author,
		});

		return data;
	});
}

/**
 * Favorites the story with the given id.
 * @param storyid
 */
export function favoriteStory(story: Story): Promise<any> {
	return ajaxCall(BASE_URL + "/api/ajax_subs.php", "POST", {
		storyid: story.id,
		userid: environment.currentUserId,
		favstory: 1,
	}, {
		type: "urlencoded",
	}).then(data => {
		cache.addFavorite({
			id: story.id,
			title: story.title,
			author: story.author,
		});

		return JSON.parse(data);
	});
}

/**
 * Removes the story with the given id from favorites.
 * @param storyid
 */
export function unFavoriteStory(story: Story): Promise<any> {
	return ajaxCall(BASE_URL + "/favorites/story.php", "POST", {
		action: "remove-multi",
		"rids[]": story.id,
	}, {
		type: "urlencoded",
	}).then(data => {
		cache.removeFavorite({
			id: story.id,
			title: story.title,
			author: story.author,
		});

		return data;
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
	const list = cache.follows;
	if (list) {
		return Promise.resolve(list);
	}

	return ajaxCall(BASE_URL + "/alert/story.php", "GET", undefined)
		.then(parseFollowedStoryList)
		.then(fetchedList => cache.follows = fetchedList);
}

export function getFavoritedStories(): Promise<FollowedStory[]> {
	const list = cache.favorites;
	if (list) {
		return Promise.resolve(list);
	}

	return ajaxCall(BASE_URL + "/favorites/story.php", "GET", undefined)
		.then(parseFollowedStoryList)
		.then(fetchedList => cache.favorites = fetchedList);
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
