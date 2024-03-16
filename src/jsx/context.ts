export interface Context {
  readonly parent: Context | undefined;

  /**
   * Registers function to dispose of resources.
   * @param dispose
   */
  onDispose(dispose: () => void): void;

  /**
   * Releases all event handlers and other resources.
   */
  dispose(): void;

  /**
   * Re-renders the context and replaces the current element.
   */
  render(): void;
}

const stack: Context[] = [];

/**
 *
 * @param render
 */
export default function context<T extends Element>(render: () => T): T {
  const children: Context[] = [];
  const disposeFns: (() => void)[] = [];
  let element: T;

  const dispose = () => {
    disposeFns.splice(0).forEach((fn) => fn());
    children.splice(0).forEach((child) => {
      child.dispose();
      (child as { parent: undefined }).parent = undefined;
    });
  };

  const current: Context = {
    parent: getContext(),
    onDispose: (disposeFn) => disposeFns.push(disposeFn),
    dispose,
    render: () => {
      dispose();
      const next = doRender();
      element.replaceWith(next);
      element = next;
    },
  };

  const doRender = () => {
    try {
      stack.push(current);
      return render();
    } finally {
      stack.pop();
    }
  };

  element = doRender();

  return element;
}

export function getContext(): Context | undefined {
  return stack[stack.length - 1];
}
