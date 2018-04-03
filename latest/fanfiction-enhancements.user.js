// ==UserScript==
// @name         FanFiction Enhancements
// @namespace    https://tiger.rocks/
// @version      0.1.4+15.07d4db3
// @description  FanFiction.net Enhancements
// @author       Arne 'TigeR' Linck
// @copyright    2018, Arne 'TigeR' Linck
// @license      MIT, https://github.com/NekiCat/fanfiction-enhancements/blob/master/LICENSE
// @homepageURL  https://github.com/NekiCat/fanfiction-enhancements
// @supportURL   https://github.com/NekiCat/fanfiction-enhancements/issues
// @updateURL    https://nekicat.github.io/fanfiction-enhancements/latest/fanfiction-enhancements.meta.js
// @downloadURL  https://nekicat.github.io/fanfiction-enhancements/latest/fanfiction-enhancements.user.js
// @require      https://cdn.jsdelivr.net/npm/promise-polyfill@7/dist/polyfill.min.js
// @match        *://www.fanfiction.net/*
// ==/UserScript==

(function () {
	'use strict';

	var StoryProfileParser = /** @class */ (function () {
	    function StoryProfileParser() {
	    }
	    StoryProfileParser.prototype.parse = function (profile, chapters) {
	        if (!profile) {
	            throw new Error("Profile node must be defined.");
	        }
	        if (!chapters) {
	            throw new Error("Chapters must be defined.");
	        }
	        var story = this.parseProfile(profile);
	        story.chapters = this.parseChapters(chapters);
	        return story;
	    };
	    StoryProfileParser.prototype.parseProfile = function (profileElement) {
	        var offset = 0;
	        var icon = profileElement.children[0].firstElementChild;
	        if (!icon || icon.nodeName !== "IMG") {
	            offset--;
	        }
	        var titleElement = profileElement.children[offset + 2];
	        var authorElement = profileElement.children[offset + 4];
	        var descriptionElement = profileElement.children[offset + 7];
	        var tagsElement = profileElement.children[offset + 8];
	        var resultMeta = this.parseTags(tagsElement);
	        resultMeta.imageUrl = icon && icon.nodeName === "IMG" ? icon.src : undefined;
	        return {
	            id: resultMeta.id,
	            title: titleElement.textContent,
	            author: {
	                id: +authorElement.href.match(/\/u\/(\d+)\//i)[1],
	                name: authorElement.textContent,
	                profileUrl: authorElement.href,
	                avatarUrl: undefined,
	            },
	            description: descriptionElement.textContent,
	            chapters: undefined,
	            meta: resultMeta,
	        };
	    };
	    StoryProfileParser.prototype.parseTags = function (tagsElement) {
	        var result = {};
	        var tagsArray = tagsElement.innerHTML.split(" - ");
	        var tempElement = document.createElement("div");
	        tempElement.innerHTML = tagsArray[0].trim().substring(7).replace(/>.*?\s+(.*?)</, ">$1<");
	        result.rating = tempElement.firstElementChild.textContent;
	        result.language = tagsArray[1].trim();
	        result.genre = tagsArray[2].trim().split("/");
	        for (var i = 3; i < tagsArray.length; i++) {
	            var tagNameMatch = tagsArray[i].match(/^(\w+):/);
	            if (!tagNameMatch) {
	                result.characters = tagsArray[i].trim().split(/,\s+/);
	                continue;
	            }
	            var tagName = tagNameMatch[1].toLowerCase();
	            var tagValue = tagsArray[i].match(/^.*?:\s+(.*?)\s*$/s)[1];
	            switch (tagName) {
	                case "characters":
	                    result.characters = tagsArray[i].trim().split(/,\s+/);
	                    break;
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
	    };
	    StoryProfileParser.prototype.parseChapters = function (selectElement) {
	        var result = [];
	        for (var i = 0; i < selectElement.children.length; i++) {
	            var option = selectElement.children[i];
	            if (option.tagName !== "OPTION") {
	                continue;
	            }
	            var chapter = {
	                id: +option.getAttribute("value"),
	                name: option.textContent,
	            };
	            result.push(chapter);
	        }
	        return result;
	    };
	    return StoryProfileParser;
	}());

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

	var css = ".ffe-rating {\n\tbackground: gray;\n\tpadding: 3px 5px;\n\tcolor: #fff !important;\n\tborder: 1px solid rgba(0, 0, 0, 0.2);\n\ttext-shadow: -1px -1px rgba(0, 0, 0, 0.2);\n\tborder-radius: 4px;\n\tmargin-right: 5px;\n\tvertical-align: 2px;\n}\n\n.ffe-rating:hover {\n\tborder-bottom: 1px solid rgba(0, 0, 0, 0.2) !important;\n}\n\n.ffe-rating-k,\n.ffe-rating-kp {\n\tbackground: #78ac40;\n\tbox-shadow: 0 1px 0 #90ce4d inset;\n}\n\n.ffe-rating-t,\n.ffe-rating-m {\n\tbackground: #ffb400;\n\tbox-shadow: 0 1px 0 #ffd800 inset;\n}\n\n.ffe-rating-ma {\n\tbackground: #c03d2f;\n\tbox-shadow: 0 1px 0 #e64938 inset;\n}\n";
	styleInject(css);

	var Rating = /** @class */ (function () {
	    function Rating(document) {
	        this.document = document;
	    }
	    Rating.prototype.createElement = function (rating) {
	        var element = this.document.createElement("a");
	        element.href = "https://www.fictionratings.com/";
	        element.className = "ffe-rating";
	        element.rel = "noreferrer";
	        element.target = "rating";
	        element.textContent = rating;
	        switch (rating) {
	            case "K":
	                element.title = "General Audience (5+)";
	                element.className += " ffe-rating-k";
	                break;
	            case "K+":
	                element.title = "Young Children (9+)";
	                element.className += " ffe-rating-kp";
	                break;
	            case "T":
	                element.title = "Teens (13+)";
	                element.className += " ffe-rating-t";
	                break;
	            case "M":
	                element.title = "Teens (16+)";
	                element.className += " ffe-rating-m";
	                break;
	            case "MA":
	                element.title = "Mature (18+)";
	                element.className += " ffe-rating-ma";
	                break;
	            default:
	                element.textContent = "?";
	                element.title = "No Rating Available";
	                break;
	        }
	        return element;
	    };
	    return Rating;
	}());

	var css$1 = ".ffe-sc-header {\n\tborder-bottom: 1px solid silver;\n\tpadding-bottom: 8px;\n\tmargin-bottom: 8px;\n}\n\n.ffe-sc-title {\n\tcolor: #000 !important;\n\tfont-size: 1.8em;\n}\n\n.ffe-sc-title:hover {\n\tborder-bottom: 0;\n\ttext-decoration: underline;\n}\n\n.ffe-sc-by {\n\tpadding: 0 .5em;\n}\n\n.ffe-sc-image {\n\tfloat: left;\n\tborder: 1px solid silver;\n\tborder-radius: 3px;\n\tpadding: 3px;\n\tmargin-right: 8px;\n\tmargin-bottom: 8px;\n}\n\n.ffe-sc-description {\n\tcolor: #333;\n\tfont-family: \"Open Sans\", sans-serif;\n\tfont-size: 1.1em;\n\tline-height: 1.4em;\n}\n\n.ffe-sc-tags {\n\tcolor: gray;\n\tline-height: 1.4em;\n\tmargin-top: 6px;\n}\n\n.ffe-sc-tag:before {\n\tcontent: \" - \";\n}\n\n.ffe-sc-tag:first-child:before {\n\tcontent: \"\";\n}\n\n.ffe-sc-footer {\n\tclear: left;\n\tbackground: #f6f7ee;\n\tborder-bottom: 1px solid #cdcdcd;\n\tborder-top: 1px solid #cdcdcd;\n\tcolor: #555;\n\tfont-size: .9em;\n\tmargin-left: -.5em;\n\tmargin-right: -.5em;\n\tmargin-top: 1em;\n\tpadding: 10px .5em;\n}\n\n.ffe-sc-footer-info {\n\tbackground: #fff;\n\tborder: 1px solid rgba(0, 0, 0, 0.15);\n\tborder-radius: 4px;\n\tfloat: left;\n\tline-height: 16px;\n\tmargin-top: -5px;\n\tmargin-right: 5px;\n\tpadding: 3px 8px;\n}\n\n.ffe-sc-footer-complete {\n\tbackground: #63bd40;\n\tcolor: #fff;\n}\n\n.ffe-sc-footer-incomplete {\n\tbackground: #f7a616;\n\tcolor: #fff;\n}\n";
	styleInject(css$1);

	var StoryCard = /** @class */ (function () {
	    function StoryCard(document) {
	        this.document = document;
	    }
	    StoryCard.prototype.createElement = function (story) {
	        var element = this.document.createElement("div");
	        element.className = "ffe-sc";
	        this.addHeader(element, story);
	        this.addImage(element, story.meta);
	        this.addDescription(element, story);
	        this.addTags(element, story);
	        this.addFooter(element, story.meta);
	        return element;
	    };
	    StoryCard.prototype.addHeader = function (element, story) {
	        var header = this.document.createElement("div");
	        header.className = "ffe-sc-header";
	        var rating = new Rating(this.document).createElement(story.meta.rating);
	        header.appendChild(rating);
	        var title = this.document.createElement("a");
	        title.className = "ffe-sc-title";
	        title.textContent = story.title;
	        title.href = "/s/" + story.id;
	        header.appendChild(title);
	        var by = this.document.createElement("span");
	        by.className = "ffe-sc-by";
	        by.textContent = "by";
	        header.appendChild(by);
	        var author = this.document.createElement("a");
	        author.className = "ffe-sc-author";
	        author.textContent = story.author ? story.author.name : "?";
	        author.href = "/u/" + (story.author ? story.author.id : "?");
	        header.appendChild(author);
	        element.appendChild(header);
	    };
	    StoryCard.prototype.addImage = function (element, story) {
	        if (!story.imageUrl) {
	            return;
	        }
	        var imageContainer = this.document.createElement("div");
	        imageContainer.className = "ffe-sc-image";
	        var image = this.document.createElement("img");
	        image.src = story.imageUrl;
	        imageContainer.appendChild(image);
	        element.appendChild(imageContainer);
	    };
	    StoryCard.prototype.addDescription = function (element, story) {
	        var description = this.document.createElement("div");
	        description.className = "ffe-sc-description";
	        description.textContent = story.description;
	        element.appendChild(description);
	    };
	    StoryCard.prototype.addTags = function (element, story) {
	        var tags = this.document.createElement("div");
	        tags.className = "ffe-sc-tags";
	        var html = "";
	        if (story.meta.language) {
	            html += "<span class=\"ffe-sc-tag\">" + story.meta.language + "</span>";
	        }
	        if (story.meta.genre) {
	            html += "<span class=\"ffe-sc-tag\">" + story.meta.genre.join("/") + "</span>";
	        }
	        if (story.chapters && story.chapters.length) {
	            html += "<span class=\"ffe-sc-tag\">Chapters: " + story.chapters.length + "</span>";
	        }
	        if (story.meta.reviews) {
	            html += "<span class=\"ffe-sc-tag\"><a href=\"/r/" + story.id + "/\">Reviews: " + story.meta.reviews + "</a></span>";
	        }
	        if (story.meta.favs) {
	            html += "<span class=\"ffe-sc-tag\">Favorites: " + story.meta.favs + "</span>";
	        }
	        if (story.meta.follows) {
	            html += "<span class=\"ffe-sc-tag\">Follows: " + story.meta.follows + "</span>";
	        }
	        tags.innerHTML = html;
	        element.appendChild(tags);
	    };
	    StoryCard.prototype.addFooter = function (element, story) {
	        var footer = this.document.createElement("div");
	        footer.className = "ffe-sc-footer";
	        footer.innerHTML = "&nbsp;";
	        if (story.words) {
	            var words = this.document.createElement("div");
	            words.style.cssFloat = "right";
	            words.innerHTML = "<b>" + story.words.toLocaleString("en") + "</b> words";
	            footer.appendChild(words);
	        }
	        var status = this.document.createElement("span");
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
	            var published = this.document.createElement("span");
	            published.className = "ffe-sc-footer-info";
	            published.innerHTML = "<b>Published:</b> ";
	            var time = this.document.createElement("time");
	            time.dateTime = story.published.toISOString();
	            time.textContent = story.publishedWords;
	            published.appendChild(time);
	            footer.appendChild(published);
	        }
	        if (story.updated) {
	            var updated = this.document.createElement("span");
	            updated.className = "ffe-sc-footer-info";
	            updated.innerHTML = "<b>Updated:</b> ";
	            var time = this.document.createElement("time");
	            time.dateTime = story.updated.toISOString();
	            time.textContent = story.updatedWords;
	            updated.appendChild(time);
	            footer.appendChild(updated);
	        }
	        element.appendChild(footer);
	    };
	    return StoryCard;
	}());

	var css$2 = "";
	styleInject(css$2);

	var StoryProfile = /** @class */ (function () {
	    function StoryProfile(document) {
	        this.document = document;
	    }
	    StoryProfile.prototype.enhance = function () {
	        var profile = this.document.getElementById("profile_top");
	        if (!profile) {
	            throw new Error("Could not find profile element. Check for update?");
	        }
	        var chapters = this.document.getElementById("chap_select");
	        if (!chapters) {
	            throw new Error("Could not find chapter select element. Check for update?");
	        }
	        var parser = new StoryProfileParser();
	        var story = parser.parse(profile, chapters);
	        var card = new StoryCard(document);
	        var replacement = card.createElement(story);
	        profile.parentElement.replaceChild(replacement, profile);
	    };
	    return StoryProfile;
	}());

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
	    var ca = document.cookie.split(";");
	    for (var i = 0; i < ca.length; i++) {
	        var c = ca[i].trimLeft();
	        if (c.indexOf(name + "=") == 0) {
	            return c.substring(name.length + 1, c.length);
	        }
	    }
	    return false;
	}

	var css$3 = ".storytext p {\n\tcolor: #333;\n\ttext-align: justify;\n}\n\n.storytext.xlight p {\n\tcolor: #ddd;\n}\n";
	styleInject(css$3);

	var StoryText = /** @class */ (function () {
	    function StoryText(text) {
	        this.text = text;
	        // nothing to do here
	    }
	    StoryText.prototype.enhance = function () {
	        this.fixUserSelect();
	        if (!getCookie("xcookie2")) {
	            XCOOKIE.read_font = "Open Sans";
	            XCOOKIE.read_font_size = "1.2";
	            XCOOKIE.read_line_height = "2.00";
	            XCOOKIE.read_width = 75;
	            _fontastic_save();
	            var text = this.text.firstElementChild;
	            text.style.fontFamily = XCOOKIE.read_font;
	            text.style.fontSize = XCOOKIE.read_font_size + "em";
	            text.style.lineHeight = XCOOKIE.read_line_height;
	            text.style.width = XCOOKIE.read_width + "%";
	        }
	    };
	    StoryText.prototype.fixUserSelect = function () {
	        var element = this.text;
	        var handle = setInterval(function () {
	            var rules = ["userSelect", "msUserSelect", "mozUserSelect", "khtmlUserSelect",
	                "webkitUserSelect", "webkitTouchCallout"];
	            var isOk = true;
	            for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
	                var rule = rules_1[_i];
	                if (element.style[rule] !== "inherit") {
	                    isOk = false;
	                }
	                element.style[rule] = "inherit";
	            }
	            if (isOk) {
	                clearTimeout(handle);
	            }
	        }, 150);
	    };
	    return StoryText;
	}());

	var PageIdentifier = /** @class */ (function () {
	    function PageIdentifier(location) {
	        this.location = location;
	    }
	    PageIdentifier.prototype.getPage = function () {
	        if (this.location.pathname.indexOf("/u/") == 0) {
	            return 1 /* User */;
	        }
	        if (this.location.pathname.indexOf("/s/") == 0) {
	            return 2 /* Chapter */;
	        }
	        return 0 /* Other */;
	    };
	    return PageIdentifier;
	}());

	var identifier = new PageIdentifier(window.location);
	var page = identifier.getPage();
	if (page == 2 /* Chapter */) {
	    var storyProfile = new StoryProfile(document);
	    storyProfile.enhance();
	    var text = document.getElementById("storytextp");
	    var storyText = new StoryText(text);
	    storyText.enhance();
	}

}());
