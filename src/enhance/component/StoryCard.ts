import { Component } from "./Component";
import { Rating } from "./Rating";
import { Story } from "../../api/data/Story";
import { StoryMetaData } from "../../api/data/StoryMetaData";

import "./StoryCard.css";

export class StoryCard implements Component {
	constructor(private document: Document) {
	}

	public createElement(story: Story): HTMLElement {
		const element = this.document.createElement("div") as HTMLDivElement;
		element.className = "ffe-sc";

		this.addHeader(element, story);
		this.addTags(element, story);
		this.addImage(element, story.meta);
		this.addDescription(element, story);
		this.addFooter(element, story.meta);

		return element;
	}

	private addHeader(element: HTMLDivElement, story: Story): void {
		const header = this.document.createElement("div") as HTMLDivElement;
		header.className = "ffe-sc-header";

		const rating = new Rating(this.document).createElement(story.meta.rating);
		header.appendChild(rating);

		const title = this.document.createElement("a") as HTMLAnchorElement;
		title.className = "ffe-sc-title";
		title.textContent = story.title;
		title.href = "/s/" + story.id;
		header.appendChild(title);

		const by = this.document.createElement("span") as HTMLSpanElement;
		by.className = "ffe-sc-by";
		by.textContent = "by";
		header.appendChild(by);

		const author = this.document.createElement("a") as HTMLAnchorElement;
		author.className = "ffe-sc-author";
		author.textContent = story.author ? story.author.name : "?";
		author.href = "/u/" + (story.author ? story.author.id : "?");
		header.appendChild(author);

		element.appendChild(header);
	}

	private addImage(element: HTMLDivElement, story: StoryMetaData) {
		if (!story.imageUrl) {
			return;
		}

		const imageContainer = this.document.createElement("div");
		imageContainer.className = "ffe-sc-image";

		const image = this.document.createElement("img");
		image.src = story.imageUrl;
		imageContainer.appendChild(image);

		element.appendChild(imageContainer);
	}

	private addDescription(element: HTMLDivElement, story: Story) {
		const description = this.document.createElement("div");
		description.className = "ffe-sc-description";
		description.textContent = story.description;

		element.appendChild(description);
	}

	private addTags(element: HTMLDivElement, story: Story) {
		const tags = this.document.createElement("div");
		tags.className = "ffe-sc-tags";

		let html = "";

		if (story.meta.language) {
			html += `<span class="ffe-sc-tag ffe-sc-tag-language">${story.meta.language}</span>`;
		}

		if (story.meta.genre) {
			for (const genre of story.meta.genre) {
				html += `<span class="ffe-sc-tag ffe-sc-tag-genre">${genre}</span>`;
			}
		}

		if (story.meta.characters && story.meta.characters.length) {
			for (const character of story.meta.characters) {
				if (typeof character === "string") {
					html += `<span class="ffe-sc-tag ffe-sc-tag-character">${character}</span>`;
				} else {
					html += `<span class="ffe-sc-tag ffe-sc-tag-ship"><span 
						class="ffe-sc-tag-character">${character.join("</span><span " +
						"class='ffe-sc-tag-character'>")}</span></span>`;
				}
			}
		}

		if (story.chapters && story.chapters.length) {
			html += `<span class="ffe-sc-tag ffe-sc-tag-chapters">Chapters: ${story.chapters.length}</span>`;
		}

		if (story.meta.reviews) {
			html += `<span class="ffe-sc-tag ffe-sc-tag-reviews"><a 
				href="/r/${story.id}/">Reviews: ${story.meta.reviews}</a></span>`;
		}

		if (story.meta.favs) {
			html += `<span class="ffe-sc-tag ffe-sc-tag-favs">Favorites: ${story.meta.favs}</span>`;
		}

		if (story.meta.follows) {
			html += `<span class="ffe-sc-tag ffe-sc-tag-follows">Follows: ${story.meta.follows}</span>`;
		}

		tags.innerHTML = html;
		element.appendChild(tags);
	}

	private addFooter(element: HTMLDivElement, story: StoryMetaData) {
		const footer = this.document.createElement("div");
		footer.className = "ffe-sc-footer";
		footer.innerHTML = "&nbsp;";

		if (story.words) {
			const words = this.document.createElement("div");
			words.style.cssFloat = "right";
			words.innerHTML = "<b>" + story.words.toLocaleString("en") + "</b> words";
			footer.appendChild(words);
		}

		const status = this.document.createElement("span");
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
			const published = this.document.createElement("span");
			published.className = "ffe-sc-footer-info";
			published.innerHTML = "<b>Published:</b> ";

			const time = this.document.createElement("time") as HTMLTimeElement;
			time.dateTime = story.published.toISOString();
			time.textContent = story.publishedWords;
			published.appendChild(time);
			footer.appendChild(published);
		}

		if (story.updated) {
			const updated = this.document.createElement("span");
			updated.className = "ffe-sc-footer-info";
			updated.innerHTML = "<b>Updated:</b> ";

			const time = this.document.createElement("time") as HTMLTimeElement;
			time.dateTime = story.updated.toISOString();
			time.textContent = story.updatedWords;
			updated.appendChild(time);
			footer.appendChild(updated);
		}

		element.appendChild(footer);
	}
}
