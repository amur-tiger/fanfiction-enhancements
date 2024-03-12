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
  const id = `ffe-button-${parseInt(`${Math.random() * 100000000}`, 10)}`;

  return (
    <span role="button" id={id} class={clsx("btn", { disabled }, className)} title={title} onClick={onClick}>
      {children}
    </span>
  );
}
