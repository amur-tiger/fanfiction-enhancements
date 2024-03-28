/**
 * Shows a small popup message for a specified amount of time in milliseconds. If no time is specified, the
 * message will be shown for 2500 milliseconds.
 * @param message
 * @param time
 */
declare function xtoast(message: string, time?: number): void;

/**
 * Opens a new popup window with the specified URL and dimensions.
 * @param url
 * @param width
 * @param height
 */
declare function xwindow(url: string, width: number, height: number): Window;

/**
 * If the user is logged in, contains the user name as retrieved from the "funn" cookie.
 */
declare const XUNAME: false | string;

/**
 * True if user agent contains "android", "kindle" or "silk".
 */
declare const isAndroid: boolean;

/**
 * True if user agent contains "kindle" or "silk".
 */
declare const isKindle: boolean;

/**
 * True if user agent contains "mobile".
 */
declare const isGenericMobile: boolean;

/**
 * True if user agent contains "ipad".
 */
declare const isIpad: boolean;

/**
 * True if user agent contains "iphone" or "ipod".
 */
declare const isIphone: boolean;

/**
 * True if user agent contains "nt 6.0". (Shows when FFN was last updated...)
 */
declare const isVista: boolean;

/**
 * True if user agent contains "nt 5".
 */
declare const isXp: boolean;

/**
 * True if isAndroid, isIpad, isIphone or isGenericMobile are true.
 */
declare const isMobile: boolean;

/**
 * Interface for Fontastic settings. These settings are usually saved to a cookie.
 */
interface FontasticCookie {
  /**
   * The used gui font name, "Verdana" by default.
   */
  gui_font: string;

  /**
   * The used font name, "Verdana" by default.
   */
  read_font: string;

  /**
   * The used font size in em, 1 by default.
   */
  read_font_size: number;

  /**
   * The used line height, 1.25 by default.
   */
  read_line_height: number;

  /**
   * The used theme, "light" by default.
   */
  read_theme: "light" | "dark";

  /**
   * The used width in percent, 100 by default.
   */
  read_width: number;

  read_light_texture: string;
  read_dark_texture: string;
}

/**
 * A variable containing Fontastic settings.
 */
declare let XCOOKIE: FontasticCookie;

/**
 * Saves the XCOOKIE variable to the cookie "xcookie2", JSON-encoded. The cookie expires after 365 days.
 */
declare function _fontastic_save(): void;

/**
 * Sets the theme to light or dark. Changes are saved using the _fontastic_save()-function.
 * @param theme
 */
declare function _fontastic_change_theme(theme: "light" | "dark"): void;

/**
 * Updates the line height. If the direction is "u", increases the line height by 0.25. If the direction is "d",
 * decreases the line height by 0.25. If the resulting line height is between 1.25 and 2, the new value is
 * applied and saved.
 * @param direction
 */
declare function _fontastic_change_line_height(direction: "u" | "d"): void;

/**
 * Updates the font size. If the direction is "u", increases the font size by 0.1em. If the direction is "d",
 * decreases the font size by 0.1em. If the resulting font size is between 0em and 3em, the new value is
 * applied and saved.
 * @param direction
 */
declare function _fontastic_change_size(direction: "u" | "d"): void;

/**
 * Changes the width of the text to the new percent value. The value will only be applied and saved if it is
 * between 50% and 100%.
 * @param width
 */
declare function _fontastic_change_width(width: number): void;

/**
 * Shows or hides the element with the given id based on the show value.
 * @param id
 * @param show
 */
declare function switchLayer(id: string, show: boolean): void;

/**
 * Adds thousand separators to the given number.
 * @param num
 */
declare function addCommas(num: number | string): string;

/**
 * Formats the given date according to the given pattern string.
 * @param date
 * @param pattern
 */
declare function formatDate(date: Date, pattern: string): string;

/**
 * Contains all ratings. This array is 1-based, the first element is a "0"!
 */
declare const array_censors: string[];

/**
 * Contains all genres. The first element is "None"!
 */
declare const array_genres: string[];

/**
 * Contains all languages. This array is 1-based, the first element is "0"!
 */
declare const array_languages: string[];

/**
 * Contains all story statuses. This array is 1-based, the first element is "0"!
 */
declare const array_status: string[];

/**
 * Contains shortened month names.
 */
declare const _xmonth_short: string[];

/**
 * Contains full month names.
 */
declare const _xmonth_full: string[];

// tslint:disable-next-line:class-name
declare interface _xotime {
  date: Date;
  unix: number;
  year: number;
  year_short: number;
  month_short: string;
  month_full: string;
  month: number;
  day: number;
  hour: number;
  min: number;
  sec: number;
}

/**
 * Converts a unix timestamp to _xotime.
 * @param timestamp
 */
declare function _unixtoxotime(timestamp: number): _xotime;

/**
 * Formats the given date in a human-readable format.
 * @param time
 */
declare function _xeasydate(time: _xotime): string;

/**
 * For all elements that have a "data-xutime" attribute containing a unix timestamp, their contents are set to a human-
 * readable format of the timestamp using the _xeasydate() function.
 */
declare function _xtimemachine(): void;

/**
 * Contains the current story id. This variable is only declared on story pages!
 */
declare const storyid: void | number;

/**
 * Contains the current user id. This variable is only declared on story pages!
 */
declare const userid: void | number;

/**
 * Contains the current story text id. This variable is only declared on story pages!
 */
declare const storytextid: void | number;

/**
 * Contains the current chapter id. This variable is only declared on story pages!
 */
declare const chapter: void | number;

/**
 * Contains the current story title. This variable is URL encoded and only declared on story pages!
 */
declare const title: void | string;
