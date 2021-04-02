import render from "../../../jsx/render";
import { SmartValue } from "../../../api/SmartValue";

export interface LabelProps {
  bind: SmartValue<string | number>;
}

export default function Label({ bind }: LabelProps): Element {
  const element: HTMLElement = <span class="ffe-label" />;
  const apply = (value: string | number | undefined) => {
    if (typeof value === "number") {
      element.textContent = value.toLocaleString("en");
    } else {
      element.textContent = value ?? null;
    }
  };

  bind.get().then(apply);
  bind.subscribe(apply);

  return element;
}
