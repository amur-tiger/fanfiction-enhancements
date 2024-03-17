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
   * Re-runs the context.
   */
  run(): void;
}

const stack: Context[] = [];

/**
 *
 * @param callback
 * @param onChange
 */
export default function context<T>(callback: () => T, onChange?: (next: T) => void): T {
  const children: Context[] = [];
  const disposeFns: (() => void)[] = [];

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
    run: () => {
      dispose();
      const next = run();
      onChange?.(next);
    },
  };

  const run = () => {
    try {
      stack.push(current);
      return callback();
    } finally {
      stack.pop();
    }
  };

  return run();
}

export function getContext(): Context | undefined {
  return stack[stack.length - 1];
}

export function onDispose(dispose: () => void) {
  if (stack.length > 0) {
    stack[stack.length - 1].onDispose(dispose);
  }
}
