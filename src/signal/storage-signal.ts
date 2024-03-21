import { createSignal, type Signal } from "./signal";

export default function createStorageSignal<T>(key: string): Signal<T | undefined> {
  return createSignal(
    () => {
      const item = localStorage.getItem(key);
      if (!item) {
        return;
      }
      try {
        return JSON.parse(item) as T;
      } catch (e) {
        console.warn("Cannot parse %o as JSON", item);
      }
    },
    {
      saveChange(value) {
        if (value == null) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(value));
        }
        window.dispatchEvent(
          new StorageEvent("storage", {
            key,
            newValue: value == null ? undefined : JSON.stringify(value),
          }),
        );
      },

      handleExternalChange({ set }) {
        const storageHandler = (event: StorageEvent) => {
          if (event.key !== key) {
            return;
          }

          if (event.newValue) {
            try {
              set(JSON.parse(event.newValue));
            } catch (e) {
              console.warn("Cannot parse %o as JSON", event.newValue);
              set(undefined);
            }
          } else {
            set(undefined);
          }
        };

        window.addEventListener("storage", storageHandler);
        return () => window.removeEventListener("storage", storageHandler);
      },
    },
  );
}
