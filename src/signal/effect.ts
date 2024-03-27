import scoped, { onDispose } from "./scope";
import { type Signal, type SignalEventMap } from "./signal";

export default function effect(callback: () => void | (() => void)) {
  scoped(() => {
    const cleanup = callback();
    if (typeof cleanup === "function") {
      onDispose(cleanup);
    }
  });
}

export function listen<K extends keyof WindowEventMap>(
  object: Window,
  event: K,
  handler: (event: WindowEventMap[K]) => void,
): void;
export function listen<K extends keyof HTMLElementEventMap>(
  object: HTMLElement,
  event: K,
  handler: (event: HTMLElementEventMap[K]) => void,
): void;
export function listen<T, K extends keyof SignalEventMap<T>>(
  object: Signal<T>,
  event: K,
  handler: (event: SignalEventMap<T>[K]) => void,
): void;
export function listen<E extends Event>(object: EventTarget, event: string, handler: (event: E) => void): void;
export function listen(object: EventTarget, event: string, handler: (event: Event) => void): void;

export function listen(object: EventTarget, event: string, handler: (event: Event) => void): void {
  scoped(() => {
    object.addEventListener(event, handler);
    onDispose(() => object.removeEventListener(event, handler));
  });
}
