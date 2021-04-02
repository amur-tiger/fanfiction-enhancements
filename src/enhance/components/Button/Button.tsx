import render from "../../../jsx/render";
import { SmartValue } from "../../../api/SmartValue";

export interface ButtonProps {
  class?: string;
  text?: string;
  active?: boolean;
  onClick?: EventListenerOrEventListenerObject;
  bind?: SmartValue<boolean>;
}

export default function Button({ class: className, text, active, onClick, bind }: ButtonProps): Element {
  const element: HTMLElement = <span class={`btn ${className}`}>{text}</span>;

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

  return element;
}
