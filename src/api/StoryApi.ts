import { Story } from "./data";
import { getByAjax } from "../utils";
import { StoryProfileParser } from "../util/StoryProfileParser";

const BASE_URL = "https://www.fanfiction.net";

export class StoryApi {
	public static getByAjax(url: string, options?): Promise<string> {
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
			xhr.open("GET", url, true);
			if (options && options.headers) {
				Object.keys(options.headers).forEach(key => {
					xhr.setRequestHeader(key, options.headers[key]);
				});
			}
			xhr.send();
		});
	}

	public static getStoryInfo(id: number): Promise<Story> {
		return getByAjax(BASE_URL + "/s/" + id)
			.then(body => {
				const parser = new StoryProfileParser();
				const template = document.createElement("template");
				template.innerHTML = body;

				const profile = template.content.getElementById("profile_top");
				const chapters = template.content.getElementById("chap_select");

				if (!profile || !chapters) {
					throw new Error("Story " + id + " does not exist.");
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
}
