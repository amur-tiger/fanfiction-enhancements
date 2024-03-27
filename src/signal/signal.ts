import { Scope } from "./scope";

export interface SignalEventMap<T = unknown> {
  change: ChangeEvent<T>;
}

export class ChangeEvent<T> extends Event {
  constructor(
    readonly oldValue: T,
    readonly newValue: T,
    readonly isInternal: boolean = false,
  ) {
    super("change");
  }
}

interface SignalSetterOptions {
  isInternal?: boolean;
}

export interface Signal<T> extends EventTarget {
  /**
   * Retrieves the current value.
   */
  (): T;

  /**
   * Sets a new value.
   * @param value
   * @param options
   */
  set(value: T, options?: SignalSetterOptions): void;

  /**
   * Sets a new value.
   * @param callback
   * @param options
   */
  set(callback: (previous: T) => T, options?: SignalSetterOptions): void;

  /**
   * Retrieves the current value without triggering re-renders.
   */
  peek(): T;

  addEventListener<K extends keyof SignalEventMap<T>>(
    event: K,
    callback: (event: SignalEventMap<T>[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  addEventListener(
    event: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: AddEventListenerOptions | boolean,
  ): void;
}

type SignalInit<T> = SyncSignalInit<T> | AsyncSignalInit<T>;
type SyncSignalInit<T> = T | (() => T);
type AsyncSignalInit<T> = PromiseLike<T>;

interface SignalOptions<T> {}

export function createSignal<T>(): Signal<T | undefined>;
export function createSignal<T>(value: SyncSignalInit<T>, options?: SignalOptions<T>): Signal<T>;
export function createSignal<T>(value: AsyncSignalInit<T>, options?: SignalOptions<T>): Signal<T | undefined>;

export function createSignal<T>(value?: SignalInit<T>, options?: SignalOptions<T>): Signal<T> {
  let currentValue: T;

  // Initializer value for this signal
  if (typeof value === "function") {
    const initResult = (value as Function)();
    if (isPromise(initResult)) {
      initResult.then((next) => {
        const oldValue = currentValue;
        currentValue = next as T;
        signal.dispatchEvent(new ChangeEvent(oldValue, currentValue, true));
      });
    } else {
      currentValue = initResult;
    }
  } else if (isPromise(value)) {
    value.then((next) => {
      const oldValue = currentValue;
      currentValue = next;
      signal.dispatchEvent(new ChangeEvent(oldValue, currentValue, true));
    });
  } else {
    currentValue = value as T;
  }

  const events = new EventTarget();
  const signal = Object.assign(
    function () {
      // Returns the current value. Registers the current scope, if any.
      Scope.getCurrent()?.register(signal);
      return currentValue;
    },
    {
      set(valueOrCallback: T | ((previous: T) => T), opt?) {
        const isInternal = !!opt?.isInternal;

        // Updates the current value. Re-renders any relevant render contexts.
        const oldValue = currentValue;
        if (typeof valueOrCallback === "function") {
          currentValue = (valueOrCallback as Function)(currentValue);
        } else {
          currentValue = valueOrCallback;
        }

        signal.dispatchEvent(new ChangeEvent(oldValue, currentValue, isInternal));
      },

      peek() {
        return currentValue;
      },

      addEventListener(
        event: string,
        callback: EventListenerOrEventListenerObject | null,
        options?: AddEventListenerOptions | boolean,
      ) {
        events.addEventListener(event, callback, options);
      },

      removeEventListener(
        type: string,
        callback: EventListenerOrEventListenerObject | null,
        options?: EventListenerOptions | boolean,
      ) {
        events.removeEventListener(type, callback, options);
      },

      dispatchEvent(event: Event): boolean {
        Object.defineProperty(event, "target", { value: signal });
        return events.dispatchEvent(event);
      },
    } satisfies Pick<Signal<T>, keyof Signal<T>>,
  );

  return signal;
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
