/**
 * Loads a script dynamically by creating a script element and attaching it to the head element.
 * @param {string} url
 * @returns {Promise}
 */
export function loadScript(url: string): Promise<Event> {
  return new Promise<Event>((resolve, reject) => {
    const script = document.createElement("script");
    script.addEventListener("load", resolve);
    script.addEventListener("error", (err) => {
      // eslint-disable-next-line no-console
      console.error("Failed to load script: %s", url);
      reject(err);
    });
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
  });
}

/**
 * Parses an RGB-color-string as returned from `element.style.color` to a CSS hex-notation.
 * @param {string} rgb
 * @returns {string|boolean}
 */
export function rgbToHex(rgb: string | undefined): string | boolean {
  if (!rgb || rgb === "inherit") {
    return false;
  }

  const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!match) {
    return false;
  }

  const hex = (x: string) => `0${parseInt(x, 10).toString(16)}`.slice(-2);
  const c = `#${hex(match[1])}${hex(match[2])}${hex(match[3])}`;

  return c === "#000000" ? false : c;
}

/**
 * Converts a font size in PT to a font size in EM, assuming default values for DPI.
 * @param {string} pt
 * @param {number} [base]
 * @returns {string|boolean}
 */
export function ptToEm(pt: string | undefined, base?: number): string | boolean {
  if (!pt || pt.slice(-2) !== "pt") {
    return false;
  }

  const n = +pt.slice(0, -2);
  if (!base && (n === 11 || n === 12)) {
    return false;
  }

  const em = `${+(n / (base || 12)).toFixed(3)}em`;
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
    if (c.indexOf(`${name}=`) === 0) {
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
    expires = `; expires=${date.toUTCString()}`;
  }

  document.cookie = `${name}=${value || ""}${expires}; path=/`;
}

/**
 * Deletes the cookie with the given name.
 * @param {string} name
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=; path=/; max-age=0;`;
}

/**
 * Parses an URL and retrieves key/value pairs from it.
 * @param {string} url
 */
export function parseGetParams(url: string): Record<string, string | boolean> {
  try {
    const params = new URL(url).search.substr(1).split("&");
    const result: Record<string, string | boolean> = {};

    for (const param of params) {
      const parts = param.split("=");
      const key = decodeURIComponent(parts[0]);
      result[key] = parts.length > 1 ? decodeURIComponent(parts[1]) : true;
    }

    return result;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);

    return {};
  }
}

/**
 * Returns a promise that will resolve after the given time in milliseconds.
 * @param {number} time
 */
export function timeout(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
