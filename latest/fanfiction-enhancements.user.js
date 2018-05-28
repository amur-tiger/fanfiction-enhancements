// ==UserScript==
// @name         FanFiction Enhancements
// @namespace    https://tiger.rocks/
// @version      0.3.1+45.cd55be9
// @description  FanFiction.net Enhancements
// @author       Arne 'TigeR' Linck
// @copyright    2018, Arne 'TigeR' Linck
// @license      MIT, https://github.com/NekiCat/fanfiction-enhancements/blob/master/LICENSE
// @homepageURL  https://github.com/NekiCat/fanfiction-enhancements
// @supportURL   https://github.com/NekiCat/fanfiction-enhancements/issues
// @updateURL    https://nekicat.github.io/fanfiction-enhancements/latest/fanfiction-enhancements.meta.js
// @downloadURL  https://nekicat.github.io/fanfiction-enhancements/latest/fanfiction-enhancements.user.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.2/knockout-min.js
// @match        *://www.fanfiction.net/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// ==/UserScript==

(function (ko,jQueryProxy) {
	'use strict';

	var jQueryProxy__default = 'default' in jQueryProxy ? jQueryProxy['default'] : jQueryProxy;

	const ffnServices = {
	    xtoast: typeof xtoast === "undefined" ? () => { } : xtoast,
	    xwindow: typeof xwindow === "undefined" ? () => { } : xwindow,
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
	    return 0 /* Other */;
	}

	function GM_getObject(key) {
	    return JSON.parse(GM_getValue(key, "{}"));
	}
	function GM_setObject(key, value) {
	    GM_setValue(key, JSON.stringify(value));
	}
	class Read {
	    isRead(chapter) {
	        const data = GM_getObject(Read.READ_KEY);
	        return !!(data[chapter.storyId] && data[chapter.storyId][chapter.id]);
	    }
	    setRead(chapter) {
	        const data = GM_getObject(Read.READ_KEY);
	        if (!data[chapter.storyId]) {
	            data[chapter.storyId] = {};
	        }
	        data[chapter.storyId][chapter.id] = chapter.read();
	        GM_setObject(Read.READ_KEY, data);
	    }
	}
	Read.READ_KEY = "ffe-cache-read";
	class Alerts {
	    isFollowed(story) {
	        const data = GM_getObject(Alerts.ALERTS_KEY);
	        return !!(data.follows && data.follows[story.id]);
	    }
	    setFollowed(story) {
	        const data = GM_getObject(Alerts.ALERTS_KEY);
	        if (!data.follows) {
	            data.follows = {};
	        }
	        data.follows[story.id] = story.follow();
	        GM_setObject(Alerts.ALERTS_KEY, data);
	    }
	    isFavorited(story) {
	        const data = GM_getObject(Alerts.ALERTS_KEY);
	        return !!(data.favorites && data.favorites[story.id]);
	    }
	    setFavorited(story) {
	        const data = GM_getObject(Alerts.ALERTS_KEY);
	        if (!data.favorites) {
	            data.favorites = {};
	        }
	        data.favorites[story.id] = story.favorite();
	        GM_setObject(Alerts.ALERTS_KEY, data);
	    }
	}
	Alerts.ALERTS_KEY = "ffe-cache-alerts";
	class Cache {
	    constructor() {
	        this.read = new Read();
	        this.alerts = new Alerts();
	    }
	}
	const cache = new Cache();

	class Chapter {
	    constructor(storyId, id, name) {
	        this.storyId = storyId;
	        this.id = id;
	        this.name = name;
	        this.read = ko.observable();
	        this.read(cache.read.isRead(this));
	        this.read.subscribe(value => {
	            cache.read.setRead(this);
	        });
	    }
	}
	class Story {
	    constructor(id, title, author, description, chapters, meta) {
	        this.id = id;
	        this.title = title;
	        this.author = author;
	        this.description = description;
	        this.chapters = chapters;
	        this.meta = meta;
	        this.follow = ko.observable();
	        this.favorite = ko.observable();
	        this.read = ko.pureComputed({
	            read: () => {
	                for (const chapter of this.chapters) {
	                    if (!chapter.read()) {
	                        return false;
	                    }
	                }
	                return true;
	            },
	            write: value => {
	                for (const chapter of this.chapters) {
	                    chapter.read(value);
	                }
	            },
	        });
	        if (chapters.length === 0) {
	            throw new Error("A story must have at least one chapter.");
	        }
	        this.follow(cache.alerts.isFollowed(this));
	        this.follow.subscribe(value => {
	            cache.alerts.setFollowed(this);
	        });
	        this.favorite(cache.alerts.isFavorited(this));
	        this.favorite.subscribe(value => {
	            cache.alerts.setFavorited(this);
	        });
	        if (id === environment.currentStoryId) {
	            this.currentChapter = this.chapters.filter(c => c.id === environment.currentChapterId)[0];
	        }
	    }
	}

	const currentStory = parseProfile(document);
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
	    return new Story(resultMeta.id, titleElement.textContent, {
	        id: +authorElement.href.match(/\/u\/(\d+)\//i)[1],
	        name: authorElement.textContent,
	        profileUrl: authorElement.href,
	        avatarUrl: undefined,
	    }, descriptionElement.textContent, chapterElement ? parseChapters(resultMeta.id, chapterElement) : [
	        new Chapter(resultMeta.id, 1, titleElement.textContent),
	    ], resultMeta);
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
	function parseChapters(storyId, selectElement) {
	    const result = [];
	    for (let i = 0; i < selectElement.children.length; i++) {
	        const option = selectElement.children[i];
	        if (option.tagName !== "OPTION") {
	            continue;
	        }
	        result.push(new Chapter(storyId, +option.getAttribute("value"), option.textContent));
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
	    return Array.from(rows).map((row) => {
	        if (row.firstElementChild.colSpan > 1) {
	            return undefined;
	        }
	        const storyAnchor = row.children[0].firstElementChild;
	        const authorAnchor = row.children[1].firstElementChild;
	        return {
	            id: +storyAnchor.href.match(/\/s\/(\d+)\/.*/i)[1],
	            title: storyAnchor.textContent,
	            author: {
	                id: +authorAnchor.href.match(/\/u\/(\d+)\/.*/i)[1],
	                name: authorAnchor.textContent,
	                profileUrl: authorAnchor.href,
	                avatarUrl: "",
	            },
	        };
	    }).filter(story => story);
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

	var css = ".ffe-cl-container {\n\tmargin-bottom: 50px;\n\tpadding: 20px;\n}\n\n.ffe-cl ol {\n\tborder-top: 1px solid #cdcdcd;\n\tlist-style-type: none;\n\tmargin: 0;\n}\n\n.ffe-cl-chapter {\n\tbackground-color: #f6f7ee;\n\tborder-bottom: 1px solid #cdcdcd;\n\tfont-size: 1.1em;\n\tline-height: 2em;\n\tpadding: 4px 20px;\n}\n\n.ffe-cl-collapsed {\n\ttext-align: center;\n}\n\n.ffe-cl-read {\n\talign-items: center;\n\tdisplay: flex;\n\tflex-flow: column;\n\tfloat: left;\n\theight: 2em;\n\tjustify-content: center;\n\tmargin-right: 18px;\n}\n\n.ffe-cl-read label {\n\tbackground-color: #bbb;\n\tborder-radius: 4px;\n\theight: 16px;\n\twidth: 16px;\n}\n\n.ffe-cl-read label:hover {\n\tbackground-color: #888;\n}\n\n.ffe-cl-read input:checked ~ label {\n\tbackground-color: #0f37a0;\n}\n\n.ffe-cl-read input:checked ~ label:before {\n\tcolor: white;\n\tcontent: \"✓\";\n\tdisplay: block;\n\tfont-size: 1.2em;\n\tmargin-top: -3px;\n\tpadding-right: 2px;\n\ttext-align: right;\n}\n\n.ffe-cl-read input {\n\tdisplay: none;\n}\n";
	styleInject(css);

	const $ = jQueryProxy__default || jQueryProxy;
	class ChapterList {
	    constructor(document) {
	        this.document = document;
	        this.currentStory = currentStory;
	    }
	    enhance() {
	        const contentWrapper = this.document.getElementById("content_wrapper_inner");
	        // clean up content
	        Array.from(contentWrapper.children)
	            .filter(e => (!e.textContent && e.style.height === "5px")
	            || (e.firstElementChild && e.firstElementChild.nodeName === "SELECT")
	            || (e.className === "lc-wrapper" && e.id !== "pre_story_links"))
	            .forEach(e => contentWrapper.removeChild(e));
	        contentWrapper.removeChild(this.document.getElementById("storytextp"));
	        // add chapter list
	        const chapterListContainer = this.document.createElement("div");
	        chapterListContainer.className = "ffe-cl-container";
	        chapterListContainer.innerHTML =
	            `<div class="ffe-cl">
				<ol data-bind="foreach: chapters">
					<li class="ffe-cl-chapter">
						<span class="ffe-cl-read">
							<input type="checkbox" data-bind="attr: { id: 'ffe-cl-chapter-' + id }, checked: read"/>
							<label data-bind="attr: { for: 'ffe-cl-chapter-' + id }"/>
						</span>
						<span class="ffe-cl-chapter-title">
							<a data-bind="attr: { href: '/s/' + $parent.id + '/' + id }, text: name"></a>
						</span>
					</li>
				</ol>
			</div>`;
	        contentWrapper.insertBefore(chapterListContainer, this.document.getElementById("review_success"));
	        const profileFooter = this.document.getElementsByClassName("ffe-sc-footer")[0];
	        const allReadContainer = this.document.createElement("span");
	        allReadContainer.className = "ffe-cl-read";
	        allReadContainer.style.height = "auto";
	        allReadContainer.style.marginLeft = "10px";
	        allReadContainer.innerHTML =
	            `<input type="checkbox" data-bind="attr: { id: 'ffe-cl-story-' + id }, checked: read"/>
			<label data-bind="attr: { for: 'ffe-cl-story-' + id }"/>`;
	        profileFooter.insertBefore(allReadContainer, profileFooter.firstElementChild);
	        ko.applyBindings(this.currentStory, this.document.getElementById("content_wrapper_inner"));
	        this.hideLongChapterList();
	    }
	    hideLongChapterList() {
	        const $elements = $(this.document.getElementsByClassName("ffe-cl-chapter"));
	        const isRead = (e) => !!e.firstElementChild.firstElementChild.checked;
	        let currentBlockIsRead = isRead($elements[0]);
	        let currentBlockCount = 0;
	        for (let i = 0; i < $elements.length; i++) {
	            const read = isRead($elements[i]);
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
	                $elements.slice(i - currentBlockCount, i).hide();
	            }
	            else {
	                // some unread chapters here, show a bit more of them
	                $elements.slice(i - currentBlockCount + 2, i - 2).hide();
	                off = 2;
	            }
	            // insert a link to show the hidden chapters
	            const $showLink = $("<li class='ffe-cl-chapter ffe-cl-collapsed'><a style='cursor: pointer;'>Show " +
	                (currentBlockCount - off * 2) + " hidden chapters</a></li>");
	            $showLink.children("a").click(() => {
	                $elements.show();
	                $(".ffe-cl-collapsed").remove();
	            });
	            $showLink.insertBefore($elements[i - off]);
	            currentBlockIsRead = read;
	            currentBlockCount = 1;
	        }
	        // the last visited block might be long enough to hide
	        if (currentBlockCount > 6) {
	            $elements.slice($elements.length - currentBlockCount + 2, $elements.length - 3).hide();
	            const $showLink = $("<li class='ffe-cl-chapter ffe-cl-collapsed'><a style='cursor: pointer;'>Show " +
	                (currentBlockCount - 5) + " hidden chapters</a></li>");
	            $showLink.children("a").click(() => {
	                $elements.show();
	                $(".ffe-cl-collapsed").remove();
	            });
	            $showLink.insertBefore($elements[$elements.length - 3]);
	        }
	    }
	}

	const BASE_URL = "https://www.fanfiction.net";
	const CACHE_FOLLOWS_KEY = "ffe-api-follows";
	const CACHE_FAVORITES_KEY = "ffe-api-favorites";
	const CACHE_STORIES_KEY = "ffe-api-stories";
	const cache$1 = {
	    get follows() {
	        const value = localStorage.getItem(CACHE_FOLLOWS_KEY);
	        return value && JSON.parse(value);
	    },
	    set follows(value) {
	        localStorage.setItem(CACHE_FOLLOWS_KEY, JSON.stringify(value));
	    },
	    addFollow: (story) => {
	        const value = localStorage.getItem(CACHE_FOLLOWS_KEY);
	        const list = (value && JSON.parse(value));
	        if (list && list.every(f => f.id !== story.id)) {
	            list.push(story);
	            localStorage.setItem(CACHE_FOLLOWS_KEY, JSON.stringify(list));
	        }
	    },
	    removeFollow: (story) => {
	        const value = localStorage.getItem(CACHE_FOLLOWS_KEY);
	        let list = (value && JSON.parse(value));
	        if (list) {
	            list = list.filter(f => f.id !== story.id);
	            localStorage.setItem(CACHE_FOLLOWS_KEY, JSON.stringify(list));
	        }
	    },
	    get favorites() {
	        const value = localStorage.getItem(CACHE_FAVORITES_KEY);
	        return value && JSON.parse(value);
	    },
	    set favorites(value) {
	        localStorage.setItem(CACHE_FAVORITES_KEY, JSON.stringify(value));
	    },
	    addFavorite: (story) => {
	        const value = localStorage.getItem(CACHE_FAVORITES_KEY);
	        const list = (value && JSON.parse(value));
	        if (list && list.every(f => f.id !== story.id)) {
	            list.push(story);
	            localStorage.setItem(CACHE_FAVORITES_KEY, JSON.stringify(list));
	        }
	    },
	    removeFavorite: (story) => {
	        const value = localStorage.getItem(CACHE_FAVORITES_KEY);
	        let list = (value && JSON.parse(value));
	        if (list) {
	            list = list.filter(f => f.id !== story.id);
	            localStorage.setItem(CACHE_FAVORITES_KEY, JSON.stringify(list));
	        }
	    },
	    getStory(id) {
	        const cacheRaw = localStorage.getItem(CACHE_STORIES_KEY);
	        const cached = cacheRaw && JSON.parse(cacheRaw);
	        if (!cached || !cached[id]) {
	            return undefined;
	        }
	        const cachedStory = cached[id];
	        const story = new Story(cachedStory.id, cachedStory.title, cachedStory.author, cachedStory.description, cachedStory.chapters.map(c => new Chapter(cachedStory.id, c.id, c.name)), cachedStory.meta);
	        if (story.meta.published) {
	            story.meta.published = new Date(story.meta.published);
	        }
	        if (story.meta.updated) {
	            story.meta.updated = new Date(story.meta.updated);
	        }
	        return story;
	    },
	    putStory(story) {
	        const cacheRaw = localStorage.getItem(CACHE_STORIES_KEY);
	        const cached = (cacheRaw && JSON.parse(cacheRaw)) || {};
	        cached[story.id] = story;
	        localStorage.setItem(CACHE_STORIES_KEY, JSON.stringify(cached));
	        return story;
	    },
	};
	if (currentStory) {
	    cache$1.putStory(currentStory);
	}
	if (environment.currentPageType === 2 /* Alerts */) {
	    const alerts = parseFollowedStoryList(document);
	    cache$1.follows = alerts;
	}
	if (environment.currentPageType === 3 /* Favorites */) {
	    const favorites = parseFollowedStoryList(document);
	    cache$1.favorites = favorites;
	}
	function urlencoded(obj) {
	    const result = [];
	    for (const key of Object.keys(obj)) {
	        result.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
	    }
	    return result.join("&");
	}
	function ajaxCall(url, method, body, options) {
	    return new Promise((resolve, reject) => {
	        const xhr = new XMLHttpRequest();
	        xhr.addEventListener("load", () => {
	            if (xhr.status >= 200 && xhr.status < 300) {
	                resolve(xhr.response);
	            }
	            else {
	                reject(xhr.response);
	            }
	        });
	        xhr.addEventListener("error", () => {
	            reject(xhr.response);
	        });
	        xhr.open(method, url, true);
	        let content = body;
	        if (options) {
	            if (options.headers) {
	                Object.keys(options.headers).forEach(key => {
	                    xhr.setRequestHeader(key, options.headers[key]);
	                });
	            }
	            if ((!options.headers || !options.headers["content-type"]) && options.type) {
	                switch (options.type) {
	                    case "json":
	                        xhr.setRequestHeader("content-type", "application/json; encoding=utf-8");
	                        content = JSON.stringify(content);
	                        break;
	                    case "urlencoded":
	                        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded; encoding=utf8");
	                        content = urlencoded(content);
	                        break;
	                }
	            }
	        }
	        if (content) {
	            xhr.send(content);
	        }
	        else {
	            xhr.send();
	        }
	    });
	}
	/**
	 * Follows the story with the given id.
	 * @param storyid
	 */
	function followStory(story) {
	    return ajaxCall(BASE_URL + "/api/ajax_subs.php", "POST", {
	        storyid: story.id,
	        userid: environment.currentUserId,
	        storyalert: 1,
	    }, {
	        type: "urlencoded",
	    }).then(data => {
	        cache$1.addFollow({
	            id: story.id,
	            title: story.title,
	            author: story.author,
	        });
	        return JSON.parse(data);
	    });
	}
	/**
	 * Stops following the story with the given id.
	 * @param storyid
	 */
	function unFollowStory(story) {
	    return ajaxCall(BASE_URL + "/alert/story.php", "POST", {
	        action: "remove-multi",
	        "rids[]": story.id,
	    }, {
	        type: "urlencoded",
	    }).then(data => {
	        cache$1.removeFollow({
	            id: story.id,
	            title: story.title,
	            author: story.author,
	        });
	        return data;
	    });
	}
	/**
	 * Favorites the story with the given id.
	 * @param storyid
	 */
	function favoriteStory(story) {
	    return ajaxCall(BASE_URL + "/api/ajax_subs.php", "POST", {
	        storyid: story.id,
	        userid: environment.currentUserId,
	        favstory: 1,
	    }, {
	        type: "urlencoded",
	    }).then(data => {
	        cache$1.addFavorite({
	            id: story.id,
	            title: story.title,
	            author: story.author,
	        });
	        return JSON.parse(data);
	    });
	}
	/**
	 * Removes the story with the given id from favorites.
	 * @param storyid
	 */
	function unFavoriteStory(story) {
	    return ajaxCall(BASE_URL + "/favorites/story.php", "POST", {
	        action: "remove-multi",
	        "rids[]": story.id,
	    }, {
	        type: "urlencoded",
	    }).then(data => {
	        cache$1.removeFavorite({
	            id: story.id,
	            title: story.title,
	            author: story.author,
	        });
	        return data;
	    });
	}
	/**
	 * Returns information about the story with the given id.
	 * @param storyid
	 */
	function getStoryInfo(storyid) {
	    const cached = cache$1.getStory(storyid);
	    if (cached) {
	        return Promise.resolve(cached);
	    }
	    return ajaxCall(BASE_URL + "/s/" + storyid, "GET", undefined)
	        .then(parseProfile)
	        .then(cache$1.putStory);
	}
	/*export function getComments(storyId: number): Promise<Comment[]> {
	    // fetch all comment pages, not just the first!
	    // to do that, fetch first and find out how many there are
	    // url is /r/<storyId>/<chapterId>/<pageNumber>/
	    // warning: trailing slash is mandatory!
	}*/

	var css$1 = ".ffe-rating {\n\tbackground: gray;\n\tpadding: 3px 5px;\n\tcolor: #fff !important;\n\tborder: 1px solid rgba(0, 0, 0, 0.2);\n\ttext-shadow: -1px -1px rgba(0, 0, 0, 0.2);\n\tborder-radius: 4px;\n\tmargin-right: 5px;\n\tvertical-align: 2px;\n}\n\n.ffe-rating:hover {\n\tborder-bottom: 1px solid rgba(0, 0, 0, 0.2) !important;\n}\n\n.ffe-rating-k,\n.ffe-rating-kp {\n\tbackground: #78ac40;\n\tbox-shadow: 0 1px 0 #90ce4d inset;\n}\n\n.ffe-rating-t,\n.ffe-rating-m {\n\tbackground: #ffb400;\n\tbox-shadow: 0 1px 0 #ffd800 inset;\n}\n\n.ffe-rating-ma {\n\tbackground: #c03d2f;\n\tbox-shadow: 0 1px 0 #e64938 inset;\n}\n";
	styleInject(css$1);

	class Rating {
	    constructor(document) {
	        this.document = document;
	    }
	    createElement(rating) {
	        const element = this.document.createElement("a");
	        element.href = "https://www.fictionratings.com/";
	        element.className = "ffe-rating";
	        element.rel = "noreferrer";
	        element.target = "rating";
	        element.textContent = rating;
	        switch (rating) {
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

	var css$2 = ".ffe-sc-header {\n\tborder-bottom: 1px solid #ddd;\n\tpadding-bottom: 8px;\n\tmargin-bottom: 8px;\n}\n\n.ffe-sc-title {\n\tcolor: #000 !important;\n\tfont-size: 1.8em;\n}\n\n.ffe-sc-title:hover {\n\tborder-bottom: 0;\n\ttext-decoration: underline;\n}\n\n.ffe-sc-by {\n\tpadding: 0 .5em;\n}\n\n.ffe-sc-mark {\n\tfloat: right;\n}\n\n.ffe-sc-follow:hover,\n.ffe-sc-follow.ffe-sc-active {\n\tcolor: #60cf23;\n}\n\n.ffe-sc-favorite:hover,\n.ffe-sc-favorite.ffe-sc-active {\n\tcolor: #ffb400;\n}\n\n.ffe-sc-tags {\n\tborder-bottom: 1px solid #ddd;\n\tline-height: 2em;\n\tmargin-bottom: 8px;\n\tpadding-bottom: 8px;\n}\n\n.ffe-sc-tag {\n\tborder: 1px solid rgba(0, 0, 0, 0.15);\n\tborder-radius: 4px;\n\tcolor: black;\n\tline-height: 16px;\n\tmargin-right: 5px;\n\tpadding: 3px 8px;\n}\n\n.ffe-sc-tag-language {\n\tbackground-color: #a151bd;\n\tcolor: white;\n}\n\n.ffe-sc-tag-genre {\n\tbackground-color: #4f91d6;\n\tcolor: white;\n}\n\n.ffe-sc-tag.ffe-sc-tag-character,\n.ffe-sc-tag.ffe-sc-tag-ship {\n\tbackground-color: #23b974;\n\tcolor: white;\n}\n\n.ffe-sc-tag-ship .ffe-sc-tag-character:not(:first-child):before {\n\tcontent: \" + \";\n}\n\n.ffe-sc-image {\n\tfloat: left;\n\tborder: 1px solid #ddd;\n\tborder-radius: 3px;\n\tpadding: 3px;\n\tmargin-right: 8px;\n\tmargin-bottom: 8px;\n}\n\n.ffe-sc-description {\n\tcolor: #333;\n\tfont-family: \"Open Sans\", sans-serif;\n\tfont-size: 1.1em;\n\tline-height: 1.4em;\n}\n\n.ffe-sc-footer {\n\tclear: left;\n\tbackground: #f6f7ee;\n\tborder-bottom: 1px solid #cdcdcd;\n\tborder-top: 1px solid #cdcdcd;\n\tcolor: #555;\n\tfont-size: .9em;\n\tmargin-left: -.5em;\n\tmargin-right: -.5em;\n\tmargin-top: 1em;\n\tpadding: 10px .5em;\n}\n\n.ffe-sc-footer-info {\n\tbackground: #fff;\n\tborder: 1px solid rgba(0, 0, 0, 0.15);\n\tborder-radius: 4px;\n\tfloat: left;\n\tline-height: 16px;\n\tmargin-top: -5px;\n\tmargin-right: 5px;\n\tpadding: 3px 8px;\n}\n\n.ffe-sc-footer-complete {\n\tbackground: #63bd40;\n\tcolor: #fff;\n}\n\n.ffe-sc-footer-incomplete {\n\tbackground: #f7a616;\n\tcolor: #fff;\n}\n";
	styleInject(css$2);

	const $$1 = jQueryProxy__default || jQueryProxy;
	class StoryCard {
	    constructor(document) {
	        this.document = document;
	    }
	    createElement(story) {
	        const element = this.document.createElement("div");
	        element.className = "ffe-sc";
	        this.addHeader(element, story);
	        this.addTags(element, story);
	        this.addImage(element, story.meta);
	        this.addDescription(element, story);
	        this.addFooter(element, story.meta);
	        return element;
	    }
	    addHeader(element, story) {
	        const header = this.document.createElement("div");
	        header.className = "ffe-sc-header";
	        const rating = new Rating(this.document).createElement(story.meta.rating);
	        header.appendChild(rating);
	        const title = this.document.createElement("a");
	        title.className = "ffe-sc-title";
	        title.textContent = story.title;
	        title.href = "/s/" + story.id;
	        header.appendChild(title);
	        const by = this.document.createElement("span");
	        by.className = "ffe-sc-by";
	        by.textContent = "by";
	        header.appendChild(by);
	        const author = this.document.createElement("a");
	        author.className = "ffe-sc-author";
	        author.textContent = story.author ? story.author.name : "?";
	        author.href = "/u/" + (story.author ? story.author.id : "?");
	        header.appendChild(author);
	        const mark = this.document.createElement("div");
	        mark.className = "ffe-sc-mark btn-group";
	        const follow = this.document.createElement("span");
	        follow.className = "ffe-sc-follow btn icon-bookmark-2";
	        follow.dataset["storyId"] = story.id + "";
	        follow.addEventListener("click", this.clickFollow);
	        if (story.follow()) {
	            follow.classList.add("ffe-sc-active");
	        }
	        mark.appendChild(follow);
	        const favorite = this.document.createElement("span");
	        favorite.className = "ffe-sc-favorite btn icon-heart";
	        favorite.dataset["storyId"] = story.id + "";
	        favorite.addEventListener("click", this.clickFavorite);
	        if (story.favorite()) {
	            favorite.classList.add("ffe-sc-active");
	        }
	        mark.appendChild(favorite);
	        header.appendChild(mark);
	        element.appendChild(header);
	    }
	    clickFollow(event) {
	        const promise = getStoryInfo(+event.target.dataset["storyId"])
	            .then(story => {
	            story.follow(!story.follow());
	            return story;
	        })
	            .then(story => story.follow() ?
	            followStory(story)
	                .then(data => {
	                ffnServices.xtoast("We have successfully processed the following: " + data.payload_data, 3500);
	            }) :
	            unFollowStory(story)
	                .then(data => {
	                ffnServices.xtoast("We have successfully processed the following: <ul><li>Unfollowing the story</li></ul>", 3500);
	            }));
	        $$1(event.target).toggleClass("ffe-sc-active");
	        promise
	            .catch(err => {
	            console.error(err);
	            $$1(event.target).toggleClass("ffe-sc-active");
	            ffnServices.xtoast("We are unable to process your request due to a network error. Please try again later.");
	        });
	    }
	    clickFavorite(event) {
	        const promise = getStoryInfo(+event.target.dataset["storyId"])
	            .then(story => {
	            story.favorite(!story.favorite());
	            return story;
	        })
	            .then(story => story.favorite() ?
	            favoriteStory(currentStory)
	                .then(data => {
	                ffnServices.xtoast("We have successfully processed the following: " + data.payload_data, 3500);
	            }) :
	            unFavoriteStory(currentStory)
	                .then(data => {
	                ffnServices.xtoast("We have successfully processed the following: <ul><li>Unfavoring the story</li></ul>", 3500);
	            }));
	        $$1(event.target).toggleClass("ffe-sc-active");
	        promise
	            .catch(err => {
	            console.error(err);
	            $$1(event.target).toggleClass("ffe-sc-active");
	            ffnServices.xtoast("We are unable to process your request due to a network error. Please try again later.");
	        });
	    }
	    addImage(element, story) {
	        if (!story.imageUrl) {
	            return;
	        }
	        const imageContainer = this.document.createElement("div");
	        imageContainer.className = "ffe-sc-image";
	        const image = this.document.createElement("img");
	        image.addEventListener("error", () => image.src = story.imageUrl);
	        image.src = story.imageOriginalUrl;
	        imageContainer.appendChild(image);
	        element.appendChild(imageContainer);
	    }
	    addDescription(element, story) {
	        const description = this.document.createElement("div");
	        description.className = "ffe-sc-description";
	        description.textContent = story.description;
	        element.appendChild(description);
	    }
	    addTags(element, story) {
	        const tags = this.document.createElement("div");
	        tags.className = "ffe-sc-tags";
	        let html = "";
	        if (story.meta.language) {
	            html += `<span class="ffe-sc-tag ffe-sc-tag-language">${story.meta.language}</span>`;
	        }
	        if (story.meta.genre) {
	            for (const genre of story.meta.genre) {
	                html += `<span class="ffe-sc-tag ffe-sc-tag-genre">${genre}</span>`;
	            }
	        }
	        if (story.meta.characters && story.meta.characters.length) {
	            for (const character of story.meta.characters) {
	                if (typeof character === "string") {
	                    html += `<span class="ffe-sc-tag ffe-sc-tag-character">${character}</span>`;
	                }
	                else {
	                    html += `<span class="ffe-sc-tag ffe-sc-tag-ship"><span
						class="ffe-sc-tag-character">${character.join("</span><span " +
                        "class='ffe-sc-tag-character'>")}</span></span>`;
	                }
	            }
	        }
	        if (story.chapters && story.chapters.length > 1) {
	            html += `<span class="ffe-sc-tag ffe-sc-tag-chapters">Chapters: ${story.chapters.length}</span>`;
	        }
	        if (story.meta.reviews) {
	            html += `<span class="ffe-sc-tag ffe-sc-tag-reviews"><a
				href="/r/${story.id}/">Reviews: ${story.meta.reviews}</a></span>`;
	        }
	        if (story.meta.favs) {
	            html += `<span class="ffe-sc-tag ffe-sc-tag-favs">Favorites: ${story.meta.favs}</span>`;
	        }
	        if (story.meta.follows) {
	            html += `<span class="ffe-sc-tag ffe-sc-tag-follows">Follows: ${story.meta.follows}</span>`;
	        }
	        tags.innerHTML = html;
	        element.appendChild(tags);
	    }
	    addFooter(element, story) {
	        const footer = this.document.createElement("div");
	        footer.className = "ffe-sc-footer";
	        footer.innerHTML = "&nbsp;";
	        if (story.words) {
	            const words = this.document.createElement("div");
	            words.style.cssFloat = "right";
	            words.innerHTML = "<b>" + story.words.toLocaleString("en") + "</b> words";
	            footer.appendChild(words);
	        }
	        const status = this.document.createElement("span");
	        status.className = "ffe-sc-footer-info";
	        if (story.status === "Complete") {
	            status.className += " ffe-sc-footer-complete";
	            status.textContent = "Complete";
	        }
	        else {
	            status.className += " ffe-sc-footer-incomplete";
	            status.textContent = "Incomplete";
	        }
	        footer.appendChild(status);
	        if (story.published) {
	            const published = this.document.createElement("span");
	            published.className = "ffe-sc-footer-info";
	            published.innerHTML = "<b>Published:</b> ";
	            const time = this.document.createElement("time");
	            time.dateTime = story.published.toISOString();
	            time.textContent = story.publishedWords;
	            published.appendChild(time);
	            footer.appendChild(published);
	        }
	        if (story.updated) {
	            const updated = this.document.createElement("span");
	            updated.className = "ffe-sc-footer-info";
	            updated.innerHTML = "<b>Updated:</b> ";
	            const time = this.document.createElement("time");
	            time.dateTime = story.updated.toISOString();
	            time.textContent = story.updatedWords;
	            updated.appendChild(time);
	            footer.appendChild(updated);
	        }
	        element.appendChild(footer);
	    }
	}

	var css$3 = ".ffe-follows-list {\n\tlist-style: none;\n\tmargin: 0;\n}\n\n.ffe-follows-item {\n\tmargin-bottom: 8px;\n}\n\n.ffe-follows-item .ffe-sc {\n\tborder-left: 1px solid #aaa;\n\tborder-top: 1px solid #aaa;\n\tborder-top-left-radius: 4px;\n\tpadding-left: .5em;\n\tpadding-top: 5px;\n}\n";
	styleInject(css$3);

	const $$2 = jQueryProxy__default || jQueryProxy;
	class FollowsList {
	    enhance() {
	        const cardFactory = new StoryCard(document);
	        const list = parseFollowedStoryList(document);
	        const $container = $$2("<ul class='ffe-follows-list'></ul>");
	        for (const followedStory of list) {
	            const $item = $$2("<li class='ffe-follows-item'></li>");
	            $container.append($item);
	            getStoryInfo(followedStory.id)
	                .then(story => {
	                const card = cardFactory.createElement(story);
	                $item.append(card);
	            });
	        }
	        const table = document.getElementById("gui_table1i").parentElement;
	        table.parentElement.replaceChild($container[0], table);
	    }
	}

	var css$4 = ".ffe-mb-separator:before {\n\tcontent: \" | \";\n}\n\n.ffe-mb-alerts, .ffe-mb-favorites {\n\tdisplay: inline-block;\n\tline-height: 2em;\n\tmargin-top: -.5em;\n\ttext-align: center;\n\twidth: 2em;\n}\n\n.ffe-mb-alerts:hover, .ffe-mb-favorites:hover {\n\tborder-bottom: 0;\n\tcolor: orange !important;\n}\n";
	styleInject(css$4);

	const $$3 = jQueryProxy__default || jQueryProxy;
	class MenuBar {
	    enhance() {
	        if (!environment.currentUserName) {
	            return;
	        }
	        const $loginElement = $$3("#name_login a");
	        const $separator = $$3(`<span class="ffe-mb-separator"></span>`);
	        const $toAlerts = $$3(`<a class="ffe-mb-alerts icon-bookmark-2" href="/alert/story.php"></a>`);
	        const $toFavorites = $$3(`<a class="ffe-mb-favorites icon-heart" href="/favorites/story.php"></a>`);
	        $separator.insertAfter($loginElement);
	        $toAlerts.insertAfter($separator);
	        $toFavorites.insertAfter($toAlerts);
	    }
	}

	var css$5 = "";
	styleInject(css$5);

	class StoryProfile {
	    constructor(document) {
	        this.document = document;
	    }
	    enhance() {
	        const profile = this.document.getElementById("profile_top");
	        const card = new StoryCard(document);
	        const replacement = card.createElement(currentStory);
	        // profile.parentElement.replaceChild(replacement, profile);
	        profile.parentElement.insertBefore(replacement, profile);
	        profile.style.display = "none";
	    }
	}

	var css$6 = ".storytext p {\n\tcolor: #333;\n\ttext-align: justify;\n}\n\n.storytext.xlight p {\n\tcolor: #ddd;\n}\n";
	styleInject(css$6);

	class StoryText {
	    constructor(document) {
	        this.document = document;
	    }
	    enhance() {
	        const textContainer = this.document.getElementById("storytextp");
	        if (!textContainer) {
	            throw new Error("Could not find text container element.");
	        }
	        this.fixUserSelect(textContainer);
	        if (!jQueryProxy.cookie("xcookie2")) {
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

	const menuBarEnhancer = new MenuBar();
	menuBarEnhancer.enhance();
	if (environment.currentPageType === 2 /* Alerts */ || environment.currentPageType === 3 /* Favorites */) {
	    const followsListEnhancer = new FollowsList();
	    followsListEnhancer.enhance();
	}
	if (environment.currentPageType === 4 /* Story */) {
	    const storyProfileEnhancer = new StoryProfile(document);
	    storyProfileEnhancer.enhance();
	    const chapterListEnhancer = new ChapterList(document);
	    chapterListEnhancer.enhance();
	}
	if (environment.currentPageType === 5 /* Chapter */) {
	    const storyProfileEnhancer = new StoryProfile(document);
	    storyProfileEnhancer.enhance();
	    const storyTextEnhancer = new StoryText(document);
	    storyTextEnhancer.enhance();
	    if (currentStory.currentChapter) {
	        const markRead = () => {
	            const amount = document.documentElement.scrollTop;
	            const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
	            if (amount / (max - 550) >= 1) {
	                currentStory.currentChapter.read(true);
	                window.removeEventListener("scroll", markRead);
	            }
	        };
	        window.addEventListener("scroll", markRead);
	    }
	}

}(ko,jQuery));
