import { Api } from "../api/api";
import { environment } from "../util/environment";
import * as ko from "knockout";
import { Enhancer } from "./Enhancer";

import "./ChapterList.css";

ko.bindingHandlers.textSeparated = {
	update: function (element, accessor) {
		const value = ko.unwrap(accessor());
		element.textContent = value.toLocaleString("en");
	},
};

export class ChapterList implements Enhancer {
	public constructor(private readonly document: Document, private readonly api: Api) {
	}

	public enhance(): Promise<any> {
		const contentWrapper = this.document.getElementById("content_wrapper_inner");

		// clean up content
		Array.from(contentWrapper.children)
			.filter(e => (!e.textContent && (e as HTMLDivElement).style.height === "5px")
				|| (e.firstElementChild && e.firstElementChild.nodeName === "SELECT")
				|| (e.className === "lc-wrapper" && e.id !== "pre_story_links"))
			.forEach(e => contentWrapper.removeChild(e));
		contentWrapper.removeChild(this.document.getElementById("storytextp"));

		// add chapter list
		const chapterListContainer = this.document.createElement("div");
		chapterListContainer.className = "ffe-cl-container";
		chapterListContainer.innerHTML =
			`<div class="ffe-cl">
				<ol data-bind="foreach: chapters">
					<li class="ffe-cl-chapter">
						<span class="ffe-cl-read">
							<input type="checkbox" data-bind="attr: { id: 'ffe-cl-chapter-' + id }, checked: read"/>
							<label data-bind="attr: { for: 'ffe-cl-chapter-' + id }"/>
						</span>
						<span class="ffe-cl-chapter-title">
							<a data-bind="attr: { href: '/s/' + $parent.id + '/' + id }, text: name"></a>
						</span>
						<span class="ffe-cl-words" data-bind="visible: words">
							<b data-bind="textSeparated: words"></b> words
						</span>
					</li>
				</ol>
			</div>`;
		contentWrapper.insertBefore(chapterListContainer, this.document.getElementById("review_success"));

		// const profileFooter = this.document.getElementsByClassName("ffe-sc-footer")[0];
		// const allReadContainer = this.document.createElement("span");
		// allReadContainer.className = "ffe-cl-read";
		// allReadContainer.style.height = "auto";
		// allReadContainer.style.marginLeft = "10px";
		// allReadContainer.innerHTML =
		// 	`<input type="checkbox" data-bind="attr: { id: 'ffe-cl-story-' + id }, checked: read"/>
		// 	<label data-bind="attr: { for: 'ffe-cl-story-' + id }"/>`;
		// profileFooter.insertBefore(allReadContainer, profileFooter.firstElementChild);

		return this.api.getStoryInfo(environment.currentStoryId)
			.then(story => {
				ko.applyBindings(story, this.document.getElementById("content_wrapper_inner"));
				this.hideLongChapterList();
			});
	}

	private hideLongChapterList() {
		const elements = Array.from(this.document.getElementsByClassName("ffe-cl-chapter"));
		const isRead = (e: Element) => !!(e.firstElementChild.firstElementChild as HTMLInputElement).checked;

		let currentBlockIsRead = isRead(elements[0]);
		let currentBlockCount = 0;

		for (let i = 0; i < elements.length; i++) {
			const read = isRead(elements[i]);
			if (read === currentBlockIsRead) {
				// no change from previous chapter, continue
				currentBlockCount++;
				continue;
			}

			if (!currentBlockIsRead && currentBlockCount < 5) {
				// didn't go over enough chapters to hide any
				currentBlockIsRead = read;
				currentBlockCount = 1;

				continue;
			}

			let off = 0;
			if (currentBlockIsRead) {
				// we can hide more chapters if they are already read
				elements.slice(i - currentBlockCount, i)
					.forEach(element => (element as HTMLElement).style.display = "none");
			} else {
				// some unread chapters here, show a bit more of them
				elements.slice(i - currentBlockCount + 2, i - 2)
					.forEach(element => (element as HTMLElement).style.display = "none");
				off = 2;
			}

			// insert a link to show the hidden chapters
			const showLink = document.createElement("a");
			showLink.style.cursor = "pointer";
			showLink.textContent = "Show " + (currentBlockCount - off * 2) + " hidden chapters";
			showLink.addEventListener("click", () => {
				elements.forEach((element: HTMLElement) => element.classList.contains("ffe-cl-collapsed") ?
					element.style.display = "none" : element.style.display = "block");
			});

			const showLinkContainer = document.createElement("li");
			showLinkContainer.classList.add("ffe-cl-chapter", "ffe-cl-collapsed");
			showLinkContainer.appendChild(showLink);

			elements[0].parentElement.insertBefore(showLinkContainer, elements[i - off]);

			currentBlockIsRead = read;
			currentBlockCount = 1;
		}

		// the last visited block might be long enough to hide
		if (currentBlockCount > 6) {
			elements.slice(elements.length - currentBlockCount + 2, elements.length - 3)
				.forEach(element => (element as HTMLElement).style.display = "none");

			const showLink = document.createElement("a");
			showLink.style.cursor = "pointer";
			showLink.textContent = "Show " + (currentBlockCount - 5) + " hidden chapters";
			showLink.addEventListener("click", () => {
				elements.forEach((element: HTMLElement) => element.classList.contains("ffe-cl-collapsed") ?
					element.style.display = "none" : element.style.display = "block");
			});

			const showLinkContainer = document.createElement("li");
			showLinkContainer.classList.add("ffe-cl-chapter", "ffe-cl-collapsed");
			showLinkContainer.appendChild(showLink);

			elements[0].parentElement.insertBefore(showLinkContainer, elements[elements.length - 3]);
		}
	}
}
