import { type Context, getContext, onDispose } from "./context";

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

export type SignalType<T> = T extends Signal<infer U> ? U : never;

type SignalInit<T> = SyncSignalInit<T> | AsyncSignalInit<T>;
type SyncSignalInit<T> = T | (() => T);
type AsyncSignalInit<T> = PromiseLike<T> | (() => PromiseLike<T>);

interface SignalOptions<T> {
  saveChange?: (value: T) => void;
  handleExternalChange?: (context: { set(value: T): void }) => void | (() => void);
}

const marker = Symbol("signal");

export function createSignal<T>(): Signal<T | undefined>;
export function createSignal<T>(value: SyncSignalInit<T>, options?: SignalOptions<T>): Signal<T>;
export function createSignal<T>(value: AsyncSignalInit<T>, options?: SignalOptions<T>): Signal<T | undefined>;

export function createSignal<T>(value?: SignalInit<T>, options?: SignalOptions<T>): Signal<T> {
  const contexts: Context[] = [];
  let currentValue: T;
  let isInternalChange = false;
  let hasListener = false;

  // Handler to notify contexts of changes to this signal value.
  const notifyContexts = () => {
    const relevant = contexts.filter((context) => {
      let parent = context.parent;
      while (parent) {
        if (contexts.includes(parent)) {
          return false;
        }
        parent = parent.parent;
      }
      return true;
    });
    contexts.splice(0);
    hasListener = false;
    relevant.forEach((c) => c.run());
  };

  // Initializer value for this signal
  if (typeof value === "function") {
    const initResult = (value as Function)();
    if (isPromise(initResult)) {
      initResult.then((next) => {
        currentValue = next as T;
        notifyContexts();
      });
    } else {
      currentValue = initResult;
    }
  } else if (isPromise(value)) {
    value.then((next) => {
      currentValue = next;
      notifyContexts();
    });
  } else {
    currentValue = value as T;
  }

  // @ts-ignore
  return Object.assign(
    function () {
      if (!hasListener && options?.handleExternalChange != null) {
        const cleanup = options.handleExternalChange({
          set(next: T) {
            if (!isInternalChange) {
              currentValue = next;
              notifyContexts();
            }
          },
        });
        if (typeof cleanup === "function") {
          onDispose(cleanup);
        }
      }

      // Returns the current value. Registers the current render context, if any.
      const context = getContext();
      if (context && !contexts.includes(context)) {
        contexts.push(context);
      }

      hasListener = true;
      return currentValue;
    },
    {
      [marker]: true,

      set: (valueOrCallback: T | ((previous: T) => T)) => {
        // Updates the current value. Re-renders any relevant render contexts.
        if (typeof valueOrCallback === "function") {
          currentValue = (valueOrCallback as Function)(currentValue);
        } else {
          currentValue = valueOrCallback;
        }

        isInternalChange = true;
        try {
          options?.saveChange?.(currentValue);
        } finally {
          isInternalChange = false;
        }

        notifyContexts();
      },

      peek: () => currentValue,
    },
  );
}

export function isPromise(value: unknown): value is PromiseLike<unknown> {
  return value != null && typeof value === "object" && "then" in value && typeof value.then === "function";
}

export function isSignal(value: unknown): value is Signal<unknown> {
  return value != null && typeof value === "function" && marker in value;
}
