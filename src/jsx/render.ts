import Component, { ChildType, ComponentProps, ComponentType } from "./Component";
import { isReference } from "./ref";

export default function render<T extends ComponentProps>(
  tag: string | Component<T>,
  props: T | null,
  ...children: ChildType[]
): ComponentType {
  const refCallbacks: ((value: unknown) => void)[] = [];
  let element: ComponentType | undefined;
  if (typeof tag === "string") {
    element = document.createElement(tag);

    for (const [name, value] of Object.entries(props ?? {})) {
      if (name === "ref") {
        if (isReference(value)) {
          refCallbacks.push(value.callback);
        }
      } else if (typeof value === "function") {
        (element as any)[name as any] = value;
      } else if (value === true) {
        element.setAttribute(name, name);
      } else if (value !== false && value != null) {
        element.setAttribute(name, (value as any).toString());
      }
    }
  } else {
    element = tag(props as T);
  }

  if (element instanceof Element) {
    const append = (child: ChildType) => {
      if (child == null) {
        return;
      }

      if (Array.isArray(child)) {
        child.forEach(append);
      } else {
        (element as Element).appendChild(
          typeof child === "string" || typeof child === "number" || child.nodeType == null
            ? document.createTextNode(child.toString())
            : child
        );
      }
    };

    children.forEach(append);
  }

  refCallbacks.forEach((callback) => callback(element));

  return element;
}
