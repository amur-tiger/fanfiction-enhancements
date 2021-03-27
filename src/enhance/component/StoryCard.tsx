import React from "../../util/react";
import { Button } from "./common";
import Component from "./Component";
import Rating from "./Rating";
import { Story } from "../../api";

import "./StoryCard.css";

export default class StoryCard implements Component {
  constructor(private props: { story: Story }) {}

  public render(): HTMLElement {
    const { story } = this.props;
    const element = document.createElement("div") as HTMLDivElement;
    element.className = "ffe-sc";

    this.addHeader(element, story);
    this.addTags(element, story);
    this.addImage(element, story);
    this.addDescription(element, story);
    this.addFooter(element, story);

    return element;
  }

  private addHeader(element: HTMLDivElement, story: Story): void {
    const header = (
      <div class="ffe-sc-header">
        <Rating rating={story.rating} />
        <a href={`/s/${story.id}`} class="ffe-sc-title">
          {story.title}
        </a>
        <span class="ffe-sc-by">by</span>
        <a href={`/u/${story.author ? story.author.id : ""}`} class="ffe-sc-author">
          {story.author ? story.author.name : "?"}
        </a>

        <div class="ffe-sc-mark btn-group">
          <Button class="ffe-sc-follow icon-bookmark-2" bind={story.alert} />
          <Button class="ffe-sc-favorite icon-heart" bind={story.favorite} />
        </div>
      </div>
    );

    element.appendChild(header);
  }

  private addImage(element: HTMLDivElement, story: Story) {
    if (!story.imageUrl) {
      return;
    }

    const imageContainer = document.createElement("div");
    imageContainer.className = "ffe-sc-image";

    const image = document.createElement("img");
    if (story.imageOriginalUrl) {
      const imageUrlReplacer = () => {
        image.removeEventListener("error", imageUrlReplacer);
        image.src = story.imageUrl as string;
      };

      image.addEventListener("error", imageUrlReplacer);
      image.src = story.imageOriginalUrl;
    } else {
      image.src = story.imageUrl;
    }
    imageContainer.appendChild(image);

    element.appendChild(imageContainer);
  }

  private addDescription(element: HTMLDivElement, story: Story) {
    const description = <div class="ffe-sc-description">{story.description}</div>;

    element.appendChild(description);
  }

  private addTags(element: HTMLDivElement, story: Story) {
    const tags: HTMLElement = <div class="ffe-sc-tags" />;

    if (story.language) {
      tags.appendChild(<span class="ffe-sc-tag ffe-sc-tag-language">{story.language}</span>);
    }

    if (story.universes) {
      for (const universe of story.universes) {
        tags.appendChild(<span class="ffe-sc-tag ffe-sc-tag-universe">{universe}</span>);
      }
    }

    if (story.genre) {
      for (const genre of story.genre) {
        tags.appendChild(<span class="ffe-sc-tag ffe-sc-tag-genre">{genre}</span>);
      }
    }

    if (story.characters && story.characters.length) {
      for (const character of story.characters) {
        if (typeof character === "string") {
          tags.appendChild(<span class="ffe-sc-tag ffe-sc-tag-character">{character}</span>);
        } else {
          const ship: HTMLElement = <span class="ffe-sc-tag ffe-sc-tag-ship" />;
          for (const shipCharacter of character) {
            ship.appendChild(<span class="ffe-sc-tag-character">{shipCharacter}</span>);
          }

          tags.appendChild(ship);
        }
      }
    }

    if (story.chapters && story.chapters.length > 1) {
      tags.appendChild(<span class="ffe-sc-tag ffe-sc-tag-chapters">Chapters:&nbsp;{story.chapters.length}</span>);
    }

    if (story.reviews) {
      tags.appendChild(
        <span class="ffe-sc-tag ffe-sc-tag-reviews">
          <a href={`/r/${story.id}/`}>Reviews:&nbsp;{story.reviews}</a>
        </span>
      );
    }

    if (story.favorites) {
      tags.appendChild(<span class="ffe-sc-tag ffe-sc-tag-favorites">Favorites:&nbsp;{story.favorites}</span>);
    }

    if (story.follows) {
      tags.appendChild(<span class="ffe-sc-tag ffe-sc-tag-follows">Follows:&nbsp;{story.follows}</span>);
    }

    element.appendChild(tags);
  }

  private addFooter(element: HTMLDivElement, story: Story) {
    const footer: HTMLElement = <div class="ffe-sc-footer">&nbsp;</div>;

    if (story.words) {
      const words = (
        <div style="float: right;">
          <b>{story.words.toLocaleString("en")}</b> words
        </div>
      );

      footer.appendChild(words);
    }

    const status = <span class="ffe-sc-footer-info" />;
    if (story.status === "Complete") {
      status.classList.add("ffe-sc-footer-complete");
      status.textContent = "Complete";
    } else {
      status.classList.add("ffe-sc-footer-incomplete");
      status.textContent = "Incomplete";
    }
    footer.appendChild(status);

    if (story.published) {
      const published = (
        <span class="ffe-sc-footer-info">
          <b>Published:</b>&nbsp;
          <time datetime={story.published.toISOString()}>{story.published.toLocaleDateString("en")}</time>
        </span>
      );

      footer.appendChild(published);
    }

    if (story.updated) {
      const updated = (
        <span class="ffe-sc-footer-info">
          <b>Updated:</b>&nbsp;
          <time datetime={story.updated.toISOString()}>{story.updated.toLocaleDateString("en")}</time>
        </span>
      );

      footer.appendChild(updated);
    }

    element.appendChild(footer);
  }
}
