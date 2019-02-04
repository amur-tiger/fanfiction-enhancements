import { FollowedStory } from "./data";
import { environment } from "../util/environment";
import { parseFollowedStoryList, parseProfile } from "../util/parser";
import { parseGetParams } from "../utils";
import { StoryData } from "./Story";

export class Api {
	/**
	 * Retrieves all story alerts that are set on FFN for the current user.
	 */
	public async getStoryAlerts(): Promise<FollowedStory[]> {
		const fragments = await this.getMultiPage("/alert/story.php");
		const result = [];
		for (const fragment of fragments) {
			result.push(...parseFollowedStoryList(fragment));
		}

		return result;
	}

	/**
	 * Retrieves all favorites that are set on FFN for the current user.
	 */
	public async getStoryFavorites(): Promise<FollowedStory[]> {
		const fragments = await this.getMultiPage("/favorites/story.php");
		const result = [];
		for (const fragment of fragments) {
			result.push(...parseFollowedStoryList(fragment));
		}

		return result;
	}

	public async getStoryData(id: number): Promise<StoryData> {
		const data = await this.get("/s/" + id);

		return parseProfile(data);
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
		});
	}

	public async removeStoryAlert(id: number): Promise<void> {
		await this.post("/alert/story.php", {
			action: "remove-multi",
			"rids[]": id,
		});
	}

	public async addStoryFavorite(id: number): Promise<void> {
		await this.post("/api/ajax_subs.php", {
			storyid: id,
			userid: environment.currentUserId,
			favstory: 1,
		});
	}

	public async removeStoryFavorite(id: number): Promise<void> {
		await this.post("/favorites/story.php", {
			action: "remove-multi",
			"rids[]": id,
		});
	}

	private async get(url: string): Promise<string> {
		console.log("%c[Api] %cGET %c%s", "color: gray", "color: blue", "color: inherit", url);

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

	private async post(url: string, data: any): Promise<any> {
		console.log("%c[Api] %cPOST %c%s", "color: gray", "color: blue", "color: inherit", url);

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
		});

		const json = await response.json();
		if (json.error) {
			throw new Error(json.error_msg);
		}

		return json;
	}
}
