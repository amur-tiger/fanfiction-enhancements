//
//
// function nullUpdater(value) {
// 	return value;
// }
//
// function checkedUpdater(value) {
// 	this.element.checked = value;
// }
//
// function valueUpdater(value) {
// 	this.element.value = value;
// }
//
// function contentUpdater(value) {
// 	this.element.textContent = value;
// }
// private element: HTMLElement = undefined;
// private update = nullUpdater;
//
// public async attach(element?: HTMLElement): Promise<boolean> {
// 	if (this.element) {
// 	throw new Error("This value is already attached and must first be detached before reattaching.");
// }
//
// const elements = (element || document).querySelectorAll("[data-bind]");
// this.element = Array.from(elements)
// 	.find(e => e.getAttribute("data-bind") === this.name) as HTMLElement;
// if (!this.element) {
// 	return false;
// }
//
// if (this.element instanceof HTMLInputElement) {
// 	if (this.element.type === "checkbox") {
// 		this.update = checkedUpdater;
// 	} else {
// 		this.update = valueUpdater;
// 	}
// } else {
// 	this.update = contentUpdater;
// }
//
// const value = await GM.getValue(this.name);
// this.update(value);
//
// if (this.element instanceof HTMLInputElement) {
// 	this.element.addEventListener("change", this);
// }
//
// return true;
// }
//
// public detach(): void {
// 	this.update = nullUpdater;
// this.element.removeEventListener("change", this);
// this.element = undefined;
// }
//
// public handleEvent(event): Promise<void> {
// 	if (event.type !== "change") {
// 	return;
// }
//
// const inputElement = this.element as HTMLInputElement;
//
// return GM.setValue(this.name, inputElement.type === "checkbox" ? inputElement.checked : inputElement.value);
// }
