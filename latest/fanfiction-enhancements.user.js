// ==UserScript==
// @name         FanFiction Enhancements
// @namespace    https://tiger.rocks/
// @version      0.8.0+23.d38754b
// @description  FanFiction.net Enhancements
// @author       Arne 'TigeR' Linck
// @copyright    2018-2024, Arne 'TigeR' Linck
// @license      MIT, https://github.com/amur-tiger/fanfiction-enhancements/blob/master/LICENSE
// @homepageURL  https://github.com/amur-tiger/fanfiction-enhancements
// @supportURL   https://github.com/amur-tiger/fanfiction-enhancements/issues
// @updateURL    https://amur-tiger.github.io/fanfiction-enhancements/latest/fanfiction-enhancements.meta.js
// @downloadURL  https://amur-tiger.github.io/fanfiction-enhancements/latest/fanfiction-enhancements.user.js
// @require      https://unpkg.com/jszip@3.9.1/dist/jszip.min.js
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
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __commonJS = (cb, mod) => function __require() {
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
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
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
      function parseStory4(document2, options) {
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
          resultMeta.chapters = chapterElement ? parseChapters(chapterElement, resultMeta.id) : [
            {
              storyId: resultMeta.id,
              id: 1,
              title: titleElement.textContent && titleElement.textContent.trim() || "Chapter 1"
            }
          ];
          return resultMeta;
        });
      }
      exports.default = parseStory4;
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
        while (result.universes.length > 2) {
          const shortestIdx = result.universes.reduce((suIdx, universe, idx, arr) => arr[suIdx].length < universe.length ? suIdx : idx, 0);
          if (shortestIdx === 0) {
            const [removed] = result.universes.splice(1, 1);
            result.universes[0] += ` & ${removed}`;
          } else if (shortestIdx === result.universes.length - 1) {
            const removed = result.universes.pop();
            result.universes[result.universes.length - 1] += ` & ${removed}`;
          } else {
            if (result.universes[shortestIdx + 1].length < result.universes[shortestIdx - 1].length) {
              const [removed] = result.universes.splice(shortestIdx + 1, 1);
              result.universes[shortestIdx] += ` & ${removed}`;
            } else {
              const [removed] = result.universes.splice(shortestIdx, 1);
              result.universes[shortestIdx - 1] += ` & ${removed}`;
            }
          }
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
      function parseChapters(selectElement, storyId) {
        var _a;
        const result = [];
        for (let i = 0; i < selectElement.children.length; i++) {
          const option = selectElement.children[i];
          if (option.tagName !== "OPTION") {
            continue;
          }
          let title2 = option.textContent;
          if (title2 && /^\d+\. .+/.test(title2)) {
            title2 = title2.substring(title2.indexOf(".") + 2);
          }
          if (!title2) {
            title2 = `Chapter ${i + 1}`;
          }
          result.push({
            storyId,
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
      function parseStoryList3(document2, options) {
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
            const meta = (0, story_1.parseTags)(tagsElement, opts.genres, opts.createTemplate);
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
      exports.default = parseStoryList3;
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

  // src/main.ts
  var import_ffn_parser5 = __toESM(require_lib(), 1);

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

  // node_modules/clsx/dist/clsx.mjs
  function r(e) {
    var t, f, n = "";
    if ("string" == typeof e || "number" == typeof e)
      n += e;
    else if ("object" == typeof e)
      if (Array.isArray(e)) {
        var o = e.length;
        for (t = 0; t < o; t++)
          e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
      } else
        for (f in e)
          e[f] && (n && (n += " "), n += f);
    return n;
  }
  function clsx() {
    for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++)
      (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
    return n;
  }
  var clsx_default = clsx;

  // src/signal/scope.ts
  var _Scope = class _Scope extends EventTarget {
    constructor(callback, options) {
      super();
      __publicField(this, "callback");
      __publicField(this, "parent");
      __publicField(this, "onChange");
      this.callback = callback;
      this.parent = options?.parent ?? _Scope.getCurrent();
      this.onChange = options?.onChange;
      if (this.parent) {
        this.parent.addEventListener(
          _Scope.EVENT_DISPOSE,
          () => {
            this.parent = void 0;
            this.dispatchEvent(new Event(_Scope.EVENT_DISPOSE));
          },
          { once: true }
        );
      }
    }
    static runExecutionQueue() {
      const scopes = _Scope.executionQueue.filter((s1) => !_Scope.executionQueue.some((s2) => s1.hasParent(s2)));
      _Scope.executionQueue.splice(0);
      _Scope.isQueued = false;
      scopes.forEach((scope) => {
        scope.dispatchEvent(new Event(_Scope.EVENT_DISPOSE));
        const next = scope.execute();
        scope.onChange?.(next);
      });
    }
    static getCurrent() {
      return _Scope.stack[_Scope.stack.length - 1];
    }
    /**
     * Checks if the given scope is a parent of the current scope, recursively.
     * @param scope
     */
    hasParent(scope) {
      if (this.parent == null) {
        return false;
      }
      if (this.parent === scope) {
        return true;
      }
      return this.parent.hasParent(scope);
    }
    /**
     * Registers an object in this scope. Whenever the object raises a change event,
     * this scope updates. Only the first change event is captured and objects have to
     * re-register for every execution.
     * @param object
     */
    register(object) {
      object.addEventListener(
        "change",
        () => {
          if (!_Scope.executionQueue.includes(this)) {
            _Scope.executionQueue.push(this);
            if (!_Scope.isQueued) {
              _Scope.isQueued = true;
              queueMicrotask(() => {
                _Scope.runExecutionQueue();
              });
            }
          }
        },
        { once: true }
      );
    }
    /**
     * Re-runs the callback within this scope.
     */
    execute() {
      try {
        _Scope.stack.push(this);
        return this.callback();
      } finally {
        _Scope.stack.pop();
      }
    }
  };
  __publicField(_Scope, "EVENT_DISPOSE", "dispose");
  __publicField(_Scope, "stack", []);
  __publicField(_Scope, "executionQueue", []);
  __publicField(_Scope, "isQueued", false);
  var Scope = _Scope;
  function scoped(callback, onChange) {
    const current = new Scope(callback, { onChange });
    return current.execute();
  }
  function onDispose(dispose) {
    const scope = Scope.getCurrent();
    if (!scope) {
      return;
    }
    scope.addEventListener(Scope.EVENT_DISPOSE, dispose, { once: true });
  }

  // src/jsx/render.ts
  function render(render2) {
    let element = scoped(render2, (next) => {
      element.replaceWith(next);
      element = next;
    });
    return element;
  }

  // src/signal/signal.ts
  var ChangeEvent = class extends Event {
    constructor(oldValue, newValue, isInternal = false) {
      super("change");
      this.oldValue = oldValue;
      this.newValue = newValue;
      this.isInternal = isInternal;
    }
  };
  function createSignal(value, options) {
    const equals = options?.equals ?? ((previous, next) => previous === next);
    let currentValue;
    if (isPromise(value)) {
      value.then((next) => {
        currentValue = next;
        signal.dispatchEvent(new ChangeEvent(void 0, currentValue, true));
      });
    } else {
      currentValue = value;
    }
    const events = new EventTarget();
    const signal = Object.assign(
      function() {
        Scope.getCurrent()?.register(signal);
        return currentValue;
      },
      {
        set(valueOrCallback, opt) {
          const isInternal = !!opt?.isInternal;
          const oldValue = currentValue;
          if (typeof valueOrCallback === "function") {
            currentValue = valueOrCallback(currentValue);
          } else {
            currentValue = valueOrCallback;
          }
          if (!equals(oldValue, currentValue)) {
            signal.dispatchEvent(new ChangeEvent(oldValue, currentValue, isInternal));
          }
        },
        peek() {
          return currentValue;
        },
        async isInitialized() {
          await (isPromise(value) ? value : Promise.resolve());
        },
        addEventListener(event, callback, options2) {
          events.addEventListener(event, callback, options2);
        },
        removeEventListener(type, callback, options2) {
          events.removeEventListener(type, callback, options2);
        },
        dispatchEvent(event) {
          Object.defineProperty(event, "target", { value: signal });
          return events.dispatchEvent(event);
        }
      }
    );
    return signal;
  }
  function isPromise(value) {
    return value != null && typeof value === "object" && "then" in value && typeof value.then === "function";
  }

  // src/signal/effect.ts
  function effect(callback) {
    scoped(() => {
      const cleanup = callback();
      if (typeof cleanup === "function") {
        onDispose(cleanup);
      }
    });
  }
  function listen(object, event, handler) {
    scoped(() => {
      object.addEventListener(event, handler);
      onDispose(() => object.removeEventListener(event, handler));
    });
  }

  // src/sync/auth.ts
  var BEARER_TOKEN_KEY = "ffe-drive-token";
  var REDIRECT_URI = "https://www.fanfiction.net/ffe-oauth2-return";
  var CLIENT_ID = "19948706217-jsn5u8hqi959m0q2b3s65qh2f3h6pcu4.apps.googleusercontent.com";
  async function isSyncAuthorized() {
    return !!await GM.getValue(BEARER_TOKEN_KEY);
  }
  function getAuthorizedSignal() {
    const signal = createSignal(false);
    GM.getValue(BEARER_TOKEN_KEY).then((value) => signal.set(!!value, { isInternal: true }));
    effect(() => {
      const token2 = GM_addValueChangeListener(BEARER_TOKEN_KEY, (name, oldValue, newValue) => {
        signal.set(!!newValue, { isInternal: true });
      });
      return () => GM_removeValueChangeListener(token2);
    });
    return signal;
  }
  async function getSyncToken() {
    const token2 = await GM.getValue(BEARER_TOKEN_KEY);
    if (!token2 || typeof token2 !== "string") {
      throw new Error("Not logged in");
    }
    return token2;
  }
  async function removeSyncToken() {
    await GM.deleteValue(BEARER_TOKEN_KEY);
  }
  async function startSyncAuthorization() {
    const token2 = await new Promise((resolve, reject) => {
      unsafeWindow.ffeOAuth2Callback = (callbackToken) => {
        clearInterval(handle);
        if (!callbackToken) {
          reject(new Error("No token received."));
        } else {
          resolve(callbackToken);
        }
      };
      const scopes = "https://www.googleapis.com/auth/drive.appdata";
      const popup = xwindow(
        `https://accounts.google.com/o/oauth2/auth?scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&client_id=${encodeURIComponent(CLIENT_ID)}`,
        670,
        720
      );
      const handle = setInterval(() => {
        if (popup.closed) {
          clearInterval(handle);
          reject(new Error("Authorization aborted by user"));
        }
      }, 1e3);
    });
    console.info("Authenticated successfully.");
    await GM.setValue(BEARER_TOKEN_KEY, token2);
  }
  if (environment.currentPageType === 6 /* OAuth2 */) {
    const target = document.body.firstElementChild;
    if (target) {
      target.innerHTML = "<h2>Received oAuth2 token</h2>This page should close momentarily.";
    }
    const token2 = /[?&#]access_token=([^&#]*)/i.exec(window.location.hash)?.[1];
    window.opener.ffeOAuth2Callback(token2);
    window.close();
  }

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

  // gm-css:src/enhance/MenuBar.css
  GM_addStyle(`.ffe-mb-separator:before {
  content: " | ";
}

.ffe-mb-checked {
  position: relative;
}

.ffe-mb-checked:after {
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
`);

  // src/jsx/jsx-runtime.ts
  function jsx(tag, props) {
    const { children, ...attributes } = props;
    if (typeof tag === "function") {
      return render(() => tag(props));
    }
    if (tag == null) {
      throw new Error("Fragment is not supported");
    }
    let element;
    if ("xmlns" in attributes) {
      element = document.createElementNS(attributes.xmlns, tag);
    } else if (svgTagNames.includes(tag)) {
      element = document.createElementNS("http://www.w3.org/2000/svg", tag);
    } else {
      element = document.createElement(tag);
    }
    applyAttributes(element, attributes);
    const flatten = (child) => Array.isArray(child) ? child.flatMap(flatten) : [child];
    const childNodes = children != null ? flatten(children) : [];
    for (const child of childNodes) {
      if (child != null && typeof child !== "boolean") {
        element.append(child);
      }
    }
    return element;
  }
  var jsxs = jsx;
  function applyAttributes(element, attributes) {
    for (const attribute of Array.from(element.attributes)) {
      if (!(attribute.nodeName in attributes)) {
        element.removeAttribute(attribute.nodeName);
      }
    }
    for (const [key, value] of Object.entries(attributes)) {
      if (/^on/.test(key)) {
        if (value != null) {
          const type = key.substring(2).toLowerCase();
          element.addEventListener(type, value);
          onDispose(() => element.removeEventListener(type, value));
        }
      } else if (typeof value === "boolean") {
        if (value) {
          element.setAttribute(key, key);
        } else {
          element.removeAttribute(key);
        }
      } else if (value != null) {
        element.setAttribute(key, value);
      } else {
        element.removeAttribute(key);
      }
    }
  }
  var svgTagNames = [
    "circle",
    "clipPath",
    "color-profile",
    "cursor",
    "defs",
    "desc",
    "discard",
    "ellipse",
    "filter",
    "g",
    "line",
    "linearGradient",
    "mask",
    "mpath",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialGradient",
    "rect",
    "solidColor",
    "svg",
    "text",
    "textArea",
    "textPath",
    "title"
  ];

  // jsx:src/enhance/MenuBar.tsx
  var MenuBar = class {
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
      document.documentElement.dataset.theme = XCOOKIE.read_theme;
      document.querySelector(".lc > span:last-of-type")?.addEventListener("click", () => {
        document.documentElement.dataset.theme = XCOOKIE.read_theme;
      });
      parent.insertBefore(jsx("a", {
        class: "ffe-mb-theme ffe-mb-icon icon-tl-contrast",
        title: "Toggle Light/Dark Theme",
        href: "#",
        onClick: (event) => {
          event.preventDefault();
          if (XCOOKIE.read_theme === "light") {
            _fontastic_change_theme("dark");
          } else {
            _fontastic_change_theme("light");
          }
          document.documentElement.dataset.theme = XCOOKIE.read_theme;
        }
      }), ref);
      parent.insertBefore(jsx("span", {
        class: "ffe-mb-separator"
      }), ref);
      parent.insertBefore(jsx("a", {
        class: "ffe-mb-alerts ffe-mb-icon ffe-mb-bell",
        title: "Go to Story Alerts",
        href: "/alert/story.php",
        children: jsx(bell_default, {})
      }), ref);
      parent.insertBefore(jsx("a", {
        class: "ffe-mb-favorites ffe-mb-icon icon-heart",
        title: "Go to Story Favorites",
        href: "/favorites/story.php"
      }), ref);
      const isAuthorized = getAuthorizedSignal();
      parent.insertBefore(render(() => jsx("a", {
        class: clsx_default("ffe-mb-icon icon-mpl2-sync", {
          "ffe-mb-checked": isAuthorized()
        }),
        title: isAuthorized() ? "Disconnect from Google Drive" : "Connect to Google Drive",
        href: "#",
        onClick: async (event) => {
          event.preventDefault();
          if (isAuthorized()) {
            if (confirm("Stop sync with Google Drive?")) {
              await removeSyncToken();
            }
          } else {
            await startSyncAuthorization();
          }
        }
      })), ref);
      parent.insertBefore(jsx("span", {
        class: "ffe-mb-separator"
      }), ref);
    }
  };

  // jsx:src/enhance/FollowsList.tsx
  var import_ffn_parser3 = __toESM(require_lib());

  // src/api/story.ts
  var import_ffn_parser2 = __toESM(require_lib(), 1);

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
  function tryParse(text, fallback) {
    if (!text) {
      return fallback;
    }
    try {
      return JSON.parse(text);
    } catch (e) {
      return fallback;
    }
  }
  function toDate(date) {
    if (date instanceof Date) {
      return date;
    }
    return new Date(date);
  }

  // src/api/Api.ts
  var import_ffn_parser = __toESM(require_lib(), 1);

  // src/api/throttled-fetch.ts
  function createTask(callback, data) {
    let resolve, reject;
    const promise = new Promise((rs, rj) => {
      resolve = rs;
      reject = rj;
    });
    return {
      run: callback,
      resolve,
      reject,
      promise,
      data
    };
  }
  var maxParallel = 4;
  var throttleSleep = 200;
  var queue = [];
  var running = 0;
  var waitUntil = 0;
  function throttledFetch(input, init, priority = 0) {
    const request = new Request(input, init);
    const task = createTask(() => fetch(request), {
      request,
      priority
    });
    enqueue(task);
    check();
    return task.promise;
  }
  function check() {
    if (running >= maxParallel || Date.now() < waitUntil) {
      return;
    }
    const task = queue.shift();
    if (!task) {
      return;
    }
    void run(task);
    check();
  }
  async function run(task) {
    try {
      if (throttleSleep > 0) {
        waitUntil = Date.now() + throttleSleep;
        setTimeout(check, throttleSleep);
      }
      running += 1;
      const response = await task.run();
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        const waitSeconds = (retryAfter && !Number.isNaN(+retryAfter) && +retryAfter || 30) + 1;
        console.warn("Rate limited! Waiting %ss.", waitSeconds);
        blockAndRetry(task, waitSeconds);
      } else {
        task.resolve(response);
      }
    } catch (ex) {
      blockAndRetry(task, 60);
    } finally {
      running -= 1;
      check();
    }
  }
  function enqueue(task, retry = false) {
    for (let i = 0; i < queue.length; i++) {
      if (retry ? queue[i].data.priority <= task.data.priority : queue[i].data.priority < task.data.priority) {
        queue.splice(i, 0, task);
        return;
      }
    }
    queue.push(task);
  }
  function blockAndRetry(task, waitSeconds) {
    enqueue(task, true);
    waitUntil = Date.now() + waitSeconds * 1e3;
    setTimeout(check, waitSeconds * 1e3);
  }

  // src/api/Api.ts
  var _Api = class _Api {
    constructor() {
      __publicField(this, "alerts");
      __publicField(this, "favorites");
      __publicField(this, "storyData", /* @__PURE__ */ new Map());
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
      let cached = this.storyData.get(id);
      if (cached) {
        return cached;
      }
      cached = (async () => {
        const body = await this.get(`/s/${id}`, 5 /* StoryData */);
        const template = document.createElement("template");
        template.innerHTML = body;
        return (0, import_ffn_parser.parseStory)(template.content);
      })();
      this.storyData.set(id, cached);
      return cached;
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
    async get(url, priority) {
      const response = await throttledFetch(url, void 0, priority);
      return response.text();
    }
    async getMultiPage(url) {
      const body = await this.get(url, 6 /* MultiPage */);
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
          this.get(`${url}?p=${i}`, 6 /* MultiPage */).then((nextBody) => {
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
      const response = await throttledFetch(
        url,
        {
          method: "POST",
          body: formData,
          referrer: url
        },
        1
      );
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
  __publicField(_Api, "instance", new _Api());
  var Api = _Api;

  // src/api/story.ts
  function getKey(storyId) {
    return `ffe-story-${storyId}`;
  }
  function getStoryCache(storyId) {
    return tryParse(localStorage.getItem(getKey(storyId)));
  }
  function setStoryCache(storyId, story) {
    if (story && storyId !== story.id) {
      throw new TypeError();
    }
    const key = getKey(storyId);
    const newValue = story ? JSON.stringify(story) : void 0;
    if (newValue) {
      localStorage.setItem(key, newValue);
    } else {
      localStorage.removeItem(key);
    }
    dispatchEvent(
      new StorageEvent("storage", {
        key,
        newValue
      })
    );
  }
  function getStoryMetadata(storyId, onChange) {
    const signal = createSignal(getStoryCache(storyId));
    listen(signal, "change", (event) => {
      if (event.isInternal) {
        return;
      }
      setStoryCache(storyId, event.newValue);
      onChange?.(event.newValue);
    });
    listen(window, "storage", (event) => {
      if (event.key !== getKey(storyId)) {
        return;
      }
      const next = tryParse(event.newValue);
      if (next) {
        signal.set(next, { isInternal: true });
      }
    });
    return signal;
  }
  function getStory(storyId) {
    const signal = getStoryMetadata(storyId, (next) => {
      if (next?.chapters == null) {
        Api.instance.getStoryData(storyId).then((story) => {
          if (story) {
            console.log("Set story data for '%s' from download", story.title);
            signal.set({ ...story, timestamp: Date.now() });
          }
        });
      }
    });
    if (signal.peek()?.description == null) {
      Api.instance.getStoryData(storyId).then((story) => {
        if (story) {
          console.log("Set story data for '%s' from download", story.title);
          signal.set({ ...story, timestamp: Date.now() });
        }
      });
    }
    return signal;
  }
  function updateStoryData() {
    if (environment.currentPageType === 2 /* Alerts */ || environment.currentPageType === 3 /* Favorites */) {
      (0, import_ffn_parser2.parseFollows)().then((follows) => {
        if (!follows) {
          return;
        }
        for (const follow of follows) {
          let cached = getStoryCache(follow.id);
          if (cached && (cached.id !== follow.id || cached.title !== follow.title || cached.author.id !== follow.author.id || cached.author.name !== follow.author.name || cached.updated && toDate(cached.updated).getTime() < follow.updated.getTime())) {
            console.debug("Cache for '%s' is outdated, overwriting.", cached.title);
            cached = void 0;
          }
          if (cached == null) {
            console.debug("Set story data for '%s' from follow.", follow.title);
            setStoryCache(follow.id, {
              id: follow.id,
              title: follow.title,
              author: follow.author,
              updated: follow.updated,
              timestamp: Date.now()
            });
          }
        }
      });
    }
    if (environment.currentPageType === 7 /* StoryList */) {
      (0, import_ffn_parser2.parseStoryList)().then((list) => {
        if (!list) {
          return;
        }
        for (const story of list) {
          let cached = getStoryCache(story.id);
          if (cached && (cached.id !== story.id || cached.title !== story.title || cached.author.id !== story.author.id || cached.author.name !== story.author.name || cached.updated && story.updated && toDate(cached.updated).getTime() < toDate(story.updated).getTime())) {
            console.debug("Cache for '%s' is outdated, overwriting.", cached.title);
            cached = void 0;
          }
          if (cached == null) {
            console.debug("Set story data for '%s' from story list.", story.title);
            setStoryCache(story.id, {
              ...story,
              timestamp: Date.now()
            });
          }
        }
      });
    }
  }
  if (environment.currentPageType === 4 /* Story */ || environment.currentPageType === 5 /* Chapter */) {
    (0, import_ffn_parser2.parseStory)().then((story) => {
      if (story) {
        console.debug("Set story data for '%s' from story page.", story.title);
        setStoryCache(story.id, {
          ...story,
          timestamp: Date.now()
        });
      }
    });
  }
  function migrateStoryData() {
    const keys = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i));
    for (const key of keys) {
      if (key && /^ffe-story-\d+$/.test(key)) {
        const cache = tryParse(localStorage.getItem(key));
        if (cache) {
          cache.timestamp = +(localStorage.getItem(key + "+timestamp") ?? 0);
          localStorage.setItem(key, JSON.stringify(cache));
        }
        localStorage.removeItem(key + "+timestamp");
      }
    }
  }
  if (true) {
    migrateStoryData();
    updateStoryData();
  }

  // src/signal/view.ts
  function view(signal, keyOrOptions, maybeEquals) {
    const { get, set } = typeof keyOrOptions === "object" ? keyOrOptions : {
      get: (value) => value[keyOrOptions],
      set: (previous, value) => ({ ...previous, [keyOrOptions]: value })
    };
    const equals = (typeof keyOrOptions === "object" ? keyOrOptions.equals : maybeEquals) ?? ((a, b) => a === b);
    const events = new EventTarget();
    listen(signal, "change", (event) => {
      const oldValue = get(event.oldValue);
      const newValue = get(event.newValue);
      if (!equals(oldValue, newValue)) {
        events.dispatchEvent(new ChangeEvent(oldValue, newValue, event.isInternal));
      }
    });
    const viewed = Object.assign(
      function() {
        Scope.getCurrent()?.register(viewed);
        return get(signal.peek());
      },
      {
        set(valueOrCallback, options) {
          signal.set(
            (previous) => set(
              previous,
              typeof valueOrCallback === "function" ? valueOrCallback(get(previous)) : valueOrCallback
            ),
            options
          );
        },
        peek: () => get(signal.peek()),
        isInitialized() {
          return signal.isInitialized();
        },
        addEventListener(event, callback, options) {
          events.addEventListener(event, callback, options);
        },
        removeEventListener(type, callback, options) {
          events.removeEventListener(type, callback, options);
        },
        dispatchEvent(event) {
          Object.defineProperty(event, "target", { value: viewed });
          return events.dispatchEvent(event);
        }
      }
    );
    return viewed;
  }
  var view_default = view;

  // src/api/chapter-read.ts
  var chapterReadMetadata;
  function getChapterReadMetadata() {
    if (chapterReadMetadata == null) {
      chapterReadMetadata = createSignal({ version: 1, stories: {} });
      GM.getValue("ffe-chapter-read").then(
        (value) => chapterReadMetadata.set(
          tryParse(value, {
            version: 1,
            stories: {}
          }),
          {
            isInternal: true
          }
        )
      );
      chapterReadMetadata.addEventListener("change", async (event) => {
        if (event.isInternal) {
          return;
        }
        await GM.setValue("ffe-chapter-read", JSON.stringify(event.newValue));
      });
      if (GM_addValueChangeListener != null) {
        GM_addValueChangeListener("ffe-chapter-read", (name, oldValue, newValue) => {
          const metadata = tryParse(newValue);
          if (metadata != null) {
            chapterReadMetadata.set(metadata, { isInternal: true });
          }
        });
      }
    }
    return chapterReadMetadata;
  }
  function getChapterRead(storyId, chapterId) {
    return view_default(getChapterReadMetadata(), {
      get(value) {
        return value.stories[storyId]?.[chapterId]?.read ?? false;
      },
      set(previous, value) {
        return {
          ...previous,
          stories: {
            ...previous.stories,
            [storyId]: {
              ...previous.stories[storyId],
              [chapterId]: {
                ...previous.stories[storyId]?.[chapterId],
                read: value,
                timestamp: Date.now()
              }
            }
          }
        };
      }
    });
  }
  async function migrateChapterRead() {
    const metadata = tryParse(await GM.getValue("ffe-chapter-read"), {
      version: 1,
      stories: {}
    });
    let hasChanges = false;
    const list = await GM.listValues();
    for (const key of list) {
      const match = /^ffe-story-(\d+)-chapter-(\d+)-read$/.exec(key);
      if (match) {
        const [, storyId, chapterId] = match;
        metadata.stories[+storyId] ??= {};
        const metadataChapter = metadata.stories[+storyId][+chapterId];
        const oldTimestamp = await GM.getValue(`ffe-story-${storyId}-chapter-${chapterId}-read+timestamp`, 0);
        if (metadataChapter == null || metadataChapter.timestamp < oldTimestamp) {
          hasChanges = true;
          metadata.stories[+storyId][+chapterId] = {
            read: await GM.getValue(key, "") === "true",
            timestamp: oldTimestamp
          };
        }
        await GM.deleteValue(key);
        await GM.deleteValue(key + "+timestamp");
      }
    }
    if (hasChanges) {
      await GM.setValue("ffe-chapter-read", JSON.stringify(metadata));
    }
  }
  if (true) {
    void migrateChapterRead();
  }

  // gm-css:src/components/CheckBox/CheckBox.css
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

  // jsx:src/components/CheckBox/CheckBox.tsx
  function CheckBox({
    checked,
    onChange
  }) {
    const id = `ffe-check-${parseInt(`${Math.random() * 1e8}`, 10)}`;
    return jsxs("span", {
      class: "ffe-checkbox",
      children: [jsx("input", {
        type: "checkbox",
        id,
        checked,
        onClick: onChange && ((event) => onChange(event.target.checked))
      }), jsx("label", {
        for: id
      })]
    });
  }

  // src/api/word-count.ts
  function getWordCountCache(storyId) {
    const key = `ffe-story-${storyId}-words`;
    const signal = createSignal(tryParse(localStorage.getItem(key), {}));
    listen(signal, "change", (event) => {
      if (event.isInternal) {
        return;
      }
      localStorage.setItem(key, JSON.stringify(event.newValue));
      dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue: JSON.stringify(event.newValue)
        })
      );
    });
    listen(window, "storage", (event) => {
      if (event.key !== key) {
        return;
      }
      const next = tryParse(event.newValue);
      if (next) {
        signal.set(next, { isInternal: true });
      }
    });
    return signal;
  }
  function getWordCount(storyId, chapterId) {
    return view_default(getWordCountCache(storyId), {
      get(cache) {
        const count = cache[chapterId];
        if (count && !count.isEstimate) {
          return count;
        }
        return getWordCountOrEstimate(cache, storyId, chapterId);
      },
      set(cache, next) {
        return {
          ...cache,
          [chapterId]: next
        };
      },
      equals(previous, next) {
        return previous?.count === next?.count && previous?.isEstimate === next?.isEstimate && previous?.timestamp === next?.timestamp;
      }
    });
  }
  function getWordCountOrEstimate(cache, storyId, chapterId) {
    const cached = cache[chapterId];
    if (cached && !cached.isEstimate) {
      return cached;
    }
    const story = getStoryMetadata(storyId)();
    if (!story?.words || !story.chapters) {
      return cached;
    }
    const { countedWords, unknownChapters } = story.chapters.reduce(
      ({ countedWords: countedWords2, unknownChapters: unknownChapters2 }, chapter2) => {
        const c = cache[chapter2.id];
        if (!c || c.isEstimate) {
          return { countedWords: countedWords2, unknownChapters: unknownChapters2 + 1 };
        }
        return { countedWords: countedWords2 + c.count, unknownChapters: unknownChapters2 };
      },
      {
        countedWords: 0,
        unknownChapters: 0
      }
    );
    return {
      count: Math.floor((story.words - countedWords) / unknownChapters),
      isEstimate: true,
      timestamp: Date.now()
    };
  }
  function updateWordCount() {
    if (environment.currentPageType === 5 /* Chapter */) {
      const key = `ffe-story-${environment.currentStoryId}-words`;
      const wordCount = document.getElementById("storytext")?.textContent?.trim()?.split(/\s+/).length ?? 0;
      const cache = tryParse(localStorage.getItem(key), {});
      cache[environment.currentChapterId] = {
        count: wordCount,
        isEstimate: false,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(cache));
    }
  }
  function migrateWordCount() {
    const keys = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i));
    for (const key of keys) {
      const match = key && key.match(/^ffe-story-(\d+)-chapter-(\d+)-words$/);
      if (match) {
        const [, storyId, chapterId] = match;
        const cache = tryParse(localStorage.getItem(`ffe-story-${storyId}-words`), {});
        cache[+chapterId] = {
          count: +localStorage.getItem(key),
          isEstimate: false,
          timestamp: +(localStorage.getItem(key + "+timestamp") || Date.now())
        };
        localStorage.setItem(`ffe-story-${storyId}-words`, JSON.stringify(cache));
        localStorage.removeItem(key);
        localStorage.removeItem(key + "+timestamp");
      }
    }
  }
  if (true) {
    migrateWordCount();
    updateWordCount();
  }

  // jsx:src/components/ChapterList/ChapterListEntry.tsx
  function ChapterListEntry({
    storyId,
    chapter: chapter2
  }) {
    const isRead = getChapterRead(storyId, chapter2.id);
    const words = getWordCount(storyId, chapter2.id);
    return render(() => jsxs("li", {
      class: "ffe-cl-chapter",
      children: [render(() => jsx(CheckBox, {
        checked: isRead(),
        onChange: isRead.set
      })), jsx("span", {
        class: "ffe-cl-chapter-title",
        children: jsx("a", {
          href: `/s/${storyId}/${chapter2.id}`,
          children: chapter2.title
        })
      }), words() != null && render(() => jsxs("span", {
        class: clsx_default("ffe-cl-words", {
          "ffe-cl-estimate": words()?.isEstimate
        }),
        children: [render(() => jsx("b", {
          children: words()?.count.toLocaleString("en")
        })), " words"]
      }))]
    }));
  }

  // gm-css:src/components/ChapterList/ChapterList.css
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

.ffe-cl-estimate {
  color: var(--ffe-on-panel-color-faint);
}

.ffe-cl-estimate:before {
    content: "~";
  }

.ffe-cl-collapsed {
  text-align: center;
}

.ffe-cl-collapsed a {
    cursor: pointer;
  }
`);

  // jsx:src/components/ChapterList/ChapterList.tsx
  function hiddenChapterMapper(story, isRead, onShow) {
    return (chapter2, idx, chapters) => {
      if (isRead(chapter2)) {
        if (idx === chapters.length - 1 || !isRead(chapters[idx + 1])) {
          let count = 0;
          for (let i = idx; i >= 0; i--) {
            if (!isRead(chapters[i])) {
              break;
            }
            count += 1;
          }
          return jsx("li", {
            class: "ffe-cl-chapter ffe-cl-collapsed",
            children: jsxs("a", {
              onClick: onShow,
              children: ["Show ", count, " hidden chapter", count !== 1 && "s"]
            })
          });
        }
        return null;
      }
      if (idx > 1) {
        if (idx === chapters.length - 4) {
          let count = 0;
          for (let i = idx; i >= 0; i--) {
            if (isRead(chapters[i])) {
              break;
            }
            count += 1;
          }
          return jsx("li", {
            class: "ffe-cl-chapter ffe-cl-collapsed",
            children: jsxs("a", {
              onclick: onShow,
              children: ["Show ", count - 2, " hidden chapter", count !== 3 && "s"]
            })
          });
        }
        if (idx < chapters.length - 3 && !isRead(chapters[idx - 1]) && !isRead(chapters[idx - 2])) {
          return null;
        }
      }
      return jsx(ChapterListEntry, {
        storyId: story.id,
        chapter: chapter2
      });
    };
  }
  function ChapterList({
    storyId
  }) {
    const isExtended = createSignal(false);
    return render(() => {
      const story = getStory(storyId)();
      if (!story) {
        return jsx("div", {
          class: "ffe-cl-container"
        });
      }
      const isReadMap = new Map(story.chapters?.map((chapter2) => [chapter2.id, getChapterRead(story.id, chapter2.id)]));
      return render(() => jsx("div", {
        class: "ffe-cl-container",
        children: render(() => jsx("div", {
          class: "ffe-cl",
          children: render(() => jsx("ol", {
            children: isExtended() ? story.chapters?.map((chapter2) => jsx(ChapterListEntry, {
              storyId: story.id,
              chapter: chapter2
            })) : story.chapters?.flatMap(hiddenChapterMapper(story, (chapter2) => isReadMap.get(chapter2.id)(), () => isExtended.set(true)))
          }))
        }))
      }));
    });
  }

  // gm-css:src/components/Button/Button.css
  GM_addStyle(`.btn > svg {
  height: 19px;
  vertical-align: text-bottom;
  margin-top: -2px;
  margin-bottom: -2px;
  fill: currentColor;
}
`);

  // jsx:src/components/Button/Button.tsx
  function Button({
    class: className,
    title: title2,
    disabled,
    onClick,
    children
  }) {
    return render(() => jsx("span", {
      role: "button",
      class: clsx_default("btn", {
        disabled
      }, className),
      title: title2,
      onClick,
      children
    }));
  }

  // gm-css:src/components/Rating/Rating.css
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

  // jsx:src/components/Rating/Rating.tsx
  var ratings = {
    K: {
      class: "ffe-rating-k",
      title: "General Audience (5+)"
    },
    "K+": {
      class: "ffe-rating-kp",
      title: "Young Children (9+)"
    },
    T: {
      class: "ffe-rating-t",
      title: "Teens (13+)"
    },
    M: {
      class: "ffe-rating-m",
      title: "Teens (16+)"
    },
    MA: {
      class: "ffe-rating-ma",
      title: "Mature (18+)"
    }
  };
  function Rating({
    rating
  }) {
    return render(() => jsx("a", {
      href: "https://www.fictionratings.com/",
      class: clsx_default("ffe-rating", ratings[rating ?? ""]?.class),
      title: ratings[rating ?? ""]?.title ?? "No Rating Available",
      rel: "noreferrer",
      target: "rating",
      children: rating && rating in ratings ? rating : "?"
    }));
  }

  // src/api/links.ts
  var FFN_BASE_URL = "//www.fanfiction.net";
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

  // src/util/epub.ts
  function escapeFile(text) {
    return text.replace(/[<>:"/\\|?*]/g, "-");
  }
  function escapeXml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  var Epub = class {
    constructor(story) {
      this.story = story;
      console.debug("[EPUB] Using JSZip version: %s", JSZip.version);
    }
    getContainerXml() {
      return `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="content.opf" media-type="application/oebps-package+xml" />
  </rootfiles>
</container>
`;
    }
    getContentXml() {
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
    <dc:date>${toDate(this.story.published).toISOString()}</dc:date>
    <meta property="dcterms:modified">${(/* @__PURE__ */ new Date()).toISOString().substring(0, 19)}Z</meta>
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
    getNcxXml() {
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
    getTocHtml() {
      return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:ops="http://www.idpf.org/2007/ops"
      lang="${escapeXml(this.story.language)}">
  <head>
    <meta charset="UTF-8" />
    <meta name="generator" content="FanFiction Enhancements (https://github.com/amur-tiger/fanfiction-enhancements)" />
    <meta name="author" content="${escapeXml(this.story.author.name)}" />
    <meta name="date" content="${toDate(this.story.published).toISOString()}" />
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
    getCoverHtml() {
      return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="${escapeXml(this.story.language)}">
  <head>
    <meta charset="UTF-8" />
    <meta name="generator" content="FanFiction Enhancements (https://github.com/amur-tiger/fanfiction-enhancements)"/>
    <meta name="author" content="${escapeXml(this.story.author.name)}"/>
    <meta name="date" content="${toDate(this.story.published).toISOString()}"/>
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
      const response = await throttledFetch(link, void 0, 3 /* EpubChapter */);
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
    <meta name="date" content="${toDate(this.story.published).toISOString()}"/>
    <title>${escapeXml(chapter2.title)}</title>
</head>
<body>
${content}
</body>
</html>`;
    }
    hasCover() {
      return !!this.story.imageUrl;
    }
    getFilename() {
      return escapeFile(`${this.story.title} - ${this.story.author.name}.epub`);
    }
    async create(onProgress) {
      console.debug("[EPUB] Creating EPUB for '%s'", this.story.title);
      const stepCount = this.story.chapters.length + 3;
      let step = 0;
      const advance = () => {
        step += 1;
        onProgress?.({ progress: step / stepCount, step, stepCount });
      };
      const zip = new JSZip();
      zip.file("mimetype", "application/epub+zip");
      const meta = zip.folder("META-INF");
      meta.file("container.xml", this.getContainerXml());
      zip.file("content.opf", this.getContentXml());
      zip.file("toc.ncx", this.getNcxXml());
      zip.file("toc.xhtml", this.getTocHtml());
      advance();
      const coverUrl = this.story.imageUrl;
      if (coverUrl) {
        console.debug("[EPUB] Fetching cover");
        zip.file("cover.xhtml", this.getCoverHtml());
        const cover = await throttledFetch(`//www.fanfiction.net${coverUrl}`, void 0, 3 /* EpubChapter */);
        if (!cover.ok) {
          throw new Error(cover.statusText);
        }
        zip.file("cover.jpg", await cover.blob());
      }
      advance();
      await Promise.all(
        this.story.chapters.map(async (chapter2) => {
          console.debug("[EPUB] Fetching chapter %d: '%s'", chapter2.id, chapter2.title);
          zip.file(`chapter-${chapter2.id}.xhtml`, await this.getChapterHtml(chapter2));
          advance();
        })
      );
      console.debug("[EPUB] Packing file");
      const result = zip.generateAsync({ type: "blob" });
      advance();
      return result;
    }
  };

  // src/api/follows.ts
  function getStoryFollowCache(type) {
    const key = `ffe-${type}`;
    const signal = createSignal(
      tryParse(localStorage.getItem(key), {
        timestamp: 0
      })
    );
    listen(signal, "change", async (event) => {
      if (event.isInternal) {
        return;
      }
      localStorage.setItem(key, JSON.stringify(event.newValue));
      dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue: JSON.stringify(event.newValue)
        })
      );
    });
    listen(window, "storage", (event) => {
      if (event.key !== key) {
        return;
      }
      const next = tryParse(event.newValue);
      if (next) {
        signal.set(next, { isInternal: true });
      }
    });
    return signal;
  }
  function getStoryFavorite(storyId) {
    return view_default(getStoryFollowCache("favorites"), {
      get(cache) {
        return cache[storyId]?.follow ?? false;
      },
      set(cache, follow) {
        if (follow) {
          void Api.instance.addStoryFavorite(storyId);
        } else {
          void Api.instance.removeStoryFavorite(storyId);
        }
        return {
          ...cache,
          [storyId]: {
            ...cache[storyId],
            id: storyId,
            follow,
            timestamp: Date.now()
          }
        };
      }
    });
  }
  function getStoryAlert(storyId) {
    return view_default(getStoryFollowCache("alerts"), {
      get(cache) {
        return cache[storyId]?.follow ?? false;
      },
      set(cache, follow) {
        if (follow) {
          void Api.instance.addStoryAlert(storyId);
        } else {
          void Api.instance.removeStoryAlert(storyId);
        }
        return {
          ...cache,
          [storyId]: {
            ...cache[storyId],
            id: storyId,
            follow,
            timestamp: Date.now()
          }
        };
      }
    });
  }
  function updateFollows() {
    const maxAge = 5 * 60 * 1e3;
    const favorites = getStoryFollowCache("favorites");
    if (favorites.peek().timestamp < Date.now() - maxAge) {
      Api.instance.getStoryFavorites().then((follows) => {
        favorites.set({
          timestamp: Date.now(),
          ...Object.fromEntries(
            follows.map((follow) => [
              follow.id,
              {
                id: follow.id,
                follow: true,
                timestamp: Date.now()
              }
            ])
          )
        });
      });
    }
    const alerts = getStoryFollowCache("alerts");
    if (alerts.peek().timestamp < Date.now() - maxAge) {
      Api.instance.getStoryAlerts().then((follows) => {
        alerts.set({
          timestamp: Date.now(),
          ...Object.fromEntries(
            follows.map((follow) => [
              follow.id,
              {
                id: follow.id,
                follow: true,
                timestamp: Date.now()
              }
            ])
          )
        });
      });
    }
  }
  function migrateFollows() {
    const keys = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i));
    for (const key of keys) {
      if (key && /^ffe-story-\d+-(favorite|alert)$/.test(key)) {
        localStorage.removeItem(key);
        localStorage.removeItem(key + "+timestamp");
      }
    }
  }
  if (true) {
    migrateFollows();
    updateFollows();
  }

  // gm-css:src/components/StoryCard/StoryCard.css
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

