// ==UserScript==
// @name         FanFiction Enhancements
// @namespace    https://tiger.rocks/
// @version      0.7.4+22.baf55af
// @description  FanFiction.net Enhancements
// @author       Arne 'TigeR' Linck
// @copyright    2018-2023, Arne 'TigeR' Linck
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

"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

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
          published: /* @__PURE__ */ new Date(),
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
        if ("object" == typeof exports && "undefined" != typeof module)
          module.exports = e();
        else if ("function" == typeof define && define.amd)
          define([], e);
        else {
          ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).JSZip = e();
        }
      }(function() {
        return function s(a, o, h) {
          function u(r2, e2) {
            if (!o[r2]) {
              if (!a[r2]) {
                var t = "function" == typeof __require && __require;
                if (!e2 && t)
                  return t(r2, true);
                if (l)
                  return l(r2, true);
                var n = new Error("Cannot find module '" + r2 + "'");
                throw n.code = "MODULE_NOT_FOUND", n;
              }
              var i = o[r2] = { exports: {} };
              a[r2][0].call(i.exports, function(e3) {
                var t2 = a[r2][1][e3];
                return u(t2 || e3);
              }, i, i.exports, s, a, o, h);
            }
            return o[r2].exports;
          }
          for (var l = "function" == typeof __require && __require, e = 0; e < h.length; e++)
            u(h[e]);
          return u;
        }({ 1: [function(e, t, r2) {
          "use strict";
          var d = e("./utils"), c = e("./support"), p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
          r2.encode = function(e2) {
            for (var t2, r3, n, i, s, a, o, h = [], u = 0, l = e2.length, f = l, c2 = "string" !== d.getTypeOf(e2); u < e2.length; )
              f = l - u, n = c2 ? (t2 = e2[u++], r3 = u < l ? e2[u++] : 0, u < l ? e2[u++] : 0) : (t2 = e2.charCodeAt(u++), r3 = u < l ? e2.charCodeAt(u++) : 0, u < l ? e2.charCodeAt(u++) : 0), i = t2 >> 2, s = (3 & t2) << 4 | r3 >> 4, a = 1 < f ? (15 & r3) << 2 | n >> 6 : 64, o = 2 < f ? 63 & n : 64, h.push(p.charAt(i) + p.charAt(s) + p.charAt(a) + p.charAt(o));
            return h.join("");
          }, r2.decode = function(e2) {
            var t2, r3, n, i, s, a, o = 0, h = 0, u = "data:";
            if (e2.substr(0, u.length) === u)
              throw new Error("Invalid base64 input, it looks like a data url.");
            var l, f = 3 * (e2 = e2.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
            if (e2.charAt(e2.length - 1) === p.charAt(64) && f--, e2.charAt(e2.length - 2) === p.charAt(64) && f--, f % 1 != 0)
              throw new Error("Invalid base64 input, bad content length.");
            for (l = c.uint8array ? new Uint8Array(0 | f) : new Array(0 | f); o < e2.length; )
              t2 = p.indexOf(e2.charAt(o++)) << 2 | (i = p.indexOf(e2.charAt(o++))) >> 4, r3 = (15 & i) << 4 | (s = p.indexOf(e2.charAt(o++))) >> 2, n = (3 & s) << 6 | (a = p.indexOf(e2.charAt(o++))), l[h++] = t2, 64 !== s && (l[h++] = r3), 64 !== a && (l[h++] = n);
            return l;
          };
        }, { "./support": 30, "./utils": 32 }], 2: [function(e, t, r2) {
          "use strict";
          var n = e("./external"), i = e("./stream/DataWorker"), s = e("./stream/Crc32Probe"), a = e("./stream/DataLengthProbe");
          function o(e2, t2, r3, n2, i2) {
            this.compressedSize = e2, this.uncompressedSize = t2, this.crc32 = r3, this.compression = n2, this.compressedContent = i2;
          }
          o.prototype = { getContentWorker: function() {
            var e2 = new i(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")), t2 = this;
            return e2.on("end", function() {
              if (this.streamInfo.data_length !== t2.uncompressedSize)
                throw new Error("Bug : uncompressed data size mismatch");
            }), e2;
          }, getCompressedWorker: function() {
            return new i(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
          } }, o.createWorkerFrom = function(e2, t2, r3) {
            return e2.pipe(new s()).pipe(new a("uncompressedSize")).pipe(t2.compressWorker(r3)).pipe(new a("compressedSize")).withStreamInfo("compression", t2);
          }, t.exports = o;
        }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, t, r2) {
          "use strict";
          var n = e("./stream/GenericWorker");
          r2.STORE = { magic: "\0\0", compressWorker: function() {
            return new n("STORE compression");
          }, uncompressWorker: function() {
            return new n("STORE decompression");
          } }, r2.DEFLATE = e("./flate");
        }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, t, r2) {
          "use strict";
          var n = e("./utils");
          var o = function() {
            for (var e2, t2 = [], r3 = 0; r3 < 256; r3++) {
              e2 = r3;
              for (var n2 = 0; n2 < 8; n2++)
                e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
              t2[r3] = e2;
            }
            return t2;
          }();
          t.exports = function(e2, t2) {
            return void 0 !== e2 && e2.length ? "string" !== n.getTypeOf(e2) ? function(e3, t3, r3, n2) {
              var i = o, s = n2 + r3;
              e3 ^= -1;
              for (var a = n2; a < s; a++)
                e3 = e3 >>> 8 ^ i[255 & (e3 ^ t3[a])];
              return -1 ^ e3;
            }(0 | t2, e2, e2.length, 0) : function(e3, t3, r3, n2) {
              var i = o, s = n2 + r3;
              e3 ^= -1;
              for (var a = n2; a < s; a++)
                e3 = e3 >>> 8 ^ i[255 & (e3 ^ t3.charCodeAt(a))];
              return -1 ^ e3;
            }(0 | t2, e2, e2.length, 0) : 0;
          };
        }, { "./utils": 32 }], 5: [function(e, t, r2) {
          "use strict";
          r2.base64 = false, r2.binary = false, r2.dir = false, r2.createFolders = true, r2.date = null, r2.compression = null, r2.compressionOptions = null, r2.comment = null, r2.unixPermissions = null, r2.dosPermissions = null;
        }, {}], 6: [function(e, t, r2) {
          "use strict";
          var n = null;
          n = "undefined" != typeof Promise ? Promise : e("lie"), t.exports = { Promise: n };
        }, { lie: 37 }], 7: [function(e, t, r2) {
          "use strict";
          var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array, i = e("pako"), s = e("./utils"), a = e("./stream/GenericWorker"), o = n ? "uint8array" : "array";
          function h(e2, t2) {
            a.call(this, "FlateWorker/" + e2), this._pako = null, this._pakoAction = e2, this._pakoOptions = t2, this.meta = {};
          }
          r2.magic = "\b\0", s.inherits(h, a), h.prototype.processChunk = function(e2) {
            this.meta = e2.meta, null === this._pako && this._createPako(), this._pako.push(s.transformTo(o, e2.data), false);
          }, h.prototype.flush = function() {
            a.prototype.flush.call(this), null === this._pako && this._createPako(), this._pako.push([], true);
          }, h.prototype.cleanUp = function() {
            a.prototype.cleanUp.call(this), this._pako = null;
          }, h.prototype._createPako = function() {
            this._pako = new i[this._pakoAction]({ raw: true, level: this._pakoOptions.level || -1 });
            var t2 = this;
            this._pako.onData = function(e2) {
              t2.push({ data: e2, meta: t2.meta });
            };
          }, r2.compressWorker = function(e2) {
            return new h("Deflate", e2);
          }, r2.uncompressWorker = function() {
            return new h("Inflate", {});
          };
        }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, t, r2) {
          "use strict";
          function A(e2, t2) {
            var r3, n2 = "";
            for (r3 = 0; r3 < t2; r3++)
              n2 += String.fromCharCode(255 & e2), e2 >>>= 8;
            return n2;
          }
          function n(e2, t2, r3, n2, i2, s2) {
            var a, o, h = e2.file, u = e2.compression, l = s2 !== O.utf8encode, f = I.transformTo("string", s2(h.name)), c = I.transformTo("string", O.utf8encode(h.name)), d = h.comment, p = I.transformTo("string", s2(d)), m = I.transformTo("string", O.utf8encode(d)), _ = c.length !== h.name.length, g = m.length !== d.length, b = "", v = "", y = "", w = h.dir, k = h.date, x = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
            t2 && !r3 || (x.crc32 = e2.crc32, x.compressedSize = e2.compressedSize, x.uncompressedSize = e2.uncompressedSize);
            var S = 0;
            t2 && (S |= 8), l || !_ && !g || (S |= 2048);
            var z = 0, C = 0;
            w && (z |= 16), "UNIX" === i2 ? (C = 798, z |= function(e3, t3) {
              var r4 = e3;
              return e3 || (r4 = t3 ? 16893 : 33204), (65535 & r4) << 16;
            }(h.unixPermissions, w)) : (C = 20, z |= function(e3) {
              return 63 & (e3 || 0);
            }(h.dosPermissions)), a = k.getUTCHours(), a <<= 6, a |= k.getUTCMinutes(), a <<= 5, a |= k.getUTCSeconds() / 2, o = k.getUTCFullYear() - 1980, o <<= 4, o |= k.getUTCMonth() + 1, o <<= 5, o |= k.getUTCDate(), _ && (v = A(1, 1) + A(B(f), 4) + c, b += "up" + A(v.length, 2) + v), g && (y = A(1, 1) + A(B(p), 4) + m, b += "uc" + A(y.length, 2) + y);
            var E = "";
            return E += "\n\0", E += A(S, 2), E += u.magic, E += A(a, 2), E += A(o, 2), E += A(x.crc32, 4), E += A(x.compressedSize, 4), E += A(x.uncompressedSize, 4), E += A(f.length, 2), E += A(b.length, 2), { fileRecord: R.LOCAL_FILE_HEADER + E + f + b, dirRecord: R.CENTRAL_FILE_HEADER + A(C, 2) + E + A(p.length, 2) + "\0\0\0\0" + A(z, 4) + A(n2, 4) + f + b + p };
          }
          var I = e("../utils"), i = e("../stream/GenericWorker"), O = e("../utf8"), B = e("../crc32"), R = e("../signature");
          function s(e2, t2, r3, n2) {
            i.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = t2, this.zipPlatform = r3, this.encodeFileName = n2, this.streamFiles = e2, this.accumulate = false, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
          }
          I.inherits(s, i), s.prototype.push = function(e2) {
            var t2 = e2.meta.percent || 0, r3 = this.entriesCount, n2 = this._sources.length;
            this.accumulate ? this.contentBuffer.push(e2) : (this.bytesWritten += e2.data.length, i.prototype.push.call(this, { data: e2.data, meta: { currentFile: this.currentFile, percent: r3 ? (t2 + 100 * (r3 - n2 - 1)) / r3 : 100 } }));
          }, s.prototype.openedSource = function(e2) {
            this.currentSourceOffset = this.bytesWritten, this.currentFile = e2.file.name;
            var t2 = this.streamFiles && !e2.file.dir;
            if (t2) {
              var r3 = n(e2, t2, false, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
              this.push({ data: r3.fileRecord, meta: { percent: 0 } });
            } else
              this.accumulate = true;
          }, s.prototype.closedSource = function(e2) {
            this.accumulate = false;
            var t2 = this.streamFiles && !e2.file.dir, r3 = n(e2, t2, true, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            if (this.dirRecords.push(r3.dirRecord), t2)
              this.push({ data: function(e3) {
                return R.DATA_DESCRIPTOR + A(e3.crc32, 4) + A(e3.compressedSize, 4) + A(e3.uncompressedSize, 4);
              }(e2), meta: { percent: 100 } });
            else
              for (this.push({ data: r3.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; )
                this.push(this.contentBuffer.shift());
            this.currentFile = null;
          }, s.prototype.flush = function() {
            for (var e2 = this.bytesWritten, t2 = 0; t2 < this.dirRecords.length; t2++)
              this.push({ data: this.dirRecords[t2], meta: { percent: 100 } });
            var r3 = this.bytesWritten - e2, n2 = function(e3, t3, r4, n3, i2) {
              var s2 = I.transformTo("string", i2(n3));
              return R.CENTRAL_DIRECTORY_END + "\0\0\0\0" + A(e3, 2) + A(e3, 2) + A(t3, 4) + A(r4, 4) + A(s2.length, 2) + s2;
            }(this.dirRecords.length, r3, e2, this.zipComment, this.encodeFileName);
            this.push({ data: n2, meta: { percent: 100 } });
          }, s.prototype.prepareNextSource = function() {
            this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
          }, s.prototype.registerPrevious = function(e2) {
            this._sources.push(e2);
            var t2 = this;
            return e2.on("data", function(e3) {
              t2.processChunk(e3);
            }), e2.on("end", function() {
              t2.closedSource(t2.previous.streamInfo), t2._sources.length ? t2.prepareNextSource() : t2.end();
            }), e2.on("error", function(e3) {
              t2.error(e3);
            }), this;
          }, s.prototype.resume = function() {
            return !!i.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), true) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), true));
          }, s.prototype.error = function(e2) {
            var t2 = this._sources;
            if (!i.prototype.error.call(this, e2))
              return false;
            for (var r3 = 0; r3 < t2.length; r3++)
              try {
                t2[r3].error(e2);
              } catch (e3) {
              }
            return true;
          }, s.prototype.lock = function() {
            i.prototype.lock.call(this);
            for (var e2 = this._sources, t2 = 0; t2 < e2.length; t2++)
              e2[t2].lock();
          }, t.exports = s;
        }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, t, r2) {
          "use strict";
          var u = e("../compressions"), n = e("./ZipFileWorker");
          r2.generateWorker = function(e2, a, t2) {
            var o = new n(a.streamFiles, t2, a.platform, a.encodeFileName), h = 0;
            try {
              e2.forEach(function(e3, t3) {
                h++;
                var r3 = function(e4, t4) {
                  var r4 = e4 || t4, n3 = u[r4];
                  if (!n3)
                    throw new Error(r4 + " is not a valid compression method !");
                  return n3;
                }(t3.options.compression, a.compression), n2 = t3.options.compressionOptions || a.compressionOptions || {}, i = t3.dir, s = t3.date;
                t3._compressWorker(r3, n2).withStreamInfo("file", { name: e3, dir: i, date: s, comment: t3.comment || "", unixPermissions: t3.unixPermissions, dosPermissions: t3.dosPermissions }).pipe(o);
              }), o.entriesCount = h;
            } catch (e3) {
              o.error(e3);
            }
            return o;
          };
        }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, t, r2) {
          "use strict";
          function n() {
            if (!(this instanceof n))
              return new n();
            if (arguments.length)
              throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
            this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
              var e2 = new n();
              for (var t2 in this)
                "function" != typeof this[t2] && (e2[t2] = this[t2]);
              return e2;
            };
          }
          (n.prototype = e("./object")).loadAsync = e("./load"), n.support = e("./support"), n.defaults = e("./defaults"), n.version = "3.10.1", n.loadAsync = function(e2, t2) {
            return new n().loadAsync(e2, t2);
          }, n.external = e("./external"), t.exports = n;
        }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, t, r2) {
          "use strict";
          var u = e("./utils"), i = e("./external"), n = e("./utf8"), s = e("./zipEntries"), a = e("./stream/Crc32Probe"), l = e("./nodejsUtils");
          function f(n2) {
            return new i.Promise(function(e2, t2) {
              var r3 = n2.decompressed.getContentWorker().pipe(new a());
              r3.on("error", function(e3) {
                t2(e3);
              }).on("end", function() {
                r3.streamInfo.crc32 !== n2.decompressed.crc32 ? t2(new Error("Corrupted zip : CRC32 mismatch")) : e2();
              }).resume();
            });
          }
          t.exports = function(e2, o) {
            var h = this;
            return o = u.extend(o || {}, { base64: false, checkCRC32: false, optimizedBinaryString: false, createFolders: false, decodeFileName: n.utf8decode }), l.isNode && l.isStream(e2) ? i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : u.prepareContent("the loaded zip file", e2, true, o.optimizedBinaryString, o.base64).then(function(e3) {
              var t2 = new s(o);
              return t2.load(e3), t2;
            }).then(function(e3) {
              var t2 = [i.Promise.resolve(e3)], r3 = e3.files;
              if (o.checkCRC32)
                for (var n2 = 0; n2 < r3.length; n2++)
                  t2.push(f(r3[n2]));
              return i.Promise.all(t2);
            }).then(function(e3) {
              for (var t2 = e3.shift(), r3 = t2.files, n2 = 0; n2 < r3.length; n2++) {
                var i2 = r3[n2], s2 = i2.fileNameStr, a2 = u.resolve(i2.fileNameStr);
                h.file(a2, i2.decompressed, { binary: true, optimizedBinaryString: true, date: i2.date, dir: i2.dir, comment: i2.fileCommentStr.length ? i2.fileCommentStr : null, unixPermissions: i2.unixPermissions, dosPermissions: i2.dosPermissions, createFolders: o.createFolders }), i2.dir || (h.file(a2).unsafeOriginalName = s2);
              }
              return t2.zipComment.length && (h.comment = t2.zipComment), h;
            });
          };
        }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, t, r2) {
          "use strict";
          var n = e("../utils"), i = e("../stream/GenericWorker");
          function s(e2, t2) {
            i.call(this, "Nodejs stream input adapter for " + e2), this._upstreamEnded = false, this._bindStream(t2);
          }
          n.inherits(s, i), s.prototype._bindStream = function(e2) {
            var t2 = this;
            (this._stream = e2).pause(), e2.on("data", function(e3) {
              t2.push({ data: e3, meta: { percent: 0 } });
            }).on("error", function(e3) {
              t2.isPaused ? this.generatedError = e3 : t2.error(e3);
            }).on("end", function() {
              t2.isPaused ? t2._upstreamEnded = true : t2.end();
            });
          }, s.prototype.pause = function() {
            return !!i.prototype.pause.call(this) && (this._stream.pause(), true);
          }, s.prototype.resume = function() {
            return !!i.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), true);
          }, t.exports = s;
        }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, t, r2) {
          "use strict";
          var i = e("readable-stream").Readable;
          function n(e2, t2, r3) {
            i.call(this, t2), this._helper = e2;
            var n2 = this;
            e2.on("data", function(e3, t3) {
              n2.push(e3) || n2._helper.pause(), r3 && r3(t3);
            }).on("error", function(e3) {
              n2.emit("error", e3);
            }).on("end", function() {
              n2.push(null);
            });
          }
          e("../utils").inherits(n, i), n.prototype._read = function() {
            this._helper.resume();
          }, t.exports = n;
        }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, t, r2) {
          "use strict";
          t.exports = { isNode: "undefined" != typeof Buffer, newBufferFrom: function(e2, t2) {
            if (Buffer.from && Buffer.from !== Uint8Array.from)
              return Buffer.from(e2, t2);
            if ("number" == typeof e2)
              throw new Error('The "data" argument must not be a number');
            return new Buffer(e2, t2);
          }, allocBuffer: function(e2) {
            if (Buffer.alloc)
              return Buffer.alloc(e2);
            var t2 = new Buffer(e2);
            return t2.fill(0), t2;
          }, isBuffer: function(e2) {
            return Buffer.isBuffer(e2);
          }, isStream: function(e2) {
            return e2 && "function" == typeof e2.on && "function" == typeof e2.pause && "function" == typeof e2.resume;
          } };
        }, {}], 15: [function(e, t, r2) {
          "use strict";
          function s(e2, t2, r3) {
            var n2, i2 = u.getTypeOf(t2), s2 = u.extend(r3 || {}, f);
            s2.date = s2.date || /* @__PURE__ */ new Date(), null !== s2.compression && (s2.compression = s2.compression.toUpperCase()), "string" == typeof s2.unixPermissions && (s2.unixPermissions = parseInt(s2.unixPermissions, 8)), s2.unixPermissions && 16384 & s2.unixPermissions && (s2.dir = true), s2.dosPermissions && 16 & s2.dosPermissions && (s2.dir = true), s2.dir && (e2 = g(e2)), s2.createFolders && (n2 = _(e2)) && b.call(this, n2, true);
            var a2 = "string" === i2 && false === s2.binary && false === s2.base64;
            r3 && void 0 !== r3.binary || (s2.binary = !a2), (t2 instanceof c && 0 === t2.uncompressedSize || s2.dir || !t2 || 0 === t2.length) && (s2.base64 = false, s2.binary = true, t2 = "", s2.compression = "STORE", i2 = "string");
            var o2 = null;
            o2 = t2 instanceof c || t2 instanceof l ? t2 : p.isNode && p.isStream(t2) ? new m(e2, t2) : u.prepareContent(e2, t2, s2.binary, s2.optimizedBinaryString, s2.base64);
            var h2 = new d(e2, o2, s2);
            this.files[e2] = h2;
          }
          var i = e("./utf8"), u = e("./utils"), l = e("./stream/GenericWorker"), a = e("./stream/StreamHelper"), f = e("./defaults"), c = e("./compressedObject"), d = e("./zipObject"), o = e("./generate"), p = e("./nodejsUtils"), m = e("./nodejs/NodejsStreamInputAdapter"), _ = function(e2) {
            "/" === e2.slice(-1) && (e2 = e2.substring(0, e2.length - 1));
            var t2 = e2.lastIndexOf("/");
            return 0 < t2 ? e2.substring(0, t2) : "";
          }, g = function(e2) {
            return "/" !== e2.slice(-1) && (e2 += "/"), e2;
          }, b = function(e2, t2) {
            return t2 = void 0 !== t2 ? t2 : f.createFolders, e2 = g(e2), this.files[e2] || s.call(this, e2, null, { dir: true, createFolders: t2 }), this.files[e2];
          };
          function h(e2) {
            return "[object RegExp]" === Object.prototype.toString.call(e2);
          }
          var n = { load: function() {
            throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
          }, forEach: function(e2) {
            var t2, r3, n2;
            for (t2 in this.files)
              n2 = this.files[t2], (r3 = t2.slice(this.root.length, t2.length)) && t2.slice(0, this.root.length) === this.root && e2(r3, n2);
          }, filter: function(r3) {
            var n2 = [];
            return this.forEach(function(e2, t2) {
              r3(e2, t2) && n2.push(t2);
            }), n2;
          }, file: function(e2, t2, r3) {
            if (1 !== arguments.length)
              return e2 = this.root + e2, s.call(this, e2, t2, r3), this;
            if (h(e2)) {
              var n2 = e2;
              return this.filter(function(e3, t3) {
                return !t3.dir && n2.test(e3);
              });
            }
            var i2 = this.files[this.root + e2];
            return i2 && !i2.dir ? i2 : null;
          }, folder: function(r3) {
            if (!r3)
              return this;
            if (h(r3))
              return this.filter(function(e3, t3) {
                return t3.dir && r3.test(e3);
              });
            var e2 = this.root + r3, t2 = b.call(this, e2), n2 = this.clone();
            return n2.root = t2.name, n2;
          }, remove: function(r3) {
            r3 = this.root + r3;
            var e2 = this.files[r3];
            if (e2 || ("/" !== r3.slice(-1) && (r3 += "/"), e2 = this.files[r3]), e2 && !e2.dir)
              delete this.files[r3];
            else
              for (var t2 = this.filter(function(e3, t3) {
                return t3.name.slice(0, r3.length) === r3;
              }), n2 = 0; n2 < t2.length; n2++)
                delete this.files[t2[n2].name];
            return this;
          }, generate: function() {
            throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
          }, generateInternalStream: function(e2) {
            var t2, r3 = {};
            try {
              if ((r3 = u.extend(e2 || {}, { streamFiles: false, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: i.utf8encode })).type = r3.type.toLowerCase(), r3.compression = r3.compression.toUpperCase(), "binarystring" === r3.type && (r3.type = "string"), !r3.type)
                throw new Error("No output type specified.");
              u.checkSupport(r3.type), "darwin" !== r3.platform && "freebsd" !== r3.platform && "linux" !== r3.platform && "sunos" !== r3.platform || (r3.platform = "UNIX"), "win32" === r3.platform && (r3.platform = "DOS");
              var n2 = r3.comment || this.comment || "";
              t2 = o.generateWorker(this, r3, n2);
            } catch (e3) {
              (t2 = new l("error")).error(e3);
            }
            return new a(t2, r3.type || "string", r3.mimeType);
          }, generateAsync: function(e2, t2) {
            return this.generateInternalStream(e2).accumulate(t2);
          }, generateNodeStream: function(e2, t2) {
            return (e2 = e2 || {}).type || (e2.type = "nodebuffer"), this.generateInternalStream(e2).toNodejsStream(t2);
          } };
          t.exports = n;
        }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, t, r2) {
          "use strict";
          t.exports = e("stream");
        }, { stream: void 0 }], 17: [function(e, t, r2) {
          "use strict";
          var n = e("./DataReader");
          function i(e2) {
            n.call(this, e2);
            for (var t2 = 0; t2 < this.data.length; t2++)
              e2[t2] = 255 & e2[t2];
          }
          e("../utils").inherits(i, n), i.prototype.byteAt = function(e2) {
            return this.data[this.zero + e2];
          }, i.prototype.lastIndexOfSignature = function(e2) {
            for (var t2 = e2.charCodeAt(0), r3 = e2.charCodeAt(1), n2 = e2.charCodeAt(2), i2 = e2.charCodeAt(3), s = this.length - 4; 0 <= s; --s)
              if (this.data[s] === t2 && this.data[s + 1] === r3 && this.data[s + 2] === n2 && this.data[s + 3] === i2)
                return s - this.zero;
            return -1;
          }, i.prototype.readAndCheckSignature = function(e2) {
            var t2 = e2.charCodeAt(0), r3 = e2.charCodeAt(1), n2 = e2.charCodeAt(2), i2 = e2.charCodeAt(3), s = this.readData(4);
            return t2 === s[0] && r3 === s[1] && n2 === s[2] && i2 === s[3];
          }, i.prototype.readData = function(e2) {
            if (this.checkOffset(e2), 0 === e2)
              return [];
            var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
            return this.index += e2, t2;
          }, t.exports = i;
        }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, t, r2) {
          "use strict";
          var n = e("../utils");
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
          }, byteAt: function() {
          }, readInt: function(e2) {
            var t2, r3 = 0;
            for (this.checkOffset(e2), t2 = this.index + e2 - 1; t2 >= this.index; t2--)
              r3 = (r3 << 8) + this.byteAt(t2);
            return this.index += e2, r3;
          }, readString: function(e2) {
            return n.transformTo("string", this.readData(e2));
          }, readData: function() {
          }, lastIndexOfSignature: function() {
          }, readAndCheckSignature: function() {
          }, readDate: function() {
            var e2 = this.readInt(4);
            return new Date(Date.UTC(1980 + (e2 >> 25 & 127), (e2 >> 21 & 15) - 1, e2 >> 16 & 31, e2 >> 11 & 31, e2 >> 5 & 63, (31 & e2) << 1));
          } }, t.exports = i;
        }, { "../utils": 32 }], 19: [function(e, t, r2) {
          "use strict";
          var n = e("./Uint8ArrayReader");
          function i(e2) {
            n.call(this, e2);
          }
          e("../utils").inherits(i, n), i.prototype.readData = function(e2) {
            this.checkOffset(e2);
            var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
            return this.index += e2, t2;
          }, t.exports = i;
        }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, t, r2) {
          "use strict";
          var n = e("./DataReader");
          function i(e2) {
            n.call(this, e2);
          }
          e("../utils").inherits(i, n), i.prototype.byteAt = function(e2) {
            return this.data.charCodeAt(this.zero + e2);
          }, i.prototype.lastIndexOfSignature = function(e2) {
            return this.data.lastIndexOf(e2) - this.zero;
          }, i.prototype.readAndCheckSignature = function(e2) {
            return e2 === this.readData(4);
          }, i.prototype.readData = function(e2) {
            this.checkOffset(e2);
            var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
            return this.index += e2, t2;
          }, t.exports = i;
        }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, t, r2) {
          "use strict";
          var n = e("./ArrayReader");
          function i(e2) {
            n.call(this, e2);
          }
          e("../utils").inherits(i, n), i.prototype.readData = function(e2) {
            if (this.checkOffset(e2), 0 === e2)
              return new Uint8Array(0);
            var t2 = this.data.subarray(this.zero + this.index, this.zero + this.index + e2);
            return this.index += e2, t2;
          }, t.exports = i;
        }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, t, r2) {
          "use strict";
          var n = e("../utils"), i = e("../support"), s = e("./ArrayReader"), a = e("./StringReader"), o = e("./NodeBufferReader"), h = e("./Uint8ArrayReader");
          t.exports = function(e2) {
            var t2 = n.getTypeOf(e2);
            return n.checkSupport(t2), "string" !== t2 || i.uint8array ? "nodebuffer" === t2 ? new o(e2) : i.uint8array ? new h(n.transformTo("uint8array", e2)) : new s(n.transformTo("array", e2)) : new a(e2);
          };
        }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, t, r2) {
          "use strict";
          r2.LOCAL_FILE_HEADER = "PK", r2.CENTRAL_FILE_HEADER = "PK", r2.CENTRAL_DIRECTORY_END = "PK", r2.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", r2.ZIP64_CENTRAL_DIRECTORY_END = "PK", r2.DATA_DESCRIPTOR = "PK\x07\b";
        }, {}], 24: [function(e, t, r2) {
          "use strict";
          var n = e("./GenericWorker"), i = e("../utils");
          function s(e2) {
            n.call(this, "ConvertWorker to " + e2), this.destType = e2;
          }
          i.inherits(s, n), s.prototype.processChunk = function(e2) {
            this.push({ data: i.transformTo(this.destType, e2.data), meta: e2.meta });
          }, t.exports = s;
        }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, t, r2) {
          "use strict";
          var n = e("./GenericWorker"), i = e("../crc32");
          function s() {
            n.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
          }
          e("../utils").inherits(s, n), s.prototype.processChunk = function(e2) {
            this.streamInfo.crc32 = i(e2.data, this.streamInfo.crc32 || 0), this.push(e2);
          }, t.exports = s;
        }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, t, r2) {
          "use strict";
          var n = e("../utils"), i = e("./GenericWorker");
          function s(e2) {
            i.call(this, "DataLengthProbe for " + e2), this.propName = e2, this.withStreamInfo(e2, 0);
          }
          n.inherits(s, i), s.prototype.processChunk = function(e2) {
            if (e2) {
              var t2 = this.streamInfo[this.propName] || 0;
              this.streamInfo[this.propName] = t2 + e2.data.length;
            }
            i.prototype.processChunk.call(this, e2);
          }, t.exports = s;
        }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, t, r2) {
          "use strict";
          var n = e("../utils"), i = e("./GenericWorker");
          function s(e2) {
            i.call(this, "DataWorker");
            var t2 = this;
            this.dataIsReady = false, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = false, e2.then(function(e3) {
              t2.dataIsReady = true, t2.data = e3, t2.max = e3 && e3.length || 0, t2.type = n.getTypeOf(e3), t2.isPaused || t2._tickAndRepeat();
            }, function(e3) {
              t2.error(e3);
            });
          }
          n.inherits(s, i), s.prototype.cleanUp = function() {
            i.prototype.cleanUp.call(this), this.data = null;
          }, s.prototype.resume = function() {
            return !!i.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = true, n.delay(this._tickAndRepeat, [], this)), true);
          }, s.prototype._tickAndRepeat = function() {
            this._tickScheduled = false, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (n.delay(this._tickAndRepeat, [], this), this._tickScheduled = true));
          }, s.prototype._tick = function() {
            if (this.isPaused || this.isFinished)
              return false;
            var e2 = null, t2 = Math.min(this.max, this.index + 16384);
            if (this.index >= this.max)
              return this.end();
            switch (this.type) {
              case "string":
                e2 = this.data.substring(this.index, t2);
                break;
              case "uint8array":
                e2 = this.data.subarray(this.index, t2);
                break;
              case "array":
              case "nodebuffer":
                e2 = this.data.slice(this.index, t2);
            }
            return this.index = t2, this.push({ data: e2, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
          }, t.exports = s;
        }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, t, r2) {
          "use strict";
          function n(e2) {
            this.name = e2 || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = true, this.isFinished = false, this.isLocked = false, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
          }
          n.prototype = { push: function(e2) {
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
          }, on: function(e2, t2) {
            return this._listeners[e2].push(t2), this;
          }, cleanUp: function() {
            this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
          }, emit: function(e2, t2) {
            if (this._listeners[e2])
              for (var r3 = 0; r3 < this._listeners[e2].length; r3++)
                this._listeners[e2][r3].call(this, t2);
          }, pipe: function(e2) {
            return e2.registerPrevious(this);
          }, registerPrevious: function(e2) {
            if (this.isLocked)
              throw new Error("The stream '" + this + "' has already been used.");
            this.streamInfo = e2.streamInfo, this.mergeStreamInfo(), this.previous = e2;
            var t2 = this;
            return e2.on("data", function(e3) {
              t2.processChunk(e3);
            }), e2.on("end", function() {
              t2.end();
            }), e2.on("error", function(e3) {
              t2.error(e3);
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
          }, withStreamInfo: function(e2, t2) {
            return this.extraStreamInfo[e2] = t2, this.mergeStreamInfo(), this;
          }, mergeStreamInfo: function() {
            for (var e2 in this.extraStreamInfo)
              Object.prototype.hasOwnProperty.call(this.extraStreamInfo, e2) && (this.streamInfo[e2] = this.extraStreamInfo[e2]);
          }, lock: function() {
            if (this.isLocked)
              throw new Error("The stream '" + this + "' has already been used.");
            this.isLocked = true, this.previous && this.previous.lock();
          }, toString: function() {
            var e2 = "Worker " + this.name;
            return this.previous ? this.previous + " -> " + e2 : e2;
          } }, t.exports = n;
        }, {}], 29: [function(e, t, r2) {
          "use strict";
          var h = e("../utils"), i = e("./ConvertWorker"), s = e("./GenericWorker"), u = e("../base64"), n = e("../support"), a = e("../external"), o = null;
          if (n.nodestream)
            try {
              o = e("../nodejs/NodejsStreamOutputAdapter");
            } catch (e2) {
            }
          function l(e2, o2) {
            return new a.Promise(function(t2, r3) {
              var n2 = [], i2 = e2._internalType, s2 = e2._outputType, a2 = e2._mimeType;
              e2.on("data", function(e3, t3) {
                n2.push(e3), o2 && o2(t3);
              }).on("error", function(e3) {
                n2 = [], r3(e3);
              }).on("end", function() {
                try {
                  var e3 = function(e4, t3, r4) {
                    switch (e4) {
                      case "blob":
                        return h.newBlob(h.transformTo("arraybuffer", t3), r4);
                      case "base64":
                        return u.encode(t3);
                      default:
                        return h.transformTo(e4, t3);
                    }
                  }(s2, function(e4, t3) {
                    var r4, n3 = 0, i3 = null, s3 = 0;
                    for (r4 = 0; r4 < t3.length; r4++)
                      s3 += t3[r4].length;
                    switch (e4) {
                      case "string":
                        return t3.join("");
                      case "array":
                        return Array.prototype.concat.apply([], t3);
                      case "uint8array":
                        for (i3 = new Uint8Array(s3), r4 = 0; r4 < t3.length; r4++)
                          i3.set(t3[r4], n3), n3 += t3[r4].length;
                        return i3;
                      case "nodebuffer":
                        return Buffer.concat(t3);
                      default:
                        throw new Error("concat : unsupported type '" + e4 + "'");
                    }
                  }(i2, n2), a2);
                  t2(e3);
                } catch (e4) {
                  r3(e4);
                }
                n2 = [];
              }).resume();
            });
          }
          function f(e2, t2, r3) {
            var n2 = t2;
            switch (t2) {
              case "blob":
              case "arraybuffer":
                n2 = "uint8array";
                break;
              case "base64":
                n2 = "string";
            }
            try {
              this._internalType = n2, this._outputType = t2, this._mimeType = r3, h.checkSupport(n2), this._worker = e2.pipe(new i(n2)), e2.lock();
            } catch (e3) {
              this._worker = new s("error"), this._worker.error(e3);
            }
          }
          f.prototype = { accumulate: function(e2) {
            return l(this, e2);
          }, on: function(e2, t2) {
            var r3 = this;
            return "data" === e2 ? this._worker.on(e2, function(e3) {
              t2.call(r3, e3.data, e3.meta);
            }) : this._worker.on(e2, function() {
              h.delay(t2, arguments, r3);
            }), this;
          }, resume: function() {
            return h.delay(this._worker.resume, [], this._worker), this;
          }, pause: function() {
            return this._worker.pause(), this;
          }, toNodejsStream: function(e2) {
            if (h.checkSupport("nodestream"), "nodebuffer" !== this._outputType)
              throw new Error(this._outputType + " is not supported by this method");
            return new o(this, { objectMode: "nodebuffer" !== this._outputType }, e2);
          } }, t.exports = f;
        }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, t, r2) {
          "use strict";
          if (r2.base64 = true, r2.array = true, r2.string = true, r2.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array, r2.nodebuffer = "undefined" != typeof Buffer, r2.uint8array = "undefined" != typeof Uint8Array, "undefined" == typeof ArrayBuffer)
            r2.blob = false;
          else {
            var n = new ArrayBuffer(0);
            try {
              r2.blob = 0 === new Blob([n], { type: "application/zip" }).size;
            } catch (e2) {
              try {
                var i = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
                i.append(n), r2.blob = 0 === i.getBlob("application/zip").size;
              } catch (e3) {
                r2.blob = false;
              }
            }
          }
          try {
            r2.nodestream = !!e("readable-stream").Readable;
          } catch (e2) {
            r2.nodestream = false;
          }
        }, { "readable-stream": 16 }], 31: [function(e, t, s) {
          "use strict";
          for (var o = e("./utils"), h = e("./support"), r2 = e("./nodejsUtils"), n = e("./stream/GenericWorker"), u = new Array(256), i = 0; i < 256; i++)
            u[i] = 252 <= i ? 6 : 248 <= i ? 5 : 240 <= i ? 4 : 224 <= i ? 3 : 192 <= i ? 2 : 1;
          u[254] = u[254] = 1;
          function a() {
            n.call(this, "utf-8 decode"), this.leftOver = null;
          }
          function l() {
            n.call(this, "utf-8 encode");
          }
          s.utf8encode = function(e2) {
            return h.nodebuffer ? r2.newBufferFrom(e2, "utf-8") : function(e3) {
              var t2, r3, n2, i2, s2, a2 = e3.length, o2 = 0;
              for (i2 = 0; i2 < a2; i2++)
                55296 == (64512 & (r3 = e3.charCodeAt(i2))) && i2 + 1 < a2 && 56320 == (64512 & (n2 = e3.charCodeAt(i2 + 1))) && (r3 = 65536 + (r3 - 55296 << 10) + (n2 - 56320), i2++), o2 += r3 < 128 ? 1 : r3 < 2048 ? 2 : r3 < 65536 ? 3 : 4;
              for (t2 = h.uint8array ? new Uint8Array(o2) : new Array(o2), i2 = s2 = 0; s2 < o2; i2++)
                55296 == (64512 & (r3 = e3.charCodeAt(i2))) && i2 + 1 < a2 && 56320 == (64512 & (n2 = e3.charCodeAt(i2 + 1))) && (r3 = 65536 + (r3 - 55296 << 10) + (n2 - 56320), i2++), r3 < 128 ? t2[s2++] = r3 : (r3 < 2048 ? t2[s2++] = 192 | r3 >>> 6 : (r3 < 65536 ? t2[s2++] = 224 | r3 >>> 12 : (t2[s2++] = 240 | r3 >>> 18, t2[s2++] = 128 | r3 >>> 12 & 63), t2[s2++] = 128 | r3 >>> 6 & 63), t2[s2++] = 128 | 63 & r3);
              return t2;
            }(e2);
          }, s.utf8decode = function(e2) {
            return h.nodebuffer ? o.transformTo("nodebuffer", e2).toString("utf-8") : function(e3) {
              var t2, r3, n2, i2, s2 = e3.length, a2 = new Array(2 * s2);
              for (t2 = r3 = 0; t2 < s2; )
                if ((n2 = e3[t2++]) < 128)
                  a2[r3++] = n2;
                else if (4 < (i2 = u[n2]))
                  a2[r3++] = 65533, t2 += i2 - 1;
                else {
                  for (n2 &= 2 === i2 ? 31 : 3 === i2 ? 15 : 7; 1 < i2 && t2 < s2; )
                    n2 = n2 << 6 | 63 & e3[t2++], i2--;
                  1 < i2 ? a2[r3++] = 65533 : n2 < 65536 ? a2[r3++] = n2 : (n2 -= 65536, a2[r3++] = 55296 | n2 >> 10 & 1023, a2[r3++] = 56320 | 1023 & n2);
                }
              return a2.length !== r3 && (a2.subarray ? a2 = a2.subarray(0, r3) : a2.length = r3), o.applyFromCharCode(a2);
            }(e2 = o.transformTo(h.uint8array ? "uint8array" : "array", e2));
          }, o.inherits(a, n), a.prototype.processChunk = function(e2) {
            var t2 = o.transformTo(h.uint8array ? "uint8array" : "array", e2.data);
            if (this.leftOver && this.leftOver.length) {
              if (h.uint8array) {
                var r3 = t2;
                (t2 = new Uint8Array(r3.length + this.leftOver.length)).set(this.leftOver, 0), t2.set(r3, this.leftOver.length);
              } else
                t2 = this.leftOver.concat(t2);
              this.leftOver = null;
            }
            var n2 = function(e3, t3) {
              var r4;
              for ((t3 = t3 || e3.length) > e3.length && (t3 = e3.length), r4 = t3 - 1; 0 <= r4 && 128 == (192 & e3[r4]); )
                r4--;
              return r4 < 0 ? t3 : 0 === r4 ? t3 : r4 + u[e3[r4]] > t3 ? r4 : t3;
            }(t2), i2 = t2;
            n2 !== t2.length && (h.uint8array ? (i2 = t2.subarray(0, n2), this.leftOver = t2.subarray(n2, t2.length)) : (i2 = t2.slice(0, n2), this.leftOver = t2.slice(n2, t2.length))), this.push({ data: s.utf8decode(i2), meta: e2.meta });
          }, a.prototype.flush = function() {
            this.leftOver && this.leftOver.length && (this.push({ data: s.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
          }, s.Utf8DecodeWorker = a, o.inherits(l, n), l.prototype.processChunk = function(e2) {
            this.push({ data: s.utf8encode(e2.data), meta: e2.meta });
          }, s.Utf8EncodeWorker = l;
        }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, t, a) {
          "use strict";
          var o = e("./support"), h = e("./base64"), r2 = e("./nodejsUtils"), u = e("./external");
          function n(e2) {
            return e2;
          }
          function l(e2, t2) {
            for (var r3 = 0; r3 < e2.length; ++r3)
              t2[r3] = 255 & e2.charCodeAt(r3);
            return t2;
          }
          e("setimmediate"), a.newBlob = function(t2, r3) {
            a.checkSupport("blob");
            try {
              return new Blob([t2], { type: r3 });
            } catch (e2) {
              try {
                var n2 = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
                return n2.append(t2), n2.getBlob(r3);
              } catch (e3) {
                throw new Error("Bug : can't construct the Blob.");
              }
            }
          };
          var i = { stringifyByChunk: function(e2, t2, r3) {
            var n2 = [], i2 = 0, s2 = e2.length;
            if (s2 <= r3)
              return String.fromCharCode.apply(null, e2);
            for (; i2 < s2; )
              "array" === t2 || "nodebuffer" === t2 ? n2.push(String.fromCharCode.apply(null, e2.slice(i2, Math.min(i2 + r3, s2)))) : n2.push(String.fromCharCode.apply(null, e2.subarray(i2, Math.min(i2 + r3, s2)))), i2 += r3;
            return n2.join("");
          }, stringifyByChar: function(e2) {
            for (var t2 = "", r3 = 0; r3 < e2.length; r3++)
              t2 += String.fromCharCode(e2[r3]);
            return t2;
          }, applyCanBeUsed: { uint8array: function() {
            try {
              return o.uint8array && 1 === String.fromCharCode.apply(null, new Uint8Array(1)).length;
            } catch (e2) {
              return false;
            }
          }(), nodebuffer: function() {
            try {
              return o.nodebuffer && 1 === String.fromCharCode.apply(null, r2.allocBuffer(1)).length;
            } catch (e2) {
              return false;
            }
          }() } };
          function s(e2) {
            var t2 = 65536, r3 = a.getTypeOf(e2), n2 = true;
            if ("uint8array" === r3 ? n2 = i.applyCanBeUsed.uint8array : "nodebuffer" === r3 && (n2 = i.applyCanBeUsed.nodebuffer), n2)
              for (; 1 < t2; )
                try {
                  return i.stringifyByChunk(e2, r3, t2);
                } catch (e3) {
                  t2 = Math.floor(t2 / 2);
                }
            return i.stringifyByChar(e2);
          }
          function f(e2, t2) {
            for (var r3 = 0; r3 < e2.length; r3++)
              t2[r3] = e2[r3];
            return t2;
          }
          a.applyFromCharCode = s;
          var c = {};
          c.string = { string: n, array: function(e2) {
            return l(e2, new Array(e2.length));
          }, arraybuffer: function(e2) {
            return c.string.uint8array(e2).buffer;
          }, uint8array: function(e2) {
            return l(e2, new Uint8Array(e2.length));
          }, nodebuffer: function(e2) {
            return l(e2, r2.allocBuffer(e2.length));
          } }, c.array = { string: s, array: n, arraybuffer: function(e2) {
            return new Uint8Array(e2).buffer;
          }, uint8array: function(e2) {
            return new Uint8Array(e2);
          }, nodebuffer: function(e2) {
            return r2.newBufferFrom(e2);
          } }, c.arraybuffer = { string: function(e2) {
            return s(new Uint8Array(e2));
          }, array: function(e2) {
            return f(new Uint8Array(e2), new Array(e2.byteLength));
          }, arraybuffer: n, uint8array: function(e2) {
            return new Uint8Array(e2);
          }, nodebuffer: function(e2) {
            return r2.newBufferFrom(new Uint8Array(e2));
          } }, c.uint8array = { string: s, array: function(e2) {
            return f(e2, new Array(e2.length));
          }, arraybuffer: function(e2) {
            return e2.buffer;
          }, uint8array: n, nodebuffer: function(e2) {
            return r2.newBufferFrom(e2);
          } }, c.nodebuffer = { string: s, array: function(e2) {
            return f(e2, new Array(e2.length));
          }, arraybuffer: function(e2) {
            return c.nodebuffer.uint8array(e2).buffer;
          }, uint8array: function(e2) {
            return f(e2, new Uint8Array(e2.length));
          }, nodebuffer: n }, a.transformTo = function(e2, t2) {
            if (t2 = t2 || "", !e2)
              return t2;
            a.checkSupport(e2);
            var r3 = a.getTypeOf(t2);
            return c[r3][e2](t2);
          }, a.resolve = function(e2) {
            for (var t2 = e2.split("/"), r3 = [], n2 = 0; n2 < t2.length; n2++) {
              var i2 = t2[n2];
              "." === i2 || "" === i2 && 0 !== n2 && n2 !== t2.length - 1 || (".." === i2 ? r3.pop() : r3.push(i2));
            }
            return r3.join("/");
          }, a.getTypeOf = function(e2) {
            return "string" == typeof e2 ? "string" : "[object Array]" === Object.prototype.toString.call(e2) ? "array" : o.nodebuffer && r2.isBuffer(e2) ? "nodebuffer" : o.uint8array && e2 instanceof Uint8Array ? "uint8array" : o.arraybuffer && e2 instanceof ArrayBuffer ? "arraybuffer" : void 0;
          }, a.checkSupport = function(e2) {
            if (!o[e2.toLowerCase()])
              throw new Error(e2 + " is not supported by this platform");
          }, a.MAX_VALUE_16BITS = 65535, a.MAX_VALUE_32BITS = -1, a.pretty = function(e2) {
            var t2, r3, n2 = "";
            for (r3 = 0; r3 < (e2 || "").length; r3++)
              n2 += "\\x" + ((t2 = e2.charCodeAt(r3)) < 16 ? "0" : "") + t2.toString(16).toUpperCase();
            return n2;
          }, a.delay = function(e2, t2, r3) {
            setImmediate(function() {
              e2.apply(r3 || null, t2 || []);
            });
          }, a.inherits = function(e2, t2) {
            function r3() {
            }
            r3.prototype = t2.prototype, e2.prototype = new r3();
          }, a.extend = function() {
            var e2, t2, r3 = {};
            for (e2 = 0; e2 < arguments.length; e2++)
              for (t2 in arguments[e2])
                Object.prototype.hasOwnProperty.call(arguments[e2], t2) && void 0 === r3[t2] && (r3[t2] = arguments[e2][t2]);
            return r3;
          }, a.prepareContent = function(r3, e2, n2, i2, s2) {
            return u.Promise.resolve(e2).then(function(n3) {
              return o.blob && (n3 instanceof Blob || -1 !== ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(n3))) && "undefined" != typeof FileReader ? new u.Promise(function(t2, r4) {
                var e3 = new FileReader();
                e3.onload = function(e4) {
                  t2(e4.target.result);
                }, e3.onerror = function(e4) {
                  r4(e4.target.error);
                }, e3.readAsArrayBuffer(n3);
              }) : n3;
            }).then(function(e3) {
              var t2 = a.getTypeOf(e3);
              return t2 ? ("arraybuffer" === t2 ? e3 = a.transformTo("uint8array", e3) : "string" === t2 && (s2 ? e3 = h.decode(e3) : n2 && true !== i2 && (e3 = function(e4) {
                return l(e4, o.uint8array ? new Uint8Array(e4.length) : new Array(e4.length));
              }(e3))), e3) : u.Promise.reject(new Error("Can't read the data of '" + r3 + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
            });
          };
        }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, t, r2) {
          "use strict";
          var n = e("./reader/readerFor"), i = e("./utils"), s = e("./signature"), a = e("./zipEntry"), o = e("./support");
          function h(e2) {
            this.files = [], this.loadOptions = e2;
          }
          h.prototype = { checkSignature: function(e2) {
            if (!this.reader.readAndCheckSignature(e2)) {
              this.reader.index -= 4;
              var t2 = this.reader.readString(4);
              throw new Error("Corrupted zip or bug: unexpected signature (" + i.pretty(t2) + ", expected " + i.pretty(e2) + ")");
            }
          }, isSignature: function(e2, t2) {
            var r3 = this.reader.index;
            this.reader.setIndex(e2);
            var n2 = this.reader.readString(4) === t2;
            return this.reader.setIndex(r3), n2;
          }, readBlockEndOfCentral: function() {
            this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
            var e2 = this.reader.readData(this.zipCommentLength), t2 = o.uint8array ? "uint8array" : "array", r3 = i.transformTo(t2, e2);
            this.zipComment = this.loadOptions.decodeFileName(r3);
          }, readBlockZip64EndOfCentral: function() {
            this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
            for (var e2, t2, r3, n2 = this.zip64EndOfCentralSize - 44; 0 < n2; )
              e2 = this.reader.readInt(2), t2 = this.reader.readInt(4), r3 = this.reader.readData(t2), this.zip64ExtensibleData[e2] = { id: e2, length: t2, value: r3 };
          }, readBlockZip64EndOfCentralLocator: function() {
            if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount)
              throw new Error("Multi-volumes zip are not supported");
          }, readLocalFiles: function() {
            var e2, t2;
            for (e2 = 0; e2 < this.files.length; e2++)
              t2 = this.files[e2], this.reader.setIndex(t2.localHeaderOffset), this.checkSignature(s.LOCAL_FILE_HEADER), t2.readLocalPart(this.reader), t2.handleUTF8(), t2.processAttributes();
          }, readCentralDir: function() {
            var e2;
            for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER); )
              (e2 = new a({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(e2);
            if (this.centralDirRecords !== this.files.length && 0 !== this.centralDirRecords && 0 === this.files.length)
              throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
          }, readEndOfCentral: function() {
            var e2 = this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);
            if (e2 < 0)
              throw !this.isSignature(0, s.LOCAL_FILE_HEADER) ? new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html") : new Error("Corrupted zip: can't find end of central directory");
            this.reader.setIndex(e2);
            var t2 = e2;
            if (this.checkSignature(s.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === i.MAX_VALUE_16BITS || this.diskWithCentralDirStart === i.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === i.MAX_VALUE_16BITS || this.centralDirRecords === i.MAX_VALUE_16BITS || this.centralDirSize === i.MAX_VALUE_32BITS || this.centralDirOffset === i.MAX_VALUE_32BITS) {
              if (this.zip64 = true, (e2 = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0)
                throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
              if (this.reader.setIndex(e2), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, s.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0))
                throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
              this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
            }
            var r3 = this.centralDirOffset + this.centralDirSize;
            this.zip64 && (r3 += 20, r3 += 12 + this.zip64EndOfCentralSize);
            var n2 = t2 - r3;
            if (0 < n2)
              this.isSignature(t2, s.CENTRAL_FILE_HEADER) || (this.reader.zero = n2);
            else if (n2 < 0)
              throw new Error("Corrupted zip: missing " + Math.abs(n2) + " bytes.");
          }, prepareReader: function(e2) {
            this.reader = n(e2);
          }, load: function(e2) {
            this.prepareReader(e2), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
          } }, t.exports = h;
        }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, t, r2) {
          "use strict";
          var n = e("./reader/readerFor"), s = e("./utils"), i = e("./compressedObject"), a = e("./crc32"), o = e("./utf8"), h = e("./compressions"), u = e("./support");
          function l(e2, t2) {
            this.options = e2, this.loadOptions = t2;
          }
          l.prototype = { isEncrypted: function() {
            return 1 == (1 & this.bitFlag);
          }, useUTF8: function() {
            return 2048 == (2048 & this.bitFlag);
          }, readLocalPart: function(e2) {
            var t2, r3;
            if (e2.skip(22), this.fileNameLength = e2.readInt(2), r3 = e2.readInt(2), this.fileName = e2.readData(this.fileNameLength), e2.skip(r3), -1 === this.compressedSize || -1 === this.uncompressedSize)
              throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
            if (null === (t2 = function(e3) {
              for (var t3 in h)
                if (Object.prototype.hasOwnProperty.call(h, t3) && h[t3].magic === e3)
                  return h[t3];
              return null;
            }(this.compressionMethod)))
              throw new Error("Corrupted zip : compression " + s.pretty(this.compressionMethod) + " unknown (inner file : " + s.transformTo("string", this.fileName) + ")");
            this.decompressed = new i(this.compressedSize, this.uncompressedSize, this.crc32, t2, e2.readData(this.compressedSize));
          }, readCentralPart: function(e2) {
            this.versionMadeBy = e2.readInt(2), e2.skip(2), this.bitFlag = e2.readInt(2), this.compressionMethod = e2.readString(2), this.date = e2.readDate(), this.crc32 = e2.readInt(4), this.compressedSize = e2.readInt(4), this.uncompressedSize = e2.readInt(4);
            var t2 = e2.readInt(2);
            if (this.extraFieldsLength = e2.readInt(2), this.fileCommentLength = e2.readInt(2), this.diskNumberStart = e2.readInt(2), this.internalFileAttributes = e2.readInt(2), this.externalFileAttributes = e2.readInt(4), this.localHeaderOffset = e2.readInt(4), this.isEncrypted())
              throw new Error("Encrypted zip are not supported");
            e2.skip(t2), this.readExtraFields(e2), this.parseZIP64ExtraField(e2), this.fileComment = e2.readData(this.fileCommentLength);
          }, processAttributes: function() {
            this.unixPermissions = null, this.dosPermissions = null;
            var e2 = this.versionMadeBy >> 8;
            this.dir = !!(16 & this.externalFileAttributes), 0 == e2 && (this.dosPermissions = 63 & this.externalFileAttributes), 3 == e2 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || "/" !== this.fileNameStr.slice(-1) || (this.dir = true);
          }, parseZIP64ExtraField: function() {
            if (this.extraFields[1]) {
              var e2 = n(this.extraFields[1].value);
              this.uncompressedSize === s.MAX_VALUE_32BITS && (this.uncompressedSize = e2.readInt(8)), this.compressedSize === s.MAX_VALUE_32BITS && (this.compressedSize = e2.readInt(8)), this.localHeaderOffset === s.MAX_VALUE_32BITS && (this.localHeaderOffset = e2.readInt(8)), this.diskNumberStart === s.MAX_VALUE_32BITS && (this.diskNumberStart = e2.readInt(4));
            }
          }, readExtraFields: function(e2) {
            var t2, r3, n2, i2 = e2.index + this.extraFieldsLength;
            for (this.extraFields || (this.extraFields = {}); e2.index + 4 < i2; )
              t2 = e2.readInt(2), r3 = e2.readInt(2), n2 = e2.readData(r3), this.extraFields[t2] = { id: t2, length: r3, value: n2 };
            e2.setIndex(i2);
          }, handleUTF8: function() {
            var e2 = u.uint8array ? "uint8array" : "array";
            if (this.useUTF8())
              this.fileNameStr = o.utf8decode(this.fileName), this.fileCommentStr = o.utf8decode(this.fileComment);
            else {
              var t2 = this.findExtraFieldUnicodePath();
              if (null !== t2)
                this.fileNameStr = t2;
              else {
                var r3 = s.transformTo(e2, this.fileName);
                this.fileNameStr = this.loadOptions.decodeFileName(r3);
              }
              var n2 = this.findExtraFieldUnicodeComment();
              if (null !== n2)
                this.fileCommentStr = n2;
              else {
                var i2 = s.transformTo(e2, this.fileComment);
                this.fileCommentStr = this.loadOptions.decodeFileName(i2);
              }
            }
          }, findExtraFieldUnicodePath: function() {
            var e2 = this.extraFields[28789];
            if (e2) {
              var t2 = n(e2.value);
              return 1 !== t2.readInt(1) ? null : a(this.fileName) !== t2.readInt(4) ? null : o.utf8decode(t2.readData(e2.length - 5));
            }
            return null;
          }, findExtraFieldUnicodeComment: function() {
            var e2 = this.extraFields[25461];
            if (e2) {
              var t2 = n(e2.value);
              return 1 !== t2.readInt(1) ? null : a(this.fileComment) !== t2.readInt(4) ? null : o.utf8decode(t2.readData(e2.length - 5));
            }
            return null;
          } }, t.exports = l;
        }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, t, r2) {
          "use strict";
          function n(e2, t2, r3) {
            this.name = e2, this.dir = r3.dir, this.date = r3.date, this.comment = r3.comment, this.unixPermissions = r3.unixPermissions, this.dosPermissions = r3.dosPermissions, this._data = t2, this._dataBinary = r3.binary, this.options = { compression: r3.compression, compressionOptions: r3.compressionOptions };
          }
          var s = e("./stream/StreamHelper"), i = e("./stream/DataWorker"), a = e("./utf8"), o = e("./compressedObject"), h = e("./stream/GenericWorker");
          n.prototype = { internalStream: function(e2) {
            var t2 = null, r3 = "string";
            try {
              if (!e2)
                throw new Error("No output type specified.");
              var n2 = "string" === (r3 = e2.toLowerCase()) || "text" === r3;
              "binarystring" !== r3 && "text" !== r3 || (r3 = "string"), t2 = this._decompressWorker();
              var i2 = !this._dataBinary;
              i2 && !n2 && (t2 = t2.pipe(new a.Utf8EncodeWorker())), !i2 && n2 && (t2 = t2.pipe(new a.Utf8DecodeWorker()));
            } catch (e3) {
              (t2 = new h("error")).error(e3);
            }
            return new s(t2, r3, "");
          }, async: function(e2, t2) {
            return this.internalStream(e2).accumulate(t2);
          }, nodeStream: function(e2, t2) {
            return this.internalStream(e2 || "nodebuffer").toNodejsStream(t2);
          }, _compressWorker: function(e2, t2) {
            if (this._data instanceof o && this._data.compression.magic === e2.magic)
              return this._data.getCompressedWorker();
            var r3 = this._decompressWorker();
            return this._dataBinary || (r3 = r3.pipe(new a.Utf8EncodeWorker())), o.createWorkerFrom(r3, e2, t2);
          }, _decompressWorker: function() {
            return this._data instanceof o ? this._data.getContentWorker() : this._data instanceof h ? this._data : new i(this._data);
          } };
          for (var u = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], l = function() {
            throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
          }, f = 0; f < u.length; f++)
            n.prototype[u[f]] = l;
          t.exports = n;
        }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, l, t) {
          (function(t2) {
            "use strict";
            var r2, n, e2 = t2.MutationObserver || t2.WebKitMutationObserver;
            if (e2) {
              var i = 0, s = new e2(u), a = t2.document.createTextNode("");
              s.observe(a, { characterData: true }), r2 = function() {
                a.data = i = ++i % 2;
              };
            } else if (t2.setImmediate || void 0 === t2.MessageChannel)
              r2 = "document" in t2 && "onreadystatechange" in t2.document.createElement("script") ? function() {
                var e3 = t2.document.createElement("script");
                e3.onreadystatechange = function() {
                  u(), e3.onreadystatechange = null, e3.parentNode.removeChild(e3), e3 = null;
                }, t2.document.documentElement.appendChild(e3);
              } : function() {
                setTimeout(u, 0);
              };
            else {
              var o = new t2.MessageChannel();
              o.port1.onmessage = u, r2 = function() {
                o.port2.postMessage(0);
              };
            }
            var h = [];
            function u() {
              var e3, t3;
              n = true;
              for (var r3 = h.length; r3; ) {
                for (t3 = h, h = [], e3 = -1; ++e3 < r3; )
                  t3[e3]();
                r3 = h.length;
              }
              n = false;
            }
            l.exports = function(e3) {
              1 !== h.push(e3) || n || r2();
            };
          }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
        }, {}], 37: [function(e, t, r2) {
          "use strict";
          var i = e("immediate");
          function u() {
          }
          var l = {}, s = ["REJECTED"], a = ["FULFILLED"], n = ["PENDING"];
          function o(e2) {
            if ("function" != typeof e2)
              throw new TypeError("resolver must be a function");
            this.state = n, this.queue = [], this.outcome = void 0, e2 !== u && d(this, e2);
          }
          function h(e2, t2, r3) {
            this.promise = e2, "function" == typeof t2 && (this.onFulfilled = t2, this.callFulfilled = this.otherCallFulfilled), "function" == typeof r3 && (this.onRejected = r3, this.callRejected = this.otherCallRejected);
          }
          function f(t2, r3, n2) {
            i(function() {
              var e2;
              try {
                e2 = r3(n2);
              } catch (e3) {
                return l.reject(t2, e3);
              }
              e2 === t2 ? l.reject(t2, new TypeError("Cannot resolve promise with itself")) : l.resolve(t2, e2);
            });
          }
          function c(e2) {
            var t2 = e2 && e2.then;
            if (e2 && ("object" == typeof e2 || "function" == typeof e2) && "function" == typeof t2)
              return function() {
                t2.apply(e2, arguments);
              };
          }
          function d(t2, e2) {
            var r3 = false;
            function n2(e3) {
              r3 || (r3 = true, l.reject(t2, e3));
            }
            function i2(e3) {
              r3 || (r3 = true, l.resolve(t2, e3));
            }
            var s2 = p(function() {
              e2(i2, n2);
            });
            "error" === s2.status && n2(s2.value);
          }
          function p(e2, t2) {
            var r3 = {};
            try {
              r3.value = e2(t2), r3.status = "success";
            } catch (e3) {
              r3.status = "error", r3.value = e3;
            }
            return r3;
          }
          (t.exports = o).prototype.finally = function(t2) {
            if ("function" != typeof t2)
              return this;
            var r3 = this.constructor;
            return this.then(function(e2) {
              return r3.resolve(t2()).then(function() {
                return e2;
              });
            }, function(e2) {
              return r3.resolve(t2()).then(function() {
                throw e2;
              });
            });
          }, o.prototype.catch = function(e2) {
            return this.then(null, e2);
          }, o.prototype.then = function(e2, t2) {
            if ("function" != typeof e2 && this.state === a || "function" != typeof t2 && this.state === s)
              return this;
            var r3 = new this.constructor(u);
            this.state !== n ? f(r3, this.state === a ? e2 : t2, this.outcome) : this.queue.push(new h(r3, e2, t2));
            return r3;
          }, h.prototype.callFulfilled = function(e2) {
            l.resolve(this.promise, e2);
          }, h.prototype.otherCallFulfilled = function(e2) {
            f(this.promise, this.onFulfilled, e2);
          }, h.prototype.callRejected = function(e2) {
            l.reject(this.promise, e2);
          }, h.prototype.otherCallRejected = function(e2) {
            f(this.promise, this.onRejected, e2);
          }, l.resolve = function(e2, t2) {
            var r3 = p(c, t2);
            if ("error" === r3.status)
              return l.reject(e2, r3.value);
            var n2 = r3.value;
            if (n2)
              d(e2, n2);
            else {
              e2.state = a, e2.outcome = t2;
              for (var i2 = -1, s2 = e2.queue.length; ++i2 < s2; )
                e2.queue[i2].callFulfilled(t2);
            }
            return e2;
          }, l.reject = function(e2, t2) {
            e2.state = s, e2.outcome = t2;
            for (var r3 = -1, n2 = e2.queue.length; ++r3 < n2; )
              e2.queue[r3].callRejected(t2);
            return e2;
          }, o.resolve = function(e2) {
            if (e2 instanceof this)
              return e2;
            return l.resolve(new this(u), e2);
          }, o.reject = function(e2) {
            var t2 = new this(u);
            return l.reject(t2, e2);
          }, o.all = function(e2) {
            var r3 = this;
            if ("[object Array]" !== Object.prototype.toString.call(e2))
              return this.reject(new TypeError("must be an array"));
            var n2 = e2.length, i2 = false;
            if (!n2)
              return this.resolve([]);
            var s2 = new Array(n2), a2 = 0, t2 = -1, o2 = new this(u);
            for (; ++t2 < n2; )
              h2(e2[t2], t2);
            return o2;
            function h2(e3, t3) {
              r3.resolve(e3).then(function(e4) {
                s2[t3] = e4, ++a2 !== n2 || i2 || (i2 = true, l.resolve(o2, s2));
              }, function(e4) {
                i2 || (i2 = true, l.reject(o2, e4));
              });
            }
          }, o.race = function(e2) {
            var t2 = this;
            if ("[object Array]" !== Object.prototype.toString.call(e2))
              return this.reject(new TypeError("must be an array"));
            var r3 = e2.length, n2 = false;
            if (!r3)
              return this.resolve([]);
            var i2 = -1, s2 = new this(u);
            for (; ++i2 < r3; )
              a2 = e2[i2], t2.resolve(a2).then(function(e3) {
                n2 || (n2 = true, l.resolve(s2, e3));
              }, function(e3) {
                n2 || (n2 = true, l.reject(s2, e3));
              });
            var a2;
            return s2;
          };
        }, { immediate: 36 }], 38: [function(e, t, r2) {
          "use strict";
          var n = {};
          (0, e("./lib/utils/common").assign)(n, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), t.exports = n;
        }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, t, r2) {
          "use strict";
          var a = e("./zlib/deflate"), o = e("./utils/common"), h = e("./utils/strings"), i = e("./zlib/messages"), s = e("./zlib/zstream"), u = Object.prototype.toString, l = 0, f = -1, c = 0, d = 8;
          function p(e2) {
            if (!(this instanceof p))
              return new p(e2);
            this.options = o.assign({ level: f, method: d, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: c, to: "" }, e2 || {});
            var t2 = this.options;
            t2.raw && 0 < t2.windowBits ? t2.windowBits = -t2.windowBits : t2.gzip && 0 < t2.windowBits && t2.windowBits < 16 && (t2.windowBits += 16), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new s(), this.strm.avail_out = 0;
            var r3 = a.deflateInit2(this.strm, t2.level, t2.method, t2.windowBits, t2.memLevel, t2.strategy);
            if (r3 !== l)
              throw new Error(i[r3]);
            if (t2.header && a.deflateSetHeader(this.strm, t2.header), t2.dictionary) {
              var n2;
              if (n2 = "string" == typeof t2.dictionary ? h.string2buf(t2.dictionary) : "[object ArrayBuffer]" === u.call(t2.dictionary) ? new Uint8Array(t2.dictionary) : t2.dictionary, (r3 = a.deflateSetDictionary(this.strm, n2)) !== l)
                throw new Error(i[r3]);
              this._dict_set = true;
            }
          }
          function n(e2, t2) {
            var r3 = new p(t2);
            if (r3.push(e2, true), r3.err)
              throw r3.msg || i[r3.err];
            return r3.result;
          }
          p.prototype.push = function(e2, t2) {
            var r3, n2, i2 = this.strm, s2 = this.options.chunkSize;
            if (this.ended)
              return false;
            n2 = t2 === ~~t2 ? t2 : true === t2 ? 4 : 0, "string" == typeof e2 ? i2.input = h.string2buf(e2) : "[object ArrayBuffer]" === u.call(e2) ? i2.input = new Uint8Array(e2) : i2.input = e2, i2.next_in = 0, i2.avail_in = i2.input.length;
            do {
              if (0 === i2.avail_out && (i2.output = new o.Buf8(s2), i2.next_out = 0, i2.avail_out = s2), 1 !== (r3 = a.deflate(i2, n2)) && r3 !== l)
                return this.onEnd(r3), !(this.ended = true);
              0 !== i2.avail_out && (0 !== i2.avail_in || 4 !== n2 && 2 !== n2) || ("string" === this.options.to ? this.onData(h.buf2binstring(o.shrinkBuf(i2.output, i2.next_out))) : this.onData(o.shrinkBuf(i2.output, i2.next_out)));
            } while ((0 < i2.avail_in || 0 === i2.avail_out) && 1 !== r3);
            return 4 === n2 ? (r3 = a.deflateEnd(this.strm), this.onEnd(r3), this.ended = true, r3 === l) : 2 !== n2 || (this.onEnd(l), !(i2.avail_out = 0));
          }, p.prototype.onData = function(e2) {
            this.chunks.push(e2);
          }, p.prototype.onEnd = function(e2) {
            e2 === l && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
          }, r2.Deflate = p, r2.deflate = n, r2.deflateRaw = function(e2, t2) {
            return (t2 = t2 || {}).raw = true, n(e2, t2);
          }, r2.gzip = function(e2, t2) {
            return (t2 = t2 || {}).gzip = true, n(e2, t2);
          };
        }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, t, r2) {
          "use strict";
          var c = e("./zlib/inflate"), d = e("./utils/common"), p = e("./utils/strings"), m = e("./zlib/constants"), n = e("./zlib/messages"), i = e("./zlib/zstream"), s = e("./zlib/gzheader"), _ = Object.prototype.toString;
          function a(e2) {
            if (!(this instanceof a))
              return new a(e2);
            this.options = d.assign({ chunkSize: 16384, windowBits: 0, to: "" }, e2 || {});
            var t2 = this.options;
            t2.raw && 0 <= t2.windowBits && t2.windowBits < 16 && (t2.windowBits = -t2.windowBits, 0 === t2.windowBits && (t2.windowBits = -15)), !(0 <= t2.windowBits && t2.windowBits < 16) || e2 && e2.windowBits || (t2.windowBits += 32), 15 < t2.windowBits && t2.windowBits < 48 && 0 == (15 & t2.windowBits) && (t2.windowBits |= 15), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new i(), this.strm.avail_out = 0;
            var r3 = c.inflateInit2(this.strm, t2.windowBits);
            if (r3 !== m.Z_OK)
              throw new Error(n[r3]);
            this.header = new s(), c.inflateGetHeader(this.strm, this.header);
          }
          function o(e2, t2) {
            var r3 = new a(t2);
            if (r3.push(e2, true), r3.err)
              throw r3.msg || n[r3.err];
            return r3.result;
          }
          a.prototype.push = function(e2, t2) {
            var r3, n2, i2, s2, a2, o2, h = this.strm, u = this.options.chunkSize, l = this.options.dictionary, f = false;
            if (this.ended)
              return false;
            n2 = t2 === ~~t2 ? t2 : true === t2 ? m.Z_FINISH : m.Z_NO_FLUSH, "string" == typeof e2 ? h.input = p.binstring2buf(e2) : "[object ArrayBuffer]" === _.call(e2) ? h.input = new Uint8Array(e2) : h.input = e2, h.next_in = 0, h.avail_in = h.input.length;
            do {
              if (0 === h.avail_out && (h.output = new d.Buf8(u), h.next_out = 0, h.avail_out = u), (r3 = c.inflate(h, m.Z_NO_FLUSH)) === m.Z_NEED_DICT && l && (o2 = "string" == typeof l ? p.string2buf(l) : "[object ArrayBuffer]" === _.call(l) ? new Uint8Array(l) : l, r3 = c.inflateSetDictionary(this.strm, o2)), r3 === m.Z_BUF_ERROR && true === f && (r3 = m.Z_OK, f = false), r3 !== m.Z_STREAM_END && r3 !== m.Z_OK)
                return this.onEnd(r3), !(this.ended = true);
              h.next_out && (0 !== h.avail_out && r3 !== m.Z_STREAM_END && (0 !== h.avail_in || n2 !== m.Z_FINISH && n2 !== m.Z_SYNC_FLUSH) || ("string" === this.options.to ? (i2 = p.utf8border(h.output, h.next_out), s2 = h.next_out - i2, a2 = p.buf2string(h.output, i2), h.next_out = s2, h.avail_out = u - s2, s2 && d.arraySet(h.output, h.output, i2, s2, 0), this.onData(a2)) : this.onData(d.shrinkBuf(h.output, h.next_out)))), 0 === h.avail_in && 0 === h.avail_out && (f = true);
            } while ((0 < h.avail_in || 0 === h.avail_out) && r3 !== m.Z_STREAM_END);
            return r3 === m.Z_STREAM_END && (n2 = m.Z_FINISH), n2 === m.Z_FINISH ? (r3 = c.inflateEnd(this.strm), this.onEnd(r3), this.ended = true, r3 === m.Z_OK) : n2 !== m.Z_SYNC_FLUSH || (this.onEnd(m.Z_OK), !(h.avail_out = 0));
          }, a.prototype.onData = function(e2) {
            this.chunks.push(e2);
          }, a.prototype.onEnd = function(e2) {
            e2 === m.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = d.flattenChunks(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
          }, r2.Inflate = a, r2.inflate = o, r2.inflateRaw = function(e2, t2) {
            return (t2 = t2 || {}).raw = true, o(e2, t2);
          }, r2.ungzip = o;
        }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, t, r2) {
          "use strict";
          var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
          r2.assign = function(e2) {
            for (var t2 = Array.prototype.slice.call(arguments, 1); t2.length; ) {
              var r3 = t2.shift();
              if (r3) {
                if ("object" != typeof r3)
                  throw new TypeError(r3 + "must be non-object");
                for (var n2 in r3)
                  r3.hasOwnProperty(n2) && (e2[n2] = r3[n2]);
              }
            }
            return e2;
          }, r2.shrinkBuf = function(e2, t2) {
            return e2.length === t2 ? e2 : e2.subarray ? e2.subarray(0, t2) : (e2.length = t2, e2);
          };
          var i = { arraySet: function(e2, t2, r3, n2, i2) {
            if (t2.subarray && e2.subarray)
              e2.set(t2.subarray(r3, r3 + n2), i2);
            else
              for (var s2 = 0; s2 < n2; s2++)
                e2[i2 + s2] = t2[r3 + s2];
          }, flattenChunks: function(e2) {
            var t2, r3, n2, i2, s2, a;
            for (t2 = n2 = 0, r3 = e2.length; t2 < r3; t2++)
              n2 += e2[t2].length;
            for (a = new Uint8Array(n2), t2 = i2 = 0, r3 = e2.length; t2 < r3; t2++)
              s2 = e2[t2], a.set(s2, i2), i2 += s2.length;
            return a;
          } }, s = { arraySet: function(e2, t2, r3, n2, i2) {
            for (var s2 = 0; s2 < n2; s2++)
              e2[i2 + s2] = t2[r3 + s2];
          }, flattenChunks: function(e2) {
            return [].concat.apply([], e2);
          } };
          r2.setTyped = function(e2) {
            e2 ? (r2.Buf8 = Uint8Array, r2.Buf16 = Uint16Array, r2.Buf32 = Int32Array, r2.assign(r2, i)) : (r2.Buf8 = Array, r2.Buf16 = Array, r2.Buf32 = Array, r2.assign(r2, s));
          }, r2.setTyped(n);
        }, {}], 42: [function(e, t, r2) {
          "use strict";
          var h = e("./common"), i = true, s = true;
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
          for (var u = new h.Buf8(256), n = 0; n < 256; n++)
            u[n] = 252 <= n ? 6 : 248 <= n ? 5 : 240 <= n ? 4 : 224 <= n ? 3 : 192 <= n ? 2 : 1;
          function l(e2, t2) {
            if (t2 < 65537 && (e2.subarray && s || !e2.subarray && i))
              return String.fromCharCode.apply(null, h.shrinkBuf(e2, t2));
            for (var r3 = "", n2 = 0; n2 < t2; n2++)
              r3 += String.fromCharCode(e2[n2]);
            return r3;
          }
          u[254] = u[254] = 1, r2.string2buf = function(e2) {
            var t2, r3, n2, i2, s2, a = e2.length, o = 0;
            for (i2 = 0; i2 < a; i2++)
              55296 == (64512 & (r3 = e2.charCodeAt(i2))) && i2 + 1 < a && 56320 == (64512 & (n2 = e2.charCodeAt(i2 + 1))) && (r3 = 65536 + (r3 - 55296 << 10) + (n2 - 56320), i2++), o += r3 < 128 ? 1 : r3 < 2048 ? 2 : r3 < 65536 ? 3 : 4;
            for (t2 = new h.Buf8(o), i2 = s2 = 0; s2 < o; i2++)
              55296 == (64512 & (r3 = e2.charCodeAt(i2))) && i2 + 1 < a && 56320 == (64512 & (n2 = e2.charCodeAt(i2 + 1))) && (r3 = 65536 + (r3 - 55296 << 10) + (n2 - 56320), i2++), r3 < 128 ? t2[s2++] = r3 : (r3 < 2048 ? t2[s2++] = 192 | r3 >>> 6 : (r3 < 65536 ? t2[s2++] = 224 | r3 >>> 12 : (t2[s2++] = 240 | r3 >>> 18, t2[s2++] = 128 | r3 >>> 12 & 63), t2[s2++] = 128 | r3 >>> 6 & 63), t2[s2++] = 128 | 63 & r3);
            return t2;
          }, r2.buf2binstring = function(e2) {
            return l(e2, e2.length);
          }, r2.binstring2buf = function(e2) {
            for (var t2 = new h.Buf8(e2.length), r3 = 0, n2 = t2.length; r3 < n2; r3++)
              t2[r3] = e2.charCodeAt(r3);
            return t2;
          }, r2.buf2string = function(e2, t2) {
            var r3, n2, i2, s2, a = t2 || e2.length, o = new Array(2 * a);
            for (r3 = n2 = 0; r3 < a; )
              if ((i2 = e2[r3++]) < 128)
                o[n2++] = i2;
              else if (4 < (s2 = u[i2]))
                o[n2++] = 65533, r3 += s2 - 1;
              else {
                for (i2 &= 2 === s2 ? 31 : 3 === s2 ? 15 : 7; 1 < s2 && r3 < a; )
                  i2 = i2 << 6 | 63 & e2[r3++], s2--;
                1 < s2 ? o[n2++] = 65533 : i2 < 65536 ? o[n2++] = i2 : (i2 -= 65536, o[n2++] = 55296 | i2 >> 10 & 1023, o[n2++] = 56320 | 1023 & i2);
              }
            return l(o, n2);
          }, r2.utf8border = function(e2, t2) {
            var r3;
            for ((t2 = t2 || e2.length) > e2.length && (t2 = e2.length), r3 = t2 - 1; 0 <= r3 && 128 == (192 & e2[r3]); )
              r3--;
            return r3 < 0 ? t2 : 0 === r3 ? t2 : r3 + u[e2[r3]] > t2 ? r3 : t2;
          };
        }, { "./common": 41 }], 43: [function(e, t, r2) {
          "use strict";
          t.exports = function(e2, t2, r3, n) {
            for (var i = 65535 & e2 | 0, s = e2 >>> 16 & 65535 | 0, a = 0; 0 !== r3; ) {
              for (r3 -= a = 2e3 < r3 ? 2e3 : r3; s = s + (i = i + t2[n++] | 0) | 0, --a; )
                ;
              i %= 65521, s %= 65521;
            }
            return i | s << 16 | 0;
          };
        }, {}], 44: [function(e, t, r2) {
          "use strict";
          t.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
        }, {}], 45: [function(e, t, r2) {
          "use strict";
          var o = function() {
            for (var e2, t2 = [], r3 = 0; r3 < 256; r3++) {
              e2 = r3;
              for (var n = 0; n < 8; n++)
                e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
              t2[r3] = e2;
            }
            return t2;
          }();
          t.exports = function(e2, t2, r3, n) {
            var i = o, s = n + r3;
            e2 ^= -1;
            for (var a = n; a < s; a++)
              e2 = e2 >>> 8 ^ i[255 & (e2 ^ t2[a])];
            return -1 ^ e2;
          };
        }, {}], 46: [function(e, t, r2) {
          "use strict";
          var h, c = e("../utils/common"), u = e("./trees"), d = e("./adler32"), p = e("./crc32"), n = e("./messages"), l = 0, f = 4, m = 0, _ = -2, g = -1, b = 4, i = 2, v = 8, y = 9, s = 286, a = 30, o = 19, w = 2 * s + 1, k = 15, x = 3, S = 258, z = S + x + 1, C = 42, E = 113, A = 1, I = 2, O = 3, B = 4;
          function R(e2, t2) {
            return e2.msg = n[t2], t2;
          }
          function T(e2) {
            return (e2 << 1) - (4 < e2 ? 9 : 0);
          }
          function D(e2) {
            for (var t2 = e2.length; 0 <= --t2; )
              e2[t2] = 0;
          }
          function F(e2) {
            var t2 = e2.state, r3 = t2.pending;
            r3 > e2.avail_out && (r3 = e2.avail_out), 0 !== r3 && (c.arraySet(e2.output, t2.pending_buf, t2.pending_out, r3, e2.next_out), e2.next_out += r3, t2.pending_out += r3, e2.total_out += r3, e2.avail_out -= r3, t2.pending -= r3, 0 === t2.pending && (t2.pending_out = 0));
          }
          function N(e2, t2) {
            u._tr_flush_block(e2, 0 <= e2.block_start ? e2.block_start : -1, e2.strstart - e2.block_start, t2), e2.block_start = e2.strstart, F(e2.strm);
          }
          function U(e2, t2) {
            e2.pending_buf[e2.pending++] = t2;
          }
          function P(e2, t2) {
            e2.pending_buf[e2.pending++] = t2 >>> 8 & 255, e2.pending_buf[e2.pending++] = 255 & t2;
          }
          function L(e2, t2) {
            var r3, n2, i2 = e2.max_chain_length, s2 = e2.strstart, a2 = e2.prev_length, o2 = e2.nice_match, h2 = e2.strstart > e2.w_size - z ? e2.strstart - (e2.w_size - z) : 0, u2 = e2.window, l2 = e2.w_mask, f2 = e2.prev, c2 = e2.strstart + S, d2 = u2[s2 + a2 - 1], p2 = u2[s2 + a2];
            e2.prev_length >= e2.good_match && (i2 >>= 2), o2 > e2.lookahead && (o2 = e2.lookahead);
            do {
              if (u2[(r3 = t2) + a2] === p2 && u2[r3 + a2 - 1] === d2 && u2[r3] === u2[s2] && u2[++r3] === u2[s2 + 1]) {
                s2 += 2, r3++;
                do {
                } while (u2[++s2] === u2[++r3] && u2[++s2] === u2[++r3] && u2[++s2] === u2[++r3] && u2[++s2] === u2[++r3] && u2[++s2] === u2[++r3] && u2[++s2] === u2[++r3] && u2[++s2] === u2[++r3] && u2[++s2] === u2[++r3] && s2 < c2);
                if (n2 = S - (c2 - s2), s2 = c2 - S, a2 < n2) {
                  if (e2.match_start = t2, o2 <= (a2 = n2))
                    break;
                  d2 = u2[s2 + a2 - 1], p2 = u2[s2 + a2];
                }
              }
            } while ((t2 = f2[t2 & l2]) > h2 && 0 != --i2);
            return a2 <= e2.lookahead ? a2 : e2.lookahead;
          }
          function j(e2) {
            var t2, r3, n2, i2, s2, a2, o2, h2, u2, l2, f2 = e2.w_size;
            do {
              if (i2 = e2.window_size - e2.lookahead - e2.strstart, e2.strstart >= f2 + (f2 - z)) {
                for (c.arraySet(e2.window, e2.window, f2, f2, 0), e2.match_start -= f2, e2.strstart -= f2, e2.block_start -= f2, t2 = r3 = e2.hash_size; n2 = e2.head[--t2], e2.head[t2] = f2 <= n2 ? n2 - f2 : 0, --r3; )
                  ;
                for (t2 = r3 = f2; n2 = e2.prev[--t2], e2.prev[t2] = f2 <= n2 ? n2 - f2 : 0, --r3; )
                  ;
                i2 += f2;
              }
              if (0 === e2.strm.avail_in)
                break;
              if (a2 = e2.strm, o2 = e2.window, h2 = e2.strstart + e2.lookahead, u2 = i2, l2 = void 0, l2 = a2.avail_in, u2 < l2 && (l2 = u2), r3 = 0 === l2 ? 0 : (a2.avail_in -= l2, c.arraySet(o2, a2.input, a2.next_in, l2, h2), 1 === a2.state.wrap ? a2.adler = d(a2.adler, o2, l2, h2) : 2 === a2.state.wrap && (a2.adler = p(a2.adler, o2, l2, h2)), a2.next_in += l2, a2.total_in += l2, l2), e2.lookahead += r3, e2.lookahead + e2.insert >= x)
                for (s2 = e2.strstart - e2.insert, e2.ins_h = e2.window[s2], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + 1]) & e2.hash_mask; e2.insert && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + x - 1]) & e2.hash_mask, e2.prev[s2 & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = s2, s2++, e2.insert--, !(e2.lookahead + e2.insert < x)); )
                  ;
            } while (e2.lookahead < z && 0 !== e2.strm.avail_in);
          }
          function Z(e2, t2) {
            for (var r3, n2; ; ) {
              if (e2.lookahead < z) {
                if (j(e2), e2.lookahead < z && t2 === l)
                  return A;
                if (0 === e2.lookahead)
                  break;
              }
              if (r3 = 0, e2.lookahead >= x && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r3 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), 0 !== r3 && e2.strstart - r3 <= e2.w_size - z && (e2.match_length = L(e2, r3)), e2.match_length >= x)
                if (n2 = u._tr_tally(e2, e2.strstart - e2.match_start, e2.match_length - x), e2.lookahead -= e2.match_length, e2.match_length <= e2.max_lazy_match && e2.lookahead >= x) {
                  for (e2.match_length--; e2.strstart++, e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r3 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart, 0 != --e2.match_length; )
                    ;
                  e2.strstart++;
                } else
                  e2.strstart += e2.match_length, e2.match_length = 0, e2.ins_h = e2.window[e2.strstart], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + 1]) & e2.hash_mask;
              else
                n2 = u._tr_tally(e2, 0, e2.window[e2.strstart]), e2.lookahead--, e2.strstart++;
              if (n2 && (N(e2, false), 0 === e2.strm.avail_out))
                return A;
            }
            return e2.insert = e2.strstart < x - 1 ? e2.strstart : x - 1, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : e2.last_lit && (N(e2, false), 0 === e2.strm.avail_out) ? A : I;
          }
          function W(e2, t2) {
            for (var r3, n2, i2; ; ) {
              if (e2.lookahead < z) {
                if (j(e2), e2.lookahead < z && t2 === l)
                  return A;
                if (0 === e2.lookahead)
                  break;
              }
              if (r3 = 0, e2.lookahead >= x && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r3 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), e2.prev_length = e2.match_length, e2.prev_match = e2.match_start, e2.match_length = x - 1, 0 !== r3 && e2.prev_length < e2.max_lazy_match && e2.strstart - r3 <= e2.w_size - z && (e2.match_length = L(e2, r3), e2.match_length <= 5 && (1 === e2.strategy || e2.match_length === x && 4096 < e2.strstart - e2.match_start) && (e2.match_length = x - 1)), e2.prev_length >= x && e2.match_length <= e2.prev_length) {
                for (i2 = e2.strstart + e2.lookahead - x, n2 = u._tr_tally(e2, e2.strstart - 1 - e2.prev_match, e2.prev_length - x), e2.lookahead -= e2.prev_length - 1, e2.prev_length -= 2; ++e2.strstart <= i2 && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r3 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), 0 != --e2.prev_length; )
                  ;
                if (e2.match_available = 0, e2.match_length = x - 1, e2.strstart++, n2 && (N(e2, false), 0 === e2.strm.avail_out))
                  return A;
              } else if (e2.match_available) {
                if ((n2 = u._tr_tally(e2, 0, e2.window[e2.strstart - 1])) && N(e2, false), e2.strstart++, e2.lookahead--, 0 === e2.strm.avail_out)
                  return A;
              } else
                e2.match_available = 1, e2.strstart++, e2.lookahead--;
            }
            return e2.match_available && (n2 = u._tr_tally(e2, 0, e2.window[e2.strstart - 1]), e2.match_available = 0), e2.insert = e2.strstart < x - 1 ? e2.strstart : x - 1, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : e2.last_lit && (N(e2, false), 0 === e2.strm.avail_out) ? A : I;
          }
          function M(e2, t2, r3, n2, i2) {
            this.good_length = e2, this.max_lazy = t2, this.nice_length = r3, this.max_chain = n2, this.func = i2;
          }
          function H() {
            this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = v, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new c.Buf16(2 * w), this.dyn_dtree = new c.Buf16(2 * (2 * a + 1)), this.bl_tree = new c.Buf16(2 * (2 * o + 1)), D(this.dyn_ltree), D(this.dyn_dtree), D(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new c.Buf16(k + 1), this.heap = new c.Buf16(2 * s + 1), D(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new c.Buf16(2 * s + 1), D(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
          }
          function G(e2) {
            var t2;
            return e2 && e2.state ? (e2.total_in = e2.total_out = 0, e2.data_type = i, (t2 = e2.state).pending = 0, t2.pending_out = 0, t2.wrap < 0 && (t2.wrap = -t2.wrap), t2.status = t2.wrap ? C : E, e2.adler = 2 === t2.wrap ? 0 : 1, t2.last_flush = l, u._tr_init(t2), m) : R(e2, _);
          }
          function K(e2) {
            var t2 = G(e2);
            return t2 === m && function(e3) {
              e3.window_size = 2 * e3.w_size, D(e3.head), e3.max_lazy_match = h[e3.level].max_lazy, e3.good_match = h[e3.level].good_length, e3.nice_match = h[e3.level].nice_length, e3.max_chain_length = h[e3.level].max_chain, e3.strstart = 0, e3.block_start = 0, e3.lookahead = 0, e3.insert = 0, e3.match_length = e3.prev_length = x - 1, e3.match_available = 0, e3.ins_h = 0;
            }(e2.state), t2;
          }
          function Y(e2, t2, r3, n2, i2, s2) {
            if (!e2)
              return _;
            var a2 = 1;
            if (t2 === g && (t2 = 6), n2 < 0 ? (a2 = 0, n2 = -n2) : 15 < n2 && (a2 = 2, n2 -= 16), i2 < 1 || y < i2 || r3 !== v || n2 < 8 || 15 < n2 || t2 < 0 || 9 < t2 || s2 < 0 || b < s2)
              return R(e2, _);
            8 === n2 && (n2 = 9);
            var o2 = new H();
            return (e2.state = o2).strm = e2, o2.wrap = a2, o2.gzhead = null, o2.w_bits = n2, o2.w_size = 1 << o2.w_bits, o2.w_mask = o2.w_size - 1, o2.hash_bits = i2 + 7, o2.hash_size = 1 << o2.hash_bits, o2.hash_mask = o2.hash_size - 1, o2.hash_shift = ~~((o2.hash_bits + x - 1) / x), o2.window = new c.Buf8(2 * o2.w_size), o2.head = new c.Buf16(o2.hash_size), o2.prev = new c.Buf16(o2.w_size), o2.lit_bufsize = 1 << i2 + 6, o2.pending_buf_size = 4 * o2.lit_bufsize, o2.pending_buf = new c.Buf8(o2.pending_buf_size), o2.d_buf = 1 * o2.lit_bufsize, o2.l_buf = 3 * o2.lit_bufsize, o2.level = t2, o2.strategy = s2, o2.method = r3, K(e2);
          }
          h = [new M(0, 0, 0, 0, function(e2, t2) {
            var r3 = 65535;
            for (r3 > e2.pending_buf_size - 5 && (r3 = e2.pending_buf_size - 5); ; ) {
              if (e2.lookahead <= 1) {
                if (j(e2), 0 === e2.lookahead && t2 === l)
                  return A;
                if (0 === e2.lookahead)
                  break;
              }
              e2.strstart += e2.lookahead, e2.lookahead = 0;
              var n2 = e2.block_start + r3;
              if ((0 === e2.strstart || e2.strstart >= n2) && (e2.lookahead = e2.strstart - n2, e2.strstart = n2, N(e2, false), 0 === e2.strm.avail_out))
                return A;
              if (e2.strstart - e2.block_start >= e2.w_size - z && (N(e2, false), 0 === e2.strm.avail_out))
                return A;
            }
            return e2.insert = 0, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : (e2.strstart > e2.block_start && (N(e2, false), e2.strm.avail_out), A);
          }), new M(4, 4, 8, 4, Z), new M(4, 5, 16, 8, Z), new M(4, 6, 32, 32, Z), new M(4, 4, 16, 16, W), new M(8, 16, 32, 32, W), new M(8, 16, 128, 128, W), new M(8, 32, 128, 256, W), new M(32, 128, 258, 1024, W), new M(32, 258, 258, 4096, W)], r2.deflateInit = function(e2, t2) {
            return Y(e2, t2, v, 15, 8, 0);
          }, r2.deflateInit2 = Y, r2.deflateReset = K, r2.deflateResetKeep = G, r2.deflateSetHeader = function(e2, t2) {
            return e2 && e2.state ? 2 !== e2.state.wrap ? _ : (e2.state.gzhead = t2, m) : _;
          }, r2.deflate = function(e2, t2) {
            var r3, n2, i2, s2;
            if (!e2 || !e2.state || 5 < t2 || t2 < 0)
              return e2 ? R(e2, _) : _;
            if (n2 = e2.state, !e2.output || !e2.input && 0 !== e2.avail_in || 666 === n2.status && t2 !== f)
              return R(e2, 0 === e2.avail_out ? -5 : _);
            if (n2.strm = e2, r3 = n2.last_flush, n2.last_flush = t2, n2.status === C)
              if (2 === n2.wrap)
                e2.adler = 0, U(n2, 31), U(n2, 139), U(n2, 8), n2.gzhead ? (U(n2, (n2.gzhead.text ? 1 : 0) + (n2.gzhead.hcrc ? 2 : 0) + (n2.gzhead.extra ? 4 : 0) + (n2.gzhead.name ? 8 : 0) + (n2.gzhead.comment ? 16 : 0)), U(n2, 255 & n2.gzhead.time), U(n2, n2.gzhead.time >> 8 & 255), U(n2, n2.gzhead.time >> 16 & 255), U(n2, n2.gzhead.time >> 24 & 255), U(n2, 9 === n2.level ? 2 : 2 <= n2.strategy || n2.level < 2 ? 4 : 0), U(n2, 255 & n2.gzhead.os), n2.gzhead.extra && n2.gzhead.extra.length && (U(n2, 255 & n2.gzhead.extra.length), U(n2, n2.gzhead.extra.length >> 8 & 255)), n2.gzhead.hcrc && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending, 0)), n2.gzindex = 0, n2.status = 69) : (U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 9 === n2.level ? 2 : 2 <= n2.strategy || n2.level < 2 ? 4 : 0), U(n2, 3), n2.status = E);
              else {
                var a2 = v + (n2.w_bits - 8 << 4) << 8;
                a2 |= (2 <= n2.strategy || n2.level < 2 ? 0 : n2.level < 6 ? 1 : 6 === n2.level ? 2 : 3) << 6, 0 !== n2.strstart && (a2 |= 32), a2 += 31 - a2 % 31, n2.status = E, P(n2, a2), 0 !== n2.strstart && (P(n2, e2.adler >>> 16), P(n2, 65535 & e2.adler)), e2.adler = 1;
              }
            if (69 === n2.status)
              if (n2.gzhead.extra) {
                for (i2 = n2.pending; n2.gzindex < (65535 & n2.gzhead.extra.length) && (n2.pending !== n2.pending_buf_size || (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending !== n2.pending_buf_size)); )
                  U(n2, 255 & n2.gzhead.extra[n2.gzindex]), n2.gzindex++;
                n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), n2.gzindex === n2.gzhead.extra.length && (n2.gzindex = 0, n2.status = 73);
              } else
                n2.status = 73;
            if (73 === n2.status)
              if (n2.gzhead.name) {
                i2 = n2.pending;
                do {
                  if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending === n2.pending_buf_size)) {
                    s2 = 1;
                    break;
                  }
                  s2 = n2.gzindex < n2.gzhead.name.length ? 255 & n2.gzhead.name.charCodeAt(n2.gzindex++) : 0, U(n2, s2);
                } while (0 !== s2);
                n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), 0 === s2 && (n2.gzindex = 0, n2.status = 91);
              } else
                n2.status = 91;
            if (91 === n2.status)
              if (n2.gzhead.comment) {
                i2 = n2.pending;
                do {
                  if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending === n2.pending_buf_size)) {
                    s2 = 1;
                    break;
                  }
                  s2 = n2.gzindex < n2.gzhead.comment.length ? 255 & n2.gzhead.comment.charCodeAt(n2.gzindex++) : 0, U(n2, s2);
                } while (0 !== s2);
                n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), 0 === s2 && (n2.status = 103);
              } else
                n2.status = 103;
            if (103 === n2.status && (n2.gzhead.hcrc ? (n2.pending + 2 > n2.pending_buf_size && F(e2), n2.pending + 2 <= n2.pending_buf_size && (U(n2, 255 & e2.adler), U(n2, e2.adler >> 8 & 255), e2.adler = 0, n2.status = E)) : n2.status = E), 0 !== n2.pending) {
              if (F(e2), 0 === e2.avail_out)
                return n2.last_flush = -1, m;
            } else if (0 === e2.avail_in && T(t2) <= T(r3) && t2 !== f)
              return R(e2, -5);
            if (666 === n2.status && 0 !== e2.avail_in)
              return R(e2, -5);
            if (0 !== e2.avail_in || 0 !== n2.lookahead || t2 !== l && 666 !== n2.status) {
              var o2 = 2 === n2.strategy ? function(e3, t3) {
                for (var r4; ; ) {
                  if (0 === e3.lookahead && (j(e3), 0 === e3.lookahead)) {
                    if (t3 === l)
                      return A;
                    break;
                  }
                  if (e3.match_length = 0, r4 = u._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++, r4 && (N(e3, false), 0 === e3.strm.avail_out))
                    return A;
                }
                return e3.insert = 0, t3 === f ? (N(e3, true), 0 === e3.strm.avail_out ? O : B) : e3.last_lit && (N(e3, false), 0 === e3.strm.avail_out) ? A : I;
              }(n2, t2) : 3 === n2.strategy ? function(e3, t3) {
                for (var r4, n3, i3, s3, a3 = e3.window; ; ) {
                  if (e3.lookahead <= S) {
                    if (j(e3), e3.lookahead <= S && t3 === l)
                      return A;
                    if (0 === e3.lookahead)
                      break;
                  }
                  if (e3.match_length = 0, e3.lookahead >= x && 0 < e3.strstart && (n3 = a3[i3 = e3.strstart - 1]) === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3]) {
                    s3 = e3.strstart + S;
                    do {
                    } while (n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && i3 < s3);
                    e3.match_length = S - (s3 - i3), e3.match_length > e3.lookahead && (e3.match_length = e3.lookahead);
                  }
                  if (e3.match_length >= x ? (r4 = u._tr_tally(e3, 1, e3.match_length - x), e3.lookahead -= e3.match_length, e3.strstart += e3.match_length, e3.match_length = 0) : (r4 = u._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++), r4 && (N(e3, false), 0 === e3.strm.avail_out))
                    return A;
                }
                return e3.insert = 0, t3 === f ? (N(e3, true), 0 === e3.strm.avail_out ? O : B) : e3.last_lit && (N(e3, false), 0 === e3.strm.avail_out) ? A : I;
              }(n2, t2) : h[n2.level].func(n2, t2);
              if (o2 !== O && o2 !== B || (n2.status = 666), o2 === A || o2 === O)
                return 0 === e2.avail_out && (n2.last_flush = -1), m;
              if (o2 === I && (1 === t2 ? u._tr_align(n2) : 5 !== t2 && (u._tr_stored_block(n2, 0, 0, false), 3 === t2 && (D(n2.head), 0 === n2.lookahead && (n2.strstart = 0, n2.block_start = 0, n2.insert = 0))), F(e2), 0 === e2.avail_out))
                return n2.last_flush = -1, m;
            }
            return t2 !== f ? m : n2.wrap <= 0 ? 1 : (2 === n2.wrap ? (U(n2, 255 & e2.adler), U(n2, e2.adler >> 8 & 255), U(n2, e2.adler >> 16 & 255), U(n2, e2.adler >> 24 & 255), U(n2, 255 & e2.total_in), U(n2, e2.total_in >> 8 & 255), U(n2, e2.total_in >> 16 & 255), U(n2, e2.total_in >> 24 & 255)) : (P(n2, e2.adler >>> 16), P(n2, 65535 & e2.adler)), F(e2), 0 < n2.wrap && (n2.wrap = -n2.wrap), 0 !== n2.pending ? m : 1);
          }, r2.deflateEnd = function(e2) {
            var t2;
            return e2 && e2.state ? (t2 = e2.state.status) !== C && 69 !== t2 && 73 !== t2 && 91 !== t2 && 103 !== t2 && t2 !== E && 666 !== t2 ? R(e2, _) : (e2.state = null, t2 === E ? R(e2, -3) : m) : _;
          }, r2.deflateSetDictionary = function(e2, t2) {
            var r3, n2, i2, s2, a2, o2, h2, u2, l2 = t2.length;
            if (!e2 || !e2.state)
              return _;
            if (2 === (s2 = (r3 = e2.state).wrap) || 1 === s2 && r3.status !== C || r3.lookahead)
              return _;
            for (1 === s2 && (e2.adler = d(e2.adler, t2, l2, 0)), r3.wrap = 0, l2 >= r3.w_size && (0 === s2 && (D(r3.head), r3.strstart = 0, r3.block_start = 0, r3.insert = 0), u2 = new c.Buf8(r3.w_size), c.arraySet(u2, t2, l2 - r3.w_size, r3.w_size, 0), t2 = u2, l2 = r3.w_size), a2 = e2.avail_in, o2 = e2.next_in, h2 = e2.input, e2.avail_in = l2, e2.next_in = 0, e2.input = t2, j(r3); r3.lookahead >= x; ) {
              for (n2 = r3.strstart, i2 = r3.lookahead - (x - 1); r3.ins_h = (r3.ins_h << r3.hash_shift ^ r3.window[n2 + x - 1]) & r3.hash_mask, r3.prev[n2 & r3.w_mask] = r3.head[r3.ins_h], r3.head[r3.ins_h] = n2, n2++, --i2; )
                ;
              r3.strstart = n2, r3.lookahead = x - 1, j(r3);
            }
            return r3.strstart += r3.lookahead, r3.block_start = r3.strstart, r3.insert = r3.lookahead, r3.lookahead = 0, r3.match_length = r3.prev_length = x - 1, r3.match_available = 0, e2.next_in = o2, e2.input = h2, e2.avail_in = a2, r3.wrap = s2, m;
          }, r2.deflateInfo = "pako deflate (from Nodeca project)";
        }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, t, r2) {
          "use strict";
          t.exports = function() {
            this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = false;
          };
        }, {}], 48: [function(e, t, r2) {
          "use strict";
          t.exports = function(e2, t2) {
            var r3, n, i, s, a, o, h, u, l, f, c, d, p, m, _, g, b, v, y, w, k, x, S, z, C;
            r3 = e2.state, n = e2.next_in, z = e2.input, i = n + (e2.avail_in - 5), s = e2.next_out, C = e2.output, a = s - (t2 - e2.avail_out), o = s + (e2.avail_out - 257), h = r3.dmax, u = r3.wsize, l = r3.whave, f = r3.wnext, c = r3.window, d = r3.hold, p = r3.bits, m = r3.lencode, _ = r3.distcode, g = (1 << r3.lenbits) - 1, b = (1 << r3.distbits) - 1;
            e:
              do {
                p < 15 && (d += z[n++] << p, p += 8, d += z[n++] << p, p += 8), v = m[d & g];
                t:
                  for (; ; ) {
                    if (d >>>= y = v >>> 24, p -= y, 0 === (y = v >>> 16 & 255))
                      C[s++] = 65535 & v;
                    else {
                      if (!(16 & y)) {
                        if (0 == (64 & y)) {
                          v = m[(65535 & v) + (d & (1 << y) - 1)];
                          continue t;
                        }
                        if (32 & y) {
                          r3.mode = 12;
                          break e;
                        }
                        e2.msg = "invalid literal/length code", r3.mode = 30;
                        break e;
                      }
                      w = 65535 & v, (y &= 15) && (p < y && (d += z[n++] << p, p += 8), w += d & (1 << y) - 1, d >>>= y, p -= y), p < 15 && (d += z[n++] << p, p += 8, d += z[n++] << p, p += 8), v = _[d & b];
                      r:
                        for (; ; ) {
                          if (d >>>= y = v >>> 24, p -= y, !(16 & (y = v >>> 16 & 255))) {
                            if (0 == (64 & y)) {
                              v = _[(65535 & v) + (d & (1 << y) - 1)];
                              continue r;
                            }
                            e2.msg = "invalid distance code", r3.mode = 30;
                            break e;
                          }
                          if (k = 65535 & v, p < (y &= 15) && (d += z[n++] << p, (p += 8) < y && (d += z[n++] << p, p += 8)), h < (k += d & (1 << y) - 1)) {
                            e2.msg = "invalid distance too far back", r3.mode = 30;
                            break e;
                          }
                          if (d >>>= y, p -= y, (y = s - a) < k) {
                            if (l < (y = k - y) && r3.sane) {
                              e2.msg = "invalid distance too far back", r3.mode = 30;
                              break e;
                            }
                            if (S = c, (x = 0) === f) {
                              if (x += u - y, y < w) {
                                for (w -= y; C[s++] = c[x++], --y; )
                                  ;
                                x = s - k, S = C;
                              }
                            } else if (f < y) {
                              if (x += u + f - y, (y -= f) < w) {
                                for (w -= y; C[s++] = c[x++], --y; )
                                  ;
                                if (x = 0, f < w) {
                                  for (w -= y = f; C[s++] = c[x++], --y; )
                                    ;
                                  x = s - k, S = C;
                                }
                              }
                            } else if (x += f - y, y < w) {
                              for (w -= y; C[s++] = c[x++], --y; )
                                ;
                              x = s - k, S = C;
                            }
                            for (; 2 < w; )
                              C[s++] = S[x++], C[s++] = S[x++], C[s++] = S[x++], w -= 3;
                            w && (C[s++] = S[x++], 1 < w && (C[s++] = S[x++]));
                          } else {
                            for (x = s - k; C[s++] = C[x++], C[s++] = C[x++], C[s++] = C[x++], 2 < (w -= 3); )
                              ;
                            w && (C[s++] = C[x++], 1 < w && (C[s++] = C[x++]));
                          }
                          break;
                        }
                    }
                    break;
                  }
              } while (n < i && s < o);
            n -= w = p >> 3, d &= (1 << (p -= w << 3)) - 1, e2.next_in = n, e2.next_out = s, e2.avail_in = n < i ? i - n + 5 : 5 - (n - i), e2.avail_out = s < o ? o - s + 257 : 257 - (s - o), r3.hold = d, r3.bits = p;
          };
        }, {}], 49: [function(e, t, r2) {
          "use strict";
          var I = e("../utils/common"), O = e("./adler32"), B = e("./crc32"), R = e("./inffast"), T = e("./inftrees"), D = 1, F = 2, N = 0, U = -2, P = 1, n = 852, i = 592;
          function L(e2) {
            return (e2 >>> 24 & 255) + (e2 >>> 8 & 65280) + ((65280 & e2) << 8) + ((255 & e2) << 24);
          }
          function s() {
            this.mode = 0, this.last = false, this.wrap = 0, this.havedict = false, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new I.Buf16(320), this.work = new I.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
          }
          function a(e2) {
            var t2;
            return e2 && e2.state ? (t2 = e2.state, e2.total_in = e2.total_out = t2.total = 0, e2.msg = "", t2.wrap && (e2.adler = 1 & t2.wrap), t2.mode = P, t2.last = 0, t2.havedict = 0, t2.dmax = 32768, t2.head = null, t2.hold = 0, t2.bits = 0, t2.lencode = t2.lendyn = new I.Buf32(n), t2.distcode = t2.distdyn = new I.Buf32(i), t2.sane = 1, t2.back = -1, N) : U;
          }
          function o(e2) {
            var t2;
            return e2 && e2.state ? ((t2 = e2.state).wsize = 0, t2.whave = 0, t2.wnext = 0, a(e2)) : U;
          }
          function h(e2, t2) {
            var r3, n2;
            return e2 && e2.state ? (n2 = e2.state, t2 < 0 ? (r3 = 0, t2 = -t2) : (r3 = 1 + (t2 >> 4), t2 < 48 && (t2 &= 15)), t2 && (t2 < 8 || 15 < t2) ? U : (null !== n2.window && n2.wbits !== t2 && (n2.window = null), n2.wrap = r3, n2.wbits = t2, o(e2))) : U;
          }
          function u(e2, t2) {
            var r3, n2;
            return e2 ? (n2 = new s(), (e2.state = n2).window = null, (r3 = h(e2, t2)) !== N && (e2.state = null), r3) : U;
          }
          var l, f, c = true;
          function j(e2) {
            if (c) {
              var t2;
              for (l = new I.Buf32(512), f = new I.Buf32(32), t2 = 0; t2 < 144; )
                e2.lens[t2++] = 8;
              for (; t2 < 256; )
                e2.lens[t2++] = 9;
              for (; t2 < 280; )
                e2.lens[t2++] = 7;
              for (; t2 < 288; )
                e2.lens[t2++] = 8;
              for (T(D, e2.lens, 0, 288, l, 0, e2.work, { bits: 9 }), t2 = 0; t2 < 32; )
                e2.lens[t2++] = 5;
              T(F, e2.lens, 0, 32, f, 0, e2.work, { bits: 5 }), c = false;
            }
            e2.lencode = l, e2.lenbits = 9, e2.distcode = f, e2.distbits = 5;
          }
          function Z(e2, t2, r3, n2) {
            var i2, s2 = e2.state;
            return null === s2.window && (s2.wsize = 1 << s2.wbits, s2.wnext = 0, s2.whave = 0, s2.window = new I.Buf8(s2.wsize)), n2 >= s2.wsize ? (I.arraySet(s2.window, t2, r3 - s2.wsize, s2.wsize, 0), s2.wnext = 0, s2.whave = s2.wsize) : (n2 < (i2 = s2.wsize - s2.wnext) && (i2 = n2), I.arraySet(s2.window, t2, r3 - n2, i2, s2.wnext), (n2 -= i2) ? (I.arraySet(s2.window, t2, r3 - n2, n2, 0), s2.wnext = n2, s2.whave = s2.wsize) : (s2.wnext += i2, s2.wnext === s2.wsize && (s2.wnext = 0), s2.whave < s2.wsize && (s2.whave += i2))), 0;
          }
          r2.inflateReset = o, r2.inflateReset2 = h, r2.inflateResetKeep = a, r2.inflateInit = function(e2) {
            return u(e2, 15);
          }, r2.inflateInit2 = u, r2.inflate = function(e2, t2) {
            var r3, n2, i2, s2, a2, o2, h2, u2, l2, f2, c2, d, p, m, _, g, b, v, y, w, k, x, S, z, C = 0, E = new I.Buf8(4), A = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
            if (!e2 || !e2.state || !e2.output || !e2.input && 0 !== e2.avail_in)
              return U;
            12 === (r3 = e2.state).mode && (r3.mode = 13), a2 = e2.next_out, i2 = e2.output, h2 = e2.avail_out, s2 = e2.next_in, n2 = e2.input, o2 = e2.avail_in, u2 = r3.hold, l2 = r3.bits, f2 = o2, c2 = h2, x = N;
            e:
              for (; ; )
                switch (r3.mode) {
                  case P:
                    if (0 === r3.wrap) {
                      r3.mode = 13;
                      break;
                    }
                    for (; l2 < 16; ) {
                      if (0 === o2)
                        break e;
                      o2--, u2 += n2[s2++] << l2, l2 += 8;
                    }
                    if (2 & r3.wrap && 35615 === u2) {
                      E[r3.check = 0] = 255 & u2, E[1] = u2 >>> 8 & 255, r3.check = B(r3.check, E, 2, 0), l2 = u2 = 0, r3.mode = 2;
                      break;
                    }
                    if (r3.flags = 0, r3.head && (r3.head.done = false), !(1 & r3.wrap) || (((255 & u2) << 8) + (u2 >> 8)) % 31) {
                      e2.msg = "incorrect header check", r3.mode = 30;
                      break;
                    }
                    if (8 != (15 & u2)) {
                      e2.msg = "unknown compression method", r3.mode = 30;
                      break;
                    }
                    if (l2 -= 4, k = 8 + (15 & (u2 >>>= 4)), 0 === r3.wbits)
                      r3.wbits = k;
                    else if (k > r3.wbits) {
                      e2.msg = "invalid window size", r3.mode = 30;
                      break;
                    }
                    r3.dmax = 1 << k, e2.adler = r3.check = 1, r3.mode = 512 & u2 ? 10 : 12, l2 = u2 = 0;
                    break;
                  case 2:
                    for (; l2 < 16; ) {
                      if (0 === o2)
                        break e;
                      o2--, u2 += n2[s2++] << l2, l2 += 8;
                    }
                    if (r3.flags = u2, 8 != (255 & r3.flags)) {
                      e2.msg = "unknown compression method", r3.mode = 30;
                      break;
                    }
                    if (57344 & r3.flags) {
                      e2.msg = "unknown header flags set", r3.mode = 30;
                      break;
                    }
                    r3.head && (r3.head.text = u2 >> 8 & 1), 512 & r3.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r3.check = B(r3.check, E, 2, 0)), l2 = u2 = 0, r3.mode = 3;
                  case 3:
                    for (; l2 < 32; ) {
                      if (0 === o2)
                        break e;
                      o2--, u2 += n2[s2++] << l2, l2 += 8;
                    }
                    r3.head && (r3.head.time = u2), 512 & r3.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, E[2] = u2 >>> 16 & 255, E[3] = u2 >>> 24 & 255, r3.check = B(r3.check, E, 4, 0)), l2 = u2 = 0, r3.mode = 4;
                  case 4:
                    for (; l2 < 16; ) {
                      if (0 === o2)
                        break e;
                      o2--, u2 += n2[s2++] << l2, l2 += 8;
                    }
                    r3.head && (r3.head.xflags = 255 & u2, r3.head.os = u2 >> 8), 512 & r3.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r3.check = B(r3.check, E, 2, 0)), l2 = u2 = 0, r3.mode = 5;
                  case 5:
                    if (1024 & r3.flags) {
                      for (; l2 < 16; ) {
                        if (0 === o2)
                          break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      r3.length = u2, r3.head && (r3.head.extra_len = u2), 512 & r3.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r3.check = B(r3.check, E, 2, 0)), l2 = u2 = 0;
                    } else
                      r3.head && (r3.head.extra = null);
                    r3.mode = 6;
                  case 6:
                    if (1024 & r3.flags && (o2 < (d = r3.length) && (d = o2), d && (r3.head && (k = r3.head.extra_len - r3.length, r3.head.extra || (r3.head.extra = new Array(r3.head.extra_len)), I.arraySet(r3.head.extra, n2, s2, d, k)), 512 & r3.flags && (r3.check = B(r3.check, n2, d, s2)), o2 -= d, s2 += d, r3.length -= d), r3.length))
                      break e;
                    r3.length = 0, r3.mode = 7;
                  case 7:
                    if (2048 & r3.flags) {
                      if (0 === o2)
                        break e;
                      for (d = 0; k = n2[s2 + d++], r3.head && k && r3.length < 65536 && (r3.head.name += String.fromCharCode(k)), k && d < o2; )
                        ;
                      if (512 & r3.flags && (r3.check = B(r3.check, n2, d, s2)), o2 -= d, s2 += d, k)
                        break e;
                    } else
                      r3.head && (r3.head.name = null);
                    r3.length = 0, r3.mode = 8;
                  case 8:
                    if (4096 & r3.flags) {
                      if (0 === o2)
                        break e;
                      for (d = 0; k = n2[s2 + d++], r3.head && k && r3.length < 65536 && (r3.head.comment += String.fromCharCode(k)), k && d < o2; )
                        ;
                      if (512 & r3.flags && (r3.check = B(r3.check, n2, d, s2)), o2 -= d, s2 += d, k)
                        break e;
                    } else
                      r3.head && (r3.head.comment = null);
                    r3.mode = 9;
                  case 9:
                    if (512 & r3.flags) {
                      for (; l2 < 16; ) {
                        if (0 === o2)
                          break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      if (u2 !== (65535 & r3.check)) {
                        e2.msg = "header crc mismatch", r3.mode = 30;
                        break;
                      }
                      l2 = u2 = 0;
                    }
                    r3.head && (r3.head.hcrc = r3.flags >> 9 & 1, r3.head.done = true), e2.adler = r3.check = 0, r3.mode = 12;
                    break;
                  case 10:
                    for (; l2 < 32; ) {
                      if (0 === o2)
                        break e;
                      o2--, u2 += n2[s2++] << l2, l2 += 8;
                    }
                    e2.adler = r3.check = L(u2), l2 = u2 = 0, r3.mode = 11;
                  case 11:
                    if (0 === r3.havedict)
                      return e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r3.hold = u2, r3.bits = l2, 2;
                    e2.adler = r3.check = 1, r3.mode = 12;
                  case 12:
                    if (5 === t2 || 6 === t2)
                      break e;
                  case 13:
                    if (r3.last) {
                      u2 >>>= 7 & l2, l2 -= 7 & l2, r3.mode = 27;
                      break;
                    }
                    for (; l2 < 3; ) {
                      if (0 === o2)
                        break e;
                      o2--, u2 += n2[s2++] << l2, l2 += 8;
                    }
                    switch (r3.last = 1 & u2, l2 -= 1, 3 & (u2 >>>= 1)) {
                      case 0:
                        r3.mode = 14;
                        break;
                      case 1:
                        if (j(r3), r3.mode = 20, 6 !== t2)
                          break;
                        u2 >>>= 2, l2 -= 2;
                        break e;
                      case 2:
                        r3.mode = 17;
                        break;
                      case 3:
                        e2.msg = "invalid block type", r3.mode = 30;
                    }
                    u2 >>>= 2, l2 -= 2;
                    break;
                  case 14:
                    for (u2 >>>= 7 & l2, l2 -= 7 & l2; l2 < 32; ) {
                      if (0 === o2)
                        break e;
                      o2--, u2 += n2[s2++] << l2, l2 += 8;
                    }
                    if ((65535 & u2) != (u2 >>> 16 ^ 65535)) {
                      e2.msg = "invalid stored block lengths", r3.mode = 30;
                      break;
                    }
                    if (r3.length = 65535 & u2, l2 = u2 = 0, r3.mode = 15, 6 === t2)
                      break e;
                  case 15:
                    r3.mode = 16;
                  case 16:
                    if (d = r3.length) {
                      if (o2 < d && (d = o2), h2 < d && (d = h2), 0 === d)
                        break e;
                      I.arraySet(i2, n2, s2, d, a2), o2 -= d, s2 += d, h2 -= d, a2 += d, r3.length -= d;
                      break;
                    }
                    r3.mode = 12;
                    break;
                  case 17:
                    for (; l2 < 14; ) {
                      if (0 === o2)
                        break e;
                      o2--, u2 += n2[s2++] << l2, l2 += 8;
                    }
                    if (r3.nlen = 257 + (31 & u2), u2 >>>= 5, l2 -= 5, r3.ndist = 1 + (31 & u2), u2 >>>= 5, l2 -= 5, r3.ncode = 4 + (15 & u2), u2 >>>= 4, l2 -= 4, 286 < r3.nlen || 30 < r3.ndist) {
                      e2.msg = "too many length or distance symbols", r3.mode = 30;
                      break;
                    }
                    r3.have = 0, r3.mode = 18;
                  case 18:
                    for (; r3.have < r3.ncode; ) {
                      for (; l2 < 3; ) {
                        if (0 === o2)
                          break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      r3.lens[A[r3.have++]] = 7 & u2, u2 >>>= 3, l2 -= 3;
                    }
                    for (; r3.have < 19; )
                      r3.lens[A[r3.have++]] = 0;
                    if (r3.lencode = r3.lendyn, r3.lenbits = 7, S = { bits: r3.lenbits }, x = T(0, r3.lens, 0, 19, r3.lencode, 0, r3.work, S), r3.lenbits = S.bits, x) {
                      e2.msg = "invalid code lengths set", r3.mode = 30;
                      break;
                    }
                    r3.have = 0, r3.mode = 19;
                  case 19:
                    for (; r3.have < r3.nlen + r3.ndist; ) {
                      for (; g = (C = r3.lencode[u2 & (1 << r3.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                        if (0 === o2)
                          break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      if (b < 16)
                        u2 >>>= _, l2 -= _, r3.lens[r3.have++] = b;
                      else {
                        if (16 === b) {
                          for (z = _ + 2; l2 < z; ) {
                            if (0 === o2)
                              break e;
                            o2--, u2 += n2[s2++] << l2, l2 += 8;
                          }
                          if (u2 >>>= _, l2 -= _, 0 === r3.have) {
                            e2.msg = "invalid bit length repeat", r3.mode = 30;
                            break;
                          }
                          k = r3.lens[r3.have - 1], d = 3 + (3 & u2), u2 >>>= 2, l2 -= 2;
                        } else if (17 === b) {
                          for (z = _ + 3; l2 < z; ) {
                            if (0 === o2)
                              break e;
                            o2--, u2 += n2[s2++] << l2, l2 += 8;
                          }
                          l2 -= _, k = 0, d = 3 + (7 & (u2 >>>= _)), u2 >>>= 3, l2 -= 3;
                        } else {
                          for (z = _ + 7; l2 < z; ) {
                            if (0 === o2)
                              break e;
                            o2--, u2 += n2[s2++] << l2, l2 += 8;
                          }
                          l2 -= _, k = 0, d = 11 + (127 & (u2 >>>= _)), u2 >>>= 7, l2 -= 7;
                        }
                        if (r3.have + d > r3.nlen + r3.ndist) {
                          e2.msg = "invalid bit length repeat", r3.mode = 30;
                          break;
                        }
                        for (; d--; )
                          r3.lens[r3.have++] = k;
                      }
                    }
                    if (30 === r3.mode)
                      break;
                    if (0 === r3.lens[256]) {
                      e2.msg = "invalid code -- missing end-of-block", r3.mode = 30;
                      break;
                    }
                    if (r3.lenbits = 9, S = { bits: r3.lenbits }, x = T(D, r3.lens, 0, r3.nlen, r3.lencode, 0, r3.work, S), r3.lenbits = S.bits, x) {
                      e2.msg = "invalid literal/lengths set", r3.mode = 30;
                      break;
                    }
                    if (r3.distbits = 6, r3.distcode = r3.distdyn, S = { bits: r3.distbits }, x = T(F, r3.lens, r3.nlen, r3.ndist, r3.distcode, 0, r3.work, S), r3.distbits = S.bits, x) {
                      e2.msg = "invalid distances set", r3.mode = 30;
                      break;
                    }
                    if (r3.mode = 20, 6 === t2)
                      break e;
                  case 20:
                    r3.mode = 21;
                  case 21:
                    if (6 <= o2 && 258 <= h2) {
                      e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r3.hold = u2, r3.bits = l2, R(e2, c2), a2 = e2.next_out, i2 = e2.output, h2 = e2.avail_out, s2 = e2.next_in, n2 = e2.input, o2 = e2.avail_in, u2 = r3.hold, l2 = r3.bits, 12 === r3.mode && (r3.back = -1);
                      break;
                    }
                    for (r3.back = 0; g = (C = r3.lencode[u2 & (1 << r3.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                      if (0 === o2)
                        break e;
                      o2--, u2 += n2[s2++] << l2, l2 += 8;
                    }
                    if (g && 0 == (240 & g)) {
                      for (v = _, y = g, w = b; g = (C = r3.lencode[w + ((u2 & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l2); ) {
                        if (0 === o2)
                          break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      u2 >>>= v, l2 -= v, r3.back += v;
                    }
                    if (u2 >>>= _, l2 -= _, r3.back += _, r3.length = b, 0 === g) {
                      r3.mode = 26;
                      break;
                    }
                    if (32 & g) {
                      r3.back = -1, r3.mode = 12;
                      break;
                    }
                    if (64 & g) {
                      e2.msg = "invalid literal/length code", r3.mode = 30;
                      break;
                    }
                    r3.extra = 15 & g, r3.mode = 22;
                  case 22:
                    if (r3.extra) {
                      for (z = r3.extra; l2 < z; ) {
                        if (0 === o2)
                          break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      r3.length += u2 & (1 << r3.extra) - 1, u2 >>>= r3.extra, l2 -= r3.extra, r3.back += r3.extra;
                    }
                    r3.was = r3.length, r3.mode = 23;
                  case 23:
                    for (; g = (C = r3.distcode[u2 & (1 << r3.distbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                      if (0 === o2)
                        break e;
                      o2--, u2 += n2[s2++] << l2, l2 += 8;
                    }
                    if (0 == (240 & g)) {
                      for (v = _, y = g, w = b; g = (C = r3.distcode[w + ((u2 & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l2); ) {
                        if (0 === o2)
                          break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      u2 >>>= v, l2 -= v, r3.back += v;
                    }
                    if (u2 >>>= _, l2 -= _, r3.back += _, 64 & g) {
                      e2.msg = "invalid distance code", r3.mode = 30;
                      break;
                    }
                    r3.offset = b, r3.extra = 15 & g, r3.mode = 24;
                  case 24:
                    if (r3.extra) {
                      for (z = r3.extra; l2 < z; ) {
                        if (0 === o2)
                          break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      r3.offset += u2 & (1 << r3.extra) - 1, u2 >>>= r3.extra, l2 -= r3.extra, r3.back += r3.extra;
                    }
                    if (r3.offset > r3.dmax) {
                      e2.msg = "invalid distance too far back", r3.mode = 30;
                      break;
                    }
                    r3.mode = 25;
                  case 25:
                    if (0 === h2)
                      break e;
                    if (d = c2 - h2, r3.offset > d) {
                      if ((d = r3.offset - d) > r3.whave && r3.sane) {
                        e2.msg = "invalid distance too far back", r3.mode = 30;
                        break;
                      }
                      p = d > r3.wnext ? (d -= r3.wnext, r3.wsize - d) : r3.wnext - d, d > r3.length && (d = r3.length), m = r3.window;
                    } else
                      m = i2, p = a2 - r3.offset, d = r3.length;
                    for (h2 < d && (d = h2), h2 -= d, r3.length -= d; i2[a2++] = m[p++], --d; )
                      ;
                    0 === r3.length && (r3.mode = 21);
                    break;
                  case 26:
                    if (0 === h2)
                      break e;
                    i2[a2++] = r3.length, h2--, r3.mode = 21;
                    break;
                  case 27:
                    if (r3.wrap) {
                      for (; l2 < 32; ) {
                        if (0 === o2)
                          break e;
                        o2--, u2 |= n2[s2++] << l2, l2 += 8;
                      }
                      if (c2 -= h2, e2.total_out += c2, r3.total += c2, c2 && (e2.adler = r3.check = r3.flags ? B(r3.check, i2, c2, a2 - c2) : O(r3.check, i2, c2, a2 - c2)), c2 = h2, (r3.flags ? u2 : L(u2)) !== r3.check) {
                        e2.msg = "incorrect data check", r3.mode = 30;
                        break;
                      }
                      l2 = u2 = 0;
                    }
                    r3.mode = 28;
                  case 28:
                    if (r3.wrap && r3.flags) {
                      for (; l2 < 32; ) {
                        if (0 === o2)
                          break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      if (u2 !== (4294967295 & r3.total)) {
                        e2.msg = "incorrect length check", r3.mode = 30;
                        break;
                      }
                      l2 = u2 = 0;
                    }
                    r3.mode = 29;
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
            return e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r3.hold = u2, r3.bits = l2, (r3.wsize || c2 !== e2.avail_out && r3.mode < 30 && (r3.mode < 27 || 4 !== t2)) && Z(e2, e2.output, e2.next_out, c2 - e2.avail_out) ? (r3.mode = 31, -4) : (f2 -= e2.avail_in, c2 -= e2.avail_out, e2.total_in += f2, e2.total_out += c2, r3.total += c2, r3.wrap && c2 && (e2.adler = r3.check = r3.flags ? B(r3.check, i2, c2, e2.next_out - c2) : O(r3.check, i2, c2, e2.next_out - c2)), e2.data_type = r3.bits + (r3.last ? 64 : 0) + (12 === r3.mode ? 128 : 0) + (20 === r3.mode || 15 === r3.mode ? 256 : 0), (0 == f2 && 0 === c2 || 4 === t2) && x === N && (x = -5), x);
          }, r2.inflateEnd = function(e2) {
            if (!e2 || !e2.state)
              return U;
            var t2 = e2.state;
            return t2.window && (t2.window = null), e2.state = null, N;
          }, r2.inflateGetHeader = function(e2, t2) {
            var r3;
            return e2 && e2.state ? 0 == (2 & (r3 = e2.state).wrap) ? U : ((r3.head = t2).done = false, N) : U;
          }, r2.inflateSetDictionary = function(e2, t2) {
            var r3, n2 = t2.length;
            return e2 && e2.state ? 0 !== (r3 = e2.state).wrap && 11 !== r3.mode ? U : 11 === r3.mode && O(1, t2, n2, 0) !== r3.check ? -3 : Z(e2, t2, n2, n2) ? (r3.mode = 31, -4) : (r3.havedict = 1, N) : U;
          }, r2.inflateInfo = "pako inflate (from Nodeca project)";
        }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, t, r2) {
          "use strict";
          var D = e("../utils/common"), F = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], N = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], U = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], P = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
          t.exports = function(e2, t2, r3, n, i, s, a, o) {
            var h, u, l, f, c, d, p, m, _, g = o.bits, b = 0, v = 0, y = 0, w = 0, k = 0, x = 0, S = 0, z = 0, C = 0, E = 0, A = null, I = 0, O = new D.Buf16(16), B = new D.Buf16(16), R = null, T = 0;
            for (b = 0; b <= 15; b++)
              O[b] = 0;
            for (v = 0; v < n; v++)
              O[t2[r3 + v]]++;
            for (k = g, w = 15; 1 <= w && 0 === O[w]; w--)
              ;
            if (w < k && (k = w), 0 === w)
              return i[s++] = 20971520, i[s++] = 20971520, o.bits = 1, 0;
            for (y = 1; y < w && 0 === O[y]; y++)
              ;
            for (k < y && (k = y), b = z = 1; b <= 15; b++)
              if (z <<= 1, (z -= O[b]) < 0)
                return -1;
            if (0 < z && (0 === e2 || 1 !== w))
              return -1;
            for (B[1] = 0, b = 1; b < 15; b++)
              B[b + 1] = B[b] + O[b];
            for (v = 0; v < n; v++)
              0 !== t2[r3 + v] && (a[B[t2[r3 + v]]++] = v);
            if (d = 0 === e2 ? (A = R = a, 19) : 1 === e2 ? (A = F, I -= 257, R = N, T -= 257, 256) : (A = U, R = P, -1), b = y, c = s, S = v = E = 0, l = -1, f = (C = 1 << (x = k)) - 1, 1 === e2 && 852 < C || 2 === e2 && 592 < C)
              return 1;
            for (; ; ) {
              for (p = b - S, _ = a[v] < d ? (m = 0, a[v]) : a[v] > d ? (m = R[T + a[v]], A[I + a[v]]) : (m = 96, 0), h = 1 << b - S, y = u = 1 << x; i[c + (E >> S) + (u -= h)] = p << 24 | m << 16 | _ | 0, 0 !== u; )
                ;
              for (h = 1 << b - 1; E & h; )
                h >>= 1;
              if (0 !== h ? (E &= h - 1, E += h) : E = 0, v++, 0 == --O[b]) {
                if (b === w)
                  break;
                b = t2[r3 + a[v]];
              }
              if (k < b && (E & f) !== l) {
                for (0 === S && (S = k), c += y, z = 1 << (x = b - S); x + S < w && !((z -= O[x + S]) <= 0); )
                  x++, z <<= 1;
                if (C += 1 << x, 1 === e2 && 852 < C || 2 === e2 && 592 < C)
                  return 1;
                i[l = E & f] = k << 24 | x << 16 | c - s | 0;
              }
            }
            return 0 !== E && (i[c + E] = b - S << 24 | 64 << 16 | 0), o.bits = k, 0;
          };
        }, { "../utils/common": 41 }], 51: [function(e, t, r2) {
          "use strict";
          t.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
        }, {}], 52: [function(e, t, r2) {
          "use strict";
          var i = e("../utils/common"), o = 0, h = 1;
          function n(e2) {
            for (var t2 = e2.length; 0 <= --t2; )
              e2[t2] = 0;
          }
          var s = 0, a = 29, u = 256, l = u + 1 + a, f = 30, c = 19, _ = 2 * l + 1, g = 15, d = 16, p = 7, m = 256, b = 16, v = 17, y = 18, w = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], k = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], x = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], S = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], z = new Array(2 * (l + 2));
          n(z);
          var C = new Array(2 * f);
          n(C);
          var E = new Array(512);
          n(E);
          var A = new Array(256);
          n(A);
          var I = new Array(a);
          n(I);
          var O, B, R, T = new Array(f);
          function D(e2, t2, r3, n2, i2) {
            this.static_tree = e2, this.extra_bits = t2, this.extra_base = r3, this.elems = n2, this.max_length = i2, this.has_stree = e2 && e2.length;
          }
          function F(e2, t2) {
            this.dyn_tree = e2, this.max_code = 0, this.stat_desc = t2;
          }
          function N(e2) {
            return e2 < 256 ? E[e2] : E[256 + (e2 >>> 7)];
          }
          function U(e2, t2) {
            e2.pending_buf[e2.pending++] = 255 & t2, e2.pending_buf[e2.pending++] = t2 >>> 8 & 255;
          }
          function P(e2, t2, r3) {
            e2.bi_valid > d - r3 ? (e2.bi_buf |= t2 << e2.bi_valid & 65535, U(e2, e2.bi_buf), e2.bi_buf = t2 >> d - e2.bi_valid, e2.bi_valid += r3 - d) : (e2.bi_buf |= t2 << e2.bi_valid & 65535, e2.bi_valid += r3);
          }
          function L(e2, t2, r3) {
            P(e2, r3[2 * t2], r3[2 * t2 + 1]);
          }
          function j(e2, t2) {
            for (var r3 = 0; r3 |= 1 & e2, e2 >>>= 1, r3 <<= 1, 0 < --t2; )
              ;
            return r3 >>> 1;
          }
          function Z(e2, t2, r3) {
            var n2, i2, s2 = new Array(g + 1), a2 = 0;
            for (n2 = 1; n2 <= g; n2++)
              s2[n2] = a2 = a2 + r3[n2 - 1] << 1;
            for (i2 = 0; i2 <= t2; i2++) {
              var o2 = e2[2 * i2 + 1];
              0 !== o2 && (e2[2 * i2] = j(s2[o2]++, o2));
            }
          }
          function W(e2) {
            var t2;
            for (t2 = 0; t2 < l; t2++)
              e2.dyn_ltree[2 * t2] = 0;
            for (t2 = 0; t2 < f; t2++)
              e2.dyn_dtree[2 * t2] = 0;
            for (t2 = 0; t2 < c; t2++)
              e2.bl_tree[2 * t2] = 0;
            e2.dyn_ltree[2 * m] = 1, e2.opt_len = e2.static_len = 0, e2.last_lit = e2.matches = 0;
          }
          function M(e2) {
            8 < e2.bi_valid ? U(e2, e2.bi_buf) : 0 < e2.bi_valid && (e2.pending_buf[e2.pending++] = e2.bi_buf), e2.bi_buf = 0, e2.bi_valid = 0;
          }
          function H(e2, t2, r3, n2) {
            var i2 = 2 * t2, s2 = 2 * r3;
            return e2[i2] < e2[s2] || e2[i2] === e2[s2] && n2[t2] <= n2[r3];
          }
          function G(e2, t2, r3) {
            for (var n2 = e2.heap[r3], i2 = r3 << 1; i2 <= e2.heap_len && (i2 < e2.heap_len && H(t2, e2.heap[i2 + 1], e2.heap[i2], e2.depth) && i2++, !H(t2, n2, e2.heap[i2], e2.depth)); )
              e2.heap[r3] = e2.heap[i2], r3 = i2, i2 <<= 1;
            e2.heap[r3] = n2;
          }
          function K(e2, t2, r3) {
            var n2, i2, s2, a2, o2 = 0;
            if (0 !== e2.last_lit)
              for (; n2 = e2.pending_buf[e2.d_buf + 2 * o2] << 8 | e2.pending_buf[e2.d_buf + 2 * o2 + 1], i2 = e2.pending_buf[e2.l_buf + o2], o2++, 0 === n2 ? L(e2, i2, t2) : (L(e2, (s2 = A[i2]) + u + 1, t2), 0 !== (a2 = w[s2]) && P(e2, i2 -= I[s2], a2), L(e2, s2 = N(--n2), r3), 0 !== (a2 = k[s2]) && P(e2, n2 -= T[s2], a2)), o2 < e2.last_lit; )
                ;
            L(e2, m, t2);
          }
          function Y(e2, t2) {
            var r3, n2, i2, s2 = t2.dyn_tree, a2 = t2.stat_desc.static_tree, o2 = t2.stat_desc.has_stree, h2 = t2.stat_desc.elems, u2 = -1;
            for (e2.heap_len = 0, e2.heap_max = _, r3 = 0; r3 < h2; r3++)
              0 !== s2[2 * r3] ? (e2.heap[++e2.heap_len] = u2 = r3, e2.depth[r3] = 0) : s2[2 * r3 + 1] = 0;
            for (; e2.heap_len < 2; )
              s2[2 * (i2 = e2.heap[++e2.heap_len] = u2 < 2 ? ++u2 : 0)] = 1, e2.depth[i2] = 0, e2.opt_len--, o2 && (e2.static_len -= a2[2 * i2 + 1]);
            for (t2.max_code = u2, r3 = e2.heap_len >> 1; 1 <= r3; r3--)
              G(e2, s2, r3);
            for (i2 = h2; r3 = e2.heap[1], e2.heap[1] = e2.heap[e2.heap_len--], G(e2, s2, 1), n2 = e2.heap[1], e2.heap[--e2.heap_max] = r3, e2.heap[--e2.heap_max] = n2, s2[2 * i2] = s2[2 * r3] + s2[2 * n2], e2.depth[i2] = (e2.depth[r3] >= e2.depth[n2] ? e2.depth[r3] : e2.depth[n2]) + 1, s2[2 * r3 + 1] = s2[2 * n2 + 1] = i2, e2.heap[1] = i2++, G(e2, s2, 1), 2 <= e2.heap_len; )
              ;
            e2.heap[--e2.heap_max] = e2.heap[1], function(e3, t3) {
              var r4, n3, i3, s3, a3, o3, h3 = t3.dyn_tree, u3 = t3.max_code, l2 = t3.stat_desc.static_tree, f2 = t3.stat_desc.has_stree, c2 = t3.stat_desc.extra_bits, d2 = t3.stat_desc.extra_base, p2 = t3.stat_desc.max_length, m2 = 0;
              for (s3 = 0; s3 <= g; s3++)
                e3.bl_count[s3] = 0;
              for (h3[2 * e3.heap[e3.heap_max] + 1] = 0, r4 = e3.heap_max + 1; r4 < _; r4++)
                p2 < (s3 = h3[2 * h3[2 * (n3 = e3.heap[r4]) + 1] + 1] + 1) && (s3 = p2, m2++), h3[2 * n3 + 1] = s3, u3 < n3 || (e3.bl_count[s3]++, a3 = 0, d2 <= n3 && (a3 = c2[n3 - d2]), o3 = h3[2 * n3], e3.opt_len += o3 * (s3 + a3), f2 && (e3.static_len += o3 * (l2[2 * n3 + 1] + a3)));
              if (0 !== m2) {
                do {
                  for (s3 = p2 - 1; 0 === e3.bl_count[s3]; )
                    s3--;
                  e3.bl_count[s3]--, e3.bl_count[s3 + 1] += 2, e3.bl_count[p2]--, m2 -= 2;
                } while (0 < m2);
                for (s3 = p2; 0 !== s3; s3--)
                  for (n3 = e3.bl_count[s3]; 0 !== n3; )
                    u3 < (i3 = e3.heap[--r4]) || (h3[2 * i3 + 1] !== s3 && (e3.opt_len += (s3 - h3[2 * i3 + 1]) * h3[2 * i3], h3[2 * i3 + 1] = s3), n3--);
              }
            }(e2, t2), Z(s2, u2, e2.bl_count);
          }
          function X(e2, t2, r3) {
            var n2, i2, s2 = -1, a2 = t2[1], o2 = 0, h2 = 7, u2 = 4;
            for (0 === a2 && (h2 = 138, u2 = 3), t2[2 * (r3 + 1) + 1] = 65535, n2 = 0; n2 <= r3; n2++)
              i2 = a2, a2 = t2[2 * (n2 + 1) + 1], ++o2 < h2 && i2 === a2 || (o2 < u2 ? e2.bl_tree[2 * i2] += o2 : 0 !== i2 ? (i2 !== s2 && e2.bl_tree[2 * i2]++, e2.bl_tree[2 * b]++) : o2 <= 10 ? e2.bl_tree[2 * v]++ : e2.bl_tree[2 * y]++, s2 = i2, u2 = (o2 = 0) === a2 ? (h2 = 138, 3) : i2 === a2 ? (h2 = 6, 3) : (h2 = 7, 4));
          }
          function V(e2, t2, r3) {
            var n2, i2, s2 = -1, a2 = t2[1], o2 = 0, h2 = 7, u2 = 4;
            for (0 === a2 && (h2 = 138, u2 = 3), n2 = 0; n2 <= r3; n2++)
              if (i2 = a2, a2 = t2[2 * (n2 + 1) + 1], !(++o2 < h2 && i2 === a2)) {
                if (o2 < u2)
                  for (; L(e2, i2, e2.bl_tree), 0 != --o2; )
                    ;
                else
                  0 !== i2 ? (i2 !== s2 && (L(e2, i2, e2.bl_tree), o2--), L(e2, b, e2.bl_tree), P(e2, o2 - 3, 2)) : o2 <= 10 ? (L(e2, v, e2.bl_tree), P(e2, o2 - 3, 3)) : (L(e2, y, e2.bl_tree), P(e2, o2 - 11, 7));
                s2 = i2, u2 = (o2 = 0) === a2 ? (h2 = 138, 3) : i2 === a2 ? (h2 = 6, 3) : (h2 = 7, 4);
              }
          }
          n(T);
          var q = false;
          function J(e2, t2, r3, n2) {
            P(e2, (s << 1) + (n2 ? 1 : 0), 3), function(e3, t3, r4, n3) {
              M(e3), n3 && (U(e3, r4), U(e3, ~r4)), i.arraySet(e3.pending_buf, e3.window, t3, r4, e3.pending), e3.pending += r4;
            }(e2, t2, r3, true);
          }
          r2._tr_init = function(e2) {
            q || (function() {
              var e3, t2, r3, n2, i2, s2 = new Array(g + 1);
              for (n2 = r3 = 0; n2 < a - 1; n2++)
                for (I[n2] = r3, e3 = 0; e3 < 1 << w[n2]; e3++)
                  A[r3++] = n2;
              for (A[r3 - 1] = n2, n2 = i2 = 0; n2 < 16; n2++)
                for (T[n2] = i2, e3 = 0; e3 < 1 << k[n2]; e3++)
                  E[i2++] = n2;
              for (i2 >>= 7; n2 < f; n2++)
                for (T[n2] = i2 << 7, e3 = 0; e3 < 1 << k[n2] - 7; e3++)
                  E[256 + i2++] = n2;
              for (t2 = 0; t2 <= g; t2++)
                s2[t2] = 0;
              for (e3 = 0; e3 <= 143; )
                z[2 * e3 + 1] = 8, e3++, s2[8]++;
              for (; e3 <= 255; )
                z[2 * e3 + 1] = 9, e3++, s2[9]++;
              for (; e3 <= 279; )
                z[2 * e3 + 1] = 7, e3++, s2[7]++;
              for (; e3 <= 287; )
                z[2 * e3 + 1] = 8, e3++, s2[8]++;
              for (Z(z, l + 1, s2), e3 = 0; e3 < f; e3++)
                C[2 * e3 + 1] = 5, C[2 * e3] = j(e3, 5);
              O = new D(z, w, u + 1, l, g), B = new D(C, k, 0, f, g), R = new D(new Array(0), x, 0, c, p);
            }(), q = true), e2.l_desc = new F(e2.dyn_ltree, O), e2.d_desc = new F(e2.dyn_dtree, B), e2.bl_desc = new F(e2.bl_tree, R), e2.bi_buf = 0, e2.bi_valid = 0, W(e2);
          }, r2._tr_stored_block = J, r2._tr_flush_block = function(e2, t2, r3, n2) {
            var i2, s2, a2 = 0;
            0 < e2.level ? (2 === e2.strm.data_type && (e2.strm.data_type = function(e3) {
              var t3, r4 = 4093624447;
              for (t3 = 0; t3 <= 31; t3++, r4 >>>= 1)
                if (1 & r4 && 0 !== e3.dyn_ltree[2 * t3])
                  return o;
              if (0 !== e3.dyn_ltree[18] || 0 !== e3.dyn_ltree[20] || 0 !== e3.dyn_ltree[26])
                return h;
              for (t3 = 32; t3 < u; t3++)
                if (0 !== e3.dyn_ltree[2 * t3])
                  return h;
              return o;
            }(e2)), Y(e2, e2.l_desc), Y(e2, e2.d_desc), a2 = function(e3) {
              var t3;
              for (X(e3, e3.dyn_ltree, e3.l_desc.max_code), X(e3, e3.dyn_dtree, e3.d_desc.max_code), Y(e3, e3.bl_desc), t3 = c - 1; 3 <= t3 && 0 === e3.bl_tree[2 * S[t3] + 1]; t3--)
                ;
              return e3.opt_len += 3 * (t3 + 1) + 5 + 5 + 4, t3;
            }(e2), i2 = e2.opt_len + 3 + 7 >>> 3, (s2 = e2.static_len + 3 + 7 >>> 3) <= i2 && (i2 = s2)) : i2 = s2 = r3 + 5, r3 + 4 <= i2 && -1 !== t2 ? J(e2, t2, r3, n2) : 4 === e2.strategy || s2 === i2 ? (P(e2, 2 + (n2 ? 1 : 0), 3), K(e2, z, C)) : (P(e2, 4 + (n2 ? 1 : 0), 3), function(e3, t3, r4, n3) {
              var i3;
              for (P(e3, t3 - 257, 5), P(e3, r4 - 1, 5), P(e3, n3 - 4, 4), i3 = 0; i3 < n3; i3++)
                P(e3, e3.bl_tree[2 * S[i3] + 1], 3);
              V(e3, e3.dyn_ltree, t3 - 1), V(e3, e3.dyn_dtree, r4 - 1);
            }(e2, e2.l_desc.max_code + 1, e2.d_desc.max_code + 1, a2 + 1), K(e2, e2.dyn_ltree, e2.dyn_dtree)), W(e2), n2 && M(e2);
          }, r2._tr_tally = function(e2, t2, r3) {
            return e2.pending_buf[e2.d_buf + 2 * e2.last_lit] = t2 >>> 8 & 255, e2.pending_buf[e2.d_buf + 2 * e2.last_lit + 1] = 255 & t2, e2.pending_buf[e2.l_buf + e2.last_lit] = 255 & r3, e2.last_lit++, 0 === t2 ? e2.dyn_ltree[2 * r3]++ : (e2.matches++, t2--, e2.dyn_ltree[2 * (A[r3] + u + 1)]++, e2.dyn_dtree[2 * N(t2)]++), e2.last_lit === e2.lit_bufsize - 1;
          }, r2._tr_align = function(e2) {
            P(e2, 2, 3), L(e2, m, z), function(e3) {
              16 === e3.bi_valid ? (U(e3, e3.bi_buf), e3.bi_buf = 0, e3.bi_valid = 0) : 8 <= e3.bi_valid && (e3.pending_buf[e3.pending++] = 255 & e3.bi_buf, e3.bi_buf >>= 8, e3.bi_valid -= 8);
            }(e2);
          };
        }, { "../utils/common": 41 }], 53: [function(e, t, r2) {
          "use strict";
          t.exports = function() {
            this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
          };
        }, {}], 54: [function(e, t, r2) {
          (function(e2) {
            !function(r3, n) {
              "use strict";
              if (!r3.setImmediate) {
                var i, s, t2, a, o = 1, h = {}, u = false, l = r3.document, e3 = Object.getPrototypeOf && Object.getPrototypeOf(r3);
                e3 = e3 && e3.setTimeout ? e3 : r3, i = "[object process]" === {}.toString.call(r3.process) ? function(e4) {
                  process.nextTick(function() {
                    c(e4);
                  });
                } : function() {
                  if (r3.postMessage && !r3.importScripts) {
                    var e4 = true, t3 = r3.onmessage;
                    return r3.onmessage = function() {
                      e4 = false;
                    }, r3.postMessage("", "*"), r3.onmessage = t3, e4;
                  }
                }() ? (a = "setImmediate$" + Math.random() + "$", r3.addEventListener ? r3.addEventListener("message", d, false) : r3.attachEvent("onmessage", d), function(e4) {
                  r3.postMessage(a + e4, "*");
                }) : r3.MessageChannel ? ((t2 = new MessageChannel()).port1.onmessage = function(e4) {
                  c(e4.data);
                }, function(e4) {
                  t2.port2.postMessage(e4);
                }) : l && "onreadystatechange" in l.createElement("script") ? (s = l.documentElement, function(e4) {
                  var t3 = l.createElement("script");
                  t3.onreadystatechange = function() {
                    c(e4), t3.onreadystatechange = null, s.removeChild(t3), t3 = null;
                  }, s.appendChild(t3);
                }) : function(e4) {
                  setTimeout(c, 0, e4);
                }, e3.setImmediate = function(e4) {
                  "function" != typeof e4 && (e4 = new Function("" + e4));
                  for (var t3 = new Array(arguments.length - 1), r4 = 0; r4 < t3.length; r4++)
                    t3[r4] = arguments[r4 + 1];
                  var n2 = { callback: e4, args: t3 };
                  return h[o] = n2, i(o), o++;
                }, e3.clearImmediate = f;
              }
              function f(e4) {
                delete h[e4];
              }
              function c(e4) {
                if (u)
                  setTimeout(c, 0, e4);
                else {
                  var t3 = h[e4];
                  if (t3) {
                    u = true;
                    try {
                      !function(e5) {
                        var t4 = e5.callback, r4 = e5.args;
                        switch (r4.length) {
                          case 0:
                            t4();
                            break;
                          case 1:
                            t4(r4[0]);
                            break;
                          case 2:
                            t4(r4[0], r4[1]);
                            break;
                          case 3:
                            t4(r4[0], r4[1], r4[2]);
                            break;
                          default:
                            t4.apply(n, r4);
                        }
                      }(t3);
                    } finally {
                      f(e4), u = false;
                    }
                  }
                }
              }
              function d(e4) {
                e4.source === r3 && "string" == typeof e4.data && 0 === e4.data.indexOf(a) && c(+e4.data.slice(a.length));
              }
            }("undefined" == typeof self ? void 0 === e2 ? this : e2 : self);
          }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
        }, {}] }, {}, [10])(10);
      });
    }
  });

  // src/main.ts
  var import_ffn_parser4 = __toESM(require_lib());

  // src/api/Api.ts
  var import_ffn_parser = __toESM(require_lib());

  // src/util/environment.ts
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
    if (location.pathname.match(/^\/(?:anime|book|cartoon|comic|game|misc|play|movie|tv)\/.+$/i) || location.pathname.match(/^\/[^/]+[-_]Crossovers\//i) || location.pathname.indexOf("/community/") === 0) {
      return 7 /* StoryList */;
    }
    if (location.pathname.match(/^\/(crossovers\/)?(?:anime|book|cartoon|comic|game|misc|play|movie|tv)\/?$/i) || location.pathname.match(/^\/crossovers\/(.*?)\/(\d+)\/?$/i)) {
      return 8 /* UniverseList */;
    }
    if (location.pathname.match(/^\/communities\/(?:anime|book|cartoon|comic|game|misc|play|movie|tv|general)\/([\w\d]+)/i)) {
      return 9 /* CommunityList */;
    }
    return 0 /* Other */;
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
    /**
     * Retrieves all story alerts that are set on FFN for the current user.
     */
    async getStoryAlerts() {
      if (this.alerts == null) {
        this.alerts = (async () => {
          const fragments = await this.getMultiPage("/alert/story.php");
          const result = [];
          await Promise.all(
            fragments.map(async (fragment) => {
              const follows = await (0, import_ffn_parser.parseFollows)(fragment);
              if (follows) {
                result.push(...follows);
              }
            })
          );
          return result;
        })();
      }
      return this.alerts;
    }
    /**
     * Retrieves all favorites that are set on FFN for the current user.
     */
    async getStoryFavorites() {
      if (this.favorites == null) {
        this.favorites = (async () => {
          const fragments = await this.getMultiPage("/favorites/story.php");
          const result = [];
          await Promise.all(
            fragments.map(async (fragment) => {
              const follows = await (0, import_ffn_parser.parseFollows)(fragment);
              if (follows) {
                result.push(...follows);
              }
            })
          );
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
      var _a, _b, _c, _d;
      const body = await this.get(`/s/${storyId}/${chapterId}`);
      const template = document.createElement("template");
      template.innerHTML = body;
      return ((_d = (_c = (_b = (_a = template.content.getElementById("storytext")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim()) == null ? void 0 : _c.split(/\s+/)) == null ? void 0 : _d.length) ?? 0;
    }
    async addStoryAlert(id) {
      await this.post(
        "/api/ajax_subs.php",
        {
          storyid: `${id}`,
          userid: `${environment.currentUserId}`,
          storyalert: "1"
        },
        "json"
      );
    }
    async removeStoryAlert(id) {
      await this.post(
        "/alert/story.php",
        {
          action: "remove-multi",
          "rids[]": `${id}`
        },
        "html"
      );
    }
    async addStoryFavorite(id) {
      await this.post(
        "/api/ajax_subs.php",
        {
          storyid: `${id}`,
          userid: `${environment.currentUserId}`,
          favstory: "1"
        },
        "json"
      );
    }
    async removeStoryFavorite(id) {
      await this.post(
        "/favorites/story.php",
        {
          action: "remove-multi",
          "rids[]": `${id}`
        },
        "html"
      );
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
        result.push(
          this.get(`${url}?p=${i}`).then((nextBody) => {
            const nextTemplate = document.createElement("template");
            nextTemplate.innerHTML = nextBody;
            return nextTemplate.content;
          })
        );
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
          // eslint-disable-next-line camelcase
          payload_type: "html",
          // eslint-disable-next-line camelcase
          payload_data: msg.innerHTML
        };
      }
      return void 0;
    }
  };

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

  // src/api/request-manager/NextEvent.ts
  var _NextEvent = class _NextEvent extends Event {
    constructor(requestId) {
      super(_NextEvent.type);
      this.requestId = requestId;
    }
  };
  _NextEvent.type = "next";
  var NextEvent = _NextEvent;

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
          return [line.substring(0, colon), line.substring(colon + 1).trim()];
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
      console.debug(
        "%c%s %c%s %c%d",
        "color: blue",
        request.method,
        "color: inherit",
        request.url,
        "color: blue",
        response.status
      );
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
          this.removeEventListener(NextEvent.type, handler);
          try {
            const response = await this.doFetch(new Request(input, init));
            if (response.status === 429) {
              const retryAfter = response.headers.get("Retry-After");
              const waitSeconds = (retryAfter && !Number.isNaN(+retryAfter) && +retryAfter || 30) + 1;
              console.warn("Rate limited! Waiting %ss.", waitSeconds);
              this.waitUntil = Date.now() + waitSeconds;
              this.addEventListener(NextEvent.type, handler);
              setTimeout(() => {
                this.dispatchEvent(new NextEvent(0));
              }, waitSeconds * 1e3);
            } else {
              resolve(response);
            }
          } catch (err) {
            reject(err);
          } finally {
            this.running -= 1;
            this.dispatchEvent(new NextEvent(requestId));
          }
        };
        this.addEventListener(NextEvent.type, handler);
        handler();
      });
    }
  };

  // src/api/links.ts
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
      this.chapters = data.chapters ? data.chapters.map((chapter2) => new Chapter(data.id, chapter2, valueManager)) : [];
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
      return read.every((r2) => r2);
    }
    async setRead(read) {
      await Promise.all(this.chapters.map((chapter2) => chapter2.read.set(read)));
    }
  };

  // src/api/SmartValue.ts
  function isSmartValue(value) {
    if (value == null || typeof value !== "object") {
      return false;
    }
    return ["get", "set", "subscribe", "unsubscribe", "dispose", "update"].every(
      (key) => typeof (value == null ? void 0 : value[key]) === "function"
    );
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
      await Promise.all(
        Object.getOwnPropertySymbols(this.subscribers).map((sym) => this.subscribers[sym](value)).filter((promise) => promise != null && typeof promise === "object" && "then" in promise)
      );
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
      this.storage.setItem(`${this.name}+timestamp`, `${(/* @__PURE__ */ new Date()).getTime()}`);
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
      await GM.setValue(`${this.name}+timestamp`, (/* @__PURE__ */ new Date()).getTime());
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
        const value = event.key && this.instances[event.key];
        if (!value) {
          return;
        }
        await value.trigger(JSON.parse(event.newValue));
      });
      synchronizer.onValueUpdate(async (key, value) => {
        const instance = this.instances[key];
        if (!instance) {
          await GM.setValue(key, JSON.stringify(value));
          await GM.setValue(`${key}+timestamp`, (/* @__PURE__ */ new Date()).getTime());
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
      return new Story(storyData, this);
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
        this.instances[key] = new SmartValueLocal(
          key,
          this.storage,
          async () => {
            const alerts = await this.api.getStoryAlerts();
            await this.followedStoryDiff(CacheName.isStoryAlertKey, alerts, this.getAlertValue);
            return !!alerts.find((alert) => alert.id === id);
          },
          async (alert) => {
            if (alert) {
              await this.api.addStoryAlert(id);
            } else {
              await this.api.removeStoryAlert(id);
            }
          }
        );
      }
      return this.instances[key];
    }
    getFavoriteValue(id) {
      const key = CacheName.storyFavorite(id);
      if (!this.instances[key]) {
        this.instances[key] = new SmartValueLocal(
          key,
          this.storage,
          async () => {
            const favorites = await this.api.getStoryFavorites();
            await this.followedStoryDiff(CacheName.isStoryFavoriteKey, favorites, this.getFavoriteValue);
            return !!favorites.find((favorite) => favorite.id === id);
          },
          async (favorite) => {
            if (favorite) {
              await this.api.addStoryFavorite(id);
            } else {
              await this.api.removeStoryFavorite(id);
            }
          }
        );
      }
      return this.instances[key];
    }
    getWordCountValue(storyId, chapterId) {
      const key = CacheName.wordCount(storyId, chapterId);
      if (!this.instances[key]) {
        this.instances[key] = new SmartValueLocal(
          key,
          this.storage,
          () => this.api.getChapterWordCount(storyId, chapterId)
        );
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
      const visited = /* @__PURE__ */ new Set();
      await Promise.all(
        updated.map(async (followed) => {
          const value = valueGetter.call(this, followed.id);
          visited.add(value.name);
          await value.update(true);
        })
      );
      const current = Object.keys(this.instances).filter(matchFn).map((key) => this.instances[key]);
      await Promise.all(
        current.map(async (value) => {
          if (!visited.has(value.name)) {
            await value.update(false);
          }
        })
      );
    }
  };

  // node_modules/clsx/dist/clsx.mjs
  function r(e) {
    var t, f, n = "";
    if ("string" == typeof e || "number" == typeof e)
      n += e;
    else if ("object" == typeof e)
      if (Array.isArray(e))
        for (t = 0; t < e.length; t++)
          e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
      else
        for (t in e)
          e[t] && (n && (n += " "), n += t);
    return n;
  }
  function clsx() {
    for (var e, t, f = 0, n = ""; f < arguments.length; )
      (e = arguments[f++]) && (t = r(e)) && (n && (n += " "), n += t);
    return n;
  }
  var clsx_default = clsx;

  // src/jsx/ref.ts
  function isReference(ref) {
    return typeof (ref == null ? void 0 : ref.callback) === "function";
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
          element.appendChild(
            typeof child === "string" || typeof child === "number" || child.nodeType == null ? document.createTextNode(child.toString()) : child
          );
        }
      };
      children.forEach(append);
    }
    refCallbacks.forEach((callback) => callback(element));
    return element;
  }

  // gm-css:src/enhance/components/Button/Button.css
  GM_addStyle(`.btn > svg {
  height: 19px;
  vertical-align: text-bottom;
  margin-top: -2px;
  margin-bottom: -2px;
  fill: currentColor;
}
`);

  // src/enhance/components/Button/Button.tsx
  function Button({
    class: className,
    title: title2,
    active,
    onClick,
    bind,
    ref,
    children
  }) {
    const element = /* @__PURE__ */ render("span", { role: "button", class: clsx_default("btn", className), title: title2 }, children);
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
        await (bind == null ? void 0 : bind.set(!element.classList.contains("ffe-active")));
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
  background-color: var(--ffe-link-color);
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
    var _a;
    const id = `ffe-check-${parseInt(`${Math.random() * 1e8}`, 10)}`;
    const element = /* @__PURE__ */ render("span", { class: "ffe-checkbox" }, /* @__PURE__ */ render("input", { type: "checkbox", id }), /* @__PURE__ */ render("label", { for: id }));
    const apply = (value) => {
      element.firstElementChild.checked = value ?? false;
    };
    bind.subscribe(apply);
    bind.get().then(apply);
    (_a = element.firstElementChild) == null ? void 0 : _a.addEventListener("change", async () => {
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
  border-top: 1px solid var(--ffe-divider-color);
  list-style-type: none;
  margin: 0;
}

.ffe-cl-chapter {
  background-color: var(--ffe-panel-color);
  border-bottom: 1px solid var(--ffe-divider-color);
  font-size: 1.1em;
  line-height: 2em;
  padding: 4px 20px;
}

.ffe-cl-chapter a {
  color: var(--ffe-link-color);
}

.ffe-cl-words {
  color: var(--ffe-on-panel-color);
  float: right;
  font-size: 0.9em;
}

.ffe-cl-collapsed {
  text-align: center;
}
`);

  // src/enhance/components/ChapterList/ChapterList.tsx
  function hideLongChapterList(list) {
    var _a, _b;
    const elements = Array.from(list.children);
    const isRead = (e) => {
      var _a2, _b2;
      return ((_b2 = (_a2 = e.firstElementChild) == null ? void 0 : _a2.firstElementChild) == null ? void 0 : _b2.checked) ?? false;
    };
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
      (_a = elements[0].parentElement) == null ? void 0 : _a.insertBefore(showLinkContainer, elements[i - off]);
      currentBlockIsRead = read;
      currentBlockCount = 1;
    }
    if (currentBlockCount > 6) {
      elements.slice(elements.length - currentBlockCount + 2, elements.length - 3).forEach((element) => {
        element.style.display = "none";
      });
      const showLinkContainer = /* @__PURE__ */ render("li", { class: "ffe-cl-chapter ffe-cl-collapsed" }, /* @__PURE__ */ render(
        "a",
        {
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
        },
        "Show ",
        currentBlockCount - 5,
        " hidden chapters"
      ));
      (_b = elements[0].parentElement) == null ? void 0 : _b.insertBefore(showLinkContainer, elements[elements.length - 3]);
    }
  }
  function ChapterList({ story }) {
    const ref = useRef((list) => {
      setTimeout(() => {
        hideLongChapterList(list);
      }, 5);
    });
    return /* @__PURE__ */ render("div", { class: "ffe-cl-container" }, /* @__PURE__ */ render("div", { class: "ffe-cl" }, /* @__PURE__ */ render("ol", { ref }, story.chapters.map((chapter2) => /* @__PURE__ */ render("li", { class: "ffe-cl-chapter" }, /* @__PURE__ */ render(CheckBox, { bind: chapter2.read }), /* @__PURE__ */ render("span", { class: "ffe-cl-chapter-title" }, /* @__PURE__ */ render("a", { href: `/s/${story.id}/${chapter2.id}` }, chapter2.title)), /* @__PURE__ */ render("span", { class: "ffe-cl-words" }, /* @__PURE__ */ render("b", null, chapter2.words), " words"))))));
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
    const element = /* @__PURE__ */ render("a", { href: "https://www.fictionratings.com/", class: "ffe-rating", rel: "noreferrer", target: "rating" }, rating);
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
  var import_jszip = __toESM(require_jszip_min());
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
    <meta property="dcterms:modified">${(/* @__PURE__ */ new Date()).toISOString().substr(0, 19)}Z</meta>
  </metadata>

  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml" />
    <item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" properties="nav" />
    ${this.hasCover() ? `<item id="cover" href="cover.jpg" media-type="image/jpeg" />
    <item id="cover-page" href="cover.xhtml" media-type="application/xhtml+xml" properties="svg" />` : ""}
    ${this.story.chapters.map(
        (chapter2) => `<item id="chapter-${chapter2.id}" href="chapter-${chapter2.id}.xhtml" media-type="application/xhtml+xml" />`
      ).join("\n    ")}
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
    ${this.story.chapters.map(
        (chapter2) => `<navPoint id="navPoint-${chapter2.id}" playOrder="${chapter2.id}">
      <navLabel>
        <text>${escapeXml(chapter2.title)}</text>
      </navLabel>
      <content src="chapter-${chapter2.id}.xhtml" />
    </navPoint>`
      ).join("\n      ")}
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
      await Promise.all(
        this.story.chapters.map(async (chapter2) => {
          zip.file(`chapter-${chapter2.id}.xhtml`, await this.getChapterHtml(chapter2));
        })
      );
      return zip.generateAsync({ type: "blob" });
    }
  };

  // svg:src/assets/bell.svg
  var bell_default = (() => {
    const parser = new DOMParser();
    return () => {
      const doc = parser.parseFromString(`<?xml version="1.0" encoding="utf-8" ?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
</svg>
`, "image/svg+xml");
      return doc.documentElement;
    };
  })();

  // gm-css:src/enhance/components/StoryCard/StoryCard.css
  GM_addStyle(`.ffe-sc {
  background-color: var(--ffe-paper-color);
}

.ffe-sc-header {
  border-bottom: 1px solid var(--ffe-divider-color);
  padding-bottom: 8px;
  margin-bottom: 8px;
}

.ffe-sc-title {
  color: var(--ffe-on-paper-color) !important;
  font-size: 1.8em;
}

.ffe-sc-title:hover {
  border-bottom: 0;
  text-decoration: underline;
}

.ffe-sc-by {
  color: var(--ffe-on-paper-color);
  padding: 0 0.5em;
}

.ffe-sc-author {
  color: var(--ffe-link-color) !important;
}

.ffe-sc-mark {
  float: right;
}

.ffe-sc-mark > * {
  margin-right: 4px;
}

.ffe-sc-follow:hover,
.ffe-sc-follow.ffe-active {
  color: var(--ffe-alert-color);
}

.ffe-sc-favorite:hover,
.ffe-sc-favorite.ffe-active {
  color: var(--ffe-favorite-color);
}

.ffe-sc-tags {
  border-bottom: 1px solid var(--ffe-divider-color);
  display: flex;
  flex-wrap: wrap;
  line-height: 2em;
  margin-bottom: 8px;
}

.ffe-sc-tag {
  border: 1px solid var(--ffe-weak-divider-color);
  border-radius: 4px;
  color: var(--ffe-on-paper-color);
  line-height: 16px;
  margin-bottom: 8px;
  margin-right: 5px;
  padding: 3px 8px;
}

.ffe-sc-tag a {
  color: var(--ffe-link-color);
}

.ffe-sc-tag-language {
  background-color: var(--ffe-language-tag-color);
  color: var(--ffe-on-language-tag-color);
}

.ffe-sc-tag-universe {
  background-color: var(--ffe-universe-tag-color);
  color: var(--ffe-on-universe-tag-color);
}

.ffe-sc-tag-genre {
  background-color: var(--ffe-genre-tag-color);
  color: var(--ffe-on-genre-tag-color);
}

.ffe-sc-tag.ffe-sc-tag-character,
.ffe-sc-tag.ffe-sc-tag-ship {
  background-color: var(--ffe-character-tag-color);
  color: var(--ffe-on-character-tag-color);
}

.ffe-sc-tag-ship .ffe-sc-tag-character:not(:first-child):before {
  content: " + ";
}

.ffe-sc-image {
  float: left;
  border: 1px solid var(--ffe-divider-color);
  border-radius: 3px;
  padding: 3px;
  margin-right: 8px;
  margin-bottom: 8px;
}

.ffe-sc-description {
  color: var(--ffe-on-paper-color);
  font-family: "Open Sans", sans-serif;
  font-size: 1.1em;
  line-height: 1.4em;
}

.ffe-sc-footer {
  clear: left;
  background: var(--ffe-panel-color);
  border-bottom: 1px solid var(--ffe-divider-color);
  border-top: 1px solid var(--ffe-divider-color);
  color: var(--ffe-on-panel-color);
  font-size: 0.9em;
  margin-left: -0.5em;
  margin-right: -0.5em;
  margin-top: 1em;
  padding: 10px 0.5em;
}

.ffe-sc-footer-info {
  background: var(--ffe-paper-color);
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  color: var(--ffe-on-paper-color);
  line-height: 16px;
  margin-top: -5px;
  margin-right: 5px;
  padding: 3px 8px;
}

.ffe-sc-footer-incomplete {
  background: var(--ffe-incomplete-tag-color);
  color: var(--ffe-on-incomplete-tag-color);
}

.ffe-sc-footer-complete {
  background: var(--ffe-complete-tag-color);
  color: var(--ffe-on-complete-tag-color);
}

.ffe-sc-footer-words {
  color: var(--ffe-on-panel-color);
  float: right;
}
`);

  // src/enhance/components/StoryCard/StoryCard.tsx
  function StoryCard({ requestManager, story }) {
    const buttonRef = useValueRef();
    const linkRef = useValueRef();
    let isDownloading = false;
    const handleDownloadClick = async () => {
      var _a, _b;
      if (isDownloading || !linkRef.current || !("chapters" in story)) {
        return;
      }
      try {
        isDownloading = true;
        (_a = buttonRef.current) == null ? void 0 : _a.classList.add("disabled");
        const epub = new Epub(requestManager, story);
        const blob = await epub.create();
        linkRef.current.href = URL.createObjectURL(blob);
        linkRef.current.download = epub.getFilename();
        linkRef.current.click();
      } finally {
        isDownloading = false;
        (_b = buttonRef.current) == null ? void 0 : _b.classList.remove("disabled");
      }
    };
    return /* @__PURE__ */ render("div", { class: "ffe-sc" }, /* @__PURE__ */ render("div", { class: "ffe-sc-header" }, /* @__PURE__ */ render(Rating, { rating: story.rating }), /* @__PURE__ */ render("a", { href: `/s/${story.id}`, class: "ffe-sc-title" }, story.title), /* @__PURE__ */ render("span", { class: "ffe-sc-by" }, "by"), /* @__PURE__ */ render("a", { href: `/u/${story.author.id}`, class: "ffe-sc-author" }, story.author.name), /* @__PURE__ */ render("div", { class: "ffe-sc-mark" }, /* @__PURE__ */ render(Button, { onClick: handleDownloadClick, title: "Download as ePub", ref: buttonRef }, /* @__PURE__ */ render("span", { class: "icon-arrow-down" })), /* @__PURE__ */ render("a", { style: "display: none", ref: linkRef }), /* @__PURE__ */ render("div", { class: "btn-group" }, /* @__PURE__ */ render(Button, { class: "ffe-sc-follow", bind: story.alert, title: "Toggle Story Alert" }, /* @__PURE__ */ render(bell_default, null)), /* @__PURE__ */ render(Button, { class: "ffe-sc-favorite icon-heart", bind: story.favorite, title: "Toggle Favorite" })))), /* @__PURE__ */ render("div", { class: "ffe-sc-tags" }, story.language && /* @__PURE__ */ render("span", { class: "ffe-sc-tag ffe-sc-tag-language" }, story.language), story.universes && story.universes.map((universe) => /* @__PURE__ */ render("span", { class: "ffe-sc-tag ffe-sc-tag-universe" }, universe)), story.genre && story.genre.map((genre) => /* @__PURE__ */ render("span", { class: "ffe-sc-tag ffe-sc-tag-genre" }, genre)), story.characters && story.characters.length > 0 && story.characters.map(
      (pairing) => pairing.length === 1 ? /* @__PURE__ */ render("span", { class: "ffe-sc-tag ffe-sc-tag-character" }, pairing) : /* @__PURE__ */ render("span", { class: "ffe-sc-tag ffe-sc-tag-ship" }, pairing.map((character) => /* @__PURE__ */ render("span", { class: "ffe-sc-tag-character" }, character)))
    ), story.chapters && story.chapters.length > 0 && /* @__PURE__ */ render("span", { class: "ffe-sc-tag ffe-sc-tag-chapters" }, "Chapters:\xA0", story.chapters.length), story.reviews && /* @__PURE__ */ render("span", { class: "ffe-sc-tag ffe-sc-tag-reviews" }, /* @__PURE__ */ render("a", { href: `/r/${story.id}/` }, "Reviews:\xA0", story.reviews)), story.favorites && /* @__PURE__ */ render("span", { class: "ffe-sc-tag ffe-sc-tag-favorites" }, "Favorites:\xA0", story.favorites), story.follows && /* @__PURE__ */ render("span", { class: "ffe-sc-tag ffe-sc-tag-follows" }, "Follows:\xA0", story.follows)), story.imageUrl && /* @__PURE__ */ render("div", { class: "ffe-sc-image" }, /* @__PURE__ */ render("img", { src: story.imageUrl, alt: "Story Cover" })), /* @__PURE__ */ render("div", { class: "ffe-sc-description" }, story.description), /* @__PURE__ */ render("div", { class: "ffe-sc-footer" }, story.words && /* @__PURE__ */ render("div", { class: "ffe-sc-footer-words" }, /* @__PURE__ */ render("b", null, story.words.toLocaleString("en")), " words"), story.status === "Complete" ? /* @__PURE__ */ render("span", { class: "ffe-sc-footer-info ffe-sc-footer-complete" }, "Complete") : /* @__PURE__ */ render("span", { class: "ffe-sc-footer-info ffe-sc-footer-incomplete" }, "Incomplete"), story.published && /* @__PURE__ */ render("span", { class: "ffe-sc-footer-info" }, /* @__PURE__ */ render("b", null, "Published:\xA0"), /* @__PURE__ */ render("time", { datetime: story.published.toISOString() }, story.published.toLocaleDateString("en"))), story.updated && /* @__PURE__ */ render("span", { class: "ffe-sc-footer-info" }, /* @__PURE__ */ render("b", null, "Updated:\xA0"), /* @__PURE__ */ render("time", { datetime: story.updated.toISOString() }, story.updated.toLocaleDateString("en")))));
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
      Array.from(contentWrapper.children).filter(
        (e) => !e.textContent && e.style.height === "5px" || e.firstElementChild && e.firstElementChild.nodeName === "SELECT" || e.className === "lc-wrapper" && e.id !== "pre_story_links"
      ).forEach((e) => contentWrapper.removeChild(e));
      const storyText = document.getElementById("storytextp");
      if (storyText) {
        contentWrapper.removeChild(storyText);
      }
      const chapterList = ChapterList({ story });
      contentWrapper.insertBefore(chapterList, document.getElementById("review_success"));
    }
  };

  // src/enhance/FollowsList.ts
  var import_ffn_parser2 = __toESM(require_lib());

  // gm-css:src/enhance/FollowsList.css
  GM_addStyle(`.ffe-follows-list {
  list-style: none;
  margin: 0;
}

.ffe-follows-item {
  margin-bottom: 8px;
}

.ffe-follows-item .ffe-sc {
  border-left: 1px solid var(--ffe-divider-color);
  border-top: 1px solid var(--ffe-divider-color);
  border-top-left-radius: 4px;
  padding-left: 0.5em;
  padding-top: 5px;
}

.ffe-follows-item .ffe-cl-container {
  border-left: 1px solid var(--ffe-divider-color);
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
      var _a, _b, _c;
      const list = await (0, import_ffn_parser2.parseFollows)(document);
      if (!list) {
        return;
      }
      const container2 = document.createElement("ul");
      container2.classList.add("ffe-follows-list");
      const table = (_a = document.getElementById("gui_table1i")) == null ? void 0 : _a.parentElement;
      if (!table) {
        return;
      }
      (_b = table.parentElement) == null ? void 0 : _b.insertBefore(container2, table);
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
      (_c = table.parentElement) == null ? void 0 : _c.removeChild(table);
    }
  };

  // svg:src/assets/dropbox.svg
  var dropbox_default = (() => {
    const parser = new DOMParser();
    return () => {
      const doc = parser.parseFromString(`<?xml version="1.0" encoding="UTF-8" ?>
<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42.4 39.5" width="16" height="16">
    <style>.st0{fill:#fff}</style>
    <path class="st0"
          d="M10.6 1.7L0 8.5l10.6 6.7 10.6-6.7zm21.2 0L21.2 8.5l10.6 6.7 10.6-6.7zM0 22l10.6 6.8L21.2 22l-10.6-6.8zm31.8-6.8L21.2 22l10.6 6.8L42.4 22zM10.6 31l10.6 6.8L31.8 31l-10.6-6.7z"/>
</svg>
`, "image/svg+xml");
      return doc.documentElement;
    };
  })();

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
  margin-top: -0.5em;
  text-align: center;
  width: 2em;
}

