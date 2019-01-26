import { Cache } from "./cache";
import { FollowedStory, Story } from "./data";
import { environment } from "../util/environment";
import { parseFollowedStoryList, parseProfile } from "../util/parser";
import { parseGetParams } from "../utils";

const debug = (message, ...args) => {
	args.unshift("color: inherit;");
	args.unshift("color: gray;");
	args.unshift("%c[Api] %c" + message);
	console.debug.apply(console, args);
};

export class Api {
	private updatingFollowState = false;

	public constructor(
		private readonly cache: Cache,
		private readonly api: ApiImmediate) {
	}

	/**
	 * Updates the FFN alert state of a story according to the given story object.
	 * @param story
	 */
	public async putAlert(story: Story): Promise<void> {
		await this.api.putAlert(story);
		await this.cache.putAlert(story);
	}

	/**
	 * Checks whether the given story has alerts enabled.
	 * @param {Story} story
	 * @returns {Promise<boolean>}
	 */
	public async hasAlert(story: Story): Promise<boolean> {
		const isFresh = await this.cache.isAlertsFresh();
		if (!isFresh) {
			const alerts = await this.api.getStoryAlerts();
			await this.cache.putAlerts(alerts);
		}

		return this.cache.hasAlert(story);
	}

	/**
	 * Updates the FFN favorite state of a story according to the given story object.
	 * @param story
	 */
	public async putFavorite(story: Story): Promise<void> {
		await this.api.putFavorite(story);
		await this.cache.putFavorite(story);
	}

	/**
	 * Checks whether the given story is a favorite.
	 * @param {Story} story
	 * @returns {Promise<boolean>}
	 */
	public async isFavorite(story: Story): Promise<boolean> {
		const isFresh = await this.cache.isFavoritesFresh();
		if (!isFresh) {
			const favorites = await this.api.getStoryFavorites();
			await this.cache.putFavorites(favorites);
		}

		return this.cache.isFavorite(story);
	}

	/**
	 * Retrieves all story alerts that are set on FFN for the current user.
	 */
	public async getStoryAlerts(): Promise<FollowedStory[]> {
		const isFresh = await this.cache.isAlertsFresh();
		if (isFresh) {
			return this.cache.getAlerts();
		} else {
			const alerts = await this.api.getStoryAlerts();
			await this.cache.putAlerts(alerts);

			return alerts;
		}
	}

	/**
	 * Retrieves all favorites that are set on FFN for the current user.
	 */
	public async getStoryFavorites(): Promise<FollowedStory[]> {
		const isFresh = await this.cache.isFavoritesFresh();
		if (isFresh) {
			return this.cache.getFavorites();
		} else {
			const favorites = await this.api.getStoryFavorites();
			await this.cache.putFavorites(favorites);

			return favorites;
		}
	}

	public async getStoryInfo(id: number): Promise<Story> {
		const attachHandlers = (story: Story) => {
			// todo better error handling
			story.follow.subscribe(follow => {
				if (this.updatingFollowState) {
					return;
				}

				this.putAlert(story)
					.catch(console.error);
			});
			story.favorite.subscribe(favorite => {
				if (this.updatingFollowState) {
					return;
				}

				this.putFavorite(story)
					.catch(console.error);
			});

			return story;
		};

		try {
			// todo replace try-catch with hasStory method
			const story = await this.cache.getStory(id);
			if (story.chapters.find(chapter => chapter.words === undefined)) {
				await this.api.applyChapterLengths(story);
				await this.cache.putStory(story);
			}

			attachHandlers(story);

			return story;
		} catch (e) {
			const story = await this.api.getStoryInfo(id);
			await this.api.applyChapterLengths(story);
			await this.applyFollowStates(story);
			attachHandlers(story);

			return story;
		}
	}

	public async putStoryInfo(story: Story): Promise<void> {
		await this.applyFollowStates(story);
		await this.cache.putStory(story);
	}

