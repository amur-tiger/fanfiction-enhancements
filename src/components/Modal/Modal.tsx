import effect from "../../signal/effect";

export interface PopupProps {
  open?: boolean;
  onClose?: () => void;
  backdrop?: boolean;
  children?: JSX.Children;
}

const persistentModalContainer = (<div class="modal fade hide" />) as HTMLDivElement;
document.body.append(persistentModalContainer);

export default function Modal({ open, onClose, backdrop = false, children }: PopupProps) {
  $(persistentModalContainer).data({ backdrop });

  effect(() => {
    if (children) {
      persistentModalContainer.appendChild(<>{children}</>);
    }
    return () => persistentModalContainer.replaceChildren();
  });

  if (onClose) {
    effect(() => {
      $(persistentModalContainer).on("hide", onClose);
      return () => $(persistentModalContainer).off("hide");
    });
  }

  if (open) {
    $(persistentModalContainer).modal("show");
  } else {
    $(persistentModalContainer).modal("hide");
  }

  return null;
}

declare global {
  interface JQuery {
    modal(operation: "show" | "hide"): void;
  }
}