.ffe-mb-icon:hover {
  border-bottom: 0;
  color: orange !important;
}

.ffe-mb-bell svg {
  fill: currentColor;
  height: 19px;
  transform: translateY(4px);
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
      var _a;
      if (!environment.currentUserName) {
        return;
      }
      const loginElement = document.querySelector("#name_login a");
      const parent = loginElement == null ? void 0 : loginElement.parentElement;
      const ref = loginElement == null ? void 0 : loginElement.nextElementSibling;
      if (!parent || !ref) {
        return;
      }
      document.documentElement.dataset.theme = XCOOKIE.read_theme;
      (_a = document.querySelector(".lc > span:last-of-type")) == null ? void 0 : _a.addEventListener("click", () => {
        document.documentElement.dataset.theme = XCOOKIE.read_theme;
      });
      const toggleTheme = document.createElement("a");
      toggleTheme.classList.add("ffe-mb-icon", "ffe-mb-theme", "icon-tl-contrast");
      toggleTheme.title = "Toggle Light/Dark Theme";
      toggleTheme.href = "#";
      toggleTheme.addEventListener("click", (event) => {
        event.preventDefault();
        if (XCOOKIE.read_theme === "light") {
          _fontastic_change_theme("dark");
        } else {
          _fontastic_change_theme("light");
        }
        document.documentElement.dataset.theme = XCOOKIE.read_theme;
      });
      const toAlerts = document.createElement("a");
      toAlerts.classList.add("ffe-mb-icon", "ffe-mb-alerts", "ffe-mb-bell");
      toAlerts.title = "Go to Story Alerts";
      toAlerts.href = "/alert/story.php";
      toAlerts.appendChild(bell_default());
      const toFavorites = document.createElement("a");
      toFavorites.classList.add("ffe-mb-icon", "ffe-mb-favorites", "icon-heart");
      toFavorites.title = "Go to Story Favorites";
      toFavorites.href = "/favorites/story.php";
      const toDropBox = document.createElement("a");
      toDropBox.classList.add("ffe-mb-icon", "ffe-mb-dropbox");
      toDropBox.title = "Connect to DropBox";
      toDropBox.href = "#";
      toDropBox.appendChild(dropbox_default());
      if (await this.dropBox.isAuthorized()) {
        toDropBox.classList.add("ffe-mb-checked");
      }
      toDropBox.addEventListener("click", async (event) => {
        event.preventDefault();
        await this.dropBox.authorize();
        toDropBox.classList.add("ffe-mb-checked");
      });
      const separator1 = document.createElement("span");
      separator1.classList.add("ffe-mb-separator");
      const separator2 = document.createElement("span");
      separator2.classList.add("ffe-mb-separator");
      parent.insertBefore(toggleTheme, ref);
      parent.insertBefore(separator2, ref);
      parent.insertBefore(toAlerts, ref);
      parent.insertBefore(toFavorites, ref);
      parent.insertBefore(toDropBox, ref);
      parent.insertBefore(separator1, ref);
    }
  };

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

  // src/enhance/StoryList.ts
  var import_ffn_parser3 = __toESM(require_lib());

  // gm-css:src/enhance/StoryList.css
  GM_addStyle(`.ffe-story-list {
  list-style: none;
  margin: 0 auto;
}

.ffe-story-item {
  margin: 10px 0;
}

.ffe-story-item .ffe-sc {
  border: 1px solid var(--ffe-divider-color);
  padding: 5px 0.5em;
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
      var _a, _b;
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
      (_a = cw.parentElement) == null ? void 0 : _a.insertBefore(container2, null);
      const deferChapterList = [];
      for (const followedStory of list) {
        const item = document.createElement("li");
        item.classList.add("ffe-story-item");
        container2.appendChild(item);
        const story = new Story(
          {
            ...followedStory,
            chapters: []
          },
          this.valueContainer
        );
        const card = StoryCard({ requestManager: this.requestManager, story });
        item.appendChild(card);
        deferChapterList.push([story, item]);
      }
      cw.querySelectorAll(".z-list").forEach((e) => {
        var _a2;
        return (_a2 = e.parentElement) == null ? void 0 : _a2.removeChild(e);
      });
      const pageNav = cw.querySelector("center:last-of-type");
      if (pageNav) {
        const footer = document.createElement("div");
        footer.id = "content_wrapper_inner";
        footer.classList.add("maxwidth");
        footer.style.backgroundColor = "white";
        footer.style.height = "35px";
        footer.style.lineHeight = "35px";
        footer.appendChild(pageNav);
        (_b = cw.parentElement) == null ? void 0 : _b.insertBefore(footer, null);
      }
    }
  };

  // gm-css:src/enhance/StoryProfile.css
  GM_addStyle(``);

  // src/enhance/StoryProfile.ts
  var StoryProfile = class {
    constructor(requestManager, valueContainer) {
      this.requestManager = requestManager;
      this.valueContainer = valueContainer;
    }
    async enhance() {
      var _a;
      const profile = document.getElementById("profile_top");
      if (!profile || !environment.currentStoryId) {
        return;
      }
      const story = await this.valueContainer.getStory(environment.currentStoryId);
      if (!story) {
        return;
      }
      const card = StoryCard({ requestManager: this.requestManager, story });
      (_a = profile.parentElement) == null ? void 0 : _a.insertBefore(card, profile);
      profile.style.display = "none";
    }
  };

  // gm-css:src/enhance/StoryText.css
  GM_addStyle(`.storytext p {
  color: var(--ffe-on-paper-color);
  text-align: justify;
}
`);

  // src/enhance/StoryText.ts
  var StoryText = class {
    constructor() {
      /**
       * Not all selectable fonts exist on Google Fonts. Filter out
       * fonts that do not exist, or Google will throw an error.
       */
      this.GOOGLE_FONTS_WHITELIST = ["Open Sans", "PT Sans", "Roboto", "Ubuntu"];
    }
    async enhance() {
      this.fixFontLink();
      const textContainer = document.getElementById("storytextp");
      if (!textContainer) {
        throw new Error("Could not find text container element.");
      }
      this.fixUserSelect(textContainer);
    }
    fixFontLink() {
      const replace = (link) => {
        var _a;
        if (!link) {
          const links = Array.from(document.head.querySelectorAll("link"));
          link = links.find((l) => l.href.includes("fonts.googleapis.com"));
        }
        if (!link) {
          return false;
        }
        const href = new URL(link.href);
        const search = new URLSearchParams(href.search);
        const families = (_a = search.get("family")) == null ? void 0 : _a.split("|").filter((f) => this.GOOGLE_FONTS_WHITELIST.includes(f));
        if (families) {
          search.set("family", families.join("|"));
        }
        href.search = search.toString();
        link.href = href.toString();
        return true;
      };
      if (replace()) {
        return;
      }
      const observer = new MutationObserver((list) => {
        for (const record of list) {
          if (record.type !== "childList") {
            continue;
          }
          for (const node of Array.from(record.addedNodes)) {
            if (!(node instanceof Element) || node.tagName !== "LINK") {
              continue;
            }
            replace();
            observer.disconnect();
          }
        }
      });
      observer.observe(document.head, { childList: true });
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
        const popup = xwindow(
          `https://www.dropbox.com/oauth2/authorize?response_type=token&client_id=${encodeURIComponent(
            CLIENT_ID
          )}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
          775,
          550
        );
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
      await Promise.all(
        Object.keys(remoteData).map(async (key) => {
          if (CacheName.isTimestampKey(key)) {
            return;
          }
          const localTimestamp = +(await GM.getValue(`${key}+timestamp`) ?? 0);
          const remoteTimestamp = +remoteData[`${key}+timestamp`];
          if (localTimestamp < remoteTimestamp) {
            await Promise.all(
              Object.getOwnPropertySymbols(this.valueUpdateCallbacks).map((sym) => this.valueUpdateCallbacks[sym](key, remoteData[key])).filter((promise) => promise != null && typeof promise === "object" && "then" in promise)
            );
          }
        })
      );
      let hasUpdate = false;
      await Promise.all(
        (await GM.listValues()).map(async (key) => {
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
        })
      );
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
      return this.content(
        "/files/upload",
        {
          path,
          mode: "overwrite",
          mute: true
        },
        content
      );
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
    var _a;
    const target = document.body.firstElementChild;
    if (target) {
      target.innerHTML = "<h2>Received oAuth2 token</h2>This page should close momentarily.";
    }
    const token = (_a = /[?&#]access_token=([^&#]*)/i.exec(window.location.hash)) == null ? void 0 : _a[1];
    window.opener[OAUTH2_CALLBACK](token);
    window.close();
  }

  // src/container.ts
  var Container = class {
    getRequestManager() {
      if (!this.requestManager) {
        this.requestManager = new DownloadManager();
      }
      return this.requestManager;
    }
    getApi() {
      if (!this.api) {
        this.api = new Api(this.getRequestManager());
      }
      return this.api;
    }
    getValueContainer() {
      if (!this.valueManager) {
        this.valueManager = new ValueContainer(this.getStorage(), this.getApi(), this.getDropBox());
      }
      return this.valueManager;
    }
    getMenuBar() {
      if (!this.menuBar) {
        this.menuBar = new MenuBar(this.getDropBox());
      }
      return this.menuBar;
    }
    getFollowsList() {
      if (!this.followsList) {
        this.followsList = new FollowsList(this.getRequestManager(), this.getValueContainer());
      }
      return this.followsList;
    }
    getStoryListEnhancer() {
      if (!this.storyList) {
        this.storyList = new StoryList(this.getRequestManager(), this.getValueContainer());
      }
      return this.storyList;
    }
    getStoryProfile() {
      if (!this.storyProfile) {
        this.storyProfile = new StoryProfile(this.getRequestManager(), this.getValueContainer());
      }
      return this.storyProfile;
    }
    getChapterList() {
      if (!this.chapterList) {
        this.chapterList = new ChapterList2(this.getValueContainer());
      }
      return this.chapterList;
    }
    getSaveListSettings() {
      if (!this.saveListSettings) {
        this.saveListSettings = new SaveListSettings();
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

  // gm-css:src/theme.css
  GM_addStyle(`:root {
  --ffe-primary-color: #333399;
  --ffe-on-primary-color: #fff;
  --ffe-alert-color: #60cf23;
  --ffe-favorite-color: #ffb400;
  --ffe-language-tag-color: #a151bd;
  --ffe-on-language-tag-color: #fff;
  --ffe-universe-tag-color: #44b7b7;
  --ffe-on-universe-tag-color: #fff;
  --ffe-genre-tag-color: #4f91d6;
  --ffe-on-genre-tag-color: #fff;
  --ffe-character-tag-color: #23b974;
  --ffe-on-character-tag-color: #fff;
  --ffe-incomplete-tag-color: #f7a616;
  --ffe-on-incomplete-tag-color: #fff;
  --ffe-complete-tag-color: #63bd40;
  --ffe-on-complete-tag-color: #fff;

  --ffe-background-color: #e4e3d5;
  --ffe-panel-color: #f6f7ee;
  --ffe-paper-color: #fff;

  --ffe-divider-color: #cdcdcd;
  --ffe-weak-divider-color: rgba(0, 0, 0, 0.15);

  --ffe-on-panel-color: #555;
  --ffe-on-paper-color: #333;
  --ffe-link-color: #0f37a0;
}

html[data-theme="dark"] {
  --ffe-background-color: #666666;
  --ffe-panel-color: #515151;
  --ffe-paper-color: #333333;

  --ffe-divider-color: #000;
  --ffe-weak-divider-color: rgba(255, 255, 255, 0.15);

  --ffe-on-panel-color: #fff;
  --ffe-on-paper-color: #ddd;
  --ffe-link-color: #7397f2;
}
`);

  // gm-css:src/main.css
  GM_addStyle(`a, a:link, a:active, a:visited {
  color: var(--ffe-link-color);
}

.zui a {
  color: var(--ffe-on-panel-color);
}

html ul.topnav li a {
  color: var(--ffe-on-paper-color);
}

html ul.topnav li.active a {
  color: #000;
}

body, .zmenu, .tcat {
  background-color: var(--ffe-panel-color) !important;
  border-color: var(--ffe-divider-color);
  color: var(--ffe-on-panel-color);
}

#content_parent {
  background-color: var(--ffe-background-color) !important;
}

#content_wrapper, .lc {
  background-color: var(--ffe-paper-color) !important;
  color: var(--ffe-on-paper-color);
}

#content_wrapper_inner {
  border-color: var(--ffe-divider-color);
}
`);

  // src/main.ts
  var container = new Container();
  async function main() {
    var _a, _b, _c;
    if (environment.currentPageType === 6 /* OAuth2 */) {
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
    if (environment.currentPageType === 2 /* Alerts */ || environment.currentPageType === 3 /* Favorites */) {
      const getterName = environment.currentPageType === 2 /* Alerts */ ? "getAlertValue" : "getFavoriteValue";
      const list = await (0, import_ffn_parser4.parseFollows)(document);
      if (list) {
        await Promise.all(
          list.map(async (item) => {
            const value = valueContainer[getterName](item.id);
            await value.update(true);
          })
        );
      }
      const followsListEnhancer = container.getFollowsList();
      await followsListEnhancer.enhance();
    }
    if (environment.currentPageType === 7 /* StoryList */) {
      const storyListEnhancer = container.getStoryListEnhancer();
      await storyListEnhancer.enhance();
      const saveListSettingsEnhancer = container.getSaveListSettings();
      await saveListSettingsEnhancer.enhance();
    }
    if (environment.currentPageType === 8 /* UniverseList */ || environment.currentPageType === 9 /* CommunityList */) {
      const saveListSettingsEnhancer = container.getSaveListSettings();
      await saveListSettingsEnhancer.enhance();
    }
    if (environment.currentPageType === 4 /* Story */) {
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
    if (environment.currentPageType === 5 /* Chapter */) {
      const currentStory = await (0, import_ffn_parser4.parseStory)(document);
      if (currentStory) {
        const storyValue = valueContainer.getStoryValue(currentStory.id);
        await storyValue.update(currentStory);
        if (environment.currentChapterId) {
          const wordCountValue = valueContainer.getWordCountValue(currentStory.id, environment.currentChapterId);
          await wordCountValue.update(
            ((_c = (_b = (_a = document.getElementById("storytext")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim()) == null ? void 0 : _c.split(/\s+/).length) ?? 0
          );
        }
        const storyProfileEnhancer = container.getStoryProfile();
        await storyProfileEnhancer.enhance();
        const storyTextEnhancer = new StoryText();
        await storyTextEnhancer.enhance();
        if (environment.currentChapterId) {
          const readValue = valueContainer.getChapterReadValue(currentStory.id, environment.currentChapterId);
          const markRead = async () => {
            var _a2;
            const amount = document.documentElement.scrollTop;
            const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (amount / (max - 550) >= 1) {
              window.removeEventListener("scroll", markRead);
              console.log(
                "Setting '%s' chapter '%s' to read",
                currentStory.title,
                (_a2 = currentStory.chapters.find((c) => c.id === environment.currentChapterId)) == null ? void 0 : _a2.title
              );
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
/*! Bundled license information:

jszip/dist/jszip.min.js:
  (*!
  
  JSZip v3.10.1 - A JavaScript class for generating and reading zip files
  <http://stuartk.com/jszip>
  
  (c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
  Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.
  
  JSZip uses the library pako released under the MIT license :
  https://github.com/nodeca/pako/blob/main/LICENSE
  *)
*/
