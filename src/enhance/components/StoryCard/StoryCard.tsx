import Button from "../Button/Button";
import Rating from "../Rating/Rating";
import type RequestManager from "../../../api/request-manager/RequestManager";
import type Story from "../../../api/Story";
import Epub from "../../../util/epub";
import BellIcon from "../../../assets/bell.svg";

import "./StoryCard.css";

import { SmartValueLocal } from "../../../api/SmartValue";

export interface StoryCardProps {
  requestManager: RequestManager;
  story: Story;
}

const Counter = new SmartValueLocal<number>("test", localStorage);

const CInc = () => {
  Counter.get().then(async (value) => {
    console.log((value ?? 0) + 1);
    await Counter.set((value ?? 0) + 1);
    setTimeout(CInc, 5000);
  });
};

// CInc();

export default function StoryCard({ requestManager, story }: StoryCardProps) {
  let isDownloading = false;

  const handleDownloadClick = async () => {
    const button = element.querySelector(".ffe-download-button");
    const link = element.querySelector(".ffe-download-link") as HTMLAnchorElement | null;

    if (isDownloading || !link || !("chapters" in story)) {
      return;
    }

    try {
      isDownloading = true;
      button?.classList.add("disabled");

      const epub = new Epub(requestManager, story);
      const blob = await epub.create();

      link.href = URL.createObjectURL(blob);
      link.download = epub.getFilename();
      link.click();
    } finally {
      isDownloading = false;
      button?.classList.remove("disabled");
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
          <Button onClick={handleDownloadClick} title="Download as ePub" class="ffe-download-button">
            <span class="icon-arrow-down" />
          </Button>
          <a style="display: none" class="ffe-download-link" />

          <div class="btn-group">
            <Button class="ffe-sc-follow" active={story.alert} title="Toggle Story Alert">
              <BellIcon />
            </Button>
            <Button class="ffe-sc-favorite icon-heart" active={story.favorite} title="Toggle Favorite" />
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

        {story.favorites != null && (
          <span class="ffe-sc-tag ffe-sc-tag-favorites">Favorites:&nbsp;{story.favorites}</span>
        )}

        {story.follows != null && <span class="ffe-sc-tag ffe-sc-tag-follows">Follows:&nbsp;{story.follows}</span>}
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
            <time datetime={story.published.toISOString()}>{story.published.toLocaleDateString("en")}</time>
          </span>
        )}

        {story.updated && (
          <span class="ffe-sc-footer-info">
            <strong>Updated:&nbsp;</strong>
            <time datetime={story.updated.toISOString()}>{story.updated.toLocaleDateString("en")}</time>
          </span>
        )}
      </div>
    </div>
  );

  return element;
}
