import { Component } from "../enhance/component";

interface ReactAttrs {
  [key: string]: any;
}

type ReactType<T extends Component> = string | (new (props: ReactAttrs) => T);

export default class React {
  public static createElement<T extends Component>(
    tag: ReactType<T>,
    attrs: ReactAttrs | null,
    ...children: Element[]
  ): Element {
    let element;
    if (typeof tag === "string") {
      element = document.createElement(tag);

      for (const [name, value] of Object.entries(attrs ?? {})) {
        if (typeof value === "function") {
          (element as any)[name as any] = value;
        } else if (value === true) {
          element.setAttribute(name, name);
        } else if (value !== false && value != null) {
          element.setAttribute(name, value.toString());
        }
      }
    } else {
      // eslint-disable-next-line new-cap
      const component = new tag(attrs ?? {});
      element = component.render();
    }

    for (const child of children) {
      if (child) {
        element.appendChild(child.nodeType == null ? document.createTextNode(child.toString()) : child);
      }
    }

    return element;
  }
}
