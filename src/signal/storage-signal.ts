import { getContext } from "@jsx/context";
import { createSignal, type Signal } from "./signal";

export default function createStorageSignal(key: string): Signal<string | null> {
  let isLocalChange = false;

  const signal = createSignal(localStorage.getItem(key), (value) => {
    try {
      isLocalChange = true;
      if (value == null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } finally {
      isLocalChange = false;
    }
  });

  const storageHandler = (event: StorageEvent) => {
    if (event.key === key && !isLocalChange) {
      signal(event.newValue);
    }
  };
  window.addEventListener("storage", storageHandler);

  getContext()?.onDispose(() => window.removeEventListener("storage", storageHandler));

  return signal;
}
