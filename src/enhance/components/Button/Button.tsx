import clsx from "clsx";
import type { SmartValue } from "../../../api/SmartValue";

import "./Button.css";

export interface ButtonProps {
  class?: string;
  title?: string;
  active?: SmartValue<boolean>;
  disabled?: boolean;
  onClick?: EventListenerOrEventListenerObject;
  children?: JSX.Children;
}

export default function Button({ class: className, title, active, disabled, onClick, children }: ButtonProps) {
  const id = `ffe-button-${parseInt(`${Math.random() * 100000000}`, 10)}`;

  const element = (
    <span role="button" id={id} class={clsx("btn", className)} title={title} onClick={onClick}>
      {children}
    </span>
  );

  if (active) {
    active.subscribe((act) => element.classList.toggle("ffe-active", act));
    active.get().then((act) => element.classList.toggle("ffe-active", act));
    element.addEventListener("click", async () => {
      await active.set(!element.classList.contains("ffe-active"));
    });
  }

  return element;
}
