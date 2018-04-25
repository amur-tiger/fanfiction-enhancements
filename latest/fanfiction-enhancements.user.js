// ==UserScript==
// @name         FanFiction Enhancements
// @namespace    https://tiger.rocks/
// @version      0.2.4+41.1d35afb
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

(function (ko,jQuery) {
	'use strict';

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
	    }
	}

	class StoryProfileParser {
	    constructor() {
	        this.validGenres = [
	            "Adventure",
	            "Angst",
	            "Crime",
	            "Drama",
	            "Family",
	            "Fantasy",
	            "Friendship",
	            "General",
	            "Horror",
	            "Humor",
	            "Hurt/Comfort",
	            "Mystery",
	            "Parody",
	            "Poetry",
	            "Romance",
	            "Sci-Fi",
	            "Spiritual",
	            "Supernatural",
	            "Suspense",
	            "Tragedy",
	            "Western",
	        ];
	    }
	    parse(profile, chapters) {
	        if (!profile) {
	            console.error("Profile node not found. Cannot parse story info.");
	            return undefined;
	        }
	        const story = this.parseProfile(profile, chapters);
	        return story;
	    }
	    parseProfile(profileElement, chapterElement) {
	        let offset = 0;
	        const icon = profileElement.children[0].firstElementChild;
	        if (!icon || icon.nodeName !== "IMG") {
	            offset--;
	        }
	        const titleElement = profileElement.children[offset + 2];
	        const authorElement = profileElement.children[offset + 4];
	        const descriptionElement = profileElement.children[offset + 7];
	        const tagsElement = profileElement.children[offset + 8];
	        const resultMeta = this.parseTags(tagsElement);
	        if (icon && icon.nodeName === "IMG") {
	            resultMeta.imageUrl = icon.src;
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
	        }, descriptionElement.textContent, chapterElement ? this.parseChapters(resultMeta.id, chapterElement) : [
	            new Chapter(resultMeta.id, 1, titleElement.textContent),
	        ], resultMeta);
	    }
	    parseTags(tagsElement) {
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
	        // Some genres might not have a genre tagged. If so, index 2 should be the characters instead.
	        if (result.genre.some(g => !this.validGenres.includes(g))) {
	            result.genre = [];
	            result.characters = this.parseCharacters(tagsArray[2]);
	        }
	        for (let i = 3; i < tagsArray.length; i++) {
	            const tagNameMatch = tagsArray[i].match(/^(\w+):/);
	            if (!tagNameMatch) {
	                result.characters = this.parseCharacters(tagsArray[i]);
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
	    parseCharacters(tag) {
	        const result = [];
	        const ships = tag.trim().split(/([\[\]])\s*/).filter(ship => ship.length);
	        let inShip = false;
	        for (const ship of ships) {
	            if (ship == "[") {
	                inShip = true;
	                continue;
	            }
	            if (ship == "]") {
	                inShip = false;
	                continue;
	            }
	            const characters = ship.split(/,\s+/);
	            if (!inShip || characters.length == 1) {
	                result.push(...characters);
	            }
	            else {
	                result.push(characters);
	            }
	        }
	        return result;
	    }
	    parseChapters(storyId, selectElement) {
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
	}

	const ffnServices = Object.freeze({
	    xtoast: typeof xtoast === "undefined" ? () => { } : xtoast,
	    fontastic: Object.freeze({
	        save: (cookie) => {
	            XCOOKIE = cookie;
	            _fontastic_save();
	        },
	    }),
	});
	const currentStoryTemp = getCurrentStory();
	const environment = Object.freeze({
	    currentUserId: typeof userid === "undefined" ? undefined : userid,
	    currentStoryId: typeof storyid === "undefined" ? undefined : storyid,
	    currentChapterId: typeof chapter === "undefined" ? undefined : chapter,
	    currentPageType: getPage(location),
	    currentStory: currentStoryTemp,
	    currentChapter: getCurrentChapter(currentStoryTemp),
	});
	function getPage(location) {
	    if (location.pathname.indexOf("/u/") == 0) {
	        return 1 /* User */;
	    }
	    if (location.pathname.match(/^\/s\/\d+\/?$/i)) {
	        return 2 /* Story */;
	    }
	    if (location.pathname.indexOf("/s/") == 0) {
	        return 3 /* Chapter */;
	    }
	    return 0 /* Other */;
	}
	function getCurrentStory() {
	    const page = getPage(location);
	    if (page !== 2 /* Story */ && page !== 3 /* Chapter */) {
	        return undefined;
	    }
	    const parser = new StoryProfileParser();
	    const story = parser.parse(document.getElementById("profile_top"), document.getElementById("chap_select"));
	    return story;
	}
	function getCurrentChapter(story) {
	    if (story === undefined) {
	        return undefined;
	    }
	    for (let i = 0; i < story.chapters.length; i++) {
	        if (story.chapters[i].id === chapter) {
	            return story.chapters[i];
	        }
	    }
	    return undefined;
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

	var css = ".ffe-cl-container {\n\tmargin-bottom: 50px;\n\tpadding: 20px;\n}\n\n.ffe-cl ol {\n\tborder-top: 1px solid #cdcdcd;\n\tlist-style-type: none;\n\tmargin: 0;\n}\n\n.ffe-cl-chapter {\n\tbackground-color: #f6f7ee;\n\tborder-bottom: 1px solid #cdcdcd;\n\tfont-size: 1.1em;\n\tline-height: 2em;\n\tpadding: 4px 20px;\n}\n\n.ffe-cl-read {\n\talign-items: center;\n\tdisplay: flex;\n\tflex-flow: column;\n\tfloat: left;\n\theight: 2em;\n\tjustify-content: center;\n\tmargin-right: 18px;\n}\n\n.ffe-cl-read label {\n\tbackground-color: #bbb;\n\tborder-radius: 4px;\n\theight: 16px;\n\twidth: 16px;\n}\n\n.ffe-cl-read label:hover {\n\tbackground-color: #888;\n}\n\n.ffe-cl-read input:checked ~ label {\n\tbackground-color: #0f37a0;\n}\n\n.ffe-cl-read input:checked ~ label:before {\n\tcolor: white;\n\tcontent: \"✓\";\n\tdisplay: block;\n\tfont-size: 1.2em;\n\tmargin-top: -3px;\n\tpadding-right: 2px;\n\ttext-align: right;\n}\n\n.ffe-cl-read input {\n\tdisplay: none;\n}\n";
	styleInject(css);

	class ChapterList {
	    constructor(document) {
	        this.document = document;
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
	        ko.applyBindings(environment.currentStory, this.document.getElementById("content_wrapper_inner"));
	    }
	}

	const BASE_URL = "https://www.fanfiction.net";
	const CACHE_FOLLOWS_KEY = "ffe-api-follows";
	const CACHE_FAVORITES_KEY = "ffe-api-favorites";
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
	};
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
	function parseFollowedStoryList(body) {
	    const template = document.createElement("template");
	    template.innerHTML = body;
	    const rows = template.content.querySelectorAll("#gui_table1i tbody tr");
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
	function getFollowedStories() {
	    const list = cache$1.follows;
	    if (list) {
	        return Promise.resolve(list);
	    }
	    return ajaxCall(BASE_URL + "/alert/story.php", "GET", undefined)
	        .then(parseFollowedStoryList)
	        .then(fetchedList => cache$1.follows = fetchedList);
	}
	function getFavoritedStories() {
	    const list = cache$1.favorites;
	    if (list) {
	        return Promise.resolve(list);
	    }
	    return ajaxCall(BASE_URL + "/favorites/story.php", "GET", undefined)
	        .then(parseFollowedStoryList)
	        .then(fetchedList => cache$1.favorites = fetchedList);
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
	        follow.addEventListener("click", this.clickFollow);
	        getFollowedStories().then(stories => {
	            if (stories.some(s => s.id === environment.currentStoryId)) {
	                follow.classList.add("ffe-sc-active");
	            }
	        }).catch(console.error);
	        mark.appendChild(follow);
	        const favorite = this.document.createElement("span");
	        favorite.className = "ffe-sc-favorite btn icon-heart";
	        favorite.addEventListener("click", this.clickFavorite);
	        getFavoritedStories().then(stories => {
	            if (stories.some(s => s.id === environment.currentStoryId)) {
	                favorite.classList.add("ffe-sc-active");
	            }
	        }).catch(console.error);
	        mark.appendChild(favorite);
	        header.appendChild(mark);
	        element.appendChild(header);
	    }
	    clickFollow(event) {
	        const promise = (event.target.classList.contains("ffe-sc-active")) ?
	            unFollowStory(environment.currentStory)
	                .then(data => {
	                event.target.classList.remove("ffe-sc-active");
	                ffnServices.xtoast("We have successfully processed the following: <ul><li>Unfollowing the story</li></ul>", 3500);
	            }) :
	            followStory(environment.currentStory)
	                .then(data => {
	                event.target.classList.add("ffe-sc-active");
	                ffnServices.xtoast("We have successfully processed the following: " + data.payload_data, 3500);
	            });
	        promise
	            .catch(err => {
	            console.error(err);
	            ffnServices.xtoast("We are unable to process your request due to an network error. Please try again later.");
	        });
	    }
	    clickFavorite(event) {
	        const promise = (event.target.classList.contains("ffe-sc-active")) ?
	            unFavoriteStory(environment.currentStory)
	                .then(data => {
	                event.target.classList.remove("ffe-sc-active");
	                ffnServices.xtoast("We have successfully processed the following: <ul><li>Unfavoring the story</li></ul>", 3500);
	            }) :
	            favoriteStory(environment.currentStory)
	                .then(data => {
	                event.target.classList.add("ffe-sc-active");
	                ffnServices.xtoast("We have successfully processed the following: " + data.payload_data, 3500);
	            });
	        promise
	            .catch(err => {
	            console.error(err);
	            ffnServices.xtoast("We are unable to process your request due to an network error. Please try again later.");
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

	var css$3 = "";
	styleInject(css$3);

	class StoryProfile {
	    constructor(document) {
	        this.document = document;
	    }
	    enhance() {
	        const profile = this.document.getElementById("profile_top");
	        const card = new StoryCard(document);
	        const replacement = card.createElement(environment.currentStory);
	        // profile.parentElement.replaceChild(replacement, profile);
	        profile.parentElement.insertBefore(replacement, profile);
	        profile.style.display = "none";
	    }
	}

	var css$4 = ".storytext p {\n\tcolor: #333;\n\ttext-align: justify;\n}\n\n.storytext.xlight p {\n\tcolor: #ddd;\n}\n";
	styleInject(css$4);

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
	        if (!jQuery.cookie("xcookie2")) {
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

	if (environment.currentPageType === 2 /* Story */) {
	    const storyProfileEnhancer = new StoryProfile(document);
	    storyProfileEnhancer.enhance();
	    const chapterListEnhancer = new ChapterList(document);
	    chapterListEnhancer.enhance();
	}
	if (environment.currentPageType === 3 /* Chapter */) {
	    const storyProfileEnhancer = new StoryProfile(document);
	    storyProfileEnhancer.enhance();
	    const storyTextEnhancer = new StoryText(document);
	    storyTextEnhancer.enhance();
	    if (environment.currentChapter) {
	        const markRead = () => {
	            const amount = document.documentElement.scrollTop;
	            const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
	            if (amount / (max - 550) >= 1) {
	                environment.currentChapter.read(true);
	                window.removeEventListener("scroll", markRead);
	            }
	        };
	        window.addEventListener("scroll", markRead);
	    }
	}

}(ko,jQuery));
