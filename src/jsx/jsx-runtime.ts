import { isSmartValue, type SmartValue } from "../api/SmartValue";

type DomElement = Element;

declare global {
  namespace JSX {
    // export type IntrinsicElements = Record<string, unknown>;

    export type ComponentProps = { children?: JSX.Children } & Record<string, unknown>;

    export interface Component<P extends ComponentProps = ComponentProps> {
      (props: P): Element;
    }

    export type Element = DomElement;

    export type Node = Element | SmartValue<string | number> | string | number | boolean | null | undefined;

    export type Children = Node | Children[];
  }
}

interface RenderContext {
  /**
   * The context that is parent to the current context. Undefined if root.
   */
  parent?: RenderContext;

  /**
   * Child contexts of this context.
   */
  children: RenderContext[];

  /**
   * Closes the current context at the end of the render function.
   */
  close(): void;

  /**
   * Disposes of this context and any children. This detaches event listeners and such.
   */
  dispose(): void;

  /**
   * Adds a cleanup function for when the context is disposed.
   * @param dispose
   */
  addDispose(dispose: () => void): void;
}

export function jsx(tag: string | JSX.Component | undefined, props: JSX.ComponentProps): JSX.Element {
  const { children, ...attributes } = props;
  const context = createRenderContext();

  try {
    if (typeof tag === "function") {
      return tag(props);
    }

    if (tag == null) {
      throw new Error("fragment not implemented");
    }

    const flatten = (child: JSX.Children): JSX.Node[] => (Array.isArray(child) ? child.flatMap(flatten) : [child]);
    const childNodes = children != null ? flatten(children) : [];

    // It's possible to re-use elements here, but performance is not a priority for now
    const element = document.createElement(tag);
    applyAttributes(context, element, attributes);

    for (const child of childNodes) {
      if (child == null || typeof child === "boolean") {
        continue;
      }

      if (isSmartValue(child)) {
        const textNode = document.createTextNode("");
        child.get().then((value) => (textNode.textContent = value == null ? "" : (value as string)));
        const subscription = child.subscribe(
          (value) => (textNode.textContent = value == null ? "" : (value as string)),
        );
        context.addDispose(() => child.unsubscribe(subscription));
        element.append(textNode);
      } else {
        element.append(child as never);
      }
    }

    return element;
  } finally {
    context.close();
  }
}

export const jsxs = jsx;

const jsxContextStack: RenderContext[] = [];

function createRenderContext(): RenderContext {
  const parent = jsxContextStack[jsxContextStack.length - 1];
  const context = {
    parent,
    children: [] as RenderContext["children"],
    close() {
      const ret = jsxContextStack.pop();
      if (ret !== context) {
        if (ret) {
          jsxContextStack.push(ret);
        }
        throw new Error("Context already closed.");
      }
    },
    $disposeFn: [] as (() => void)[],
    dispose() {
      for (const dispose of this.$disposeFn) {
        dispose();
      }
      for (const child of this.children) {
        child.dispose();
      }
      if (parent) {
        parent.children = parent.children.filter((child) => child !== context);
      }
    },
    addDispose(dispose: () => void) {
      this.$disposeFn.push(dispose);
    },
  };
  parent?.children.push(context);
  jsxContextStack.push(context);
  return context;
}

function getCurrentRenderContext(): RenderContext {
  const context = jsxContextStack[jsxContextStack.length - 1];
  if (context == null) {
    throw new Error("Not in a context");
  }
  return context;
}

function applyAttributes(context: RenderContext, element: HTMLElement, attributes: Record<string, unknown>) {
  for (const attribute of Array.from(element.attributes)) {
    if (!(attribute.nodeName in attributes)) {
      element.removeAttribute(attribute.nodeName);
    }
  }
  for (const [key, value] of Object.entries(attributes)) {
    if (/^on/.test(key)) {
      const type = key.substring(2).toLowerCase();
      element.addEventListener(type, value as never);
      context.addDispose(() => element.removeEventListener(type, value as never));
    } else if (isSmartValue(value)) {
      value.get().then((value) => {
        if (value == null) {
          element.removeAttribute(key);
        } else {
          element.setAttribute(key, value as string);
        }
      });
      const subscription = value.subscribe((value) => {
        if (value == null) {
          element.removeAttribute(key);
        } else {
          element.setAttribute(key, value as string);
        }
      });
      context.addDispose(() => value.unsubscribe(subscription));
    } else {
      element.setAttribute(key, value as never);
    }
  }
}

export function isElementNode(node: JSX.Node): node is JSX.Element {
  return node != null && typeof node === "object" && !isSmartValue(node);
}
