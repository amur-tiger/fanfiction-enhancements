import Rating from "./component/Rating";
import { StoryMetaData } from "./StoryMetaData";
import "./StoryProfile.css";

export default class StoryProfile {
	public readonly iconElement: HTMLImageElement;
	public readonly titleElement: HTMLElement;
	public readonly authorByElement: HTMLElement;
	public readonly authorElement: HTMLElement;
	public readonly descriptionElement: HTMLElement;
	public readonly tagsElement: HTMLElement;
	public readonly tags: StoryMetaData = {};

	constructor(private profile: HTMLElement) {
		let offset = 0;
		const icon = profile.children[0].firstChild;
		if (icon.nodeName === "IMG") {
			this.iconElement = icon as HTMLImageElement;
		} else {
			offset--;
		}

		this.titleElement = profile.children[offset + 2] as HTMLElement;
		this.authorByElement = profile.children[offset + 3] as HTMLElement;
		this.authorElement = profile.children[offset + 4] as HTMLElement;
		this.descriptionElement = profile.children[offset + 7] as HTMLElement;
		this.tagsElement = profile.children[offset + 8] as HTMLElement;

		this.parseTags();
	}

	public enhance() {
		const rating = new Rating(document).createElement(this.tags.rating);

		this.profile.insertBefore(rating, this.titleElement);
		this.titleElement.style.fontSize = "1.5em";
		this.authorByElement.textContent = "by";

		const footer = document.createElement("div");
		footer.className += " ffe-sp-footer";

		let footerContent = "&nbsp;";
		if (this.tags.words) {
			footerContent += '<div style="float: right;"><b>' + this.tags.words.toLocaleString("en") + "</b> words</div>";
		}

		if (this.tags.status == "Complete") {
			footerContent += '<span class="ffe-sp-footer-info ffe-sp-footer-complete">Complete</span>';
		} else {
			footerContent += '<span class="ffe-sp-footer-info ffe-sp-footer-incomplete">Incomplete</span>';
		}

		if (this.tags.published) {
			footerContent += '<span class="ffe-sp-footer-info"><b>Published:</b> <time datetime="' +
				this.tags.published.toISOString() + '">' + this.tags.publishedWords + "</time></span>";
		}

		if (this.tags.updated) {
			footerContent += '<span class="ffe-sp-footer-info"><b>Updated:</b> <time datetime="' +
				this.tags.updated.toISOString() + '">' + this.tags.updatedWords + "</time></span>";
		}

		footer.innerHTML = footerContent;
		this.profile.parentElement.insertBefore(footer, this.profile.nextElementSibling);
	}

	private parseTags() {
		const tagsArray = this.tagsElement.innerHTML.split(" - ");
		const tempElement = document.createElement("div");

		tempElement.innerHTML = tagsArray[0].trim().substring(7).replace(/>.*?\s+(.*?)</, ">$1<");
		this.tags.rating = (tempElement.firstElementChild as HTMLElement).textContent;

		this.tags.language = tagsArray[1].trim();
		this.tags.genre = tagsArray[2].trim();

		for (let i = 3; i < tagsArray.length; i++) {
			const tagNameMatch = tagsArray[i].match(/^(\w+):/);
			if (!tagNameMatch) {
				this.tags.characters = tagsArray[i].trim().split(/,\s+/);
				continue;
			}

			const tagName = tagNameMatch[1].toLowerCase();
			const tagValue = tagsArray[i].match(/^.*?:\s+(.*?)\s*$/)[1];

			switch (tagName) {
				case "characters":
					this.tags.characters = tagsArray[i].trim().split(/,\s+/);
					break;
				case "reviews":
					tempElement.innerHTML = tagValue;
					this.tags.reviews = +(tempElement.firstElementChild as HTMLElement).textContent;
					break;
				case "published":
				case "updated":
					tempElement.innerHTML = tagValue;
					this.tags[tagName] = new Date(+tempElement.firstElementChild.getAttribute("data-xutime") * 1000);
					this.tags[tagName + "Words"] = tempElement.firstElementChild.textContent;
					break;
				default:
					if (/^[0-9,.]*$/.test(tagValue)) {
						this.tags[tagName] = +tagValue.replace(/,/g, "");
					} else {
						this.tags[tagName] = tagValue;
					}
					break;
			}
		}
	}
}
