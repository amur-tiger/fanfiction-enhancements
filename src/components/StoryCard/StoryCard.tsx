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
import "./StoryCard.css";
import CircularProgress from "../CircularProgress/CircularProgress";

export interface StoryCardProps {
  storyId: number;
}

export default function StoryCard({ storyId }: StoryCardProps) {
  const story = getStory(storyId)();
  if (!story) {
    return <div class="ffe-sc">loading...</div>;
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
    <div class="ffe-sc">
      <div class="ffe-sc-header">
        <Rating rating={story.rating} />
        <a href={`/s/${story.id}`} class="ffe-sc-title">
          {story.title}
        </a>
        <span class="ffe-sc-by">by</span>
        <a href={`/u/${story.author.id}`} class="ffe-sc-author">
          {story.author.name}
        </a>

        <div class="ffe-sc-mark">
          <Button
            onClick={handleDownloadClick}
            title={
              isDownloading() ? `Progress: ${Math.round((progress()?.progress ?? 0) * 100)}\u202f%` : "Download as ePub"
            }
            class="ffe-sc-download-button"
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
              class={clsx("ffe-sc-alert", { "ffe-active": hasAlert() })}
              title="Toggle Story Alert"
              onClick={() =>
                hasAlert.set((prev) => {
                  alertOffset.set((po) => (prev ? po - 1 : po + 1));
                  return !prev;
                })
              }
            >
              <BellIcon />
              <span class="ffe-sc-follow-count">{((story.follows ?? 0) + alertOffset()).toLocaleString("en")}</span>
            </Button>
            <Button
              class={clsx("ffe-sc-favorite icon-heart", { "ffe-active": isFavorite() })}
              title="Toggle Favorite"
              onClick={() =>
                isFavorite.set((prev) => {
                  favoriteOffset.set((po) => (prev ? po - 1 : po + 1));
                  return !prev;
                })
              }
            >
              <span class="ffe-sc-follow-count">
                {((story.favorites ?? 0) + favoriteOffset()).toLocaleString("en")}
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div class="ffe-sc-tags">
        {story.language && <span class="ffe-sc-tag ffe-sc-tag-language">{story.language}</span>}

        {story.universes &&
          story.universes.map((universe) => <span class="ffe-sc-tag ffe-sc-tag-universe">{universe}</span>)}

        {story.genre && story.genre.map((genre) => <span class="ffe-sc-tag ffe-sc-tag-genre">{genre}</span>)}

        {story.characters &&
          story.characters.length > 0 &&
          story.characters.map((pairing) =>
            pairing.length === 1 ? (
              <span class="ffe-sc-tag ffe-sc-tag-character">{pairing}</span>
            ) : (
              <span class="ffe-sc-tag ffe-sc-tag-ship">
                {pairing.map((character) => (
                  <span class="ffe-sc-tag-character">{character}</span>
                ))}
              </span>
            ),
          )}

        {story.chapters && story.chapters.length > 0 && (
          <span class="ffe-sc-tag ffe-sc-tag-chapters">Chapters:&nbsp;{story.chapters.length}</span>
        )}

        {story.reviews != null && (
          <span class="ffe-sc-tag ffe-sc-tag-reviews">
            <a href={`/r/${story.id}/`}>Reviews:&nbsp;{story.reviews}</a>
          </span>
        )}
      </div>

      {story.imageUrl && (
        <div class="ffe-sc-image">
          <img src={story.imageUrl} alt="Story Cover" />
        </div>
      )}

      <div class="ffe-sc-description">{story.description}</div>

      <div class="ffe-sc-footer">
        {story.words != null && (
          <div class="ffe-sc-footer-words">
            <strong>{story.words.toLocaleString("en")}</strong> words
          </div>
        )}

        {story.status === "Complete" ? (
          <span class="ffe-sc-footer-info ffe-sc-footer-complete">Complete</span>
        ) : (
          <span class="ffe-sc-footer-info ffe-sc-footer-incomplete">Incomplete</span>
        )}

        {story.published && (
          <span class="ffe-sc-footer-info">
            <strong>Published:&nbsp;</strong>
            <time dateTime={toDate(story.published).toISOString()}>
              {toDate(story.published).toLocaleDateString("en")}
            </time>
          </span>
        )}

        {story.updated && (
          <span class="ffe-sc-footer-info">
            <strong>Updated:&nbsp;</strong>
            <time dateTime={toDate(story.updated).toISOString()}>{toDate(story.updated).toLocaleDateString("en")}</time>
          </span>
        )}
      </div>
    </div>
  );

  return element;
}
