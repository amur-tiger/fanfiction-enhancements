// ==UserScript==
// @name         FanFiction Enhancements
// @namespace    https://tiger.rocks/
// @version      0.1.0+11.3b792fa
// @description  FanFiction.net Enhancements
// @author       Arne 'TigeR' Linck
// @copyright    2018, Arne 'TigeR' Linck
// @license      MIT, https://github.com/NekiCat/fanfiction-enhancements/blob/master/LICENSE
// @homepageURL  https://github.com/NekiCat/fanfiction-enhancements
// @supportURL   https://github.com/NekiCat/fanfiction-enhancements/issues
// @updateURL    https://nekicat.github.io/fanfiction-enhancements/latest/fanfiction-enhancements.meta.js
// @downloadURL  https://nekicat.github.io/fanfiction-enhancements/latest/fanfiction-enhancements.user.js
// @require      https://raw.githubusercontent.com/taylorhakes/promise-polyfill/master/promise.min.js
// @match        *://www.fanfiction.net/*
// ==/UserScript==

(function () {
'use strict';

function __$$styleInject(css, ref) {
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

var css = ".ffe-sp-rating {\n\tbackground: gray;\n\tpadding: 3px 5px;\n\tcolor: #fff !important;\n\tborder: 1px solid rgba(0, 0, 0, 0.2);\n\ttext-shadow: -1px -1px rgba(0, 0, 0, 0.2);\n\tborder-radius: 4px;\n\tmargin-right: 5px;\n\tvertical-align: 2px;\n}\n\n.ffe-sp-rating:hover {\n\tborder-bottom: 1px solid rgba(0, 0, 0, 0.2) !important;\n}\n\n.ffe-sp-rating-k,\n.ffe-sp-rating-kp {\n\tbackground: #78ac40;\n\tbox-shadow: 0 1px 0 #90ce4d inset;\n}\n\n.ffe-sp-rating-t,\n.ffe-sp-rating-m {\n\tbackground: #ffb400;\n\tbox-shadow: 0 1px 0 #ffd800 inset;\n}\n\n.ffe-sp-rating-ma {\n\tbackground: #c03d2f;\n\tbox-shadow: 0 1px 0 #e64938 inset;\n}\n\n.ffe-sp-footer {\n\tbackground: #f6f7ee;\n\tborder-bottom: 1px solid #cdcdcd;\n\tborder-top: 1px solid #cdcdcd;\n\tcolor: #555;\n\tfont-size: .9em;\n\tmargin-left: -.5em;\n\tmargin-right: -.5em;\n\tmargin-top: 1em;\n\tpadding: 10px .5em;\n}\n\n.ffe-sp-footer-info {\n\tbackground: #fff;\n\tborder: 1px solid rgba(0, 0, 0, 0.15);\n\tborder-radius: 4px;\n\tfloat: left;\n\tline-height: 16px;\n\tmargin-top: -5px;\n\tmargin-right: 5px;\n\tpadding: 3px 8px;\n}\n\n.ffe-sp-footer-complete {\n\tbackground: #63bd40;\n\tcolor: #fff;\n}\n\n.ffe-sp-footer-incomplete {\n\tbackground: #f7a616;\n\tcolor: #fff;\n}\n";
__$$styleInject(css);

var StoryProfile = /** @class */ (function () {
    function StoryProfile(profile) {
        this.profile = profile;
        this.tags = {};
        var offset = 0;
        var icon = profile.children[0].firstChild;
        if (icon.nodeName === "IMG") {
            this.iconElement = icon;
        }
        else {
            offset--;
        }
        this.titleElement = profile.children[offset + 2];
        this.authorByElement = profile.children[offset + 3];
        this.authorElement = profile.children[offset + 4];
        this.descriptionElement = profile.children[offset + 7];
        this.tagsElement = profile.children[offset + 8];
        this.parseTags();
    }
    StoryProfile.prototype.enhance = function () {
        var rating = document.createElement("a");
        rating.href = "https://www.fictionratings.com/";
        rating.className += " ffe-sp-rating";
        rating.rel = "noreferrer";
        rating.target = "rating";
        rating.textContent = this.tags.rating;
        switch (this.tags.rating) {
            case "K":
                rating.title = "General Audience (5+)";
                rating.className += " ffe-sp-rating-k";
                break;
            case "K+":
                rating.title = "Young Children (9+)";
                rating.className += " ffe-sp-rating-kp";
                break;
            case "T":
                rating.title = "Teens (13+)";
                rating.className += " ffe-sp-rating-t";
                break;
            case "M":
                rating.title = "Teens (16+)";
                rating.className += " ffe-sp-rating-m";
                break;
            case "MA":
                rating.title = "Mature (18+)";
                rating.className += " ffe-sp-rating-ma";
                break;
        }
        this.profile.insertBefore(rating, this.titleElement);
        this.titleElement.style.fontSize = "1.5em";
        this.authorByElement.textContent = "by";
        var footer = document.createElement("div");
        footer.className += " ffe-sp-footer";
        var footerContent = "&nbsp;";
        if (this.tags.words) {
            footerContent += '<div style="float: right;"><b>' + this.tags.words.toLocaleString("en") + "</b> words</div>";
        }
        if (this.tags.status == "Complete") {
            footerContent += '<span class="ffe-sp-footer-info ffe-sp-footer-complete">Complete</span>';
        }
        else {
            footerContent += '<span class="ffe-sp-footer-info ffe-sp-footer-incomplete">Incomplete</span>';
        }
        if (this.tags.published) {
            footerContent += '<span class="ffe-sp-footer-info"><b>Published:</b> <time datetime="' +
                this.tags.published.toISOString() + '">' + this.tags.published.toLocaleDateString() + "</time></span>";
        }
        if (this.tags.updated) {
            footerContent += '<span class="ffe-sp-footer-info"><b>Updated:</b> <time datetime="' +
                this.tags.updated.toISOString() + '">' + this.tags.updated.toLocaleDateString() + "</time></span>";
        }
        footer.innerHTML = footerContent;
        this.profile.parentElement.insertBefore(footer, this.profile.nextElementSibling);
    };
    StoryProfile.prototype.parseTags = function () {
        var tagsArray = this.tagsElement.innerHTML.split(" - ");
        var tempElement = document.createElement("div");
        tempElement.innerHTML = tagsArray[0].trim().substring(7).replace(/>.*?\s+(.*?)</, ">$1<");
        this.tags.rating = tempElement.firstElementChild.textContent;
        this.tags.language = tagsArray[1].trim();
        this.tags.genre = tagsArray[2].trim();
        for (var i = 3; i < tagsArray.length; i++) {
            var tagNameMatch = tagsArray[i].match(/^(\w+):/);
            if (!tagNameMatch) {
                this.tags.characters = tagsArray[i].trim().split(/,\s+/);
                continue;
            }
            var tagName = tagNameMatch[1].toLowerCase();
            var tagValue = tagsArray[i].match(/^.*?:\s+(.*?)\s*$/)[1];
            switch (tagName) {
                case "characters":
                    this.tags.characters = tagsArray[i].trim().split(/,\s+/);
                    break;
                case "reviews":
                    tempElement.innerHTML = tagValue;
                    this.tags.reviews = +tempElement.firstElementChild.textContent;
                    break;
                case "published":
                case "updated":
                    tempElement.innerHTML = tagValue;
                    this.tags[tagName] = new Date(+tempElement.firstElementChild.getAttribute("data-xutime") * 1000);
                    break;
                default:
                    if (/^[0-9,.]*$/.test(tagValue)) {
                        this.tags[tagName] = +tagValue.replace(/,/g, "");
                    }
                    else {
                        this.tags[tagName] = tagValue;
                    }
                    break;
            }
        }
    };
    return StoryProfile;
}());

/**
 * Loads a script dynamically by creating a script element and attaching it to the head element.
 * @param {string} url
 * @returns {Promise}
 */

/**
 * Makes an AJAX GET call, optionally with additional headers.
 * @param {string} url
 * @param {object} [options]
 * @returns {Promise}
 */

/**
 * Parses an RGB-color-string as returned from `element.style.color` to a CSS hex-notation.
 * @param {string} rgb
 * @returns {string|boolean}
 */

/**
 * Converts a font size in PT to a font size in EM, assuming default values for DPI.
 * @param {string} pt
 * @param {number} [base]
 * @returns {string|boolean}
 */

/**
 * Turns anything that has a length and an indexer to access values into a proper array.
 * @param value
 * @returns {Array}
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
/**
 * Sets the cookie with the given name to the given value. If days is not given, an expiration date is not set
 * and the cookie will be deleted at the end of the session.
 * @param {string} name
 * @param {string} value
 * @param {number} days
 */

/**
 * Deletes the cookie with the given name.
 * @param {string} name
 */

var css$2 = ".storytext p {\n\tcolor: #333;\n\ttext-align: justify;\n}\n\n.storytext.xlight p {\n\tcolor: #ddd;\n}\n";
__$$styleInject(css$2);

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
            if (element.style.userSelect == "text") {
                clearTimeout(handle);
            }
            else {
                element.style.userSelect = "text";
            }
        }, 150);
    };
    return StoryText;
}());

var profile = document.getElementById("profile_top");
var storyProfile = new StoryProfile(profile);
storyProfile.enhance();
var text = document.getElementById("storytextp");
var storyText = new StoryText(text);
storyText.enhance();

}());
