import Enhancer from "./Enhancer";

import "./StoryText.css";

export default class StoryText implements Enhancer {
  public async enhance(): Promise<any> {
    const textContainer = document.getElementById("storytextp");
    if (!textContainer) {
      throw new Error("Could not find text container element.");
    }

    this.fixUserSelect(textContainer);
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

        // eslint-disable-next-line no-param-reassign
        textContainer.style[rule as any] = "inherit";
      }

      if (isOk) {
        clearTimeout(handle);
      }
    }, 150);
  }
}
