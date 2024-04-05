import { parseStory } from "ffn-parser";
import type Enhancer from "../Enhancer";
import { environment, Page } from "../../util/environment";
import getChapterRead from "../../api/chapter-read";
import { uploadMetadata } from "../../sync/sync";
import StoryTextHeader from "../../components/StoryTextHeader/StoryTextHeader";
import "./StoryText.css";

export default class StoryText implements Enhancer {
  /**
   * Not all selectable fonts exist on Google Fonts. Filter out
   * fonts that do not exist, or Google will throw an error.
   */
  private readonly GOOGLE_FONTS_WHITELIST = ["Open Sans", "PT Sans", "Roboto", "Ubuntu"];

  public canEnhance(type: Page): boolean {
    return type === Page.Chapter;
  }

  public async enhance(): Promise<void> {
    this.fixFontLink();

    const textContainer = document.getElementById("storytextp");
    if (!textContainer) {
      throw new Error("Could not find text container element.");
    }

    this.fixUserSelect(textContainer);
    await this.autoMarkRead();

    const controls = document.querySelectorAll(".lc-wrapper")?.[1];
    const chapterSelect = controls?.nextElementSibling;

    if (controls && chapterSelect) {
      const story = await parseStory();
      const chapter = story?.chapters.find((chapter) => chapter.id === environment.currentChapterId);

      controls.replaceWith(<StoryTextHeader title={chapter?.title}>{chapterSelect}</StoryTextHeader>);
    }
  }

  private async autoMarkRead() {
    const currentStory = await parseStory();
    if (!currentStory || !environment.currentChapterId) {
      return;
    }

    const isRead = getChapterRead(currentStory.id, environment.currentChapterId);
    const markRead = async () => {
      const amount = document.documentElement.scrollTop;
      const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;

      if (amount / (max - 550) >= 1) {
        window.removeEventListener("scroll", markRead);
        console.log(
          "Setting '%s' chapter '%s' to read",
          currentStory.title,
          currentStory.chapters.find((c) => c.id === environment.currentChapterId)?.title,
        );
        isRead.set(true);
        await uploadMetadata();
      }
    };
    window.addEventListener("scroll", markRead);
  }

  private fixFontLink() {
    const replace = (link?: HTMLLinkElement) => {
      if (!link) {
        const links = Array.from(document.head.querySelectorAll("link"));
        link = links.find((l) => l.href.includes("fonts.googleapis.com"));
      }

      if (!link) {
        return false;
      }

      const href = new URL(link.href);
      const search = new URLSearchParams(href.search);
      const families = search
        .get("family")
        ?.split("|")
        .filter((f) => this.GOOGLE_FONTS_WHITELIST.includes(f));
      if (families) {
        search.set("family", families.join("|"));
      }
      href.search = search.toString();
      link.href = href.toString();
      return true;
    };

    if (replace()) {
      return;
    }

    // The font links are added asynchronously by fanfiction, and may or may not already be loaded. A
    // MutationObserver may be necessary to listen to when the link is added if it wasn't already.
    const observer = new MutationObserver((list) => {
      for (const record of list) {
        if (record.type !== "childList") {
          continue;
        }

        for (const node of Array.from(record.addedNodes)) {
          if (!(node instanceof Element) || node.tagName !== "LINK") {
            continue;
          }

          replace();
          observer.disconnect();
        }
      }
    });
    observer.observe(document.head, { childList: true });
  }

  private fixUserSelect(textContainer: HTMLElement) {
    const handle = setInterval(() => {
      const rules = [
        "userSelect",
        "msUserSelect",
        "mozUserSelect",
        "khtmlUserSelect",
        "webkitUserSelect",
        "webkitTouchCallout",
      ];

      let isOk = true;
      for (const rule of rules) {
        if (textContainer.style[rule as keyof CSSStyleDeclaration] !== "inherit") {
          isOk = false;
        }

        (textContainer.style as unknown as Record<string, string>)[rule] = "inherit";
      }

      if (isOk) {
        clearTimeout(handle);
      }
    }, 150);
  }
}
