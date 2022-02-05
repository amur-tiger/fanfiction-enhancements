import clsx from "clsx";
import render from "../../../jsx/render";
import { SmartValue } from "../../../api/SmartValue";
import { Reference } from "../../../jsx";

export interface ButtonProps {
  class?: string;
  label?: string;
  title?: string;
  active?: boolean;
  onClick?: EventListenerOrEventListenerObject;
  bind?: SmartValue<boolean>;
  ref?: Reference<HTMLElement>;
}

export default function Button({ class: className, label, title, active, onClick, bind, ref }: ButtonProps): Element {
  const element: HTMLElement = (
    <span role="button" class={clsx("btn", className)} title={title}>
      {label}
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
