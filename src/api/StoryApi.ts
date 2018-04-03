import StoryProfileParser from "../util/StoryProfileParser";
import Chapter from "./data/Chapter";
import StoryMetaData from "./data/StoryMetaData";

const BASE_URL = "https://www.fanfiction.net";

export default class StoryApi {
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

	// public static getMetaData(storyId: number): Promise<StoryMetaData> {
	// 	return StoryApi.getByAjax(BASE_URL + "/s/" + storyId)
	// 		.then(html => {
	// 			const fragment = html.match(/<div id=profile_top(?:.*?<\/div>){3}/i);
	// 			console.log("fragment = %o", fragment);
	// 			const template = document.createElement("template");
	// 			template.innerHTML = fragment[0];
	//
	// 			const parser = new StoryProfileParser();
	//
	// 			return parser.parse(template.content);
	// 		});
	// }

	public static getChapters(storyId: number): Promise<Chapter[]> {
		return StoryApi.getByAjax(BASE_URL + "/s/" + storyId)
			.then(html => {
				const fragment = html.match(/(<select id=chap_select.*?<\/select>)/i);
				const template = document.createElement("template");
				template.innerHTML = fragment[0];

				const options = template.content.querySelectorAll("option");
				const result: Chapter[] = [];

				for (let i = 0; i < options.length; i++) {
					const option = options[i];

					const chapter: Chapter = {
						id: +option.getAttribute("value"),
						name: option.textContent,
					};

					result.push(chapter);
				}

				return result;
			});
	}

	/*export function getComments(storyId: number): Promise<Comment[]> {
		// fetch all comment pages, not just the first!
		// to do that, fetch first and find out how many there are
		// url is /r/<storyId>/<chapterId>/<pageNumber>/
		// warning: trailing slash is mandatory!
	}*/
}
