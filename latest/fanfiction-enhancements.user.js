// ==UserScript==
// @name         FanFiction Enhancements
// @namespace    https://tiger.rocks/
// @version      0.6.14+16.f42e2f4
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
// ==/UserScript==

(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {enumerable: true, configurable: true, writable: true, value}) : obj[key] = value;
  var __objSpread = (a, b) => {
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
  var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
  var __commonJS = (cb, mod) => () => (mod || cb((mod = {exports: {}}).exports, mod), mod.exports);
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, {get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable});
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? {get: () => module.default, enumerable: true} : {value: module, enumerable: true})), module);
  };

  // node_modules/ffn-parser/lib/follows/parseFollows.js
  var require_parseFollows = __commonJS((exports) => {
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
    Object.defineProperty(exports, "__esModule", {value: true});
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
  });

  // node_modules/ffn-parser/lib/follows/model/index.js
  var require_model = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
  });

  // node_modules/ffn-parser/lib/follows/index.js
  var require_follows = __commonJS((exports) => {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, {enumerable: true, get: function() {
        return m[k];
      }});
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
      return mod && mod.__esModule ? mod : {default: mod};
    };
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.parseFollows = void 0;
    var parseFollows_1 = require_parseFollows();
    Object.defineProperty(exports, "parseFollows", {enumerable: true, get: function() {
      return __importDefault(parseFollows_1).default;
    }});
    __exportStar(require_parseFollows(), exports);
    __exportStar(require_model(), exports);
  });

  // node_modules/ffn-parser/lib/story/parseStory.js
  var require_parseStory = __commonJS((exports) => {
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
    Object.defineProperty(exports, "__esModule", {value: true});
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
        const opts = Object.assign({genres: exports.DEFAULT_GENRES, createTemplate() {
          if ("createElement" in doc) {
            return doc.createElement("template");
          }
          return window.document.createElement("template");
        }}, options);
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
  });

  // node_modules/ffn-parser/lib/story/model/index.js
  var require_model2 = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
  });

  // node_modules/ffn-parser/lib/story/index.js
  var require_story = __commonJS((exports) => {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, {enumerable: true, get: function() {
        return m[k];
      }});
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
      return mod && mod.__esModule ? mod : {default: mod};
    };
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.parseStory = void 0;
    var parseStory_1 = require_parseStory();
    Object.defineProperty(exports, "parseStory", {enumerable: true, get: function() {
      return __importDefault(parseStory_1).default;
    }});
    __exportStar(require_parseStory(), exports);
    __exportStar(require_model2(), exports);
  });

  // node_modules/ffn-parser/lib/storyList/parseStoryList.js
  var require_parseStoryList = __commonJS((exports) => {
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
    Object.defineProperty(exports, "__esModule", {value: true});
    var story_1 = require_story();
    function parseStoryList2(document2, options) {
      return __awaiter(this, void 0, void 0, function* () {
        const doc = document2 !== null && document2 !== void 0 ? document2 : window.document;
        const opts = Object.assign({genres: story_1.DEFAULT_GENRES, createTemplate() {
          if ("createElement" in doc) {
            return doc.createElement("template");
          }
          return window.document.createElement("template");
        }}, options);
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
  });

  // node_modules/ffn-parser/lib/storyList/model/index.js
  var require_model3 = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
  });

  // node_modules/ffn-parser/lib/storyList/index.js
  var require_storyList = __commonJS((exports) => {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, {enumerable: true, get: function() {
        return m[k];
      }});
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
      return mod && mod.__esModule ? mod : {default: mod};
    };
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.parseStoryList = void 0;
    var parseStoryList_1 = require_parseStoryList();
    Object.defineProperty(exports, "parseStoryList", {enumerable: true, get: function() {
      return __importDefault(parseStoryList_1).default;
    }});
    __exportStar(require_parseStoryList(), exports);
    __exportStar(require_model3(), exports);
  });

  // node_modules/ffn-parser/lib/index.js
  var require_lib = __commonJS((exports) => {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, {enumerable: true, get: function() {
        return m[k];
      }});
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
    Object.defineProperty(exports, "__esModule", {value: true});
    __exportStar(require_follows(), exports);
    __exportStar(require_story(), exports);
    __exportStar(require_storyList(), exports);
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
      const fragments = await this.getMultiPage("/alert/story.php");
      const result = [];
      await Promise.all(fragments.map(async (fragment) => {
        const follows = await (0, import_ffn_parser.parseFollows)(fragment);
        if (follows) {
          result.push(...follows);
        }
      }));
      return result;
    }
    async getStoryFavorites() {
      const fragments = await this.getMultiPage("/favorites/story.php");
      const result = [];
      await Promise.all(fragments.map(async (fragment) => {
        const follows = await (0, import_ffn_parser.parseFollows)(fragment);
        if (follows) {
          result.push(...follows);
        }
      }));
      return result;
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
      this.name = data.title;
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
    return {callback};
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
  function Button({class: className, text, active, onClick, bind}) {
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
    return element;
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
  function CheckBox({bind}) {
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
  function ChapterList({story}) {
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
    }, chapter2.name)), /* @__PURE__ */ render("span", {
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
  function Rating({rating}) {
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
  function StoryCard({story}) {
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
      class: "ffe-sc-mark btn-group"
    }, /* @__PURE__ */ render(Button, {
      class: "ffe-sc-follow icon-bookmark-2",
      bind: story.alert
    }), /* @__PURE__ */ render(Button, {
      class: "ffe-sc-favorite icon-heart",
      bind: story.favorite
    }))), /* @__PURE__ */ render("div", {
      class: "ffe-sc-tags"
    }, story.language && /* @__PURE__ */ render("span", {
      class: "ffe-sc-tag ffe-sc-tag-language"
    }, story.language), story.universes && story.universes.map((universe) => /* @__PURE__ */ render("span", {
      class: "ffe-sc-tag ffe-sc-tag-universe"
    }, universe)), story.genre && story.genre.map((genre) => /* @__PURE__ */ render("span", {
      class: "ffe-sc-tag ffe-sc-tag-genre"
    }, genre)), story.characters && story.characters.length > 0 && story.characters.map((character) => typeof character === "string" ? /* @__PURE__ */ render("span", {
      class: "ffe-sc-tag ffe-sc-tag-character"
    }, character) : /* @__PURE__ */ render("span", {
      class: "ffe-sc-tag ffe-sc-tag-ship"
    }, character.map((shipCharacter) => /* @__PURE__ */ render("span", {
      class: "ffe-sc-tag-character"
    }, shipCharacter)))), story.chapters && story.chapters.length > 0 && /* @__PURE__ */ render("span", {
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
      const chapterList = ChapterList({story});
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
    constructor(valueContainer) {
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
          const card = StoryCard({story});
          item.appendChild(card);
          const chapterList = ChapterList({story});
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
    constructor(valueContainer) {
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
        const story = new Story_default(__objSpread(__objSpread({}, followedStory), {
          chapters: []
        }), this.valueContainer);
        const card = StoryCard({story});
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
    constructor(valueContainer) {
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
      const card = StoryCard({story});
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
        this.followsList = new FollowsList_default(this.getValueContainer());
      }
      return this.followsList;
    }
    getStoryListEnhancer() {
      if (!this.storyList) {
        this.storyList = new StoryList_default(this.getValueContainer());
      }
      return this.storyList;
    }
    getStoryProfile() {
      if (!this.storyProfile) {
        this.storyProfile = new StoryProfile_default(this.getValueContainer());
      }
      return this.storyProfile;
    }
    getChapterList() {
      if (!this.chapterList) {
        this.chapterList = new ChapterList_default(this.getValueContainer());
      }
      return this.chapterList;
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
