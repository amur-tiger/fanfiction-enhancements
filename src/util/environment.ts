declare function xtoast(message: string, time?: number): void;

declare function _fontastic_save(): void;
declare let XCOOKIE: FontasticCookie;

declare const userid: number;
declare const storyid: number;

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

export const ffnServices = Object.freeze({
	xtoast: typeof xtoast === "undefined" ? () => {/*noop*/} : xtoast,
	fontastic: Object.freeze({
		save: (cookie: FontasticCookie) => {
			XCOOKIE = cookie;
			_fontastic_save();
		},
	}),
});

export const environment = Object.freeze({
	currentUserId: typeof userid === "undefined" ? undefined : userid,
	currentStoryId: typeof storyid === "undefined" ? undefined : storyid,
});
