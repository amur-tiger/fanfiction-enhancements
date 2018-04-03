/**
 * Loads a script dynamically by creating a script element and attaching it to the head element.
 * @param {string} url
 * @returns {Promise}
 */
export function loadScript(url: string): Promise<Event> {
	return new Promise<Event>((resolve, reject) => {
		const script = document.createElement("script");
		script.addEventListener("load", resolve);
		script.addEventListener("error", err => {
			console.error("Failed to load script: %s", url);
			reject(err);
		});
		script.src = url;
		document.getElementsByTagName("head")[0].appendChild(script);
	});
}

/**
 * Makes an AJAX GET call, optionally with additional headers.
 * @param {string} url
 * @param {object} [options]
 * @returns {Promise}
 */
export function getByAjax(url: string, options?): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.addEventListener("load", () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				resolve(xhr.response);
			} else {
				reject(xhr.response);
			}
		});
		xhr.addEventListener("error", () => {
			reject(xhr.response);
		});
		xhr.open("GET", url, true);
		if (options && options.headers) {
			Object.keys(options.headers).forEach(key => {
				xhr.setRequestHeader(key, options.headers[key]);
			});
		}
		xhr.send();
	});
}

/**
 * Parses an RGB-color-string as returned from `element.style.color` to a CSS hex-notation.
 * @param {string} rgb
 * @returns {string|boolean}
 */
export function rgbToHex(rgb: string): string | boolean {
	if (!rgb || rgb == "inherit" || typeof rgb != "string") {
		return false;
	}

	const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	if (!match) {
		return false;
	}

	const hex = x => ("0" + parseInt(x, 10).toString(16)).slice(-2);
	const c = "#" + hex(match[1]) + hex(match[2]) + hex(match[3]);

	return c == "#000000" ? false : c;
}

/**
 * Converts a font size in PT to a font size in EM, assuming default values for DPI.
 * @param {string} pt
 * @param {number} [base]
 * @returns {string|boolean}
 */
export function ptToEm(pt: string, base?: number): string | boolean {
	if (!pt || typeof pt !== "string" || pt.slice(-2) !== "pt") {
		return false;
	}

	const n = +pt.slice(0, -2);
	if (!base && (n === 11 || n === 12)) {
		return false;
	}

	const em = +(n / (base || 12)).toFixed(3) + "em";
	if (em === "1em") {
		return false;
	}

	return em;
}

/**
 * Reads in cookies and extracts the value of the cookie with the given name.
 * If the cookie doesn't exist, returns false.
 * @param {string} name
 * @returns {string | boolean}
 */
export function getCookie(name: string): string | boolean {
	const ca = document.cookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		const c = ca[i].trimLeft();
		if (c.indexOf(name + "=") == 0) {
			return c.substring(name.length + 1, c.length);
		}
	}

	return false;
}

/**
 * Sets the cookie with the given name to the given value. If days is not given, an expiration date is not set
 * and the cookie will be deleted at the end of the session.
 * @param {string} name
 * @param {string} value
 * @param {number} days
 */
export function setCookie(name: string, value: string, days?: number): void {
	let expires = "";
	if (days) {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = "; expires=" + date.toUTCString();
	}

	document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

/**
 * Deletes the cookie with the given name.
 * @param {string} name
 */
export function deleteCookie(name: string): void {
	document.cookie = name + "=; path=/; max-age=0;";
}