	private async applyFollowStates(story: Story): Promise<void> {
		const hasAlert = await this.hasAlert(story);
		const isFavorite = await this.isFavorite(story);

		this.updatingFollowState = true;
		story.follow(hasAlert);
		story.favorite(isFavorite);
		this.updatingFollowState = false;

		await this.cache.putStory(story);
	}
}

export class ApiImmediate {
	/**
	 * Updates the FFN alert state of a story according to the given story object.
	 * @param story
	 */
	public async putAlert(story: Story): Promise<void> {
		await (story.follow() ? this.followStory(story) : this.unFollowStory(story));
	}

	/**
	 * Updates the FFN favorite state of a story according to the given story object.
	 * @param story
	 */
	public async putFavorite(story: Story): Promise<void> {
		await (story.favorite() ? this.favoriteStory(story) : this.unFavoriteStory(story));
	}

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

	/**
	 * Retrieves information about the story. Warning: the alert and favorite state of the story are not set!
	 *
	 * @param {number} id
	 * @returns {Promise<Story>}
	 */
	public async getStoryInfo(id: number): Promise<Story> {
		const data = await this.getHtml("/s/" + id);
		const story = parseProfile(data);
		await this.applyChapterLengths(story);

		return story;
	}

	public async applyChapterLengths(story: Story): Promise<void> {
		await Promise.all(story.chapters
			.filter(chapter => chapter.words === undefined)
			.map(async chapter => {
				const body = await this.getHtml("/s/" + story.id + "/" + chapter.id);
				const template = document.createElement("template");
				template.innerHTML = body;
				(chapter as any).words = template.content.getElementById("storytext")
					.textContent.trim().split(/\s+/).length;
			}));
	}

	private async getMultiPage(url: string): Promise<DocumentFragment[]> {
		const body = await this.getHtml(url);
		const template = document.createElement("template");
		template.innerHTML = body;

		const pageCenter = template.content.querySelector("#content_wrapper_inner center");
		if (!pageCenter) {
			debug("Number of pages = 1");

			return [template.content];
		}

		const nextLink = pageCenter.lastElementChild as HTMLAnchorElement;
		const lastLink = nextLink.previousElementSibling as HTMLAnchorElement;
		const relevantLink = lastLink && lastLink.textContent === "Last" ? lastLink : nextLink;
		const max = +parseGetParams(relevantLink.href).p;
		debug("Number of pages = %s", max);

		const result = [Promise.resolve(template.content)];
		for (let i = 2; i <= max; i++) {
			result.push(this.getHtml(url + "?p=" + i)
				.then(nextBody => {
					const nextTemplate = document.createElement("template");
					nextTemplate.innerHTML = nextBody;

					return nextTemplate.content;
				}));
		}

		return Promise.all(result);
	}

	private async postFormData(url: string, data: any): Promise<any> {
		debug("POST %s", url);

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

	private async getHtml(url: string): Promise<string> {
		debug("GET %s", url);

		const response = await fetch(url);

		return response.text();
	}

	private async followStory(story: Story): Promise<void> {
		debug("Following story %s (id: %s)", story.title, story.id);

		await this.postFormData("/api/ajax_subs.php", {
			storyid: story.id,
			userid: environment.currentUserId,
			storyalert: 1,
		});
	}

	private async unFollowStory(story: Story): Promise<void> {
		debug("Un-following story %s (id: %s)", story.title, story.id);

		await this.postFormData("/alert/story.php", {
			action: "remove-multi",
			"rids[]": story.id,
		});
	}

	private async favoriteStory(story: Story): Promise<void> {
		debug("Favoriting story %s (id: %s)", story.title, story.id);

		await this.postFormData("/api/ajax_subs.php", {
			storyid: story.id,
			userid: environment.currentUserId,
			favstory: 1,
		});
	}

	private async unFavoriteStory(story: Story): Promise<void> {
		debug("Un-favoriting story %s (id: %s)", story.title, story.id);

		await this.postFormData("/favorites/story.php", {
			action: "remove-multi",
			"rids[]": story.id,
		});
	}
}
