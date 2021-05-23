// ==UserScript==
// @name         FanFiction Enhancements
// @namespace    https://tiger.rocks/
// @version      0.7.1+19.5ff8d8d
// @description  FanFiction.net Enhancements
// @author       Arne 'TigeR' Linck
// @copyright    2018-2021, Arne 'TigeR' Linck
// @license      MIT, https://github.com/amur-tiger/fanfiction-enhancements/blob/master/LICENSE
// @homepageURL  https://github.com/amur-tiger/fanfiction-enhancements
// @supportURL   https://github.com/amur-tiger/fanfiction-enhancements/issues
// @updateURL    https://amur-tiger.github.io/fanfiction-enhancements/latest/fanfiction-enhancements.meta.js
// @downloadURL  https://amur-tiger.github.io/fanfiction-enhancements/latest/fanfiction-enhancements.user.js
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
// ==/UserScript==

(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __require = (x) => {
    if (typeof require !== "undefined")
      return require(x);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  };
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // node_modules/ffn-parser/lib/follows/parseFollows.js
  var require_parseFollows = __commonJS({
    "node_modules/ffn-parser/lib/follows/parseFollows.js"(exports) {
      "use strict";
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      function parseFollows4(document2, options) {
        return __awaiter(this, void 0, void 0, function* () {
          const doc = document2 !== null && document2 !== void 0 ? document2 : window.document;
          const opts = Object.assign({}, options);
          const table = doc.querySelector("form #gui_table1i");
          if (!table) {
            return void 0;
          }
          const rows = table.querySelectorAll("tbody tr");
          return Array.from(rows).filter((row) => row.children.length === 6 && row.querySelector("td") != null).map((row) => {
            const storyAnchor = row.children[0].firstElementChild;
            const userAnchor = row.children[1].firstElementChild;
            return {
              id: +storyAnchor.href.match(/\/s\/(\d+)\/.*/i)[1],
              title: storyAnchor.textContent,
              author: {
                id: +userAnchor.href.match(/\/u\/(\d+)\/.*/i)[1],
                name: userAnchor.textContent
              },
              category: row.children[2].textContent,
              updated: parseDate(row.children[3].textContent),
              added: parseDate(row.children[4].textContent)
            };
          });
        });
      }
      exports.default = parseFollows4;
      function parseDate(date) {
        const [month, day, year] = date.split("-");
        return new Date(+year, +month - 1, +day, 0, 0, 0, 0);
      }
    }
  });

  // node_modules/ffn-parser/lib/follows/model/index.js
  var require_model = __commonJS({
    "node_modules/ffn-parser/lib/follows/model/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/ffn-parser/lib/follows/index.js
  var require_follows = __commonJS({
    "node_modules/ffn-parser/lib/follows/index.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
            __createBinding(exports2, m, p);
      };
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.parseFollows = void 0;
      var parseFollows_1 = require_parseFollows();
      Object.defineProperty(exports, "parseFollows", { enumerable: true, get: function() {
        return __importDefault(parseFollows_1).default;
      } });
      __exportStar(require_parseFollows(), exports);
      __exportStar(require_model(), exports);
    }
  });

  // node_modules/ffn-parser/lib/story/parseStory.js
  var require_parseStory = __commonJS({
    "node_modules/ffn-parser/lib/story/parseStory.js"(exports) {
      "use strict";
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.parseChapters = exports.parseCharacters = exports.parseTags = exports.DEFAULT_GENRES = void 0;
      exports.DEFAULT_GENRES = [
        "General",
        "Romance",
        "Humor",
        "Drama",
        "Poetry",
        "Action",
        "Adventure",
        "Mystery",
        "Horror",
        "Parody",
        "Angst",
        "Supernatural",
        "Suspense",
        "Sci-Fi",
        "Fantasy",
        "Spiritual",
        "Tragedy",
        "Western",
        "Crime",
        "Family",
        "Hurt",
        "Comfort",
        "Friendship"
      ];
      function parseStory3(document2, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
          const doc = document2 !== null && document2 !== void 0 ? document2 : window.document;
          const opts = Object.assign({ genres: exports.DEFAULT_GENRES, createTemplate() {
            if ("createElement" in doc) {
              return doc.createElement("template");
            }
            return window.document.createElement("template");
          } }, options);
          const profileElement = doc.getElementById("profile_top");
          const chapterElement = doc.getElementById("chap_select");
          const breadcrumbElement = doc.getElementById("pre_story_links");
          if (!profileElement) {
            return void 0;
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
          const resultMeta = parseTags(tagsElement, opts.genres, opts.createTemplate);
          if (cover && cover.nodeName === "IMG") {
            resultMeta.imageUrl = cover.src;
            const oImage = doc.querySelector("#img_large img");
            if (oImage && oImage.nodeName === "IMG") {
              resultMeta.imageUrl = (_a = oImage.getAttribute("data-original")) !== null && _a !== void 0 ? _a : "";
            }
          }
          if (breadcrumbElement) {
            const universeLink = breadcrumbElement.querySelector("span :last-child");
            if (!universeLink.textContent) {
              resultMeta.universes = [];
            } else {
              resultMeta.universes = universeLink.href.includes("Crossovers") ? universeLink.textContent.substr(0, universeLink.textContent.length - 10).split(/\s+\+\s+/) : [universeLink.textContent];
            }
          }
          if (titleElement.textContent) {
            resultMeta.title = titleElement.textContent.trim();
          }
          if (authorElement.textContent) {
            resultMeta.author.name = authorElement.textContent.trim();
          }
          const match = authorElement.href.match(/\/u\/(\d+)\//i);
          if (match) {
            resultMeta.author.id = +match[1];
          }
          if (descriptionElement.textContent) {
            resultMeta.description = descriptionElement.textContent.trim();
          }
          resultMeta.chapters = chapterElement ? parseChapters(chapterElement) : [
            {
              id: 1,
              title: titleElement.textContent && titleElement.textContent.trim() || "Chapter 1"
            }
          ];
          return resultMeta;
        });
      }
      exports.default = parseStory3;
      function parseTags(tagsElement, genres, createTemplate) {
        var _a;
        const result = {
          id: 0,
          title: "",
          author: {
            id: 0,
            name: ""
          },
          description: "",
          chapters: [],
          imageUrl: void 0,
          favorites: 0,
          follows: 0,
          reviews: 0,
          genre: [],
          characters: [],
          language: "",
          published: new Date(),
          updated: void 0,
          rating: "K",
          words: 0,
          universes: [],
          status: "Incomplete"
        };
        const tagsArray = tagsElement.innerHTML.split(/\s+-\s+/);
        if (tagsArray[0] === "Crossover") {
          tagsArray.shift();
          const universes = tagsArray.shift();
          if (universes) {
            result.universes = universes.split(/\s+(?:&|&amp;)\s+/).map((u) => u.trim());
          } else {
            result.universes = [];
          }
        }
        if (tagsArray[1].startsWith("Rated:")) {
          result.universes = [tagsArray.shift().trim()];
        }
        const tempElement = createTemplate();
        tempElement.innerHTML = tagsArray[0].trim().substring(7).replace(/>.*?\s+(.*?)</, ">$1<");
        result.rating = (_a = tempElement.content.firstElementChild ? tempElement.content.firstElementChild.textContent : tempElement.content.textContent) !== null && _a !== void 0 ? _a : "?";
        result.language = tagsArray[1].trim();
        result.genre = tagsArray[2].trim().split("/");
        if (result.genre.some((g) => !genres.includes(g))) {
          result.genre = [];
          if (!/^\w+:/.test(tagsArray[2])) {
            result.characters = parseCharacters(tagsArray[2]);
          }
        }
        for (let i = 3; i < tagsArray.length; i++) {
          const tagNameMatch = tagsArray[i].match(/^(\w+):/);
          if (!tagNameMatch) {
            if (tagsArray[i] === "Complete") {
              result.status = tagsArray[i] === "Complete" ? "Complete" : "Incomplete";
            } else {
              result.characters = parseCharacters(tagsArray[i]);
            }
            continue;
          }
          const tagName = tagNameMatch[1].toLowerCase();
          const match = tagsArray[i].match(/^.*?:\s+([^]*?)\s*$/);
          const tagValue = match && match[1] || "";
          switch (tagName) {
            case "favs":
              result.favorites = +tagValue.replace(/,/g, "");
              break;
            case "reviews":
              if (tagValue.includes("<a")) {
                const tempReviewsElement = createTemplate();
                tempReviewsElement.innerHTML = tagValue;
                if (tempReviewsElement.content.firstElementChild) {
                  const element = tempReviewsElement.content.firstElementChild;
                  if (element.textContent) {
                    result.reviews = +element.textContent.replace(/,/g, "");
                  } else {
                    result.reviews = 0;
                  }
                } else {
                  result.reviews = tempReviewsElement.textContent && +tempReviewsElement.textContent || 0;
                }
              } else {
                result.reviews = +tagValue.replace(/,/g, "");
              }
              break;
            case "published":
            case "updated":
              const tempTimeElement = createTemplate();
              tempTimeElement.innerHTML = tagValue;
              const child = tempTimeElement.content.firstElementChild;
              if (child && child.hasAttribute("data-xutime")) {
                result[tagName] = new Date(+child.getAttribute("data-xutime") * 1e3);
              }
              break;
            case "chapters":
              break;
            default:
              if (/^[0-9,.]*$/.test(tagValue)) {
                result[tagName] = +tagValue.replace(/,/g, "");
              } else {
                result[tagName] = tagValue;
              }
              break;
          }
        }
        return result;
      }
      exports.parseTags = parseTags;
      function parseCharacters(tag) {
        const result = [];
        const pairings = tag.trim().split(/([\[\]])\s*/).filter((pairing) => pairing.length);
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
            for (const character of characters) {
              result.push([character]);
            }
          } else {
            result.push(characters);
          }
        }
        return result;
      }
      exports.parseCharacters = parseCharacters;
      function parseChapters(selectElement) {
        var _a;
        const result = [];
        for (let i = 0; i < selectElement.children.length; i++) {
          const option = selectElement.children[i];
          if (option.tagName !== "OPTION") {
            continue;
          }
          let title2 = option.textContent;
          if (title2 && /^\d+\. .+/.test(title2)) {
            title2 = title2.substr(title2.indexOf(".") + 2);
          }
          if (!title2) {
            title2 = `Chapter ${i + 1}`;
          }
          result.push({
            id: +((_a = option.getAttribute("value")) !== null && _a !== void 0 ? _a : 0),
            title: title2
          });
        }
        return result;
      }
      exports.parseChapters = parseChapters;
    }
  });

  // node_modules/ffn-parser/lib/story/model/index.js
  var require_model2 = __commonJS({
    "node_modules/ffn-parser/lib/story/model/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/ffn-parser/lib/story/index.js
  var require_story = __commonJS({
    "node_modules/ffn-parser/lib/story/index.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
            __createBinding(exports2, m, p);
      };
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.parseStory = void 0;
      var parseStory_1 = require_parseStory();
      Object.defineProperty(exports, "parseStory", { enumerable: true, get: function() {
        return __importDefault(parseStory_1).default;
      } });
      __exportStar(require_parseStory(), exports);
      __exportStar(require_model2(), exports);
    }
  });

  // node_modules/ffn-parser/lib/storyList/parseStoryList.js
  var require_parseStoryList = __commonJS({
    "node_modules/ffn-parser/lib/storyList/parseStoryList.js"(exports) {
      "use strict";
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var story_1 = require_story();
      function parseStoryList2(document2, options) {
        return __awaiter(this, void 0, void 0, function* () {
          const doc = document2 !== null && document2 !== void 0 ? document2 : window.document;
          const opts = Object.assign({ genres: story_1.DEFAULT_GENRES, createTemplate() {
            if ("createElement" in doc) {
              return doc.createElement("template");
            }
            return window.document.createElement("template");
          } }, options);
          const universes = [];
          const links = doc.querySelectorAll("#content_wrapper_inner > a");
          if (links.length > 1) {
            universes.push(links.item(0).textContent);
            universes.push(links.item(1).textContent);
          } else {
            const container2 = doc.getElementById("content_wrapper_inner");
            let text = "";
            for (const node of Array.from(container2.childNodes)) {
              if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent;
              }
            }
            universes.push(...text.split(/\n+/g).map((u) => u.trim()).filter((u) => u.length > 0 && u !== "Crossovers"));
          }
          const rows = doc.querySelectorAll(".z-list");
          if (rows.length === 0) {
            return void 0;
          }
          return Array.from(rows).map((row) => {
            const storyAnchor = row.firstElementChild;
            const authorAnchor = row.querySelector('a[href^="/u/"]');
            const descriptionElement = row.querySelector(".z-indent");
            const tagsElement = row.querySelector(".z-padtop2");
            const meta = story_1.parseTags(tagsElement, opts.genres, opts.createTemplate);
            const description = Array.from(descriptionElement.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE).map((node) => node.textContent).join(" ");
            let imageUrl = void 0;
            const imageElement = row.querySelector("img");
            if (imageElement) {
              imageUrl = imageElement.dataset["original"];
            }
            return {
              id: +storyAnchor.href.match(/\/s\/(\d+)\/.*/i)[1],
              title: storyAnchor.textContent,
              author: {
                id: +authorAnchor.href.match(/\/u\/(\d+)\/.*/i)[1],
                name: authorAnchor.textContent
              },
              description,
              imageUrl,
              favorites: meta.favorites,
              follows: meta.follows,
              reviews: meta.reviews,
              genre: meta.genre,
              characters: meta.characters,
              language: meta.language,
              published: meta.published,
              updated: meta.updated,
              rating: meta.rating,
              words: meta.words,
              universes: meta.universes.length > 0 ? meta.universes : universes,
              status: meta.status
            };
          });
        });
      }
      exports.default = parseStoryList2;
    }
  });

  // node_modules/ffn-parser/lib/storyList/model/index.js
  var require_model3 = __commonJS({
    "node_modules/ffn-parser/lib/storyList/model/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/ffn-parser/lib/storyList/index.js
  var require_storyList = __commonJS({
    "node_modules/ffn-parser/lib/storyList/index.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
            __createBinding(exports2, m, p);
      };
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.parseStoryList = void 0;
      var parseStoryList_1 = require_parseStoryList();
      Object.defineProperty(exports, "parseStoryList", { enumerable: true, get: function() {
        return __importDefault(parseStoryList_1).default;
      } });
      __exportStar(require_parseStoryList(), exports);
      __exportStar(require_model3(), exports);
    }
  });

  // node_modules/ffn-parser/lib/index.js
  var require_lib = __commonJS({
    "node_modules/ffn-parser/lib/index.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
            __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      __exportStar(require_follows(), exports);
      __exportStar(require_story(), exports);
      __exportStar(require_storyList(), exports);
    }
  });

  // node_modules/jszip/dist/jszip.min.js
  var require_jszip_min = __commonJS({
    "node_modules/jszip/dist/jszip.min.js"(exports, module) {
      !function(e) {
        if (typeof exports == "object" && typeof module != "undefined")
          module.exports = e();
        else if (typeof define == "function" && define.amd)
          define([], e);
        else {
          (typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this).JSZip = e();
        }
      }(function() {
        return function s(a, o, u) {
          function h(r, e2) {
            if (!o[r]) {
              if (!a[r]) {
                var t = typeof __require == "function" && __require;
                if (!e2 && t)
                  return t(r, true);
                if (f)
                  return f(r, true);
                var n = new Error("Cannot find module '" + r + "'");
                throw n.code = "MODULE_NOT_FOUND", n;
              }
              var i = o[r] = { exports: {} };
              a[r][0].call(i.exports, function(e3) {
                var t2 = a[r][1][e3];
                return h(t2 || e3);
              }, i, i.exports, s, a, o, u);
            }
            return o[r].exports;
          }
          for (var f = typeof __require == "function" && __require, e = 0; e < u.length; e++)
            h(u[e]);
          return h;
        }({ 1: [function(l, t, n) {
          (function(r) {
            !function(e) {
              typeof n == "object" && t !== void 0 ? t.exports = e() : (typeof window != "undefined" ? window : r !== void 0 ? r : typeof self != "undefined" ? self : this).JSZip = e();
            }(function() {
              return function s(a, o, u) {
                function h(t2, e2) {
                  if (!o[t2]) {
                    if (!a[t2]) {
                      var r2 = typeof l == "function" && l;
                      if (!e2 && r2)
                        return r2(t2, true);
                      if (f)
                        return f(t2, true);
                      var n2 = new Error("Cannot find module '" + t2 + "'");
                      throw n2.code = "MODULE_NOT_FOUND", n2;
                    }
                    var i = o[t2] = { exports: {} };
                    a[t2][0].call(i.exports, function(e3) {
                      return h(a[t2][1][e3] || e3);
                    }, i, i.exports, s, a, o, u);
                  }
                  return o[t2].exports;
                }
                for (var f = typeof l == "function" && l, e = 0; e < u.length; e++)
                  h(u[e]);
                return h;
              }({ 1: [function(l2, t2, n2) {
                (function(r2) {
                  !function(e) {
                    typeof n2 == "object" && t2 !== void 0 ? t2.exports = e() : (typeof window != "undefined" ? window : r2 !== void 0 ? r2 : typeof self != "undefined" ? self : this).JSZip = e();
                  }(function() {
                    return function s(a, o, u) {
                      function h(t3, e2) {
                        if (!o[t3]) {
                          if (!a[t3]) {
                            var r3 = typeof l2 == "function" && l2;
                            if (!e2 && r3)
                              return r3(t3, true);
                            if (f)
                              return f(t3, true);
                            var n3 = new Error("Cannot find module '" + t3 + "'");
                            throw n3.code = "MODULE_NOT_FOUND", n3;
                          }
                          var i = o[t3] = { exports: {} };
                          a[t3][0].call(i.exports, function(e3) {
                            return h(a[t3][1][e3] || e3);
                          }, i, i.exports, s, a, o, u);
                        }
                        return o[t3].exports;
                      }
                      for (var f = typeof l2 == "function" && l2, e = 0; e < u.length; e++)
                        h(u[e]);
                      return h;
                    }({ 1: [function(l3, t3, n3) {
                      (function(r3) {
                        !function(e) {
                          typeof n3 == "object" && t3 !== void 0 ? t3.exports = e() : (typeof window != "undefined" ? window : r3 !== void 0 ? r3 : typeof self != "undefined" ? self : this).JSZip = e();
                        }(function() {
                          return function s(a, o, u) {
                            function h(t4, e2) {
                              if (!o[t4]) {
                                if (!a[t4]) {
                                  var r4 = typeof l3 == "function" && l3;
                                  if (!e2 && r4)
                                    return r4(t4, true);
                                  if (f)
                                    return f(t4, true);
                                  var n4 = new Error("Cannot find module '" + t4 + "'");
                                  throw n4.code = "MODULE_NOT_FOUND", n4;
                                }
                                var i = o[t4] = { exports: {} };
                                a[t4][0].call(i.exports, function(e3) {
                                  return h(a[t4][1][e3] || e3);
                                }, i, i.exports, s, a, o, u);
                              }
                              return o[t4].exports;
                            }
                            for (var f = typeof l3 == "function" && l3, e = 0; e < u.length; e++)
                              h(u[e]);
                            return h;
                          }({ 1: [function(l4, t4, n4) {
                            (function(r4) {
                              !function(e) {
                                typeof n4 == "object" && t4 !== void 0 ? t4.exports = e() : (typeof window != "undefined" ? window : r4 !== void 0 ? r4 : typeof self != "undefined" ? self : this).JSZip = e();
                              }(function() {
                                return function s(a, o, u) {
                                  function h(t5, e2) {
                                    if (!o[t5]) {
                                      if (!a[t5]) {
                                        var r5 = typeof l4 == "function" && l4;
                                        if (!e2 && r5)
                                          return r5(t5, true);
                                        if (f)
                                          return f(t5, true);
                                        var n5 = new Error("Cannot find module '" + t5 + "'");
                                        throw n5.code = "MODULE_NOT_FOUND", n5;
                                      }
                                      var i = o[t5] = { exports: {} };
                                      a[t5][0].call(i.exports, function(e3) {
                                        return h(a[t5][1][e3] || e3);
                                      }, i, i.exports, s, a, o, u);
                                    }
                                    return o[t5].exports;
                                  }
                                  for (var f = typeof l4 == "function" && l4, e = 0; e < u.length; e++)
                                    h(u[e]);
                                  return h;
                                }({ 1: [function(l5, t5, n5) {
                                  (function(r5) {
                                    !function(e) {
                                      typeof n5 == "object" && t5 !== void 0 ? t5.exports = e() : (typeof window != "undefined" ? window : r5 !== void 0 ? r5 : typeof self != "undefined" ? self : this).JSZip = e();
                                    }(function() {
                                      return function s(a, o, u) {
                                        function h(t6, e2) {
                                          if (!o[t6]) {
                                            if (!a[t6]) {
                                              var r6 = typeof l5 == "function" && l5;
                                              if (!e2 && r6)
                                                return r6(t6, true);
                                              if (f)
                                                return f(t6, true);
                                              var n6 = new Error("Cannot find module '" + t6 + "'");
                                              throw n6.code = "MODULE_NOT_FOUND", n6;
                                            }
                                            var i = o[t6] = { exports: {} };
                                            a[t6][0].call(i.exports, function(e3) {
                                              return h(a[t6][1][e3] || e3);
                                            }, i, i.exports, s, a, o, u);
                                          }
                                          return o[t6].exports;
                                        }
                                        for (var f = typeof l5 == "function" && l5, e = 0; e < u.length; e++)
                                          h(u[e]);
                                        return h;
                                      }({ 1: [function(e, t6, r6) {
                                        "use strict";
                                        var c = e("./utils"), l6 = e("./support"), p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                                        r6.encode = function(e2) {
                                          for (var t7, r7, n6, i, s, a, o, u = [], h = 0, f = e2.length, l7 = f, d = c.getTypeOf(e2) !== "string"; h < e2.length; )
                                            l7 = f - h, n6 = d ? (t7 = e2[h++], r7 = h < f ? e2[h++] : 0, h < f ? e2[h++] : 0) : (t7 = e2.charCodeAt(h++), r7 = h < f ? e2.charCodeAt(h++) : 0, h < f ? e2.charCodeAt(h++) : 0), i = t7 >> 2, s = (3 & t7) << 4 | r7 >> 4, a = 1 < l7 ? (15 & r7) << 2 | n6 >> 6 : 64, o = 2 < l7 ? 63 & n6 : 64, u.push(p.charAt(i) + p.charAt(s) + p.charAt(a) + p.charAt(o));
                                          return u.join("");
                                        }, r6.decode = function(e2) {
                                          var t7, r7, n6, i, s, a, o = 0, u = 0;
                                          if (e2.substr(0, "data:".length) === "data:")
                                            throw new Error("Invalid base64 input, it looks like a data url.");
                                          var h, f = 3 * (e2 = e2.replace(/[^A-Za-z0-9\+\/\=]/g, "")).length / 4;
                                          if (e2.charAt(e2.length - 1) === p.charAt(64) && f--, e2.charAt(e2.length - 2) === p.charAt(64) && f--, f % 1 != 0)
                                            throw new Error("Invalid base64 input, bad content length.");
                                          for (h = l6.uint8array ? new Uint8Array(0 | f) : new Array(0 | f); o < e2.length; )
                                            t7 = p.indexOf(e2.charAt(o++)) << 2 | (i = p.indexOf(e2.charAt(o++))) >> 4, r7 = (15 & i) << 4 | (s = p.indexOf(e2.charAt(o++))) >> 2, n6 = (3 & s) << 6 | (a = p.indexOf(e2.charAt(o++))), h[u++] = t7, s !== 64 && (h[u++] = r7), a !== 64 && (h[u++] = n6);
                                          return h;
                                        };
                                      }, { "./support": 30, "./utils": 32 }], 2: [function(e, t6, r6) {
                                        "use strict";
                                        var n6 = e("./external"), i = e("./stream/DataWorker"), s = e("./stream/Crc32Probe"), a = e("./stream/DataLengthProbe");
                                        function o(e2, t7, r7, n7, i2) {
                                          this.compressedSize = e2, this.uncompressedSize = t7, this.crc32 = r7, this.compression = n7, this.compressedContent = i2;
                                        }
                                        o.prototype = { getContentWorker: function() {
                                          var e2 = new i(n6.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")), t7 = this;
                                          return e2.on("end", function() {
                                            if (this.streamInfo.data_length !== t7.uncompressedSize)
                                              throw new Error("Bug : uncompressed data size mismatch");
                                          }), e2;
                                        }, getCompressedWorker: function() {
                                          return new i(n6.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
                                        } }, o.createWorkerFrom = function(e2, t7, r7) {
                                          return e2.pipe(new s()).pipe(new a("uncompressedSize")).pipe(t7.compressWorker(r7)).pipe(new a("compressedSize")).withStreamInfo("compression", t7);
                                        }, t6.exports = o;
                                      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, t6, r6) {
                                        "use strict";
                                        var n6 = e("./stream/GenericWorker");
                                        r6.STORE = { magic: "\0\0", compressWorker: function(e2) {
                                          return new n6("STORE compression");
                                        }, uncompressWorker: function() {
                                          return new n6("STORE decompression");
                                        } }, r6.DEFLATE = e("./flate");
                                      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, t6, r6) {
                                        "use strict";
                                        var n6 = e("./utils"), a = function() {
                                          for (var e2, t7 = [], r7 = 0; r7 < 256; r7++) {
                                            e2 = r7;
                                            for (var n7 = 0; n7 < 8; n7++)
                                              e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
                                            t7[r7] = e2;
                                          }
                                          return t7;
                                        }();
                                        t6.exports = function(e2, t7) {
                                          return e2 !== void 0 && e2.length ? n6.getTypeOf(e2) !== "string" ? function(e3, t8, r7) {
                                            var n7 = a, i = 0 + r7;
                                            e3 ^= -1;
                                            for (var s = 0; s < i; s++)
                                              e3 = e3 >>> 8 ^ n7[255 & (e3 ^ t8[s])];
                                            return -1 ^ e3;
                                          }(0 | t7, e2, e2.length) : function(e3, t8, r7) {
                                            var n7 = a, i = 0 + r7;
                                            e3 ^= -1;
                                            for (var s = 0; s < i; s++)
                                              e3 = e3 >>> 8 ^ n7[255 & (e3 ^ t8.charCodeAt(s))];
                                            return -1 ^ e3;
                                          }(0 | t7, e2, e2.length) : 0;
                                        };
                                      }, { "./utils": 32 }], 5: [function(e, t6, r6) {
                                        "use strict";
                                        r6.base64 = false, r6.binary = false, r6.dir = false, r6.createFolders = true, r6.date = null, r6.compression = null, r6.compressionOptions = null, r6.comment = null, r6.unixPermissions = null, r6.dosPermissions = null;
                                      }, {}], 6: [function(e, t6, r6) {
                                        "use strict";
                                        var n6;
                                        n6 = typeof Promise != "undefined" ? Promise : e("lie"), t6.exports = { Promise: n6 };
                                      }, { lie: 37 }], 7: [function(e, t6, r6) {
                                        "use strict";
                                        var n6 = typeof Uint8Array != "undefined" && typeof Uint16Array != "undefined" && typeof Uint32Array != "undefined", i = e("pako"), s = e("./utils"), a = e("./stream/GenericWorker"), o = n6 ? "uint8array" : "array";
                                        function u(e2, t7) {
                                          a.call(this, "FlateWorker/" + e2), this._pako = null, this._pakoAction = e2, this._pakoOptions = t7, this.meta = {};
                                        }
                                        r6.magic = "\b\0", s.inherits(u, a), u.prototype.processChunk = function(e2) {
                                          this.meta = e2.meta, this._pako === null && this._createPako(), this._pako.push(s.transformTo(o, e2.data), false);
                                        }, u.prototype.flush = function() {
                                          a.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], true);
                                        }, u.prototype.cleanUp = function() {
                                          a.prototype.cleanUp.call(this), this._pako = null;
                                        }, u.prototype._createPako = function() {
                                          this._pako = new i[this._pakoAction]({ raw: true, level: this._pakoOptions.level || -1 });
                                          var t7 = this;
                                          this._pako.onData = function(e2) {
                                            t7.push({ data: e2, meta: t7.meta });
                                          };
                                        }, r6.compressWorker = function(e2) {
                                          return new u("Deflate", e2);
                                        }, r6.uncompressWorker = function() {
                                          return new u("Inflate", {});
                                        };
                                      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, t6, r6) {
                                        "use strict";
                                        function I(e2, t7) {
                                          var r7, n7 = "";
                                          for (r7 = 0; r7 < t7; r7++)
                                            n7 += String.fromCharCode(255 & e2), e2 >>>= 8;
                                          return n7;
                                        }
                                        function i(e2, t7, r7, n7, i2, s2) {
                                          var a, o, u = e2.file, h = e2.compression, f = s2 !== B.utf8encode, l6 = O.transformTo("string", s2(u.name)), d = O.transformTo("string", B.utf8encode(u.name)), c = u.comment, p = O.transformTo("string", s2(c)), m = O.transformTo("string", B.utf8encode(c)), _ = d.length !== u.name.length, g = m.length !== c.length, v = "", b = "", w = "", y = u.dir, k = u.date, x = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
                                          t7 && !r7 || (x.crc32 = e2.crc32, x.compressedSize = e2.compressedSize, x.uncompressedSize = e2.uncompressedSize);
                                          var S = 0;
                                          t7 && (S |= 8), f || !_ && !g || (S |= 2048);
                                          var z, E = 0, C = 0;
                                          y && (E |= 16), i2 === "UNIX" ? (C = 798, E |= ((z = u.unixPermissions) || (z = y ? 16893 : 33204), (65535 & z) << 16)) : (C = 20, E |= 63 & (u.dosPermissions || 0)), a = k.getUTCHours(), a <<= 6, a |= k.getUTCMinutes(), a <<= 5, a |= k.getUTCSeconds() / 2, o = k.getUTCFullYear() - 1980, o <<= 4, o |= k.getUTCMonth() + 1, o <<= 5, o |= k.getUTCDate(), _ && (v += "up" + I((b = I(1, 1) + I(T(l6), 4) + d).length, 2) + b), g && (v += "uc" + I((w = I(1, 1) + I(T(p), 4) + m).length, 2) + w);
                                          var A = "";
                                          return A += "\n\0", A += I(S, 2), A += h.magic, A += I(a, 2), A += I(o, 2), A += I(x.crc32, 4), A += I(x.compressedSize, 4), A += I(x.uncompressedSize, 4), A += I(l6.length, 2), A += I(v.length, 2), { fileRecord: R.LOCAL_FILE_HEADER + A + l6 + v, dirRecord: R.CENTRAL_FILE_HEADER + I(C, 2) + A + I(p.length, 2) + "\0\0\0\0" + I(E, 4) + I(n7, 4) + l6 + v + p };
                                        }
                                        var O = e("../utils"), s = e("../stream/GenericWorker"), B = e("../utf8"), T = e("../crc32"), R = e("../signature");
                                        function n6(e2, t7, r7, n7) {
                                          s.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = t7, this.zipPlatform = r7, this.encodeFileName = n7, this.streamFiles = e2, this.accumulate = false, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
                                        }
                                        O.inherits(n6, s), n6.prototype.push = function(e2) {
                                          var t7 = e2.meta.percent || 0, r7 = this.entriesCount, n7 = this._sources.length;
                                          this.accumulate ? this.contentBuffer.push(e2) : (this.bytesWritten += e2.data.length, s.prototype.push.call(this, { data: e2.data, meta: { currentFile: this.currentFile, percent: r7 ? (t7 + 100 * (r7 - n7 - 1)) / r7 : 100 } }));
                                        }, n6.prototype.openedSource = function(e2) {
                                          this.currentSourceOffset = this.bytesWritten, this.currentFile = e2.file.name;
                                          var t7 = this.streamFiles && !e2.file.dir;
                                          if (t7) {
                                            var r7 = i(e2, t7, false, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
                                            this.push({ data: r7.fileRecord, meta: { percent: 0 } });
                                          } else
                                            this.accumulate = true;
                                        }, n6.prototype.closedSource = function(e2) {
                                          this.accumulate = false;
                                          var t7, r7 = this.streamFiles && !e2.file.dir, n7 = i(e2, r7, true, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
                                          if (this.dirRecords.push(n7.dirRecord), r7)
                                            this.push({ data: (t7 = e2, R.DATA_DESCRIPTOR + I(t7.crc32, 4) + I(t7.compressedSize, 4) + I(t7.uncompressedSize, 4)), meta: { percent: 100 } });
                                          else
                                            for (this.push({ data: n7.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; )
                                              this.push(this.contentBuffer.shift());
                                          this.currentFile = null;
                                        }, n6.prototype.flush = function() {
                                          for (var e2 = this.bytesWritten, t7 = 0; t7 < this.dirRecords.length; t7++)
                                            this.push({ data: this.dirRecords[t7], meta: { percent: 100 } });
                                          var r7, n7, i2, s2, a, o, u = this.bytesWritten - e2, h = (r7 = this.dirRecords.length, n7 = u, i2 = e2, s2 = this.zipComment, a = this.encodeFileName, o = O.transformTo("string", a(s2)), R.CENTRAL_DIRECTORY_END + "\0\0\0\0" + I(r7, 2) + I(r7, 2) + I(n7, 4) + I(i2, 4) + I(o.length, 2) + o);
                                          this.push({ data: h, meta: { percent: 100 } });
                                        }, n6.prototype.prepareNextSource = function() {
                                          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
                                        }, n6.prototype.registerPrevious = function(e2) {
                                          this._sources.push(e2);
                                          var t7 = this;
                                          return e2.on("data", function(e3) {
                                            t7.processChunk(e3);
                                          }), e2.on("end", function() {
                                            t7.closedSource(t7.previous.streamInfo), t7._sources.length ? t7.prepareNextSource() : t7.end();
                                          }), e2.on("error", function(e3) {
                                            t7.error(e3);
                                          }), this;
                                        }, n6.prototype.resume = function() {
                                          return !!s.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), true) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), true));
                                        }, n6.prototype.error = function(e2) {
                                          var t7 = this._sources;
                                          if (!s.prototype.error.call(this, e2))
                                            return false;
                                          for (var r7 = 0; r7 < t7.length; r7++)
                                            try {
                                              t7[r7].error(e2);
                                            } catch (e3) {
                                            }
                                          return true;
                                        }, n6.prototype.lock = function() {
                                          s.prototype.lock.call(this);
                                          for (var e2 = this._sources, t7 = 0; t7 < e2.length; t7++)
                                            e2[t7].lock();
                                        }, t6.exports = n6;
                                      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, t6, r6) {
                                        "use strict";
                                        var h = e("../compressions"), n6 = e("./ZipFileWorker");
                                        r6.generateWorker = function(e2, a, t7) {
                                          var o = new n6(a.streamFiles, t7, a.platform, a.encodeFileName), u = 0;
                                          try {
                                            e2.forEach(function(e3, t8) {
                                              u++;
                                              var r7 = function(e4, t9) {
                                                var r8 = e4 || t9, n8 = h[r8];
                                                if (!n8)
                                                  throw new Error(r8 + " is not a valid compression method !");
                                                return n8;
                                              }(t8.options.compression, a.compression), n7 = t8.options.compressionOptions || a.compressionOptions || {}, i = t8.dir, s = t8.date;
                                              t8._compressWorker(r7, n7).withStreamInfo("file", { name: e3, dir: i, date: s, comment: t8.comment || "", unixPermissions: t8.unixPermissions, dosPermissions: t8.dosPermissions }).pipe(o);
                                            }), o.entriesCount = u;
                                          } catch (e3) {
                                            o.error(e3);
                                          }
                                          return o;
                                        };
                                      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, t6, r6) {
                                        "use strict";
                                        function n6() {
                                          if (!(this instanceof n6))
                                            return new n6();
                                          if (arguments.length)
                                            throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
                                          this.files = {}, this.comment = null, this.root = "", this.clone = function() {
                                            var e2 = new n6();
                                            for (var t7 in this)
                                              typeof this[t7] != "function" && (e2[t7] = this[t7]);
                                            return e2;
                                          };
                                        }
                                        (n6.prototype = e("./object")).loadAsync = e("./load"), n6.support = e("./support"), n6.defaults = e("./defaults"), n6.version = "3.5.0", n6.loadAsync = function(e2, t7) {
                                          return new n6().loadAsync(e2, t7);
                                        }, n6.external = e("./external"), t6.exports = n6;
                                      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, t6, r6) {
                                        "use strict";
                                        var n6 = e("./utils"), i = e("./external"), o = e("./utf8"), u = e("./zipEntries"), s = e("./stream/Crc32Probe"), h = e("./nodejsUtils");
                                        function f(n7) {
                                          return new i.Promise(function(e2, t7) {
                                            var r7 = n7.decompressed.getContentWorker().pipe(new s());
                                            r7.on("error", function(e3) {
                                              t7(e3);
                                            }).on("end", function() {
                                              r7.streamInfo.crc32 !== n7.decompressed.crc32 ? t7(new Error("Corrupted zip : CRC32 mismatch")) : e2();
                                            }).resume();
                                          });
                                        }
                                        t6.exports = function(e2, s2) {
                                          var a = this;
                                          return s2 = n6.extend(s2 || {}, { base64: false, checkCRC32: false, optimizedBinaryString: false, createFolders: false, decodeFileName: o.utf8decode }), h.isNode && h.isStream(e2) ? i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : n6.prepareContent("the loaded zip file", e2, true, s2.optimizedBinaryString, s2.base64).then(function(e3) {
                                            var t7 = new u(s2);
                                            return t7.load(e3), t7;
                                          }).then(function(e3) {
                                            var t7 = [i.Promise.resolve(e3)], r7 = e3.files;
                                            if (s2.checkCRC32)
                                              for (var n7 = 0; n7 < r7.length; n7++)
                                                t7.push(f(r7[n7]));
                                            return i.Promise.all(t7);
                                          }).then(function(e3) {
                                            for (var t7 = e3.shift(), r7 = t7.files, n7 = 0; n7 < r7.length; n7++) {
                                              var i2 = r7[n7];
                                              a.file(i2.fileNameStr, i2.decompressed, { binary: true, optimizedBinaryString: true, date: i2.date, dir: i2.dir, comment: i2.fileCommentStr.length ? i2.fileCommentStr : null, unixPermissions: i2.unixPermissions, dosPermissions: i2.dosPermissions, createFolders: s2.createFolders });
                                            }
                                            return t7.zipComment.length && (a.comment = t7.zipComment), a;
                                          });
                                        };
                                      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, t6, r6) {
                                        "use strict";
                                        var n6 = e("../utils"), i = e("../stream/GenericWorker");
                                        function s(e2, t7) {
                                          i.call(this, "Nodejs stream input adapter for " + e2), this._upstreamEnded = false, this._bindStream(t7);
                                        }
                                        n6.inherits(s, i), s.prototype._bindStream = function(e2) {
                                          var t7 = this;
                                          (this._stream = e2).pause(), e2.on("data", function(e3) {
                                            t7.push({ data: e3, meta: { percent: 0 } });
                                          }).on("error", function(e3) {
                                            t7.isPaused ? this.generatedError = e3 : t7.error(e3);
                                          }).on("end", function() {
                                            t7.isPaused ? t7._upstreamEnded = true : t7.end();
                                          });
                                        }, s.prototype.pause = function() {
                                          return !!i.prototype.pause.call(this) && (this._stream.pause(), true);
                                        }, s.prototype.resume = function() {
                                          return !!i.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), true);
                                        }, t6.exports = s;
                                      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, t6, r6) {
                                        "use strict";
                                        var i = e("readable-stream").Readable;
                                        function n6(e2, t7, r7) {
                                          i.call(this, t7), this._helper = e2;
                                          var n7 = this;
                                          e2.on("data", function(e3, t8) {
                                            n7.push(e3) || n7._helper.pause(), r7 && r7(t8);
                                          }).on("error", function(e3) {
                                            n7.emit("error", e3);
                                          }).on("end", function() {
                                            n7.push(null);
                                          });
                                        }
                                        e("../utils").inherits(n6, i), n6.prototype._read = function() {
                                          this._helper.resume();
                                        }, t6.exports = n6;
                                      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, t6, r6) {
                                        "use strict";
                                        t6.exports = { isNode: typeof Buffer != "undefined", newBufferFrom: function(e2, t7) {
                                          if (Buffer.from && Buffer.from !== Uint8Array.from)
                                            return Buffer.from(e2, t7);
                                          if (typeof e2 == "number")
                                            throw new Error('The "data" argument must not be a number');
                                          return new Buffer(e2, t7);
                                        }, allocBuffer: function(e2) {
                                          if (Buffer.alloc)
                                            return Buffer.alloc(e2);
                                          var t7 = new Buffer(e2);
                                          return t7.fill(0), t7;
                                        }, isBuffer: function(e2) {
                                          return Buffer.isBuffer(e2);
                                        }, isStream: function(e2) {
                                          return e2 && typeof e2.on == "function" && typeof e2.pause == "function" && typeof e2.resume == "function";
                                        } };
                                      }, {}], 15: [function(e, t6, r6) {
                                        "use strict";
                                        function s(e2, t7, r7) {
                                          var n7, i2 = f.getTypeOf(t7), s2 = f.extend(r7 || {}, d);
                                          s2.date = s2.date || new Date(), s2.compression !== null && (s2.compression = s2.compression.toUpperCase()), typeof s2.unixPermissions == "string" && (s2.unixPermissions = parseInt(s2.unixPermissions, 8)), s2.unixPermissions && 16384 & s2.unixPermissions && (s2.dir = true), s2.dosPermissions && 16 & s2.dosPermissions && (s2.dir = true), s2.dir && (e2 = h(e2)), s2.createFolders && (n7 = function(e3) {
                                            e3.slice(-1) === "/" && (e3 = e3.substring(0, e3.length - 1));
                                            var t8 = e3.lastIndexOf("/");
                                            return 0 < t8 ? e3.substring(0, t8) : "";
                                          }(e2)) && g.call(this, n7, true);
                                          var a2, o2 = i2 === "string" && s2.binary === false && s2.base64 === false;
                                          r7 && r7.binary !== void 0 || (s2.binary = !o2), (t7 instanceof c && t7.uncompressedSize === 0 || s2.dir || !t7 || t7.length === 0) && (s2.base64 = false, s2.binary = true, t7 = "", s2.compression = "STORE", i2 = "string"), a2 = t7 instanceof c || t7 instanceof l6 ? t7 : m.isNode && m.isStream(t7) ? new _(e2, t7) : f.prepareContent(e2, t7, s2.binary, s2.optimizedBinaryString, s2.base64);
                                          var u2 = new p(e2, a2, s2);
                                          this.files[e2] = u2;
                                        }
                                        function h(e2) {
                                          return e2.slice(-1) !== "/" && (e2 += "/"), e2;
                                        }
                                        var i = e("./utf8"), f = e("./utils"), l6 = e("./stream/GenericWorker"), a = e("./stream/StreamHelper"), d = e("./defaults"), c = e("./compressedObject"), p = e("./zipObject"), o = e("./generate"), m = e("./nodejsUtils"), _ = e("./nodejs/NodejsStreamInputAdapter"), g = function(e2, t7) {
                                          return t7 = t7 !== void 0 ? t7 : d.createFolders, e2 = h(e2), this.files[e2] || s.call(this, e2, null, { dir: true, createFolders: t7 }), this.files[e2];
                                        };
                                        function u(e2) {
                                          return Object.prototype.toString.call(e2) === "[object RegExp]";
                                        }
                                        var n6 = { load: function() {
                                          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
                                        }, forEach: function(e2) {
                                          var t7, r7, n7;
                                          for (t7 in this.files)
                                            this.files.hasOwnProperty(t7) && (n7 = this.files[t7], (r7 = t7.slice(this.root.length, t7.length)) && t7.slice(0, this.root.length) === this.root && e2(r7, n7));
                                        }, filter: function(r7) {
                                          var n7 = [];
                                          return this.forEach(function(e2, t7) {
                                            r7(e2, t7) && n7.push(t7);
                                          }), n7;
                                        }, file: function(e2, t7, r7) {
                                          if (arguments.length !== 1)
                                            return e2 = this.root + e2, s.call(this, e2, t7, r7), this;
                                          if (u(e2)) {
                                            var n7 = e2;
                                            return this.filter(function(e3, t8) {
                                              return !t8.dir && n7.test(e3);
                                            });
                                          }
                                          var i2 = this.files[this.root + e2];
                                          return i2 && !i2.dir ? i2 : null;
                                        }, folder: function(r7) {
                                          if (!r7)
                                            return this;
                                          if (u(r7))
                                            return this.filter(function(e3, t8) {
                                              return t8.dir && r7.test(e3);
                                            });
                                          var e2 = this.root + r7, t7 = g.call(this, e2), n7 = this.clone();
                                          return n7.root = t7.name, n7;
                                        }, remove: function(r7) {
                                          r7 = this.root + r7;
                                          var e2 = this.files[r7];
                                          if (e2 || (r7.slice(-1) !== "/" && (r7 += "/"), e2 = this.files[r7]), e2 && !e2.dir)
                                            delete this.files[r7];
                                          else
                                            for (var t7 = this.filter(function(e3, t8) {
                                              return t8.name.slice(0, r7.length) === r7;
                                            }), n7 = 0; n7 < t7.length; n7++)
                                              delete this.files[t7[n7].name];
                                          return this;
                                        }, generate: function(e2) {
                                          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
                                        }, generateInternalStream: function(e2) {
                                          var t7, r7 = {};
                                          try {
                                            if ((r7 = f.extend(e2 || {}, { streamFiles: false, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: i.utf8encode })).type = r7.type.toLowerCase(), r7.compression = r7.compression.toUpperCase(), r7.type === "binarystring" && (r7.type = "string"), !r7.type)
                                              throw new Error("No output type specified.");
                                            f.checkSupport(r7.type), r7.platform !== "darwin" && r7.platform !== "freebsd" && r7.platform !== "linux" && r7.platform !== "sunos" || (r7.platform = "UNIX"), r7.platform === "win32" && (r7.platform = "DOS");
                                            var n7 = r7.comment || this.comment || "";
                                            t7 = o.generateWorker(this, r7, n7);
                                          } catch (e3) {
                                            (t7 = new l6("error")).error(e3);
                                          }
                                          return new a(t7, r7.type || "string", r7.mimeType);
                                        }, generateAsync: function(e2, t7) {
                                          return this.generateInternalStream(e2).accumulate(t7);
                                        }, generateNodeStream: function(e2, t7) {
                                          return (e2 = e2 || {}).type || (e2.type = "nodebuffer"), this.generateInternalStream(e2).toNodejsStream(t7);
                                        } };
                                        t6.exports = n6;
                                      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, t6, r6) {
                                        t6.exports = e("stream");
                                      }, { stream: void 0 }], 17: [function(e, t6, r6) {
                                        "use strict";
                                        var n6 = e("./DataReader");
                                        function i(e2) {
                                          n6.call(this, e2);
                                          for (var t7 = 0; t7 < this.data.length; t7++)
                                            e2[t7] = 255 & e2[t7];
                                        }
                                        e("../utils").inherits(i, n6), i.prototype.byteAt = function(e2) {
                                          return this.data[this.zero + e2];
                                        }, i.prototype.lastIndexOfSignature = function(e2) {
                                          for (var t7 = e2.charCodeAt(0), r7 = e2.charCodeAt(1), n7 = e2.charCodeAt(2), i2 = e2.charCodeAt(3), s = this.length - 4; 0 <= s; --s)
                                            if (this.data[s] === t7 && this.data[s + 1] === r7 && this.data[s + 2] === n7 && this.data[s + 3] === i2)
                                              return s - this.zero;
                                          return -1;
                                        }, i.prototype.readAndCheckSignature = function(e2) {
                                          var t7 = e2.charCodeAt(0), r7 = e2.charCodeAt(1), n7 = e2.charCodeAt(2), i2 = e2.charCodeAt(3), s = this.readData(4);
                                          return t7 === s[0] && r7 === s[1] && n7 === s[2] && i2 === s[3];
                                        }, i.prototype.readData = function(e2) {
                                          if (this.checkOffset(e2), e2 === 0)
                                            return [];
                                          var t7 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
                                          return this.index += e2, t7;
                                        }, t6.exports = i;
                                      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, t6, r6) {
                                        "use strict";
                                        var n6 = e("../utils");
                                        function i(e2) {
                                          this.data = e2, this.length = e2.length, this.index = 0, this.zero = 0;
                                        }
                                        i.prototype = { checkOffset: function(e2) {
                                          this.checkIndex(this.index + e2);
                                        }, checkIndex: function(e2) {
                                          if (this.length < this.zero + e2 || e2 < 0)
                                            throw new Error("End of data reached (data length = " + this.length + ", asked index = " + e2 + "). Corrupted zip ?");
                                        }, setIndex: function(e2) {
                                          this.checkIndex(e2), this.index = e2;
                                        }, skip: function(e2) {
                                          this.setIndex(this.index + e2);
                                        }, byteAt: function(e2) {
                                        }, readInt: function(e2) {
                                          var t7, r7 = 0;
                                          for (this.checkOffset(e2), t7 = this.index + e2 - 1; t7 >= this.index; t7--)
                                            r7 = (r7 << 8) + this.byteAt(t7);
                                          return this.index += e2, r7;
                                        }, readString: function(e2) {
                                          return n6.transformTo("string", this.readData(e2));
                                        }, readData: function(e2) {
                                        }, lastIndexOfSignature: function(e2) {
                                        }, readAndCheckSignature: function(e2) {
                                        }, readDate: function() {
                                          var e2 = this.readInt(4);
                                          return new Date(Date.UTC(1980 + (e2 >> 25 & 127), (e2 >> 21 & 15) - 1, e2 >> 16 & 31, e2 >> 11 & 31, e2 >> 5 & 63, (31 & e2) << 1));
                                        } }, t6.exports = i;
                                      }, { "../utils": 32 }], 19: [function(e, t6, r6) {
                                        "use strict";
                                        var n6 = e("./Uint8ArrayReader");
                                        function i(e2) {
                                          n6.call(this, e2);
                                        }
                                        e("../utils").inherits(i, n6), i.prototype.readData = function(e2) {
                                          this.checkOffset(e2);
                                          var t7 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
                                          return this.index += e2, t7;
                                        }, t6.exports = i;
                                      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, t6, r6) {
                                        "use strict";
                                        var n6 = e("./DataReader");
                                        function i(e2) {
                                          n6.call(this, e2);
                                        }
                                        e("../utils").inherits(i, n6), i.prototype.byteAt = function(e2) {
                                          return this.data.charCodeAt(this.zero + e2);
                                        }, i.prototype.lastIndexOfSignature = function(e2) {
                                          return this.data.lastIndexOf(e2) - this.zero;
                                        }, i.prototype.readAndCheckSignature = function(e2) {
                                          return e2 === this.readData(4);
                                        }, i.prototype.readData = function(e2) {
                                          this.checkOffset(e2);
                                          var t7 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
                                          return this.index += e2, t7;
                                        }, t6.exports = i;
                                      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, t6, r6) {
                                        "use strict";
                                        var n6 = e("./ArrayReader");
                                        function i(e2) {
                                          n6.call(this, e2);
                                        }
                                        e("../utils").inherits(i, n6), i.prototype.readData = function(e2) {
                                          if (this.checkOffset(e2), e2 === 0)
                                            return new Uint8Array(0);
                                          var t7 = this.data.subarray(this.zero + this.index, this.zero + this.index + e2);
                                          return this.index += e2, t7;
                                        }, t6.exports = i;
                                      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, t6, r6) {
                                        "use strict";
                                        var n6 = e("../utils"), i = e("../support"), s = e("./ArrayReader"), a = e("./StringReader"), o = e("./NodeBufferReader"), u = e("./Uint8ArrayReader");
                                        t6.exports = function(e2) {
                                          var t7 = n6.getTypeOf(e2);
                                          return n6.checkSupport(t7), t7 !== "string" || i.uint8array ? t7 === "nodebuffer" ? new o(e2) : i.uint8array ? new u(n6.transformTo("uint8array", e2)) : new s(n6.transformTo("array", e2)) : new a(e2);
                                        };
                                      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, t6, r6) {
                                        "use strict";
                                        r6.LOCAL_FILE_HEADER = "PK", r6.CENTRAL_FILE_HEADER = "PK", r6.CENTRAL_DIRECTORY_END = "PK", r6.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", r6.ZIP64_CENTRAL_DIRECTORY_END = "PK", r6.DATA_DESCRIPTOR = "PK\x07\b";
                                      }, {}], 24: [function(e, t6, r6) {
                                        "use strict";
                                        var n6 = e("./GenericWorker"), i = e("../utils");
                                        function s(e2) {
                                          n6.call(this, "ConvertWorker to " + e2), this.destType = e2;
                                        }
                                        i.inherits(s, n6), s.prototype.processChunk = function(e2) {
                                          this.push({ data: i.transformTo(this.destType, e2.data), meta: e2.meta });
                                        }, t6.exports = s;
                                      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, t6, r6) {
                                        "use strict";
                                        var n6 = e("./GenericWorker"), i = e("../crc32");
                                        function s() {
                                          n6.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
                                        }
                                        e("../utils").inherits(s, n6), s.prototype.processChunk = function(e2) {
                                          this.streamInfo.crc32 = i(e2.data, this.streamInfo.crc32 || 0), this.push(e2);
                                        }, t6.exports = s;
                                      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, t6, r6) {
                                        "use strict";
                                        var n6 = e("../utils"), i = e("./GenericWorker");
                                        function s(e2) {
                                          i.call(this, "DataLengthProbe for " + e2), this.propName = e2, this.withStreamInfo(e2, 0);
                                        }
                                        n6.inherits(s, i), s.prototype.processChunk = function(e2) {
                                          if (e2) {
                                            var t7 = this.streamInfo[this.propName] || 0;
                                            this.streamInfo[this.propName] = t7 + e2.data.length;
                                          }
                                          i.prototype.processChunk.call(this, e2);
                                        }, t6.exports = s;
                                      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, t6, r6) {
                                        "use strict";
                                        var n6 = e("../utils"), i = e("./GenericWorker");
                                        function s(e2) {
                                          i.call(this, "DataWorker");
                                          var t7 = this;
                                          this.dataIsReady = false, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = false, e2.then(function(e3) {
                                            t7.dataIsReady = true, t7.data = e3, t7.max = e3 && e3.length || 0, t7.type = n6.getTypeOf(e3), t7.isPaused || t7._tickAndRepeat();
                                          }, function(e3) {
                                            t7.error(e3);
                                          });
                                        }
                                        n6.inherits(s, i), s.prototype.cleanUp = function() {
                                          i.prototype.cleanUp.call(this), this.data = null;
                                        }, s.prototype.resume = function() {
                                          return !!i.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = true, n6.delay(this._tickAndRepeat, [], this)), true);
                                        }, s.prototype._tickAndRepeat = function() {
                                          this._tickScheduled = false, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (n6.delay(this._tickAndRepeat, [], this), this._tickScheduled = true));
                                        }, s.prototype._tick = function() {
                                          if (this.isPaused || this.isFinished)
                                            return false;
                                          var e2 = null, t7 = Math.min(this.max, this.index + 16384);
                                          if (this.index >= this.max)
                                            return this.end();
                                          switch (this.type) {
                                            case "string":
                                              e2 = this.data.substring(this.index, t7);
                                              break;
                                            case "uint8array":
                                              e2 = this.data.subarray(this.index, t7);
                                              break;
                                            case "array":
                                            case "nodebuffer":
                                              e2 = this.data.slice(this.index, t7);
                                          }
                                          return this.index = t7, this.push({ data: e2, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
                                        }, t6.exports = s;
                                      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, t6, r6) {
                                        "use strict";
                                        function n6(e2) {
                                          this.name = e2 || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = true, this.isFinished = false, this.isLocked = false, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
                                        }
                                        n6.prototype = { push: function(e2) {
                                          this.emit("data", e2);
                                        }, end: function() {
                                          if (this.isFinished)
                                            return false;
                                          this.flush();
                                          try {
                                            this.emit("end"), this.cleanUp(), this.isFinished = true;
                                          } catch (e2) {
                                            this.emit("error", e2);
                                          }
                                          return true;
                                        }, error: function(e2) {
                                          return !this.isFinished && (this.isPaused ? this.generatedError = e2 : (this.isFinished = true, this.emit("error", e2), this.previous && this.previous.error(e2), this.cleanUp()), true);
                                        }, on: function(e2, t7) {
                                          return this._listeners[e2].push(t7), this;
                                        }, cleanUp: function() {
                                          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
                                        }, emit: function(e2, t7) {
                                          if (this._listeners[e2])
                                            for (var r7 = 0; r7 < this._listeners[e2].length; r7++)
                                              this._listeners[e2][r7].call(this, t7);
                                        }, pipe: function(e2) {
                                          return e2.registerPrevious(this);
                                        }, registerPrevious: function(e2) {
                                          if (this.isLocked)
                                            throw new Error("The stream '" + this + "' has already been used.");
                                          this.streamInfo = e2.streamInfo, this.mergeStreamInfo(), this.previous = e2;
                                          var t7 = this;
                                          return e2.on("data", function(e3) {
                                            t7.processChunk(e3);
                                          }), e2.on("end", function() {
                                            t7.end();
                                          }), e2.on("error", function(e3) {
                                            t7.error(e3);
                                          }), this;
                                        }, pause: function() {
                                          return !this.isPaused && !this.isFinished && (this.isPaused = true, this.previous && this.previous.pause(), true);
                                        }, resume: function() {
                                          if (!this.isPaused || this.isFinished)
                                            return false;
                                          var e2 = this.isPaused = false;
                                          return this.generatedError && (this.error(this.generatedError), e2 = true), this.previous && this.previous.resume(), !e2;
                                        }, flush: function() {
                                        }, processChunk: function(e2) {
                                          this.push(e2);
                                        }, withStreamInfo: function(e2, t7) {
                                          return this.extraStreamInfo[e2] = t7, this.mergeStreamInfo(), this;
                                        }, mergeStreamInfo: function() {
                                          for (var e2 in this.extraStreamInfo)
                                            this.extraStreamInfo.hasOwnProperty(e2) && (this.streamInfo[e2] = this.extraStreamInfo[e2]);
                                        }, lock: function() {
                                          if (this.isLocked)
                                            throw new Error("The stream '" + this + "' has already been used.");
                                          this.isLocked = true, this.previous && this.previous.lock();
                                        }, toString: function() {
                                          var e2 = "Worker " + this.name;
                                          return this.previous ? this.previous + " -> " + e2 : e2;
                                        } }, t6.exports = n6;
                                      }, {}], 29: [function(e, t6, r6) {
                                        "use strict";
                                        var h = e("../utils"), i = e("./ConvertWorker"), s = e("./GenericWorker"), f = e("../base64"), n6 = e("../support"), a = e("../external"), o = null;
                                        if (n6.nodestream)
                                          try {
                                            o = e("../nodejs/NodejsStreamOutputAdapter");
                                          } catch (e2) {
                                          }
                                        function u(e2, t7, r7) {
                                          var n7 = t7;
                                          switch (t7) {
                                            case "blob":
                                            case "arraybuffer":
                                              n7 = "uint8array";
                                              break;
                                            case "base64":
                                              n7 = "string";
                                          }
                                          try {
                                            this._internalType = n7, this._outputType = t7, this._mimeType = r7, h.checkSupport(n7), this._worker = e2.pipe(new i(n7)), e2.lock();
                                          } catch (e3) {
                                            this._worker = new s("error"), this._worker.error(e3);
                                          }
                                        }
                                        u.prototype = { accumulate: function(e2) {
                                          return o2 = this, u2 = e2, new a.Promise(function(t7, r7) {
                                            var n7 = [], i2 = o2._internalType, s2 = o2._outputType, a2 = o2._mimeType;
                                            o2.on("data", function(e3, t8) {
                                              n7.push(e3), u2 && u2(t8);
                                            }).on("error", function(e3) {
                                              n7 = [], r7(e3);
                                            }).on("end", function() {
                                              try {
                                                var e3 = function(e4, t8, r8) {
                                                  switch (e4) {
                                                    case "blob":
                                                      return h.newBlob(h.transformTo("arraybuffer", t8), r8);
                                                    case "base64":
                                                      return f.encode(t8);
                                                    default:
                                                      return h.transformTo(e4, t8);
                                                  }
                                                }(s2, function(e4, t8) {
                                                  var r8, n8 = 0, i3 = null, s3 = 0;
                                                  for (r8 = 0; r8 < t8.length; r8++)
                                                    s3 += t8[r8].length;
                                                  switch (e4) {
                                                    case "string":
                                                      return t8.join("");
                                                    case "array":
                                                      return Array.prototype.concat.apply([], t8);
                                                    case "uint8array":
                                                      for (i3 = new Uint8Array(s3), r8 = 0; r8 < t8.length; r8++)
                                                        i3.set(t8[r8], n8), n8 += t8[r8].length;
                                                      return i3;
                                                    case "nodebuffer":
                                                      return Buffer.concat(t8);
                                                    default:
                                                      throw new Error("concat : unsupported type '" + e4 + "'");
                                                  }
                                                }(i2, n7), a2);
                                                t7(e3);
                                              } catch (e4) {
                                                r7(e4);
                                              }
                                              n7 = [];
                                            }).resume();
                                          });
                                          var o2, u2;
                                        }, on: function(e2, t7) {
                                          var r7 = this;
                                          return e2 === "data" ? this._worker.on(e2, function(e3) {
                                            t7.call(r7, e3.data, e3.meta);
                                          }) : this._worker.on(e2, function() {
                                            h.delay(t7, arguments, r7);
                                          }), this;
                                        }, resume: function() {
                                          return h.delay(this._worker.resume, [], this._worker), this;
                                        }, pause: function() {
                                          return this._worker.pause(), this;
                                        }, toNodejsStream: function(e2) {
                                          if (h.checkSupport("nodestream"), this._outputType !== "nodebuffer")
                                            throw new Error(this._outputType + " is not supported by this method");
                                          return new o(this, { objectMode: this._outputType !== "nodebuffer" }, e2);
                                        } }, t6.exports = u;
                                      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, t6, r6) {
                                        "use strict";
                                        if (r6.base64 = true, r6.array = true, r6.string = true, r6.arraybuffer = typeof ArrayBuffer != "undefined" && typeof Uint8Array != "undefined", r6.nodebuffer = typeof Buffer != "undefined", r6.uint8array = typeof Uint8Array != "undefined", typeof ArrayBuffer == "undefined")
                                          r6.blob = false;
                                        else {
                                          var n6 = new ArrayBuffer(0);
                                          try {
                                            r6.blob = new Blob([n6], { type: "application/zip" }).size === 0;
                                          } catch (e2) {
                                            try {
                                              var i = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
                                              i.append(n6), r6.blob = i.getBlob("application/zip").size === 0;
                                            } catch (e3) {
                                              r6.blob = false;
                                            }
                                          }
                                        }
                                        try {
                                          r6.nodestream = !!e("readable-stream").Readable;
                                        } catch (e2) {
                                          r6.nodestream = false;
                                        }
                                      }, { "readable-stream": 16 }], 31: [function(e, t6, s) {
                                        "use strict";
                                        for (var o = e("./utils"), u = e("./support"), r6 = e("./nodejsUtils"), n6 = e("./stream/GenericWorker"), h = new Array(256), i = 0; i < 256; i++)
                                          h[i] = 252 <= i ? 6 : 248 <= i ? 5 : 240 <= i ? 4 : 224 <= i ? 3 : 192 <= i ? 2 : 1;
                                        function a() {
                                          n6.call(this, "utf-8 decode"), this.leftOver = null;
                                        }
                                        function f() {
                                          n6.call(this, "utf-8 encode");
                                        }
                                        h[254] = h[254] = 1, s.utf8encode = function(e2) {
                                          return u.nodebuffer ? r6.newBufferFrom(e2, "utf-8") : function(e3) {
                                            var t7, r7, n7, i2, s2, a2 = e3.length, o2 = 0;
                                            for (i2 = 0; i2 < a2; i2++)
                                              (64512 & (r7 = e3.charCodeAt(i2))) == 55296 && i2 + 1 < a2 && (64512 & (n7 = e3.charCodeAt(i2 + 1))) == 56320 && (r7 = 65536 + (r7 - 55296 << 10) + (n7 - 56320), i2++), o2 += r7 < 128 ? 1 : r7 < 2048 ? 2 : r7 < 65536 ? 3 : 4;
                                            for (t7 = u.uint8array ? new Uint8Array(o2) : new Array(o2), i2 = s2 = 0; s2 < o2; i2++)
                                              (64512 & (r7 = e3.charCodeAt(i2))) == 55296 && i2 + 1 < a2 && (64512 & (n7 = e3.charCodeAt(i2 + 1))) == 56320 && (r7 = 65536 + (r7 - 55296 << 10) + (n7 - 56320), i2++), r7 < 128 ? t7[s2++] = r7 : (r7 < 2048 ? t7[s2++] = 192 | r7 >>> 6 : (r7 < 65536 ? t7[s2++] = 224 | r7 >>> 12 : (t7[s2++] = 240 | r7 >>> 18, t7[s2++] = 128 | r7 >>> 12 & 63), t7[s2++] = 128 | r7 >>> 6 & 63), t7[s2++] = 128 | 63 & r7);
                                            return t7;
                                          }(e2);
                                        }, s.utf8decode = function(e2) {
                                          return u.nodebuffer ? o.transformTo("nodebuffer", e2).toString("utf-8") : function(e3) {
                                            var t7, r7, n7, i2, s2 = e3.length, a2 = new Array(2 * s2);
                                            for (t7 = r7 = 0; t7 < s2; )
                                              if ((n7 = e3[t7++]) < 128)
                                                a2[r7++] = n7;
                                              else if (4 < (i2 = h[n7]))
                                                a2[r7++] = 65533, t7 += i2 - 1;
                                              else {
                                                for (n7 &= i2 === 2 ? 31 : i2 === 3 ? 15 : 7; 1 < i2 && t7 < s2; )
                                                  n7 = n7 << 6 | 63 & e3[t7++], i2--;
                                                1 < i2 ? a2[r7++] = 65533 : n7 < 65536 ? a2[r7++] = n7 : (n7 -= 65536, a2[r7++] = 55296 | n7 >> 10 & 1023, a2[r7++] = 56320 | 1023 & n7);
                                              }
                                            return a2.length !== r7 && (a2.subarray ? a2 = a2.subarray(0, r7) : a2.length = r7), o.applyFromCharCode(a2);
                                          }(e2 = o.transformTo(u.uint8array ? "uint8array" : "array", e2));
                                        }, o.inherits(a, n6), a.prototype.processChunk = function(e2) {
                                          var t7 = o.transformTo(u.uint8array ? "uint8array" : "array", e2.data);
                                          if (this.leftOver && this.leftOver.length) {
                                            if (u.uint8array) {
                                              var r7 = t7;
                                              (t7 = new Uint8Array(r7.length + this.leftOver.length)).set(this.leftOver, 0), t7.set(r7, this.leftOver.length);
                                            } else
                                              t7 = this.leftOver.concat(t7);
                                            this.leftOver = null;
                                          }
                                          var n7 = function(e3, t8) {
                                            var r8;
                                            for ((t8 = t8 || e3.length) > e3.length && (t8 = e3.length), r8 = t8 - 1; 0 <= r8 && (192 & e3[r8]) == 128; )
                                              r8--;
                                            return r8 < 0 ? t8 : r8 === 0 ? t8 : r8 + h[e3[r8]] > t8 ? r8 : t8;
                                          }(t7), i2 = t7;
                                          n7 !== t7.length && (u.uint8array ? (i2 = t7.subarray(0, n7), this.leftOver = t7.subarray(n7, t7.length)) : (i2 = t7.slice(0, n7), this.leftOver = t7.slice(n7, t7.length))), this.push({ data: s.utf8decode(i2), meta: e2.meta });
                                        }, a.prototype.flush = function() {
                                          this.leftOver && this.leftOver.length && (this.push({ data: s.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
                                        }, s.Utf8DecodeWorker = a, o.inherits(f, n6), f.prototype.processChunk = function(e2) {
                                          this.push({ data: s.utf8encode(e2.data), meta: e2.meta });
                                        }, s.Utf8EncodeWorker = f;
                                      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, t6, o) {
                                        "use strict";
                                        var u = e("./support"), h = e("./base64"), r6 = e("./nodejsUtils"), n6 = e("set-immediate-shim"), f = e("./external");
                                        function i(e2) {
                                          return e2;
                                        }
                                        function l6(e2, t7) {
                                          for (var r7 = 0; r7 < e2.length; ++r7)
                                            t7[r7] = 255 & e2.charCodeAt(r7);
                                          return t7;
                                        }
                                        o.newBlob = function(t7, r7) {
                                          o.checkSupport("blob");
                                          try {
                                            return new Blob([t7], { type: r7 });
                                          } catch (e2) {
                                            try {
                                              var n7 = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
                                              return n7.append(t7), n7.getBlob(r7);
                                            } catch (e3) {
                                              throw new Error("Bug : can't construct the Blob.");
                                            }
                                          }
                                        };
                                        var s = { stringifyByChunk: function(e2, t7, r7) {
                                          var n7 = [], i2 = 0, s2 = e2.length;
                                          if (s2 <= r7)
                                            return String.fromCharCode.apply(null, e2);
                                          for (; i2 < s2; )
                                            t7 === "array" || t7 === "nodebuffer" ? n7.push(String.fromCharCode.apply(null, e2.slice(i2, Math.min(i2 + r7, s2)))) : n7.push(String.fromCharCode.apply(null, e2.subarray(i2, Math.min(i2 + r7, s2)))), i2 += r7;
                                          return n7.join("");
                                        }, stringifyByChar: function(e2) {
                                          for (var t7 = "", r7 = 0; r7 < e2.length; r7++)
                                            t7 += String.fromCharCode(e2[r7]);
                                          return t7;
                                        }, applyCanBeUsed: { uint8array: function() {
                                          try {
                                            return u.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
                                          } catch (e2) {
                                            return false;
                                          }
                                        }(), nodebuffer: function() {
                                          try {
                                            return u.nodebuffer && String.fromCharCode.apply(null, r6.allocBuffer(1)).length === 1;
                                          } catch (e2) {
                                            return false;
                                          }
                                        }() } };
                                        function a(e2) {
                                          var t7 = 65536, r7 = o.getTypeOf(e2), n7 = true;
                                          if (r7 === "uint8array" ? n7 = s.applyCanBeUsed.uint8array : r7 === "nodebuffer" && (n7 = s.applyCanBeUsed.nodebuffer), n7)
                                            for (; 1 < t7; )
                                              try {
                                                return s.stringifyByChunk(e2, r7, t7);
                                              } catch (e3) {
                                                t7 = Math.floor(t7 / 2);
                                              }
                                          return s.stringifyByChar(e2);
                                        }
                                        function d(e2, t7) {
                                          for (var r7 = 0; r7 < e2.length; r7++)
                                            t7[r7] = e2[r7];
                                          return t7;
                                        }
                                        o.applyFromCharCode = a;
                                        var c = {};
                                        c.string = { string: i, array: function(e2) {
                                          return l6(e2, new Array(e2.length));
                                        }, arraybuffer: function(e2) {
                                          return c.string.uint8array(e2).buffer;
                                        }, uint8array: function(e2) {
                                          return l6(e2, new Uint8Array(e2.length));
                                        }, nodebuffer: function(e2) {
                                          return l6(e2, r6.allocBuffer(e2.length));
                                        } }, c.array = { string: a, array: i, arraybuffer: function(e2) {
                                          return new Uint8Array(e2).buffer;
                                        }, uint8array: function(e2) {
                                          return new Uint8Array(e2);
                                        }, nodebuffer: function(e2) {
                                          return r6.newBufferFrom(e2);
                                        } }, c.arraybuffer = { string: function(e2) {
                                          return a(new Uint8Array(e2));
                                        }, array: function(e2) {
                                          return d(new Uint8Array(e2), new Array(e2.byteLength));
                                        }, arraybuffer: i, uint8array: function(e2) {
                                          return new Uint8Array(e2);
                                        }, nodebuffer: function(e2) {
                                          return r6.newBufferFrom(new Uint8Array(e2));
                                        } }, c.uint8array = { string: a, array: function(e2) {
                                          return d(e2, new Array(e2.length));
                                        }, arraybuffer: function(e2) {
                                          return e2.buffer;
                                        }, uint8array: i, nodebuffer: function(e2) {
                                          return r6.newBufferFrom(e2);
                                        } }, c.nodebuffer = { string: a, array: function(e2) {
                                          return d(e2, new Array(e2.length));
                                        }, arraybuffer: function(e2) {
                                          return c.nodebuffer.uint8array(e2).buffer;
                                        }, uint8array: function(e2) {
                                          return d(e2, new Uint8Array(e2.length));
                                        }, nodebuffer: i }, o.transformTo = function(e2, t7) {
                                          if (t7 = t7 || "", !e2)
                                            return t7;
                                          o.checkSupport(e2);
                                          var r7 = o.getTypeOf(t7);
                                          return c[r7][e2](t7);
                                        }, o.getTypeOf = function(e2) {
                                          return typeof e2 == "string" ? "string" : Object.prototype.toString.call(e2) === "[object Array]" ? "array" : u.nodebuffer && r6.isBuffer(e2) ? "nodebuffer" : u.uint8array && e2 instanceof Uint8Array ? "uint8array" : u.arraybuffer && e2 instanceof ArrayBuffer ? "arraybuffer" : void 0;
                                        }, o.checkSupport = function(e2) {
                                          if (!u[e2.toLowerCase()])
                                            throw new Error(e2 + " is not supported by this platform");
                                        }, o.MAX_VALUE_16BITS = 65535, o.MAX_VALUE_32BITS = -1, o.pretty = function(e2) {
                                          var t7, r7, n7 = "";
                                          for (r7 = 0; r7 < (e2 || "").length; r7++)
                                            n7 += "\\x" + ((t7 = e2.charCodeAt(r7)) < 16 ? "0" : "") + t7.toString(16).toUpperCase();
                                          return n7;
                                        }, o.delay = function(e2, t7, r7) {
                                          n6(function() {
                                            e2.apply(r7 || null, t7 || []);
                                          });
                                        }, o.inherits = function(e2, t7) {
                                          function r7() {
                                          }
                                          r7.prototype = t7.prototype, e2.prototype = new r7();
                                        }, o.extend = function() {
                                          var e2, t7, r7 = {};
                                          for (e2 = 0; e2 < arguments.length; e2++)
                                            for (t7 in arguments[e2])
                                              arguments[e2].hasOwnProperty(t7) && r7[t7] === void 0 && (r7[t7] = arguments[e2][t7]);
                                          return r7;
                                        }, o.prepareContent = function(n7, e2, i2, s2, a2) {
                                          return f.Promise.resolve(e2).then(function(n8) {
                                            return u.blob && (n8 instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(n8)) !== -1) && typeof FileReader != "undefined" ? new f.Promise(function(t7, r7) {
                                              var e3 = new FileReader();
                                              e3.onload = function(e4) {
                                                t7(e4.target.result);
                                              }, e3.onerror = function(e4) {
                                                r7(e4.target.error);
                                              }, e3.readAsArrayBuffer(n8);
                                            }) : n8;
                                          }).then(function(e3) {
                                            var t7, r7 = o.getTypeOf(e3);
                                            return r7 ? (r7 === "arraybuffer" ? e3 = o.transformTo("uint8array", e3) : r7 === "string" && (a2 ? e3 = h.decode(e3) : i2 && s2 !== true && (e3 = l6(t7 = e3, u.uint8array ? new Uint8Array(t7.length) : new Array(t7.length)))), e3) : f.Promise.reject(new Error("Can't read the data of '" + n7 + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
                                          });
                                        };
                                      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, "set-immediate-shim": 54 }], 33: [function(e, t6, r6) {
                                        "use strict";
                                        var n6 = e("./reader/readerFor"), i = e("./utils"), s = e("./signature"), a = e("./zipEntry"), o = (e("./utf8"), e("./support"));
                                        function u(e2) {
                                          this.files = [], this.loadOptions = e2;
                                        }
                                        u.prototype = { checkSignature: function(e2) {
                                          if (!this.reader.readAndCheckSignature(e2)) {
                                            this.reader.index -= 4;
                                            var t7 = this.reader.readString(4);
                                            throw new Error("Corrupted zip or bug: unexpected signature (" + i.pretty(t7) + ", expected " + i.pretty(e2) + ")");
                                          }
                                        }, isSignature: function(e2, t7) {
                                          var r7 = this.reader.index;
                                          this.reader.setIndex(e2);
                                          var n7 = this.reader.readString(4) === t7;
                                          return this.reader.setIndex(r7), n7;
                                        }, readBlockEndOfCentral: function() {
                                          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
                                          var e2 = this.reader.readData(this.zipCommentLength), t7 = o.uint8array ? "uint8array" : "array", r7 = i.transformTo(t7, e2);
                                          this.zipComment = this.loadOptions.decodeFileName(r7);
                                        }, readBlockZip64EndOfCentral: function() {
                                          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
                                          for (var e2, t7, r7, n7 = this.zip64EndOfCentralSize - 44; 0 < n7; )
                                            e2 = this.reader.readInt(2), t7 = this.reader.readInt(4), r7 = this.reader.readData(t7), this.zip64ExtensibleData[e2] = { id: e2, length: t7, value: r7 };
                                        }, readBlockZip64EndOfCentralLocator: function() {
                                          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount)
                                            throw new Error("Multi-volumes zip are not supported");
                                        }, readLocalFiles: function() {
                                          var e2, t7;
                                          for (e2 = 0; e2 < this.files.length; e2++)
                                            t7 = this.files[e2], this.reader.setIndex(t7.localHeaderOffset), this.checkSignature(s.LOCAL_FILE_HEADER), t7.readLocalPart(this.reader), t7.handleUTF8(), t7.processAttributes();
                                        }, readCentralDir: function() {
                                          var e2;
                                          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER); )
                                            (e2 = new a({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(e2);
                                          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0)
                                            throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
                                        }, readEndOfCentral: function() {
                                          var e2 = this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);
                                          if (e2 < 0)
                                            throw this.isSignature(0, s.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
                                          this.reader.setIndex(e2);
                                          var t7 = e2;
                                          if (this.checkSignature(s.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === i.MAX_VALUE_16BITS || this.diskWithCentralDirStart === i.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === i.MAX_VALUE_16BITS || this.centralDirRecords === i.MAX_VALUE_16BITS || this.centralDirSize === i.MAX_VALUE_32BITS || this.centralDirOffset === i.MAX_VALUE_32BITS) {
                                            if (this.zip64 = true, (e2 = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0)
                                              throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
                                            if (this.reader.setIndex(e2), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, s.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0))
                                              throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
                                            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
                                          }
                                          var r7 = this.centralDirOffset + this.centralDirSize;
                                          this.zip64 && (r7 += 20, r7 += 12 + this.zip64EndOfCentralSize);
                                          var n7 = t7 - r7;
                                          if (0 < n7)
                                            this.isSignature(t7, s.CENTRAL_FILE_HEADER) || (this.reader.zero = n7);
                                          else if (n7 < 0)
                                            throw new Error("Corrupted zip: missing " + Math.abs(n7) + " bytes.");
                                        }, prepareReader: function(e2) {
                                          this.reader = n6(e2);
                                        }, load: function(e2) {
                                          this.prepareReader(e2), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
                                        } }, t6.exports = u;
                                      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utf8": 31, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, t6, r6) {
                                        "use strict";
                                        var n6 = e("./reader/readerFor"), s = e("./utils"), i = e("./compressedObject"), a = e("./crc32"), o = e("./utf8"), u = e("./compressions"), h = e("./support");
                                        function f(e2, t7) {
                                          this.options = e2, this.loadOptions = t7;
                                        }
                                        f.prototype = { isEncrypted: function() {
                                          return (1 & this.bitFlag) == 1;
                                        }, useUTF8: function() {
                                          return (2048 & this.bitFlag) == 2048;
                                        }, readLocalPart: function(e2) {
                                          var t7, r7;
                                          if (e2.skip(22), this.fileNameLength = e2.readInt(2), r7 = e2.readInt(2), this.fileName = e2.readData(this.fileNameLength), e2.skip(r7), this.compressedSize === -1 || this.uncompressedSize === -1)
                                            throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
                                          if ((t7 = function(e3) {
                                            for (var t8 in u)
                                              if (u.hasOwnProperty(t8) && u[t8].magic === e3)
                                                return u[t8];
                                            return null;
                                          }(this.compressionMethod)) === null)
                                            throw new Error("Corrupted zip : compression " + s.pretty(this.compressionMethod) + " unknown (inner file : " + s.transformTo("string", this.fileName) + ")");
                                          this.decompressed = new i(this.compressedSize, this.uncompressedSize, this.crc32, t7, e2.readData(this.compressedSize));
                                        }, readCentralPart: function(e2) {
                                          this.versionMadeBy = e2.readInt(2), e2.skip(2), this.bitFlag = e2.readInt(2), this.compressionMethod = e2.readString(2), this.date = e2.readDate(), this.crc32 = e2.readInt(4), this.compressedSize = e2.readInt(4), this.uncompressedSize = e2.readInt(4);
                                          var t7 = e2.readInt(2);
                                          if (this.extraFieldsLength = e2.readInt(2), this.fileCommentLength = e2.readInt(2), this.diskNumberStart = e2.readInt(2), this.internalFileAttributes = e2.readInt(2), this.externalFileAttributes = e2.readInt(4), this.localHeaderOffset = e2.readInt(4), this.isEncrypted())
                                            throw new Error("Encrypted zip are not supported");
                                          e2.skip(t7), this.readExtraFields(e2), this.parseZIP64ExtraField(e2), this.fileComment = e2.readData(this.fileCommentLength);
                                        }, processAttributes: function() {
                                          this.unixPermissions = null, this.dosPermissions = null;
                                          var e2 = this.versionMadeBy >> 8;
                                          this.dir = !!(16 & this.externalFileAttributes), e2 == 0 && (this.dosPermissions = 63 & this.externalFileAttributes), e2 == 3 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || this.fileNameStr.slice(-1) !== "/" || (this.dir = true);
                                        }, parseZIP64ExtraField: function(e2) {
                                          if (this.extraFields[1]) {
                                            var t7 = n6(this.extraFields[1].value);
                                            this.uncompressedSize === s.MAX_VALUE_32BITS && (this.uncompressedSize = t7.readInt(8)), this.compressedSize === s.MAX_VALUE_32BITS && (this.compressedSize = t7.readInt(8)), this.localHeaderOffset === s.MAX_VALUE_32BITS && (this.localHeaderOffset = t7.readInt(8)), this.diskNumberStart === s.MAX_VALUE_32BITS && (this.diskNumberStart = t7.readInt(4));
                                          }
                                        }, readExtraFields: function(e2) {
                                          var t7, r7, n7, i2 = e2.index + this.extraFieldsLength;
                                          for (this.extraFields || (this.extraFields = {}); e2.index + 4 < i2; )
                                            t7 = e2.readInt(2), r7 = e2.readInt(2), n7 = e2.readData(r7), this.extraFields[t7] = { id: t7, length: r7, value: n7 };
                                          e2.setIndex(i2);
                                        }, handleUTF8: function() {
                                          var e2 = h.uint8array ? "uint8array" : "array";
                                          if (this.useUTF8())
                                            this.fileNameStr = o.utf8decode(this.fileName), this.fileCommentStr = o.utf8decode(this.fileComment);
                                          else {
                                            var t7 = this.findExtraFieldUnicodePath();
                                            if (t7 !== null)
                                              this.fileNameStr = t7;
                                            else {
                                              var r7 = s.transformTo(e2, this.fileName);
                                              this.fileNameStr = this.loadOptions.decodeFileName(r7);
                                            }
                                            var n7 = this.findExtraFieldUnicodeComment();
                                            if (n7 !== null)
                                              this.fileCommentStr = n7;
                                            else {
                                              var i2 = s.transformTo(e2, this.fileComment);
                                              this.fileCommentStr = this.loadOptions.decodeFileName(i2);
                                            }
                                          }
                                        }, findExtraFieldUnicodePath: function() {
                                          var e2 = this.extraFields[28789];
                                          if (e2) {
                                            var t7 = n6(e2.value);
                                            return t7.readInt(1) !== 1 ? null : a(this.fileName) !== t7.readInt(4) ? null : o.utf8decode(t7.readData(e2.length - 5));
                                          }
                                          return null;
                                        }, findExtraFieldUnicodeComment: function() {
                                          var e2 = this.extraFields[25461];
                                          if (e2) {
                                            var t7 = n6(e2.value);
                                            return t7.readInt(1) !== 1 ? null : a(this.fileComment) !== t7.readInt(4) ? null : o.utf8decode(t7.readData(e2.length - 5));
                                          }
                                          return null;
                                        } }, t6.exports = f;
                                      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, t6, r6) {
                                        "use strict";
                                        function n6(e2, t7, r7) {
                                          this.name = e2, this.dir = r7.dir, this.date = r7.date, this.comment = r7.comment, this.unixPermissions = r7.unixPermissions, this.dosPermissions = r7.dosPermissions, this._data = t7, this._dataBinary = r7.binary, this.options = { compression: r7.compression, compressionOptions: r7.compressionOptions };
                                        }
                                        var s = e("./stream/StreamHelper"), i = e("./stream/DataWorker"), a = e("./utf8"), o = e("./compressedObject"), u = e("./stream/GenericWorker");
                                        n6.prototype = { internalStream: function(e2) {
                                          var t7 = null, r7 = "string";
                                          try {
                                            if (!e2)
                                              throw new Error("No output type specified.");
                                            var n7 = (r7 = e2.toLowerCase()) === "string" || r7 === "text";
                                            r7 !== "binarystring" && r7 !== "text" || (r7 = "string"), t7 = this._decompressWorker();
                                            var i2 = !this._dataBinary;
                                            i2 && !n7 && (t7 = t7.pipe(new a.Utf8EncodeWorker())), !i2 && n7 && (t7 = t7.pipe(new a.Utf8DecodeWorker()));
                                          } catch (e3) {
                                            (t7 = new u("error")).error(e3);
                                          }
                                          return new s(t7, r7, "");
                                        }, async: function(e2, t7) {
                                          return this.internalStream(e2).accumulate(t7);
                                        }, nodeStream: function(e2, t7) {
                                          return this.internalStream(e2 || "nodebuffer").toNodejsStream(t7);
                                        }, _compressWorker: function(e2, t7) {
                                          if (this._data instanceof o && this._data.compression.magic === e2.magic)
                                            return this._data.getCompressedWorker();
                                          var r7 = this._decompressWorker();
                                          return this._dataBinary || (r7 = r7.pipe(new a.Utf8EncodeWorker())), o.createWorkerFrom(r7, e2, t7);
                                        }, _decompressWorker: function() {
                                          return this._data instanceof o ? this._data.getContentWorker() : this._data instanceof u ? this._data : new i(this._data);
                                        } };
                                        for (var h = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], f = function() {
                                          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
                                        }, l6 = 0; l6 < h.length; l6++)
                                          n6.prototype[h[l6]] = f;
                                        t6.exports = n6;
                                      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, f, t6) {
                                        (function(t7) {
                                          "use strict";
                                          var r6, n6, e2 = t7.MutationObserver || t7.WebKitMutationObserver;
                                          if (e2) {
                                            var i = 0, s = new e2(h), a = t7.document.createTextNode("");
                                            s.observe(a, { characterData: true }), r6 = function() {
                                              a.data = i = ++i % 2;
                                            };
                                          } else if (t7.setImmediate || t7.MessageChannel === void 0)
                                            r6 = "document" in t7 && "onreadystatechange" in t7.document.createElement("script") ? function() {
                                              var e3 = t7.document.createElement("script");
                                              e3.onreadystatechange = function() {
                                                h(), e3.onreadystatechange = null, e3.parentNode.removeChild(e3), e3 = null;
                                              }, t7.document.documentElement.appendChild(e3);
                                            } : function() {
                                              setTimeout(h, 0);
                                            };
                                          else {
                                            var o = new t7.MessageChannel();
                                            o.port1.onmessage = h, r6 = function() {
                                              o.port2.postMessage(0);
                                            };
                                          }
                                          var u = [];
                                          function h() {
                                            var e3, t8;
                                            n6 = true;
                                            for (var r7 = u.length; r7; ) {
                                              for (t8 = u, u = [], e3 = -1; ++e3 < r7; )
                                                t8[e3]();
                                              r7 = u.length;
                                            }
                                            n6 = false;
                                          }
                                          f.exports = function(e3) {
                                            u.push(e3) !== 1 || n6 || r6();
                                          };
                                        }).call(this, r5 !== void 0 ? r5 : typeof self != "undefined" ? self : typeof window != "undefined" ? window : {});
                                      }, {}], 37: [function(e, t6, r6) {
                                        "use strict";
                                        var i = e("immediate");
                                        function h() {
                                        }
                                        var f = {}, s = ["REJECTED"], a = ["FULFILLED"], n6 = ["PENDING"];
                                        function o(e2) {
                                          if (typeof e2 != "function")
                                            throw new TypeError("resolver must be a function");
                                          this.state = n6, this.queue = [], this.outcome = void 0, e2 !== h && c(this, e2);
                                        }
                                        function u(e2, t7, r7) {
                                          this.promise = e2, typeof t7 == "function" && (this.onFulfilled = t7, this.callFulfilled = this.otherCallFulfilled), typeof r7 == "function" && (this.onRejected = r7, this.callRejected = this.otherCallRejected);
                                        }
                                        function l6(t7, r7, n7) {
                                          i(function() {
                                            var e2;
                                            try {
                                              e2 = r7(n7);
                                            } catch (e3) {
                                              return f.reject(t7, e3);
                                            }
                                            e2 === t7 ? f.reject(t7, new TypeError("Cannot resolve promise with itself")) : f.resolve(t7, e2);
                                          });
                                        }
                                        function d(e2) {
                                          var t7 = e2 && e2.then;
                                          if (e2 && (typeof e2 == "object" || typeof e2 == "function") && typeof t7 == "function")
                                            return function() {
                                              t7.apply(e2, arguments);
                                            };
                                        }
                                        function c(t7, e2) {
                                          var r7 = false;
                                          function n7(e3) {
                                            r7 || (r7 = true, f.reject(t7, e3));
                                          }
                                          function i2(e3) {
                                            r7 || (r7 = true, f.resolve(t7, e3));
                                          }
                                          var s2 = p(function() {
                                            e2(i2, n7);
                                          });
                                          s2.status === "error" && n7(s2.value);
                                        }
                                        function p(e2, t7) {
                                          var r7 = {};
                                          try {
                                            r7.value = e2(t7), r7.status = "success";
                                          } catch (e3) {
                                            r7.status = "error", r7.value = e3;
                                          }
                                          return r7;
                                        }
                                        (t6.exports = o).prototype.finally = function(t7) {
                                          if (typeof t7 != "function")
                                            return this;
                                          var r7 = this.constructor;
                                          return this.then(function(e2) {
                                            return r7.resolve(t7()).then(function() {
                                              return e2;
                                            });
                                          }, function(e2) {
                                            return r7.resolve(t7()).then(function() {
                                              throw e2;
                                            });
                                          });
                                        }, o.prototype.catch = function(e2) {
                                          return this.then(null, e2);
                                        }, o.prototype.then = function(e2, t7) {
                                          if (typeof e2 != "function" && this.state === a || typeof t7 != "function" && this.state === s)
                                            return this;
                                          var r7 = new this.constructor(h);
                                          return this.state !== n6 ? l6(r7, this.state === a ? e2 : t7, this.outcome) : this.queue.push(new u(r7, e2, t7)), r7;
                                        }, u.prototype.callFulfilled = function(e2) {
                                          f.resolve(this.promise, e2);
                                        }, u.prototype.otherCallFulfilled = function(e2) {
                                          l6(this.promise, this.onFulfilled, e2);
                                        }, u.prototype.callRejected = function(e2) {
                                          f.reject(this.promise, e2);
                                        }, u.prototype.otherCallRejected = function(e2) {
                                          l6(this.promise, this.onRejected, e2);
                                        }, f.resolve = function(e2, t7) {
                                          var r7 = p(d, t7);
                                          if (r7.status === "error")
                                            return f.reject(e2, r7.value);
                                          var n7 = r7.value;
                                          if (n7)
                                            c(e2, n7);
                                          else {
                                            e2.state = a, e2.outcome = t7;
                                            for (var i2 = -1, s2 = e2.queue.length; ++i2 < s2; )
                                              e2.queue[i2].callFulfilled(t7);
                                          }
                                          return e2;
                                        }, f.reject = function(e2, t7) {
                                          e2.state = s, e2.outcome = t7;
                                          for (var r7 = -1, n7 = e2.queue.length; ++r7 < n7; )
                                            e2.queue[r7].callRejected(t7);
                                          return e2;
                                        }, o.resolve = function(e2) {
                                          return e2 instanceof this ? e2 : f.resolve(new this(h), e2);
                                        }, o.reject = function(e2) {
                                          var t7 = new this(h);
                                          return f.reject(t7, e2);
                                        }, o.all = function(e2) {
                                          var r7 = this;
                                          if (Object.prototype.toString.call(e2) !== "[object Array]")
                                            return this.reject(new TypeError("must be an array"));
                                          var n7 = e2.length, i2 = false;
                                          if (!n7)
                                            return this.resolve([]);
                                          for (var s2 = new Array(n7), a2 = 0, t7 = -1, o2 = new this(h); ++t7 < n7; )
                                            u2(e2[t7], t7);
                                          return o2;
                                          function u2(e3, t8) {
                                            r7.resolve(e3).then(function(e4) {
                                              s2[t8] = e4, ++a2 !== n7 || i2 || (i2 = true, f.resolve(o2, s2));
                                            }, function(e4) {
                                              i2 || (i2 = true, f.reject(o2, e4));
                                            });
                                          }
                                        }, o.race = function(e2) {
                                          if (Object.prototype.toString.call(e2) !== "[object Array]")
                                            return this.reject(new TypeError("must be an array"));
                                          var t7 = e2.length, r7 = false;
                                          if (!t7)
                                            return this.resolve([]);
                                          for (var n7, i2 = -1, s2 = new this(h); ++i2 < t7; )
                                            n7 = e2[i2], this.resolve(n7).then(function(e3) {
                                              r7 || (r7 = true, f.resolve(s2, e3));
                                            }, function(e3) {
                                              r7 || (r7 = true, f.reject(s2, e3));
                                            });
                                          return s2;
                                        };
                                      }, { immediate: 36 }], 38: [function(e, t6, r6) {
                                        "use strict";
                                        var n6 = {};
                                        (0, e("./lib/utils/common").assign)(n6, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), t6.exports = n6;
                                      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, t6, r6) {
                                        "use strict";
                                        var a = e("./zlib/deflate"), o = e("./utils/common"), u = e("./utils/strings"), i = e("./zlib/messages"), s = e("./zlib/zstream"), h = Object.prototype.toString, f = 0, l6 = -1, d = 0, c = 8;
                                        function p(e2) {
                                          if (!(this instanceof p))
                                            return new p(e2);
                                          this.options = o.assign({ level: l6, method: c, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: d, to: "" }, e2 || {});
                                          var t7 = this.options;
                                          t7.raw && 0 < t7.windowBits ? t7.windowBits = -t7.windowBits : t7.gzip && 0 < t7.windowBits && t7.windowBits < 16 && (t7.windowBits += 16), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new s(), this.strm.avail_out = 0;
                                          var r7 = a.deflateInit2(this.strm, t7.level, t7.method, t7.windowBits, t7.memLevel, t7.strategy);
                                          if (r7 !== f)
                                            throw new Error(i[r7]);
                                          if (t7.header && a.deflateSetHeader(this.strm, t7.header), t7.dictionary) {
                                            var n7;
                                            if (n7 = typeof t7.dictionary == "string" ? u.string2buf(t7.dictionary) : h.call(t7.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(t7.dictionary) : t7.dictionary, (r7 = a.deflateSetDictionary(this.strm, n7)) !== f)
                                              throw new Error(i[r7]);
                                            this._dict_set = true;
                                          }
                                        }
                                        function n6(e2, t7) {
                                          var r7 = new p(t7);
                                          if (r7.push(e2, true), r7.err)
                                            throw r7.msg || i[r7.err];
                                          return r7.result;
                                        }
                                        p.prototype.push = function(e2, t7) {
                                          var r7, n7, i2 = this.strm, s2 = this.options.chunkSize;
                                          if (this.ended)
                                            return false;
                                          n7 = t7 === ~~t7 ? t7 : t7 === true ? 4 : 0, typeof e2 == "string" ? i2.input = u.string2buf(e2) : h.call(e2) === "[object ArrayBuffer]" ? i2.input = new Uint8Array(e2) : i2.input = e2, i2.next_in = 0, i2.avail_in = i2.input.length;
                                          do {
                                            if (i2.avail_out === 0 && (i2.output = new o.Buf8(s2), i2.next_out = 0, i2.avail_out = s2), (r7 = a.deflate(i2, n7)) !== 1 && r7 !== f)
                                              return this.onEnd(r7), !(this.ended = true);
                                            i2.avail_out !== 0 && (i2.avail_in !== 0 || n7 !== 4 && n7 !== 2) || (this.options.to === "string" ? this.onData(u.buf2binstring(o.shrinkBuf(i2.output, i2.next_out))) : this.onData(o.shrinkBuf(i2.output, i2.next_out)));
                                          } while ((0 < i2.avail_in || i2.avail_out === 0) && r7 !== 1);
                                          return n7 === 4 ? (r7 = a.deflateEnd(this.strm), this.onEnd(r7), this.ended = true, r7 === f) : n7 !== 2 || (this.onEnd(f), !(i2.avail_out = 0));
                                        }, p.prototype.onData = function(e2) {
                                          this.chunks.push(e2);
                                        }, p.prototype.onEnd = function(e2) {
                                          e2 === f && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
                                        }, r6.Deflate = p, r6.deflate = n6, r6.deflateRaw = function(e2, t7) {
                                          return (t7 = t7 || {}).raw = true, n6(e2, t7);
                                        }, r6.gzip = function(e2, t7) {
                                          return (t7 = t7 || {}).gzip = true, n6(e2, t7);
                                        };
                                      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, t6, r6) {
                                        "use strict";
                                        var d = e("./zlib/inflate"), c = e("./utils/common"), p = e("./utils/strings"), m = e("./zlib/constants"), n6 = e("./zlib/messages"), i = e("./zlib/zstream"), s = e("./zlib/gzheader"), _ = Object.prototype.toString;
                                        function a(e2) {
                                          if (!(this instanceof a))
                                            return new a(e2);
                                          this.options = c.assign({ chunkSize: 16384, windowBits: 0, to: "" }, e2 || {});
                                          var t7 = this.options;
                                          t7.raw && 0 <= t7.windowBits && t7.windowBits < 16 && (t7.windowBits = -t7.windowBits, t7.windowBits === 0 && (t7.windowBits = -15)), !(0 <= t7.windowBits && t7.windowBits < 16) || e2 && e2.windowBits || (t7.windowBits += 32), 15 < t7.windowBits && t7.windowBits < 48 && (15 & t7.windowBits) == 0 && (t7.windowBits |= 15), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new i(), this.strm.avail_out = 0;
                                          var r7 = d.inflateInit2(this.strm, t7.windowBits);
                                          if (r7 !== m.Z_OK)
                                            throw new Error(n6[r7]);
                                          this.header = new s(), d.inflateGetHeader(this.strm, this.header);
                                        }
                                        function o(e2, t7) {
                                          var r7 = new a(t7);
                                          if (r7.push(e2, true), r7.err)
                                            throw r7.msg || n6[r7.err];
                                          return r7.result;
                                        }
                                        a.prototype.push = function(e2, t7) {
                                          var r7, n7, i2, s2, a2, o2, u = this.strm, h = this.options.chunkSize, f = this.options.dictionary, l6 = false;
                                          if (this.ended)
                                            return false;
                                          n7 = t7 === ~~t7 ? t7 : t7 === true ? m.Z_FINISH : m.Z_NO_FLUSH, typeof e2 == "string" ? u.input = p.binstring2buf(e2) : _.call(e2) === "[object ArrayBuffer]" ? u.input = new Uint8Array(e2) : u.input = e2, u.next_in = 0, u.avail_in = u.input.length;
                                          do {
                                            if (u.avail_out === 0 && (u.output = new c.Buf8(h), u.next_out = 0, u.avail_out = h), (r7 = d.inflate(u, m.Z_NO_FLUSH)) === m.Z_NEED_DICT && f && (o2 = typeof f == "string" ? p.string2buf(f) : _.call(f) === "[object ArrayBuffer]" ? new Uint8Array(f) : f, r7 = d.inflateSetDictionary(this.strm, o2)), r7 === m.Z_BUF_ERROR && l6 === true && (r7 = m.Z_OK, l6 = false), r7 !== m.Z_STREAM_END && r7 !== m.Z_OK)
                                              return this.onEnd(r7), !(this.ended = true);
                                            u.next_out && (u.avail_out !== 0 && r7 !== m.Z_STREAM_END && (u.avail_in !== 0 || n7 !== m.Z_FINISH && n7 !== m.Z_SYNC_FLUSH) || (this.options.to === "string" ? (i2 = p.utf8border(u.output, u.next_out), s2 = u.next_out - i2, a2 = p.buf2string(u.output, i2), u.next_out = s2, u.avail_out = h - s2, s2 && c.arraySet(u.output, u.output, i2, s2, 0), this.onData(a2)) : this.onData(c.shrinkBuf(u.output, u.next_out)))), u.avail_in === 0 && u.avail_out === 0 && (l6 = true);
                                          } while ((0 < u.avail_in || u.avail_out === 0) && r7 !== m.Z_STREAM_END);
                                          return r7 === m.Z_STREAM_END && (n7 = m.Z_FINISH), n7 === m.Z_FINISH ? (r7 = d.inflateEnd(this.strm), this.onEnd(r7), this.ended = true, r7 === m.Z_OK) : n7 !== m.Z_SYNC_FLUSH || (this.onEnd(m.Z_OK), !(u.avail_out = 0));
                                        }, a.prototype.onData = function(e2) {
                                          this.chunks.push(e2);
                                        }, a.prototype.onEnd = function(e2) {
                                          e2 === m.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = c.flattenChunks(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
                                        }, r6.Inflate = a, r6.inflate = o, r6.inflateRaw = function(e2, t7) {
                                          return (t7 = t7 || {}).raw = true, o(e2, t7);
                                        }, r6.ungzip = o;
                                      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, t6, r6) {
                                        "use strict";
                                        var n6 = typeof Uint8Array != "undefined" && typeof Uint16Array != "undefined" && typeof Int32Array != "undefined";
                                        r6.assign = function(e2) {
                                          for (var t7 = Array.prototype.slice.call(arguments, 1); t7.length; ) {
                                            var r7 = t7.shift();
                                            if (r7) {
                                              if (typeof r7 != "object")
                                                throw new TypeError(r7 + "must be non-object");
                                              for (var n7 in r7)
                                                r7.hasOwnProperty(n7) && (e2[n7] = r7[n7]);
                                            }
                                          }
                                          return e2;
                                        }, r6.shrinkBuf = function(e2, t7) {
                                          return e2.length === t7 ? e2 : e2.subarray ? e2.subarray(0, t7) : (e2.length = t7, e2);
                                        };
                                        var i = { arraySet: function(e2, t7, r7, n7, i2) {
                                          if (t7.subarray && e2.subarray)
                                            e2.set(t7.subarray(r7, r7 + n7), i2);
                                          else
                                            for (var s2 = 0; s2 < n7; s2++)
                                              e2[i2 + s2] = t7[r7 + s2];
                                        }, flattenChunks: function(e2) {
                                          var t7, r7, n7, i2, s2, a;
                                          for (t7 = n7 = 0, r7 = e2.length; t7 < r7; t7++)
                                            n7 += e2[t7].length;
                                          for (a = new Uint8Array(n7), t7 = i2 = 0, r7 = e2.length; t7 < r7; t7++)
                                            s2 = e2[t7], a.set(s2, i2), i2 += s2.length;
                                          return a;
                                        } }, s = { arraySet: function(e2, t7, r7, n7, i2) {
                                          for (var s2 = 0; s2 < n7; s2++)
                                            e2[i2 + s2] = t7[r7 + s2];
                                        }, flattenChunks: function(e2) {
                                          return [].concat.apply([], e2);
                                        } };
                                        r6.setTyped = function(e2) {
                                          e2 ? (r6.Buf8 = Uint8Array, r6.Buf16 = Uint16Array, r6.Buf32 = Int32Array, r6.assign(r6, i)) : (r6.Buf8 = Array, r6.Buf16 = Array, r6.Buf32 = Array, r6.assign(r6, s));
                                        }, r6.setTyped(n6);
                                      }, {}], 42: [function(e, t6, r6) {
                                        "use strict";
                                        var u = e("./common"), i = true, s = true;
                                        try {
                                          String.fromCharCode.apply(null, [0]);
                                        } catch (e2) {
                                          i = false;
                                        }
                                        try {
                                          String.fromCharCode.apply(null, new Uint8Array(1));
                                        } catch (e2) {
                                          s = false;
                                        }
                                        for (var h = new u.Buf8(256), n6 = 0; n6 < 256; n6++)
                                          h[n6] = 252 <= n6 ? 6 : 248 <= n6 ? 5 : 240 <= n6 ? 4 : 224 <= n6 ? 3 : 192 <= n6 ? 2 : 1;
                                        function f(e2, t7) {
                                          if (t7 < 65537 && (e2.subarray && s || !e2.subarray && i))
                                            return String.fromCharCode.apply(null, u.shrinkBuf(e2, t7));
                                          for (var r7 = "", n7 = 0; n7 < t7; n7++)
                                            r7 += String.fromCharCode(e2[n7]);
                                          return r7;
                                        }
                                        h[254] = h[254] = 1, r6.string2buf = function(e2) {
                                          var t7, r7, n7, i2, s2, a = e2.length, o = 0;
                                          for (i2 = 0; i2 < a; i2++)
                                            (64512 & (r7 = e2.charCodeAt(i2))) == 55296 && i2 + 1 < a && (64512 & (n7 = e2.charCodeAt(i2 + 1))) == 56320 && (r7 = 65536 + (r7 - 55296 << 10) + (n7 - 56320), i2++), o += r7 < 128 ? 1 : r7 < 2048 ? 2 : r7 < 65536 ? 3 : 4;
                                          for (t7 = new u.Buf8(o), i2 = s2 = 0; s2 < o; i2++)
                                            (64512 & (r7 = e2.charCodeAt(i2))) == 55296 && i2 + 1 < a && (64512 & (n7 = e2.charCodeAt(i2 + 1))) == 56320 && (r7 = 65536 + (r7 - 55296 << 10) + (n7 - 56320), i2++), r7 < 128 ? t7[s2++] = r7 : (r7 < 2048 ? t7[s2++] = 192 | r7 >>> 6 : (r7 < 65536 ? t7[s2++] = 224 | r7 >>> 12 : (t7[s2++] = 240 | r7 >>> 18, t7[s2++] = 128 | r7 >>> 12 & 63), t7[s2++] = 128 | r7 >>> 6 & 63), t7[s2++] = 128 | 63 & r7);
                                          return t7;
                                        }, r6.buf2binstring = function(e2) {
                                          return f(e2, e2.length);
                                        }, r6.binstring2buf = function(e2) {
                                          for (var t7 = new u.Buf8(e2.length), r7 = 0, n7 = t7.length; r7 < n7; r7++)
                                            t7[r7] = e2.charCodeAt(r7);
                                          return t7;
                                        }, r6.buf2string = function(e2, t7) {
                                          var r7, n7, i2, s2, a = t7 || e2.length, o = new Array(2 * a);
                                          for (r7 = n7 = 0; r7 < a; )
                                            if ((i2 = e2[r7++]) < 128)
                                              o[n7++] = i2;
                                            else if (4 < (s2 = h[i2]))
                                              o[n7++] = 65533, r7 += s2 - 1;
                                            else {
                                              for (i2 &= s2 === 2 ? 31 : s2 === 3 ? 15 : 7; 1 < s2 && r7 < a; )
                                                i2 = i2 << 6 | 63 & e2[r7++], s2--;
                                              1 < s2 ? o[n7++] = 65533 : i2 < 65536 ? o[n7++] = i2 : (i2 -= 65536, o[n7++] = 55296 | i2 >> 10 & 1023, o[n7++] = 56320 | 1023 & i2);
                                            }
                                          return f(o, n7);
                                        }, r6.utf8border = function(e2, t7) {
                                          var r7;
                                          for ((t7 = t7 || e2.length) > e2.length && (t7 = e2.length), r7 = t7 - 1; 0 <= r7 && (192 & e2[r7]) == 128; )
                                            r7--;
                                          return r7 < 0 ? t7 : r7 === 0 ? t7 : r7 + h[e2[r7]] > t7 ? r7 : t7;
                                        };
                                      }, { "./common": 41 }], 43: [function(e, t6, r6) {
                                        "use strict";
                                        t6.exports = function(e2, t7, r7, n6) {
                                          for (var i = 65535 & e2 | 0, s = e2 >>> 16 & 65535 | 0, a = 0; r7 !== 0; ) {
                                            for (r7 -= a = 2e3 < r7 ? 2e3 : r7; s = s + (i = i + t7[n6++] | 0) | 0, --a; )
                                              ;
                                            i %= 65521, s %= 65521;
                                          }
                                          return i | s << 16 | 0;
                                        };
                                      }, {}], 44: [function(e, t6, r6) {
                                        "use strict";
                                        t6.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
                                      }, {}], 45: [function(e, t6, r6) {
                                        "use strict";
                                        var o = function() {
                                          for (var e2, t7 = [], r7 = 0; r7 < 256; r7++) {
                                            e2 = r7;
                                            for (var n6 = 0; n6 < 8; n6++)
                                              e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
                                            t7[r7] = e2;
                                          }
                                          return t7;
                                        }();
                                        t6.exports = function(e2, t7, r7, n6) {
                                          var i = o, s = n6 + r7;
                                          e2 ^= -1;
                                          for (var a = n6; a < s; a++)
                                            e2 = e2 >>> 8 ^ i[255 & (e2 ^ t7[a])];
                                          return -1 ^ e2;
                                        };
                                      }, {}], 46: [function(e, t6, r6) {
                                        "use strict";
                                        var u, d = e("../utils/common"), h = e("./trees"), c = e("./adler32"), p = e("./crc32"), n6 = e("./messages"), f = 0, l6 = 0, m = -2, i = 2, _ = 8, s = 286, a = 30, o = 19, g = 2 * s + 1, v = 15, b = 3, w = 258, y = w + b + 1, k = 42, x = 113;
                                        function S(e2, t7) {
                                          return e2.msg = n6[t7], t7;
                                        }
                                        function z(e2) {
                                          return (e2 << 1) - (4 < e2 ? 9 : 0);
                                        }
                                        function E(e2) {
                                          for (var t7 = e2.length; 0 <= --t7; )
                                            e2[t7] = 0;
                                        }
                                        function C(e2) {
                                          var t7 = e2.state, r7 = t7.pending;
                                          r7 > e2.avail_out && (r7 = e2.avail_out), r7 !== 0 && (d.arraySet(e2.output, t7.pending_buf, t7.pending_out, r7, e2.next_out), e2.next_out += r7, t7.pending_out += r7, e2.total_out += r7, e2.avail_out -= r7, t7.pending -= r7, t7.pending === 0 && (t7.pending_out = 0));
                                        }
                                        function A(e2, t7) {
                                          h._tr_flush_block(e2, 0 <= e2.block_start ? e2.block_start : -1, e2.strstart - e2.block_start, t7), e2.block_start = e2.strstart, C(e2.strm);
                                        }
                                        function I(e2, t7) {
                                          e2.pending_buf[e2.pending++] = t7;
                                        }
                                        function O(e2, t7) {
                                          e2.pending_buf[e2.pending++] = t7 >>> 8 & 255, e2.pending_buf[e2.pending++] = 255 & t7;
                                        }
                                        function B(e2, t7) {
                                          var r7, n7, i2 = e2.max_chain_length, s2 = e2.strstart, a2 = e2.prev_length, o2 = e2.nice_match, u2 = e2.strstart > e2.w_size - y ? e2.strstart - (e2.w_size - y) : 0, h2 = e2.window, f2 = e2.w_mask, l7 = e2.prev, d2 = e2.strstart + w, c2 = h2[s2 + a2 - 1], p2 = h2[s2 + a2];
                                          e2.prev_length >= e2.good_match && (i2 >>= 2), o2 > e2.lookahead && (o2 = e2.lookahead);
                                          do {
                                            if (h2[(r7 = t7) + a2] === p2 && h2[r7 + a2 - 1] === c2 && h2[r7] === h2[s2] && h2[++r7] === h2[s2 + 1]) {
                                              s2 += 2, r7++;
                                              do {
                                              } while (h2[++s2] === h2[++r7] && h2[++s2] === h2[++r7] && h2[++s2] === h2[++r7] && h2[++s2] === h2[++r7] && h2[++s2] === h2[++r7] && h2[++s2] === h2[++r7] && h2[++s2] === h2[++r7] && h2[++s2] === h2[++r7] && s2 < d2);
                                              if (n7 = w - (d2 - s2), s2 = d2 - w, a2 < n7) {
                                                if (e2.match_start = t7, o2 <= (a2 = n7))
                                                  break;
                                                c2 = h2[s2 + a2 - 1], p2 = h2[s2 + a2];
                                              }
                                            }
                                          } while ((t7 = l7[t7 & f2]) > u2 && --i2 != 0);
                                          return a2 <= e2.lookahead ? a2 : e2.lookahead;
                                        }
                                        function T(e2) {
                                          var t7, r7, n7, i2, s2, a2, o2, u2, h2, f2, l7 = e2.w_size;
                                          do {
                                            if (i2 = e2.window_size - e2.lookahead - e2.strstart, e2.strstart >= l7 + (l7 - y)) {
                                              for (d.arraySet(e2.window, e2.window, l7, l7, 0), e2.match_start -= l7, e2.strstart -= l7, e2.block_start -= l7, t7 = r7 = e2.hash_size; n7 = e2.head[--t7], e2.head[t7] = l7 <= n7 ? n7 - l7 : 0, --r7; )
                                                ;
                                              for (t7 = r7 = l7; n7 = e2.prev[--t7], e2.prev[t7] = l7 <= n7 ? n7 - l7 : 0, --r7; )
                                                ;
                                              i2 += l7;
                                            }
                                            if (e2.strm.avail_in === 0)
                                              break;
                                            if (a2 = e2.strm, o2 = e2.window, u2 = e2.strstart + e2.lookahead, f2 = void 0, (h2 = i2) < (f2 = a2.avail_in) && (f2 = h2), r7 = f2 === 0 ? 0 : (a2.avail_in -= f2, d.arraySet(o2, a2.input, a2.next_in, f2, u2), a2.state.wrap === 1 ? a2.adler = c(a2.adler, o2, f2, u2) : a2.state.wrap === 2 && (a2.adler = p(a2.adler, o2, f2, u2)), a2.next_in += f2, a2.total_in += f2, f2), e2.lookahead += r7, e2.lookahead + e2.insert >= b)
                                              for (s2 = e2.strstart - e2.insert, e2.ins_h = e2.window[s2], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + 1]) & e2.hash_mask; e2.insert && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + b - 1]) & e2.hash_mask, e2.prev[s2 & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = s2, s2++, e2.insert--, !(e2.lookahead + e2.insert < b)); )
                                                ;
                                          } while (e2.lookahead < y && e2.strm.avail_in !== 0);
                                        }
                                        function R(e2, t7) {
                                          for (var r7, n7; ; ) {
                                            if (e2.lookahead < y) {
                                              if (T(e2), e2.lookahead < y && t7 === f)
                                                return 1;
                                              if (e2.lookahead === 0)
                                                break;
                                            }
                                            if (r7 = 0, e2.lookahead >= b && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + b - 1]) & e2.hash_mask, r7 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), r7 !== 0 && e2.strstart - r7 <= e2.w_size - y && (e2.match_length = B(e2, r7)), e2.match_length >= b)
                                              if (n7 = h._tr_tally(e2, e2.strstart - e2.match_start, e2.match_length - b), e2.lookahead -= e2.match_length, e2.match_length <= e2.max_lazy_match && e2.lookahead >= b) {
                                                for (e2.match_length--; e2.strstart++, e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + b - 1]) & e2.hash_mask, r7 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart, --e2.match_length != 0; )
                                                  ;
                                                e2.strstart++;
                                              } else
                                                e2.strstart += e2.match_length, e2.match_length = 0, e2.ins_h = e2.window[e2.strstart], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + 1]) & e2.hash_mask;
                                            else
                                              n7 = h._tr_tally(e2, 0, e2.window[e2.strstart]), e2.lookahead--, e2.strstart++;
                                            if (n7 && (A(e2, false), e2.strm.avail_out === 0))
                                              return 1;
                                          }
                                          return e2.insert = e2.strstart < b - 1 ? e2.strstart : b - 1, t7 === 4 ? (A(e2, true), e2.strm.avail_out === 0 ? 3 : 4) : e2.last_lit && (A(e2, false), e2.strm.avail_out === 0) ? 1 : 2;
                                        }
                                        function D(e2, t7) {
                                          for (var r7, n7, i2; ; ) {
                                            if (e2.lookahead < y) {
                                              if (T(e2), e2.lookahead < y && t7 === f)
                                                return 1;
                                              if (e2.lookahead === 0)
                                                break;
                                            }
                                            if (r7 = 0, e2.lookahead >= b && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + b - 1]) & e2.hash_mask, r7 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), e2.prev_length = e2.match_length, e2.prev_match = e2.match_start, e2.match_length = b - 1, r7 !== 0 && e2.prev_length < e2.max_lazy_match && e2.strstart - r7 <= e2.w_size - y && (e2.match_length = B(e2, r7), e2.match_length <= 5 && (e2.strategy === 1 || e2.match_length === b && 4096 < e2.strstart - e2.match_start) && (e2.match_length = b - 1)), e2.prev_length >= b && e2.match_length <= e2.prev_length) {
                                              for (i2 = e2.strstart + e2.lookahead - b, n7 = h._tr_tally(e2, e2.strstart - 1 - e2.prev_match, e2.prev_length - b), e2.lookahead -= e2.prev_length - 1, e2.prev_length -= 2; ++e2.strstart <= i2 && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + b - 1]) & e2.hash_mask, r7 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), --e2.prev_length != 0; )
                                                ;
                                              if (e2.match_available = 0, e2.match_length = b - 1, e2.strstart++, n7 && (A(e2, false), e2.strm.avail_out === 0))
                                                return 1;
                                            } else if (e2.match_available) {
                                              if ((n7 = h._tr_tally(e2, 0, e2.window[e2.strstart - 1])) && A(e2, false), e2.strstart++, e2.lookahead--, e2.strm.avail_out === 0)
                                                return 1;
                                            } else
                                              e2.match_available = 1, e2.strstart++, e2.lookahead--;
                                          }
                                          return e2.match_available && (n7 = h._tr_tally(e2, 0, e2.window[e2.strstart - 1]), e2.match_available = 0), e2.insert = e2.strstart < b - 1 ? e2.strstart : b - 1, t7 === 4 ? (A(e2, true), e2.strm.avail_out === 0 ? 3 : 4) : e2.last_lit && (A(e2, false), e2.strm.avail_out === 0) ? 1 : 2;
                                        }
                                        function F(e2, t7, r7, n7, i2) {
                                          this.good_length = e2, this.max_lazy = t7, this.nice_length = r7, this.max_chain = n7, this.func = i2;
                                        }
                                        function N() {
                                          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = _, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new d.Buf16(2 * g), this.dyn_dtree = new d.Buf16(2 * (2 * a + 1)), this.bl_tree = new d.Buf16(2 * (2 * o + 1)), E(this.dyn_ltree), E(this.dyn_dtree), E(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new d.Buf16(v + 1), this.heap = new d.Buf16(2 * s + 1), E(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new d.Buf16(2 * s + 1), E(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
                                        }
                                        function U(e2) {
                                          var t7;
                                          return e2 && e2.state ? (e2.total_in = e2.total_out = 0, e2.data_type = i, (t7 = e2.state).pending = 0, t7.pending_out = 0, t7.wrap < 0 && (t7.wrap = -t7.wrap), t7.status = t7.wrap ? k : x, e2.adler = t7.wrap === 2 ? 0 : 1, t7.last_flush = f, h._tr_init(t7), l6) : S(e2, m);
                                        }
                                        function P(e2) {
                                          var t7, r7 = U(e2);
                                          return r7 === l6 && ((t7 = e2.state).window_size = 2 * t7.w_size, E(t7.head), t7.max_lazy_match = u[t7.level].max_lazy, t7.good_match = u[t7.level].good_length, t7.nice_match = u[t7.level].nice_length, t7.max_chain_length = u[t7.level].max_chain, t7.strstart = 0, t7.block_start = 0, t7.lookahead = 0, t7.insert = 0, t7.match_length = t7.prev_length = b - 1, t7.match_available = 0, t7.ins_h = 0), r7;
                                        }
                                        function L(e2, t7, r7, n7, i2, s2) {
                                          if (!e2)
                                            return m;
                                          var a2 = 1;
                                          if (t7 === -1 && (t7 = 6), n7 < 0 ? (a2 = 0, n7 = -n7) : 15 < n7 && (a2 = 2, n7 -= 16), i2 < 1 || 9 < i2 || r7 !== _ || n7 < 8 || 15 < n7 || t7 < 0 || 9 < t7 || s2 < 0 || 4 < s2)
                                            return S(e2, m);
                                          n7 === 8 && (n7 = 9);
                                          var o2 = new N();
                                          return (e2.state = o2).strm = e2, o2.wrap = a2, o2.gzhead = null, o2.w_bits = n7, o2.w_size = 1 << o2.w_bits, o2.w_mask = o2.w_size - 1, o2.hash_bits = i2 + 7, o2.hash_size = 1 << o2.hash_bits, o2.hash_mask = o2.hash_size - 1, o2.hash_shift = ~~((o2.hash_bits + b - 1) / b), o2.window = new d.Buf8(2 * o2.w_size), o2.head = new d.Buf16(o2.hash_size), o2.prev = new d.Buf16(o2.w_size), o2.lit_bufsize = 1 << i2 + 6, o2.pending_buf_size = 4 * o2.lit_bufsize, o2.pending_buf = new d.Buf8(o2.pending_buf_size), o2.d_buf = 1 * o2.lit_bufsize, o2.l_buf = 3 * o2.lit_bufsize, o2.level = t7, o2.strategy = s2, o2.method = r7, P(e2);
                                        }
                                        u = [new F(0, 0, 0, 0, function(e2, t7) {
                                          var r7 = 65535;
                                          for (r7 > e2.pending_buf_size - 5 && (r7 = e2.pending_buf_size - 5); ; ) {
                                            if (e2.lookahead <= 1) {
                                              if (T(e2), e2.lookahead === 0 && t7 === f)
                                                return 1;
                                              if (e2.lookahead === 0)
                                                break;
                                            }
                                            e2.strstart += e2.lookahead, e2.lookahead = 0;
                                            var n7 = e2.block_start + r7;
                                            if ((e2.strstart === 0 || e2.strstart >= n7) && (e2.lookahead = e2.strstart - n7, e2.strstart = n7, A(e2, false), e2.strm.avail_out === 0))
                                              return 1;
                                            if (e2.strstart - e2.block_start >= e2.w_size - y && (A(e2, false), e2.strm.avail_out === 0))
                                              return 1;
                                          }
                                          return e2.insert = 0, t7 === 4 ? (A(e2, true), e2.strm.avail_out === 0 ? 3 : 4) : (e2.strstart > e2.block_start && (A(e2, false), e2.strm.avail_out), 1);
                                        }), new F(4, 4, 8, 4, R), new F(4, 5, 16, 8, R), new F(4, 6, 32, 32, R), new F(4, 4, 16, 16, D), new F(8, 16, 32, 32, D), new F(8, 16, 128, 128, D), new F(8, 32, 128, 256, D), new F(32, 128, 258, 1024, D), new F(32, 258, 258, 4096, D)], r6.deflateInit = function(e2, t7) {
                                          return L(e2, t7, _, 15, 8, 0);
                                        }, r6.deflateInit2 = L, r6.deflateReset = P, r6.deflateResetKeep = U, r6.deflateSetHeader = function(e2, t7) {
                                          return e2 && e2.state ? e2.state.wrap !== 2 ? m : (e2.state.gzhead = t7, l6) : m;
                                        }, r6.deflate = function(e2, t7) {
                                          var r7, n7, i2, s2;
                                          if (!e2 || !e2.state || 5 < t7 || t7 < 0)
                                            return e2 ? S(e2, m) : m;
                                          if (n7 = e2.state, !e2.output || !e2.input && e2.avail_in !== 0 || n7.status === 666 && t7 !== 4)
                                            return S(e2, e2.avail_out === 0 ? -5 : m);
                                          if (n7.strm = e2, r7 = n7.last_flush, n7.last_flush = t7, n7.status === k)
                                            if (n7.wrap === 2)
                                              e2.adler = 0, I(n7, 31), I(n7, 139), I(n7, 8), n7.gzhead ? (I(n7, (n7.gzhead.text ? 1 : 0) + (n7.gzhead.hcrc ? 2 : 0) + (n7.gzhead.extra ? 4 : 0) + (n7.gzhead.name ? 8 : 0) + (n7.gzhead.comment ? 16 : 0)), I(n7, 255 & n7.gzhead.time), I(n7, n7.gzhead.time >> 8 & 255), I(n7, n7.gzhead.time >> 16 & 255), I(n7, n7.gzhead.time >> 24 & 255), I(n7, n7.level === 9 ? 2 : 2 <= n7.strategy || n7.level < 2 ? 4 : 0), I(n7, 255 & n7.gzhead.os), n7.gzhead.extra && n7.gzhead.extra.length && (I(n7, 255 & n7.gzhead.extra.length), I(n7, n7.gzhead.extra.length >> 8 & 255)), n7.gzhead.hcrc && (e2.adler = p(e2.adler, n7.pending_buf, n7.pending, 0)), n7.gzindex = 0, n7.status = 69) : (I(n7, 0), I(n7, 0), I(n7, 0), I(n7, 0), I(n7, 0), I(n7, n7.level === 9 ? 2 : 2 <= n7.strategy || n7.level < 2 ? 4 : 0), I(n7, 3), n7.status = x);
                                            else {
                                              var a2 = _ + (n7.w_bits - 8 << 4) << 8;
                                              a2 |= (2 <= n7.strategy || n7.level < 2 ? 0 : n7.level < 6 ? 1 : n7.level === 6 ? 2 : 3) << 6, n7.strstart !== 0 && (a2 |= 32), a2 += 31 - a2 % 31, n7.status = x, O(n7, a2), n7.strstart !== 0 && (O(n7, e2.adler >>> 16), O(n7, 65535 & e2.adler)), e2.adler = 1;
                                            }
                                          if (n7.status === 69)
                                            if (n7.gzhead.extra) {
                                              for (i2 = n7.pending; n7.gzindex < (65535 & n7.gzhead.extra.length) && (n7.pending !== n7.pending_buf_size || (n7.gzhead.hcrc && n7.pending > i2 && (e2.adler = p(e2.adler, n7.pending_buf, n7.pending - i2, i2)), C(e2), i2 = n7.pending, n7.pending !== n7.pending_buf_size)); )
                                                I(n7, 255 & n7.gzhead.extra[n7.gzindex]), n7.gzindex++;
                                              n7.gzhead.hcrc && n7.pending > i2 && (e2.adler = p(e2.adler, n7.pending_buf, n7.pending - i2, i2)), n7.gzindex === n7.gzhead.extra.length && (n7.gzindex = 0, n7.status = 73);
                                            } else
                                              n7.status = 73;
                                          if (n7.status === 73)
                                            if (n7.gzhead.name) {
                                              i2 = n7.pending;
                                              do {
                                                if (n7.pending === n7.pending_buf_size && (n7.gzhead.hcrc && n7.pending > i2 && (e2.adler = p(e2.adler, n7.pending_buf, n7.pending - i2, i2)), C(e2), i2 = n7.pending, n7.pending === n7.pending_buf_size)) {
                                                  s2 = 1;
                                                  break;
                                                }
                                                s2 = n7.gzindex < n7.gzhead.name.length ? 255 & n7.gzhead.name.charCodeAt(n7.gzindex++) : 0, I(n7, s2);
                                              } while (s2 !== 0);
                                              n7.gzhead.hcrc && n7.pending > i2 && (e2.adler = p(e2.adler, n7.pending_buf, n7.pending - i2, i2)), s2 === 0 && (n7.gzindex = 0, n7.status = 91);
                                            } else
                                              n7.status = 91;
                                          if (n7.status === 91)
                                            if (n7.gzhead.comment) {
                                              i2 = n7.pending;
                                              do {
                                                if (n7.pending === n7.pending_buf_size && (n7.gzhead.hcrc && n7.pending > i2 && (e2.adler = p(e2.adler, n7.pending_buf, n7.pending - i2, i2)), C(e2), i2 = n7.pending, n7.pending === n7.pending_buf_size)) {
                                                  s2 = 1;
                                                  break;
                                                }
                                                s2 = n7.gzindex < n7.gzhead.comment.length ? 255 & n7.gzhead.comment.charCodeAt(n7.gzindex++) : 0, I(n7, s2);
                                              } while (s2 !== 0);
                                              n7.gzhead.hcrc && n7.pending > i2 && (e2.adler = p(e2.adler, n7.pending_buf, n7.pending - i2, i2)), s2 === 0 && (n7.status = 103);
                                            } else
                                              n7.status = 103;
                                          if (n7.status === 103 && (n7.gzhead.hcrc ? (n7.pending + 2 > n7.pending_buf_size && C(e2), n7.pending + 2 <= n7.pending_buf_size && (I(n7, 255 & e2.adler), I(n7, e2.adler >> 8 & 255), e2.adler = 0, n7.status = x)) : n7.status = x), n7.pending !== 0) {
                                            if (C(e2), e2.avail_out === 0)
                                              return n7.last_flush = -1, l6;
                                          } else if (e2.avail_in === 0 && z(t7) <= z(r7) && t7 !== 4)
                                            return S(e2, -5);
                                          if (n7.status === 666 && e2.avail_in !== 0)
                                            return S(e2, -5);
                                          if (e2.avail_in !== 0 || n7.lookahead !== 0 || t7 !== f && n7.status !== 666) {
                                            var o2 = n7.strategy === 2 ? function(e3, t8) {
                                              for (var r8; ; ) {
                                                if (e3.lookahead === 0 && (T(e3), e3.lookahead === 0)) {
                                                  if (t8 === f)
                                                    return 1;
                                                  break;
                                                }
                                                if (e3.match_length = 0, r8 = h._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++, r8 && (A(e3, false), e3.strm.avail_out === 0))
                                                  return 1;
                                              }
                                              return e3.insert = 0, t8 === 4 ? (A(e3, true), e3.strm.avail_out === 0 ? 3 : 4) : e3.last_lit && (A(e3, false), e3.strm.avail_out === 0) ? 1 : 2;
                                            }(n7, t7) : n7.strategy === 3 ? function(e3, t8) {
                                              for (var r8, n8, i3, s3, a3 = e3.window; ; ) {
                                                if (e3.lookahead <= w) {
                                                  if (T(e3), e3.lookahead <= w && t8 === f)
                                                    return 1;
                                                  if (e3.lookahead === 0)
                                                    break;
                                                }
                                                if (e3.match_length = 0, e3.lookahead >= b && 0 < e3.strstart && (n8 = a3[i3 = e3.strstart - 1]) === a3[++i3] && n8 === a3[++i3] && n8 === a3[++i3]) {
                                                  s3 = e3.strstart + w;
                                                  do {
                                                  } while (n8 === a3[++i3] && n8 === a3[++i3] && n8 === a3[++i3] && n8 === a3[++i3] && n8 === a3[++i3] && n8 === a3[++i3] && n8 === a3[++i3] && n8 === a3[++i3] && i3 < s3);
                                                  e3.match_length = w - (s3 - i3), e3.match_length > e3.lookahead && (e3.match_length = e3.lookahead);
                                                }
                                                if (e3.match_length >= b ? (r8 = h._tr_tally(e3, 1, e3.match_length - b), e3.lookahead -= e3.match_length, e3.strstart += e3.match_length, e3.match_length = 0) : (r8 = h._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++), r8 && (A(e3, false), e3.strm.avail_out === 0))
                                                  return 1;
                                              }
                                              return e3.insert = 0, t8 === 4 ? (A(e3, true), e3.strm.avail_out === 0 ? 3 : 4) : e3.last_lit && (A(e3, false), e3.strm.avail_out === 0) ? 1 : 2;
                                            }(n7, t7) : u[n7.level].func(n7, t7);
                                            if (o2 !== 3 && o2 !== 4 || (n7.status = 666), o2 === 1 || o2 === 3)
                                              return e2.avail_out === 0 && (n7.last_flush = -1), l6;
                                            if (o2 === 2 && (t7 === 1 ? h._tr_align(n7) : t7 !== 5 && (h._tr_stored_block(n7, 0, 0, false), t7 === 3 && (E(n7.head), n7.lookahead === 0 && (n7.strstart = 0, n7.block_start = 0, n7.insert = 0))), C(e2), e2.avail_out === 0))
                                              return n7.last_flush = -1, l6;
                                          }
                                          return t7 !== 4 ? l6 : n7.wrap <= 0 ? 1 : (n7.wrap === 2 ? (I(n7, 255 & e2.adler), I(n7, e2.adler >> 8 & 255), I(n7, e2.adler >> 16 & 255), I(n7, e2.adler >> 24 & 255), I(n7, 255 & e2.total_in), I(n7, e2.total_in >> 8 & 255), I(n7, e2.total_in >> 16 & 255), I(n7, e2.total_in >> 24 & 255)) : (O(n7, e2.adler >>> 16), O(n7, 65535 & e2.adler)), C(e2), 0 < n7.wrap && (n7.wrap = -n7.wrap), n7.pending !== 0 ? l6 : 1);
                                        }, r6.deflateEnd = function(e2) {
                                          var t7;
                                          return e2 && e2.state ? (t7 = e2.state.status) !== k && t7 !== 69 && t7 !== 73 && t7 !== 91 && t7 !== 103 && t7 !== x && t7 !== 666 ? S(e2, m) : (e2.state = null, t7 === x ? S(e2, -3) : l6) : m;
                                        }, r6.deflateSetDictionary = function(e2, t7) {
                                          var r7, n7, i2, s2, a2, o2, u2, h2, f2 = t7.length;
                                          if (!e2 || !e2.state)
                                            return m;
                                          if ((s2 = (r7 = e2.state).wrap) === 2 || s2 === 1 && r7.status !== k || r7.lookahead)
                                            return m;
                                          for (s2 === 1 && (e2.adler = c(e2.adler, t7, f2, 0)), r7.wrap = 0, f2 >= r7.w_size && (s2 === 0 && (E(r7.head), r7.strstart = 0, r7.block_start = 0, r7.insert = 0), h2 = new d.Buf8(r7.w_size), d.arraySet(h2, t7, f2 - r7.w_size, r7.w_size, 0), t7 = h2, f2 = r7.w_size), a2 = e2.avail_in, o2 = e2.next_in, u2 = e2.input, e2.avail_in = f2, e2.next_in = 0, e2.input = t7, T(r7); r7.lookahead >= b; ) {
                                            for (n7 = r7.strstart, i2 = r7.lookahead - (b - 1); r7.ins_h = (r7.ins_h << r7.hash_shift ^ r7.window[n7 + b - 1]) & r7.hash_mask, r7.prev[n7 & r7.w_mask] = r7.head[r7.ins_h], r7.head[r7.ins_h] = n7, n7++, --i2; )
                                              ;
                                            r7.strstart = n7, r7.lookahead = b - 1, T(r7);
                                          }
                                          return r7.strstart += r7.lookahead, r7.block_start = r7.strstart, r7.insert = r7.lookahead, r7.lookahead = 0, r7.match_length = r7.prev_length = b - 1, r7.match_available = 0, e2.next_in = o2, e2.input = u2, e2.avail_in = a2, r7.wrap = s2, l6;
                                        }, r6.deflateInfo = "pako deflate (from Nodeca project)";
                                      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, t6, r6) {
                                        "use strict";
                                        t6.exports = function() {
                                          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = false;
                                        };
                                      }, {}], 48: [function(e, t6, r6) {
                                        "use strict";
                                        t6.exports = function(e2, t7) {
                                          var r7, n6, i, s, a, o, u, h, f, l6, d, c, p, m, _, g, v, b, w, y, k, x, S, z, E;
                                          r7 = e2.state, n6 = e2.next_in, z = e2.input, i = n6 + (e2.avail_in - 5), s = e2.next_out, E = e2.output, a = s - (t7 - e2.avail_out), o = s + (e2.avail_out - 257), u = r7.dmax, h = r7.wsize, f = r7.whave, l6 = r7.wnext, d = r7.window, c = r7.hold, p = r7.bits, m = r7.lencode, _ = r7.distcode, g = (1 << r7.lenbits) - 1, v = (1 << r7.distbits) - 1;
                                          e:
                                            do {
                                              p < 15 && (c += z[n6++] << p, p += 8, c += z[n6++] << p, p += 8), b = m[c & g];
                                              t:
                                                for (; ; ) {
                                                  if (c >>>= w = b >>> 24, p -= w, (w = b >>> 16 & 255) == 0)
                                                    E[s++] = 65535 & b;
                                                  else {
                                                    if (!(16 & w)) {
                                                      if ((64 & w) == 0) {
                                                        b = m[(65535 & b) + (c & (1 << w) - 1)];
                                                        continue t;
                                                      }
                                                      if (32 & w) {
                                                        r7.mode = 12;
                                                        break e;
                                                      }
                                                      e2.msg = "invalid literal/length code", r7.mode = 30;
                                                      break e;
                                                    }
                                                    y = 65535 & b, (w &= 15) && (p < w && (c += z[n6++] << p, p += 8), y += c & (1 << w) - 1, c >>>= w, p -= w), p < 15 && (c += z[n6++] << p, p += 8, c += z[n6++] << p, p += 8), b = _[c & v];
                                                    r:
                                                      for (; ; ) {
                                                        if (c >>>= w = b >>> 24, p -= w, !(16 & (w = b >>> 16 & 255))) {
                                                          if ((64 & w) == 0) {
                                                            b = _[(65535 & b) + (c & (1 << w) - 1)];
                                                            continue r;
                                                          }
                                                          e2.msg = "invalid distance code", r7.mode = 30;
                                                          break e;
                                                        }
                                                        if (k = 65535 & b, p < (w &= 15) && (c += z[n6++] << p, (p += 8) < w && (c += z[n6++] << p, p += 8)), u < (k += c & (1 << w) - 1)) {
                                                          e2.msg = "invalid distance too far back", r7.mode = 30;
                                                          break e;
                                                        }
                                                        if (c >>>= w, p -= w, (w = s - a) < k) {
                                                          if (f < (w = k - w) && r7.sane) {
                                                            e2.msg = "invalid distance too far back", r7.mode = 30;
                                                            break e;
                                                          }
                                                          if (S = d, (x = 0) === l6) {
                                                            if (x += h - w, w < y) {
                                                              for (y -= w; E[s++] = d[x++], --w; )
                                                                ;
                                                              x = s - k, S = E;
                                                            }
                                                          } else if (l6 < w) {
                                                            if (x += h + l6 - w, (w -= l6) < y) {
                                                              for (y -= w; E[s++] = d[x++], --w; )
                                                                ;
                                                              if (x = 0, l6 < y) {
                                                                for (y -= w = l6; E[s++] = d[x++], --w; )
                                                                  ;
                                                                x = s - k, S = E;
                                                              }
                                                            }
                                                          } else if (x += l6 - w, w < y) {
                                                            for (y -= w; E[s++] = d[x++], --w; )
                                                              ;
                                                            x = s - k, S = E;
                                                          }
                                                          for (; 2 < y; )
                                                            E[s++] = S[x++], E[s++] = S[x++], E[s++] = S[x++], y -= 3;
                                                          y && (E[s++] = S[x++], 1 < y && (E[s++] = S[x++]));
                                                        } else {
                                                          for (x = s - k; E[s++] = E[x++], E[s++] = E[x++], E[s++] = E[x++], 2 < (y -= 3); )
                                                            ;
                                                          y && (E[s++] = E[x++], 1 < y && (E[s++] = E[x++]));
                                                        }
                                                        break;
                                                      }
                                                  }
                                                  break;
                                                }
                                            } while (n6 < i && s < o);
                                          n6 -= y = p >> 3, c &= (1 << (p -= y << 3)) - 1, e2.next_in = n6, e2.next_out = s, e2.avail_in = n6 < i ? i - n6 + 5 : 5 - (n6 - i), e2.avail_out = s < o ? o - s + 257 : 257 - (s - o), r7.hold = c, r7.bits = p;
                                        };
                                      }, {}], 49: [function(e, t6, r6) {
                                        "use strict";
                                        var I = e("../utils/common"), O = e("./adler32"), B = e("./crc32"), T = e("./inffast"), R = e("./inftrees"), D = 1, F = 2, N = 0, U = -2, P = 1, n6 = 852, i = 592;
                                        function L(e2) {
                                          return (e2 >>> 24 & 255) + (e2 >>> 8 & 65280) + ((65280 & e2) << 8) + ((255 & e2) << 24);
                                        }
                                        function s() {
                                          this.mode = 0, this.last = false, this.wrap = 0, this.havedict = false, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new I.Buf16(320), this.work = new I.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
                                        }
                                        function a(e2) {
                                          var t7;
                                          return e2 && e2.state ? (t7 = e2.state, e2.total_in = e2.total_out = t7.total = 0, e2.msg = "", t7.wrap && (e2.adler = 1 & t7.wrap), t7.mode = P, t7.last = 0, t7.havedict = 0, t7.dmax = 32768, t7.head = null, t7.hold = 0, t7.bits = 0, t7.lencode = t7.lendyn = new I.Buf32(n6), t7.distcode = t7.distdyn = new I.Buf32(i), t7.sane = 1, t7.back = -1, N) : U;
                                        }
                                        function o(e2) {
                                          var t7;
                                          return e2 && e2.state ? ((t7 = e2.state).wsize = 0, t7.whave = 0, t7.wnext = 0, a(e2)) : U;
                                        }
                                        function u(e2, t7) {
                                          var r7, n7;
                                          return e2 && e2.state ? (n7 = e2.state, t7 < 0 ? (r7 = 0, t7 = -t7) : (r7 = 1 + (t7 >> 4), t7 < 48 && (t7 &= 15)), t7 && (t7 < 8 || 15 < t7) ? U : (n7.window !== null && n7.wbits !== t7 && (n7.window = null), n7.wrap = r7, n7.wbits = t7, o(e2))) : U;
                                        }
                                        function h(e2, t7) {
                                          var r7, n7;
                                          return e2 ? (n7 = new s(), (e2.state = n7).window = null, (r7 = u(e2, t7)) !== N && (e2.state = null), r7) : U;
                                        }
                                        var f, l6, d = true;
                                        function j(e2) {
                                          if (d) {
                                            var t7;
                                            for (f = new I.Buf32(512), l6 = new I.Buf32(32), t7 = 0; t7 < 144; )
                                              e2.lens[t7++] = 8;
                                            for (; t7 < 256; )
                                              e2.lens[t7++] = 9;
                                            for (; t7 < 280; )
                                              e2.lens[t7++] = 7;
                                            for (; t7 < 288; )
                                              e2.lens[t7++] = 8;
                                            for (R(D, e2.lens, 0, 288, f, 0, e2.work, { bits: 9 }), t7 = 0; t7 < 32; )
                                              e2.lens[t7++] = 5;
                                            R(F, e2.lens, 0, 32, l6, 0, e2.work, { bits: 5 }), d = false;
                                          }
                                          e2.lencode = f, e2.lenbits = 9, e2.distcode = l6, e2.distbits = 5;
                                        }
                                        function Z(e2, t7, r7, n7) {
                                          var i2, s2 = e2.state;
                                          return s2.window === null && (s2.wsize = 1 << s2.wbits, s2.wnext = 0, s2.whave = 0, s2.window = new I.Buf8(s2.wsize)), n7 >= s2.wsize ? (I.arraySet(s2.window, t7, r7 - s2.wsize, s2.wsize, 0), s2.wnext = 0, s2.whave = s2.wsize) : (n7 < (i2 = s2.wsize - s2.wnext) && (i2 = n7), I.arraySet(s2.window, t7, r7 - n7, i2, s2.wnext), (n7 -= i2) ? (I.arraySet(s2.window, t7, r7 - n7, n7, 0), s2.wnext = n7, s2.whave = s2.wsize) : (s2.wnext += i2, s2.wnext === s2.wsize && (s2.wnext = 0), s2.whave < s2.wsize && (s2.whave += i2))), 0;
                                        }
                                        r6.inflateReset = o, r6.inflateReset2 = u, r6.inflateResetKeep = a, r6.inflateInit = function(e2) {
                                          return h(e2, 15);
                                        }, r6.inflateInit2 = h, r6.inflate = function(e2, t7) {
                                          var r7, n7, i2, s2, a2, o2, u2, h2, f2, l7, d2, c, p, m, _, g, v, b, w, y, k, x, S, z, E = 0, C = new I.Buf8(4), A = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
                                          if (!e2 || !e2.state || !e2.output || !e2.input && e2.avail_in !== 0)
                                            return U;
                                          (r7 = e2.state).mode === 12 && (r7.mode = 13), a2 = e2.next_out, i2 = e2.output, u2 = e2.avail_out, s2 = e2.next_in, n7 = e2.input, o2 = e2.avail_in, h2 = r7.hold, f2 = r7.bits, l7 = o2, d2 = u2, x = N;
                                          e:
                                            for (; ; )
                                              switch (r7.mode) {
                                                case P:
                                                  if (r7.wrap === 0) {
                                                    r7.mode = 13;
                                                    break;
                                                  }
                                                  for (; f2 < 16; ) {
                                                    if (o2 === 0)
                                                      break e;
                                                    o2--, h2 += n7[s2++] << f2, f2 += 8;
                                                  }
                                                  if (2 & r7.wrap && h2 === 35615) {
                                                    C[r7.check = 0] = 255 & h2, C[1] = h2 >>> 8 & 255, r7.check = B(r7.check, C, 2, 0), f2 = h2 = 0, r7.mode = 2;
                                                    break;
                                                  }
                                                  if (r7.flags = 0, r7.head && (r7.head.done = false), !(1 & r7.wrap) || (((255 & h2) << 8) + (h2 >> 8)) % 31) {
                                                    e2.msg = "incorrect header check", r7.mode = 30;
                                                    break;
                                                  }
                                                  if ((15 & h2) != 8) {
                                                    e2.msg = "unknown compression method", r7.mode = 30;
                                                    break;
                                                  }
                                                  if (f2 -= 4, k = 8 + (15 & (h2 >>>= 4)), r7.wbits === 0)
                                                    r7.wbits = k;
                                                  else if (k > r7.wbits) {
                                                    e2.msg = "invalid window size", r7.mode = 30;
                                                    break;
                                                  }
                                                  r7.dmax = 1 << k, e2.adler = r7.check = 1, r7.mode = 512 & h2 ? 10 : 12, f2 = h2 = 0;
                                                  break;
                                                case 2:
                                                  for (; f2 < 16; ) {
                                                    if (o2 === 0)
                                                      break e;
                                                    o2--, h2 += n7[s2++] << f2, f2 += 8;
                                                  }
                                                  if (r7.flags = h2, (255 & r7.flags) != 8) {
                                                    e2.msg = "unknown compression method", r7.mode = 30;
                                                    break;
                                                  }
                                                  if (57344 & r7.flags) {
                                                    e2.msg = "unknown header flags set", r7.mode = 30;
                                                    break;
                                                  }
                                                  r7.head && (r7.head.text = h2 >> 8 & 1), 512 & r7.flags && (C[0] = 255 & h2, C[1] = h2 >>> 8 & 255, r7.check = B(r7.check, C, 2, 0)), f2 = h2 = 0, r7.mode = 3;
                                                case 3:
                                                  for (; f2 < 32; ) {
                                                    if (o2 === 0)
                                                      break e;
                                                    o2--, h2 += n7[s2++] << f2, f2 += 8;
                                                  }
                                                  r7.head && (r7.head.time = h2), 512 & r7.flags && (C[0] = 255 & h2, C[1] = h2 >>> 8 & 255, C[2] = h2 >>> 16 & 255, C[3] = h2 >>> 24 & 255, r7.check = B(r7.check, C, 4, 0)), f2 = h2 = 0, r7.mode = 4;
                                                case 4:
                                                  for (; f2 < 16; ) {
                                                    if (o2 === 0)
                                                      break e;
                                                    o2--, h2 += n7[s2++] << f2, f2 += 8;
                                                  }
                                                  r7.head && (r7.head.xflags = 255 & h2, r7.head.os = h2 >> 8), 512 & r7.flags && (C[0] = 255 & h2, C[1] = h2 >>> 8 & 255, r7.check = B(r7.check, C, 2, 0)), f2 = h2 = 0, r7.mode = 5;
                                                case 5:
                                                  if (1024 & r7.flags) {
                                                    for (; f2 < 16; ) {
                                                      if (o2 === 0)
                                                        break e;
                                                      o2--, h2 += n7[s2++] << f2, f2 += 8;
                                                    }
                                                    r7.length = h2, r7.head && (r7.head.extra_len = h2), 512 & r7.flags && (C[0] = 255 & h2, C[1] = h2 >>> 8 & 255, r7.check = B(r7.check, C, 2, 0)), f2 = h2 = 0;
                                                  } else
                                                    r7.head && (r7.head.extra = null);
                                                  r7.mode = 6;
                                                case 6:
                                                  if (1024 & r7.flags && (o2 < (c = r7.length) && (c = o2), c && (r7.head && (k = r7.head.extra_len - r7.length, r7.head.extra || (r7.head.extra = new Array(r7.head.extra_len)), I.arraySet(r7.head.extra, n7, s2, c, k)), 512 & r7.flags && (r7.check = B(r7.check, n7, c, s2)), o2 -= c, s2 += c, r7.length -= c), r7.length))
                                                    break e;
                                                  r7.length = 0, r7.mode = 7;
                                                case 7:
                                                  if (2048 & r7.flags) {
                                                    if (o2 === 0)
                                                      break e;
                                                    for (c = 0; k = n7[s2 + c++], r7.head && k && r7.length < 65536 && (r7.head.name += String.fromCharCode(k)), k && c < o2; )
                                                      ;
                                                    if (512 & r7.flags && (r7.check = B(r7.check, n7, c, s2)), o2 -= c, s2 += c, k)
                                                      break e;
                                                  } else
                                                    r7.head && (r7.head.name = null);
                                                  r7.length = 0, r7.mode = 8;
                                                case 8:
                                                  if (4096 & r7.flags) {
                                                    if (o2 === 0)
                                                      break e;
                                                    for (c = 0; k = n7[s2 + c++], r7.head && k && r7.length < 65536 && (r7.head.comment += String.fromCharCode(k)), k && c < o2; )
                                                      ;
                                                    if (512 & r7.flags && (r7.check = B(r7.check, n7, c, s2)), o2 -= c, s2 += c, k)
                                                      break e;
                                                  } else
                                                    r7.head && (r7.head.comment = null);
                                                  r7.mode = 9;
                                                case 9:
                                                  if (512 & r7.flags) {
                                                    for (; f2 < 16; ) {
                                                      if (o2 === 0)
                                                        break e;
                                                      o2--, h2 += n7[s2++] << f2, f2 += 8;
                                                    }
                                                    if (h2 !== (65535 & r7.check)) {
                                                      e2.msg = "header crc mismatch", r7.mode = 30;
                                                      break;
                                                    }
                                                    f2 = h2 = 0;
                                                  }
                                                  r7.head && (r7.head.hcrc = r7.flags >> 9 & 1, r7.head.done = true), e2.adler = r7.check = 0, r7.mode = 12;
                                                  break;
                                                case 10:
                                                  for (; f2 < 32; ) {
                                                    if (o2 === 0)
                                                      break e;
                                                    o2--, h2 += n7[s2++] << f2, f2 += 8;
                                                  }
                                                  e2.adler = r7.check = L(h2), f2 = h2 = 0, r7.mode = 11;
                                                case 11:
                                                  if (r7.havedict === 0)
                                                    return e2.next_out = a2, e2.avail_out = u2, e2.next_in = s2, e2.avail_in = o2, r7.hold = h2, r7.bits = f2, 2;
                                                  e2.adler = r7.check = 1, r7.mode = 12;
                                                case 12:
                                                  if (t7 === 5 || t7 === 6)
                                                    break e;
                                                case 13:
                                                  if (r7.last) {
                                                    h2 >>>= 7 & f2, f2 -= 7 & f2, r7.mode = 27;
                                                    break;
                                                  }
                                                  for (; f2 < 3; ) {
                                                    if (o2 === 0)
                                                      break e;
                                                    o2--, h2 += n7[s2++] << f2, f2 += 8;
                                                  }
                                                  switch (r7.last = 1 & h2, f2 -= 1, 3 & (h2 >>>= 1)) {
                                                    case 0:
                                                      r7.mode = 14;
                                                      break;
                                                    case 1:
                                                      if (j(r7), r7.mode = 20, t7 !== 6)
                                                        break;
                                                      h2 >>>= 2, f2 -= 2;
                                                      break e;
                                                    case 2:
                                                      r7.mode = 17;
                                                      break;
                                                    case 3:
                                                      e2.msg = "invalid block type", r7.mode = 30;
                                                  }
                                                  h2 >>>= 2, f2 -= 2;
                                                  break;
                                                case 14:
                                                  for (h2 >>>= 7 & f2, f2 -= 7 & f2; f2 < 32; ) {
                                                    if (o2 === 0)
                                                      break e;
                                                    o2--, h2 += n7[s2++] << f2, f2 += 8;
                                                  }
                                                  if ((65535 & h2) != (h2 >>> 16 ^ 65535)) {
                                                    e2.msg = "invalid stored block lengths", r7.mode = 30;
                                                    break;
                                                  }
                                                  if (r7.length = 65535 & h2, f2 = h2 = 0, r7.mode = 15, t7 === 6)
                                                    break e;
                                                case 15:
                                                  r7.mode = 16;
                                                case 16:
                                                  if (c = r7.length) {
                                                    if (o2 < c && (c = o2), u2 < c && (c = u2), c === 0)
                                                      break e;
                                                    I.arraySet(i2, n7, s2, c, a2), o2 -= c, s2 += c, u2 -= c, a2 += c, r7.length -= c;
                                                    break;
                                                  }
                                                  r7.mode = 12;
                                                  break;
                                                case 17:
                                                  for (; f2 < 14; ) {
                                                    if (o2 === 0)
                                                      break e;
                                                    o2--, h2 += n7[s2++] << f2, f2 += 8;
                                                  }
                                                  if (r7.nlen = 257 + (31 & h2), h2 >>>= 5, f2 -= 5, r7.ndist = 1 + (31 & h2), h2 >>>= 5, f2 -= 5, r7.ncode = 4 + (15 & h2), h2 >>>= 4, f2 -= 4, 286 < r7.nlen || 30 < r7.ndist) {
                                                    e2.msg = "too many length or distance symbols", r7.mode = 30;
                                                    break;
                                                  }
                                                  r7.have = 0, r7.mode = 18;
                                                case 18:
                                                  for (; r7.have < r7.ncode; ) {
                                                    for (; f2 < 3; ) {
                                                      if (o2 === 0)
                                                        break e;
                                                      o2--, h2 += n7[s2++] << f2, f2 += 8;
                                                    }
                                                    r7.lens[A[r7.have++]] = 7 & h2, h2 >>>= 3, f2 -= 3;
                                                  }
                                                  for (; r7.have < 19; )
                                                    r7.lens[A[r7.have++]] = 0;
                                                  if (r7.lencode = r7.lendyn, r7.lenbits = 7, S = { bits: r7.lenbits }, x = R(0, r7.lens, 0, 19, r7.lencode, 0, r7.work, S), r7.lenbits = S.bits, x) {
                                                    e2.msg = "invalid code lengths set", r7.mode = 30;
                                                    break;
                                                  }
                                                  r7.have = 0, r7.mode = 19;
                                                case 19:
                                                  for (; r7.have < r7.nlen + r7.ndist; ) {
                                                    for (; g = (E = r7.lencode[h2 & (1 << r7.lenbits) - 1]) >>> 16 & 255, v = 65535 & E, !((_ = E >>> 24) <= f2); ) {
                                                      if (o2 === 0)
                                                        break e;
                                                      o2--, h2 += n7[s2++] << f2, f2 += 8;
                                                    }
                                                    if (v < 16)
                                                      h2 >>>= _, f2 -= _, r7.lens[r7.have++] = v;
                                                    else {
                                                      if (v === 16) {
                                                        for (z = _ + 2; f2 < z; ) {
                                                          if (o2 === 0)
                                                            break e;
                                                          o2--, h2 += n7[s2++] << f2, f2 += 8;
                                                        }
                                                        if (h2 >>>= _, f2 -= _, r7.have === 0) {
                                                          e2.msg = "invalid bit length repeat", r7.mode = 30;
                                                          break;
                                                        }
                                                        k = r7.lens[r7.have - 1], c = 3 + (3 & h2), h2 >>>= 2, f2 -= 2;
                                                      } else if (v === 17) {
                                                        for (z = _ + 3; f2 < z; ) {
                                                          if (o2 === 0)
                                                            break e;
                                                          o2--, h2 += n7[s2++] << f2, f2 += 8;
                                                        }
                                                        f2 -= _, k = 0, c = 3 + (7 & (h2 >>>= _)), h2 >>>= 3, f2 -= 3;
                                                      } else {
                                                        for (z = _ + 7; f2 < z; ) {
                                                          if (o2 === 0)
                                                            break e;
                                                          o2--, h2 += n7[s2++] << f2, f2 += 8;
                                                        }
                                                        f2 -= _, k = 0, c = 11 + (127 & (h2 >>>= _)), h2 >>>= 7, f2 -= 7;
                                                      }
                                                      if (r7.have + c > r7.nlen + r7.ndist) {
                                                        e2.msg = "invalid bit length repeat", r7.mode = 30;
                                                        break;
                                                      }
                                                      for (; c--; )
                                                        r7.lens[r7.have++] = k;
                                                    }
                                                  }
                                                  if (r7.mode === 30)
                                                    break;
                                                  if (r7.lens[256] === 0) {
                                                    e2.msg = "invalid code -- missing end-of-block", r7.mode = 30;
                                                    break;
                                                  }
                                                  if (r7.lenbits = 9, S = { bits: r7.lenbits }, x = R(D, r7.lens, 0, r7.nlen, r7.lencode, 0, r7.work, S), r7.lenbits = S.bits, x) {
                                                    e2.msg = "invalid literal/lengths set", r7.mode = 30;
                                                    break;
                                                  }
                                                  if (r7.distbits = 6, r7.distcode = r7.distdyn, S = { bits: r7.distbits }, x = R(F, r7.lens, r7.nlen, r7.ndist, r7.distcode, 0, r7.work, S), r7.distbits = S.bits, x) {
                                                    e2.msg = "invalid distances set", r7.mode = 30;
                                                    break;
                                                  }
                                                  if (r7.mode = 20, t7 === 6)
                                                    break e;
                                                case 20:
                                                  r7.mode = 21;
                                                case 21:
                                                  if (6 <= o2 && 258 <= u2) {
                                                    e2.next_out = a2, e2.avail_out = u2, e2.next_in = s2, e2.avail_in = o2, r7.hold = h2, r7.bits = f2, T(e2, d2), a2 = e2.next_out, i2 = e2.output, u2 = e2.avail_out, s2 = e2.next_in, n7 = e2.input, o2 = e2.avail_in, h2 = r7.hold, f2 = r7.bits, r7.mode === 12 && (r7.back = -1);
                                                    break;
                                                  }
                                                  for (r7.back = 0; g = (E = r7.lencode[h2 & (1 << r7.lenbits) - 1]) >>> 16 & 255, v = 65535 & E, !((_ = E >>> 24) <= f2); ) {
                                                    if (o2 === 0)
                                                      break e;
                                                    o2--, h2 += n7[s2++] << f2, f2 += 8;
                                                  }
                                                  if (g && (240 & g) == 0) {
                                                    for (b = _, w = g, y = v; g = (E = r7.lencode[y + ((h2 & (1 << b + w) - 1) >> b)]) >>> 16 & 255, v = 65535 & E, !(b + (_ = E >>> 24) <= f2); ) {
                                                      if (o2 === 0)
                                                        break e;
                                                      o2--, h2 += n7[s2++] << f2, f2 += 8;
                                                    }
                                                    h2 >>>= b, f2 -= b, r7.back += b;
                                                  }
                                                  if (h2 >>>= _, f2 -= _, r7.back += _, r7.length = v, g === 0) {
                                                    r7.mode = 26;
                                                    break;
                                                  }
                                                  if (32 & g) {
                                                    r7.back = -1, r7.mode = 12;
                                                    break;
                                                  }
                                                  if (64 & g) {
                                                    e2.msg = "invalid literal/length code", r7.mode = 30;
                                                    break;
                                                  }
                                                  r7.extra = 15 & g, r7.mode = 22;
                                                case 22:
                                                  if (r7.extra) {
                                                    for (z = r7.extra; f2 < z; ) {
                                                      if (o2 === 0)
                                                        break e;
                                                      o2--, h2 += n7[s2++] << f2, f2 += 8;
                                                    }
                                                    r7.length += h2 & (1 << r7.extra) - 1, h2 >>>= r7.extra, f2 -= r7.extra, r7.back += r7.extra;
                                                  }
                                                  r7.was = r7.length, r7.mode = 23;
                                                case 23:
                                                  for (; g = (E = r7.distcode[h2 & (1 << r7.distbits) - 1]) >>> 16 & 255, v = 65535 & E, !((_ = E >>> 24) <= f2); ) {
                                                    if (o2 === 0)
                                                      break e;
                                                    o2--, h2 += n7[s2++] << f2, f2 += 8;
                                                  }
                                                  if ((240 & g) == 0) {
                                                    for (b = _, w = g, y = v; g = (E = r7.distcode[y + ((h2 & (1 << b + w) - 1) >> b)]) >>> 16 & 255, v = 65535 & E, !(b + (_ = E >>> 24) <= f2); ) {
                                                      if (o2 === 0)
                                                        break e;
                                                      o2--, h2 += n7[s2++] << f2, f2 += 8;
                                                    }
                                                    h2 >>>= b, f2 -= b, r7.back += b;
                                                  }
                                                  if (h2 >>>= _, f2 -= _, r7.back += _, 64 & g) {
                                                    e2.msg = "invalid distance code", r7.mode = 30;
                                                    break;
                                                  }
                                                  r7.offset = v, r7.extra = 15 & g, r7.mode = 24;
                                                case 24:
                                                  if (r7.extra) {
                                                    for (z = r7.extra; f2 < z; ) {
                                                      if (o2 === 0)
                                                        break e;
                                                      o2--, h2 += n7[s2++] << f2, f2 += 8;
                                                    }
                                                    r7.offset += h2 & (1 << r7.extra) - 1, h2 >>>= r7.extra, f2 -= r7.extra, r7.back += r7.extra;
                                                  }
                                                  if (r7.offset > r7.dmax) {
                                                    e2.msg = "invalid distance too far back", r7.mode = 30;
                                                    break;
                                                  }
                                                  r7.mode = 25;
                                                case 25:
                                                  if (u2 === 0)
                                                    break e;
                                                  if (c = d2 - u2, r7.offset > c) {
                                                    if ((c = r7.offset - c) > r7.whave && r7.sane) {
                                                      e2.msg = "invalid distance too far back", r7.mode = 30;
                                                      break;
                                                    }
                                                    p = c > r7.wnext ? (c -= r7.wnext, r7.wsize - c) : r7.wnext - c, c > r7.length && (c = r7.length), m = r7.window;
                                                  } else
                                                    m = i2, p = a2 - r7.offset, c = r7.length;
                                                  for (u2 < c && (c = u2), u2 -= c, r7.length -= c; i2[a2++] = m[p++], --c; )
                                                    ;
                                                  r7.length === 0 && (r7.mode = 21);
                                                  break;
                                                case 26:
                                                  if (u2 === 0)
                                                    break e;
                                                  i2[a2++] = r7.length, u2--, r7.mode = 21;
                                                  break;
                                                case 27:
                                                  if (r7.wrap) {
                                                    for (; f2 < 32; ) {
                                                      if (o2 === 0)
                                                        break e;
                                                      o2--, h2 |= n7[s2++] << f2, f2 += 8;
                                                    }
                                                    if (d2 -= u2, e2.total_out += d2, r7.total += d2, d2 && (e2.adler = r7.check = r7.flags ? B(r7.check, i2, d2, a2 - d2) : O(r7.check, i2, d2, a2 - d2)), d2 = u2, (r7.flags ? h2 : L(h2)) !== r7.check) {
                                                      e2.msg = "incorrect data check", r7.mode = 30;
                                                      break;
                                                    }
                                                    f2 = h2 = 0;
                                                  }
                                                  r7.mode = 28;
                                                case 28:
                                                  if (r7.wrap && r7.flags) {
                                                    for (; f2 < 32; ) {
                                                      if (o2 === 0)
                                                        break e;
                                                      o2--, h2 += n7[s2++] << f2, f2 += 8;
                                                    }
                                                    if (h2 !== (4294967295 & r7.total)) {
                                                      e2.msg = "incorrect length check", r7.mode = 30;
                                                      break;
                                                    }
                                                    f2 = h2 = 0;
                                                  }
                                                  r7.mode = 29;
                                                case 29:
                                                  x = 1;
                                                  break e;
                                                case 30:
                                                  x = -3;
                                                  break e;
                                                case 31:
                                                  return -4;
                                                case 32:
                                                default:
                                                  return U;
                                              }
                                          return e2.next_out = a2, e2.avail_out = u2, e2.next_in = s2, e2.avail_in = o2, r7.hold = h2, r7.bits = f2, (r7.wsize || d2 !== e2.avail_out && r7.mode < 30 && (r7.mode < 27 || t7 !== 4)) && Z(e2, e2.output, e2.next_out, d2 - e2.avail_out) ? (r7.mode = 31, -4) : (l7 -= e2.avail_in, d2 -= e2.avail_out, e2.total_in += l7, e2.total_out += d2, r7.total += d2, r7.wrap && d2 && (e2.adler = r7.check = r7.flags ? B(r7.check, i2, d2, e2.next_out - d2) : O(r7.check, i2, d2, e2.next_out - d2)), e2.data_type = r7.bits + (r7.last ? 64 : 0) + (r7.mode === 12 ? 128 : 0) + (r7.mode === 20 || r7.mode === 15 ? 256 : 0), (l7 == 0 && d2 === 0 || t7 === 4) && x === N && (x = -5), x);
                                        }, r6.inflateEnd = function(e2) {
                                          if (!e2 || !e2.state)
                                            return U;
                                          var t7 = e2.state;
                                          return t7.window && (t7.window = null), e2.state = null, N;
                                        }, r6.inflateGetHeader = function(e2, t7) {
                                          var r7;
                                          return e2 && e2.state ? (2 & (r7 = e2.state).wrap) == 0 ? U : ((r7.head = t7).done = false, N) : U;
                                        }, r6.inflateSetDictionary = function(e2, t7) {
                                          var r7, n7 = t7.length;
                                          return e2 && e2.state ? (r7 = e2.state).wrap !== 0 && r7.mode !== 11 ? U : r7.mode === 11 && O(1, t7, n7, 0) !== r7.check ? -3 : Z(e2, t7, n7, n7) ? (r7.mode = 31, -4) : (r7.havedict = 1, N) : U;
                                        }, r6.inflateInfo = "pako inflate (from Nodeca project)";
                                      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, t6, r6) {
                                        "use strict";
                                        var D = e("../utils/common"), F = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], N = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], U = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], P = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
                                        t6.exports = function(e2, t7, r7, n6, i, s, a, o) {
                                          var u, h, f, l6, d, c, p, m, _, g = o.bits, v = 0, b = 0, w = 0, y = 0, k = 0, x = 0, S = 0, z = 0, E = 0, C = 0, A = null, I = 0, O = new D.Buf16(16), B = new D.Buf16(16), T = null, R = 0;
                                          for (v = 0; v <= 15; v++)
                                            O[v] = 0;
                                          for (b = 0; b < n6; b++)
                                            O[t7[r7 + b]]++;
                                          for (k = g, y = 15; 1 <= y && O[y] === 0; y--)
                                            ;
                                          if (y < k && (k = y), y === 0)
                                            return i[s++] = 20971520, i[s++] = 20971520, o.bits = 1, 0;
                                          for (w = 1; w < y && O[w] === 0; w++)
                                            ;
                                          for (k < w && (k = w), v = z = 1; v <= 15; v++)
                                            if (z <<= 1, (z -= O[v]) < 0)
                                              return -1;
                                          if (0 < z && (e2 === 0 || y !== 1))
                                            return -1;
                                          for (B[1] = 0, v = 1; v < 15; v++)
                                            B[v + 1] = B[v] + O[v];
                                          for (b = 0; b < n6; b++)
                                            t7[r7 + b] !== 0 && (a[B[t7[r7 + b]]++] = b);
                                          if (c = e2 === 0 ? (A = T = a, 19) : e2 === 1 ? (A = F, I -= 257, T = N, R -= 257, 256) : (A = U, T = P, -1), v = w, d = s, S = b = C = 0, f = -1, l6 = (E = 1 << (x = k)) - 1, e2 === 1 && 852 < E || e2 === 2 && 592 < E)
                                            return 1;
                                          for (; ; ) {
                                            for (p = v - S, _ = a[b] < c ? (m = 0, a[b]) : a[b] > c ? (m = T[R + a[b]], A[I + a[b]]) : (m = 96, 0), u = 1 << v - S, w = h = 1 << x; i[d + (C >> S) + (h -= u)] = p << 24 | m << 16 | _ | 0, h !== 0; )
                                              ;
                                            for (u = 1 << v - 1; C & u; )
                                              u >>= 1;
                                            if (u !== 0 ? (C &= u - 1, C += u) : C = 0, b++, --O[v] == 0) {
                                              if (v === y)
                                                break;
                                              v = t7[r7 + a[b]];
                                            }
                                            if (k < v && (C & l6) !== f) {
                                              for (S === 0 && (S = k), d += w, z = 1 << (x = v - S); x + S < y && !((z -= O[x + S]) <= 0); )
                                                x++, z <<= 1;
                                              if (E += 1 << x, e2 === 1 && 852 < E || e2 === 2 && 592 < E)
                                                return 1;
                                              i[f = C & l6] = k << 24 | x << 16 | d - s | 0;
                                            }
                                          }
                                          return C !== 0 && (i[d + C] = v - S << 24 | 64 << 16 | 0), o.bits = k, 0;
                                        };
                                      }, { "../utils/common": 41 }], 51: [function(e, t6, r6) {
                                        "use strict";
                                        t6.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
                                      }, {}], 52: [function(e, t6, r6) {
                                        "use strict";
                                        var o = e("../utils/common");
                                        function n6(e2) {
                                          for (var t7 = e2.length; 0 <= --t7; )
                                            e2[t7] = 0;
                                        }
                                        var _ = 15, i = 16, u = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], h = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], a = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], f = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], l6 = new Array(576);
                                        n6(l6);
                                        var d = new Array(60);
                                        n6(d);
                                        var c = new Array(512);
                                        n6(c);
                                        var p = new Array(256);
                                        n6(p);
                                        var m = new Array(29);
                                        n6(m);
                                        var g, v, b, w = new Array(30);
                                        function y(e2, t7, r7, n7, i2) {
                                          this.static_tree = e2, this.extra_bits = t7, this.extra_base = r7, this.elems = n7, this.max_length = i2, this.has_stree = e2 && e2.length;
                                        }
                                        function s(e2, t7) {
                                          this.dyn_tree = e2, this.max_code = 0, this.stat_desc = t7;
                                        }
                                        function k(e2) {
                                          return e2 < 256 ? c[e2] : c[256 + (e2 >>> 7)];
                                        }
                                        function x(e2, t7) {
                                          e2.pending_buf[e2.pending++] = 255 & t7, e2.pending_buf[e2.pending++] = t7 >>> 8 & 255;
                                        }
                                        function S(e2, t7, r7) {
                                          e2.bi_valid > i - r7 ? (e2.bi_buf |= t7 << e2.bi_valid & 65535, x(e2, e2.bi_buf), e2.bi_buf = t7 >> i - e2.bi_valid, e2.bi_valid += r7 - i) : (e2.bi_buf |= t7 << e2.bi_valid & 65535, e2.bi_valid += r7);
                                        }
                                        function z(e2, t7, r7) {
                                          S(e2, r7[2 * t7], r7[2 * t7 + 1]);
                                        }
                                        function E(e2, t7) {
                                          for (var r7 = 0; r7 |= 1 & e2, e2 >>>= 1, r7 <<= 1, 0 < --t7; )
                                            ;
                                          return r7 >>> 1;
                                        }
                                        function C(e2, t7, r7) {
                                          var n7, i2, s2 = new Array(_ + 1), a2 = 0;
                                          for (n7 = 1; n7 <= _; n7++)
                                            s2[n7] = a2 = a2 + r7[n7 - 1] << 1;
                                          for (i2 = 0; i2 <= t7; i2++) {
                                            var o2 = e2[2 * i2 + 1];
                                            o2 !== 0 && (e2[2 * i2] = E(s2[o2]++, o2));
                                          }
                                        }
                                        function A(e2) {
                                          var t7;
                                          for (t7 = 0; t7 < 286; t7++)
                                            e2.dyn_ltree[2 * t7] = 0;
                                          for (t7 = 0; t7 < 30; t7++)
                                            e2.dyn_dtree[2 * t7] = 0;
                                          for (t7 = 0; t7 < 19; t7++)
                                            e2.bl_tree[2 * t7] = 0;
                                          e2.dyn_ltree[512] = 1, e2.opt_len = e2.static_len = 0, e2.last_lit = e2.matches = 0;
                                        }
                                        function I(e2) {
                                          8 < e2.bi_valid ? x(e2, e2.bi_buf) : 0 < e2.bi_valid && (e2.pending_buf[e2.pending++] = e2.bi_buf), e2.bi_buf = 0, e2.bi_valid = 0;
                                        }
                                        function O(e2, t7, r7, n7) {
                                          var i2 = 2 * t7, s2 = 2 * r7;
                                          return e2[i2] < e2[s2] || e2[i2] === e2[s2] && n7[t7] <= n7[r7];
                                        }
                                        function B(e2, t7, r7) {
                                          for (var n7 = e2.heap[r7], i2 = r7 << 1; i2 <= e2.heap_len && (i2 < e2.heap_len && O(t7, e2.heap[i2 + 1], e2.heap[i2], e2.depth) && i2++, !O(t7, n7, e2.heap[i2], e2.depth)); )
                                            e2.heap[r7] = e2.heap[i2], r7 = i2, i2 <<= 1;
                                          e2.heap[r7] = n7;
                                        }
                                        function T(e2, t7, r7) {
                                          var n7, i2, s2, a2, o2 = 0;
                                          if (e2.last_lit !== 0)
                                            for (; n7 = e2.pending_buf[e2.d_buf + 2 * o2] << 8 | e2.pending_buf[e2.d_buf + 2 * o2 + 1], i2 = e2.pending_buf[e2.l_buf + o2], o2++, n7 === 0 ? z(e2, i2, t7) : (z(e2, (s2 = p[i2]) + 256 + 1, t7), (a2 = u[s2]) !== 0 && S(e2, i2 -= m[s2], a2), z(e2, s2 = k(--n7), r7), (a2 = h[s2]) !== 0 && S(e2, n7 -= w[s2], a2)), o2 < e2.last_lit; )
                                              ;
                                          z(e2, 256, t7);
                                        }
                                        function R(e2, t7) {
                                          var r7, n7, i2, s2 = t7.dyn_tree, a2 = t7.stat_desc.static_tree, o2 = t7.stat_desc.has_stree, u2 = t7.stat_desc.elems, h2 = -1;
                                          for (e2.heap_len = 0, e2.heap_max = 573, r7 = 0; r7 < u2; r7++)
                                            s2[2 * r7] !== 0 ? (e2.heap[++e2.heap_len] = h2 = r7, e2.depth[r7] = 0) : s2[2 * r7 + 1] = 0;
                                          for (; e2.heap_len < 2; )
                                            s2[2 * (i2 = e2.heap[++e2.heap_len] = h2 < 2 ? ++h2 : 0)] = 1, e2.depth[i2] = 0, e2.opt_len--, o2 && (e2.static_len -= a2[2 * i2 + 1]);
                                          for (t7.max_code = h2, r7 = e2.heap_len >> 1; 1 <= r7; r7--)
                                            B(e2, s2, r7);
                                          for (i2 = u2; r7 = e2.heap[1], e2.heap[1] = e2.heap[e2.heap_len--], B(e2, s2, 1), n7 = e2.heap[1], e2.heap[--e2.heap_max] = r7, e2.heap[--e2.heap_max] = n7, s2[2 * i2] = s2[2 * r7] + s2[2 * n7], e2.depth[i2] = (e2.depth[r7] >= e2.depth[n7] ? e2.depth[r7] : e2.depth[n7]) + 1, s2[2 * r7 + 1] = s2[2 * n7 + 1] = i2, e2.heap[1] = i2++, B(e2, s2, 1), 2 <= e2.heap_len; )
                                            ;
                                          e2.heap[--e2.heap_max] = e2.heap[1], function(e3, t8) {
                                            var r8, n8, i3, s3, a3, o3, u3 = t8.dyn_tree, h3 = t8.max_code, f2 = t8.stat_desc.static_tree, l7 = t8.stat_desc.has_stree, d2 = t8.stat_desc.extra_bits, c2 = t8.stat_desc.extra_base, p2 = t8.stat_desc.max_length, m2 = 0;
                                            for (s3 = 0; s3 <= _; s3++)
                                              e3.bl_count[s3] = 0;
                                            for (u3[2 * e3.heap[e3.heap_max] + 1] = 0, r8 = e3.heap_max + 1; r8 < 573; r8++)
                                              p2 < (s3 = u3[2 * u3[2 * (n8 = e3.heap[r8]) + 1] + 1] + 1) && (s3 = p2, m2++), u3[2 * n8 + 1] = s3, h3 < n8 || (e3.bl_count[s3]++, a3 = 0, c2 <= n8 && (a3 = d2[n8 - c2]), o3 = u3[2 * n8], e3.opt_len += o3 * (s3 + a3), l7 && (e3.static_len += o3 * (f2[2 * n8 + 1] + a3)));
                                            if (m2 !== 0) {
                                              do {
                                                for (s3 = p2 - 1; e3.bl_count[s3] === 0; )
                                                  s3--;
                                                e3.bl_count[s3]--, e3.bl_count[s3 + 1] += 2, e3.bl_count[p2]--, m2 -= 2;
                                              } while (0 < m2);
                                              for (s3 = p2; s3 !== 0; s3--)
                                                for (n8 = e3.bl_count[s3]; n8 !== 0; )
                                                  h3 < (i3 = e3.heap[--r8]) || (u3[2 * i3 + 1] !== s3 && (e3.opt_len += (s3 - u3[2 * i3 + 1]) * u3[2 * i3], u3[2 * i3 + 1] = s3), n8--);
                                            }
                                          }(e2, t7), C(s2, h2, e2.bl_count);
                                        }
                                        function D(e2, t7, r7) {
                                          var n7, i2, s2 = -1, a2 = t7[1], o2 = 0, u2 = 7, h2 = 4;
                                          for (a2 === 0 && (u2 = 138, h2 = 3), t7[2 * (r7 + 1) + 1] = 65535, n7 = 0; n7 <= r7; n7++)
                                            i2 = a2, a2 = t7[2 * (n7 + 1) + 1], ++o2 < u2 && i2 === a2 || (o2 < h2 ? e2.bl_tree[2 * i2] += o2 : i2 !== 0 ? (i2 !== s2 && e2.bl_tree[2 * i2]++, e2.bl_tree[32]++) : o2 <= 10 ? e2.bl_tree[34]++ : e2.bl_tree[36]++, s2 = i2, h2 = (o2 = 0) === a2 ? (u2 = 138, 3) : i2 === a2 ? (u2 = 6, 3) : (u2 = 7, 4));
                                        }
                                        function F(e2, t7, r7) {
                                          var n7, i2, s2 = -1, a2 = t7[1], o2 = 0, u2 = 7, h2 = 4;
                                          for (a2 === 0 && (u2 = 138, h2 = 3), n7 = 0; n7 <= r7; n7++)
                                            if (i2 = a2, a2 = t7[2 * (n7 + 1) + 1], !(++o2 < u2 && i2 === a2)) {
                                              if (o2 < h2)
                                                for (; z(e2, i2, e2.bl_tree), --o2 != 0; )
                                                  ;
                                              else
                                                i2 !== 0 ? (i2 !== s2 && (z(e2, i2, e2.bl_tree), o2--), z(e2, 16, e2.bl_tree), S(e2, o2 - 3, 2)) : o2 <= 10 ? (z(e2, 17, e2.bl_tree), S(e2, o2 - 3, 3)) : (z(e2, 18, e2.bl_tree), S(e2, o2 - 11, 7));
                                              s2 = i2, h2 = (o2 = 0) === a2 ? (u2 = 138, 3) : i2 === a2 ? (u2 = 6, 3) : (u2 = 7, 4);
                                            }
                                        }
                                        n6(w);
                                        var N = false;
                                        function U(e2, t7, r7, n7) {
                                          var i2, s2, a2;
                                          S(e2, 0 + (n7 ? 1 : 0), 3), s2 = t7, a2 = r7, I(i2 = e2), x(i2, a2), x(i2, ~a2), o.arraySet(i2.pending_buf, i2.window, s2, a2, i2.pending), i2.pending += a2;
                                        }
                                        r6._tr_init = function(e2) {
                                          N || (function() {
                                            var e3, t7, r7, n7, i2, s2 = new Array(_ + 1);
                                            for (n7 = r7 = 0; n7 < 28; n7++)
                                              for (m[n7] = r7, e3 = 0; e3 < 1 << u[n7]; e3++)
                                                p[r7++] = n7;
                                            for (p[r7 - 1] = n7, n7 = i2 = 0; n7 < 16; n7++)
                                              for (w[n7] = i2, e3 = 0; e3 < 1 << h[n7]; e3++)
                                                c[i2++] = n7;
                                            for (i2 >>= 7; n7 < 30; n7++)
                                              for (w[n7] = i2 << 7, e3 = 0; e3 < 1 << h[n7] - 7; e3++)
                                                c[256 + i2++] = n7;
                                            for (t7 = 0; t7 <= _; t7++)
                                              s2[t7] = 0;
                                            for (e3 = 0; e3 <= 143; )
                                              l6[2 * e3 + 1] = 8, e3++, s2[8]++;
                                            for (; e3 <= 255; )
                                              l6[2 * e3 + 1] = 9, e3++, s2[9]++;
                                            for (; e3 <= 279; )
                                              l6[2 * e3 + 1] = 7, e3++, s2[7]++;
                                            for (; e3 <= 287; )
                                              l6[2 * e3 + 1] = 8, e3++, s2[8]++;
                                            for (C(l6, 287, s2), e3 = 0; e3 < 30; e3++)
                                              d[2 * e3 + 1] = 5, d[2 * e3] = E(e3, 5);
                                            g = new y(l6, u, 257, 286, _), v = new y(d, h, 0, 30, _), b = new y(new Array(0), a, 0, 19, 7);
                                          }(), N = true), e2.l_desc = new s(e2.dyn_ltree, g), e2.d_desc = new s(e2.dyn_dtree, v), e2.bl_desc = new s(e2.bl_tree, b), e2.bi_buf = 0, e2.bi_valid = 0, A(e2);
                                        }, r6._tr_stored_block = U, r6._tr_flush_block = function(e2, t7, r7, n7) {
                                          var i2, s2, a2 = 0;
                                          0 < e2.level ? (e2.strm.data_type === 2 && (e2.strm.data_type = function(e3) {
                                            var t8, r8 = 4093624447;
                                            for (t8 = 0; t8 <= 31; t8++, r8 >>>= 1)
                                              if (1 & r8 && e3.dyn_ltree[2 * t8] !== 0)
                                                return 0;
                                            if (e3.dyn_ltree[18] !== 0 || e3.dyn_ltree[20] !== 0 || e3.dyn_ltree[26] !== 0)
                                              return 1;
                                            for (t8 = 32; t8 < 256; t8++)
                                              if (e3.dyn_ltree[2 * t8] !== 0)
                                                return 1;
                                            return 0;
                                          }(e2)), R(e2, e2.l_desc), R(e2, e2.d_desc), a2 = function(e3) {
                                            var t8;
                                            for (D(e3, e3.dyn_ltree, e3.l_desc.max_code), D(e3, e3.dyn_dtree, e3.d_desc.max_code), R(e3, e3.bl_desc), t8 = 18; 3 <= t8 && e3.bl_tree[2 * f[t8] + 1] === 0; t8--)
                                              ;
                                            return e3.opt_len += 3 * (t8 + 1) + 5 + 5 + 4, t8;
                                          }(e2), i2 = e2.opt_len + 3 + 7 >>> 3, (s2 = e2.static_len + 3 + 7 >>> 3) <= i2 && (i2 = s2)) : i2 = s2 = r7 + 5, r7 + 4 <= i2 && t7 !== -1 ? U(e2, t7, r7, n7) : e2.strategy === 4 || s2 === i2 ? (S(e2, 2 + (n7 ? 1 : 0), 3), T(e2, l6, d)) : (S(e2, 4 + (n7 ? 1 : 0), 3), function(e3, t8, r8, n8) {
                                            var i3;
                                            for (S(e3, t8 - 257, 5), S(e3, r8 - 1, 5), S(e3, n8 - 4, 4), i3 = 0; i3 < n8; i3++)
                                              S(e3, e3.bl_tree[2 * f[i3] + 1], 3);
                                            F(e3, e3.dyn_ltree, t8 - 1), F(e3, e3.dyn_dtree, r8 - 1);
                                          }(e2, e2.l_desc.max_code + 1, e2.d_desc.max_code + 1, a2 + 1), T(e2, e2.dyn_ltree, e2.dyn_dtree)), A(e2), n7 && I(e2);
                                        }, r6._tr_tally = function(e2, t7, r7) {
                                          return e2.pending_buf[e2.d_buf + 2 * e2.last_lit] = t7 >>> 8 & 255, e2.pending_buf[e2.d_buf + 2 * e2.last_lit + 1] = 255 & t7, e2.pending_buf[e2.l_buf + e2.last_lit] = 255 & r7, e2.last_lit++, t7 === 0 ? e2.dyn_ltree[2 * r7]++ : (e2.matches++, t7--, e2.dyn_ltree[2 * (p[r7] + 256 + 1)]++, e2.dyn_dtree[2 * k(t7)]++), e2.last_lit === e2.lit_bufsize - 1;
                                        }, r6._tr_align = function(e2) {
                                          var t7;
                                          S(e2, 2, 3), z(e2, 256, l6), (t7 = e2).bi_valid === 16 ? (x(t7, t7.bi_buf), t7.bi_buf = 0, t7.bi_valid = 0) : 8 <= t7.bi_valid && (t7.pending_buf[t7.pending++] = 255 & t7.bi_buf, t7.bi_buf >>= 8, t7.bi_valid -= 8);
                                        };
                                      }, { "../utils/common": 41 }], 53: [function(e, t6, r6) {
                                        "use strict";
                                        t6.exports = function() {
                                          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
                                        };
                                      }, {}], 54: [function(e, t6, r6) {
                                        "use strict";
                                        t6.exports = typeof setImmediate == "function" ? setImmediate : function() {
                                          var e2 = [].slice.apply(arguments);
                                          e2.splice(1, 0, 0), setTimeout.apply(null, e2);
                                        };
                                      }, {}] }, {}, [10])(10);
                                    });
                                  }).call(this, r4 !== void 0 ? r4 : typeof self != "undefined" ? self : typeof window != "undefined" ? window : {});
                                }, {}] }, {}, [1])(1);
                              });
                            }).call(this, r3 !== void 0 ? r3 : typeof self != "undefined" ? self : typeof window != "undefined" ? window : {});
                          }, {}] }, {}, [1])(1);
                        });
                      }).call(this, r2 !== void 0 ? r2 : typeof self != "undefined" ? self : typeof window != "undefined" ? window : {});
                    }, {}] }, {}, [1])(1);
                  });
                }).call(this, r !== void 0 ? r : typeof self != "undefined" ? self : typeof window != "undefined" ? window : {});
              }, {}] }, {}, [1])(1);
            });
          }).call(this, typeof global != "undefined" ? global : typeof self != "undefined" ? self : typeof window != "undefined" ? window : {});
        }, {}] }, {}, [1])(1);
      });
    }
  });

  // src/main.ts
  var import_ffn_parser4 = __toModule(require_lib());

  // src/api/Api.ts
  var import_ffn_parser = __toModule(require_lib());

  // src/util/environment.ts
  var Page;
  (function(Page2) {
    Page2[Page2["Other"] = 0] = "Other";
    Page2[Page2["User"] = 1] = "User";
    Page2[Page2["Alerts"] = 2] = "Alerts";
    Page2[Page2["Favorites"] = 3] = "Favorites";
    Page2[Page2["Story"] = 4] = "Story";
    Page2[Page2["Chapter"] = 5] = "Chapter";
    Page2[Page2["OAuth2"] = 6] = "OAuth2";
    Page2[Page2["StoryList"] = 7] = "StoryList";
    Page2[Page2["UniverseList"] = 8] = "UniverseList";
    Page2[Page2["CommunityList"] = 9] = "CommunityList";
  })(Page || (Page = {}));
  function getPage(location) {
    if (location.pathname.indexOf("/u/") === 0) {
      return 1;
    }
    if (location.pathname.indexOf("/alert/story.php") === 0) {
      return 2;
    }
    if (location.pathname.indexOf("/favorites/story.php") === 0) {
      return 3;
    }
    if (location.pathname.match(/^\/s\/\d+\/?$/i)) {
      return 4;
    }
    if (location.pathname.indexOf("/s/") === 0) {
      return 5;
    }
    if (location.pathname.indexOf("/ffe-oauth2-return") === 0) {
      return 6;
    }
    if (location.pathname.match(/^\/(?:anime|book|cartoon|comic|game|misc|play|movie|tv)\/.+$/i) || location.pathname.match(/^\/[^/]+[-_]Crossovers\//i) || location.pathname.indexOf("/community/") === 0) {
      return 7;
    }
    if (location.pathname.match(/^\/(crossovers\/)?(?:anime|book|cartoon|comic|game|misc|play|movie|tv)\/?$/i) || location.pathname.match(/^\/crossovers\/(.*?)\/(\d+)\/?$/i)) {
      return 8;
    }
    if (location.pathname.match(/^\/communities\/(?:anime|book|cartoon|comic|game|misc|play|movie|tv|general)\/([\w\d]+)/i)) {
      return 9;
    }
    return 0;
  }
  var environment = {
    currentUserId: typeof userid === "undefined" ? void 0 : userid,
    currentUserName: typeof XUNAME === "undefined" || XUNAME === false ? void 0 : XUNAME,
    currentStoryId: typeof storyid === "undefined" ? void 0 : storyid,
    currentStoryTitle: typeof title === "undefined" ? void 0 : decodeURIComponent(title),
    currentStoryTextId: typeof storytextid === "undefined" ? void 0 : storytextid,
    currentChapterId: typeof chapter === "undefined" ? void 0 : chapter,
    currentPageType: getPage(window.location),
    validRatings: typeof array_censors === "undefined" ? [] : array_censors.slice(1),
    validGenres: typeof array_genres === "undefined" ? [] : array_genres.slice(1),
    validLanguages: typeof array_languages === "undefined" ? [] : array_languages.slice(1),
    validStatus: typeof array_status === "undefined" ? [] : array_status.slice(1)
  };

  // src/utils.ts
  function parseGetParams(url) {
    try {
      const params = new URL(url).search.substr(1).split("&");
      const result = {};
      for (const param of params) {
        const parts = param.split("=");
        const key = decodeURIComponent(parts[0]);
        result[key] = parts.length > 1 ? decodeURIComponent(parts[1]) : true;
      }
      return result;
    } catch (e) {
      console.error(e);
      return {};
    }
  }

  // src/api/Api.ts
  var Api = class {
    constructor(requestManager) {
      this.requestManager = requestManager;
    }
    async getStoryAlerts() {
      if (this.alerts == null) {
        this.alerts = (async () => {
          const fragments = await this.getMultiPage("/alert/story.php");
          const result = [];
          await Promise.all(fragments.map(async (fragment) => {
            const follows = await (0, import_ffn_parser.parseFollows)(fragment);
            if (follows) {
              result.push(...follows);
            }
          }));
          return result;
        })();
      }
      return this.alerts;
    }
    async getStoryFavorites() {
      if (this.favorites == null) {
        this.favorites = (async () => {
          const fragments = await this.getMultiPage("/favorites/story.php");
          const result = [];
          await Promise.all(fragments.map(async (fragment) => {
            const follows = await (0, import_ffn_parser.parseFollows)(fragment);
            if (follows) {
              result.push(...follows);
            }
          }));
          return result;
        })();
      }
      return this.favorites;
    }
    async getStoryData(id) {
      const body = await this.get(`/s/${id}`);
      const template = document.createElement("template");
      template.innerHTML = body;
      return (0, import_ffn_parser.parseStory)(template.content);
    }
    async getChapterWordCount(storyId, chapterId) {
      const body = await this.get(`/s/${storyId}/${chapterId}`);
      const template = document.createElement("template");
      template.innerHTML = body;
      return template.content.getElementById("storytext")?.textContent?.trim()?.split(/\s+/)?.length ?? 0;
    }
    async addStoryAlert(id) {
      await this.post("/api/ajax_subs.php", {
        storyid: `${id}`,
        userid: `${environment.currentUserId}`,
        storyalert: "1"
      }, "json");
    }
    async removeStoryAlert(id) {
      await this.post("/alert/story.php", {
        action: "remove-multi",
        "rids[]": `${id}`
      }, "html");
    }
    async addStoryFavorite(id) {
      await this.post("/api/ajax_subs.php", {
        storyid: `${id}`,
        userid: `${environment.currentUserId}`,
        favstory: "1"
      }, "json");
    }
    async removeStoryFavorite(id) {
      await this.post("/favorites/story.php", {
        action: "remove-multi",
        "rids[]": `${id}`
      }, "html");
    }
    async get(url) {
      const response = await this.requestManager.fetch(url);
      return response.text();
    }
    async getMultiPage(url) {
      const body = await this.get(url);
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
        result.push(this.get(`${url}?p=${i}`).then((nextBody) => {
          const nextTemplate = document.createElement("template");
          nextTemplate.innerHTML = nextBody;
          return nextTemplate.content;
        }));
      }
      return Promise.all(result);
    }
    async post(url, data, expect) {
      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
      }
      const response = await this.requestManager.fetch(url, {
        method: "POST",
        body: formData,
        referrer: url
      });
      if (expect === "json") {
        const json = await response.json();
        if (json.error) {
          throw new Error(json.error_msg);
        }
        return json;
      }
      const template = document.createElement("template");
      template.innerHTML = await response.text();
      const err = template.content.querySelector(".gui_error");
      if (err) {
        throw new Error(err.textContent ?? void 0);
      }
      const msg = template.content.querySelector(".gui_success");
      if (msg) {
        return {
          payload_type: "html",
          payload_data: msg.innerHTML
        };
      }
      return void 0;
    }
  };
  var Api_default = Api;

  // src/api/Chapter.ts
  var Chapter = class {
    constructor(storyId, data, valueManager) {
      this.storyId = storyId;
      this.id = data.id;
      this.title = data.title;
      this.words = valueManager.getWordCountValue(storyId, data.id);
      this.read = valueManager.getChapterReadValue(storyId, data.id);
    }
  };
  var Chapter_default = Chapter;

  // src/api/request-manager/NextEvent.ts
  var _NextEvent = class extends Event {
    constructor(requestId) {
      super(_NextEvent.type);
      this.requestId = requestId;
    }
  };
  var NextEvent = _NextEvent;
  NextEvent.type = "next";
  var NextEvent_default = NextEvent;

  // src/api/request-manager/RequestManager.ts
  var DownloadManager = class extends EventTarget {
    constructor() {
      super(...arguments);
      this.maxParallel = 4;
      this.running = 0;
      this.waitUntil = 0;
      this.requestCounter = 1;
    }
    async toGMRequest(request) {
      const gmRequest = {
        method: request.method,
        url: request.url,
        headers: {},
        responseType: "blob",
        data: await request.text()
      };
      gmRequest.headers.Referer = request.referrer;
      request.headers.forEach((value, key) => {
        gmRequest.headers[key] = value;
      });
      return gmRequest;
    }
    async toResponse(gmResponse) {
      return new Response(gmResponse.response, {
        status: gmResponse.status,
        statusText: gmResponse.statusText,
        headers: gmResponse.responseHeaders.split("\n").filter((line) => line).map((line) => {
          const colon = line.indexOf(":");
          return [line.substr(0, colon), line.substr(colon + 1).trim()];
        })
      });
    }
    canBegin() {
      return Date.now() >= this.waitUntil && this.running < this.maxParallel;
    }
    async doFetch(request) {
      const gmRequest = await this.toGMRequest(request);
      const gmResponse = await GM.xmlHttpRequest(gmRequest);
      const response = await this.toResponse(gmResponse);
      console.debug("%c%s %c%s %c%d", "color: blue", request.method, "color: inherit", request.url, "color: blue", response.status);
      return response;
    }
    async fetch(input, init) {
      const requestId = this.requestCounter;
      this.requestCounter += 1;
      return new Promise((resolve, reject) => {
        const handler = async () => {
          if (!this.canBegin()) {
            return;
          }
          this.running += 1;
          this.removeEventListener(NextEvent_default.type, handler);
          try {
            const response = await this.doFetch(new Request(input, init));
            if (response.status === 429) {
              const retryAfter = response.headers.get("Retry-After");
              const waitSeconds = (retryAfter && !Number.isNaN(+retryAfter) && +retryAfter || 30) + 1;
              console.warn("Rate limited! Waiting %ss.", waitSeconds);
              this.waitUntil = Date.now() + waitSeconds;
              this.addEventListener(NextEvent_default.type, handler);
              setTimeout(() => {
                this.dispatchEvent(new NextEvent_default(0));
              }, waitSeconds * 1e3);
            } else {
              resolve(response);
            }
          } catch (err) {
            reject(err);
          } finally {
            this.running -= 1;
            this.dispatchEvent(new NextEvent_default(requestId));
          }
        };
        this.addEventListener(NextEvent_default.type, handler);
        handler();
      });
    }
  };
  var RequestManager_default = DownloadManager;

  // src/api/links.ts
  var SortOption;
  (function(SortOption2) {
    SortOption2[SortOption2["UpdateDate"] = 1] = "UpdateDate";
    SortOption2[SortOption2["PublishDate"] = 2] = "PublishDate";
    SortOption2[SortOption2["Reviews"] = 3] = "Reviews";
    SortOption2[SortOption2["Favorites"] = 4] = "Favorites";
    SortOption2[SortOption2["Follows"] = 5] = "Follows";
  })(SortOption || (SortOption = {}));
  var TimeRangeOption;
  (function(TimeRangeOption2) {
    TimeRangeOption2[TimeRangeOption2["All"] = 0] = "All";
    TimeRangeOption2[TimeRangeOption2["Update24h"] = 1] = "Update24h";
    TimeRangeOption2[TimeRangeOption2["Update7d"] = 2] = "Update7d";
    TimeRangeOption2[TimeRangeOption2["Update1m"] = 3] = "Update1m";
    TimeRangeOption2[TimeRangeOption2["Update6m"] = 4] = "Update6m";
    TimeRangeOption2[TimeRangeOption2["Update1y"] = 5] = "Update1y";
    TimeRangeOption2[TimeRangeOption2["Publish24h"] = 11] = "Publish24h";
    TimeRangeOption2[TimeRangeOption2["Publish7d"] = 12] = "Publish7d";
    TimeRangeOption2[TimeRangeOption2["Publish1m"] = 13] = "Publish1m";
    TimeRangeOption2[TimeRangeOption2["Publish6m"] = 14] = "Publish6m";
    TimeRangeOption2[TimeRangeOption2["Publish1y"] = 15] = "Publish1y";
  })(TimeRangeOption || (TimeRangeOption = {}));
  var GenreOption;
  (function(GenreOption2) {
    GenreOption2[GenreOption2["All"] = 0] = "All";
    GenreOption2[GenreOption2["Adventure"] = 6] = "Adventure";
    GenreOption2[GenreOption2["Angst"] = 10] = "Angst";
    GenreOption2[GenreOption2["Drama"] = 4] = "Drama";
    GenreOption2[GenreOption2["Fantasy"] = 14] = "Fantasy";
    GenreOption2[GenreOption2["Friendship"] = 21] = "Friendship";
    GenreOption2[GenreOption2["General"] = 1] = "General";
    GenreOption2[GenreOption2["Humor"] = 3] = "Humor";
    GenreOption2[GenreOption2["HurtComfort"] = 20] = "HurtComfort";
    GenreOption2[GenreOption2["Mystery"] = 7] = "Mystery";
    GenreOption2[GenreOption2["Romance"] = 2] = "Romance";
    GenreOption2[GenreOption2["SciFi"] = 13] = "SciFi";
    GenreOption2[GenreOption2["Supernatural"] = 11] = "Supernatural";
    GenreOption2[GenreOption2["Suspense"] = 12] = "Suspense";
    GenreOption2[GenreOption2["Tragedy"] = 16] = "Tragedy";
  })(GenreOption || (GenreOption = {}));
  var RatingOption;
  (function(RatingOption2) {
    RatingOption2[RatingOption2["All"] = 10] = "All";
    RatingOption2[RatingOption2["KT"] = 103] = "KT";
    RatingOption2[RatingOption2["KKp"] = 102] = "KKp";
    RatingOption2[RatingOption2["K"] = 1] = "K";
    RatingOption2[RatingOption2["Kp"] = 2] = "Kp";
    RatingOption2[RatingOption2["T"] = 3] = "T";
    RatingOption2[RatingOption2["M"] = 4] = "M";
  })(RatingOption || (RatingOption = {}));
  var WordCountOption;
  (function(WordCountOption2) {
    WordCountOption2[WordCountOption2["All"] = 0] = "All";
    WordCountOption2[WordCountOption2["Lt1k"] = 11] = "Lt1k";
    WordCountOption2[WordCountOption2["Lt5k"] = 51] = "Lt5k";
    WordCountOption2[WordCountOption2["Gt1k"] = 1] = "Gt1k";
    WordCountOption2[WordCountOption2["Gt5k"] = 5] = "Gt5k";
    WordCountOption2[WordCountOption2["Gt10k"] = 10] = "Gt10k";
    WordCountOption2[WordCountOption2["Gt20k"] = 20] = "Gt20k";
    WordCountOption2[WordCountOption2["Gt40k"] = 40] = "Gt40k";
    WordCountOption2[WordCountOption2["Gt60k"] = 60] = "Gt60k";
    WordCountOption2[WordCountOption2["Gt100k"] = 100] = "Gt100k";
  })(WordCountOption || (WordCountOption = {}));
  var StatusOption;
  (function(StatusOption2) {
    StatusOption2[StatusOption2["All"] = 0] = "All";
    StatusOption2[StatusOption2["InProgress"] = 1] = "InProgress";
    StatusOption2[StatusOption2["Complete"] = 2] = "Complete";
  })(StatusOption || (StatusOption = {}));
  var FFN_BASE_URL = "//fanfiction.net";
  function slug(str) {
    return str.replace(/\W+/g, "-");
  }
  function createChapterLink(story, chapter2) {
    let link = `${FFN_BASE_URL}/s/${typeof story === "number" ? story : story.id}/${typeof chapter2 === "number" ? chapter2 : chapter2.id}`;
    if (typeof story !== "number") {
      link += `/${slug(story.title)}`;
      if (typeof chapter2 !== "number") {
        link += `/${slug(chapter2.title)}`;
      }
    }
    return link;
  }

  // src/api/Story.ts
  var Story = class {
    constructor(data, valueManager) {
      this.id = data.id;
      this.title = data.title;
      this.description = data.description;
      this.chapters = data.chapters ? data.chapters.map((chapter2) => new Chapter_default(data.id, chapter2, valueManager)) : [];
      this.imageUrl = data.imageUrl;
      this.imageOriginalUrl = data.imageUrl;
      this.favorites = data.favorites;
      this.follows = data.follows;
      this.reviews = data.reviews;
      this.genre = data.genre;
      this.language = data.language;
      this.published = data.published instanceof Date ? data.published : new Date(data.published);
      this.updated = data.updated == null || data.updated instanceof Date ? data.updated : new Date(data.updated);
      this.rating = data.rating;
      this.words = data.words;
      this.characters = data.characters;
      this.status = data.status;
      this.universes = data.universes;
      this.author = {
        id: data.author.id,
        name: data.author.name
      };
      this.alert = valueManager.getAlertValue(data.id);
      this.favorite = valueManager.getFavoriteValue(data.id);
    }
    async isRead() {
      const read = await Promise.all(this.chapters.map((chapter2) => chapter2.read.get()));
      return read.every((r) => r);
    }
    async setRead(read) {
      await Promise.all(this.chapters.map((chapter2) => chapter2.read.set(read)));
    }
  };
  var Story_default = Story;

  // src/api/SmartValue.ts
  function isSmartValue(value) {
    if (value == null || typeof value !== "object") {
      return false;
    }
    return ["get", "set", "subscribe", "unsubscribe", "dispose", "update"].every((key) => typeof value?.[key] === "function");
  }
  var SmartValueBase = class {
    constructor(name, getter, setter) {
      this.name = name;
      this.getter = getter;
      this.setter = setter;
      this.subscribers = {};
    }
    async get() {
      let value = await this.getCached();
      if (value == null && this.getter) {
        value = await this.getter();
        await this.setCached(value);
      }
      return value;
    }
    async set(value) {
      const saved = await this.getCached();
      if (saved === value) {
        await this.setCached(value);
        return;
      }
      if (this.setter) {
        await this.setter(value);
      } else if (this.getter) {
        throw new Error("This value cannot be set.");
      }
      await this.setCached(value);
      await this.trigger(value);
    }
    subscribe(callback) {
      const key = Symbol("smart-value-key");
      this.subscribers[key] = callback;
      return key;
    }
    unsubscribe(key) {
      delete this.subscribers[key];
    }
    dispose() {
      this.subscribers = {};
    }
    async update(value) {
      const saved = await this.getCached();
      await this.setCached(value);
      if (saved !== value) {
        await this.trigger(value);
      }
    }
    async trigger(value) {
      await Promise.all(Object.getOwnPropertySymbols(this.subscribers).map((sym) => this.subscribers[sym](value)).filter((promise) => promise && promise.then));
    }
  };
  var SmartValueLocal = class extends SmartValueBase {
    constructor(name, storage, getter, setter) {
      super(name, getter, setter);
      this.name = name;
      this.storage = storage;
      this.getter = getter;
      this.setter = setter;
    }
    async getCached() {
      const data = this.storage.getItem(this.name);
      if (!data) {
        return void 0;
      }
      try {
        return JSON.parse(data);
      } catch (e) {
        console.warn("Malformed SmartValueLocal entry with key %s deleted", this.name);
        GM.deleteValue(this.name);
        return void 0;
      }
    }
    async setCached(value) {
      const data = JSON.stringify(value);
      this.storage.setItem(this.name, data);
      this.storage.setItem(`${this.name}+timestamp`, `${new Date().getTime()}`);
    }
  };
  var SmartValueRoaming = class extends SmartValueBase {
    constructor(name, getter, setter, synchronizer) {
      super(name, getter, setter);
      this.name = name;
      this.getter = getter;
      this.setter = setter;
      this.synchronizer = synchronizer;
      this.token = void 0;
      if (typeof GM_addValueChangeListener !== "undefined") {
        this.token = GM_addValueChangeListener(name, async (k, o, value, remote) => {
          if (remote) {
            await this.trigger(JSON.parse(value));
          }
        });
      }
    }
    async set(value) {
      await super.set(value);
      if (this.synchronizer) {
        await this.synchronizer.synchronize();
      }
    }
    dispose() {
      super.dispose();
      if (!this.token) {
        return;
      }
      if (typeof GM_removeValueChangeListener !== "undefined") {
        GM_removeValueChangeListener(this.token);
      }
      this.token = void 0;
    }
    async getCached() {
      const data = await GM.getValue(this.name);
      if (!data) {
        return void 0;
      }
      try {
        return JSON.parse(data);
      } catch (e) {
        console.warn("Malformed SmartValueRoaming entry with key %s deleted", this.name);
        GM.deleteValue(this.name);
        return void 0;
      }
    }
    async setCached(value) {
      await GM.setValue(this.name, JSON.stringify(value));
      await GM.setValue(`${this.name}+timestamp`, new Date().getTime());
    }
  };

  // src/api/ValueContainer.ts
  var CacheName = class {
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
  };
  var ValueContainer = class {
    constructor(storage, api, synchronizer) {
      this.storage = storage;
      this.api = api;
      this.synchronizer = synchronizer;
      this.instances = {};
      window.addEventListener("storage", async (event) => {
        const value = this.instances[event.key];
        if (!value) {
          return;
        }
        await value.trigger(JSON.parse(event.newValue));
      });
      synchronizer.onValueUpdate(async (key, value) => {
        const instance = this.instances[key];
        if (!instance) {
          await GM.setValue(key, JSON.stringify(value));
          await GM.setValue(`${key}+timestamp`, new Date().getTime());
          return;
        }
        await instance.update(value);
      });
    }
    async getStory(id) {
      const storyData = await this.getStoryValue(id).get();
      if (!storyData) {
        return void 0;
      }
      return new Story_default(storyData, this);
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
        this.instances[key] = new SmartValueLocal(key, this.storage, async () => {
          const alerts = await this.api.getStoryAlerts();
          await this.followedStoryDiff(CacheName.isStoryAlertKey, alerts, this.getAlertValue);
          return !!alerts.find((alert) => alert.id === id);
        }, async (alert) => {
          if (alert) {
            await this.api.addStoryAlert(id);
          } else {
            await this.api.removeStoryAlert(id);
          }
        });
      }
      return this.instances[key];
    }
    getFavoriteValue(id) {
      const key = CacheName.storyFavorite(id);
      if (!this.instances[key]) {
        this.instances[key] = new SmartValueLocal(key, this.storage, async () => {
          const favorites = await this.api.getStoryFavorites();
          await this.followedStoryDiff(CacheName.isStoryFavoriteKey, favorites, this.getFavoriteValue);
          return !!favorites.find((favorite) => favorite.id === id);
        }, async (favorite) => {
          if (favorite) {
            await this.api.addStoryFavorite(id);
          } else {
            await this.api.removeStoryFavorite(id);
          }
        });
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
        this.instances[key] = new SmartValueRoaming(key, void 0, void 0, this.synchronizer);
      }
      return this.instances[key];
    }
    async followedStoryDiff(matchFn, updated, valueGetter) {
      const visited = new Set();
      await Promise.all(updated.map(async (followed) => {
        const value = valueGetter.call(this, followed.id);
        visited.add(value.name);
        await value.update(true);
      }));
      const current = Object.keys(this.instances).filter(matchFn).map((key) => this.instances[key]);
      await Promise.all(current.map(async (value) => {
        if (!visited.has(value.name)) {
          await value.update(false);
        }
      }));
    }
  };
  var ValueContainer_default = ValueContainer;

  // src/jsx/ref.ts
  function isReference(ref) {
    return typeof ref?.callback === "function";
  }
  function useRef(callback) {
    return { callback };
  }

  // src/jsx/render.ts
  function render(tag, props, ...children) {
    const refCallbacks = [];
    let element;
    if (typeof tag === "string") {
      element = document.createElement(tag);
      for (const [name, value] of Object.entries(props ?? {})) {
        if (name === "ref") {
          if (isReference(value)) {
            refCallbacks.push(value.callback);
          }
        } else if (typeof value === "function") {
          element[name] = value;
        } else if (value === true) {
          element.setAttribute(name, name);
        } else if (value !== false && value != null) {
          element.setAttribute(name, value.toString());
        }
      }
    } else {
      element = tag(props);
    }
    if (element instanceof Element) {
      const append = (child) => {
        if (child == null || typeof child === "boolean") {
          return;
        }
        if (Array.isArray(child)) {
          child.forEach(append);
        } else if (isSmartValue(child)) {
          const textElement = document.createTextNode("");
          child.get().then((text) => {
            textElement.textContent = typeof text === "number" ? text.toLocaleString("en") : text ?? null;
          });
          child.subscribe((text) => {
            textElement.textContent = typeof text === "number" ? text.toLocaleString("en") : text ?? null;
          });
          element.appendChild(textElement);
        } else {
          element.appendChild(typeof child === "string" || typeof child === "number" || child.nodeType == null ? document.createTextNode(child.toString()) : child);
        }
      };
      children.forEach(append);
    }
    refCallbacks.forEach((callback) => callback(element));
    return element;
  }

  // src/enhance/components/Button/Button.tsx
  function Button({ class: className, text, active, onClick, bind, ref }) {
    const element = /* @__PURE__ */ render("span", {
      class: `btn ${className}`
    }, text);
    if (onClick) {
      element.addEventListener("click", onClick);
    }
    if (active) {
      element.classList.add("ffe-active");
    }
    if (bind) {
      bind.subscribe((act) => element.classList.toggle("ffe-active", act));
      bind.get().then((act) => element.classList.toggle("ffe-active", act));
      element.addEventListener("click", async () => {
        await bind?.set(!element.classList.contains("ffe-active"));
      });
    }
    if (ref) {
      ref.callback(element);
    }
    return element;
  }

  // src/jsx/valueRef.ts
  function useValueRef(initial) {
    const ref = useRef((v) => {
      ref.current = v;
    });
    ref.current = initial;
    return ref;
  }

  // gm-css:src/enhance/components/CheckBox/CheckBox.css
  GM_addStyle(`.ffe-checkbox {
	align-items: center;
	display: flex;
	flex-flow: column;
	float: left;
	height: 2em;
	justify-content: center;
	margin-right: 18px;
}

.ffe-checkbox label {
	background-color: #bbb;
	border-radius: 4px;
	height: 16px;
	width: 16px;
}

.ffe-checkbox label:hover {
	background-color: #888;
}

.ffe-checkbox input:checked ~ label {
	background-color: #0f37a0;
}

.ffe-checkbox input:checked ~ label:before {
	color: white;
	content: "\u2713";
	display: block;
	font-size: 1.2em;
	margin-top: -3px;
	padding-right: 2px;
	text-align: right;
}

.ffe-checkbox input {
	display: none;
}
`);

  // src/enhance/components/CheckBox/CheckBox.tsx
  function CheckBox({ bind }) {
    const id = `ffe-check-${parseInt(`${Math.random() * 1e8}`, 10)}`;
    const element = /* @__PURE__ */ render("span", {
      class: "ffe-checkbox"
    }, /* @__PURE__ */ render("input", {
      type: "checkbox",
      id
    }), /* @__PURE__ */ render("label", {
      for: id
    }));
    const apply = (value) => {
      element.firstElementChild.checked = value ?? false;
    };
    bind.subscribe(apply);
    bind.get().then(apply);
    element.firstElementChild?.addEventListener("change", async () => {
      await bind.set(element.firstElementChild.checked);
    });
    return element;
  }

  // gm-css:src/enhance/components/ChapterList/ChapterList.css
  GM_addStyle(`.ffe-cl-container {
	margin-bottom: 50px;
	padding: 20px;
}

.ffe-cl ol {
	border-top: 1px solid #cdcdcd;
	list-style-type: none;
	margin: 0;
}

.ffe-cl-chapter {
	background-color: #f6f7ee;
	border-bottom: 1px solid #cdcdcd;
	font-size: 1.1em;
	line-height: 2em;
	padding: 4px 20px;
}

.ffe-cl-words {
	color: #555;
	float: right;
	font-size: .9em;
}

.ffe-cl-collapsed {
	text-align: center;
}
`);

  // src/enhance/components/ChapterList/ChapterList.tsx
  function hideLongChapterList(list) {
    const elements = Array.from(list.children);
    const isRead = (e) => e.firstElementChild?.firstElementChild?.checked ?? false;
    let currentBlockIsRead = isRead(elements[0]);
    let currentBlockCount = 0;
    for (let i = 0; i < elements.length; i++) {
      const read = isRead(elements[i]);
      if (read === currentBlockIsRead) {
        currentBlockCount += 1;
        continue;
      }
      if (!currentBlockIsRead && currentBlockCount < 5) {
        currentBlockIsRead = read;
        currentBlockCount = 1;
        continue;
      }
      let off = 0;
      if (currentBlockIsRead) {
        elements.slice(i - currentBlockCount, i).forEach((element) => {
          element.style.display = "none";
        });
      } else {
        elements.slice(i - currentBlockCount + 2, i - 2).forEach((element) => {
          element.style.display = "none";
        });
        off = 2;
      }
      const showLink = document.createElement("a");
      showLink.style.cursor = "pointer";
      showLink.textContent = `Show ${currentBlockCount - off * 2} hidden chapters`;
      showLink.addEventListener("click", () => {
        for (let j = 0; j < list.children.length; j++) {
          const element = list.children.item(j);
          if (element.classList.contains("ffe-cl-collapsed")) {
            element.style.display = "none";
          } else {
            element.style.display = "block";
          }
        }
      });
      const showLinkContainer = document.createElement("li");
      showLinkContainer.classList.add("ffe-cl-chapter", "ffe-cl-collapsed");
      showLinkContainer.appendChild(showLink);
      elements[0].parentElement?.insertBefore(showLinkContainer, elements[i - off]);
      currentBlockIsRead = read;
      currentBlockCount = 1;
    }
    if (currentBlockCount > 6) {
      elements.slice(elements.length - currentBlockCount + 2, elements.length - 3).forEach((element) => {
        element.style.display = "none";
      });
      const showLinkContainer = /* @__PURE__ */ render("li", {
        class: "ffe-cl-chapter ffe-cl-collapsed"
      }, /* @__PURE__ */ render("a", {
        style: "cursor: pointer;",
        onclick: () => {
          for (let j = 0; j < list.children.length; j++) {
            const element = list.children.item(j);
            if (element.classList.contains("ffe-cl-collapsed")) {
              element.style.display = "none";
            } else {
              element.style.display = "block";
            }
          }
        }
      }, "Show ", currentBlockCount - 5, " hidden chapters"));
      elements[0].parentElement?.insertBefore(showLinkContainer, elements[elements.length - 3]);
    }
  }
  function ChapterList({ story }) {
    const ref = useRef((list) => {
      setTimeout(() => {
        hideLongChapterList(list);
      }, 5);
    });
    return /* @__PURE__ */ render("div", {
      class: "ffe-cl-container"
    }, /* @__PURE__ */ render("div", {
      class: "ffe-cl"
    }, /* @__PURE__ */ render("ol", {
      ref
    }, story.chapters.map((chapter2) => /* @__PURE__ */ render("li", {
      class: "ffe-cl-chapter"
    }, /* @__PURE__ */ render(CheckBox, {
      bind: chapter2.read
    }), /* @__PURE__ */ render("span", {
      class: "ffe-cl-chapter-title"
    }, /* @__PURE__ */ render("a", {
      href: `/s/${story.id}/${chapter2.id}`
    }, chapter2.title)), /* @__PURE__ */ render("span", {
      class: "ffe-cl-words"
    }, /* @__PURE__ */ render("b", null, chapter2.words), " words"))))));
  }

  // gm-css:src/enhance/components/Rating/Rating.css
  GM_addStyle(`.ffe-rating {
	background: gray;
	padding: 3px 5px;
	color: #fff !important;
	border: 1px solid rgba(0, 0, 0, 0.2);
	text-shadow: -1px -1px rgba(0, 0, 0, 0.2);
	border-radius: 4px;
	margin-right: 5px;
	vertical-align: 2px;
}

.ffe-rating:hover {
	border-bottom: 1px solid rgba(0, 0, 0, 0.2) !important;
}

.ffe-rating-k,
.ffe-rating-kp {
	background: #78ac40;
	box-shadow: 0 1px 0 #90ce4d inset;
}

.ffe-rating-t,
.ffe-rating-m {
	background: #ffb400;
	box-shadow: 0 1px 0 #ffd800 inset;
}

.ffe-rating-ma {
	background: #c03d2f;
	box-shadow: 0 1px 0 #e64938 inset;
}
`);

  // src/enhance/components/Rating/Rating.tsx
  function Rating({ rating }) {
    const element = /* @__PURE__ */ render("a", {
      href: "https://www.fictionratings.com/",
      class: "ffe-rating",
      rel: "noreferrer",
      target: "rating"
    }, rating);
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

  // src/util/epub.ts
  var import_jszip = __toModule(require_jszip_min());
  function escapeFile(text) {
    return text.replace(/[<>:"/\\|?*]/g, "-");
  }
  function escapeXml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  var Epub = class {
    constructor(requestManager, story) {
      this.requestManager = requestManager;
      this.story = story;
    }
    async getContainerXml() {
      return `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="content.opf" media-type="application/oebps-package+xml" />
  </rootfiles>
</container>
`;
    }
    async getContentXml() {
      return `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="book-id" version="3.0">
  <metadata
    xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${escapeXml(this.story.title)}</dc:title>
    <dc:language>${escapeXml(this.story.language)}</dc:language>
    <dc:identifier id="book-id">https://www.fanfiction.net/s/${this.story.id}</dc:identifier>
    <dc:description>${escapeXml(this.story.description)}</dc:description>
    <dc:creator>${escapeXml(this.story.author.name)}</dc:creator>
    <dc:contributor>FanFiction Enhancements (https://github.com/amur-tiger/fanfiction-enhancements)</dc:contributor>
    <dc:publisher>FanFiction.net</dc:publisher>
    <dc:date>${this.story.published.toISOString()}</dc:date>
    <meta property="dcterms:modified">${new Date().toISOString().substr(0, 19)}Z</meta>
  </metadata>

  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml" />
    <item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" properties="nav" />
    ${this.hasCover() ? `<item id="cover" href="cover.jpg" media-type="image/jpeg" />
    <item id="cover-page" href="cover.xhtml" media-type="application/xhtml+xml" properties="svg" />` : ""}
    ${this.story.chapters.map((chapter2) => `<item id="chapter-${chapter2.id}" href="chapter-${chapter2.id}.xhtml" media-type="application/xhtml+xml" />`).join("\n    ")}
  </manifest>

  <spine toc="ncx">
    ${this.hasCover() ? `<itemref idref="cover-page" />` : ""}
    <itemref idref="toc" />
    ${this.story.chapters.map((chapter2) => `<itemref idref="chapter-${chapter2.id}" />`).join("\n    ")}
  </spine>

  <guide>
    ${this.hasCover() ? '<reference type="cover" href="cover.xhtml" title="Cover" />' : ""}
    <reference type="toc" href="toc.xhtml" title="Table of Contents" />
  </guide>
</package>`;
    }
    async getNcxXml() {
      return `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="https://www.fanfiction.net/s/${this.story.id}" />
    <meta name="dtb:generator" content="FanFiction Enhancements (https://github.com/amur-tiger/fanfiction-enhancements)" />
    <meta name="dtb:depth" content="1" />
    <meta name="dtb:totalPageCount" content="0" />
    <meta name="dtb:maxPageNumber" content="0" />
  </head>

  <docTitle>
    <text>${escapeXml(this.story.title)}</text>
  </docTitle>

  <navMap>
    ${this.story.chapters.map((chapter2) => `<navPoint id="navPoint-${chapter2.id}" playOrder="${chapter2.id}">
      <navLabel>
        <text>${escapeXml(chapter2.title)}</text>
      </navLabel>
      <content src="chapter-${chapter2.id}.xhtml" />
    </navPoint>`).join("\n      ")}
  </navMap>
</ncx>
`;
    }
    async getTocHtml() {
      return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:ops="http://www.idpf.org/2007/ops"
      lang="${escapeXml(this.story.language)}">
  <head>
    <meta charset="UTF-8" />
    <meta name="generator" content="FanFiction Enhancements (https://github.com/amur-tiger/fanfiction-enhancements)" />
    <meta name="author" content="${escapeXml(this.story.author.name)}" />
    <meta name="date" content="${this.story.published.toISOString()}" />
    <title>Table of Contents</title>
  </head>
  <body>
    <nav ops:type="toc">
      <h1>Table of Contents</h1>
      <ol>
        ${this.story.chapters.map((chapter2) => `<li><a href="chapter-${chapter2.id}.xhtml">${escapeXml(chapter2.title)}</a></li>`).join("\n        ")}
      </ol>
    </nav>
  </body>
</html>`;
    }
    async getCoverHtml() {
      return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="${escapeXml(this.story.language)}">
  <head>
    <meta charset="UTF-8" />
    <meta name="generator" content="FanFiction Enhancements (https://github.com/amur-tiger/fanfiction-enhancements)"/>
    <meta name="author" content="${escapeXml(this.story.author.name)}"/>
    <meta name="date" content="${this.story.published.toISOString()}"/>
    <title>Cover</title>
  </head>
  <body>
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="100%" height="100%" viewBox="0 0 1030 1231" preserveAspectRatio="none">
        <image width="1030" height="1231" xlink:href="cover.jpg"/>
      </svg>
    </div>
  </body>
</html>`;
    }
    async getChapterHtml(chapter2) {
      const link = createChapterLink(this.story, chapter2);
      const response = await this.requestManager.fetch(link);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const serializer = new XMLSerializer();
      const template = document.createElement("template");
      template.innerHTML = await response.text();
      const storyText = template.content.getElementById("storytext");
      const content = serializer.serializeToString(storyText);
      return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="${escapeXml(this.story.language)}">
  <head>
    <meta charset="UTF-8" />
    <meta name="generator" content="FanFiction Enhancements (https://github.com/amur-tiger/fanfiction-enhancements)"/>
    <meta name="author" content="${escapeXml(this.story.author.name)}"/>
    <meta name="date" content="${this.story.published.toISOString()}"/>
    <title>${escapeXml(chapter2.title)}</title>
</head>
<body>
${content}
</body>
</html>`;
    }
    hasCover() {
      return !!(this.story.imageOriginalUrl ?? this.story.imageUrl);
    }
    getFilename() {
      return escapeFile(`${this.story.title} - ${this.story.author.name}.epub`);
    }
    async create() {
      const zip = new import_jszip.default();
      zip.file("mimetype", "application/epub+zip");
      const meta = zip.folder("META-INF");
      meta.file("container.xml", await this.getContainerXml());
      zip.file("content.opf", await this.getContentXml());
      zip.file("toc.ncx", await this.getNcxXml());
      zip.file("toc.xhtml", await this.getTocHtml());
      const coverUrl = this.story.imageOriginalUrl ?? this.story.imageUrl;
      if (coverUrl) {
        zip.file("cover.xhtml", await this.getCoverHtml());
        const cover = await this.requestManager.fetch(`//www.fanfiction.net${coverUrl}`);
        if (!cover.ok) {
          throw new Error(cover.statusText);
        }
        zip.file("cover.jpg", await cover.blob());
      }
      await Promise.all(this.story.chapters.map(async (chapter2) => {
        zip.file(`chapter-${chapter2.id}.xhtml`, await this.getChapterHtml(chapter2));
      }));
      return zip.generateAsync({ type: "blob" });
    }
  };
  var epub_default = Epub;

  // gm-css:src/enhance/components/StoryCard/StoryCard.css
  GM_addStyle(`.ffe-sc-header {
	border-bottom: 1px solid #ddd;
	padding-bottom: 8px;
	margin-bottom: 8px;
}

.ffe-sc-title {
	color: #000 !important;
	font-size: 1.8em;
}

.ffe-sc-title:hover {
	border-bottom: 0;
	text-decoration: underline;
}

.ffe-sc-by {
	padding: 0 .5em;
}

.ffe-sc-mark {
	float: right;
}

.ffe-sc-mark > * {
	margin-right: 4px;
}

.ffe-sc-follow:hover,
.ffe-sc-follow.ffe-active {
	color: #60cf23;
}

.ffe-sc-favorite:hover,
.ffe-sc-favorite.ffe-active {
	color: #ffb400;
}

.ffe-sc-tags {
	border-bottom: 1px solid #ddd;
	display: flex;
	flex-wrap: wrap;
	line-height: 2em;
	margin-bottom: 8px;
}

.ffe-sc-tag {
	border: 1px solid rgba(0, 0, 0, 0.15);
	border-radius: 4px;
	color: black;
	line-height: 16px;
	margin-bottom: 8px;
	margin-right: 5px;
	padding: 3px 8px;
}

.ffe-sc-tag-language {
	background-color: #a151bd;
	color: white;
}

.ffe-sc-tag-universe {
	background-color: #44b7b7;
	color: white;
}

.ffe-sc-tag-genre {
	background-color: #4f91d6;
	color: white;
}

.ffe-sc-tag.ffe-sc-tag-character,
.ffe-sc-tag.ffe-sc-tag-ship {
	background-color: #23b974;
	color: white;
}

.ffe-sc-tag-ship .ffe-sc-tag-character:not(:first-child):before {
	content: " + ";
}

.ffe-sc-image {
	float: left;
	border: 1px solid #ddd;
	border-radius: 3px;
	padding: 3px;
	margin-right: 8px;
	margin-bottom: 8px;
}

.ffe-sc-description {
	color: #333;
	font-family: "Open Sans", sans-serif;
	font-size: 1.1em;
	line-height: 1.4em;
}

.ffe-sc-footer {
	clear: left;
	background: #f6f7ee;
	border-bottom: 1px solid #cdcdcd;
	border-top: 1px solid #cdcdcd;
	color: #555;
	font-size: .9em;
	margin-left: -.5em;
	margin-right: -.5em;
	margin-top: 1em;
	padding: 10px .5em;
}

.ffe-sc-footer-info {
	background: #fff;
	border: 1px solid rgba(0, 0, 0, 0.15);
	border-radius: 4px;
	line-height: 16px;
	margin-top: -5px;
	margin-right: 5px;
	padding: 3px 8px;
}

.ffe-sc-footer-complete {
	background: #63bd40;
	color: #fff;
}

.ffe-sc-footer-incomplete {
	background: #f7a616;
	color: #fff;
}
`);

  // src/enhance/components/StoryCard/StoryCard.tsx
  function StoryCard({ requestManager, story }) {
    const buttonRef = useValueRef();
    const linkRef = useValueRef();
    let isDownloading = false;
    const handleDownloadClick = async () => {
      if (isDownloading || !linkRef.current || !("chapters" in story)) {
        return;
      }
      try {
        isDownloading = true;
        buttonRef.current?.classList.add("disabled");
        const epub = new epub_default(requestManager, story);
        const blob = await epub.create();
        linkRef.current.href = URL.createObjectURL(blob);
        linkRef.current.download = epub.getFilename();
        linkRef.current.click();
      } finally {
        isDownloading = false;
        buttonRef.current?.classList.remove("disabled");
      }
    };
    return /* @__PURE__ */ render("div", {
      class: "ffe-sc"
    }, /* @__PURE__ */ render("div", {
      class: "ffe-sc-header"
    }, /* @__PURE__ */ render(Rating, {
      rating: story.rating
    }), /* @__PURE__ */ render("a", {
      href: `/s/${story.id}`,
      class: "ffe-sc-title"
    }, story.title), /* @__PURE__ */ render("span", {
      class: "ffe-sc-by"
    }, "by"), /* @__PURE__ */ render("a", {
      href: `/u/${story.author.id}`,
      class: "ffe-sc-author"
    }, story.author.name), /* @__PURE__ */ render("div", {
      class: "ffe-sc-mark"
    }, /* @__PURE__ */ render(Button, {
      onClick: handleDownloadClick,
      ref: buttonRef
    }, /* @__PURE__ */ render("span", {
      class: "icon-arrow-down"
    })), /* @__PURE__ */ render("a", {
      style: "display: none",
      ref: linkRef
    }), /* @__PURE__ */ render("div", {
      class: "btn-group"
    }, /* @__PURE__ */ render(Button, {
      class: "ffe-sc-follow icon-bookmark-2",
      bind: story.alert
    }), /* @__PURE__ */ render(Button, {
      class: "ffe-sc-favorite icon-heart",
      bind: story.favorite
    })))), /* @__PURE__ */ render("div", {
      class: "ffe-sc-tags"
    }, story.language && /* @__PURE__ */ render("span", {
      class: "ffe-sc-tag ffe-sc-tag-language"
    }, story.language), story.universes && story.universes.map((universe) => /* @__PURE__ */ render("span", {
      class: "ffe-sc-tag ffe-sc-tag-universe"
    }, universe)), story.genre && story.genre.map((genre) => /* @__PURE__ */ render("span", {
      class: "ffe-sc-tag ffe-sc-tag-genre"
    }, genre)), story.characters && story.characters.length > 0 && story.characters.map((pairing) => pairing.length === 1 ? /* @__PURE__ */ render("span", {
      class: "ffe-sc-tag ffe-sc-tag-character"
    }, pairing) : /* @__PURE__ */ render("span", {
      class: "ffe-sc-tag ffe-sc-tag-ship"
    }, pairing.map((character) => /* @__PURE__ */ render("span", {
      class: "ffe-sc-tag-character"
    }, character)))), story.chapters && story.chapters.length > 0 && /* @__PURE__ */ render("span", {
      class: "ffe-sc-tag ffe-sc-tag-chapters"
    }, "Chapters:\xA0", story.chapters.length), story.reviews && /* @__PURE__ */ render("span", {
      class: "ffe-sc-tag ffe-sc-tag-reviews"
    }, /* @__PURE__ */ render("a", {
      href: `/r/${story.id}/`
    }, "Reviews:\xA0", story.reviews)), story.favorites && /* @__PURE__ */ render("span", {
      class: "ffe-sc-tag ffe-sc-tag-favorites"
    }, "Favorites:\xA0", story.favorites), story.follows && /* @__PURE__ */ render("span", {
      class: "ffe-sc-tag ffe-sc-tag-follows"
    }, "Follows:\xA0", story.follows)), story.imageUrl && /* @__PURE__ */ render("div", {
      class: "ffe-sc-image"
    }, /* @__PURE__ */ render("img", {
      src: story.imageUrl,
      alt: "Story Cover"
    })), /* @__PURE__ */ render("div", {
      class: "ffe-sc-description"
    }, story.description), /* @__PURE__ */ render("div", {
      class: "ffe-sc-footer"
    }, story.words && /* @__PURE__ */ render("div", {
      style: "float: right;"
    }, /* @__PURE__ */ render("b", null, story.words.toLocaleString("en")), " words"), story.status === "Complete" ? /* @__PURE__ */ render("span", {
      class: "ffe-sc-footer-info ffe-sc-footer-complete"
    }, "Complete") : /* @__PURE__ */ render("span", {
      class: "ffe-sc-footer-info ffe-sc-footer-incomplete"
    }, "Incomplete"), story.published && /* @__PURE__ */ render("span", {
      class: "ffe-sc-footer-info"
    }, /* @__PURE__ */ render("b", null, "Published:\xA0"), /* @__PURE__ */ render("time", {
      datetime: story.published.toISOString()
    }, story.published.toLocaleDateString("en"))), story.updated && /* @__PURE__ */ render("span", {
      class: "ffe-sc-footer-info"
    }, /* @__PURE__ */ render("b", null, "Updated:\xA0"), /* @__PURE__ */ render("time", {
      datetime: story.updated.toISOString()
    }, story.updated.toLocaleDateString("en")))));
  }

  // src/enhance/ChapterList.ts
  var ChapterList2 = class {
    constructor(valueContainer) {
      this.valueContainer = valueContainer;
    }
    async enhance() {
      const contentWrapper = document.getElementById("content_wrapper_inner");
      if (!contentWrapper || !environment.currentStoryId) {
        return;
      }
      const story = await this.valueContainer.getStory(environment.currentStoryId);
      if (!story) {
        return;
      }
      Array.from(contentWrapper.children).filter((e) => !e.textContent && e.style.height === "5px" || e.firstElementChild && e.firstElementChild.nodeName === "SELECT" || e.className === "lc-wrapper" && e.id !== "pre_story_links").forEach((e) => contentWrapper.removeChild(e));
      const storyText = document.getElementById("storytextp");
      if (storyText) {
        contentWrapper.removeChild(storyText);
      }
      const chapterList = ChapterList({ story });
      contentWrapper.insertBefore(chapterList, document.getElementById("review_success"));
    }
  };
  var ChapterList_default = ChapterList2;

  // src/enhance/FollowsList.ts
  var import_ffn_parser2 = __toModule(require_lib());

  // gm-css:src/enhance/FollowsList.css
  GM_addStyle(`.ffe-follows-list {
	list-style: none;
	margin: 0;
}

.ffe-follows-item {
	margin-bottom: 8px;
}

.ffe-follows-item .ffe-sc {
	border-left: 1px solid #aaa;
	border-top: 1px solid #aaa;
	border-top-left-radius: 4px;
	padding-left: .5em;
	padding-top: 5px;
}

.ffe-follows-item .ffe-cl-container {
	border-left: 1px solid #aaa;
	margin-bottom: 20px;
	padding: 10px 0 0 0;
}
`);

  // src/enhance/FollowsList.ts
  var FollowsList = class {
    constructor(requestManager, valueContainer) {
      this.requestManager = requestManager;
      this.valueContainer = valueContainer;
    }
    async enhance() {
      const list = await (0, import_ffn_parser2.parseFollows)(document);
      if (!list) {
        return;
      }
      const container2 = document.createElement("ul");
      container2.classList.add("ffe-follows-list");
      const table = document.getElementById("gui_table1i")?.parentElement;
      if (!table) {
        return;
      }
      table.parentElement?.insertBefore(container2, table);
      for (const followedStory of list) {
        const item = document.createElement("li");
        item.classList.add("ffe-follows-item");
        container2.appendChild(item);
        const story = await this.valueContainer.getStory(followedStory.id);
        if (story) {
          const card = StoryCard({ requestManager: this.requestManager, story });
          item.appendChild(card);
          const chapterList = ChapterList({ story });
          item.appendChild(chapterList);
        }
      }
      table.parentElement?.removeChild(table);
    }
  };
  var FollowsList_default = FollowsList;

  // gm-css:src/enhance/MenuBar.css
  GM_addStyle(`.ffe-mb-separator:before {
	content: " | ";
}

.ffe-mb-checked:before {
	background: green;
	border-radius: 50%;
	bottom: 2px;
	color: #fff;
	content: "\u2713";
	font-size: 9px;
	height: 12px;
	line-height: 12px;
	position: absolute;
	right: -2px;
	width: 12px;
}

.ffe-mb-icon {
	display: inline-block;
	line-height: 2em;
	margin-top: -.5em;
	text-align: center;
	width: 2em;
}

.ffe-mb-icon:hover {
	border-bottom: 0;
	color: orange !important;
}

.ffe-mb-dropbox {
	transform: translateY(3px);
}

.ffe-mb-dropbox:hover .st0 {
	fill: orange;
}
`);

  // src/enhance/MenuBar.ts
  var MenuBar = class {
    constructor(dropBox) {
      this.dropBox = dropBox;
    }
    async enhance() {
      if (!environment.currentUserName) {
        return;
      }
      const loginElement = document.querySelector("#name_login a");
      const parent = loginElement?.parentElement;
      const ref = loginElement?.nextElementSibling;
      if (!parent || !ref) {
        return;
      }
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
      toDropBox.innerHTML = '<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42.4 39.5" width="16" height="16"><style>.st0{fill:#fff}</style><path class="st0" d="M10.6 1.7L0 8.5l10.6 6.7 10.6-6.7zm21.2 0L21.2 8.5l10.6 6.7 10.6-6.7zM0 22l10.6 6.8L21.2 22l-10.6-6.8zm31.8-6.8L21.2 22l10.6 6.8L42.4 22zM10.6 31l10.6 6.8L31.8 31l-10.6-6.7z"/></svg>';
      if (await this.dropBox.isAuthorized()) {
        toDropBox.classList.add("ffe-mb-checked");
      }
      toDropBox.addEventListener("click", async (event) => {
        event.preventDefault();
        await this.dropBox.authorize();
        toDropBox.classList.add("ffe-mb-checked");
      });
      const separator = document.createElement("span");
      separator.classList.add("ffe-mb-separator");
      parent.insertBefore(toAlerts, ref);
      parent.insertBefore(toFavorites, ref);
      parent.insertBefore(toDropBox, ref);
      parent.insertBefore(separator, ref);
    }
  };
  var MenuBar_default = MenuBar;

  // src/enhance/SaveListSettings.ts
  var SaveListSettings = class {
    getSort() {
      return GM.getValue("list-sort", "1");
    }
    setSort(value) {
      return GM.setValue("list-sort", value);
    }
    getRating() {
      return GM.getValue("list-rating", "103");
    }
    async getRatingBar() {
      const rating = await this.getRating();
      switch (rating) {
        case "10":
          return "99";
        case "103":
        default:
          return "3";
        case "102":
          return "2";
        case "1":
          return "1";
        case "2":
          return "12";
        case "3":
          return "13";
        case "4":
          return "14";
      }
    }
    setRating(value) {
      return GM.setValue("list-rating", value);
    }
    async setRatingBar(value) {
      switch (value) {
        case "99":
          await this.setRating("10");
          break;
        case "3":
        default:
          await this.setRating("103");
          break;
        case "2":
          await this.setRating("102");
          break;
        case "1":
          await this.setRating("1");
          break;
        case "12":
          await this.setRating("2");
          break;
        case "13":
          await this.setRating("3");
          break;
        case "14":
          await this.setRating("4");
          break;
      }
    }
    async enhance() {
      await this.updateFilterForm();
      const sort = await this.getSort();
      const rating = await this.getRating();
      const ratingBar = await this.getRatingBar();
      const showAllCrossoversButton = document.querySelector("#content_wrapper_inner a.btn");
      if (showAllCrossoversButton) {
        showAllCrossoversButton.href += `?&srt=${sort}&r=${rating}`;
      }
      const universeLinks = document.querySelectorAll("#list_output a");
      for (let i = 0; i < universeLinks.length; i++) {
        const link = universeLinks.item(i);
        if (!link.href.includes("crossovers")) {
          link.href += `?&srt=${sort}&r=${rating}`;
        }
      }
      const communityLinks = document.querySelectorAll(".z-list a");
      for (let i = 0; i < communityLinks.length; i++) {
        const link = communityLinks.item(i);
        link.href += `${ratingBar}/${sort}/1/0/0/0/0/`;
      }
    }
    async updateFilterForm() {
      const dialog = document.querySelector("#filters #myform");
      if (dialog) {
        const sortSelect = dialog.elements.namedItem("sortid");
        if (sortSelect) {
          sortSelect.value = await this.getSort();
        }
        const ratingSelect = dialog.elements.namedItem("censorid");
        if (ratingSelect) {
          ratingSelect.value = await this.getRating();
        }
        const submitButton = dialog.querySelector(".btn-primary");
        if (submitButton) {
          submitButton.addEventListener("click", async () => {
            if (sortSelect) {
              await this.setSort(sortSelect.value);
            }
            if (ratingSelect) {
              await this.setRating(ratingSelect.value);
            }
          });
        }
      } else {
        const bar = document.querySelector("#content_wrapper_inner form");
        if (bar && bar.name === "myform") {
          const sortSelect = bar.elements.namedItem("s");
          if (sortSelect) {
            sortSelect.value = await this.getSort();
          }
          const ratingSelect = bar.elements.namedItem("censorid");
          if (ratingSelect) {
            ratingSelect.value = await this.getRatingBar();
          }
          const submitButton = bar.querySelector("input[type=submit]");
          if (submitButton) {
            submitButton.addEventListener("click", async () => {
              if (sortSelect) {
                await this.setSort(sortSelect.value);
              }
              if (ratingSelect) {
                await this.setRatingBar(ratingSelect.value);
              }
            });
          }
        }
      }
    }
  };
  var SaveListSettings_default = SaveListSettings;

  // src/enhance/StoryList.ts
  var import_ffn_parser3 = __toModule(require_lib());

  // gm-css:src/enhance/StoryList.css
  GM_addStyle(`.ffe-story-list {
	list-style: none;
	margin: 0 auto;
}

.ffe-story-item {
	margin: 10px 0;
}

.ffe-story-item .ffe-sc {
	background-color: #fff;
	border: 1px solid #d4d4d4;
	padding: 5px .5em;
}

.ffe-story-item .ffe-sc-footer {
	margin-top: 1em;
}
`);

  // src/enhance/StoryList.ts
  var StoryList = class {
    constructor(requestManager, valueContainer) {
      this.requestManager = requestManager;
      this.valueContainer = valueContainer;
    }
    async enhance() {
      const list = await (0, import_ffn_parser3.parseStoryList)(document);
      if (!list) {
        return;
      }
      const cw = document.getElementById("content_wrapper");
      if (!cw) {
        return;
      }
      const container2 = document.createElement("ul");
      container2.classList.add("ffe-story-list", "maxwidth");
      cw.parentElement?.insertBefore(container2, null);
      const deferChapterList = [];
      for (const followedStory of list) {
        const item = document.createElement("li");
        item.classList.add("ffe-story-item");
        container2.appendChild(item);
        const story = new Story_default(__spreadProps(__spreadValues({}, followedStory), {
          chapters: []
        }), this.valueContainer);
        const card = StoryCard({ requestManager: this.requestManager, story });
        item.appendChild(card);
        deferChapterList.push([story, item]);
      }
      cw.querySelectorAll(".z-list").forEach((e) => e.parentElement?.removeChild(e));
      const pageNav = cw.querySelector("center:last-of-type");
      if (pageNav) {
        const footer = document.createElement("div");
        footer.id = "content_wrapper_inner";
        footer.classList.add("maxwidth");
        footer.style.backgroundColor = "white";
        footer.style.height = "35px";
        footer.style.lineHeight = "35px";
        footer.appendChild(pageNav);
        cw.parentElement?.insertBefore(footer, null);
      }
    }
  };
  var StoryList_default = StoryList;

  // gm-css:src/enhance/StoryProfile.css
  GM_addStyle(``);

  // src/enhance/StoryProfile.ts
  var StoryProfile = class {
    constructor(requestManager, valueContainer) {
      this.requestManager = requestManager;
      this.valueContainer = valueContainer;
    }
    async enhance() {
      const profile = document.getElementById("profile_top");
      if (!profile || !environment.currentStoryId) {
        return;
      }
      const story = await this.valueContainer.getStory(environment.currentStoryId);
      if (!story) {
        return;
      }
      const card = StoryCard({ requestManager: this.requestManager, story });
      profile.parentElement?.insertBefore(card, profile);
      profile.style.display = "none";
    }
  };
  var StoryProfile_default = StoryProfile;

  // gm-css:src/enhance/StoryText.css
  GM_addStyle(`.storytext p {
	color: #333;
	text-align: justify;
}

.storytext.xlight p {
	color: #ddd;
}
`);

  // src/enhance/StoryText.ts
  var StoryText = class {
    async enhance() {
      const textContainer = document.getElementById("storytextp");
      if (!textContainer) {
        throw new Error("Could not find text container element.");
      }
      this.fixUserSelect(textContainer);
    }
    fixUserSelect(textContainer) {
      const handle = setInterval(() => {
        const rules = [
          "userSelect",
          "msUserSelect",
          "mozUserSelect",
          "khtmlUserSelect",
          "webkitUserSelect",
          "webkitTouchCallout"
        ];
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
  };
  var StoryText_default = StoryText;

  // src/api/DropBox.ts
  var OAUTH2_CALLBACK = "ffe-oauth2-cb";
  var REDIRECT_URI = "https://www.fanfiction.net/ffe-oauth2-return";
  var CLIENT_ID = "ngjdgcbyh9cq080";
  var BEARER_TOKEN_KEY = "ffe-dropbox-token";
  var FFE_DATA_PATH = "/ffe.json";
  var DropBox = class {
    constructor() {
      this.valueUpdateCallbacks = {};
    }
    async isAuthorized() {
      return !!await GM.getValue(BEARER_TOKEN_KEY);
    }
    async authorize() {
      const token = await new Promise((resolve, reject) => {
        unsafeWindow[OAUTH2_CALLBACK] = (callbackToken) => {
          clearInterval(handle);
          resolve(callbackToken);
        };
        const popup = xwindow(`https://www.dropbox.com/oauth2/authorize?response_type=token&client_id=${encodeURIComponent(CLIENT_ID)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`, 775, 550);
        const handle = setInterval(() => {
          if (popup.closed) {
            clearInterval(handle);
            reject(new Error("Authorization aborted by user"));
          }
        }, 1e3);
      });
      await GM.setValue(BEARER_TOKEN_KEY, token);
    }
    async synchronize() {
      console.log("Synchronizing data with DropBox");
      const rawData = await this.readFile(FFE_DATA_PATH);
      const remoteData = rawData ? JSON.parse(rawData) : {};
      await Promise.all(Object.keys(remoteData).map(async (key) => {
        if (CacheName.isTimestampKey(key)) {
          return;
        }
        const localTimestamp = +(await GM.getValue(`${key}+timestamp`) ?? 0);
        const remoteTimestamp = +remoteData[`${key}+timestamp`];
        if (localTimestamp < remoteTimestamp) {
          await Promise.all(Object.getOwnPropertySymbols(this.valueUpdateCallbacks).map((sym) => this.valueUpdateCallbacks[sym](key, remoteData[key])).filter((promise) => promise && promise.then));
        }
      }));
      let hasUpdate = false;
      await Promise.all((await GM.listValues()).map(async (key) => {
        if (CacheName.isTimestampKey(key)) {
          return;
        }
        const localTimestamp = +(await GM.getValue(`${key}+timestamp`) ?? 0);
        const remoteTimestamp = +remoteData[`${key}+timestamp`] || 0;
        if (localTimestamp > remoteTimestamp) {
          hasUpdate = true;
          remoteData[key] = JSON.parse(await GM.getValue(key));
          remoteData[`${key}+timestamp`] = localTimestamp;
        }
      }));
      if (hasUpdate) {
        await this.saveFile(FFE_DATA_PATH, remoteData);
      }
    }
    onValueUpdate(callback) {
      const key = Symbol("value-update-key");
      this.valueUpdateCallbacks[key] = callback;
      return key;
    }
    removeValueUpdateCallback(key) {
      delete this.valueUpdateCallbacks[key];
    }
    readFile(path) {
      return this.content("/files/download", {
        path
      });
    }
    saveFile(path, content) {
      return this.content("/files/upload", {
        path,
        mode: "overwrite",
        mute: true
      }, content);
    }
    async content(url, params, body) {
      if (!await this.isAuthorized()) {
        throw new Error("Not authorized with DropBox yet.");
      }
      const token = await GM.getValue(BEARER_TOKEN_KEY);
      const fmtUrl = `https://content.dropboxapi.com/2${url}?arg=${encodeURIComponent(JSON.stringify(params))}`;
      console.debug("%c[DropBox] %cPOST %c%s", "color: gray", "color: blue", "color: inherit", fmtUrl);
      const response = await fetch(fmtUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/octet-stream"
        },
        body: body ? JSON.stringify(body) : void 0
      });
      if (!response.ok) {
        const msg = await response.json();
        if (response.status === 409 && msg.error_summary.startsWith("path/not_found/")) {
          return void 0;
        }
        throw new Error(msg.error_summary);
      }
      return response.text();
    }
    async rpc(url, body) {
      if (!await this.isAuthorized()) {
        throw new Error("Not authorized with Dropbox yet.");
      }
      const token = await GM.getValue(BEARER_TOKEN_KEY);
      const fmtUrl = `https://api.dropboxapi.com/2${url}`;
      console.debug("%c[DropBox] %cPOST %c%s", "color: gray", "color: blue", "color: inherit", fmtUrl);
      const response = await fetch(fmtUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/octet-stream"
        },
        body: body ? JSON.stringify(body) : "null"
      });
      return response.json();
    }
  };
  function oAuth2LandingPage() {
    const target = document.body.firstElementChild;
    if (target) {
      target.innerHTML = "<h2>Received oAuth2 token</h2>This page should close momentarily.";
    }
    const token = /[?&#]access_token=([^&#]*)/i.exec(window.location.hash)?.[1];
    window.opener[OAUTH2_CALLBACK](token);
    window.close();
  }

  // src/container.ts
  var Container = class {
    getRequestManager() {
      if (!this.requestManager) {
        this.requestManager = new RequestManager_default();
      }
      return this.requestManager;
    }
    getApi() {
      if (!this.api) {
        this.api = new Api_default(this.getRequestManager());
      }
      return this.api;
    }
    getValueContainer() {
      if (!this.valueManager) {
        this.valueManager = new ValueContainer_default(this.getStorage(), this.getApi(), this.getDropBox());
      }
      return this.valueManager;
    }
    getMenuBar() {
      if (!this.menuBar) {
        this.menuBar = new MenuBar_default(this.getDropBox());
      }
      return this.menuBar;
    }
    getFollowsList() {
      if (!this.followsList) {
        this.followsList = new FollowsList_default(this.getRequestManager(), this.getValueContainer());
      }
      return this.followsList;
    }
    getStoryListEnhancer() {
      if (!this.storyList) {
        this.storyList = new StoryList_default(this.getRequestManager(), this.getValueContainer());
      }
      return this.storyList;
    }
    getStoryProfile() {
      if (!this.storyProfile) {
        this.storyProfile = new StoryProfile_default(this.getRequestManager(), this.getValueContainer());
      }
      return this.storyProfile;
    }
    getChapterList() {
      if (!this.chapterList) {
        this.chapterList = new ChapterList_default(this.getValueContainer());
      }
      return this.chapterList;
    }
    getSaveListSettings() {
      if (!this.saveListSettings) {
        this.saveListSettings = new SaveListSettings_default();
      }
      return this.saveListSettings;
    }
    getDropBox() {
      if (!this.dropBox) {
        this.dropBox = new DropBox();
      }
      return this.dropBox;
    }
    getContainer() {
      return this;
    }
    getStorage() {
      return localStorage;
    }
  };
  var container_default = Container;

  // src/main.ts
  var container = new container_default();
  async function main() {
    if (environment.currentPageType === Page.OAuth2) {
      console.log("OAuth 2 landing page - no enhancements will be applied");
      oAuth2LandingPage();
      return;
    }
    const valueContainer = container.getValueContainer();
    const dropBox = container.getDropBox();
    if (await dropBox.isAuthorized()) {
      dropBox.synchronize().catch(console.error);
    }
    const menuBarEnhancer = container.getMenuBar();
    await menuBarEnhancer.enhance();
    if (environment.currentPageType === Page.Alerts || environment.currentPageType === Page.Favorites) {
      const getterName = environment.currentPageType === Page.Alerts ? "getAlertValue" : "getFavoriteValue";
      const list = await (0, import_ffn_parser4.parseFollows)(document);
      if (list) {
        await Promise.all(list.map(async (item) => {
          const value = valueContainer[getterName](item.id);
          await value.update(true);
        }));
      }
      const followsListEnhancer = container.getFollowsList();
      await followsListEnhancer.enhance();
    }
    if (environment.currentPageType === Page.StoryList) {
      const storyListEnhancer = container.getStoryListEnhancer();
      await storyListEnhancer.enhance();
      const saveListSettingsEnhancer = container.getSaveListSettings();
      await saveListSettingsEnhancer.enhance();
    }
    if (environment.currentPageType === Page.UniverseList || environment.currentPageType === Page.CommunityList) {
      const saveListSettingsEnhancer = container.getSaveListSettings();
      await saveListSettingsEnhancer.enhance();
    }
    if (environment.currentPageType === Page.Story) {
      const currentStory = await (0, import_ffn_parser4.parseStory)(document);
      if (currentStory) {
        const storyValue = valueContainer.getStoryValue(currentStory.id);
        await storyValue.update(currentStory);
      }
      const storyProfileEnhancer = container.getStoryProfile();
      await storyProfileEnhancer.enhance();
      const chapterListEnhancer = container.getChapterList();
      await chapterListEnhancer.enhance();
    }
    if (environment.currentPageType === Page.Chapter) {
      const currentStory = await (0, import_ffn_parser4.parseStory)(document);
      if (currentStory) {
        const storyValue = valueContainer.getStoryValue(currentStory.id);
        await storyValue.update(currentStory);
        if (environment.currentChapterId) {
          const wordCountValue = valueContainer.getWordCountValue(currentStory.id, environment.currentChapterId);
          await wordCountValue.update(document.getElementById("storytext")?.textContent?.trim()?.split(/\s+/).length ?? 0);
        }
        const storyProfileEnhancer = container.getStoryProfile();
        await storyProfileEnhancer.enhance();
        const storyTextEnhancer = new StoryText_default();
        await storyTextEnhancer.enhance();
        if (environment.currentChapterId) {
          const readValue = valueContainer.getChapterReadValue(currentStory.id, environment.currentChapterId);
          const markRead = async () => {
            const amount = document.documentElement.scrollTop;
            const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (amount / (max - 550) >= 1) {
              window.removeEventListener("scroll", markRead);
              console.log("Setting '%s' chapter '%s' to read", currentStory.title, currentStory.chapters.find((c) => c.id === environment.currentChapterId)?.title);
              await readValue.set(true);
            }
          };
          window.addEventListener("scroll", markRead);
        }
      }
    }
  }
  async function migrate() {
    const readListStr = await GM.getValue("ffe-cache-read");
    if (!readListStr) {
      return;
    }
    const readList = JSON.parse(readListStr);
    for (const [storyId, story] of Object.entries(readList)) {
      for (const [chapterId, chapter2] of Object.entries(story)) {
        await GM.setValue(CacheName.chapterRead(+storyId, +chapterId), chapter2);
      }
    }
    await GM.deleteValue("ffe-cache-read");
    await GM.deleteValue("ffe-cache-alerts");
  }
  migrate().then(main).catch(console.error);
})();
/*!

JSZip v3.6.0 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/master/LICENSE
*/
