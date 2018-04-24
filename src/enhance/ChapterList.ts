import { environment } from "../util/environment";
import * as ko from "knockout";
import { Enhancer } from "./Enhancer";

import "./ChapterList.css";

export class ChapterList implements Enhancer {
	public constructor(private document: Document) {
	}

	public enhance() {
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
					</li>
				</ol>
			</div>`;
		contentWrapper.insertBefore(chapterListContainer, this.document.getElementById("review_success"));

		const profileFooter = this.document.getElementsByClassName("ffe-sc-footer")[0];
		const allReadContainer = this.document.createElement("span");
		allReadContainer.className = "ffe-cl-read";
		allReadContainer.style.height = "auto";
		allReadContainer.style.marginLeft = "10px";
		allReadContainer.innerHTML =
			`<input type="checkbox" data-bind="attr: { id: 'ffe-cl-story-' + id }, checked: read"/>
			<label data-bind="attr: { for: 'ffe-cl-story-' + id }"/>`;
		profileFooter.insertBefore(allReadContainer, profileFooter.firstElementChild);

		ko.applyBindings(environment.currentStory, this.document.getElementById("content_wrapper_inner"));
	}
}
