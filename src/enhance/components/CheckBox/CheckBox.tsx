import type { SmartValue } from "../../../api/SmartValue";

import "./CheckBox.css";

export interface CheckBoxProps {
  bind: SmartValue<boolean>;
}

export default function CheckBox({ bind }: CheckBoxProps) {
  const id = `ffe-check-${parseInt(`${Math.random() * 100000000}`, 10)}`;

  const element = (
    <span class="ffe-checkbox">
      <input
        type="checkbox"
        id={id}
        onChange={(event: Event) => bind.set((event.target as HTMLInputElement)?.checked)}
      />
      <label for={id} />
    </span>
  );

  const apply = (value: boolean | undefined) => {
    const ex = document.getElementById(id);
    if (ex) {
      (ex as HTMLInputElement).checked = value ?? false;
    }
  };

  bind.subscribe(apply);
  bind.get().then(apply);

  return element;
}
