import clsx from "clsx";

import "./Button.css";

export interface ButtonProps {
  class?: string;
  title?: string;
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
  children?: JSX.Children;
}

export default function Button({ class: className, title, disabled, onClick, children }: ButtonProps) {
  return (
    <button class={clsx("btn", { disabled }, className)} title={title} onClick={onClick}>
      {children}
    </button>
  );
}
