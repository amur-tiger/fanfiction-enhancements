import { environment } from "../util/environment";
import { Enhancer } from "./Enhancer";

import "./MenuBar.css";

export class MenuBar implements Enhancer {
	public async enhance(): Promise<any> {
		if (!environment.currentUserName) {
			return;
		}

		const loginElement = document.querySelector("#name_login a");
		const parent = loginElement.parentElement;
		const ref = loginElement.nextElementSibling;

		const toAlerts = document.createElement("a") as HTMLAnchorElement;
		toAlerts.classList.add("ffe-mb-alerts", "icon-bookmark-2");
		toAlerts.href = "/alert/story.php";

		const toFavorites = document.createElement("a") as HTMLAnchorElement;
		toFavorites.classList.add("ffe-mb-favorites", "icon-heart");
		toFavorites.href = "/favorites/story.php";

		const separator = document.createElement("span");
		separator.classList.add("ffe-mb-separator");

		parent.insertBefore(toAlerts, ref);
		parent.insertBefore(toFavorites, ref);
		parent.insertBefore(separator, ref);
	}
}
