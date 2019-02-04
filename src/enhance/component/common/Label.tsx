import { React } from "../../../util/react";
import { Component } from "../Component";
import { SmartValue } from "../../../api/SmartValue";

export class Label implements Component {
	constructor(private props: { bind: SmartValue<string | number> }) {
	}

	public render(): HTMLElement {
		const element: HTMLElement = <span class="ffe-label"/>;
		const apply = value => {
			if (typeof value === "number") {
				element.textContent = value.toLocaleString("en");
			} else {
				element.textContent = value;
			}
		};

		this.props.bind.get().then(apply);
		this.props.bind.subscribe(apply);

		return element;
	}
}
