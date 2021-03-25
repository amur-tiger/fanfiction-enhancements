import { environment } from "../util/environment";
import { Follow, parseFollows, parseStory, Story as StoryData } from "ffn-parser";
import { parseGetParams } from "../utils";

export class Api {
	/**
	 * Retrieves all story alerts that are set on FFN for the current user.
	 */
	public async getStoryAlerts(): Promise<Follow[]> {
		const fragments = await this.getMultiPage("/alert/story.php");
		const result = [];

		await Promise.all(fragments.map(async fragment => {
			const follows = await parseFollows(fragment);
			console.debug(follows);
			if (follows) {
				result.push(...follows);
			}
		}));

		return result;
	}

	/**
	 * Retrieves all favorites that are set on FFN for the current user.
	 */
	public async getStoryFavorites(): Promise<Follow[]> {
		const fragments = await this.getMultiPage("/favorites/story.php");
		const result = [];

		await Promise.all(fragments.map(async fragment => {
			const follows = await parseFollows(fragment);
			if (follows) {
				result.push(...follows);
			}
		}));

		return result;
	}

	public async getStoryData(id: number): Promise<StoryData> {
		const body = await this.get("/s/" + id);
		const template = document.createElement("template");
		template.innerHTML = body;

		return parseStory(template.content);
	}

	public async getChapterWordCount(storyId: number, chapterId: number): Promise<number> {
		const body = await this.get("/s/" + storyId + "/" + chapterId);
		const template = document.createElement("template");
		template.innerHTML = body;

		return template.content.getElementById("storytext")
			.textContent.trim().split(/\s+/).length;
	}

	public async addStoryAlert(id: number): Promise<void> {
		await this.post("/api/ajax_subs.php", {
			storyid: id,
			userid: environment.currentUserId,
			storyalert: 1,
		}, "json");
	}

	public async removeStoryAlert(id: number): Promise<void> {
		await this.post("/alert/story.php", {
			action: "remove-multi",
			"rids[]": id,
		}, "html");
	}

	public async addStoryFavorite(id: number): Promise<void> {
		await this.post("/api/ajax_subs.php", {
			storyid: id,
			userid: environment.currentUserId,
			favstory: 1,
		}, "json");
	}

	public async removeStoryFavorite(id: number): Promise<void> {
		await this.post("/favorites/story.php", {
			action: "remove-multi",
			"rids[]": id,
		}, "html");
	}

	private async get(url: string): Promise<string> {
		console.debug("%c[Api] %cGET %c%s", "color: gray", "color: blue", "color: inherit", url);

		const response = await fetch(url);

		return response.text();
	}

	private async getMultiPage(url: string): Promise<DocumentFragment[]> {
		const body = await this.get(url);
		const template = document.createElement("template");
		template.innerHTML = body;

		const pageCenter = template.content.querySelector("#content_wrapper_inner center");
		if (!pageCenter) {
			return [template.content];
		}

		const nextLink = pageCenter.lastElementChild as HTMLAnchorElement;
		const lastLink = nextLink.previousElementSibling as HTMLAnchorElement;
		const relevantLink = lastLink && lastLink.textContent === "Last" ? lastLink : nextLink;
		const max = +parseGetParams(relevantLink.href).p;

		const result = [Promise.resolve(template.content)];
		for (let i = 2; i <= max; i++) {
			result.push(this.get(url + "?p=" + i)
				.then(nextBody => {
					const nextTemplate = document.createElement("template");
					nextTemplate.innerHTML = nextBody;

					return nextTemplate.content;
				}));
		}

		return Promise.all(result);
	}

	private async post(url: string, data: any, expect: "json" | "html"): Promise<any> {
		console.debug("%c[Api] %cPOST %c%s", "color: gray", "color: blue", "color: inherit", url);

		const formData = new FormData();
		for (const key in data) {
			if (!data.hasOwnProperty(key)) {
				continue;
			}

			formData.append(key, data[key]);
		}

		const response = await fetch(url, {
			method: "POST",
			body: formData,
			referrer: url,
		});

		if (expect === "json") {
			const json = await response.json();
			if (json.error) {
				throw new Error(json.error_msg);
			}

			return json;
		} else {
			const template = document.createElement("template");
			template.innerHTML = await response.text();

			const err = template.content.querySelector(".gui_error");
			if (err) {
				throw new Error(err.textContent);
			}

			const msg = template.content.querySelector(".gui_success");
			if (msg) {
				return {
					payload_type: "html",
					payload_data: msg.innerHTML,
				};
			}
		}
	}
}
