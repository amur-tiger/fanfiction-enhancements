export default class Util {
	/**
	 * Loads a script dynamically by creating a script element and attaching it to the head element.
	 * @param {string} url
	 * @returns {Promise}
	 */
	static loadScript(url: string): Promise<Event> {
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
	static getByAjax(url: string, options?): Promise<string> {
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
	static rgbToHex(rgb: string): string | boolean {
		if (!rgb || rgb == "inherit" || typeof rgb != "string") return false;
		const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		if (!match) return false;
		const hex = x => ("0" + parseInt(x).toString(16)).slice(-2);
		const c = "#" + hex(match[1]) + hex(match[2]) + hex(match[3]);
		return c == "#000000" ? false : c;
	}

	/**
	 * Converts a font size in PT to a font size in EM, assuming default values for DPI.
	 * @param {string} pt
	 * @param {number} [base]
	 * @returns {string|boolean}
	 */
	static ptToEm(pt: string, base?: number): string | boolean {
		if (!pt || typeof pt !== "string" || pt.slice(-2) !== "pt") return false;
		const n = +pt.slice(0, -2);
		if (!base && (n === 11 || n === 12)) return false;
		const em = +(n / (base || 12)).toFixed(3) + "em";
		if (em === "1em") return false;
		return em;
	}

	/**
	 * Turns anything that has a length and an indexer to access values into a proper array.
	 * @param value
	 * @returns {Array}
	 */
	static toArray<T>(value: { length: number, [i: number]: T }): T[] {
		const result = [];
		for (let i = 0; i < value.length; i++) {
			result.push(value[i]);
		}

		return result;
	}
}
