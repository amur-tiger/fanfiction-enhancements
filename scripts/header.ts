import pkg from "../package.json";

const commit = process.env.GITHUB_SHA;
const build = process.env.GITHUB_RUN_NUMBER;
const version = `${pkg.version}${build || commit ? "+" : ""}${build ? `${build}.` : ""}${
  commit ? commit.substring(0, 7) : ""
}`;

const header = `// ==UserScript==
// @name         FanFiction Enhancements
// @namespace    https://tiger.rocks/
// @version      ${version}
// @description  ${pkg.description}
// @author       ${pkg.author}
// @copyright    2018-${new Date().getFullYear()}, ${pkg.author}
// @license      MIT, ${pkg.homepage}/blob/master/LICENSE
// @homepageURL  ${pkg.homepage}
// @supportURL   ${pkg.bugs.url}
// @updateURL    https://amur-tiger.github.io/fanfiction-enhancements/latest/fanfiction-enhancements.meta.js
// @downloadURL  https://amur-tiger.github.io/fanfiction-enhancements/latest/fanfiction-enhancements.user.js
// @require      https://unpkg.com/jszip@${pkg.dependencies["jszip"].replace(/^[~^]/, "")}/dist/jszip.min.js
// @match        *://www.fanfiction.net/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @connect      self
// @connect      fanfiction.net
// @connect      accounts.google.com
// ==/UserScript==
`;

export default header;
