import RenderContext from "@jsx/RenderContext";

type DomElement = Element;

declare global {
  namespace JSX {
    // export type IntrinsicElements = Record<string, unknown>;

    export type ComponentProps = { children?: JSX.Children } & Record<string, unknown>;

    export interface Component<P extends ComponentProps = ComponentProps> {
      (props: P): Element;
    }

    export type Element = DomElement;

    export type Node = Element | string | number | boolean | null | undefined;

    export type Children = Node | Children[];
  }
}

export function jsx(tag: string | JSX.Component | undefined, props: JSX.ComponentProps): JSX.Element {
  const { children, ...attributes } = props;

  if (typeof tag === "function") {
    const context = RenderContext.create();
    return context.render(() => tag(props));
  }

  if (tag == null) {
    throw new Error("Fragment is not supported");
  }

  const element = document.createElement(tag);
  applyAttributes(element, attributes);

  const flatten = (child: JSX.Children): JSX.Node[] => (Array.isArray(child) ? child.flatMap(flatten) : [child]);
  const childNodes = children != null ? flatten(children) : [];

  for (const child of childNodes) {
    if (child != null && typeof child !== "boolean") {
      element.append(child as never);
    }
  }

  return element;
}

// noinspection JSUnusedGlobalSymbols
export const jsxs = jsx;

function applyAttributes(element: HTMLElement, attributes: Record<string, unknown>) {
  for (const attribute of Array.from(element.attributes)) {
    if (!(attribute.nodeName in attributes)) {
      element.removeAttribute(attribute.nodeName);
    }
  }
  for (const [key, value] of Object.entries(attributes)) {
    if (/^on/.test(key)) {
      if (value != null) {
        const type = key.substring(2).toLowerCase();
        element.addEventListener(type, value as never);
        RenderContext.getCurrent().onDispose(() => element.removeEventListener(type, value as never));
      }
    } else if (typeof value === "boolean") {
      if (value) {
        element.setAttribute(key, key);
      } else {
        element.removeAttribute(key);
      }
    } else if (value != null) {
      element.setAttribute(key, value as never);
    } else {
      element.removeAttribute(key);
    }
  }
}
