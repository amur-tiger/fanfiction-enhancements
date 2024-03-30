import clsx from "clsx";
import type { Story } from "ffn-parser";
import { createSignal } from "../../signal/signal";
import Button from "../Button/Button";
import Rating from "../Rating/Rating";
import { getStory } from "../../api/story";
import Epub, { type CreateProgress } from "../../util/epub";
import { getStoryAlert, getStoryFavorite } from "../../api/follows";
import { toDate } from "../../utils";
import BellIcon from "../../assets/bell.svg";
import CircularProgress from "../CircularProgress/CircularProgress";
import classes from "./StoryCard.css";

export interface StoryCardProps {
  class?: string;
  storyId: number;
}

export default function StoryCard({ class: className, storyId }: StoryCardProps) {
  const story = getStory(storyId)();
  if (!story) {
    return <div class={clsx(classes.container, className)}>loading...</div>;
  }

  const isDownloading = createSignal(false);
  const progress = createSignal<CreateProgress>();

  const hasAlert = getStoryAlert(story.id);
  const isFavorite = getStoryFavorite(story.id);

  const alertOffset = createSignal(0);
  const favoriteOffset = createSignal(0);

  const handleDownloadClick = async () => {
    const link = (element as HTMLElement).querySelector(".ffe-download-link") as HTMLAnchorElement | null;

    if (isDownloading() || !link || !("chapters" in story)) {
      return;
    }

    try {
      isDownloading.set(true);

      const epub = new Epub(story as Story);
      const blob = await epub.create(progress.set);

      link.href = URL.createObjectURL(blob);
      link.download = epub.getFilename();
      link.click();
    } finally {
      isDownloading.set(false);
    }
  };

  const element = (
    <div class={clsx(classes.container, className)}>
      <div class={classes.header}>
        <Rating rating={story.rating} />
        <a href={`/s/${story.id}`} class={classes.title}>
          {story.title}
        </a>
        <span class={classes.by}>by</span>
        <a href={`/u/${story.author.id}`} class={classes.author}>
          {story.author.name}
        </a>

        <div class={classes.mark}>
          <Button
            onClick={handleDownloadClick}
            title={
              isDownloading() ? `Progress: ${Math.round((progress()?.progress ?? 0) * 100)}\u202f%` : "Download as ePub"
            }
            class={classes.downloadButton}
            disabled={isDownloading()}
          >
            {isDownloading() ? (
              <CircularProgress size={20} progress={progress()?.progress} />
            ) : (
              <span class="icon-arrow-down" />
            )}
            {isDownloading() && (
              <span>
                {Math.round((progress()?.progress ?? 0) * 100)}
                {"\u202f"}%
              </span>
            )}
          </Button>
          <a style="display: none" class="ffe-download-link" />

          <div class="btn-group">
            <Button
              class={clsx(classes.alert, { [classes.active]: hasAlert() })}
              title="Toggle Story Alert"
              onClick={() =>
                hasAlert.set((prev) => {
                  alertOffset.set((po) => (prev ? po - 1 : po + 1));
                  return !prev;
                })
              }
            >
              <BellIcon />
              <span class={classes.followCount}>{((story.follows ?? 0) + alertOffset()).toLocaleString("en")}</span>
            </Button>
            <Button
              class={clsx(classes.favorite, "icon-heart", { [classes.active]: isFavorite() })}
              title="Toggle Favorite"
              onClick={() =>
                isFavorite.set((prev) => {
                  favoriteOffset.set((po) => (prev ? po - 1 : po + 1));
                  return !prev;
                })
              }
            >
              <span class={classes.followCount}>
                {((story.favorites ?? 0) + favoriteOffset()).toLocaleString("en")}
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div class={classes.tags}>
        {story.language && <span class={clsx(classes.tag, classes.tagLanguage)}>{story.language}</span>}

        {story.universes &&
          story.universes.map((universe) => <span class={clsx(classes.tag, classes.tagUniverse)}>{universe}</span>)}

        {story.genre && story.genre.map((genre) => <span class={clsx(classes.tag, classes.tagGenre)}>{genre}</span>)}

        {story.characters &&
          story.characters.length > 0 &&
          story.characters.map((pairing) =>
            pairing.length === 1 ? (
              <span class={clsx(classes.tag, classes.tagCharacter)}>{pairing}</span>
            ) : (
              <span class={clsx(classes.tag, classes.tagShip)}>
                {pairing.map((character) => (
                  <span class={clsx(classes.tagCharacter)}>{character}</span>
                ))}
              </span>
            ),
          )}

        {story.chapters && story.chapters.length > 0 && (
          <span class={clsx(classes.tag, classes.tagChapters)}>Chapters:&nbsp;{story.chapters.length}</span>
        )}

        {story.reviews != null && (
          <span class={clsx(classes.tag, classes.tagReviews)}>
            <a href={`/r/${story.id}/`}>Reviews:&nbsp;{story.reviews}</a>
          </span>
        )}
      </div>

      {story.imageUrl && (
        <div class={classes.image}>
          <img src={story.imageUrl} alt="Story Cover" />
        </div>
      )}

      <div class={classes.description}>{story.description}</div>

      <div class={classes.footer}>
        {story.words != null && (
          <div class={classes.footerWords}>
            <strong>{story.words.toLocaleString("en")}</strong> words
          </div>
        )}

        {story.status === "Complete" ? (
          <span class={clsx(classes.footerInfo, classes.footerComplete)}>Complete</span>
        ) : (
          <span class={clsx(classes.footerInfo, classes.footerIncomplete)}>Incomplete</span>
        )}

        {story.published && (
          <span class={classes.footerInfo}>
            <strong>Published:&nbsp;</strong>
            <time dateTime={toDate(story.published).toISOString()}>
              {toDate(story.published).toLocaleDateString("en")}
            </time>
          </span>
        )}

        {story.updated && (
          <span class={classes.footerInfo}>
            <strong>Updated:&nbsp;</strong>
            <time dateTime={toDate(story.updated).toISOString()}>{toDate(story.updated).toLocaleDateString("en")}</time>
          </span>
        )}
      </div>
    </div>
  );

  return element;
}
