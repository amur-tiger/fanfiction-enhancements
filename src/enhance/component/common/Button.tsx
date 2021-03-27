import React from "../../../util/react";
import Component from "../Component";
import { SmartValue } from "../../../api/SmartValue";

export default class Button implements Component {
  constructor(
    private props: {
      class?: string;
      text?: string;
      active?: boolean;
      click?: EventListenerOrEventListenerObject;
      bind?: SmartValue<boolean>;
    }
  ) {}

  public render(): HTMLElement {
    const element: HTMLElement = <span class={`btn ${this.props.class}`}>{this.props.text}</span>;

    if (this.props.click) {
      element.addEventListener("click", this.props.click);
    }

    if (this.props.active) {
      element.classList.add("ffe-active");
    }

    if (this.props.bind) {
      this.props.bind.subscribe((active) => element.classList.toggle("ffe-active", active));
      this.props.bind.get().then((active) => element.classList.toggle("ffe-active", active));
      element.addEventListener("click", async () => {
        await this.props.bind?.set(!element.classList.contains("ffe-active"));
      });
    }

    return element;
  }
}
