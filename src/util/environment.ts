export const enum Page {
	Other,
	User,
	Alerts,
	Favorites,
	Story,
	Chapter,
	OAuth2,
	StoryList,
}

export const environment = {
	currentUserId: typeof userid === "undefined" ? undefined : userid,
	currentUserName: typeof XUNAME === "undefined" || XUNAME === false ? undefined : XUNAME,
	currentStoryId: typeof storyid === "undefined" ? undefined : storyid,
	currentStoryTitle: typeof title === "undefined" ? undefined : decodeURIComponent(title),
	currentStoryTextId: typeof storytextid === "undefined" ? undefined : storytextid,
	currentChapterId: typeof chapter === "undefined" ? undefined : chapter,

	currentPageType: getPage(location),

	validRatings: typeof array_censors === "undefined" ? [] : array_censors.slice(1),
	validGenres: typeof array_genres === "undefined" ? [] : array_genres.slice(1),
	validLanguages: typeof array_languages === "undefined" ? [] : array_languages.slice(1),
	validStatus: typeof array_status === "undefined" ? [] : array_status.slice(1),
};

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

	if (location.pathname.match(/^\/(?:anime|book|cartoon|comic|game|misc|play|movie|tv)\/.+$/i) ||
		location.pathname.match(/^\/[^\/]+-Crossovers\//i) ||
		location.pathname.indexOf("/community/") === 0) {
		return Page.StoryList;
	}

	return Page.Other;
}
