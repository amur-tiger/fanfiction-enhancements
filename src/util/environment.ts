import {  Chapter, Story } from "../api/data";

declare function xtoast(message: string, time?: number): void;
declare function xwindow(url: string, width: number, height: number): Window;

declare function _fontastic_save(): void;
declare let XCOOKIE: FontasticCookie;

declare const userid: number;
declare const XUNAME: string;
declare const storyid: number;
declare const chapter: number;

declare const array_censors: string[];
declare const array_genres: string[];
declare const array_languages: string[];
declare const array_status: string[];

export interface FontasticCookie {
	gui_font?: string;
	read_dark_texture?: string;
	read_font?: string;
	read_font_size?: string;
	read_light_texture?: string;
	read_line_height?: string;
	reat_theme?: string;
	read_width?: number;
}

export const enum Page {
	Other,
	User,
	Alerts,
	Favorites,
	Story,
	Chapter,
}

export const ffnServices = {
	xtoast: typeof xtoast === "undefined" ? () => {/*noop*/} : xtoast,
	xwindow: typeof xwindow === "undefined" ? () => {/*noop*/} : xwindow,
	fontastic: {
		save: (cookie: FontasticCookie) => {
			XCOOKIE = cookie;
			_fontastic_save();
		},
	},
};

export const environment = {
	currentUserId: typeof userid === "undefined" ? undefined : userid,
	currentUserName: typeof XUNAME === "undefined" ? undefined : XUNAME,
	currentStoryId: typeof storyid === "undefined" ? undefined : storyid,
	currentChapterId: typeof chapter === "undefined" ? undefined : chapter,

	currentPageType: getPage(location),

	validGenres: typeof array_genres === "undefined" ? [] : array_genres.slice(1),
	validLanguages: typeof array_languages === "undefined" ? [] : array_languages.slice(1),
};

export function getPage(location: Location): Page {
	if (location.pathname.indexOf("/u/") === 0) {
		return Page.User;
	}

	if (location.pathname.indexOf("/alert/story.php") === 0) {
		return Page.Alerts;
	}

	if (location.pathname.indexOf("/favorites/story.php") === 0) {
		return Page.Favorites;
	}

	if (location.pathname.match(/^\/s\/\d+\/?$/i)) {
		return Page.Story;
	}

	if (location.pathname.indexOf("/s/") === 0) {
		return Page.Chapter;
	}

	return Page.Other;
}
