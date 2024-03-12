import RenderContext from "@jsx/RenderContext";

export type SignalType<T> = T extends Signal<infer U> ? U : never;

export interface Signal<T> {
  /**
   * Retrieves the current value.
   */
  (): T;

  /**
   * Sets a new value.
   * @param value
   */
  (value: T): void;

  /**
   * Sets a new value.
   * @param callback
   */
  (callback: (previous: T) => T): void;
}

const marker = Symbol("signal");

export function createSignal<T>(): Signal<T | undefined>;
export function createSignal<T>(value: T, onChange?: (value: T, oldValue: T) => void): Signal<T>;

export function createSignal<T>(value?: T, onChange?: (value: T, oldValue: T) => void): Signal<T> {
  let contexts: RenderContext[] = [];
  let currentValue = value;

  // @ts-ignore
  return Object.assign(
    function (...args: unknown[]) {
      if (args.length === 0) {
        // Returns the current value. Registers the current render context, if any.
        const context = RenderContext.findCurrent();
        if (context && !contexts.includes(context)) {
          contexts.push(context);
        }
        return currentValue;
      } else {
        // Updates the current value. Re-renders any relevant render contexts.
        const oldValue = currentValue;
        const [arg] = args;
        if (typeof arg === "function") {
          currentValue = arg(currentValue);
        } else {
          currentValue = arg as T;
        }

        onChange?.(currentValue as T, oldValue as T);

        // filter out child contexts of parent contexts that will be updated anyway
        const relevant: RenderContext[] = contexts.filter((context) => {
          let parent = context.parent;
          while (parent) {
            if (contexts.includes(parent)) {
              return false;
            }
            parent = parent.parent;
          }
          return true;
        });
        contexts = [];

        for (const c of relevant) {
          c.rerender();
        }
      }
    },
    {
      [marker]: true,
    },
  );
}

export function isSignal(value: unknown): value is Signal<unknown> {
  return value != null && typeof value === "function" && marker in value;
}
