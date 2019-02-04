import { Component } from "../enhance/component/Component";

interface ReactAttrs {
	[key: string]: any;
}

type ReactType<T extends Component> = string | (new (props: ReactAttrs) => T);

export class React {
	public static createElement<T extends Component>(
		tag: ReactType<T>,
		attrs: ReactAttrs,
		...children
	): HTMLElement {
		let element;
		if (typeof tag === "string") {
			element = document.createElement(tag);

			for (const name in attrs) {
				if (!attrs.hasOwnProperty(name)) {
					continue;
				}

				const value = attrs[name];
				if (typeof value === "function") {
					element[name] = value;
				} else if (value === true) {
					element.setAttribute(name, name);
				} else if (value !== false && value != undefined) {
					element.setAttribute(name, value.toString());
				}
			}
		} else {
			const component = new tag(attrs);
			element = component.render();
		}

		for (const child of children) {
			if (!child) {
				continue;
			}

			element.appendChild(child.nodeType == undefined ? document.createTextNode(child.toString()) : child);
		}

		return element;
	}
}
