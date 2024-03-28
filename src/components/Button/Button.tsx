import clsx from "clsx";

import "./Button.css";

export interface ButtonProps {
  class?: string;
  title?: string;
  disabled?: boolean;
  onClick?: EventListenerOrEventListenerObject;
  children?: JSX.Children;
}

export default function Button({ class: className, title, disabled, onClick, children }: ButtonProps) {
  return (
    <span role="button" class={clsx("btn", { disabled }, className)} title={title} onClick={onClick}>
      {children}
    </span>
  );
}
