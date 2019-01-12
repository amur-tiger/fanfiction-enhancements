import { Cache } from "./cache";
import { FollowedStory, Story } from "./data";
import { environment } from "../util/environment";
import * as jQueryProxy from "jquery";
import { parseFollowedStoryList, parseProfile } from "../util/parser";
import { parseGetParams } from "../utils";

const $: JQueryStatic = (jQueryProxy as any).default || jQueryProxy;

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
	public putAlert(story: Story): Promise<Story> {
		return Promise.all([
			this.api.putAlert(story),
			this.cache.putAlert(story),
		])
			.then(() => story);
	}

	/**
	 * Checks whether the given story has alerts enabled.
	 * @param {Story} story
	 * @returns {Promise<boolean>}
	 */
	public hasAlert(story: Story): Promise<boolean> {
		return this.cache.isAlertsFresh()
			.then(fresh => {
				if (!fresh) {
					return this.api.getStoryAlerts()
						.then(alerts => this.cache.putAlerts(alerts));
				}
			})
			.then(() => this.cache.hasAlert(story));
	}

	/**
	 * Updates the FFN favorite state of a story according to the given story object.
	 * @param story
	 */
	public putFavorite(story: Story): Promise<Story> {
		return Promise.all([
			this.api.putFavorite(story),
			this.cache.putFavorite(story),
		])
			.then(() => story);
	}

	/**
	 * Checks whether the given story is a favorite.
	 * @param {Story} story
	 * @returns {Promise<boolean>}
	 */
	public isFavorite(story: Story): Promise<boolean> {
		return this.cache.isFavoritesFresh()
			.then(fresh => {
				if (!fresh) {
					return this.api.getStoryFavorites()
						.then(favorites => this.cache.putFavorites(favorites));
				}
			})
			.then(() => this.cache.isFavorite(story));
	}

	/**
	 * Retrieves all story alerts that are set on FFN for the current user.
	 */
	public getStoryAlerts(): Promise<FollowedStory[]> {
		return this.cache.isAlertsFresh()
			.then(fresh => {
				if (fresh) {
					return this.cache.getAlerts();
				} else {
					return this.api.getStoryAlerts()
						.then(alerts => this.cache.putAlerts(alerts));
				}
			});
	}

	/**
	 * Retrieves all favorites that are set on FFN for the current user.
	 */
	public getStoryFavorites(): Promise<FollowedStory[]> {
		return this.cache.isFavoritesFresh()
			.then(fresh => {
				if (fresh) {
					return this.cache.getFavorites();
				} else {
					return this.api.getStoryFavorites()
						.then(favorites => this.cache.putFavorites(favorites));
				}
			});
	}

	public getStoryInfo(id: number): Promise<Story> {
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

		return this.cache.getStory(id)
			.then(story => {
				if (story.chapters.find(chapter => chapter.words === undefined)) {
					return this.api.applyChapterLengths(story)
						.then(s => this.cache.putStory(s));
				}

				return story;
			})
			.then(attachHandlers)
			.catch(e => {
				return this.api.getStoryInfo(id)
					.then(story => this.api.applyChapterLengths(story))
					.then(story => this.applyFollowStates(story))
					.then(attachHandlers);
			});
	}

	public putStoryInfo(story: Story): Promise<Story> {
		return this.applyFollowStates(story)
			// .then(s => this.api.applyChapterLengths(s))
			.then(s => this.cache.putStory(s));
	}

	private applyFollowStates(story: Story): Promise<Story> {
		return Promise.all([
			this.hasAlert(story),
			this.isFavorite(story),
		]).then(array => {
			this.updatingFollowState = true;
			story.follow(array[0]);
			story.favorite(array[1]);
			this.updatingFollowState = false;
		}).then(() => this.cache.putStory(story));
	}
}

export class ApiImmediate {
	/**
	 * Updates the FFN alert state of a story according to the given story object.
	 * @param story
	 */
	public putAlert(story: Story): Promise<Story> {
		return story.follow() ? this.followStory(story) : this.unFollowStory(story);
	}

	/**
	 * Updates the FFN favorite state of a story according to the given story object.
	 * @param story
	 */
	public putFavorite(story: Story): Promise<Story> {
		return story.favorite() ? this.favoriteStory(story) : this.unFavoriteStory(story);
	}

	/**
	 * Retrieves all story alerts that are set on FFN for the current user.
	 */
	public getStoryAlerts(): Promise<FollowedStory[]> {
		return this.getMultiPage("/alert/story.php")
			.then(fragments => {
				const result = [];
				for (const fragment of fragments) {
					result.push(...parseFollowedStoryList(fragment));
				}

				return result;
			});
	}

	/**
	 * Retrieves all favorites that are set on FFN for the current user.
	 */
	public getStoryFavorites(): Promise<FollowedStory[]> {
		return this.getMultiPage("/favorites/story.php")
			.then(fragments => {
				const result = [];
				for (const fragment of fragments) {
					result.push(...parseFollowedStoryList(fragment));
				}

				return result;
			});
	}

	/**
	 * Retrieves information about the story. Warning: the alert and favorite state of the story are not set!
	 *
	 * @param {number} id
	 * @returns {Promise<Story>}
	 */
	public getStoryInfo(id: number): Promise<Story> {
		return this.apiCall("GET", "/s/" + id)
			.then(parseProfile)
			.then(story => this.applyChapterLengths(story));
	}

	public applyChapterLengths(story: Story): Promise<Story> {
		return Promise.all(story.chapters
			.filter(chapter => chapter.words === undefined)
			.map(chapter => {
				return this.apiCall("GET", "/s/" + story.id + "/" + chapter.id)
					.then(body => {
						const template = document.createElement("template");
						template.innerHTML = body;
						(chapter as any).words = template.content.getElementById("storytext")
							.textContent.trim().split(/\s+/).length;
					});
			}))
			.then(() => story);
	}

	private getMultiPage(url: string): Promise<DocumentFragment[]> {
		return this.apiCall("GET", url)
			.then(body => {
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
					result.push(this.apiCall("GET", url + "?p=" + i)
						.then(nextBody => {
							const nextTemplate = document.createElement("template");
							nextTemplate.innerHTML = nextBody;

							return nextTemplate.content;
						}));
				}

				return Promise.all(result);
			});
	}

	private apiCall(method: string, url: string, data?: any): Promise<any> {
		debug("%s %s", method, url);

		return Promise.resolve($.ajax({
			method: method,
			url: url,
			data: data,
		}));
	}

	private followStory(story: Story): Promise<Story> {
		debug("Following story %s (id: %s)", story.title, story.id);

		return this.apiCall("POST", "/api/ajax_subs.php", {
			storyid: story.id,
			userid: environment.currentUserId,
			storyalert: 1,
		}).then(() => story);
	}

	private unFollowStory(story: Story): Promise<Story> {
		debug("Un-following story %s (id: %s)", story.title, story.id);

		return this.apiCall("POST", "/alert/story.php", {
			action: "remove-multi",
			"rids[]": story.id,
		}).then(() => story);
	}

	private favoriteStory(story: Story): Promise<Story> {
		debug("Favoriting story %s (id: %s)", story.title, story.id);

		return this.apiCall("POST", "/api/ajax_subs.php", {
			storyid: story.id,
			userid: environment.currentUserId,
			favstory: 1,
		}).then(() => story);
	}

	private unFavoriteStory(story: Story): Promise<Story> {
		debug("Un-favoriting story %s (id: %s)", story.title, story.id);

		return this.apiCall("POST", "/favorites/story.php", {
			action: "remove-multi",
			"rids[]": story.id,
		}).then(() => story);
	}
}
