import { ffnServices } from "../util/environment";
import { getCookie } from "../utils";
import { Enhancer } from "./Enhancer";

import "./StoryText.css";

export class StoryText implements Enhancer {
	constructor(private text: HTMLElement) {
	}

	public enhance() {
		this.fixUserSelect();

		if (!getCookie("xcookie2")) {
			const cookie = {
				read_font: "Open Sans",
				read_font_size: "1.2",
				read_line_height: "2.00",
				read_width: 75,
			};
			ffnServices.fontastic.save(cookie);

			const text = this.text.firstElementChild as HTMLElement;
			text.style.fontFamily = cookie.read_font;
			text.style.fontSize = cookie.read_font_size + "em";
			text.style.lineHeight = cookie.read_line_height;
			text.style.width = cookie.read_width + "%";
		}
	}

	private fixUserSelect() {
		const element = this.text;
		const handle = setInterval(() => {
			const rules = ["userSelect", "msUserSelect", "mozUserSelect", "khtmlUserSelect",
				"webkitUserSelect", "webkitTouchCallout"];

			let isOk = true;
			for (const rule of rules) {
				if (element.style[rule] !== "inherit") {
					isOk = false;
				}

				element.style[rule] = "inherit";
			}

			if (isOk) {
				clearTimeout(handle);
			}
		}, 150);
	}
}
