import { User } from "./User";

export interface Comment {
	user: User;
	date: Date;
	text: string;
}
