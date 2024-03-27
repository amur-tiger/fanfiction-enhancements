import type { Signal } from "./signal";

function view<T, K extends keyof T>(signal: Signal<T>, key: K): Signal<T[K]>;
function view<T, R>(signal: Signal<T>, get: (value: T) => R, set: (previous: T, value: R) => T): Signal<R>;

function view<T, R>(
  signal: Signal<T>,
  keyOrGet: keyof T | ((value: T) => R),
  set?: (previous: T, value: R) => T,
): Signal<R> {
  const get = typeof keyOrGet === "function" ? keyOrGet : (value: T) => value[keyOrGet];
  if (typeof keyOrGet !== "function") {
    set = (previous, value) => ({ ...previous, [keyOrGet]: value });
  }

  return Object.assign(
    function () {
      return get(signal());
    },
    {
      set: ((valueOrCallback, options) => {
        signal.set(
          (previous) =>
            set!(
              previous,
              typeof valueOrCallback === "function" ? (valueOrCallback as Function)(get(previous)) : valueOrCallback,
            ),
          options,
        );
      }) as Signal<R>["set"],

      peek: () => get(signal.peek()),
    },
  ) as Signal<R>;
}

export default view;
