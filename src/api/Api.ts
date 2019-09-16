import { FollowedStory } from "./data";
import { environment } from "../util/environment";
import { parseFollowedStoryList } from "../util/parser";
import { parseGetParams } from "../utils";
import { StoryData } from "./Story";

export class Api {
	/**
	 * Retrieves a number of stories by id.
	 *
	 * @param ids
	 */
	public async getStories(ids: number[]): Promise<StoryData[]> {
		const query = this.buildQuery(ids);
		const response = await fetch("https://tiger.rocks/api/ffn", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ query }),
		});

		const json = await response.json();
		const stories = json.data.stories;
		stories.forEach(story => {
			story.published = new Date(story.published);
			if (story.updated) {
				story.updated = new Date(story.updated);
			}

			story.chapters.forEach(chapter => {
				chapter.story = story;
			});
		});

		return stories;
	}

	/**
	 * Retrieves a single story by id.
	 *
	 * @param id
	 */
	public async getStory(id: number): Promise<StoryData> {
		const stories = await this.getStories([id]);

		return stories[0];
	}

	/**
	 * Retrieves all story alerts that are set on FFN for the current user.
	 */
	public async getStoryAlerts(): Promise<FollowedStory[]> {
		const fragments = await this.getMultiPage("/alert/story.php");
		const result: FollowedStory[] = [];
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
		const result: FollowedStory[] = [];
		for (const fragment of fragments) {
			result.push(...parseFollowedStoryList(fragment));
		}

		return result;
	}

	/**
	 * Adds a story by id to the alerts list for the current user. Whenever a story updates, the user will then be
	 * notified.
	 *
	 * @param id
	 */
	public async addStoryAlert(id: number): Promise<void> {
		// noinspection SpellCheckingInspection
		await this.post("/api/ajax_subs.php", {
			storyid: id,
			userid: environment.currentUserId,
			storyalert: 1,
		}, "json");
	}

	/**
	 * Removes a story by id from the alerts list for the current user. The user will no longer be notified when
	 * the story updates.
	 *
	 * @param id
	 */
	public async removeStoryAlert(id: number): Promise<void> {
		await this.post("/alert/story.php", {
			action: "remove-multi",
			"rids[]": id,
		}, "html");
	}

	/**
	 * Adds a story by id to the favorites of the current user.
	 *
	 * @param id
	 */
	public async addStoryFavorite(id: number): Promise<void> {
		// noinspection SpellCheckingInspection
		await this.post("/api/ajax_subs.php", {
			storyid: id,
			userid: environment.currentUserId,
			favstory: 1,
		}, "json");
	}

	/**
	 * Removes a story by id from the favorites of the current user.
	 *
	 * @param id
	 */
	public async removeStoryFavorite(id: number): Promise<void> {
		await this.post("/favorites/story.php", {
			action: "remove-multi",
			"rids[]": id,
		}, "html");
	}

	private buildQuery(ids: number[]): string {
		return `{
			stories(ids: [${ids.join(", ")}]) {
				id,
				title,
				description,
				imageUrl,
				imageOriginalUrl,
				favorites,
				follows,
				reviews,
				genre,
				language,
				published,
				updated,
				rating,
				words,
				characters,
				status,
				universes,
				chapters {
					id,
					name,
					words
				}
			}
		}`;
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

		// noinspection ES6MissingAwait
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
				throw new Error(err.textContent || undefined);
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
