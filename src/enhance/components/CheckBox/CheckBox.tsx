import "./CheckBox.css";

export interface CheckBoxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function CheckBox({ checked, onChange }: CheckBoxProps) {
  const id = `ffe-check-${parseInt(`${Math.random() * 100000000}`, 10)}`;

  return (
    <span class="ffe-checkbox">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onClick={onChange && ((event: Event) => onChange((event.target as HTMLInputElement).checked))}
      />
      <label for={id} />
    </span>
  );
}
