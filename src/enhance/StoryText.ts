import { getCookie } from "../utils";
import { Enhancer } from "./Enhancer";

import "./StoryText.css";

export class StoryText implements Enhancer {
	public async enhance(): Promise<any> {
		const textContainer = document.getElementById("storytextp");
		if (!textContainer) {
			throw new Error("Could not find text container element.");
		}

		this.fixUserSelect(textContainer);

		if (!getCookie("xcookie2")) {
			XCOOKIE.read_font = "Open Sans";
			XCOOKIE.read_font_size = 1.2;
			XCOOKIE.read_line_height = 2;
			XCOOKIE.read_width = 75;

			_fontastic_save();

			const text = textContainer.firstElementChild as HTMLElement;
			text.style.fontFamily = XCOOKIE.read_font;
			text.style.fontSize = XCOOKIE.read_font_size + "em";
			text.style.lineHeight = XCOOKIE.read_line_height + "";
			text.style.width = XCOOKIE.read_width + "%";
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
