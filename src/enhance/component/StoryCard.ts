import { StoryMetaData } from "../StoryMetaData";
import Component from "./Component";
import Rating from "./Rating";
import "./StoryCard.css";

export default class StoryCard implements Component {
	constructor(private document: Document) {
	}

	public createElement(story: StoryMetaData): HTMLElement {
		const element = this.document.createElement("div") as HTMLDivElement;
		element.className = "ffe-sc";

		this.addHeader(element, story);
		this.addImage(element, story);
		this.addDescription(element, story);
		this.addTags(element, story);
		this.addFooter(element, story);

		return element;
	}

	private addHeader(element: HTMLDivElement, story: StoryMetaData): void {
		const header = this.document.createElement("div") as HTMLDivElement;
		header.className = "ffe-sc-header";

		const rating = new Rating(this.document).createElement(story.rating);
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

	private addDescription(element: HTMLDivElement, story: StoryMetaData) {
		const description = this.document.createElement("div");
		description.className = "ffe-sc-description";
		description.textContent = story.description;

		element.appendChild(description);
	}

	private addTags(element: HTMLDivElement, story: StoryMetaData) {
		const tags = this.document.createElement("div");
		tags.className = "ffe-sc-tags";

		let html = "";

		if (story.language) {
			html += `<span class="ffe-sc-tag">${story.language}</span>`;
		}

		if (story.genre) {
			html += `<span class="ffe-sc-tag">${story.genre}</span>`;
		}

		if (story.chapters) {
			html += `<span class="ffe-sc-tag">Chapters: ${story.chapters}</span>`;
		}

		if (story.reviews) {
			html += `<span class="ffe-sc-tag"><a href="/r/${story.id}">Reviews: ${story.reviews}</a></span>`;
		}

		if (story.favs) {
			html += `<span class="ffe-sc-tag">Favorites: ${story.favs}</span>`;
		}

		if (story.follows) {
			html += `<span class="ffe-sc-tag">Follows: ${story.follows}</span>`;
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
