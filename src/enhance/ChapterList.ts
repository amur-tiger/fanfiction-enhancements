import { environment } from "../util/environment";
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

		const chapterList = this.document.createElement("div");
		chapterList.className = "ffe-cl";
		chapterListContainer.appendChild(chapterList);

		const list = this.document.createElement("ol") as HTMLOListElement;
		chapterList.appendChild(list);

		for (const chapter of environment.currentStory.chapters) {
			const $item = $(`<li class="ffe-cl-chapter"><span class="ffe-cl-read"><input type="checkbox"
				id="ffe-cl-chapter-${chapter.id}" ${chapter.read ? "checked" : ""}/>
				<label for="ffe-cl-chapter-${chapter.id}"></label></span><span class="ffe-cl-chapter-title"><a
				href="/s/${environment.currentStoryId}/${chapter.id}/">${chapter.name}</a></span></li>`);
			list.appendChild($item[0]);

			(boundChapter => $item.find("input").click(event => {
				boundChapter.read = (event.target as HTMLInputElement).checked;
			}))(chapter);
		}

		const profileFooter = this.document.getElementsByClassName("ffe-sc-footer")[0];
		const $all = $(`<span class="ffe-cl-read"><input type="checkbox" id="ffe-cl-story-${environment.currentStory.id}"
			${environment.currentStory.read ? "checked" : ""}/>
			<label for="ffe-cl-story-${environment.currentStory.id}"></span>`);
		$all.css({
			height: "auto",
			"margin-left": "10px",
		});
		profileFooter.insertBefore($all[0], profileFooter.firstElementChild);

		$all.find("input").click(event => {
			const message = environment.currentStory.read ? "Mark all as unread?" : "Mark all as read?";
			if (!confirm(message)) {
				event.preventDefault();

				return;
			}

			environment.currentStory.read = (event.target as HTMLInputElement).checked;

			for (const chapter of environment.currentStory.chapters) {
				const item = this.document.getElementById("ffe-cl-chapter-" + chapter.id) as HTMLInputElement;
				item.checked = (event.target as HTMLInputElement).checked;
			}
		});

		contentWrapper.insertBefore(chapterListContainer, this.document.getElementById("review_success"));
	}
}
