import { React } from "../../../util/react";
import { Component } from "../Component";
import { SmartValue } from "../../../api/SmartValue";

import "./CheckBox.css";

export class CheckBox implements Component {
	constructor(private props: { bind: SmartValue<boolean> }) {
	}

	public render(): HTMLElement {
		const id = "ffe-check-" + parseInt(Math.random() * 100000000 + "", 10);

		const element: HTMLElement = <span class="ffe-checkbox">
			<input type="checkbox" id={id}/>
			<label for={id}/>
		</span>;

		const apply = value => {
			(element.firstElementChild as HTMLInputElement).checked = value;
		};

		this.props.bind.subscribe(apply);
		this.props.bind.get().then(apply);
		element.firstElementChild.addEventListener("change", async () => {
			await this.props.bind.set((element.firstElementChild as HTMLInputElement).checked);
		});

		return element;
	}
}
