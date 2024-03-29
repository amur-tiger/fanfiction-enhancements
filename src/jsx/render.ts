import scoped from "../signal/scope";
import { Fragment } from "./jsx-runtime";

// function render<T extends ChildNode>(render: () => JSX.Children): T;
// function render<T extends ChildNode>(render: () => JSX.Children | string | number): T | Text;

function render(render: () => JSX.Children): JSX.Element {
  let element = scoped(
    () =>
      Fragment({
        children: render(),
      }),
    (next) => {
      Fragment.replace(element, next);
      element = next;
    },
  );

  return element;
}

export default render;
export { default as compute } from "../signal/compute";
