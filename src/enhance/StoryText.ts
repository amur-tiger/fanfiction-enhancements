import Enhancer from "./Enhancer";

import "./StoryText.css";

export default class StoryText implements Enhancer {
  /**
   * Not all selectable fonts exist on Google Fonts. Filter out
   * fonts that do not exist, or Google will throw an error.
   */
  private readonly GOOGLE_FONTS_WHITELIST = ["Open Sans", "PT Sans", "Roboto", "Ubuntu"];

  public async enhance(): Promise<void> {
    this.fixFontLink();

    const textContainer = document.getElementById("storytextp");
    if (!textContainer) {
      throw new Error("Could not find text container element.");
    }

    this.fixUserSelect(textContainer);
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
