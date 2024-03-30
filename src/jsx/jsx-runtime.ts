import { onDispose } from "../signal/scope";
import { isSignal } from "../signal/signal";
import effect from "../signal/effect";

declare global {
  namespace JSX {
    type PropertyName<K> = K extends "className"
      ? "class"
      : K extends "htmlFor"
        ? "for"
        : K extends `on${infer E}`
          ? `on${Capitalize<E>}`
          : K;

    type PropertyType<T, K extends keyof T> = K extends "style"
      ? string
      : K extends "children"
        ? JSX.Children
        : T[K] extends SVGAnimatedString
          ? string
          : T[K] extends SVGAnimatedLength
            ? string | number
            : T[K] extends SVGAnimatedRect
              ? string
              : T[K];

    export type IntrinsicElements = {
      [Tag in keyof HTMLElementTagNameMap]: {
        [K in keyof HTMLElementTagNameMap[Tag] as PropertyName<K>]?: PropertyType<HTMLElementTagNameMap[Tag], K>;
      };
    } & {
      [Tag in keyof SVGElementTagNameMap]: {
        [K in keyof SVGElementTagNameMap[Tag] as PropertyName<K>]?: PropertyType<SVGElementTagNameMap[Tag], K>;
      };
    };

    export type ComponentProps = { children?: JSX.Children } & Record<string, unknown>;

    export interface Component<P extends ComponentProps = ComponentProps> {
      (props: P): Element;
    }

    export type Element = ChildNode | DocumentFragment;

    export type Node = Element | string | number | boolean | null | undefined;

    export type Children = Node | Children[];
  }
}

export function toChildArray(children: JSX.Children | null | undefined): JSX.Node[] {
  if (children == null) {
    return [];
  }

  const flatten = (child: JSX.Children): JSX.Node[] => (Array.isArray(child) ? child.flatMap(flatten) : [child]);

  return flatten(children);
}

export function jsx<K extends keyof HTMLElementTagNameMap>(tag: K, props: JSX.ComponentProps): HTMLElementTagNameMap[K];
export function jsx(tag: string | JSX.Component, props: JSX.ComponentProps): JSX.Element;

export function jsx(tag: string | JSX.Component, props: JSX.ComponentProps): JSX.Element {
  const { children, ...attributes } = props;

  if (typeof tag === "function") {
    return tag(props);
  }

  let element;
  if ("xmlns" in attributes) {
    element = document.createElementNS(attributes.xmlns as string, tag);
  } else if (svgTagNames.includes(tag)) {
    element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  } else {
    element = document.createElement(tag);
  }

  applyAttributes(element, attributes);

  for (const child of toChildArray(children)) {
    if (child != null && typeof child !== "boolean") {
      element.append(child as never);
    }
  }

  return element;
}

// noinspection JSUnusedGlobalSymbols
export const jsxs = jsx;

function applyAttributes(element: Element, attributes: Record<string, unknown>) {
  for (const attribute of Array.from(element.attributes)) {
    if (!(attribute.nodeName in attributes)) {
      element.removeAttribute(attribute.nodeName);
    }
  }
  for (const [key, value] of Object.entries(attributes)) {
    applyAttribute(element, key, value);
  }
}

function applyAttribute(element: Element, key: string, value: unknown) {
  if (/^on/.test(key)) {
    if (typeof value === "function") {
      const type = key.substring(2).toLowerCase();
      element.addEventListener(type, value as never);
      onDispose(() => element.removeEventListener(type, value as never));
    }
  } else if (isSignal(value)) {
    effect(() => {
      applyAttribute(element, key, value());
    });
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

export const svgTagNames = [
  "circle",
  "clipPath",
  "color-profile",
  "cursor",
  "defs",
  "desc",
  "discard",
  "ellipse",
  "filter",
  "g",
  "line",
  "linearGradient",
  "mask",
  "mpath",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "solidColor",
  "svg",
  "text",
  "textArea",
  "textPath",
  "title",
];

const fragmentRegister = new WeakMap<DocumentFragment, ChildNode[]>();

interface FragmentProps {
  children: JSX.Children;
}

export const Fragment = Object.assign(
  function Fragment({ children }: FragmentProps) {
    const element = document.createDocumentFragment();

    for (const child of toChildArray(children)) {
      if (child != null && typeof child !== "boolean") {
        element.append(child as never);
      }
    }

    if (element.childNodes.length === 0) {
      element.append(document.createComment("fragment"));
    }

    fragmentRegister.set(element, Array.from(element.childNodes));

    return element;
  },
  {
    replace(fragment: DocumentFragment, next: DocumentFragment) {
      const list = fragmentRegister.get(fragment);
      if (list == null || list.length === 0) {
        throw new Error("Given fragment does not exist or is empty.");
      }

      for (let i = 1; i < list.length; i++) {
        list[i].remove();
      }

      list[0].replaceWith(next);
    },
  },
);