.ffe-sc-alert:hover,
.ffe-sc-alert.ffe-active {
  color: var(--ffe-alert-color);
}

.ffe-sc-favorite:hover,
.ffe-sc-favorite.ffe-active {
  color: var(--ffe-favorite-color);
}

.ffe-sc-follow-count {
  color: var(--ffe-on-button-color);
  font-weight: bolder;
  margin-left: 0.4em;
}

.ffe-sc-download-button {
  display: inline-flex;
  gap: 0.5rem;
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

  // gm-css:src/components/CircularProgress/CircularProgress.css
  GM_addStyle(`.ffe-cp-progress {
  visibility: hidden;
  position: absolute;
}

.ffe-cp-circle-background {
  stroke: var(--ffe-on-button-color-faint);
}

.ffe-cp-circle-foreground {
  transform: rotate(-90deg);
  stroke: var(--ffe-primary-color);
}
`);

  // jsx:src/components/CircularProgress/CircularProgress.tsx
  function CircularProgress({
    progress,
    size = 24
  }) {
    const strokeWidth = 4;
    const circumference = (size - strokeWidth) * Math.PI;
    const dash = (progress ?? 0) * circumference;
    return jsxs("span", {
      style: `height: ${size}px;`,
      children: [jsx("progress", {
        class: "ffe-cp-progress",
        value: progress
      }), jsxs("svg", {
        width: size,
        height: size,
        viewBox: `0 0 ${size} ${size}`,
        children: [jsx("circle", {
          class: "ffe-cp-circle-background",
          cx: size / 2,
          cy: size / 2,
          r: (size - strokeWidth) / 2,
          fill: "none",
          "stroke-width": strokeWidth
        }), jsx("circle", {
          class: "ffe-cp-circle-foreground",
          cx: size / 2,
          cy: size / 2,
          r: (size - strokeWidth) / 2,
          fill: "none",
          "stroke-width": strokeWidth,
          "transform-origin": `${size / 2} ${size / 2}`,
          "stroke-dasharray": `${dash} ${circumference - dash}`
        })]
      })]
    });
  }

  // jsx:src/components/StoryCard/StoryCard.tsx
  function StoryCard({
    storyId
  }) {
    const story = getStory(storyId)();
    if (!story) {
      return jsx("div", {
        class: "ffe-sc",
        children: "loading..."
      });
    }
    const isDownloading = createSignal(false);
    const progress = createSignal();
    const hasAlert = getStoryAlert(story.id);
    const isFavorite = getStoryFavorite(story.id);
    const alertOffset = createSignal(0);
    const favoriteOffset = createSignal(0);
    const handleDownloadClick = async () => {
      const link = element.querySelector(".ffe-download-link");
      if (isDownloading() || !link || !("chapters" in story)) {
        return;
      }
      try {
        isDownloading.set(true);
        const epub = new Epub(story);
        const blob = await epub.create(progress.set);
        link.href = URL.createObjectURL(blob);
        link.download = epub.getFilename();
        link.click();
      } finally {
        isDownloading.set(false);
      }
    };
    const element = render(() => jsxs("div", {
      class: "ffe-sc",
      children: [render(() => jsxs("div", {
        class: "ffe-sc-header",
        children: [jsx(Rating, {
          rating: story.rating
        }), jsx("a", {
          href: `/s/${story.id}`,
          class: "ffe-sc-title",
          children: story.title
        }), jsx("span", {
          class: "ffe-sc-by",
          children: "by"
        }), jsx("a", {
          href: `/u/${story.author.id}`,
          class: "ffe-sc-author",
          children: story.author.name
        }), render(() => jsxs("div", {
          class: "ffe-sc-mark",
          children: [render(() => jsxs(Button, {
            onClick: handleDownloadClick,
            title: isDownloading() ? `Progress: ${Math.round((progress()?.progress ?? 0) * 100)}\u202F%` : "Download as ePub",
            class: "ffe-sc-download-button",
            disabled: isDownloading(),
            children: [isDownloading() ? render(() => jsx(CircularProgress, {
              size: 20,
              progress: progress()?.progress
            })) : jsx("span", {
              class: "icon-arrow-down"
            }), isDownloading() && render(() => jsxs("span", {
              children: [Math.round((progress()?.progress ?? 0) * 100), "\u202F", "%"]
            }))]
          })), jsx("a", {
            style: "display: none",
            class: "ffe-download-link"
          }), render(() => jsxs("div", {
            class: "btn-group",
            children: [render(() => jsxs(Button, {
              class: clsx_default("ffe-sc-alert", {
                "ffe-active": hasAlert()
              }),
              title: "Toggle Story Alert",
              onClick: () => hasAlert.set((prev) => {
                alertOffset.set((po) => prev ? po - 1 : po + 1);
                return !prev;
              }),
              children: [jsx(bell_default, {}), render(() => jsx("span", {
                class: "ffe-sc-follow-count",
                children: ((story.follows ?? 0) + alertOffset()).toLocaleString("en")
              }))]
            })), render(() => jsx(Button, {
              class: clsx_default("ffe-sc-favorite icon-heart", {
                "ffe-active": isFavorite()
              }),
              title: "Toggle Favorite",
              onClick: () => isFavorite.set((prev) => {
                favoriteOffset.set((po) => prev ? po - 1 : po + 1);
                return !prev;
              }),
              children: render(() => jsx("span", {
                class: "ffe-sc-follow-count",
                children: ((story.favorites ?? 0) + favoriteOffset()).toLocaleString("en")
              }))
            }))]
          }))]
        }))]
      })), render(() => jsxs("div", {
        class: "ffe-sc-tags",
        children: [story.language && jsx("span", {
          class: "ffe-sc-tag ffe-sc-tag-language",
          children: story.language
        }), story.universes && story.universes.map((universe) => jsx("span", {
          class: "ffe-sc-tag ffe-sc-tag-universe",
          children: universe
        })), story.genre && story.genre.map((genre) => jsx("span", {
          class: "ffe-sc-tag ffe-sc-tag-genre",
          children: genre
        })), story.characters && story.characters.length > 0 && story.characters.map((pairing) => pairing.length === 1 ? jsx("span", {
          class: "ffe-sc-tag ffe-sc-tag-character",
          children: pairing
        }) : render(() => jsx("span", {
          class: "ffe-sc-tag ffe-sc-tag-ship",
          children: pairing.map((character) => jsx("span", {
            class: "ffe-sc-tag-character",
            children: character
          }))
        }))), story.chapters && story.chapters.length > 0 && jsxs("span", {
          class: "ffe-sc-tag ffe-sc-tag-chapters",
          children: ["Chapters:\xA0", story.chapters.length]
        }), story.reviews != null && jsx("span", {
          class: "ffe-sc-tag ffe-sc-tag-reviews",
          children: jsxs("a", {
            href: `/r/${story.id}/`,
            children: ["Reviews:\xA0", story.reviews]
          })
        })]
      })), story.imageUrl && jsx("div", {
        class: "ffe-sc-image",
        children: jsx("img", {
          src: story.imageUrl,
          alt: "Story Cover"
        })
      }), jsx("div", {
        class: "ffe-sc-description",
        children: story.description
      }), render(() => jsxs("div", {
        class: "ffe-sc-footer",
        children: [story.words != null && render(() => jsxs("div", {
          class: "ffe-sc-footer-words",
          children: [render(() => jsx("strong", {
            children: story.words.toLocaleString("en")
          })), " words"]
        })), story.status === "Complete" ? jsx("span", {
          class: "ffe-sc-footer-info ffe-sc-footer-complete",
          children: "Complete"
        }) : jsx("span", {
          class: "ffe-sc-footer-info ffe-sc-footer-incomplete",
          children: "Incomplete"
        }), story.published && render(() => jsxs("span", {
          class: "ffe-sc-footer-info",
          children: [jsx("strong", {
            children: "Published:\xA0"
          }), render(() => jsx("time", {
            datetime: toDate(story.published).toISOString(),
            children: toDate(story.published).toLocaleDateString("en")
          }))]
        })), story.updated && render(() => jsxs("span", {
          class: "ffe-sc-footer-info",
          children: [jsx("strong", {
            children: "Updated:\xA0"
          }), render(() => jsx("time", {
            datetime: toDate(story.updated).toISOString(),
            children: toDate(story.updated).toLocaleDateString("en")
          }))]
        }))]
      }))]
    }));
    return element;
  }

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

  // jsx:src/enhance/FollowsList.tsx
  var FollowsList = class {
    async enhance() {
      const list = await (0, import_ffn_parser3.parseFollows)(document);
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
        const card = jsx(StoryCard, {
          storyId: followedStory.id
        });
        item.appendChild(card);
        const chapterList = jsx(ChapterList, {
          storyId: followedStory.id
        });
        item.appendChild(chapterList);
      }
      table.parentElement?.removeChild(table);
    }
  };

  // jsx:src/enhance/StoryList.tsx
  var import_ffn_parser4 = __toESM(require_lib());

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

  // jsx:src/enhance/StoryList.tsx
  var StoryList = class {
    async enhance() {
      const list = await (0, import_ffn_parser4.parseStoryList)(document);
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
      for (const followedStory of list) {
        const item = document.createElement("li");
        item.classList.add("ffe-story-item");
        container2.appendChild(item);
        const card = jsx(StoryCard, {
          storyId: followedStory.id
        });
        item.appendChild(card);
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

  // jsx:src/enhance/StoryProfile.tsx
  var StoryProfile = class {
    async enhance() {
      const profile = document.getElementById("profile_top");
      if (!profile || !environment.currentStoryId) {
        return;
      }
      const card = jsx(StoryCard, {
        storyId: environment.currentStoryId
      });
      profile.parentElement?.insertBefore(card, profile);
      profile.style.display = "none";
    }
  };

  // jsx:src/enhance/ChapterList.tsx
  var ChapterList2 = class {
    async enhance() {
      const contentWrapper = document.getElementById("content_wrapper_inner");
      if (!contentWrapper || !environment.currentStoryId) {
        return;
      }
      Array.from(contentWrapper.children).filter((e) => !e.textContent && e.style.height === "5px" || e.firstElementChild && e.firstElementChild.nodeName === "SELECT" || e.className === "lc-wrapper" && e.id !== "pre_story_links").forEach((e) => contentWrapper.removeChild(e));
      const storyText = document.getElementById("storytextp");
      if (storyText) {
        contentWrapper.removeChild(storyText);
      }
      const chapterList = jsx(ChapterList, {
        storyId: environment.currentStoryId
      });
      contentWrapper.insertBefore(chapterList, document.getElementById("review_success"));
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

  // src/container.ts
  var Container = class {
    constructor() {
      __publicField(this, "menuBar");
      __publicField(this, "followsList");
      __publicField(this, "storyList");
      __publicField(this, "storyProfile");
      __publicField(this, "chapterList");
      __publicField(this, "saveListSettings");
    }
    getMenuBar() {
      if (!this.menuBar) {
        this.menuBar = new MenuBar();
      }
      return this.menuBar;
    }
    getFollowsList() {
      if (!this.followsList) {
        this.followsList = new FollowsList();
      }
      return this.followsList;
    }
    getStoryListEnhancer() {
      if (!this.storyList) {
        this.storyList = new StoryList();
      }
      return this.storyList;
    }
    getStoryProfile() {
      if (!this.storyProfile) {
        this.storyProfile = new StoryProfile();
      }
      return this.storyProfile;
    }
    getChapterList() {
      if (!this.chapterList) {
        this.chapterList = new ChapterList2();
      }
      return this.chapterList;
    }
    getSaveListSettings() {
      if (!this.saveListSettings) {
        this.saveListSettings = new SaveListSettings();
      }
      return this.saveListSettings;
    }
    getContainer() {
      return this;
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
      __publicField(this, "GOOGLE_FONTS_WHITELIST", ["Open Sans", "PT Sans", "Roboto", "Ubuntu"]);
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
        if (!link) {
          const links = Array.from(document.head.querySelectorAll("link"));
          link = links.find((l) => l.href.includes("fonts.googleapis.com"));
        }
        if (!link) {
          return false;
        }
        const href = new URL(link.href);
        const search = new URLSearchParams(href.search);
        const families = search.get("family")?.split("|").filter((f) => this.GOOGLE_FONTS_WHITELIST.includes(f));
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

  // src/sync/drive.ts
  async function authFetch(input, init) {
    const token2 = await getSyncToken();
    const response = await fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${token2}`
      }
    });
    if (response.status === 401) {
      console.warn("Sync token invalid, deleting it");
      await removeSyncToken();
    }
    return response;
  }
  async function getFiles(name) {
    let url = "https://www.googleapis.com/drive/v3/files?spaces=appDataFolder";
    if (name) {
      url += "&q=" + encodeURIComponent(`name='${name}'`);
    }
    const response = await authFetch(url);
    return response.json();
  }
  async function getFileContents(id) {
    const response = await authFetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}?alt=media`);
    return response.text();
  }
  async function createFile(name, content) {
    const data = new FormData();
    data.set(
      "metadata",
      new Blob(
        [
          JSON.stringify({
            name,
            mimeType: "application/json",
            parents: ["appDataFolder"]
          })
        ],
        {
          type: "application/json"
        }
      )
    );
    data.set(
      "file",
      new Blob([JSON.stringify(content)], {
        type: "application/json"
      })
    );
    const response = await authFetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
      method: "POST",
      body: data
    });
    return response.json();
  }
  async function updateFile(file, content) {
    const response = await authFetch(`https://www.googleapis.com/upload/drive/v3/files/${encodeURIComponent(file.id)}`, {
      method: "PATCH",
      body: new Blob([JSON.stringify(content)], {
        type: "application/json"
      })
    });
    return response.json();
  }

  // src/sync/sync.ts
  async function getFile(name, fallback) {
    const { files } = await getFiles(name);
    const file = files?.find((file2) => file2.name === name);
    if (!file?.id) {
      return fallback;
    }
    return tryParse(await getFileContents(file.id), fallback);
  }
  async function writeFile(name, content) {
    const { files } = await getFiles(name);
    let file = files?.find((file2) => file2.name === name);
    if (!file?.id) {
      file = await createFile(name, content);
      if (!file) {
        throw new Error("Could not save file: Google did not provide metadata.");
      }
      return file;
    }
    return updateFile(file, content);
  }
  var readFileName = "ffe-chapter-read.json";
  var token = null;
  async function uploadMetadata() {
    if (!await isSyncAuthorized()) {
      return;
    }
    if (token != null) {
      clearTimeout(token);
      token = null;
    }
    const metadata = getChapterReadMetadata();
    await metadata.isInitialized();
    console.debug("[SYNC] Uploading changes to Drive");
    await writeFile(readFileName, metadata.peek());
  }
  async function syncChapterReadStatus() {
    if (!await isSyncAuthorized()) {
      return;
    }
    const localMetadataSignal = getChapterReadMetadata();
    await localMetadataSignal.isInitialized();
    localMetadataSignal.addEventListener("change", async (event) => {
      if (event.isInternal) {
        return;
      }
      if (token != null) {
        clearTimeout(token);
      }
      token = setTimeout(uploadMetadata, 1500);
    });
    const localMetadata = localMetadataSignal.peek();
    const remoteMetadata = await getFile(readFileName, { version: 1, stories: {} });
    const result = mergeStories(localMetadata.stories, remoteMetadata.stories);
    const mergedMetadata = { version: 1, stories: result.merged };
    if (result.hasLocalChanges) {
      console.debug("[SYNC] Integrating remote data");
      localMetadataSignal.set(mergedMetadata);
    }
    if (result.hasRemoteChanges) {
      console.debug("[SYNC] Uploading changes to Drive");
      await writeFile(readFileName, mergedMetadata);
    }
  }
  function mergeStories(local, remote) {
    return mergeRecord(local, remote, (localChapter, remoteChapter) => {
      return mergeRecord(localChapter, remoteChapter, (localIsRead, remoteIsRead) => {
        return mergeIsRead(localIsRead, remoteIsRead);
      });
    });
  }
  function mergeRecord(local, remote, mergeItem) {
    let result = removeNull(local, remote);
    if (result) {
      return result;
    }
    result = {
      merged: {},
      hasLocalChanges: false,
      hasRemoteChanges: false
    };
    const keys = /* @__PURE__ */ new Set([...Object.keys(local), ...Object.keys(remote)]);
    for (const key of keys) {
      const localItem = local[key];
      const remoteItem = remote[key];
      const itemResult = removeNull(localItem, remoteItem) ?? mergeItem(localItem, remoteItem);
      result.merged[key] = itemResult.merged;
      result.hasLocalChanges ||= itemResult.hasLocalChanges;
      result.hasRemoteChanges ||= itemResult.hasRemoteChanges;
    }
    return result;
  }
  function mergeIsRead(local, remote) {
    const result = removeNull(local, remote);
    if (result) {
      return result;
    }
    if (local.timestamp !== remote.timestamp || local.read !== remote.read) {
      if (local.timestamp > remote.timestamp) {
        return { merged: local, hasLocalChanges: false, hasRemoteChanges: true };
      } else {
        return { merged: remote, hasLocalChanges: true, hasRemoteChanges: false };
      }
    }
    return { merged: local, hasLocalChanges: false, hasRemoteChanges: false };
  }
  function removeNull(local, remote) {
    if (local == null) {
      if (remote == null) {
        return { merged: void 0, hasLocalChanges: false, hasRemoteChanges: false };
      } else {
        return { merged: remote, hasLocalChanges: true, hasRemoteChanges: false };
      }
    } else if (remote == null) {
      return { merged: local, hasLocalChanges: false, hasRemoteChanges: true };
    }
  }

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
  --ffe-on-panel-color-faint: #999;
  --ffe-on-paper-color: #333;
  --ffe-on-button-color: #555;
  --ffe-on-button-color-faint: #999;
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
  GM_addStyle(`a,
a:link,
a:active,
a:visited {
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

body,
.zmenu,
.tcat {
  background-color: var(--ffe-panel-color) !important;
  border-color: var(--ffe-divider-color);
  color: var(--ffe-on-panel-color);
}

.btn {
  color: var(--ffe-on-button-color);
}

#content_parent {
  background-color: var(--ffe-background-color) !important;
}

#content_wrapper,
.lc {
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
    if (environment.currentPageType === 6 /* OAuth2 */) {
      console.log("OAuth 2 landing page - no enhancements will be applied");
      return;
    }
    syncChapterReadStatus().catch(console.error);
    const menuBarEnhancer = container.getMenuBar();
    await menuBarEnhancer.enhance();
    if (environment.currentPageType === 2 /* Alerts */ || environment.currentPageType === 3 /* Favorites */) {
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
      const storyProfileEnhancer = container.getStoryProfile();
      await storyProfileEnhancer.enhance();
      const chapterListEnhancer = container.getChapterList();
      await chapterListEnhancer.enhance();
    }
    if (environment.currentPageType === 5 /* Chapter */) {
      const currentStory = await (0, import_ffn_parser5.parseStory)(document);
      if (currentStory) {
        const storyProfileEnhancer = container.getStoryProfile();
        await storyProfileEnhancer.enhance();
        const storyTextEnhancer = new StoryText();
        await storyTextEnhancer.enhance();
        if (environment.currentChapterId) {
          const isRead = getChapterRead(currentStory.id, environment.currentChapterId);
          const markRead = async () => {
            const amount = document.documentElement.scrollTop;
            const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (amount / (max - 550) >= 1) {
              window.removeEventListener("scroll", markRead);
              console.log(
                "Setting '%s' chapter '%s' to read",
                currentStory.title,
                currentStory.chapters.find((c) => c.id === environment.currentChapterId)?.title
              );
              isRead.set(true);
              await uploadMetadata();
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
        await GM.setValue(`ffe-story-${storyId}-chapter-${chapterId}-read`, chapter2);
      }
    }
    await GM.deleteValue("ffe-cache-read");
    await GM.deleteValue("ffe-cache-alerts");
  }
  migrate().then(main).catch(console.error);
})();