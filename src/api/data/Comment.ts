import User from "./User";

export default interface Comment {
	user: User;
	date: Date;
	text: string;
}
