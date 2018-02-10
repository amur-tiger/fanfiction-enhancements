import { StoryMetaData } from "./StoryMetaData";

declare function GM_addStyle(style: string): void;

export default class StoryProfile {
	public readonly iconElement: HTMLImageElement;
	public readonly titleElement: HTMLElement;
	public readonly authorByElement: HTMLElement;
	public readonly authorElement: HTMLElement;
	public readonly descriptionElement: HTMLElement;
	public readonly tagsElement: HTMLElement;
	public readonly tags: StoryMetaData = new StoryMetaData();

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
		GM_addStyle(`
			.ffe-sp-rating {
				background: gray;
				padding: 3px 5px;
				color: #fff !important;
				border: 1px solid rgba(0, 0, 0, 0.2);
				text-shadow: -1px -1px rgba(0, 0, 0, 0.2);
				border-radius: 4px;
				margin-right: 5px;
				vertical-align: 2px;
			}
			
			.ffe-sp-rating:hover {
				border-bottom: 1px solid rgba(0, 0, 0, 0.2) !important;
			}
			
			.ffe-sp-rating-k,
			.ffe-sp-rating-kp {
				background: #78ac40;
				box-shadow: 0 1px 0 #90ce4d inset;
			}
			
			.ffe-sp-rating-t,
			.ffe-sp-rating-m {
				background: #ffb400;
				box-shadow: 0 1px 0 #ffd800 inset;
			}
			
			.ffe-sp-rating-ma {
				background: #c03d2f;
				box-shadow: 0 1px 0 #e64938 inset;
			}
			
			.storytext p {
				color: #333;
				text-align: justify;
			}
			
			.storytext.xlight p {
				color: #ddd;
			}
		`);

		const rating = document.createElement("a");
		rating.href = "https://www.fictionratings.com/";
		rating.className += " ffe-sp-rating";
		rating.rel = "noreferrer";
		rating.target = "rating";
		rating.textContent = this.tags.rating;

		switch (this.tags.rating) {
			case "K":
				rating.title = "General Audience (5+)";
				rating.className += " ffe-sp-rating-k";
				break;
			case "K+":
				rating.title = "Young Children (9+)";
				rating.className += " ffe-sp-rating-kp";
				break;
			case "T":
				rating.title = "Teens (13+)";
				rating.className += " ffe-sp-rating-t";
				break;
			case "M":
				rating.title = "Teens (16+)";
				rating.className += " ffe-sp-rating-m";
				break;
			case "MA":
				rating.title = "Mature (18+)";
				rating.className += " ffe-sp-rating-ma";
				break;
		}

		this.profile.insertBefore(rating, this.titleElement);
		this.titleElement.style.fontSize = "1.5em";
		this.authorByElement.textContent = "by";
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
