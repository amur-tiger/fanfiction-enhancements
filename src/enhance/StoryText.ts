import { ffnServices } from "../util/environment";
import { getCookie } from "../utils";
import { Enhancer } from "./Enhancer";

import "./StoryText.css";

export class StoryText implements Enhancer {
	constructor(private document: Document) {
	}

	public enhance() {
		const textContainer = this.document.getElementById("storytextp");
		if (!textContainer) {
			throw new Error("Could not find text container element.");
		}

		this.fixUserSelect(textContainer);

		if (!getCookie("xcookie2")) {
			const cookie = {
				read_font: "Open Sans",
				read_font_size: "1.2",
				read_line_height: "2.00",
				read_width: 75,
			};
			ffnServices.fontastic.save(cookie);

			const text = textContainer.firstElementChild as HTMLElement;
			text.style.fontFamily = cookie.read_font;
			text.style.fontSize = cookie.read_font_size + "em";
			text.style.lineHeight = cookie.read_line_height;
			text.style.width = cookie.read_width + "%";
		}
	}

	private fixUserSelect(textContainer: HTMLElement) {
		const handle = setInterval(() => {
			const rules = ["userSelect", "msUserSelect", "mozUserSelect", "khtmlUserSelect",
				"webkitUserSelect", "webkitTouchCallout"];

			let isOk = true;
			for (const rule of rules) {
				if (textContainer.style[rule] !== "inherit") {
					isOk = false;
				}

				textContainer.style[rule] = "inherit";
			}

			if (isOk) {
				clearTimeout(handle);
			}
		}, 150);
	}
}
