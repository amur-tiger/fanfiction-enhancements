import { ChangeEvent, type Signal } from "./signal";
import { Scope } from "./scope";
import { listen } from "./effect";

interface ViewOptions<T, R> {
  get(value: T): R;

  set(previous: T, value: R): T;

  equals?: (previous: R, next: R) => boolean;
}

function view<T, K extends keyof T>(
  signal: Signal<T>,
  key: K,
  equals?: (previous: T[K], next: T[K]) => boolean,
): Signal<T[K]>;
function view<T, R>(signal: Signal<T>, options: ViewOptions<T, R>): Signal<R>;

function view<T, R>(
  signal: Signal<T>,
  keyOrOptions: keyof T | ViewOptions<T, R>,
  maybeEquals?: (previous: R, next: R) => boolean,
): Signal<R> {
  const { get, set } =
    typeof keyOrOptions === "object"
      ? keyOrOptions
      : {
          get: (value: T) => value[keyOrOptions] as R,
          set: (previous: T, value: R) => ({ ...previous, [keyOrOptions]: value }),
        };
  const equals = (typeof keyOrOptions === "object" ? keyOrOptions.equals : maybeEquals) ?? ((a: R, b: R) => a === b);

  const events = new EventTarget();

  listen(signal, "change", (event) => {
    const oldValue = get(event.oldValue);
    const newValue = get(event.newValue);

    if (!equals(oldValue, newValue)) {
      events.dispatchEvent(new ChangeEvent(oldValue, newValue, event.isInternal));
    }
  });

  const viewed = Object.assign(
    function () {
      Scope.getCurrent()?.register(viewed);
      return get(signal.peek());
    },
    {
      set: (valueOrCallback, options) => {
        signal.set(
          (previous) =>
            set!(
              previous,
              typeof valueOrCallback === "function" ? (valueOrCallback as Function)(get(previous)) : valueOrCallback,
            ),
          options,
        );
      },

      peek: () => get(signal.peek()),

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
        Object.defineProperty(event, "target", { value: viewed });
        return events.dispatchEvent(event);
      },
    } satisfies Pick<Signal<R>, keyof Signal<R>>,
  );

  return viewed;
}

export default view;
