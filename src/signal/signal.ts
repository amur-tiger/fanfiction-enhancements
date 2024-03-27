import { Scope } from "./scope";

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

export interface SignalEx<T> extends Signal<T> {
  set(value: T, options?: { silent?: boolean }): void;

  set(callback: (previous: T) => T, options?: { silent?: boolean }): void;
}

type SignalInit<T> = SyncSignalInit<T> | AsyncSignalInit<T>;
type SyncSignalInit<T> = T | (() => T);
type AsyncSignalInit<T> = PromiseLike<T>;

interface SignalOptions<T> {
  onChange?: (value: T) => void;
}

export function createSignal<T>(): Signal<T | undefined>;
export function createSignal<T>(value: SyncSignalInit<T>, options?: SignalOptions<T>): Signal<T>;
export function createSignal<T>(value: AsyncSignalInit<T>, options?: SignalOptions<T>): Signal<T | undefined>;

export function createSignal<T>(value?: SignalInit<T>, options?: SignalOptions<T>): Signal<T> {
  const scopes: Scope[] = [];
  let currentValue: T;

  // Handler to notify scopes of changes to this signal value.
  const notifyScopes = () => scopes.splice(0).forEach((s) => s.notify());

  // Initializer value for this signal
  if (typeof value === "function") {
    const initResult = (value as Function)();
    if (isPromise(initResult)) {
      initResult.then((next) => {
        currentValue = next as T;
        notifyScopes();
      });
    } else {
      currentValue = initResult;
    }
  } else if (isPromise(value)) {
    value.then((next) => {
      currentValue = next;
      notifyScopes();
    });
  } else {
    currentValue = value as T;
  }

  // @ts-ignore
  return Object.assign(
    function () {
      // Returns the current value. Registers the current scope, if any.
      const scope = Scope.getCurrent();
      if (scope) {
        scopes.push(scope);
      }
      return currentValue;
    },
    {
      set(valueOrCallback: T | ((previous: T) => T), opt?: { silent?: boolean }) {
        const silent = opt?.silent;

        // Updates the current value. Re-renders any relevant render contexts.
        if (typeof valueOrCallback === "function") {
          currentValue = (valueOrCallback as Function)(currentValue);
        } else {
          currentValue = valueOrCallback;
        }

        if (!silent) {
          options?.onChange?.(currentValue);
        }

        notifyScopes();
      },

      peek() {
        return currentValue;
      },
    } satisfies Pick<SignalEx<T>, keyof SignalEx<T>>,
  );
}

export function isPromise(value: unknown): value is PromiseLike<unknown> {
  return value != null && typeof value === "object" && "then" in value && typeof value.then === "function";
}

export function isSignal(value: unknown): value is Signal<unknown> {
  return (
    value != null &&
    typeof value === "function" &&
    "set" in value &&
    typeof value.set === "function" &&
    "peek" in value &&
    typeof value.peek === "function"
  );
}
