import render from "../../../jsx/render";
import Button from "../Button";
import Rating from "../Rating/Rating";
import { RequestManager, Story } from "../../../api";
import { useValueRef } from "../../../jsx";
import { Epub } from "../../../util";
import BellIcon from "../../../assets/bell.svg";

import "./StoryCard.css";

export interface StoryCardProps {
  requestManager: RequestManager;
  story: Story;
}

export default function StoryCard({ requestManager, story }: StoryCardProps): Element {
  const buttonRef = useValueRef<HTMLElement>();
  const linkRef = useValueRef<HTMLAnchorElement>();
  let isDownloading = false;

  const handleDownloadClick = async () => {
    if (isDownloading || !linkRef.current || !("chapters" in story)) {
      return;
    }

    try {
      isDownloading = true;
      buttonRef.current?.classList.add("disabled");

      const epub = new Epub(requestManager, story);
      const blob = await epub.create();

      linkRef.current.href = URL.createObjectURL(blob);
      linkRef.current.download = epub.getFilename();
      linkRef.current.click();
    } finally {
      isDownloading = false;
      buttonRef.current?.classList.remove("disabled");
    }
  };

  return (
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
          <Button onClick={handleDownloadClick} title="Download as ePub" ref={buttonRef}>
            <span class="icon-arrow-down" />
          </Button>
          <a style="display: none" ref={linkRef} />

          <div class="btn-group">
            <Button class="ffe-sc-follow" bind={story.alert} title="Toggle Story Alert">
              <BellIcon />
            </Button>
            <Button class="ffe-sc-favorite icon-heart" bind={story.favorite} title="Toggle Favorite" />
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
            )
          )}

        {story.chapters && story.chapters.length > 0 && (
          <span class="ffe-sc-tag ffe-sc-tag-chapters">Chapters:&nbsp;{story.chapters.length}</span>
        )}

        {story.reviews && (
          <span class="ffe-sc-tag ffe-sc-tag-reviews">
            <a href={`/r/${story.id}/`}>Reviews:&nbsp;{story.reviews}</a>
          </span>
        )}

        {story.favorites && <span class="ffe-sc-tag ffe-sc-tag-favorites">Favorites:&nbsp;{story.favorites}</span>}

        {story.follows && <span class="ffe-sc-tag ffe-sc-tag-follows">Follows:&nbsp;{story.follows}</span>}
      </div>

      {story.imageUrl && (
        <div class="ffe-sc-image">
          <img src={story.imageUrl} alt="Story Cover" />
        </div>
      )}

      <div class="ffe-sc-description">{story.description}</div>

      <div class="ffe-sc-footer">
        {story.words && (
          <div style="float: right;">
            <b>{story.words.toLocaleString("en")}</b> words
          </div>
        )}

        {story.status === "Complete" ? (
          <span class="ffe-sc-footer-info ffe-sc-footer-complete">Complete</span>
        ) : (
          <span class="ffe-sc-footer-info ffe-sc-footer-incomplete">Incomplete</span>
        )}

        {story.published && (
          <span class="ffe-sc-footer-info">
            <b>Published:&nbsp;</b>
            <time datetime={story.published.toISOString()}>{story.published.toLocaleDateString("en")}</time>
          </span>
        )}

        {story.updated && (
          <span class="ffe-sc-footer-info">
            <b>Updated:&nbsp;</b>
            <time datetime={story.updated.toISOString()}>{story.updated.toLocaleDateString("en")}</time>
          </span>
        )}
      </div>
    </div>
  );
}
