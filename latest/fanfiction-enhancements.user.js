// ==UserScript==
// @name         FanFiction Enhancements
// @namespace    https://tiger.rocks/
// @version      0.1.0+9.52546c2
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
// @grant        GM_addStyle
// ==/UserScript==

(function () {
'use strict';

var StoryProfile = /** @class */ (function () {
    function StoryProfile(profile) {
        this.profile = profile;
        this.tags = new StoryMetaData();
        var offset = 0;
        var icon = profile.children[0].firstChild;
        if (icon.nodeName === "IMG") {
            this.iconElement = icon;
        }
        else {
            offset--;
        }
        this.titleElement = profile.children[2 + offset];
        this.authorByElement = profile.children[3 + offset];
        this.authorElement = profile.children[4 + offset];
        this.descriptionElement = profile.children[7 + offset];
        this.tagsElement = profile.children[8 + offset];
        this.parseTags();
    }
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
    StoryProfile.prototype.enhance = function () {
        GM_addStyle("\n\t\t\t.ffe-sp-rating {\n\t\t\t\tbackground: gray;\n\t\t\t\tpadding: 3px 5px;\n\t\t\t\tcolor: #fff !important;\n\t\t\t\tborder: 1px solid rgba(0, 0, 0, 0.2);\n\t\t\t\ttext-shadow: -1px -1px rgba(0, 0, 0, 0.2);\n\t\t\t\tborder-radius: 4px;\n\t\t\t\tmargin-right: 5px;\n\t\t\t\tvertical-align: 2px;\n\t\t\t}\n\t\t\t\n\t\t\t.ffe-sp-rating:hover {\n\t\t\t\tborder-bottom: 1px solid rgba(0, 0, 0, 0.2) !important;\n\t\t\t}\n\t\t\t\n\t\t\t.ffe-sp-rating-k,\n\t\t\t.ffe-sp-rating-kp {\n\t\t\t\tbackground: #78ac40;\n\t\t\t\tbox-shadow: 0 1px 0 #90ce4d inset;\n\t\t\t}\n\t\t\t\n\t\t\t.ffe-sp-rating-t,\n\t\t\t.ffe-sp-rating-m {\n\t\t\t\tbackground: #ffb400;\n\t\t\t\tbox-shadow: 0 1px 0 #ffd800 inset;\n\t\t\t}\n\t\t\t\n\t\t\t.ffe-sp-rating-ma {\n\t\t\t\tbackground: #c03d2f;\n\t\t\t\tbox-shadow: 0 1px 0 #e64938 inset;\n\t\t\t}\n\t\t\t\n\t\t\t.storytext p {\n\t\t\t\tcolor: #333;\n\t\t\t\ttext-align: justify;\n\t\t\t}\n\t\t\t\n\t\t\t.storytext.xlight p {\n\t\t\t\tcolor: #ddd;\n\t\t\t}\n\t\t");
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
    };
    return StoryProfile;
}());
var StoryMetaData = /** @class */ (function () {
    function StoryMetaData() {
    }
    return StoryMetaData;
}());

var profile = document.getElementById("profile_top");
var storyProfile = new StoryProfile(profile);
storyProfile.enhance();

}());
