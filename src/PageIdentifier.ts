export default class PageIdentifier {
	constructor(private location: Location) { }

	public getPage(): Page {
		if (this.location.pathname.indexOf("/u/") == 0) {
			return Page.User;
		}

		if (this.location.pathname.indexOf("/s/") == 0) {
			return Page.Chapter;
		}

		return Page.Other;
	}
}

export const enum Page {
	Other,
	User,
	Chapter,
}
