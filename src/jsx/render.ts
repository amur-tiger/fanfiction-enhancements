import context from "../signal/context";

export default function render<T extends ChildNode>(render: () => T): T {
  let element = context(render, (next) => {
    console.log("replacing %o", element);
    element.replaceWith(next);
    element = next;
  });
  return element;
}
