import clsx from "clsx";
import render from "../../../jsx/render";
import type { Reference } from "../../../jsx/ref";
import type { ChildType } from "../../../jsx/Component";
import type { SmartValue } from "../../../api/SmartValue";

import "./Button.css";

export interface ButtonProps {
  class?: string;
  title?: string;
  active?: boolean;
  onClick?: EventListenerOrEventListenerObject;
  bind?: SmartValue<boolean>;
  ref?: Reference<HTMLElement>;
  children?: ChildType;
}

export default function Button({
  class: className,
  title,
  active,
  onClick,
  bind,
  ref,
  children,
}: ButtonProps): Element {
  const element: HTMLElement = (
    <span role="button" class={clsx("btn", className)} title={title}>
      {children}
    </span>
  );

  if (onClick) {
    element.addEventListener("click", onClick);
  }

  if (active) {
    element.classList.add("ffe-active");
  }

  if (bind) {
    bind.subscribe((act) => element.classList.toggle("ffe-active", act));
    bind.get().then((act) => element.classList.toggle("ffe-active", act));
    element.addEventListener("click", async () => {
      await bind?.set(!element.classList.contains("ffe-active"));
    });
  }

  if (ref) {
    ref.callback(element);
  }

  return element;
}
