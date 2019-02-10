import { environment } from "../util/environment";
import { DropBox } from "../api/DropBox";
import { Enhancer } from "./Enhancer";

import "./MenuBar.css";

export class MenuBar implements Enhancer {
	constructor(private readonly dropBox: DropBox) {
	}

	public async enhance(): Promise<any> {
		if (!environment.currentUserName) {
			return;
		}

		const loginElement = document.querySelector("#name_login a");
		const parent = loginElement.parentElement;
		const ref = loginElement.nextElementSibling;

		const toAlerts = document.createElement("a");
		toAlerts.classList.add("ffe-mb-icon", "ffe-mb-alerts", "icon-bookmark-2");
		toAlerts.title = "Go to Story Alerts";
		toAlerts.href = "/alert/story.php";

		const toFavorites = document.createElement("a");
		toFavorites.classList.add("ffe-mb-icon", "ffe-mb-favorites", "icon-heart");
		toFavorites.title = "Go to Story Favorites";
		toFavorites.href = "/favorites/story.php";

		const toDropBox = document.createElement("a");
		toDropBox.classList.add("ffe-mb-icon", "ffe-mb-dropbox");
		toDropBox.title = "Connect to DropBox";
		toDropBox.href = "#";
		toDropBox.innerHTML = "<svg id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 42.4 39.5\" " +
			"width=\"16\" height=\"16\"><style>.st0{fill:#fff}</style><path class=\"st0\" " +
			"d=\"M10.6 1.7L0 8.5l10.6 6.7 10.6-6.7zm21.2 0L21.2 8.5l10.6 6.7 10.6-6.7zM0 22l10.6 6.8L21.2 " +
			"22l-10.6-6.8zm31.8-6.8L21.2 22l10.6 6.8L42.4 22zM10.6 31l10.6 6.8L31.8 31l-10.6-6.7z\"/></svg>";

		if (await this.dropBox.isAuthorized()) {
			toDropBox.classList.add("ffe-mb-checked");
		}

		toDropBox.addEventListener("click", async event => {
			event.preventDefault();
			await this.dropBox.authorize();
			toDropBox.classList.add("ffe-mb-checked");
		});

		const separator = document.createElement("span");
		separator.classList.add("ffe-mb-separator");

		parent.insertBefore(toAlerts, ref);
		parent.insertBefore(toFavorites, ref);
		parent.insertBefore(toDropBox, ref);
		parent.insertBefore(separator, ref);
	}
}
