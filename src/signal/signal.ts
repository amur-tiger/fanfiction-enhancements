import { type Context, getContext } from "./context";

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
  set(value: T): void;

  /**
   * Sets a new value.
   * @param callback
   */
  set(callback: (previous: T) => T): void;

  /**
   * Retrieves the current value without triggering re-renders.
   */
  peek(): T;
}

const marker = Symbol("signal");

export function createSignal<T>(): Signal<T | undefined>;
export function createSignal<T>(value: T): Signal<T>;
export function createSignal<T>(value: T, onChange: (value: T, oldValue: T) => void): Signal<T>;

export function createSignal<T>(value?: T, onChange?: (value: T, oldValue: T) => void): Signal<T> {
  let contexts: Context[] = [];
  let currentValue = value as T;

  // @ts-ignore
  return Object.assign(
    function () {
      // Returns the current value. Registers the current render context, if any.
      const context = getContext();
      if (context && !contexts.includes(context)) {
        contexts.push(context);
      }
      return currentValue;
    },
    {
      [marker]: true,

      set: (valueOrCallback: T | ((previous: T) => T)) => {
        // Updates the current value. Re-renders any relevant render contexts.
        const oldValue = currentValue;
        if (typeof valueOrCallback === "function") {
          currentValue = (valueOrCallback as Function)(currentValue);
        } else {
          currentValue = valueOrCallback;
        }
        onChange?.(currentValue, oldValue);

        // filter out child contexts of parent contexts that will be updated anyway
        const relevant: Context[] = contexts.filter((context) => {
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
          c.run();
        }
      },

      peek: () => currentValue,
    },
  );
}

export function isSignal(value: unknown): value is Signal<unknown> {
  return value != null && typeof value === "function" && marker in value;
}
