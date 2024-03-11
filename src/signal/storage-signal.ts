import RenderContext from "@jsx/RenderContext";
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

  const context = RenderContext.findCurrent();
  if (context) {
    context.onDispose(() => window.removeEventListener("storage", storageHandler));
  }

  return signal;
}
