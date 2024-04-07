import { createSignal } from "../../signal/signal";
import effect from "../../signal/effect";
import Modal from "../Modal/Modal";
import { getCookie } from "../../utils";
import classes from "./StoryTextHeader.css";

export interface StoryTextHeaderProps {
  title?: string;
  children?: JSX.Children;
}

export default function StoryTextHeader({ title, children }: StoryTextHeaderProps) {
  const isOpen = createSignal(false);

  const fontFamily = createSignal(XCOOKIE.read_font);
  const fontSize = createSignal(+XCOOKIE.read_font_size);
  const lineHeight = createSignal(+XCOOKIE.read_line_height);
  const width = createSignal(+XCOOKIE.read_width);
  const paragraph = createSignal(XCOOKIE.read_paragraph);
  const textAlign = createSignal(XCOOKIE.read_align);

  effect(() => {
    (document.querySelector("#storytext") as HTMLElement).style.fontFamily = fontFamily();
    XCOOKIE.read_font = fontFamily();
    _fontastic_save();
  });

  effect(() => {
    (document.querySelector("#storytext") as HTMLElement).style.fontSize = `${fontSize()}em`;
    XCOOKIE.read_font_size = fontSize();
    _fontastic_save();
  });

  effect(() => {
    (document.querySelector("#storytext") as HTMLElement).style.lineHeight = `${lineHeight()}`;
    XCOOKIE.read_line_height = lineHeight();
    _fontastic_save();
  });

  effect(() => {
    (document.querySelector("#storytext") as HTMLElement).style.width = `${width()}%`;
    XCOOKIE.read_width = width();
    _fontastic_save();
  });

  effect(() => {
    const text = document.querySelector("#storytext") as HTMLElement;
    text.classList.toggle(classes.indent, paragraph() !== "space");
    text.classList.toggle(classes.noSpace, paragraph() === "indent");
    XCOOKIE.read_paragraph = paragraph();
    _fontastic_save();
  });

  effect(() => {
    (document.querySelector("#storytext") as HTMLElement).classList.toggle(classes.justify, textAlign() === "justify");
    XCOOKIE.read_align = textAlign();
    _fontastic_save();
  });

  return (
    <div class={classes.header}>
      <div>
        <button class="btn icon-tl-text" onClick={() => isOpen.set(true)}>
          &nbsp;Formatting
        </button>
      </div>

      <h2 class={classes.caption}>{title}</h2>

      <div>{children}</div>

      <Modal open={isOpen()} onClose={() => isOpen.set(false)}>
        <div class="modal-header">
          <span class="icon-tl-text" />
          &nbsp;Formatting
        </div>

        <div class="modal-body">
          <div class={classes.setting}>
            <span class={classes.lineLabel}>Font Family:</span>

            <select
              value={fontFamily()}
              onChange={(event) => fontFamily.set((event.target as HTMLSelectElement).value)}
            >
              <optgroup label="Serif">
                <option value="Georgia">Georgia</option>
                <option value="Palatino">Palatino</option>
                <option value="Times New Roman">Times New Roman</option>
              </optgroup>

              <optgroup label="Sans-Serif">
                <option value="Arial">Arial</option>
                <option value="Droid Sans">Droid Sans</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Open Sans">Open Sans</option>
                <option value="PT Sans">PT Sans</option>
                <option value="Roboto">Roboto</option>
                <option value="Ubuntu">Ubuntu</option>
              </optgroup>
            </select>
          </div>

          <div class={classes.setting}>
            <span class={classes.lineLabel}>Font Size:</span>

            <input
              type="range"
              aria-label="Font Size"
              value={toPercent(fontSize(), 0.1, 3)}
              onInput={(event) => fontSize.set(fromPercent(event, 0.1, 3))}
            />

            <span class={classes.lineValue}>{fontSize().toFixed(2)}em</span>
          </div>

          <div class={classes.setting}>
            <span class={classes.lineLabel}>Line Height:</span>

            <input
              type="range"
              aria-label="Line Height"
              value={toPercent(lineHeight(), 1, 3)}
              onInput={(event) => lineHeight.set(fromPercent(event, 1, 3))}
            />

            <span class={classes.lineValue}>{lineHeight().toFixed(2)}</span>
          </div>

          <div class={classes.setting}>
            <span class={classes.lineLabel}>Page Width:</span>

            <input
              type="range"
              aria-label="Page Width"
              value={toPercent(width(), 10, 100)}
              onInput={(event) => width.set(fromPercent(event, 10, 100))}
            />

            <span class={classes.lineValue}>{width().toFixed(2)}%</span>
          </div>

          <div class={classes.setting}>
            <span class={classes.lineLabel}>Paragraphs:</span>

            <label>
              <input
                type="radio"
                name="paragraph"
                checked={paragraph() === "space"}
                onChange={() => paragraph.set("space")}
              />{" "}
              double spaced
            </label>

            <label>
              <input
                type="radio"
                name="paragraph"
                checked={paragraph() === "indent"}
                onChange={() => paragraph.set("indent")}
              />{" "}
              indented
            </label>

            <label>
              <input
                type="radio"
                name="paragraph"
                checked={paragraph() === "both"}
                onChange={() => paragraph.set("both")}
              />{" "}
              both
            </label>
          </div>

          <div class={classes.setting}>
            <span class={classes.lineLabel}>Alignment</span>

            <label>
              <input
                type="checkbox"
                checked={textAlign() === "justify"}
                onChange={(event) => textAlign.set((event.target as HTMLInputElement).checked ? "justify" : "start")}
              />
              Justified
            </label>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn" onClick={() => isOpen.set(false)}>
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}

function toPercent(value: number, min = 0, max = 100) {
  return `${((value - min) / (max - min)) * 100}`;
}

function fromPercent(event: Event, min = 0, max = 100) {
  const value = (event.target as HTMLInputElement).value;
  return (+value * (max - min)) / 100 + min;
}

declare global {
  interface FontasticCookie {
    read_align: "start" | "justify";
    read_paragraph: "space" | "indent" | "both";
  }
}

if (process.env.MODE !== "test") {
  // added variables don't decode using {@link xcookie_read}, decode them manually
  try {
    const xc = getCookie("xcookie2");
    const data = JSON.parse(decodeURIComponent(xc as string));
    XCOOKIE.read_align = ["start", "justify"].includes(data.read_align) ? data.read_align : "justify";
    XCOOKIE.read_paragraph = ["space", "indent", "both"].includes(data.read_paragraph) ? data.read_paragraph : "space";
  } catch (e) {
    XCOOKIE.read_align = "justify";
    XCOOKIE.read_paragraph = "space";
  }
}
