import { environment } from "../util/environment";
import * as jQueryProxy from "jquery";
import { Enhancer } from "./Enhancer";

import "./MenuBar.css";

const $: JQueryStatic = (jQueryProxy as any).default || jQueryProxy;

export class MenuBar implements Enhancer {
	public enhance(): Promise<any> {
		if (!environment.currentUserName) {
			return;
		}

		const $loginElement = $("#name_login a");

		const $separator = $(`<span class="ffe-mb-separator"></span>`);
		const $toAlerts = $(`<a class="ffe-mb-alerts icon-bookmark-2" href="/alert/story.php"></a>`);
		const $toFavorites = $(`<a class="ffe-mb-favorites icon-heart" href="/favorites/story.php"></a>`);

		$separator.insertAfter($loginElement);
		$toAlerts.insertAfter($separator);
		$toFavorites.insertAfter($toAlerts);

		return Promise.resolve();
	}
}
