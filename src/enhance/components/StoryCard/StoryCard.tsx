import render from "../../../jsx/render";
import Button from "../Button";
import Rating from "../Rating/Rating";
import { Story } from "../../../api";

import "./StoryCard.css";

export interface StoryCardProps {
  story: Story;
}

export default function StoryCard({ story }: StoryCardProps): Element {
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

        <div class="ffe-sc-mark btn-group">
          <Button class="ffe-sc-follow icon-bookmark-2" bind={story.alert} />
          <Button class="ffe-sc-favorite icon-heart" bind={story.favorite} />
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
