import { createSignal, type ReadonlySignal } from "./signal";
import scoped from "./scope";

export default function compute<T>(callback: () => T): ReadonlySignal<T> {
  const initial: T = scoped(callback, (next) => signal.set(next));
  const signal = createSignal(initial);
  return signal;
}
