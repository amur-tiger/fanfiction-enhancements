export interface FollowedStory {
	id: number;
	title: string;
	author: User;
}

/**
 * @deprecated
 */
export interface User {
	id: number;
	name: string;
	profileUrl: string;
	avatarUrl: string;
}
