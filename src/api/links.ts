import { Chapter, Follow, Story, User } from "ffn-parser";

export enum SortOption {
  UpdateDate = 1,
  PublishDate = 2,
  Reviews = 3,
  Favorites = 4,
  Follows = 5,
}

export enum TimeRangeOption {
  All = 0,
  Update24h = 1,
  Update7d = 2,
  Update1m = 3,
  Update6m = 4,
  Update1y = 5,
  Publish24h = 11,
  Publish7d = 12,
  Publish1m = 13,
  Publish6m = 14,
  Publish1y = 15,
}

export enum GenreOption {
  All = 0,
  Adventure = 6,
  Angst = 10,
  Drama = 4,
  Fantasy = 14,
  Friendship = 21,
  General = 1,
  Humor = 3,
  HurtComfort = 20,
  Mystery = 7,
  Romance = 2,
  SciFi = 13,
  Supernatural = 11,
  Suspense = 12,
  Tragedy = 16,
}

export enum RatingOption {
  All = 10,
  KT = 103,
  KKp = 102,
  K = 1,
  Kp = 2,
  T = 3,
  M = 4,
}

export enum WordCountOption {
  All = 0,
  Lt1k = 11,
  Lt5k = 51,
  Gt1k = 1,
  Gt5k = 5,
  Gt10k = 10,
  Gt20k = 20,
  Gt40k = 40,
  Gt60k = 60,
  Gt100k = 100,
}

export enum StatusOption {
  All = 0,
  InProgress = 1,
  Complete = 2,
}

export interface LinkOptions {
  sort?: SortOption;
  timeRange?: TimeRangeOption;
  genre1?: GenreOption;
  genre2?: GenreOption;
  rating?: RatingOption;
  length?: WordCountOption;
  isPairing?: boolean;

  exceptGenre?: GenreOption;
  exceptIsPairing?: boolean;
}

export function createLink(link: string, options?: LinkOptions): string {
  const args: string[] = [];

  if (typeof options?.sort !== "undefined") {
    args.push(`srt=${options.sort}`);
  }
  if (typeof options?.timeRange !== "undefined") {
    args.push(`t=${options.sort}`);
  }
  if (typeof options?.genre1 !== "undefined") {
    args.push(`g1=${options.genre1}`);
  }
  if (typeof options?.genre2 !== "undefined") {
    args.push(`g2=${options.genre2}`);
  }
  if (typeof options?.rating !== "undefined") {
    args.push(`r=${options.rating}`);
  }
  if (typeof options?.length !== "undefined") {
    args.push(`len=${options.length}`);
  }
  if (options?.isPairing) {
    args.push(`pm=1`);
  }
  if (typeof options?.exceptGenre !== "undefined") {
    args.push(`_g1=${options.exceptGenre}`);
  }
  if (options?.exceptIsPairing) {
    args.push(`_pm=1`);
  }

  return `${link}?${args.join("&")}`;
}

export const FFN_BASE_URL = "//fanfiction.net";

function slug(str: string): string {
  return str.replace(/\W+/g, "-");
}

export function createStoryLink(story: number | Story | Follow): string {
  let link = `${FFN_BASE_URL}/s/${typeof story === "number" ? story : story.id}`;
  if (typeof story !== "number") {
    link += `/${slug(story.title)}`;
  }
  return link;
}

export function createChapterLink(story: number, chapter: number): string;
export function createChapterLink(story: Story, chapter: Chapter): string;
export function createChapterLink(story: number | Story, chapter: number | Chapter): string {
  let link = `${FFN_BASE_URL}/s/${typeof story === "number" ? story : story.id}/${
    typeof chapter === "number" ? chapter : chapter.id
  }`;
  if (typeof story !== "number") {
    link += `/${slug(story.title)}`;
    if (typeof chapter !== "number") {
      link += `/${slug(chapter.title)}`;
    }
  }
  return link;
}

export function createReviewsLink(story: Story | Follow): string;
export function createReviewsLink(story: Story, chapter: Chapter): string;
export function createReviewsLink(story: Story | Follow, chapter?: Chapter): string {
  return `${FFN_BASE_URL}/r/${story.id}/${chapter?.id ?? 0}/${slug(story.title)}${
    chapter ? `/${slug(chapter.title)}` : ""
  }`;
}

export function createAuthorLink(author: User): string {
  return `${FFN_BASE_URL}/u/${author.id}/${slug(author.name)}`;
}
