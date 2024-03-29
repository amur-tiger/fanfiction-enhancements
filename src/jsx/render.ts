import scoped from "../signal/scope";

export default function render<T extends ChildNode>(render: () => T): T {
  let element = scoped(render, (next) => {
    element.replaceWith(next);
    element = next;
  });
  return element;
}
