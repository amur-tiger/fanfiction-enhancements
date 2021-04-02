import render from "../../../jsx/render";
import { SmartValue } from "../../../api/SmartValue";

import "./CheckBox.css";

export interface CheckBoxProps {
  bind: SmartValue<boolean>;
}

export default function CheckBox({ bind }: CheckBoxProps): Element {
  const id = `ffe-check-${parseInt(`${Math.random() * 100000000}`, 10)}`;

  const element: HTMLElement = (
    <span class="ffe-checkbox">
      <input type="checkbox" id={id} />
      <label for={id} />
    </span>
  );

  const apply = (value: boolean | undefined) => {
    (element.firstElementChild as HTMLInputElement).checked = value ?? false;
  };

  bind.subscribe(apply);
  bind.get().then(apply);
  element.firstElementChild?.addEventListener("change", async () => {
    await bind.set((element.firstElementChild as HTMLInputElement).checked);
  });

  return element;
}
