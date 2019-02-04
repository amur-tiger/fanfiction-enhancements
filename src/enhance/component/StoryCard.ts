import { ffnServices } from "../../util/environment";
import { Component } from "./Component";
import { Rating } from "./Rating";
import { Story } from "../../api/Story";
import { ValueContainer } from "../../api/ValueContainer";

import "./StoryCard.css";

export class StoryCard implements Component {
	constructor(private readonly valueContainer: ValueContainer) {
	}

	public createElement(story: Story): HTMLElement {
		const element = document.createElement("div") as HTMLDivElement;
		element.className = "ffe-sc";

		this.addHeader(element, story);
		this.addTags(element, story);
		this.addImage(element, story);
		this.addDescription(element, story);
		this.addFooter(element, story);

		return element;
	}

	private addHeader(element: HTMLDivElement, story: Story): void {
		const activeToggle = e => v => e.classList.toggle("ffe-sc-active", v);

		const header = document.createElement("div");
		header.className = "ffe-sc-header";

		const rating = new Rating(document).createElement(story.rating);
		header.appendChild(rating);

		const title = document.createElement("a");
		title.className = "ffe-sc-title";
		title.textContent = story.title;
		title.href = "/s/" + story.id;
		header.appendChild(title);

		const by = document.createElement("span");
		by.className = "ffe-sc-by";
		by.textContent = "by";
		header.appendChild(by);

		const author = document.createElement("a");
		author.className = "ffe-sc-author";
		author.textContent = story.author ? story.author.name : "?";
		author.href = "/u/" + (story.author ? story.author.id : "?");
		header.appendChild(author);

		const mark = document.createElement("div");
		mark.className = "ffe-sc-mark btn-group";

		const follow = document.createElement("span");
		follow.className = "ffe-sc-follow btn icon-bookmark-2";
		follow.dataset["storyId"] = story.id + "";
		follow.addEventListener("click", this.clickFollow.bind(this));
		story.alert.get().then(activeToggle(follow));
		story.alert.subscribe(activeToggle(follow));
		mark.appendChild(follow);

		const favorite = document.createElement("span");
		favorite.className = "ffe-sc-favorite btn icon-heart";
		favorite.dataset["storyId"] = story.id + "";
		favorite.addEventListener("click", this.clickFavorite.bind(this));
		story.favorite.get().then(activeToggle(favorite));
		story.favorite.subscribe(activeToggle(favorite));
		mark.appendChild(favorite);

		header.appendChild(mark);

		element.appendChild(header);
	}

	private clickFollow(event: MouseEvent): void {
		const button = event.target as HTMLElement;
		button.classList.toggle("ffe-sc-active");
		const alert = this.valueContainer.getAlertValue(+button.dataset.storyId);
		alert.get().then(a => alert.set(!a))
			.catch(err => {
				console.error(err);
				button.classList.toggle("ffe-sc-active");
				ffnServices.xtoast("We are unable to process your request due to a network error. Please try again later.");
			});
	}

	private clickFavorite(event: MouseEvent): void {
		const button = event.target as HTMLElement;
		button.classList.toggle("ffe-sc-active");
		const favorite = this.valueContainer.getFavoriteValue(+button.dataset.storyId);
		favorite.get().then(f => favorite.set(!f))
			.catch(err => {
				console.error(err);
				button.classList.toggle("ffe-sc-active");
				ffnServices.xtoast("We are unable to process your request due to a network error. Please try again later.");
			});
	}

	private addImage(element: HTMLDivElement, story: Story) {
		if (!story.imageUrl) {
			return;
		}

		const imageContainer = document.createElement("div");
		imageContainer.className = "ffe-sc-image";

		const image = document.createElement("img");
		if (story.imageOriginalUrl) {
			const imageUrlReplacer = () => {
				image.removeEventListener("error", imageUrlReplacer);
				image.src = story.imageUrl;
			};

			image.addEventListener("error", imageUrlReplacer);
			image.src = story.imageOriginalUrl;
		} else {
			image.src = story.imageUrl;
		}
		imageContainer.appendChild(image);

		element.appendChild(imageContainer);
	}

	private addDescription(element: HTMLDivElement, story: Story) {
		const description = document.createElement("div");
		description.className = "ffe-sc-description";
		description.textContent = story.description;

		element.appendChild(description);
	}

	private addTags(element: HTMLDivElement, story: Story) {
		const tags = document.createElement("div");
		tags.className = "ffe-sc-tags";

		let html = "";

		if (story.language) {
			html += `<span class="ffe-sc-tag ffe-sc-tag-language">${story.language}</span>`;
		}

		if (story.genre) {
			for (const genre of story.genre) {
				html += `<span class="ffe-sc-tag ffe-sc-tag-genre">${genre}</span>`;
			}
		}

		if (story.characters && story.characters.length) {
			for (const character of story.characters) {
				if (typeof character === "string") {
					html += `<span class="ffe-sc-tag ffe-sc-tag-character">${character}</span>`;
				} else {
					html += `<span class="ffe-sc-tag ffe-sc-tag-ship"><span
						class="ffe-sc-tag-character">${character.join("</span><span " +
						"class='ffe-sc-tag-character'>")}</span></span>`;
				}
			}
		}

		if (story.chapters && story.chapters.length > 1) {
			html += `<span class="ffe-sc-tag ffe-sc-tag-chapters">Chapters: ${story.chapters.length}</span>`;
		}

		if (story.reviews) {
			html += `<span class="ffe-sc-tag ffe-sc-tag-reviews"><a
				href="/r/${story.id}/">Reviews: ${story.reviews}</a></span>`;
		}

		if (story.favorites) {
			html += `<span class="ffe-sc-tag ffe-sc-tag-favs">Favorites: ${story.favorites}</span>`;
		}

		if (story.follows) {
			html += `<span class="ffe-sc-tag ffe-sc-tag-follows">Follows: ${story.follows}</span>`;
		}

		tags.innerHTML = html;
		element.appendChild(tags);
	}

	private addFooter(element: HTMLDivElement, story: Story) {
		const footer = document.createElement("div");
		footer.className = "ffe-sc-footer";
		footer.innerHTML = "&nbsp;";

		if (story.words) {
			const words = document.createElement("div");
			words.style.cssFloat = "right";
			words.innerHTML = "<b>" + story.words.toLocaleString("en") + "</b> words";
			footer.appendChild(words);
		}

		const status = document.createElement("span");
		status.className = "ffe-sc-footer-info";
		if (story.status === "Complete") {
			status.className += " ffe-sc-footer-complete";
			status.textContent = "Complete";
		} else {
			status.className += " ffe-sc-footer-incomplete";
			status.textContent = "Incomplete";
		}
		footer.appendChild(status);

		if (story.published) {
			const published = document.createElement("span");
			published.className = "ffe-sc-footer-info";
			published.innerHTML = "<b>Published:</b> ";

			const time = document.createElement("time") as HTMLTimeElement;
			time.dateTime = story.published.toISOString();
			time.textContent = story.published.toISOString();
			published.appendChild(time);
			footer.appendChild(published);
		}

		if (story.updated) {
			const updated = document.createElement("span");
			updated.className = "ffe-sc-footer-info";
			updated.innerHTML = "<b>Updated:</b> ";

			const time = document.createElement("time") as HTMLTimeElement;
			time.dateTime = story.updated.toISOString();
			time.textContent = story.updated.toISOString();
			updated.appendChild(time);
			footer.appendChild(updated);
		}

		element.appendChild(footer);
	}
}
