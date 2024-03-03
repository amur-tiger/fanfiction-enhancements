export const enum Page {
  Other,
  User,
  Alerts,
  Favorites,
  Story,
  Chapter,
  OAuth2,
  StoryList,
  UniverseList,
  CommunityList,
}

export function getPage(location: Location): Page {
  if (location.pathname.indexOf("/u/") === 0) {
    return Page.User;
  }

  if (location.pathname.indexOf("/alert/story.php") === 0) {
    return Page.Alerts;
  }

  if (location.pathname.indexOf("/favorites/story.php") === 0) {
    return Page.Favorites;
  }

  if (location.pathname.match(/^\/s\/\d+\/?$/i)) {
    return Page.Story;
  }

  if (location.pathname.indexOf("/s/") === 0) {
    return Page.Chapter;
  }

  if (location.pathname.indexOf("/ffe-oauth2-return") === 0) {
    return Page.OAuth2;
  }

  if (
    location.pathname.match(/^\/(?:anime|book|cartoon|comic|game|misc|play|movie|tv)\/.+$/i) ||
    location.pathname.match(/^\/[^/]+[-_]Crossovers\//i) ||
    location.pathname.indexOf("/community/") === 0
  ) {
    return Page.StoryList;
  }

  if (
    location.pathname.match(/^\/(crossovers\/)?(?:anime|book|cartoon|comic|game|misc|play|movie|tv)\/?$/i) ||
    location.pathname.match(/^\/crossovers\/(.*?)\/(\d+)\/?$/i)
  ) {
    return Page.UniverseList;
  }

  if (
    location.pathname.match(/^\/communities\/(?:anime|book|cartoon|comic|game|misc|play|movie|tv|general)\/([\w\d]+)/i)
  ) {
    return Page.CommunityList;
  }

  return Page.Other;
}

export const environment = {
  currentUserId: typeof userid === "undefined" ? undefined : userid,
  currentUserName: typeof XUNAME === "undefined" || XUNAME === false ? undefined : XUNAME,
  currentStoryId: typeof storyid === "undefined" ? undefined : storyid,
  currentStoryTitle: typeof title === "undefined" ? undefined : decodeURIComponent(title),
  currentStoryTextId: typeof storytextid === "undefined" ? undefined : storytextid,
  currentChapterId: typeof chapter === "undefined" ? undefined : chapter,

  currentPageType: getPage(window.location),

  validRatings: typeof array_censors === "undefined" ? [] : array_censors.slice(1),
  validGenres: typeof array_genres === "undefined" ? [] : array_genres.slice(1),
  validLanguages: typeof array_languages === "undefined" ? [] : array_languages.slice(1),
  validStatus: typeof array_status === "undefined" ? [] : array_status.slice(1),
};
