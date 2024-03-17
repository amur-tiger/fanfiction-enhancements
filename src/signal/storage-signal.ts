import { onDispose } from "./context";
import { createSignal, type Signal } from "./signal";
import createLock from "./lock";

export default function createStorageSignal(key: string): Signal<string | null> {
  const locked = createLock();

  const signal = createSignal(localStorage.getItem(key), (value) =>
    locked(() => {
      if (value == null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    }),
  );

  const storageHandler = (event: StorageEvent) => {
    if (event.key === key) {
      locked(() => signal(event.newValue));
    }
  };

  window.addEventListener("storage", storageHandler);
  onDispose(() => window.removeEventListener("storage", storageHandler));

  return signal;
}
