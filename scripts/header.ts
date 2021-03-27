import pkg from "../package.json";

const commit = process.env.GITHUB_SHA;
const build = process.env.GITHUB_RUN_NUMBER;
const version = `${pkg.version}${build || commit ? "+" : ""}${build ? `${build}.` : ""}${
  commit ? commit.substr(0, 7) : ""
}`;

const header = `// ==UserScript==
// @name         FanFiction Enhancements
// @namespace    https://tiger.rocks/
// @version      ${version}
// @description  ${pkg.description}
// @author       ${pkg.author}
// @copyright    2018, ${pkg.author}
// @license      MIT, ${pkg.homepage}/blob/master/LICENSE
// @homepageURL  ${pkg.homepage}
// @supportURL   ${pkg.bugs.url}
// @updateURL    https://amur-tiger.github.io/fanfiction-enhancements/latest/fanfiction-enhancements.meta.js
// @downloadURL  https://amur-tiger.github.io/fanfiction-enhancements/latest/fanfiction-enhancements.user.js
// @require      https://unpkg.com/ffn-parser@${pkg.dependencies["ffn-parser"]}/lib/index.iife.min.js
// @match        *://www.fanfiction.net/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @connect      self
// ==/UserScript==
`;

export default header;
