// ==UserScript==
// @name         FanFiction Enhancements
// @namespace    https://tiger.rocks/
// @version      0.6.0+61.970dfd4
// @description  FanFiction.net Enhancements
// @author       Arne 'TigeR' Linck
// @copyright    2018, Arne 'TigeR' Linck
// @license      MIT, https://github.com/NekiCat/fanfiction-enhancements/blob/master/LICENSE
// @homepageURL  https://github.com/NekiCat/fanfiction-enhancements
// @supportURL   https://github.com/NekiCat/fanfiction-enhancements/issues
// @updateURL    https://nekicat.github.io/fanfiction-enhancements/latest/fanfiction-enhancements.meta.js
// @downloadURL  https://nekicat.github.io/fanfiction-enhancements/latest/fanfiction-enhancements.user.js
// @match        *://www.fanfiction.net/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// ==/UserScript==

(function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    const ffnServices = {
        xtoast: typeof xtoast === "undefined" ? () => undefined : xtoast,
        xwindow: typeof xwindow === "undefined" ? () => undefined : xwindow,
        fontastic: {
            save: (cookie) => {
                XCOOKIE = cookie;
                _fontastic_save();
            },
        },
    };
    const environment = {
        currentUserId: typeof userid === "undefined" ? undefined : userid,
        currentUserName: typeof XUNAME === "undefined" ? undefined : XUNAME,
        currentStoryId: typeof storyid === "undefined" ? undefined : storyid,
        currentChapterId: typeof chapter === "undefined" ? undefined : chapter,
        currentPageType: getPage(location),
        validGenres: typeof array_genres === "undefined" ? [] : array_genres.slice(1),
        validLanguages: typeof array_languages === "undefined" ? [] : array_languages.slice(1),
    };
    function getPage(location) {
        if (location.pathname.indexOf("/u/") === 0) {
            return 1 /* User */;
        }
        if (location.pathname.indexOf("/alert/story.php") === 0) {
            return 2 /* Alerts */;
        }
        if (location.pathname.indexOf("/favorites/story.php") === 0) {
            return 3 /* Favorites */;
        }
        if (location.pathname.match(/^\/s\/\d+\/?$/i)) {
            return 4 /* Story */;
        }
        if (location.pathname.indexOf("/s/") === 0) {
            return 5 /* Chapter */;
        }
        if (location.pathname.indexOf("/ffe-oauth2-return") === 0) {
            return 6 /* OAuth2 */;
        }
        return 0 /* Other */;
    }

    function parseProfile(fragment) {
        const container = typeof fragment === "string" ? (() => {
            const template = document.createElement("template");
            template.innerHTML = fragment;
            return template.content;
        })() : fragment;
        const profileElement = container.getElementById("profile_top");
        const chapterElement = container.getElementById("chap_select");
        if (!profileElement) {
            console.error("Profile node not found. Cannot parse story info.");
            return undefined;
        }
        let offset = 0;
        const cover = profileElement.children[0].firstElementChild;
        if (!cover || cover.nodeName !== "IMG") {
            offset--;
        }
        const titleElement = profileElement.children[offset + 2];
        const authorElement = profileElement.children[offset + 4];
        const descriptionElement = profileElement.children[offset + 7];
        const tagsElement = profileElement.children[offset + 8];
        const resultMeta = parseTags(tagsElement);
        if (cover && cover.nodeName === "IMG") {
            resultMeta.imageUrl = cover.src;
            const oImage = document && document.querySelector("#img_large img");
            if (oImage && oImage.nodeName === "IMG") {
                resultMeta.imageOriginalUrl = oImage.getAttribute("data-original");
            }
        }
        return {
            id: resultMeta.id,
            title: titleElement.textContent,
            author: authorElement.textContent,
            authorId: +authorElement.href.match(/\/u\/(\d+)\//i)[1],
            description: descriptionElement.textContent,
            chapters: chapterElement ? parseChapters(resultMeta.id, chapterElement) : [{
                    storyId: resultMeta.id,
                    id: 1,
                    name: titleElement.textContent,
                }],
            imageUrl: resultMeta.imageUrl,
            imageOriginalUrl: resultMeta.imageOriginalUrl,
            favorites: resultMeta.favs,
            follows: resultMeta.follows,
            reviews: resultMeta.reviews,
            genre: resultMeta.genre,
            language: resultMeta.language,
            published: resultMeta.published ? resultMeta.published.toISOString() : undefined,
            updated: resultMeta.updated ? resultMeta.updated.toISOString() : undefined,
            rating: resultMeta.rating,
            words: resultMeta.words,
            characters: resultMeta.characters,
            status: resultMeta.status,
        };
    }
    function parseTags(tagsElement) {
        const result = {
            genre: [],
            characters: [],
        };
        const tagsArray = tagsElement.innerHTML.split(" - ");
        const tempElement = document.createElement("div");
        tempElement.innerHTML = tagsArray[0].trim().substring(7).replace(/>.*?\s+(.*?)</, ">$1<");
        result.rating = tempElement.firstElementChild.textContent;
        result.language = tagsArray[1].trim();
        result.genre = tagsArray[2].trim().split("/");
        // Some stories might not have a genre tagged. If so, index 2 should be the characters instead.
        if (result.genre.some(g => !environment.validGenres.includes(g))) {
            result.genre = [];
            result.characters = parseCharacters(tagsArray[2]);
        }
        for (let i = 3; i < tagsArray.length; i++) {
            const tagNameMatch = tagsArray[i].match(/^(\w+):/);
            if (!tagNameMatch) {
                result.characters = parseCharacters(tagsArray[i]);
                continue;
            }
            const tagName = tagNameMatch[1].toLowerCase();
            const tagValue = tagsArray[i].match(/^.*?:\s+([^]*?)\s*$/)[1];
            switch (tagName) {
                case "reviews":
                    tempElement.innerHTML = tagValue;
                    result.reviews = +tempElement.firstElementChild.textContent.replace(/,/g, "");
                    break;
                case "published":
                case "updated":
                    tempElement.innerHTML = tagValue;
                    result[tagName] = new Date(+tempElement.firstElementChild.getAttribute("data-xutime") * 1000);
                    result[tagName + "Words"] = tempElement.firstElementChild.textContent.trim();
                    break;
                default:
                    if (/^[0-9,.]*$/.test(tagValue)) {
                        result[tagName] = +tagValue.replace(/,/g, "");
                    }
                    else {
                        result[tagName] = tagValue;
                    }
                    break;
            }
        }
        return result;
    }
    function parseCharacters(tag) {
        const result = [];
        const pairings = tag.trim().split(/([\[\]])\s*/).filter(pairing => pairing.length);
        let inPairing = false;
        for (const pairing of pairings) {
            if (pairing == "[") {
                inPairing = true;
                continue;
            }
            if (pairing == "]") {
                inPairing = false;
                continue;
            }
            const characters = pairing.split(/,\s+/);
            if (!inPairing || characters.length == 1) {
                result.push(...characters);
            }
            else {
                result.push(characters);
            }
        }
        return result;
    }
    /**
     * Parses chapters of the currently opened story. Warning: chapter word counts will not be set!
     *
     * @param {number} storyId
     * @param {ParentNode} selectElement
     * @returns {Chapter[]}
     */
    function parseChapters(storyId, selectElement) {
        const result = [];
        for (let i = 0; i < selectElement.children.length; i++) {
            const option = selectElement.children[i];
            if (option.tagName !== "OPTION") {
                continue;
            }
            result.push({
                storyId: storyId,
                id: +option.getAttribute("value"),
                name: option.textContent,
            });
        }
        return result;
    }
    function parseFollowedStoryList(fragment) {
        const container = typeof fragment === "string" ? (() => {
            const template = document.createElement("template");
            template.innerHTML = fragment;
            return template.content;
        })() : fragment;
        const rows = container.querySelectorAll("#gui_table1i tbody tr");
        return Array.from(rows)
            .filter(row => {
            return row.firstElementChild.colSpan === 1;
        })
            .map(row => {
            const storyAnchor = row.children[0].firstElementChild;
            const authorAnchor = row.children[1].firstElementChild;
            return {
                row: row,
                id: +storyAnchor.href.match(/\/s\/(\d+)\/.*/i)[1],
                title: storyAnchor.textContent,
                author: {
                    id: +authorAnchor.href.match(/\/u\/(\d+)\/.*/i)[1],
                    name: authorAnchor.textContent,
                    profileUrl: authorAnchor.href,
                    avatarUrl: "",
                },
            };
        });
    }

    /**
     * Loads a script dynamically by creating a script element and attaching it to the head element.
     * @param {string} url
     * @returns {Promise}
     */
    /**
     * Reads in cookies and extracts the value of the cookie with the given name.
     * If the cookie doesn't exist, returns false.
     * @param {string} name
     * @returns {string | boolean}
     */
    function getCookie(name) {
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
     * Parses an URL and retrieves key/value pairs from it.
     * @param {string} url
     */
    function parseGetParams(url) {
        try {
            const params = new URL(url).search.substr(1).split("&");
            const result = {};
            for (const param of params) {
                const parts = param.split("=");
                result[decodeURIComponent(parts[0])] = parts.length > 1 ? decodeURIComponent(parts[1]) : true;
            }
            return result;
        }
        catch (e) {
            console.error(e);
            return {};
        }
    }

    class Api {
        /**
         * Retrieves all story alerts that are set on FFN for the current user.
         */
        getStoryAlerts() {
            return __awaiter(this, void 0, void 0, function* () {
                const fragments = yield this.getMultiPage("/alert/story.php");
                const result = [];
                for (const fragment of fragments) {
                    result.push(...parseFollowedStoryList(fragment));
                }
                return result;
            });
        }
        /**
         * Retrieves all favorites that are set on FFN for the current user.
         */
        getStoryFavorites() {
            return __awaiter(this, void 0, void 0, function* () {
                const fragments = yield this.getMultiPage("/favorites/story.php");
                const result = [];
                for (const fragment of fragments) {
                    result.push(...parseFollowedStoryList(fragment));
                }
                return result;
            });
        }
        getStoryData(id) {
            return __awaiter(this, void 0, void 0, function* () {
                const data = yield this.get("/s/" + id);
                return parseProfile(data);
            });
        }
        getChapterWordCount(storyId, chapterId) {
            return __awaiter(this, void 0, void 0, function* () {
                const body = yield this.get("/s/" + storyId + "/" + chapterId);
                const template = document.createElement("template");
                template.innerHTML = body;
                return template.content.getElementById("storytext")
                    .textContent.trim().split(/\s+/).length;
            });
        }
        addStoryAlert(id) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.post("/api/ajax_subs.php", {
                    storyid: id,
                    userid: environment.currentUserId,
                    storyalert: 1,
                }, "json");
            });
        }
        removeStoryAlert(id) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.post("/alert/story.php", {
                    action: "remove-multi",
                    "rids[]": id,
                }, "html");
            });
        }
        addStoryFavorite(id) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.post("/api/ajax_subs.php", {
                    storyid: id,
                    userid: environment.currentUserId,
                    favstory: 1,
                }, "json");
            });
        }
        removeStoryFavorite(id) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.post("/favorites/story.php", {
                    action: "remove-multi",
                    "rids[]": id,
                }, "html");
            });
        }
        get(url) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("%c[Api] %cGET %c%s", "color: gray", "color: blue", "color: inherit", url);
                const response = yield fetch(url);
                return response.text();
            });
        }
        getMultiPage(url) {
            return __awaiter(this, void 0, void 0, function* () {
                const body = yield this.get(url);
                const template = document.createElement("template");
                template.innerHTML = body;
                const pageCenter = template.content.querySelector("#content_wrapper_inner center");
                if (!pageCenter) {
                    return [template.content];
                }
                const nextLink = pageCenter.lastElementChild;
                const lastLink = nextLink.previousElementSibling;
                const relevantLink = lastLink && lastLink.textContent === "Last" ? lastLink : nextLink;
                const max = +parseGetParams(relevantLink.href).p;
                const result = [Promise.resolve(template.content)];
                for (let i = 2; i <= max; i++) {
                    result.push(this.get(url + "?p=" + i)
                        .then(nextBody => {
                        const nextTemplate = document.createElement("template");
                        nextTemplate.innerHTML = nextBody;
                        return nextTemplate.content;
                    }));
                }
                return Promise.all(result);
            });
        }
        post(url, data, expect) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("%c[Api] %cPOST %c%s", "color: gray", "color: blue", "color: inherit", url);
                const formData = new FormData();
                for (const key in data) {
                    if (!data.hasOwnProperty(key)) {
                        continue;
                    }
                    formData.append(key, data[key]);
                }
                const response = yield fetch(url, {
                    method: "POST",
                    body: formData,
                    referrer: url,
                });
                if (expect === "json") {
                    const json = yield response.json();
                    if (json.error) {
                        throw new Error(json.error_msg);
                    }
                    return json;
                }
                else {
                    const template = document.createElement("template");
                    template.innerHTML = yield response.text();
                    const err = template.content.querySelector(".gui_error");
                    if (err) {
                        throw new Error(err.textContent);
                    }
                    const msg = template.content.querySelector(".gui_success");
                    if (msg) {
                        return {
                            payload_type: "html",
                            payload_data: msg.innerHTML,
                        };
                    }
                }
            });
        }
    }

    class React {
        static createElement(tag, attrs, ...children) {
            let element;
            if (typeof tag === "string") {
                element = document.createElement(tag);
                for (const name in attrs) {
                    if (!attrs.hasOwnProperty(name)) {
                        continue;
                    }
                    const value = attrs[name];
                    if (typeof value === "function") {
                        element[name] = value;
                    }
                    else if (value === true) {
                        element.setAttribute(name, name);
                    }
                    else if (value !== false && value != undefined) {
                        element.setAttribute(name, value.toString());
                    }
                }
            }
            else {
                const component = new tag(attrs);
                element = component.render();
            }
            for (const child of children) {
                if (!child) {
                    continue;
                }
                element.appendChild(child.nodeType == undefined ? document.createTextNode(child.toString()) : child);
            }
            return element;
        }
    }

    function styleInject(css, ref) {
      if ( ref === void 0 ) ref = {};
      var insertAt = ref.insertAt;

      if (!css || typeof document === 'undefined') { return; }

      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';

      if (insertAt === 'top') {
        if (head.firstChild) {
          head.insertBefore(style, head.firstChild);
        } else {
          head.appendChild(style);
        }
      } else {
        head.appendChild(style);
      }

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
    }

    var css = ".ffe-checkbox {\n\talign-items: center;\n\tdisplay: flex;\n\tflex-flow: column;\n\tfloat: left;\n\theight: 2em;\n\tjustify-content: center;\n\tmargin-right: 18px;\n}\n\n.ffe-checkbox label {\n\tbackground-color: #bbb;\n\tborder-radius: 4px;\n\theight: 16px;\n\twidth: 16px;\n}\n\n.ffe-checkbox label:hover {\n\tbackground-color: #888;\n}\n\n.ffe-checkbox input:checked ~ label {\n\tbackground-color: #0f37a0;\n}\n\n.ffe-checkbox input:checked ~ label:before {\n\tcolor: white;\n\tcontent: \"✓\";\n\tdisplay: block;\n\tfont-size: 1.2em;\n\tmargin-top: -3px;\n\tpadding-right: 2px;\n\ttext-align: right;\n}\n\n.ffe-checkbox input {\n\tdisplay: none;\n}\n";
    styleInject(css);

    class CheckBox {
        constructor(props) {
            this.props = props;
        }
        render() {
            const id = "ffe-check-" + parseInt(Math.random() * 100000000 + "", 10);
            const element = React.createElement("span", { class: "ffe-checkbox" },
                React.createElement("input", { type: "checkbox", id: id }),
                React.createElement("label", { for: id }));
            const apply = value => {
                element.firstElementChild.checked = value;
            };
            this.props.bind.subscribe(apply);
            this.props.bind.get().then(apply);
            element.firstElementChild.addEventListener("change", () => __awaiter(this, void 0, void 0, function* () {
                yield this.props.bind.set(element.firstElementChild.checked);
            }));
            return element;
        }
    }

    class Label {
        constructor(props) {
            this.props = props;
        }
        render() {
            const element = React.createElement("span", { class: "ffe-label" });
            const apply = value => {
                if (typeof value === "number") {
                    element.textContent = value.toLocaleString("en");
                }
                else {
                    element.textContent = value;
                }
            };
            this.props.bind.get().then(apply);
            this.props.bind.subscribe(apply);
            return element;
        }
    }

    var css$1 = ".ffe-cl-container {\n\tmargin-bottom: 50px;\n\tpadding: 20px;\n}\n\n.ffe-cl ol {\n\tborder-top: 1px solid #cdcdcd;\n\tlist-style-type: none;\n\tmargin: 0;\n}\n\n.ffe-cl-chapter {\n\tbackground-color: #f6f7ee;\n\tborder-bottom: 1px solid #cdcdcd;\n\tfont-size: 1.1em;\n\tline-height: 2em;\n\tpadding: 4px 20px;\n}\n\n.ffe-cl-words {\n\tcolor: #555;\n\tfloat: right;\n\tfont-size: .9em;\n}\n\n.ffe-cl-collapsed {\n\ttext-align: center;\n}\n";
    styleInject(css$1);

    class ChapterList {
        constructor(props) {
            this.props = props;
        }
        render() {
            const list = React.createElement("ol", null);
            for (const chapter of this.props.story.chapters) {
                list.appendChild(React.createElement("li", { class: "ffe-cl-chapter" },
                    React.createElement(CheckBox, { bind: chapter.read }),
                    React.createElement("span", { class: "ffe-cl-chapter-title" },
                        React.createElement("a", { href: "/s/" + this.props.story.id + "/" + chapter.id }, chapter.name)),
                    React.createElement("span", { class: "ffe-cl-words" },
                        React.createElement("b", null,
                            React.createElement(Label, { bind: chapter.words })),
                        " words")));
            }
            setTimeout(() => {
                // The getter for the read status are asynchronous, so the read status is not set immediately. This is
                // necessary for hideLongChapterList(), though, so it has to wait. Since the data is saved locally, this
                // little timeout should be plenty. If there are problems, though, maybe the getter have to be primed and
                // waited on.
                this.hideLongChapterList(list);
            }, 5);
            return React.createElement("div", { class: "ffe-cl-container" },
                React.createElement("div", { class: "ffe-cl" }, list));
        }
        hideLongChapterList(list) {
            const elements = Array.from(list.children);
            const isRead = (e) => !!e.firstElementChild.firstElementChild.checked;
            let currentBlockIsRead = isRead(elements[0]);
            let currentBlockCount = 0;
            for (let i = 0; i < elements.length; i++) {
                const read = isRead(elements[i]);
                if (read === currentBlockIsRead) {
                    // no change from previous chapter, continue
                    currentBlockCount++;
                    continue;
                }
                if (!currentBlockIsRead && currentBlockCount < 5) {
                    // didn't go over enough chapters to hide any
                    currentBlockIsRead = read;
                    currentBlockCount = 1;
                    continue;
                }
                let off = 0;
                if (currentBlockIsRead) {
                    // we can hide more chapters if they are already read
                    elements.slice(i - currentBlockCount, i)
                        .forEach(element => element.style.display = "none");
                }
                else {
                    // some unread chapters here, show a bit more of them
                    elements.slice(i - currentBlockCount + 2, i - 2)
                        .forEach(element => element.style.display = "none");
                    off = 2;
                }
                // insert a link to show the hidden chapters
                const showLink = document.createElement("a");
                showLink.style.cursor = "pointer";
                showLink.textContent = "Show " + (currentBlockCount - off * 2) + " hidden chapters";
                showLink.addEventListener("click", () => {
                    for (let j = 0; j < list.children.length; j++) {
                        const element = list.children.item(j);
                        if (element.classList.contains("ffe-cl-collapsed")) {
                            element.style.display = "none";
                        }
                        else {
                            element.style.display = "block";
                        }
                    }
                });
                const showLinkContainer = document.createElement("li");
                showLinkContainer.classList.add("ffe-cl-chapter", "ffe-cl-collapsed");
                showLinkContainer.appendChild(showLink);
                elements[0].parentElement.insertBefore(showLinkContainer, elements[i - off]);
                currentBlockIsRead = read;
                currentBlockCount = 1;
            }
            // the last visited block might be long enough to hide
            if (currentBlockCount > 6) {
                elements.slice(elements.length - currentBlockCount + 2, elements.length - 3)
                    .forEach(element => element.style.display = "none");
                const showLink = document.createElement("a");
                showLink.style.cursor = "pointer";
                showLink.textContent = "Show " + (currentBlockCount - 5) + " hidden chapters";
                showLink.addEventListener("click", () => {
                    for (let j = 0; j < list.children.length; j++) {
                        const element = list.children.item(j);
                        if (element.classList.contains("ffe-cl-collapsed")) {
                            element.style.display = "none";
                        }
                        else {
                            element.style.display = "block";
                        }
                    }
                });
                const showLinkContainer = document.createElement("li");
                showLinkContainer.classList.add("ffe-cl-chapter", "ffe-cl-collapsed");
                showLinkContainer.appendChild(showLink);
                elements[0].parentElement.insertBefore(showLinkContainer, elements[elements.length - 3]);
            }
        }
    }

    class ChapterList$1 {
        constructor(valueContainer) {
            this.valueContainer = valueContainer;
        }
        enhance() {
            return __awaiter(this, void 0, void 0, function* () {
                const contentWrapper = document.getElementById("content_wrapper_inner");
                // clean up content
                Array.from(contentWrapper.children)
                    .filter(e => (!e.textContent && e.style.height === "5px")
                    || (e.firstElementChild && e.firstElementChild.nodeName === "SELECT")
                    || (e.className === "lc-wrapper" && e.id !== "pre_story_links"))
                    .forEach(e => contentWrapper.removeChild(e));
                contentWrapper.removeChild(document.getElementById("storytextp"));
                // add chapter list
                const story = yield this.valueContainer.getStory(environment.currentStoryId);
                const chapterList = new ChapterList({ story: story });
                contentWrapper.insertBefore(chapterList.render(), document.getElementById("review_success"));
            });
        }
    }

    class SmartValueBase {
        constructor(name, getter, setter) {
            this.name = name;
            this.getter = getter;
            this.setter = setter;
            // todo: key should be of type "symbol"
            // see https://github.com/Microsoft/TypeScript/issues/1863 and https://github.com/Microsoft/TypeScript/pull/26797
            this.subscribers = {};
        }
        get() {
            return __awaiter(this, void 0, void 0, function* () {
                let value = yield this.getCached();
                if (value === undefined && this.getter) {
                    value = yield this.getter();
                    yield this.setCached(value);
                }
                return value;
            });
        }
        set(value) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.setter) {
                    yield this.setter(value);
                }
                else if (this.getter) {
                    throw new Error("This value cannot be set.");
                }
                yield this.setCached(value);
                yield this.trigger(value);
            });
        }
        subscribe(callback) {
            const key = Symbol();
            this.subscribers[key] = callback;
            return key;
        }
        unsubscribe(key) {
            delete this.subscribers[key];
        }
        dispose() {
            this.subscribers = {};
        }
        update(value) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.setCached(value);
                yield this.trigger(value);
            });
        }
        trigger(value) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Promise.all(Object.getOwnPropertySymbols(this.subscribers)
                    .map(sym => this.subscribers[sym](value))
                    .filter(promise => promise && promise.then));
            });
        }
    }
    class SmartValueLocal extends SmartValueBase {
        constructor(name, storage, getter, setter) {
            super(name, getter, setter);
            this.name = name;
            this.storage = storage;
            this.getter = getter;
            this.setter = setter;
        }
        getCached() {
            const data = this.storage.getItem(this.name);
            if (!data) {
                return Promise.resolve(undefined);
            }
            return Promise.resolve(JSON.parse(data));
        }
        setCached(value) {
            const data = JSON.stringify(value);
            this.storage.setItem(this.name, data);
            this.storage.setItem(this.name + "+timestamp", new Date().getTime() + "");
            return Promise.resolve();
        }
    }
    class SmartValueRoaming extends SmartValueBase {
        constructor(name, getter, setter, synchronizer) {
            super(name, getter, setter);
            this.name = name;
            this.getter = getter;
            this.setter = setter;
            this.synchronizer = synchronizer;
            if (typeof GM_addValueChangeListener !== "undefined") {
                this.token = GM_addValueChangeListener(name, (k, o, value, remote) => __awaiter(this, void 0, void 0, function* () {
                    if (remote) {
                        yield this.trigger(JSON.parse(value));
                    }
                }));
            }
        }
        set(value) {
            const _super = Object.create(null, {
                set: { get: () => super.set }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.set.call(this, value);
                if (this.synchronizer) {
                    yield this.synchronizer.synchronize();
                }
            });
        }
        dispose() {
            super.dispose();
            if (!this.token) {
                return;
            }
            if (typeof GM_removeValueChangeListener !== "undefined") {
                GM_removeValueChangeListener(this.token);
            }
            this.token = undefined;
        }
        getCached() {
            return __awaiter(this, void 0, void 0, function* () {
                const data = yield GM.getValue(this.name);
                if (!data) {
                    return;
                }
                return JSON.parse(data);
            });
        }
        setCached(value) {
            return __awaiter(this, void 0, void 0, function* () {
                yield GM.setValue(this.name, JSON.stringify(value));
                yield GM.setValue(this.name + "+timestamp", new Date().getTime());
            });
        }
    }

    class Chapter {
        constructor(data, valueManager) {
            this.storyId = data.storyId;
            this.id = data.id;
            this.name = data.name;
            this.words = valueManager.getWordCountValue(data.storyId, data.id);
            this.read = valueManager.getChapterReadValue(data.storyId, data.id);
        }
    }

    class Story {
        constructor(data, valueManager) {
            this.id = data.id;
            this.title = data.title;
            this.description = data.description;
            this.chapters = data.chapters.map(chapter => new Chapter(chapter, valueManager));
            this.imageUrl = data.imageUrl;
            this.imageOriginalUrl = data.imageOriginalUrl;
            this.favorites = data.favorites;
            this.follows = data.follows;
            this.reviews = data.reviews;
            this.genre = data.genre;
            this.language = data.language;
            this.published = data.published ? new Date(data.published) : undefined;
            this.updated = data.updated ? new Date(data.updated) : undefined;
            this.rating = data.rating;
            this.words = data.words;
            this.characters = data.characters;
            this.status = data.status;
            this.author = {
                id: data.authorId,
                name: data.author,
                profileUrl: undefined,
                avatarUrl: undefined,
            };
            this.alert = valueManager.getAlertValue(data.id);
            this.favorite = valueManager.getFavoriteValue(data.id);
        }
        isRead() {
            return __awaiter(this, void 0, void 0, function* () {
                const read = yield Promise.all(this.chapters.map(chapter => chapter.read.get()));
                return read.every(r => r);
            });
        }
        setRead(read) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Promise.all(this.chapters.map(chapter => chapter.read.set(read)));
            });
        }
    }

    class CacheName {
        static story(id) {
            return `ffe-story-${id}`;
        }
        static isStoryKey(key) {
            return /^ffe-story-\d+$/.test(key);
        }
        static storyAlert(id) {
            return `ffe-story-${id}-alert`;
        }
        static isStoryAlertKey(key) {
            return /^ffe-story-\d+-alert$/.test(key);
        }
        static storyFavorite(id) {
            return `ffe-story-${id}-favorite`;
        }
        static isStoryFavoriteKey(key) {
            return /^ffe-story-\d+-favorite$/.test(key);
        }
        static wordCount(storyId, chapterId) {
            return `ffe-story-${storyId}-chapter-${chapterId}-words`;
        }
        static isWordCountKey(key) {
            return /^ffe-story-\d+-chapter-\d+-words$/.test(key);
        }
        static chapterRead(storyId, chapterId) {
            return `ffe-story-${storyId}-chapter-${chapterId}-read`;
        }
        static isChapterReadKey(key) {
            return /^ffe-story-\d+-chapter-\d+-read$/.test(key);
        }
        static isTimestampKey(key) {
            return /\+timestamp$/.test(key);
        }
    }
    class ValueContainer {
        constructor(storage, api, synchronizer) {
            this.storage = storage;
            this.api = api;
            this.synchronizer = synchronizer;
            this.instances = {};
            addEventListener("storage", (event) => __awaiter(this, void 0, void 0, function* () {
                const value = this.instances[event.key];
                if (!value) {
                    return;
                }
                yield value.trigger(JSON.parse(event.newValue));
            }));
            synchronizer.onValueUpdate((key, value) => __awaiter(this, void 0, void 0, function* () {
                const instance = this.instances[key];
                if (!instance) {
                    yield GM.setValue(key, value);
                    yield GM.setValue(key + "+timestamp", new Date().getTime());
                    return;
                }
                yield instance.update(value);
            }));
        }
        getStory(id) {
            return __awaiter(this, void 0, void 0, function* () {
                const storyData = yield this.getStoryValue(id).get();
                return new Story(storyData, this);
            });
        }
        getStoryValue(id) {
            const key = CacheName.story(id);
            if (!this.instances[key]) {
                this.instances[key] = new SmartValueLocal(key, this.storage, () => this.api.getStoryData(id));
            }
            return this.instances[key];
        }
        getAlertValue(id) {
            const key = CacheName.storyAlert(id);
            if (!this.instances[key]) {
                this.instances[key] = new SmartValueLocal(key, this.storage, () => __awaiter(this, void 0, void 0, function* () {
                    const alerts = yield this.api.getStoryAlerts();
                    yield this.followedStoryDiff(CacheName.isStoryAlertKey, alerts, this.getAlertValue);
                    return !!alerts.find(alert => alert.id === id);
                }), (alert) => __awaiter(this, void 0, void 0, function* () {
                    if (alert) {
                        yield this.api.addStoryAlert(id);
                    }
                    else {
                        yield this.api.removeStoryAlert(id);
                    }
                }));
            }
            return this.instances[key];
        }
        getFavoriteValue(id) {
            const key = CacheName.storyFavorite(id);
            if (!this.instances[key]) {
                this.instances[key] = new SmartValueLocal(key, this.storage, () => __awaiter(this, void 0, void 0, function* () {
                    const favorites = yield this.api.getStoryFavorites();
                    yield this.followedStoryDiff(CacheName.isStoryFavoriteKey, favorites, this.getFavoriteValue);
                    return !!favorites.find(favorite => favorite.id === id);
                }), (favorite) => __awaiter(this, void 0, void 0, function* () {
                    if (favorite) {
                        yield this.api.addStoryFavorite(id);
                    }
                    else {
                        yield this.api.removeStoryFavorite(id);
                    }
                }));
            }
            return this.instances[key];
        }
        getWordCountValue(storyId, chapterId) {
            const key = CacheName.wordCount(storyId, chapterId);
            if (!this.instances[key]) {
                this.instances[key] = new SmartValueLocal(key, this.storage, () => this.api.getChapterWordCount(storyId, chapterId));
            }
            return this.instances[key];
        }
        getChapterReadValue(storyId, chapterId) {
            const key = CacheName.chapterRead(storyId, chapterId);
            if (!this.instances[key]) {
                this.instances[key] = new SmartValueRoaming(key, undefined, undefined, this.synchronizer);
            }
            return this.instances[key];
        }
        followedStoryDiff(matchFn, updated, valueGetter) {
            return __awaiter(this, void 0, void 0, function* () {
                const visited = new Set();
                for (const followed of updated) {
                    const value = valueGetter.call(this, followed.id);
                    visited.add(value.name);
                    yield value.update(true);
                }
                const current = Object.keys(this.instances).filter(matchFn).map(key => this.instances[key]);
                for (const value of current) {
                    if (visited.has(value.name)) {
                        continue;
                    }
                    yield value.update(false);
                }
            });
        }
    }

    const OAUTH2_CALLBACK = "ffe-oauth2-cb";
    const REDIRECT_URI = "https://www.fanfiction.net/ffe-oauth2-return";
    const CLIENT_ID = "ngjdgcbyh9cq080";
    const BEARER_TOKEN_KEY = "ffe-dropbox-token";
    const FFE_DATA_PATH = "/ffe.json";
    class DropBox {
        constructor() {
            this.valueUpdateCallbacks = {};
        }
        isAuthorized() {
            return __awaiter(this, void 0, void 0, function* () {
                return !!(yield GM.getValue(BEARER_TOKEN_KEY));
            });
        }
        authorize() {
            return __awaiter(this, void 0, void 0, function* () {
                const token = yield new Promise((resolve, reject) => {
                    unsafeWindow[OAUTH2_CALLBACK] = callbackToken => {
                        clearInterval(handle);
                        resolve(callbackToken);
                    };
                    const popup = ffnServices.xwindow("https://www.dropbox.com/oauth2/authorize?response_type=token" +
                        "&client_id=" + encodeURIComponent(CLIENT_ID) +
                        "&redirect_uri=" + encodeURIComponent(REDIRECT_URI), 775, 550);
                    const handle = setInterval(() => {
                        if (popup.closed) {
                            clearInterval(handle);
                            reject(new Error("Authorization aborted by user"));
                        }
                    }, 1000);
                });
                yield GM.setValue(BEARER_TOKEN_KEY, token);
            });
        }
        synchronize() {
            return __awaiter(this, void 0, void 0, function* () {
                const rawData = yield this.readFile(FFE_DATA_PATH);
                const remoteData = rawData ? JSON.parse(rawData) : {};
                for (const key in remoteData) {
                    if (!remoteData.hasOwnProperty(key) || CacheName.isTimestampKey(key)) {
                        continue;
                    }
                    const localTimestamp = +(yield GM.getValue(key + "+timestamp", 0));
                    const remoteTimestamp = +remoteData[key + "+timestamp"];
                    if (localTimestamp < remoteTimestamp) {
                        yield Promise.all(Object.getOwnPropertySymbols(this.valueUpdateCallbacks)
                            .map(sym => this.valueUpdateCallbacks[sym](key, remoteData[key]))
                            .filter(promise => promise && promise.then));
                    }
                }
                let hasUpdate = false;
                for (const key of yield GM.listValues()) {
                    if (CacheName.isTimestampKey(key)) {
                        continue;
                    }
                    const localTimestamp = +(yield GM.getValue(key + "+timestamp", 0));
                    const remoteTimestamp = +remoteData[key + "+timestamp"] || 0;
                    if (localTimestamp > remoteTimestamp) {
                        hasUpdate = true;
                        remoteData[key] = yield GM.getValue(key);
                        remoteData[key + "+timestamp"] = localTimestamp;
                    }
                }
                if (hasUpdate) {
                    yield this.saveFile(FFE_DATA_PATH, remoteData);
                }
            });
        }
        onValueUpdate(callback) {
            const key = Symbol();
            this.valueUpdateCallbacks[key] = callback;
            return key;
        }
        removeValueUpdateCallback(key) {
            delete this.valueUpdateCallbacks[key];
        }
        readFile(path) {
            return this.content("/files/download", {
                path: path,
            });
        }
        saveFile(path, content) {
            return this.content("/files/upload", {
                path: path,
                mode: "overwrite",
                mute: true,
            }, content);
        }
        content(url, params, body) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!(yield this.isAuthorized())) {
                    throw new Error("Not authorized with DropBox yet.");
                }
                const token = yield GM.getValue(BEARER_TOKEN_KEY);
                const fmtUrl = "https://content.dropboxapi.com/2" + url + "?arg=" + encodeURIComponent(JSON.stringify(params));
                console.log("%c[DropBox] %cPOST %c%s", "color: gray", "color: blue", "color: inherit", fmtUrl);
                const response = yield fetch(fmtUrl, {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer " + token,
                        "Content-Type": "application/octet-stream",
                    },
                    body: body ? JSON.stringify(body) : undefined,
                });
                if (!response.ok) {
                    const msg = yield response.json();
                    if (response.status === 409 && msg.error_summary.startsWith("path/not_found/")) {
                        // File doesn't exist yet after first connection. Simply ignore and push all changes.
                        return undefined;
                    }
                    throw new Error(msg.error_summary);
                }
                return response.text();
            });
        }
        rpc(url, body) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!(yield this.isAuthorized())) {
                    throw new Error("Not authorized with Dropbox yet.");
                }
                const token = yield GM.getValue(BEARER_TOKEN_KEY);
                const fmtUrl = "https://api.dropboxapi.com/2" + url;
                console.log("%c[DropBox] %cPOST %c%s", "color: gray", "color: blue", "color: inherit", fmtUrl);
                const response = yield fetch(fmtUrl, {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer " + token,
                        "Content-Type": "application/octet-stream",
                    },
                    body: body ? JSON.stringify(body) : "null",
                });
                return response.json();
            });
        }
    }
    function oAuth2LandingPage() {
        // This function will be executed inside the child popup window receiving the OAuth token.
        document.body.firstElementChild.innerHTML = `<h2>Received oAuth2 token</h2>This page should close momentarily.`;
        const token = /[?&#]access_token=([^&#]*)/i.exec(location.hash)[1];
        window.opener[OAUTH2_CALLBACK](token);
        window.close();
    }

    class Button {
        constructor(props) {
            this.props = props;
        }
        render() {
            const element = React.createElement("span", { class: "btn " + this.props.class }, this.props.text);
            if (this.props.click) {
                element.addEventListener("click", this.props.click);
            }
            if (this.props.active) {
                element.classList.add("ffe-active");
            }
            if (this.props.bind) {
                this.props.bind.subscribe(active => element.classList.toggle("ffe-active", active));
                this.props.bind.get().then(active => element.classList.toggle("ffe-active", active));
                element.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                    yield this.props.bind.set(!element.classList.contains("ffe-active"));
                }));
            }
            return element;
        }
    }

    var css$2 = ".ffe-rating {\n\tbackground: gray;\n\tpadding: 3px 5px;\n\tcolor: #fff !important;\n\tborder: 1px solid rgba(0, 0, 0, 0.2);\n\ttext-shadow: -1px -1px rgba(0, 0, 0, 0.2);\n\tborder-radius: 4px;\n\tmargin-right: 5px;\n\tvertical-align: 2px;\n}\n\n.ffe-rating:hover {\n\tborder-bottom: 1px solid rgba(0, 0, 0, 0.2) !important;\n}\n\n.ffe-rating-k,\n.ffe-rating-kp {\n\tbackground: #78ac40;\n\tbox-shadow: 0 1px 0 #90ce4d inset;\n}\n\n.ffe-rating-t,\n.ffe-rating-m {\n\tbackground: #ffb400;\n\tbox-shadow: 0 1px 0 #ffd800 inset;\n}\n\n.ffe-rating-ma {\n\tbackground: #c03d2f;\n\tbox-shadow: 0 1px 0 #e64938 inset;\n}\n";
    styleInject(css$2);

    class Rating {
        constructor(props) {
            this.props = props;
        }
        render() {
            const element = React.createElement("a", { href: "https://www.fictionratings.com/", class: "ffe-rating", rel: "noreferrer", target: "rating" }, this.props.rating);
            switch (this.props.rating) {
                case "K":
                    element.title = "General Audience (5+)";
                    element.classList.add("ffe-rating-k");
                    break;
                case "K+":
                    element.title = "Young Children (9+)";
                    element.classList.add("ffe-rating-kp");
                    break;
                case "T":
                    element.title = "Teens (13+)";
                    element.classList.add("ffe-rating-t");
                    break;
                case "M":
                    element.title = "Teens (16+)";
                    element.classList.add("ffe-rating-m");
                    break;
                case "MA":
                    element.title = "Mature (18+)";
                    element.classList.add("ffe-rating-ma");
                    break;
                default:
                    element.textContent = "?";
                    element.title = "No Rating Available";
                    break;
            }
            return element;
        }
    }

    var css$3 = ".ffe-sc-header {\n\tborder-bottom: 1px solid #ddd;\n\tpadding-bottom: 8px;\n\tmargin-bottom: 8px;\n}\n\n.ffe-sc-title {\n\tcolor: #000 !important;\n\tfont-size: 1.8em;\n}\n\n.ffe-sc-title:hover {\n\tborder-bottom: 0;\n\ttext-decoration: underline;\n}\n\n.ffe-sc-by {\n\tpadding: 0 .5em;\n}\n\n.ffe-sc-mark {\n\tfloat: right;\n}\n\n.ffe-sc-follow:hover,\n.ffe-sc-follow.ffe-active {\n\tcolor: #60cf23;\n}\n\n.ffe-sc-favorite:hover,\n.ffe-sc-favorite.ffe-active {\n\tcolor: #ffb400;\n}\n\n.ffe-sc-tags {\n\tborder-bottom: 1px solid #ddd;\n\tdisplay: flex;\n\tflex-wrap: wrap;\n\tline-height: 2em;\n\tmargin-bottom: 8px;\n}\n\n.ffe-sc-tag {\n\tborder: 1px solid rgba(0, 0, 0, 0.15);\n\tborder-radius: 4px;\n\tcolor: black;\n\tline-height: 16px;\n\tmargin-bottom: 8px;\n\tmargin-right: 5px;\n\tpadding: 3px 8px;\n}\n\n.ffe-sc-tag-language {\n\tbackground-color: #a151bd;\n\tcolor: white;\n}\n\n.ffe-sc-tag-genre {\n\tbackground-color: #4f91d6;\n\tcolor: white;\n}\n\n.ffe-sc-tag.ffe-sc-tag-character,\n.ffe-sc-tag.ffe-sc-tag-ship {\n\tbackground-color: #23b974;\n\tcolor: white;\n}\n\n.ffe-sc-tag-ship .ffe-sc-tag-character:not(:first-child):before {\n\tcontent: \" + \";\n}\n\n.ffe-sc-image {\n\tfloat: left;\n\tborder: 1px solid #ddd;\n\tborder-radius: 3px;\n\tpadding: 3px;\n\tmargin-right: 8px;\n\tmargin-bottom: 8px;\n}\n\n.ffe-sc-description {\n\tcolor: #333;\n\tfont-family: \"Open Sans\", sans-serif;\n\tfont-size: 1.1em;\n\tline-height: 1.4em;\n}\n\n.ffe-sc-footer {\n\tclear: left;\n\tbackground: #f6f7ee;\n\tborder-bottom: 1px solid #cdcdcd;\n\tborder-top: 1px solid #cdcdcd;\n\tcolor: #555;\n\tfont-size: .9em;\n\tmargin-left: -.5em;\n\tmargin-right: -.5em;\n\tmargin-top: 1em;\n\tpadding: 10px .5em;\n}\n\n.ffe-sc-footer-info {\n\tbackground: #fff;\n\tborder: 1px solid rgba(0, 0, 0, 0.15);\n\tborder-radius: 4px;\n\tfloat: left;\n\tline-height: 16px;\n\tmargin-top: -5px;\n\tmargin-right: 5px;\n\tpadding: 3px 8px;\n}\n\n.ffe-sc-footer-complete {\n\tbackground: #63bd40;\n\tcolor: #fff;\n}\n\n.ffe-sc-footer-incomplete {\n\tbackground: #f7a616;\n\tcolor: #fff;\n}\n";
    styleInject(css$3);

    class StoryCard {
        constructor(props) {
            this.props = props;
        }
        render() {
            const story = this.props.story;
            const element = document.createElement("div");
            element.className = "ffe-sc";
            this.addHeader(element, story);
            this.addTags(element, story);
            this.addImage(element, story);
            this.addDescription(element, story);
            this.addFooter(element, story);
            return element;
        }
        addHeader(element, story) {
            const header = React.createElement("div", { class: "ffe-sc-header" },
                React.createElement(Rating, { rating: story.rating }),
                React.createElement("a", { href: "/s/" + story.id, class: "ffe-sc-title" }, story.title),
                React.createElement("span", { class: "ffe-sc-by" }, "by"),
                React.createElement("a", { href: "/u/" + (story.author ? story.author.id : ""), class: "ffe-sc-author" }, story.author ? story.author.name : "?"),
                React.createElement("div", { class: "ffe-sc-mark btn-group" },
                    React.createElement(Button, { class: "ffe-sc-follow icon-bookmark-2", bind: story.alert }),
                    React.createElement(Button, { class: "ffe-sc-favorite icon-heart", bind: story.favorite })));
            element.appendChild(header);
        }
        addImage(element, story) {
            if (!story.imageUrl) {
                return;
            }
            const imageContainer = document.createElement("div");
            imageContainer.className = "ffe-sc-image";
            const image = document.createElement("img");
            if (story.imageOriginalUrl) {
                const imageUrlReplacer = () => {
                    image.removeEventListener("error", imageUrlReplacer);
                    image.src = story.imageUrl;
                };
                image.addEventListener("error", imageUrlReplacer);
                image.src = story.imageOriginalUrl;
            }
            else {
                image.src = story.imageUrl;
            }
            imageContainer.appendChild(image);
            element.appendChild(imageContainer);
        }
        addDescription(element, story) {
            const description = React.createElement("div", { class: "ffe-sc-description" }, story.description);
            element.appendChild(description);
        }
        addTags(element, story) {
            const tags = React.createElement("div", { class: "ffe-sc-tags" });
            if (story.language) {
                tags.appendChild(React.createElement("span", { class: "ffe-sc-tag ffe-sc-tag-language" }, story.language));
            }
            if (story.genre) {
                for (const genre of story.genre) {
                    tags.appendChild(React.createElement("span", { class: "ffe-sc-tag ffe-sc-tag-genre" }, genre));
                }
            }
            if (story.characters && story.characters.length) {
                for (const character of story.characters) {
                    if (typeof character === "string") {
                        tags.appendChild(React.createElement("span", { class: "ffe-sc-tag ffe-sc-tag-character" }, character));
                    }
                    else {
                        const ship = React.createElement("span", { class: "ffe-sc-tag ffe-sc-tag-ship" });
                        for (const shipCharacter of character) {
                            ship.appendChild(React.createElement("span", { class: "ffe-sc-tag-character" }, shipCharacter));
                        }
                        tags.appendChild(ship);
                    }
                }
            }
            if (story.chapters && story.chapters.length > 1) {
                tags.appendChild(React.createElement("span", { class: "ffe-sc-tag ffe-sc-tag-chapters" },
                    "Chapters:\u00A0",
                    story.chapters.length));
            }
            if (story.reviews) {
                tags.appendChild(React.createElement("span", { class: "ffe-sc-tag ffe-sc-tag-reviews" },
                    React.createElement("a", { href: "/r/" + story.id + "/" },
                        "Reviews:\u00A0",
                        story.reviews)));
            }
            if (story.favorites) {
                tags.appendChild(React.createElement("span", { class: "ffe-sc-tag ffe-sc-tag-favorites" },
                    "Favorites:\u00A0",
                    story.favorites));
            }
            if (story.follows) {
                tags.appendChild(React.createElement("span", { class: "ffe-sc-tag ffe-sc-tag-follows" },
                    "Follows:\u00A0",
                    story.follows));
            }
            element.appendChild(tags);
        }
        addFooter(element, story) {
            const footer = React.createElement("div", { class: "ffe-sc-footer" }, "\u00A0");
            if (story.words) {
                const words = React.createElement("div", { style: "float: right;" },
                    React.createElement("b", null, story.words.toLocaleString("en")),
                    " words");
                footer.appendChild(words);
            }
            const status = React.createElement("span", { class: "ffe-sc-footer-info" });
            if (story.status === "Complete") {
                status.classList.add("ffe-sc-footer-complete");
                status.textContent = "Complete";
            }
            else {
                status.classList.add("ffe-sc-footer-incomplete");
                status.textContent = "Incomplete";
            }
            footer.appendChild(status);
            if (story.published) {
                const published = React.createElement("span", { class: "ffe-sc-footer-info" },
                    React.createElement("b", null, "Published:"),
                    "\u00A0",
                    React.createElement("time", { datetime: story.published.toISOString() }, story.published.toLocaleDateString("en")));
                footer.appendChild(published);
            }
            if (story.updated) {
                const updated = React.createElement("span", { class: "ffe-sc-footer-info" },
                    React.createElement("b", null, "Updated:"),
                    "\u00A0",
                    React.createElement("time", { datetime: story.updated.toISOString() }, story.updated.toLocaleDateString("en")));
                footer.appendChild(updated);
            }
            element.appendChild(footer);
        }
    }

    var css$4 = ".ffe-follows-list {\n\tlist-style: none;\n\tmargin: 0;\n}\n\n.ffe-follows-item {\n\tmargin-bottom: 8px;\n}\n\n.ffe-follows-item .ffe-sc {\n\tborder-left: 1px solid #aaa;\n\tborder-top: 1px solid #aaa;\n\tborder-top-left-radius: 4px;\n\tpadding-left: .5em;\n\tpadding-top: 5px;\n}\n\n.ffe-follows-item .ffe-cl-container {\n\tborder-left: 1px solid #aaa;\n\tmargin-bottom: 20px;\n\tpadding: 10px 0 0 0;\n}\n";
    styleInject(css$4);

    class FollowsList {
        constructor(valueContainer) {
            this.valueContainer = valueContainer;
        }
        enhance() {
            return __awaiter(this, void 0, void 0, function* () {
                const list = parseFollowedStoryList(document);
                const container = document.createElement("ul");
                container.classList.add("ffe-follows-list");
                const table = document.getElementById("gui_table1i").parentElement;
                table.parentElement.insertBefore(container, table);
                for (const followedStory of list) {
                    const item = document.createElement("li");
                    item.classList.add("ffe-follows-item");
                    container.appendChild(item);
                    const story = yield this.valueContainer.getStory(followedStory.id);
                    const card = new StoryCard({ story: story }).render();
                    item.appendChild(card);
                    const chapterList = new ChapterList({ story: story }).render();
                    item.appendChild(chapterList);
                    followedStory.row.parentElement.removeChild(followedStory.row);
                }
                table.parentElement.removeChild(table);
            });
        }
    }

    var css$5 = ".ffe-mb-separator:before {\n\tcontent: \" | \";\n}\n\n.ffe-mb-checked:before {\n\tbackground: green;\n\tborder-radius: 50%;\n\tbottom: 2px;\n\tcolor: #fff;\n\tcontent: \"✓\";\n\tfont-size: 9px;\n\theight: 12px;\n\tline-height: 12px;\n\tposition: absolute;\n\tright: -2px;\n\twidth: 12px;\n}\n\n.ffe-mb-icon {\n\tdisplay: inline-block;\n\tline-height: 2em;\n\tmargin-top: -.5em;\n\ttext-align: center;\n\twidth: 2em;\n}\n\n.ffe-mb-icon:hover {\n\tborder-bottom: 0;\n\tcolor: orange !important;\n}\n\n.ffe-mb-dropbox {\n\ttransform: translateY(3px);\n}\n\n.ffe-mb-dropbox:hover .st0 {\n\tfill: orange;\n}\n";
    styleInject(css$5);

    class MenuBar {
        constructor(dropBox) {
            this.dropBox = dropBox;
        }
        enhance() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!environment.currentUserName) {
                    return;
                }
                const loginElement = document.querySelector("#name_login a");
                const parent = loginElement.parentElement;
                const ref = loginElement.nextElementSibling;
                const toAlerts = document.createElement("a");
                toAlerts.classList.add("ffe-mb-icon", "ffe-mb-alerts", "icon-bookmark-2");
                toAlerts.title = "Go to Story Alerts";
                toAlerts.href = "/alert/story.php";
                const toFavorites = document.createElement("a");
                toFavorites.classList.add("ffe-mb-icon", "ffe-mb-favorites", "icon-heart");
                toFavorites.title = "Go to Story Favorites";
                toFavorites.href = "/favorites/story.php";
                const toDropBox = document.createElement("a");
                toDropBox.classList.add("ffe-mb-icon", "ffe-mb-dropbox");
                toDropBox.title = "Connect to DropBox";
                toDropBox.href = "#";
                toDropBox.innerHTML = "<svg id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 42.4 39.5\" " +
                    "width=\"16\" height=\"16\"><style>.st0{fill:#fff}</style><path class=\"st0\" " +
                    "d=\"M10.6 1.7L0 8.5l10.6 6.7 10.6-6.7zm21.2 0L21.2 8.5l10.6 6.7 10.6-6.7zM0 22l10.6 6.8L21.2 " +
                    "22l-10.6-6.8zm31.8-6.8L21.2 22l10.6 6.8L42.4 22zM10.6 31l10.6 6.8L31.8 31l-10.6-6.7z\"/></svg>";
                if (yield this.dropBox.isAuthorized()) {
                    toDropBox.classList.add("ffe-mb-checked");
                }
                toDropBox.addEventListener("click", (event) => __awaiter(this, void 0, void 0, function* () {
                    event.preventDefault();
                    yield this.dropBox.authorize();
                }));
                const separator = document.createElement("span");
                separator.classList.add("ffe-mb-separator");
                parent.insertBefore(toAlerts, ref);
                parent.insertBefore(toFavorites, ref);
                parent.insertBefore(toDropBox, ref);
                parent.insertBefore(separator, ref);
            });
        }
    }

    var css$6 = "";
    styleInject(css$6);

    class StoryProfile {
        constructor(valueContainer) {
            this.valueContainer = valueContainer;
        }
        enhance() {
            return __awaiter(this, void 0, void 0, function* () {
                const profile = document.getElementById("profile_top");
                const story = yield this.valueContainer.getStory(environment.currentStoryId);
                const card = new StoryCard({ story: story });
                const replacement = card.render();
                // profile.parentElement.replaceChild(replacement, profile);
                profile.parentElement.insertBefore(replacement, profile);
                profile.style.display = "none";
            });
        }
    }

    class Container {
        getApi() {
            return this.api || (this.api = new Api());
        }
        getValueContainer() {
            return this.valueManager ||
                (this.valueManager = new ValueContainer(this.getStorage(), this.getApi(), this.getDropBox()));
        }
        getMenuBar() {
            return this.menuBar || (this.menuBar = new MenuBar(this.getDropBox()));
        }
        getFollowsList() {
            return this.followsList || (this.followsList = new FollowsList(this.getValueContainer()));
        }
        getStoryProfile() {
            return this.storyProfile || (this.storyProfile = new StoryProfile(this.getValueContainer()));
        }
        getChapterList() {
            return this.chapterList || (this.chapterList = new ChapterList$1(this.getValueContainer()));
        }
        getDropBox() {
            return this.dropBox || (this.dropBox = new DropBox());
        }
        getContainer() {
            return this;
        }
        getStorage() {
            return localStorage;
        }
    }

    var css$7 = ".storytext p {\n\tcolor: #333;\n\ttext-align: justify;\n}\n\n.storytext.xlight p {\n\tcolor: #ddd;\n}\n";
    styleInject(css$7);

    class StoryText {
        enhance() {
            return __awaiter(this, void 0, void 0, function* () {
                const textContainer = document.getElementById("storytextp");
                if (!textContainer) {
                    throw new Error("Could not find text container element.");
                }
                this.fixUserSelect(textContainer);
                if (!getCookie("xcookie2")) {
                    const cookie = {
                        read_font: "Open Sans",
                        read_font_size: "1.2",
                        read_line_height: "2.00",
                        read_width: 75,
                    };
                    ffnServices.fontastic.save(cookie);
                    const text = textContainer.firstElementChild;
                    text.style.fontFamily = cookie.read_font;
                    text.style.fontSize = cookie.read_font_size + "em";
                    text.style.lineHeight = cookie.read_line_height;
                    text.style.width = cookie.read_width + "%";
                }
            });
        }
        fixUserSelect(textContainer) {
            const handle = setInterval(() => {
                const rules = ["userSelect", "msUserSelect", "mozUserSelect", "khtmlUserSelect",
                    "webkitUserSelect", "webkitTouchCallout"];
                let isOk = true;
                for (const rule of rules) {
                    if (textContainer.style[rule] !== "inherit") {
                        isOk = false;
                    }
                    textContainer.style[rule] = "inherit";
                }
                if (isOk) {
                    clearTimeout(handle);
                }
            }, 150);
        }
    }

    const container = new Container();
    function main() {
        return __awaiter(this, void 0, void 0, function* () {
            if (environment.currentPageType === 6 /* OAuth2 */) {
                console.log("OAuth 2 landing page - no enhancements will be applied");
                oAuth2LandingPage();
                return;
            }
            const valueContainer = container.getValueContainer();
            const dropBox = container.getDropBox();
            if (yield dropBox.isAuthorized()) {
                dropBox.synchronize().catch(console.error);
            }
            const menuBarEnhancer = container.getMenuBar();
            yield menuBarEnhancer.enhance();
            if (environment.currentPageType === 2 /* Alerts */ || environment.currentPageType === 3 /* Favorites */) {
                const getterName = environment.currentPageType === 2 /* Alerts */ ? "getAlertValue" : "getFavoriteValue";
                const list = parseFollowedStoryList(document);
                for (const item of list) {
                    const value = valueContainer[getterName](item.id);
                    yield value.update(true);
                }
                const followsListEnhancer = container.getFollowsList();
                yield followsListEnhancer.enhance();
            }
            if (environment.currentPageType === 4 /* Story */) {
                const currentStory = parseProfile(document);
                const storyValue = valueContainer.getStoryValue(currentStory.id);
                yield storyValue.update(currentStory);
                const storyProfileEnhancer = container.getStoryProfile();
                yield storyProfileEnhancer.enhance();
                const chapterListEnhancer = container.getChapterList();
                yield chapterListEnhancer.enhance();
            }
            if (environment.currentPageType === 5 /* Chapter */) {
                const currentStory = parseProfile(document);
                const storyValue = valueContainer.getStoryValue(currentStory.id);
                yield storyValue.update(currentStory);
                const wordCountValue = valueContainer.getWordCountValue(currentStory.id, environment.currentChapterId);
                yield wordCountValue.update(document.getElementById("storytext")
                    .textContent.trim().split(/\s+/).length);
                const storyProfileEnhancer = container.getStoryProfile();
                yield storyProfileEnhancer.enhance();
                const storyTextEnhancer = new StoryText();
                yield storyTextEnhancer.enhance();
                const readValue = valueContainer.getChapterReadValue(currentStory.id, environment.currentChapterId);
                const markRead = () => __awaiter(this, void 0, void 0, function* () {
                    const amount = document.documentElement.scrollTop;
                    const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                    if (amount / (max - 550) >= 1) {
                        yield readValue.set(true);
                        window.removeEventListener("scroll", markRead);
                    }
                });
                window.addEventListener("scroll", markRead);
            }
        });
    }
    function migrate() {
        return __awaiter(this, void 0, void 0, function* () {
            const readListStr = yield GM.getValue("ffe-cache-read");
            if (!readListStr) {
                return;
            }
            const readList = JSON.parse(readListStr);
            for (const storyId in readList) {
                if (!readList.hasOwnProperty(storyId)) {
                    continue;
                }
                for (const chapterId in readList[storyId]) {
                    if (!readList[storyId].hasOwnProperty(chapterId)) {
                        continue;
                    }
                    yield GM.setValue(CacheName.chapterRead(+storyId, +chapterId), readList[storyId][chapterId]);
                }
            }
            yield GM.deleteValue("ffe-cache-read");
            yield GM.deleteValue("ffe-cache-alerts");
        });
    }
    migrate()
        .then(main)
        .catch(console.error);

}());
