import { getCookie } from "../utils";
import "./StoryText.css";

declare const XCOOKIE;

declare function _fontastic_save(): void;

export default class StoryText {
	constructor(private text: HTMLElement) {
		// nothing to do here
	}

	public enhance() {
		this.fixUserSelect();

		if (!getCookie("xcookie2")) {
			XCOOKIE.read_font = "Open Sans";
			XCOOKIE.read_font_size = "1.2";
			XCOOKIE.read_line_height = "2.00";
			XCOOKIE.read_width = 75;
			_fontastic_save();

			const text = this.text.firstElementChild as HTMLElement;
			text.style.fontFamily = XCOOKIE.read_font;
			text.style.fontSize = XCOOKIE.read_font_size + "em";
			text.style.lineHeight = XCOOKIE.read_line_height;
			text.style.width = XCOOKIE.read_width + "%";
		}
	}

	private fixUserSelect() {
		const element = this.text;
		const handle = setInterval(() => {
			if (element.style.userSelect == "text") {
				clearTimeout(handle);
			} else {
				element.style.userSelect = "text";
			}
		}, 150);
	}
}
